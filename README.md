# 🏙️ Projet SmartCity - Pipeline de Scraping Ville-Idéale

Bienvenue dans le dépôt du moteur de collecte de données du projet **SmartCity**. Ce pipeline automatisé extrait les avis et les indicateurs de qualité de vie des villes françaises depuis le site *Ville-Idéale* pour les structurer dans une base MongoDB.

---

## 📂 Architecture des Fichiers

* **`dags/`** : Contient `scraping_dag.py`, le workflow Airflow (3 étapes clés).
* **`mongo_data/`** : Volume Docker persistant stockant les données de la base MongoDB.
* **`scraping/`** : Dossier de build contenant le `Dockerfile` personnalisé pour nos dépendances de scraping.
* **`docker-compose.yaml`** : Orchestration complète de l'infrastructure (Airflow, MongoDB, Redis, Postgres).
* **`.env`** : Variables d'environnement pour la configuration sécurisée des services.
* **`requirements.txt`** : Librairies Python nécessaires (`beautifulsoup4`, `pymongo`, `requests`).

---

## 🚀 Installation & Lancement

1.  **Démarrer l'infrastructure :**
    ```bash
    docker compose up -d
    ```
2.  **Accès à l'interface Airflow :**
    Rendez-vous sur [http://localhost:8080](http://localhost:8080)  
    *Identifiants :* `airflow` / `airflow`
3.  **Visualisation des données (MongoDB) :**
    Utilisez **MongoDB Compass** avec cette chaîne de connexion :  
    `mongodb://admin:password@localhost:27017/`

---

## ⚙️ Détails du Pipeline (DAG)

Le DAG `pipeline_ville_ideale_complet` exécute les tâches suivantes en séquence :

1.  **`recuperer_departements`** : Analyse la page principale pour lister les 101 départements.
    * *Correctif appliqué :* Gestion des caractères spéciaux (tiret insécable) pour isoler proprement les codes INSEE.
2.  **`recuperer_liste_villes`** : Pour chaque département, simule une requête AJAX pour récupérer les URLs de chaque ville.
3.  **`recuperer_details_notes`** : Scrape les 9 catégories de notes (Sécurité, Santé, Environnement, etc.).
    * *Stockage :* Les données sont injectées dans la collection `villes` sous forme d'objets imbriqués (`notes_globales`).

---

## ⚠️ Sécurité & Anti-Bannissement

Le site cible possède une protection anti-bot. Pour garantir la stabilité du projet :

* **Délais de courtoisie :** Des pauses aléatoires (`time.sleep`) entre 3 et 7 secondes sont configurées. **Ne pas les supprimer.**
* **Mode Simulation :** Si le site bloque votre IP (0 villes trouvées), le script injecte automatiquement des données de test (Bourg-en-Bresse, Oyonnax) pour permettre le développement du reste de la chaîne.
* **Résolution des Logs (Erreur 403) :** Si l'interface Airflow refuse d'afficher les logs, vérifiez directement l'état des collections dans MongoDB Compass.

---

## 🛠️ Stack Technique

* **Orchestrateur :** Apache Airflow 2.10.0
* **Base de Données :** MongoDB 8.2
* **Langage :** Python 3.11+
* **Librairies :** BeautifulSoup4, Requests, PyMongo
