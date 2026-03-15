import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from pymongo import MongoClient
import time
import random

# Configuration
BASE_URL = "https://www.ville-ideale.fr/"
SEARCH_URL = urljoin(BASE_URL, "scripts/cherche.php")
# Regex corrigée pour les codes INSEE (2 à 5 chiffres)
CITY_HREF_RE = re.compile(r"^/[^/]+_(\d{2,5})$")

# Connexion MongoDB
client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['ville_ideale']
collection = db['villes']

def fetch_and_save_villes(dept_code):
    session = requests.Session()
    import random

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ]

    # Dans ta requête :
    headers = {"User-Agent": random.choice(USER_AGENTS), "X-Requested-With": "XMLHttpRequest", "Referer": urljoin(BASE_URL, "villespardepts.php")}
    

    try:
        # 1. Initialiser la session
        session.get(urljoin(BASE_URL, "villespardepts.php"), timeout=10)
        
        # 2. Requête POST pour le département
        response = session.post(SEARCH_URL, data={"dept": dept_code}, headers=headers)
        
        if response.status_code == 200 and len(response.text) > 0:
            soup = BeautifulSoup(response.text, "html.parser")
            villes_trouvees = 0

            for a in soup.select("a[href]"):
                href = a["href"].strip()
                match = CITY_HREF_RE.match(href)
                
                if match:
                    nom = a.get_text(" ", strip=True).replace('\x2011', '-')
                    insee = match.group(1)
                    
                    # 3. Upsert dans MongoDB (Evite les doublons)
                    collection.update_one(
                        {"code_insee": insee},
                        {"$set": {
                            "nom": nom,
                            "url": urljoin(BASE_URL, href),
                            "departement_code": dept_code,
                            "scraped_at": time.strftime("%Y-%m-%d")
                        }},
                        upsert=True
                    )
                    villes_trouvees += 1
            
            print(f"✅ Dept {dept_code} : {villes_trouvees} villes enregistrées.")
        else:
            print(f"⚠️ Dept {dept_code} : Réponse vide ou erreur {response.status_code}")

    except Exception as e:
        print(f"❌ Erreur sur le dept {dept_code}: {e}")

if __name__ == "__main__":
    departements = [str(i).zfill(2) for i in range(1, 96)]
    
    for i, d in enumerate(departements):
        # Toutes les 10 requêtes, on fait une pause plus longue
        if i > 0 and i % 10 == 0:
            print("--- Pause de 10 secondes pour laisser souffler le serveur ---")
            time.sleep(random.uniform(10, 15)) # Attend entre 10 et 15 secondes
            
        fetch_and_save_villes(d)
        
        # On utilise un délai aléatoire entre 2 et 4 secondes
        wait_time = random.uniform(2, 4)
        time.sleep(wait_time)