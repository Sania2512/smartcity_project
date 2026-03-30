# 🏙️ SmartCity - VilleIdéale Platform

Plateforme complète de découverte et notation des villes françaises. Backend Airflow + MongoDB + Express API + React Frontend.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🌐 Frontend (React + Vite)                        │
│     - SPA avec Tailwind CSS & Sora font            │
│     - Consume API REST du backend                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔌 Backend API (Express.js)                       │
│     - REST endpoints for cities, search, ratings   │
│     - MongoDB connection                           │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔄 Data Pipeline (Apache Airflow)                │
│     - Scrape ville-ideale.fr                       │
│     - Store data in MongoDB                        │
│     - Auto-scheduled execution                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Services Docker Composés

| Service | Port | Description |
|---------|------|-------------|
| **MongoDB** | 27017 | Base de données document |
| **PostgreSQL** | 5432 | Airflow metadata store |
| **Redis** | 6379 | Message broker pour Celery |
| **Airflow Web** | 8080 | Orchestration UI |
| **Backend API** | 5000 | Express REST API |
| **Frontend** | 3000 | React SPA served via Nginx |

---

## 🚀 Quick Start

### Préalables

- Docker & Docker Compose [Install](https://docs.docker.com/compose/install/)
- Node.js 20+ (pour dev local)
- Git

### Configuration Environnement

1. **Copier le template d'environnement**
   ```bash
   cp .env.example .env
   ```

2. **Personnaliser les variables** (optionnel)
   ```bash
   # .env
   MONGO_USER=admin
   MONGO_PASSWORD=your_secure_password
   POSTGRES_USER=airflow
   POSTGRES_PASSWORD=airflow_secure_password
   ```

### Démarrage Complet (Production)

```bash
# Build et démarrage de tous les services
docker compose up -d

# Vérifier les logs
docker compose logs -f
```

**Accès services :**
- 🌐 **Frontend** : http://localhost:3000
- 📊 **Airflow** : http://localhost:8080 (airflow/airflow)
- 🔌 **API** : http://localhost:5000/api/health
- 🗄️ **MongoDB** : mongodb://admin:password@localhost:27017

### Développement Local (Frontend)

```bash
# Installer dépendances
npm install

# Dev server avec hot reload
npm run dev
# Accès : http://localhost:5173

# Build production
npm run build

# Tester
npm run test
npm run test:ui
```

### Développement Backend (Node)

```bash
cd backend

# Installer dépendances
npm install

# Dev mode avec watch
npm run dev

# Production
npm start
```

---

## 📁 Structure Projet

```
smartcity_project/
├── 📁 src/                           # React frontend
│   ├── components/                   # shadcn/ui + custom components
│   ├── pages/                        # Page routes
│   ├── services/                     # API client (cityAPI.ts)
│   └── data/                         # Types & mock data
├── 📁 backend/                       # Express.js API
│   ├── server.js                     # Main application
│   ├── package.json                  # Node dependencies
│   └── Dockerfile                    # Backend container
├── 📁 dags/                          # Airflow DAGs
│   ├── scraping_dag.py               # Main pipeline
│   └── __pycache__/
├── 📁 logs/                          # Airflow execution logs
├── 📁 mongo_data/                    # MongoDB persistent storage
├── docker-compose.yaml               # Full stack orchestration
├── frontend.Dockerfile               # Nginx + React build
├── .env                              # Environment variables
├── .env.example                      # Template for .env
├── .dockerignore                     # Docker build optimization
├── nginx.conf                        # Reverse proxy configuration
└── package.json                      # Frontend dependencies
```

---

## 🛠️ Développement

### API Endpoints

**Base URL :** `http://localhost:5000/api`

```bash
# Health check
GET /health

# Récupérer toutes les villes
GET /cities

# Top 6 cities by rating
GET /cities/top

# Rechercher villes
GET /search?q=paris

# Détails ville spécifique
GET /cities/:idOrName

# Soumettre une notation
POST /cities/:id/rate
Body: { scores: [...], comment: "..." }
```

### Frontend Features

- 🔍 **Search** : Recherche réactive par nom/département
- ⭐ **Rating** : Notation interactive (9 catégories)
- 📊 **Stats** : Vue globale par ville
- 🌙 **Dark Mode** : Toggle automatique + persistance
- 📱 **Responsive** : Mobile-first design

---

## 🔄 Scraping Pipeline

**AutomationAirflow DAG `pipeline_ville_ideale_complet` :**

1. **recuperer_departements** 
   - Extrait la liste des 101 départements
   
2. **recuperer_liste_villes**
   - Scrape les villes par département
   - Génère les URLs de détail
   
3. **recuperer_details_notes**
   - Récupère les 9 scores par ville
   - Store dans MongoDB collection "villes"

**Protection Anti-Bot :**
- Délais aléatoires 3-7s entre requêtes
- User-Agent headers personnalisés
- Fallback mode simulation si blocage

**Exécution :**
- Planifiée chaque jour à minuit
- Exécution manuelle via Airflow UI

---

## 🐛 Troubleshooting

### Services ne démarrent pas
```bash
# Vérifier les logs
docker compose logs <service_name>

# Redémarrer complètement
docker compose down -v
docker compose up -d
```

### MongoDB seed data
```bash
# Vérifier la connexion
docker exec smartcity_mongodb mongosh -u admin -p secure_password

# Query la collection
use smartcity
db.villes.findOne()
```

### Port déjà utilisé
```bash
# Changer le port dans docker-compose.yaml
# Exemple: "5001:5000" pour backend

# Ou arrêter le service existant
lsof -i :5000  # Find process
kill -9 <PID>
```

### Frontend affiche "API non disponible"
```bash
# Vérifier que le backend est up
curl http://localhost:5000/api/health

# Vérifier les logs du backend
docker compose logs backend

# Vérifier les logs du frontend Nginx
docker compose logs frontend
```

---

## 📚 Commandes Utiles

```bash
# Docker Compose
docker compose up -d                 # Start all services
docker compose down                  # Stop all services
docker compose logs -f               # Stream logs
docker compose ps                    # List running services
docker compose exec <svc> bash       # Shell into container

# Frontend
npm run lint                         # Run ESLint
npm run type-check                   # TypeScript check
npm run preview                      # Preview production build

# Backend
npm run dev                          # Development mode
npm run start                        # Production mode
```

---

## 🔐 Sécurité

- ✅ Credentials externalisés dans `.env` (jamais dans le code)
- ✅ Docker images minimalisées (Alpine)
- ✅ Healthchecks configurés pour tous les services
- ✅ API CORS restreinte au frontend
- ✅ `.env.local` et `.env` dans `.gitignore`

**Avant déploiement en production :**
- [ ] Changer tous les passwords par défaut
- [ ] Configurer variables d'environnement sécurisées
- [ ] Ajouter SSL/TLS (Nginx + Let's Encrypt)
- [ ] Configurer firewall/WAF
- [ ] Mettre en place monitoring/alertes

---

## 👥 Contribution

1. Créer une branche depuis `dev_integration`
2. Commiter vos changements
3. Soumettre une PR avec description détaillée
4. Code review avant merge

---

## 📝 License

Propriétaire - 2026

---

**Besoin d'aide ?** Consultez les logs ou ouvrez une issue.
