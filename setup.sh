#!/bin/bash
# Setup script for SmartCity project
# Configures environment and validates setup

set -e

echo "🔍 SmartCity Project Setup Verification"
echo "======================================="

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found - install from nodejs.org"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker: installed"
else
    echo "⚠️  Docker not found - required for production"
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python: $PYTHON_VERSION"
    echo "   ℹ️  For Airflow development, use Python 3.8-3.12"
else
    echo "⚠️  Python3 not found"
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Create backend dependencies note
echo ""
echo "📝 Backend & Python Setup:"
echo "   - Backend API: npm install in ./backend"
echo "   - Airflow DAG: Installs in Docker (requires Python <3.13)"
echo "   - Python deps (dev): pip install beautifulsoup4 pymongo requests"

# Copy .env template if needed
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found"
    echo "   Create one using: cp .env.example .env"
    echo "   Then update with your actual credentials"
fi

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Create .env from .env.example"
echo "   2. Run: docker compose up -d"
echo "   3. Frontend: npm run dev"
echo "   4. Open: http://localhost:3000"
