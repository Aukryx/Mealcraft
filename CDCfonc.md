
## Objectif général
Développer une application web locale, installable comme une application mobile (PWA), permettant à un utilisateur unique de :
- Gérer son profil (créé à l’installation)
- Générer des repas aléatoires à partir de recettes ou d’ingrédients disponibles
- Consulter, ajouter et modifier ses recettes
- Visualiser les caractéristiques nutritionnelles des repas
- Utiliser l’application entièrement hors ligne

## Utilisateur
- Un seul utilisateur par installation
- Pas de système de compte ou de connexion
- Données enregistrées localement sur l’appareil

## Fonctionnalités principales

### 1. Initialisation de l’application
- Configuration du profil utilisateur (nom, préférences alimentaires optionnelles) au premier lancement
- Sauvegarde locale du profil

### 2. Gestion des recettes
- Recettes de base préchargées + recettes personnalisées
- Chaque recette contient : nom, ingrédients (nom, quantité, unité), tags, valeurs nutritionnelles (calories, protéines, glucides, lipides, fibres), instructions (préparation, cuisson, matériel, étapes)
- Actions : visualiser, ajouter, modifier, supprimer, filtrer par tag/catégorie

### 3. Génération de repas
- Mode 1 : génération aléatoire à partir des recettes (avec filtres : végétarien, calories, etc.)
- Mode 2 : génération à partir des ingrédients disponibles (propose recettes compatibles ou partiellement faisables)

### 4. Affichage des repas
- Affichage détaillé : nom, ingrédients, instructions, nutrition
- Mise en page claire
- (Optionnel) Export/copie/partage de la recette

### 5. Fonctionnement hors ligne
- 100 % offline après installation
- Stockage en LocalStorage ou IndexedDB
- Persistance des données et installation PWA

## Sécurité et confidentialité
- Aucune donnée transmise à un serveur
- Données locales uniquement
- Option de réinitialisation des données

## Plateformes cibles
- Web (desktop et mobile)
- PWA installable (Android/iOS via navigateur)
- Pas de déploiement public pour l’instant

## Fonctionnalité calendrier de repas
- Planification automatique des repas via un calendrier (2 repas/jour)
- Génération pour un jour, une semaine ou un mois, en évitant les doublons
- Affichage sous forme de grille (mois/semaine/jour), possibilité de modifier/verrouiller un jour, stockage local


