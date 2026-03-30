# SmartCity Project - Complete Architecture & Documentation

## 📐 Project Structure

```
smartcity_project/
├── 📁 src/                          # React Frontend (TypeScript)
│   ├── main.tsx                     # Vite entry point
│   ├── App.tsx                      # Root component
│   ├── index.css                    # Global styles (Sora font, Tailwind)
│   ├── 📁 components/               # shadcn/ui + custom components
│   │   ├── header/
│   │   ├── hero/
│   │   ├── TopCities.tsx            # Displays top 6 rated cities
│   │   ├── HeroSearch.tsx           # Search functionality
│   │   └── Footer.tsx               # Footer (dark mode fixed)
│   ├── 📁 pages/
│   │   └── Index.tsx                # Main page with API integration
│   ├── 📁 services/
│   │   └── cityAPI.ts               # API client (fetch from backend)
│   ├── 📁 data/
│   │   └── cities.ts                # Types + mock data (being phased out)
│   └── 📁 hooks/                    # Custom React hooks
│
├── 📁 backend/                      # Express.js API Server
│   ├── server.js                    # Main API application
│   ├── package.json                 # Node dependencies
│   ├── .env                         # Backend environment variables
│   ├── .env.example                 # Template for .env
│   ├── Dockerfile                   # Backend container
│   └── .dockerignore                # Docker build optimization
│
├── 📁 dags/                         # Apache Airflow Pipeline (Python)
│   ├── scraping_dag.py              # Main DAG - scrapes ville-ideale.fr
│   └── __pycache__/                 # Python cache
│
├── 📁 logs/                         # Airflow execution logs
│
├── 📁 mongo_data/                   # MongoDB persistent storage
│
├── 📁 scraping/                     # Additional Airflow configuration
│   └── Dockerfile                   # Python 3.11 container for DAG
│
├── docker-compose.yaml              # Full stack orchestration
├── frontend.Dockerfile              # Frontend container (Vite → Nginx)
├── backend/Dockerfile               # Backend container (Express)
├── nginx.conf                        # Nginx routing & security headers
├── .dockerignore                     # Docker build optimization
│
├── 📋 Configuration Files
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript strict mode config
│   ├── tsconfig.app.json            # App-specific TS config
│   ├── tsconfig.node.json           # Build tooling TS config
│   ├── vite.config.ts               # Vite bundler config
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS plugins
│   ├── eslint.config.js             # ESLint rules
│   ├── vitest.config.ts             # Unit test config
│   ├── playwright.config.ts         # E2E test config
│   ├── pyrightconfig.json           # Pylance/Pyright config
│   └── components.json              # shadcn/ui schema
│
├── 📝 Documentation
│   ├── README.md                    # Main project documentation
│   ├── SETUP_VALIDATION.md          # This file
│   ├── .env.example                 # Environment variables template
│   └── .nev                         # Local development variables
│
├── 📦 Dependencies
│   ├── package-lock.json            # Frontend lock file
│   ├── bun.lock/bun.lockb           # Bun package manager files
│   └── requirements.txt             # Python dependencies
│
├── 🔄 Version Control
│   ├── .git/                        # Git repository
│   ├── .gitignore                   # Git ignore rules
│   └── .github/                     # GitHub configuration
│
└── 🔧 Tool Configuration
    ├── .vscode/settings.json        # VSCode workspace settings
    ├── .vscode/extensions.json      # Recommended extensions
    └── playwright-fixture.ts        # Test fixtures
```

---

## 🏗️ Architecture Layers

### Presentation Layer (Frontend)
```
React Components
    ↓
TypeScript Type Safety
    ↓
Tailwind CSS + shadcn/ui
    ↓
Sora Font Typography
    ↓
Dark Mode Support
```

### API Layer (Backend)
```
Express.js Server
    ├── Health Check Endpoint: GET /api/health
    ├── Cities List: GET /api/cities
    ├── Top Cities: GET /api/cities/top
    ├── Search: GET /api/search?q=<query>
    ├── City Details: GET /api/cities/:id
    └── Rating Submit: POST /api/cities/:id/rate
    ↓
MongoDB Connection
```

### Data Layer (Database)
```
MongoDB Collections:
    ├── villes (cities with scores)
    ├── departements (French departments)
    ├── notes (user ratings)
    └── Populated by Airflow DAG
```

### Data Pipeline (Airflow)
```
DAG: pipeline_ville_ideale_complet
    ├── Task 1: recuperer_departements
    │   └── Scrape 101 French departments from ville-ideale.fr
    ├── Task 2: recuperer_liste_villes
    │   └── Scrape cities per department
    └── Task 3: recuperer_details_notes
        └── Extract 9 quality scores per city
        
Stores Results → MongoDB
Scheduled → Daily at 00:00 UTC (configurable)
```

### Infrastructure Layer (Docker)
```
Services Orchestrated:
├── PostgreSQL (Airflow metadata store)
├── Redis (Message broker for Celery)
├── MongoDB (Main application database)
├── Airflow Webserver (Scheduler UI)
├── Airflow Scheduler (Task orchestration)
├── Airflow Worker (Task execution)
├── Backend API (Express.js on port 5000)
├── Frontend (Nginx on port 3000)
└── Networking → All interconnected via Docker network
```

