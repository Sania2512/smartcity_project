from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
import time
import random
from pymongo import MongoClient
import os

# Define URL constants
VILLES_PAR_DEPTS_ENDPOINT = "villespardepts.php"
VILLES_ENDPOINT = "villes.php"
BASE_URL = "https://www.ville-ideale.fr/"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Security: Use environment variables instead of hardcoded credentials
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
if not MONGO_USER or not MONGO_PASSWORD:
    raise ValueError('MONGO_USER and MONGO_PASSWORD environment variables must be set')
MONGO_URL = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@mongodb:27017/" 

def get_db():
    client = MongoClient(MONGO_URL)
    return client['ville_ideale']

# --- FONCTIONS DE SCRAPING ---

def task_get_departments():
    """Étape 1 : Récupérer la liste des départements (Version Blindée)"""
    db = get_db()
    collection = db['departements']
    
    # Nouveaux headers beaucoup plus réalistes
    chrome_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    }

    session = requests.Session()
    # On tape d'abord la racine du site pour avoir un cookie "propre"
    session.get(BASE_URL, headers=chrome_headers, timeout=10)
    
    # Maintenant on va chercher les départements
    start_url = urljoin(BASE_URL, VILLES_PAR_DEPTS_ENDPOINT)
    response = session.get(start_url, headers=chrome_headers, timeout=30)
    
    # DEBUG : Si c'est vide, on essaie une autre page du site qui contient aussi les depts
    if "01" not in response.text:
        print("Page principale vide, tentative de secours...")
        response = session.get(BASE_URL, headers=chrome_headers, timeout=10)

    soup = BeautifulSoup(response.text, "html.parser")
    depts = []
    
    # On cherche tous les liens du site, on trie après
    for link in soup.find_all("a", href=True):
        label = link.get_text(" ", strip=True)
        # On cherche le code (ex: 01, 2A) n'importe où dans le texte du lien
        match = re.search(r"(\d{2,3}|2A|2B)", label)
        
        if match and "villes.php" in link['href']:
            code = match.group(1)
            depts.append({
                "code": code, 
                "label": label, 
                "url": urljoin(BASE_URL, link["href"])
            })

    # On enlève les doublons si on en a trouvé trop
    unique_depts = {d['code']: d for d in depts}.values()
    final_list = list(unique_depts)

    print(f"--- BILAN : {len(final_list)} départements extraits ---")

    if final_list:
        collection.drop()
        collection.insert_many(final_list)
        return [d['code'] for d in final_list]
    
    # No fallback - let exception be caught by DAG error handling
    raise ValueError("Failed to extract departments from website - possible site blocking")

def task_get_villes_list():
    """Étape 2 : Récupérer les villes (avec simulation si blocage)"""
    db = get_db()
    depts = list(db['departements'].find())
    villes_collection = db['villes']
    search_url = urljoin(BASE_URL, "scripts/cherche.php")
    city_href_re = re.compile(r"_([0-9AB]{4,5})$", re.IGNORECASE)
    
    session = requests.Session()
    session.get(urljoin(BASE_URL, "villespardepts.php"), timeout=10)
    
    headers_ajax = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": urljoin(BASE_URL, "villespardepts.php")
    }

    villes_trouvees_total = 0

    for d in depts:
        try:
            resp = session.post(search_url, data={"dept": d['code']}, headers=headers_ajax)
            
            # SI LE SITE NOUS BLOQUE (Réponse vide ou erreur)
            #if resp.status_code != 200 or len(resp.text) < 10:
            #    if d['code'] == "01":
            #        print("Blocage détecté sur le Dept 01. Injection de données de test pour débloquer le projet !")
            #        villes_test = [
            #            {"nom": "Bourg-en-Bresse", "url": "https://www.ville-ideale.fr/bourg-en-bresse_01053", "insee": "01053"},
            #            {"nom": "Oyonnax", "url": "https://www.ville-ideale.fr/oyonnax_01283", "insee": "01283"}
            #        ]
            #        for v in villes_test:
            #            villes_collection.update_one(
            #                {"code_insee": v['insee']},
            #                {"$set": {"nom": v['nom'], "url": v['url'], "dept": "01"}},
            #                upsert=True
            #            )
            #            villes_trouvees_total += 1
            #    continue

            # SI LE SITE RÉPOND NORMALEMENT
            soup = BeautifulSoup(resp.text, "html.parser")
            for a in soup.select("a[href]"):
                href = a["href"].strip()
                match = city_href_re.search(href)
                if match:
                    villes_collection.update_one(
                        {"code_insee": match.group(1)},
                        {"$set": {
                            "nom": a.get_text(" ", strip=True).replace('\x2011', '-'),
                            "url": urljoin(BASE_URL, href),
                            "dept": d['code']
                        }},
                        upsert=True
                    )
                    villes_trouvees_total += 1
            time.sleep(random.uniform(3, 6))
        except Exception as e:
            print(f"Erreur Dept {d['code']}: {e}")
            
    print(f"Bilan de l'étape 2 : {villes_trouvees_total} villes ajoutées/mises à jour dans MongoDB.")

def task_get_villes_details():
    """Étape 3 : Scraper les notes détaillées pour chaque ville"""
    db = get_db()
    collection = db['villes']
    # On traite les villes qui n'ont pas encore de notes
    villes = list(collection.find({"notes_globales": {"$exists": False}}).limit(100)) # Limite par run
    
    categories = {
        'environnement': '#ng_env', 'transports': '#ng_tra', 'securite': '#ng_sec',
        'sante': '#ng_san', 'sports_loisirs': '#ng_spo', 'culture': '#ng_cul',
        'enseignement': '#ng_ens', 'commerces': '#ng_com', 'qualite_de_vie': '#ng_qdv'
    }

    for ville in villes:
        try:
            r = requests.get(ville['url'], headers=HEADERS, timeout=10)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                notes = {}
                for cat, selector in categories.items():
                    elem = soup.select_one(selector)
                    notes[cat] = float(elem.get_text(strip=True).replace(',', '.')) if elem else None
                
                collection.update_one(
                    {'_id': ville['_id']},
                    {'$set': {'notes_globales': notes, 'last_updated': datetime.now()}}
                )
            time.sleep(random.uniform(3, 6))
        except Exception as e:
            print(f"Erreur {ville['nom']}: {e}")

# --- DEFINITION DU DAG ---

with DAG(
    dag_id='pipeline_ville_ideale_complet',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False
) as dag:

    step1 = PythonOperator(task_id='recuperer_departements', python_callable=task_get_departments)
    step2 = PythonOperator(task_id='recuperer_liste_villes', python_callable=task_get_villes_list)
    step3 = PythonOperator(task_id='recuperer_details_notes', python_callable=task_get_villes_details)

    step1 >> step2 >> step3