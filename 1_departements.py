# ===============================
# IMPORTS
# ===============================

# requests : permet de télécharger la page web
import requests

# BeautifulSoup : permet de lire et analyser le HTML
from bs4 import BeautifulSoup

# urljoin : permet de transformer un lien relatif en lien complet
# ex : "/dept.php?id=01" -> "https://www.ville-ideale.fr/dept.php?id=01"
from urllib.parse import urljoin

# re : permet d'utiliser les expressions régulières
# ici pour reconnaître le format "01-Ain", "2A-Corse-du-Sud", etc.
import re

# Ajout pour MongoDB
from pymongo import MongoClient


# ===============================
# CONFIGURATION
# ===============================

# URL de base du site
BASE_URL = "https://www.ville-ideale.fr/"

# Page contenant la liste des départements
START_URL = urljoin(BASE_URL, "villespardepts.php")

# Headers pour simuler un vrai navigateur (évite blocage)
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

# Connexion MongoDB
client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['ville_ideale']
collection_depts = db['departements']


# ===============================
# REGEX POUR RECONNAÎTRE UN DEPARTEMENT
# ===============================

"""
Cette regex reconnaît :

01-Ain
02-Aisne
2A-Corse-du-Sud
971-Guadeloupe

"""
import re

# Tirets possibles : -  -  –  —
HYPHENS = r"[-\u2011\u2013\u2014]"

DEPARTMENT_REGEX = re.compile(
    rf"^(?:\d{{2}}|2A|2B|97\d|98\d)\s*{HYPHENS}\s*"
)


# ===============================
# FONCTION PRINCIPALE
# ===============================

def get_departements():
    """
    Cette fonction :

    1. Télécharge la page
    2. Analyse le HTML
    3. Trouve les liens des départements
    4. Retourne une liste propre
    """

    # ---------------------------
    # Télécharger la page
    # ---------------------------

    response = requests.get(

        START_URL,
        headers=HEADERS,
        timeout=30

    )

    # Vérifie qu'il n'y a pas d'erreur HTTP
    response.raise_for_status()


    # ---------------------------
    # Convertir le HTML en objet BeautifulSoup
    # ---------------------------

    soup = BeautifulSoup(response.text, "html.parser")


    # ---------------------------
    # Trouver le conteneur principal
    # ---------------------------

    """
    Ici on prend le contenu principal de la page.

    Pourquoi ?

    Pour éviter de récupérer des liens inutiles :

    - menu
    - footer
    - etc
    """

    container = soup.select_one("#colleft")

    # Si jamais ce conteneur n'existe pas,
    # on prend toute la page
    if container is None:

        container = soup


    # ---------------------------
    # Liste résultat
    # ---------------------------

    departements = []


    # ---------------------------
    # Parcourir tous les liens
    # ---------------------------

    for link in container.select("a[href]"):

        # Texte visible
        label = link.get_text(" ", strip=True)

        # Exemple : "01-Ain"


        # ---------------------------
        # Vérifier si c'est un département
        # ---------------------------

        if DEPARTMENT_REGEX.match(label):

            # Construire URL complète

            url = urljoin(BASE_URL, link["href"])


            # Ajouter à la liste

            departements.append({

                "dept_label": label,

                "dept_url": url

            })


    # ---------------------------
    # Supprimer les doublons
    # ---------------------------

    """
    Pourquoi ?

    Parfois le même lien apparaît plusieurs fois.

    On utilise un set pour éviter les doublons.
    """

    seen = set()

    result = []

    for d in departements:

        if d["dept_url"] not in seen:

            seen.add(d["dept_url"])

            result.append(d)


    # ---------------------------
    # Retourner résultat final
    # ---------------------------

    return result


# ===============================
# EXECUTION DU SCRIPT
# ===============================

if __name__ == "__main__":

    departements = get_departements()

    print("Nombre de départements trouvés :", len(departements))

    print()

    # Sauvegarder en MongoDB
    if departements:
        collection_depts.drop()  # Supprimer anciens si besoin
        collection_depts.insert_many(departements)
        print("Départements sauvegardés en MongoDB.")

    print()


    # Afficher tous les départements

    for d in sorted(departements, key=lambda x: x["dept_label"]):

        print(

            d["dept_label"],
            "->",
            d["dept_url"]

        )
