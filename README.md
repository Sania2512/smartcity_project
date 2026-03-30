# 🏙️ Projet SmartCity - VilleIdéale

Bienvenue dans le dépôt complet du projet **SmartCity**, combinant un **pipeline de data backend** et une **interface frontend moderne**.

---

## 📚 Architecture du Projet

Ce monorepo contient deux parties majeures :

### 🔄 Backend - Pipeline de Scraping (Branche `master`)
Pipeline Airflow automatisé qui scrape les avis et indicateurs de qualité de vie des villes françaises depuis le site *Ville-Idéale*.

**Détails :**
* **`dags/`** : Workflow Airflow (3 étapes clés)
* **`mongo_data/`** : Volume Docker pour MongoDB
* **`scraping/`** : Dockerfile personnalisé
* **`docker-compose.yaml`** : Orchestration complète (Airflow, MongoDB, Redis, Postgres)
* **Stack** : Apache Airflow 2.10.0, MongoDB 8.2, Python 3.11+

### 🎨 Frontend - React + Vite (Branche `dev_front/back`)
Application React moderne pour consulter et noter les villes.

**Détails :**
* **`src/`** : Code source React + TypeScript
* **`src/components/`** : Composants shadcn/ui
* **Technology** : React, Vite, Tailwind CSS, Sora font

---

## 🚀 Installation

### Backend (Docker)
```bash
docker compose up -d
# Airflow: http://localhost:8080 (airflow/airflow)
# MongoDB Compass: mongodb://admin:password@localhost:27017/
```

### Frontend (Node.js)
```bash
npm install
npm run dev
# Vite: http://localhost:8080
```

---

## 📦 Stack Technique

**Backend :**
* Apache Airflow 2.10.0
* MongoDB 8.2
* Python 3.11+ (BeautifulSoup4, PyMongo, Requests)

**Frontend :**
* React + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui components
* Sora typography

---

## ⚠️ Détails - Backend

Le DAG `pipeline_ville_ideale_complet` exécute :
1. **`recuperer_departements`** : Liste les 101 départements
2. **`recuperer_liste_villes`** : Scrape les URLs par département
3. **`recuperer_details_notes`** : Récupère les 9 catégories de notes

**Protection Anti-Bot** : Délais aléatoires 3-7s configurés. Mode simulation activé si IP bloquée.

---

## 🌿 Branches Git

* **`master`** : Backend en production
* **`dev_front/back`** : Frontend React pré-intégré
* **`dev_integration`** : Intégration complète backend + frontend
