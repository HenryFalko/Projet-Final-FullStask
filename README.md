# 📊 Plateforme d'Analyse d'Avis Clients

Une application web full-stack pour l'analyse automatique d'avis clients utilisant l'IA pour la détection de sentiment, construite avec Laravel 12 (API backend) et Vue 3 (frontend).

## 🎯 Fonctionnalités

### Backend (API Laravel 12)
- ✅ Architecture API RESTful
- ✅ Authentification utilisateur avec Laravel Sanctum
- ✅ Opérations CRUD complètes pour les avis
- ✅ Service d'analyse IA intégré
- ✅ Analyse automatique des avis à la création
- ✅ Tableau de bord avec statistiques globales
- ✅ Contrôle d'accès basé sur les rôles (admin/utilisateur)
- ✅ SQLite pour le développement, PostgreSQL pour la production

### Frontend (Vue 3 + Vite)
- ✅ Interface utilisateur moderne et responsive
- ✅ Authentification utilisateur (connexion/inscription)
- ✅ Tableau de bord avec visualisation des statistiques
- ✅ Gestion des avis (créer, lister, filtrer, supprimer)
- ✅ Affichage de l'analyse IA en temps réel
- ✅ Filtrage basé sur le sentiment
- ✅ Support de la pagination

### Analyse IA
- ✅ Détection de sentiment basée sur NLP par mots-clés
- ✅ Calcul du score (0-100)
- ✅ Extraction de thèmes (livraison, prix, qualité, service, produit, rapidité)
- ✅ Support des mots-clés français et anglais

---

## 🛠️ Stack Technique

**Backend:**
- Laravel 12
- PHP 8.2+
- SQLite (dev) / PostgreSQL (prod)
- Laravel Sanctum (authentification)

**Frontend:**
- Vue 3
- Vite
- Vue Router
- Pinia (gestion d'état)
- Axios

---

## 📋 Prérequis

- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- Docker (optionnel, pour PostgreSQL)

---

## 🚀 Installation

### 1. Cloner le Dépôt

\`\`\`bash
git clone <url-du-depot>
cd Projet-Final
\`\`\`

### 2. Configuration du Backend

\`\`\`bash
cd backend

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Créer la base de données SQLite
New-Item -Path "database\\database.sqlite" -ItemType File -Force

# Exécuter les migrations
php artisan migrate

# Démarrer le serveur de développement
php artisan serve
\`\`\`

L'API backend sera disponible sur `http://localhost:8000`

### 3. Configuration du Frontend

\`\`\`bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
\`\`\`

Le frontend sera disponible sur `http://localhost:5173`

---

## 🐳 Configuration Production avec Docker (PostgreSQL)

### 1. Démarrer PostgreSQL avec Docker Compose

\`\`\`bash
# Depuis la racine du projet
docker-compose up -d
\`\`\`

Cela démarrera :
- Base de données PostgreSQL sur le port 5432
- pgAdmin sur le port 5050 (http://localhost:5050)

### 2. Configurer le Backend pour PostgreSQL

\`\`\`bash
cd backend

# Mettre à jour le fichier .env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=review_analysis
DB_USERNAME=laravel
DB_PASSWORD=laravel_password

# Exécuter les migrations
php artisan migrate
\`\`\`

---

## 📖 Utilisation

### 1. Créer un Nouveau Compte
- Naviguer vers `http://localhost:5173/register`
- Créer votre compte
- Vous serez automatiquement connecté

### 2. Créer un Avis
- Aller sur "Nouvel Avis"
- Rédiger votre avis (minimum 10 caractères)
- Soumettre et voir l'analyse IA en temps réel
- Visualiser le sentiment, le score et les thèmes détectés

### 3. Voir le Tableau de Bord
- Voir les statistiques globales
- Distribution des sentiments
- Score moyen
- Top des thèmes
- Avis récents

### 4. Gérer les Avis
- Filtrer par sentiment
- Filtrer par score minimum
- Trier par date
- Supprimer vos propres avis

---

## 🔑 Documentation API

La documentation API complète est disponible dans [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Exemples API Rapides

**Inscription:**
\`\`\`bash
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
\`\`\`

**Créer un Avis:**
\`\`\`bash
POST http://localhost:8000/api/reviews
Authorization: Bearer {votre_token}
Content-Type: application/json

{
  "content": "Excellent produit ! Livraison rapide et excellente qualité."
}
\`\`\`

**Obtenir le Tableau de Bord:**
\`\`\`bash
GET http://localhost:8000/api/dashboard
Authorization: Bearer {votre_token}
\`\`\`

---

## 🧪 Tests

### Tests Backend

\`\`\`bash
cd backend
php artisan test
\`\`\`

### Tests Manuels

1. Utiliser l'application frontend
2. Utiliser des outils de test API (Postman, Insomnia)
3. Consulter la documentation API pour tous les endpoints

---

## 📁 Structure du Projet

\`\`\`
Projet-Final/
├── backend/                    # API Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── AnalysisController.php
│   │   │   └── DashboardController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   └── Review.php
│   │   └── Services/
│   │       └── ReviewAnalysisService.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env
├── frontend/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── ReviewListView.vue
│   │   │   └── ReviewCreateView.vue
│   │   ├── stores/
│   │   │   └── auth.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   └── .env
└── docker-compose.yml          # Configuration PostgreSQL
\`\`\`

---

## 🔧 Configuration

### Variables d'Environnement Backend

\`\`\`env
APP_NAME="Plateforme d'Analyse d'Avis"
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
FRONTEND_URL=http://localhost:5173
\`\`\`

### Variables d'Environnement Frontend

\`\`\`env
VITE_API_URL=http://localhost:8000/api
\`\`\`

---

## 🎨 Qualité du Code

Le projet respecte :
- Standards de codage PSR-12 pour PHP
- Bonnes pratiques de l'API Composition Vue 3
- Principes de code propre
- Commentaires et documentation complets

---

## 📝 Licence

Ce projet est créé à des fins éducatives.

---

## 👥 Auteur

Développé dans le cadre d'un projet de cours de Développement Full Stack.

---

## 🐛 Dépannage

### Problèmes Backend

**Base de données introuvable:**
\`\`\`bash
New-Item -Path "database\\database.sqlite" -ItemType File -Force
php artisan migrate
\`\`\`

**Erreurs CORS:**
- Vérifier `FRONTEND_URL` dans le `.env` du backend
- S'assurer que le frontend fonctionne sur le bon port

### Problèmes Frontend

**Échec de connexion à l'API:**
- Vérifier que le backend fonctionne sur `http://localhost:8000`
- Vérifier `VITE_API_URL` dans le `.env` du frontend

**Authentification ne fonctionne pas:**
- Effacer le localStorage du navigateur
- Se reconnecter avec des identifiants valides

---

## 🚀 Déploiement

### Backend
1. Définir `APP_ENV=production` dans `.env`
2. Exécuter `php artisan config:cache`
3. Exécuter `php artisan route:cache`
4. Configurer la base de données PostgreSQL
5. Exécuter les migrations: `php artisan migrate --force`

### Frontend
1. Construire pour la production: `npm run build`
2. Déployer le dossier `dist/` sur votre hébergement
3. Mettre à jour `VITE_API_URL` vers l'URL de l'API de production

---

## 📞 Support

Pour les problèmes ou questions, veuillez consulter la documentation API ou créer une issue dans le dépôt.
