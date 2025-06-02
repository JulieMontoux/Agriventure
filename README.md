# 🌱 Agriventure

**Application web de gestion des ventes directes de fruits pour l'EARL Villemur**

Agriventure est une solution complète de digitalisation pour la vente directe de fruits, remplaçant les tableaux papier par une interface moderne et intuitive. Le projet comprend un système de point de vente (POS), un tableau de bord administrateur, la gestion des stocks et la génération de rapports automatisés.

/!\ Pour initialiser projet : 
- Importer les variables d'environnements dans un .env à la racine du projet
- Importer la BDD MySQL (Disponible dans /app/)
- Identifiants de bases administrateur : admin:admin (Modifiable dans les settings de l'application)

---

## 📋 Table des matières

- [🎯 Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies utilisées](#️-technologies-utilisées)
- [🚀 Installation et lancement](#-installation-et-lancement)
- [📱 Démonstration des pages](#-démonstration-des-pages)
- [🏗️ Architecture du projet](#️-architecture-du-projet)
- [📚 Documentation API](#-documentation-api)
- [👥 Guide utilisateur](#-guide-utilisateur)
- [🔧 Configuration](#-configuration)

---

## 🎯 Fonctionnalités

### 🔐 **Système d'authentification multi-rôles**
- Connexion administrateur et vendeur séparées
- Gestion des permissions basée sur les rôles
- Tokens JWT sécurisés

    
<img src="https://github.com/user-attachments/assets/901afc34-5499-435b-b6e1-6180fa90f455" width="300" />


### 🛒 **Point de vente (POS)**
- Interface tactile optimisée pour tablettes
- Ajout rapide de produits au panier
- Gestion des types de paiement (CB, Espèces, Chèque)
- Génération automatique de reçus
<img src="https://github.com/user-attachments/assets/02fc12f2-68de-459c-9222-c838970e7704" width="300" />

### 📊 **Dashboard administrateur**
- Vue d'ensemble des ventes en temps réel
- Statistiques détaillées et graphiques
- Gestion des produits et des stocks
- Suivi des performances

<img src="https://github.com/user-attachments/assets/65bf8cde-34f2-4207-8172-6a9d016f3272" width="600" />

### ⚙️ **Gestion des paramètres**
- Paramètres de l'entreprise (nom, adresse, logo)
- Configuration des factures et conditions de paiement
- Création et gestion des comptes vendeurs
- Changement de mots de passe sécurisé

<img src="" width="300" />

### 📄 **Génération de rapports**
- Rapports comptables quotidiens automatisés
- Export PDF avec données détaillées
- Aperçu en temps réel des rapports
- Envoi automatique par email (à implémenter)

<img src="https://github.com/user-attachments/assets/70acb843-49f7-41b1-a941-9487d5b677bb" width="600" />

### 💰 **Gestion financière**
- Suivi des ventes par vendeur
- Ventilation des paiements par type
- Calcul automatique des totaux

<img src="https://github.com/user-attachments/assets/7669934e-f1d7-4ca9-adcf-36919ef710d1" width="300" />

---

## 🛠️ Technologies utilisées

### **Backend**
- **FastAPI** - Framework
- **SQLAlchemy** - ORM pour Python
- **MySQL** - Base de données
- **Pydantic** - Validation des données
- **JWT** - Authentification sécurisée
- **ReportLab** - Génération de PDF
- **Passlib** - Chiffrement des mots de passe

### **Frontend**
- **React 18** - Framework
- **TypeScript** - Typage statique
- **PrimeReact** - Bibliothèque de composants UI
- **React Router** - Gestion des routes
- **Axios** - Client HTTP
- **Vite** - Outil de build

### **Outils de développement**
- **ESLint & Prettier** - Qualité du code
- **JWT Decode** - Décodage des tokens
- **CORS** - Gestion des requêtes cross-origin

---

## 🚀 Installation et lancement

### **Prérequis**
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- npm ou yarn

### **1. Cloner le repository**
```bash
git clone https://github.com/votre-username/agriventure.git
cd agriventure
```

### **2. Configuration Backend**

#### Installation des dépendances Python
```bash
cd app
pip install -r requirements.txt
```

#### Configuration de la base de données

Créer une base de données MySQL nommée `agriventure_db`
```

#### Lancer le backend
```bash
uvicorn app.main:app --reload
```
Le backend sera accessible sur `http://localhost:8000`

### **3. Configuration Frontend**

#### Installation des dépendances Node.js
```bash
cd agriventure
npm install
```

#### Lancer le frontend
```bash
npm run dev
```
Le frontend sera accessible sur `http://localhost:5173`

---

## 📱 Détails des pages

### **🔐 Page de connexion**
Interface de sélection entre compte administrateur et vendeur avec design moderne et responsive.

### **📊 Dashboard Administrateur**
- Vue d'ensemble des ventes avec cartes statistiques
- Graphiques interactifs des performances
- Accès rapide aux fonctionnalités principales

### **🛒 Point de Vente (POS)**
- Interface optimisée pour les vendeurs
- Catalogue produits avec images
- Panier en temps réel et validation de commande

### **⚙️ Paramètres Utilisateur**
- **Admin** : Gestion complète de l'entreprise et création de vendeurs
- **Vendeur** : Modification du mot de passe et informations personnelles

### **📄 Génération de Rapports**
- Configuration flexible des dates
- Aperçu PDF en temps réel
- Téléchargement instantané des rapports

---

## 🏗️ Architecture du projet

### **Structure Backend (`/app`)**
```
app/
├── main.py           # Point d'entrée FastAPI + routes
├── models.py         # Modèles SQLAlchemy
├── schemas.py        # Schémas Pydantic
├── database.py       # Configuration base de données
├── crud.py           # Opérations CRUD
├── pdf_generator.py  # Génération de rapports PDF
└── __init__.py
```

### **Structure Frontend (`/src`)**
```
src/
├── components/       # Composants React réutilisables
├── pages/           # Pages principales de l'application
├── contexts/        # Contextes React (Auth, Cart)
├── hooks/           # Hooks personnalisés
├── utils/           # Services API et utilitaires
├── assets/          # Images, styles CSS
├── App.tsx          # Point d'entrée et routage
└── main.tsx         # Bootstrap React
```

### **Fonctionnalités par dossier**

#### **`/components`**
- `Sidebar.tsx` - Navigation principale
- `LoginForm.tsx` - Formulaire de connexion admin
- `SellerLoginForm.tsx` - Formulaire de connexion vendeur

#### **`/pages`**
- Tableau de bord administrateur
- Point de vente vendeur
- Gestion des paramètres
- Génération de rapports

#### **`/contexts`**
- `AuthContext.tsx` - Gestion de l'authentification
- `CartContext.tsx` - Gestion du panier d'achat

#### **`/utils`**
- `apiService.ts` - Interface avec l'API backend
- `auth.ts` - Utilitaires d'authentification

---

## 📚 Documentation API

### **Accès Swagger**
Une fois le backend lancé, la documentation interactive est disponible sur :
**[http://localhost:8000/docs](http://localhost:8000/docs)**

### **Endpoints principaux**

#### **🔐 Authentification**
- `POST /auth/login` - Connexion administrateur
- `POST /auth/seller-login` - Connexion vendeur

#### **👥 Utilisateurs**
- `GET /users` - Liste des utilisateurs
- `POST /users/` - Créer un utilisateur
- `POST /sellers/` - Créer un vendeur

#### **🛍️ Produits**
- `GET /productsTest/` - Liste des produits
- `POST /productsTest/` - Ajouter un produit
- `POST /productsTest/upload-image/` - Upload image produit

#### **📦 Commandes**
- `GET /orders/` - Liste des commandes
- `POST /orders/` - Créer une commande

#### **⚙️ Paramètres**
- `GET|PUT /company-settings/` - Paramètres entreprise
- `GET|PUT /invoice-settings/` - Paramètres facturation

#### **📄 Rapports**
- `GET /generate-report` - Générer rapport PDF

---

## 👥 Guide utilisateur

### **🔑 Connexion**

#### **Administrateur**
1. Sélectionnez "Compte administrateur" sur la page d'accueil
2. Saisissez vos identifiants admin
3. Accédez au dashboard complet

#### **Vendeur**
1. Sélectionnez "Compte vendeur" sur la page d'accueil
2. Utilisez les identifiants fournis par l'administrateur
3. Accédez à l'interface de vente

### **🛒 Effectuer une vente (Vendeur)**
1. Naviguez vers le point de vente
2. Parcourez le catalogue produits
3. Ajoutez les articles au panier
4. Sélectionnez le mode de paiement
5. Validez la commande

### **📊 Consulter les statistiques (Admin)**
1. Accédez au dashboard depuis la sidebar
2. Consultez les cartes de statistiques
3. Analysez les graphiques de performance
4. Filtrez par période si nécessaire

### **⚙️ Gérer les paramètres**
1. Cliquez sur "Paramètres" dans la navigation
2. **Admin** : Modifiez les paramètres entreprise et créez des vendeurs
3. **Vendeur** : Changez votre mot de passe
4. Sauvegardez les modifications

### **📄 Générer un rapport (Admin)**
1. Allez dans "Rapports" depuis la sidebar
2. Sélectionnez la date désirée
3. Prévisualisez le rapport en PDF
4. Téléchargez ou imprimez le document


---

*Agriventure - Digitalisez votre vente directe de fruits* 🍎🍊🍓

