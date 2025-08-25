# Guide de Test - Smart Stock Manager 📱🛒

## Fonctionnalités Implémentées ✅

### 1. Scanner de Code-Barres 📱
- **Caméra en direct** : Scan en temps réel des codes-barres (nécessite HTTPS en production)
- **Mode Test** : Boutons de test pour développement local avec produits simulés
- **Intégration OpenFoodFacts** : Récupération automatique des informations produit
- **Correspondance intelligente** : Mapping automatique avec la base d'ingrédients locale

### 2. Scanner de Ticket de Caisse 🧾  
- **OCR avancé** : Reconnaissance de texte avec Tesseract.js
- **Analyse intelligente** : Extraction automatique des produits et quantités
- **Score de confiance** : Évaluation de la fiabilité de la détection
- **Filtrage alimentaire** : Focus sur les produits comestibles

### 3. Gestion Intelligente du Stock 📊
- **Accumulation automatique** : Addition des quantités (200g + 700g = 900g)
- **Détection des doublons** : Évite la création de duplicatas
- **Correspondance de base** : Utilise les ingrédients prédéfinis quand possible
- **Création automatique** : Ajoute de nouveaux produits si non trouvés

## Comment Tester 🧪

### Test du Scanner de Code-Barres
1. Cliquer sur "Smart Stock" dans l'interface
2. Sélectionner "Scanner Code-Barres" 
3. **Mode Test** (recommandé en développement) :
   - Nutella (700g) → correspondance "pate_tartiner"
   - Coca-Cola → création nouveau produit
   - Bananes (1kg) → correspondance "banane"
   - Yaourt Nature (125g) → correspondance "yaourt"

### Test de l'Accumulation
1. Scanner d'abord "Bananes" → 1kg ajouté
2. Scanner à nouveau "Bananes" → quantité passe à 2kg
3. Vérifier dans l'interface stock : accumulation visible

### Test du Scanner de Ticket
1. Sélectionner "Scanner Ticket de Caisse"
2. Télécharger une image de ticket français
3. Observer l'extraction automatique des produits
4. Sélectionner les items à ajouter au stock

## Informations Techniques 🔧

### Correspondances Intelligentes
- **Exact match** : Nom identique dans la base locale
- **Keyword match** : Mots-clés communs (chocolat, lait, etc.)
- **Category match** : Correspondance par catégorie alimentaire
- **Fallback creation** : Création automatique si aucune correspondance

### Extraction de Quantités
- **Regex patterns** : Détection de "500g", "1kg", "2L", etc.
- **Unités supportées** : grammes, kilogrammes, litres, pièces
- **Conversion automatique** : 1kg → 1000g
- **Valeur par défaut** : 1 pièce si non détecté

### Base de Données Locale
- **ingredientsDeBase** : 200+ ingrédients prédéfinis
- **Catégories** : Viandes, légumes, fruits, épices, etc.
- **Unités cohérentes** : Respect des unités par catégorie
- **Icônes émojis** : Interface visuelle attractive

## Exemple de Scénario Complet 📋

1. **Première utilisation** :
   - Scanner "Bananes" → Ajoute 1kg de bananes
   - Scanner "Yaourt" → Ajoute 125g de yaourt nature

2. **Réapprovisionnement** :
   - Scanner à nouveau "Bananes" → Total : 2kg
   - Scanner "Yaourt 4-pack" → Total yaourt : 625g

3. **Nouveaux produits** :
   - Scanner produit non répertorié → Création automatique
   - Affichage de la correspondance et accumulation

## Débogage 🐛

### Console Logs
Toutes les opérations génèrent des logs détaillés :
```
Bananes: +1000 (total: 2000)
Nouvel ingrédient: Coca-Cola x1
```

### Interface Visuelle
- **Correspondances** : Icône ✅ verte
- **Accumulation** : Flèche 📈 avec calcul
- **Confiance** : Score 🎯 en pourcentage
- **Stock actuel** : Affichage temps réel

## Améliorations Futures 🚀

1. **Scanner amélioré** : Support plus de formats de tickets
2. **IA avancée** : Meilleure reconnaissance des catégories
3. **Synchronisation cloud** : Partage entre appareils
4. **Alertes intelligentes** : Notifications de stock bas
5. **Suggestions recettes** : Basé sur les ingrédients disponibles

---

**Note** : Le système fonctionne parfaitement en mode test pour le développement. La caméra nécessite HTTPS pour fonctionner en production.
