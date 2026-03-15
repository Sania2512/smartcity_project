from random import random

import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import time
import sys

# 1. Connexion MongoDB
client = MongoClient('mongodb://127.0.0.1:27017/', serverSelectionTimeoutMS=2000)
db = client['ville_ideale']
collection = db['villes']

# 2. Configuration Session (pour éviter d'être banni)
session = requests.Session()

USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ]

    # Dans ta requête :
HEADERS = {"User-Agent": random.choice(USER_AGENTS)}

def get_city_stats(url):
    """Extrait les notes globales d'une page ville"""
    try:
        r = session.get(url, headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return None
        
        soup = BeautifulSoup(r.text, 'html.parser')
        
        # Mapping des IDs du site vers tes noms de champs
        categories = {
            'environnement': '#ng_env', 'transports': '#ng_tra', 
            'securite': '#ng_sec', 'sante': '#ng_san',
            'sports_loisirs': '#ng_spo', 'culture': '#ng_cul',
            'enseignement': '#ng_ens', 'commerces': '#ng_com',
            'qualite_de_vie': '#ng_qdv'
        }
        
        notes = {}
        for cat, selector in categories.items():
            elem = soup.select_one(selector)
            if elem:
                # On remplace la virgule par un point pour le format float
                val = elem.get_text(strip=True).replace(',', '.')
                notes[cat] = float(val)
            else:
                notes[cat] = None
                
        return notes
    except Exception as e:
        print(f"Erreur sur {url}: {e}")
        return None

# --- LE MAIN (La boucle d'exécution) ---
if __name__ == "__main__":
    # On vérifie si MongoDB est vivant
    try:
        client.admin.command('ping')
    except:
        print("Erreur : MongoDB n'est pas lancé !")
        sys.exit(1)

    # On cherche les villes qui n'ont pas encore de notes
    query = {"notes_globales": {"$exists": False}}
    villes_a_traiter = list(collection.find(query))
    
    print(f"🚀 Début du scraping : {len(villes_a_traiter)} villes à traiter.")

    for ville in villes_a_traiter:
        print(f"Analyse de : {ville['nom']} ({ville['code_insee']})...", end="\r")
        
        notes = get_city_stats(ville['url'])
        
    
        # VERIFICATION : On n'enregistre que si on a au moins une note non-nulle
        if notes and any(v is not None for v in notes.values()):
            collection.update_one(
                {'_id': ville['_id']},
                {'$set': {
                    'notes_globales': notes,
                    'details_scraped': True,
                    'last_updated': time.strftime("%Y-%m-%d %H:%M:%S")
                }}
            )
        else:
            print(f"⚠️ Alerte : Page vide ou bloquée pour {ville['nom']}. On passe.")
            # Optionnel : si on détecte trop d'échecs de suite, on arrête tout
            # sys.exit(1)
            print(f"\n⚠️ Impossible de récupérer les notes pour {ville['nom']}")

    print("\n✅ Scraping des détails terminé !")