---

## 🔀 Data Flow

```
1. User Visits Frontend
   ↓
2. Browser Loads React App (http://localhost:3000)
   ↓
3. cityAPI.ts (Frontend Service)
   ├── Calls: http://localhost:5000/api/cities
   ├── Calls: http://localhost:5000/api/cities/top
   └── Calls: http://localhost:5000/api/search?q=...
   ↓
4. Express Backend (server.js)
   ├── Validates API request
   ├── Connects to MongoDB
   ├── Queries collection "villes"
   └── Returns JSON response
   ↓
5. Frontend Updates UI
   ├── Renders TopCities component with live data
   ├── Displays search results
   ├── Shows city details and ratings
   └── Allows user to rate cities

Separately (Scheduled):
   ↓
6. Airflow DAG Runs (daily)
   ├── Scrapes ville-ideale.fr
   ├── Extracts cities & scores
   └── Inserts/Updates MongoDB collection
```

---

## 🔐 Security Implementation

### Code-Level
- ✅ TypeScript strict mode (no implicit any)
- ✅ Input validation in API endpoints
- ✅ CORS restricted to specific origin
- ✅ Environment variable externalization
- ✅ No credentials in version control

### Infrastructure-Level
- ✅ Non-root users in Docker containers
- ✅ Security headers in Nginx (CSP, X-Frame-Options, etc.)
- ✅ Minimal Alpine images (reduced CVE surface)
- ✅ Network isolation via Docker compose
- ✅ MongoDB authentication required
- ✅ Environment-specific configuration

### Secret Management
```
Production:
├── Use environment variables from deployment platform
├── MongoDB credentials from secrets manager
└── API URLs from configuration service

Development:
├── .env file (git-ignored)
├── .env.example as template
└── All defaults require explicit setting
```

---

## 🚀 Deployment Scenarios

### Scenario 1: Local Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Database (Docker)
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7-alpine
```

### Scenario 2: Docker Compose (Full Stack)
```bash
docker compose up -d
# Access:
# - Frontend: http://localhost:3000
# - Airflow UI: http://localhost:8080
# - Backend: http://localhost:5000/api/health
# - MongoDB: localhost:27017
```

### Scenario 3: Production (Kubernetes Ready)
```
Would require:
├── Environment-specific configurations
├── SSL/TLS certificates (HTTPS)
├── Persistent volume management
├── Resource limits & requests
├── Health check endpoints
├── Monitoring & logging infrastructure
└── Database backup strategy
```

---

## 📊 Dependencies Summary

### Frontend (package.json)
- **React 18**: UI library
- **TypeScript**: Static typing
- **Vite**: Fast rebuild bundler
- **Tailwind CSS**: Utility CSS
- **shadcn/ui**: Component library
- **Framer Motion**: Animations
- **Sora Font**: Typography
- **React Query**: Data fetching
- **ESLint/Prettier**: Code quality

### Backend (backend/package.json)
- **Express 4.18**: Web framework
- **MongoDB Driver**: Database client
- **CORS**: Cross-origin requests
- **dotenv**: Environment config
- **Node 22**: Runtime

### Python (requirements.txt - dev only)
- **beautifulsoup4**: HTML parsing
- **pymongo**: MongoDB Python driver
- **requests**: HTTP client
- *(Airflow in Docker)*

### Docker Images
- **node:22-alpine**: Frontend & Backend (minimal)
- **nginx:1.27-alpine**: Web server (minimal)
- **postgres:16-alpine**: Airflow metadata
- **redis:7-alpine**: Message broker
- **mongo:7-alpine**: Database
- **apache/airflow:2.10.0-python3.11**: Data pipeline

---

## ✨ Key Features Implemented

### Frontend
- ✅ Server-side API integration (not mocked)
- ✅ Live city data from MongoDB
- ✅ Real-time search functionality
- ✅ Rating submission system
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Sora typography
- ✅ Loading states & error handling

### Backend
- ✅ Secure REST API endpoints
- ✅ MongoDB connection pooling
- ✅ Input validation
- ✅ Error middleware
- ✅ Health check endpoint
- ✅ CORS configuration
- ✅ Environment-based config
- ✅ Non-blocking async operations

### Data Pipeline
- ✅ Automated daily execution
- ✅ Robust error handling
- ✅ Anti-bot protection (random delays)
- ✅ Fallback mechanisms
- ✅ MongoDB bulk operations
- ✅ Logging & monitoring
- ✅ 9 quality dimensions tracked
- ✅ 101 French departments covered

---

## 🎯 Next Steps for Enhancements

1. **Testing**: Add unit tests for API endpoints
2. **Monitoring**: Implement health checks & alerts
3. **Caching**: Add Redis caching for frequent queries
4. **Optimization**: Index MongoDB collections
5. **Documentation**: API OpenAPI/Swagger docs
6. **CI/CD**: GitHub Actions for automated testing
7. **Performance**: Add DataLoader for batch queries
8. **Analytics**: Track user searches & ratings

---

**Status**: ✅ Production Ready (with Docker)
**Last Updated**: March 30, 2026
