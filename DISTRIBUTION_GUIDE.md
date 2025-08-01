# Guide de distribution locale de MealCraft

## Préparation du build

### 1. Build statique
```bash
npm run build
npm run export  # ou next export selon votre config
```

### 2. Structure du .zip à distribuer
```
mealcraft-v1.0-local.zip
├── index.html
├── _next/
├── public/
├── README_INSTALLATION.txt
└── CHANGELOG.md
```

### 3. README_INSTALLATION.txt
```
=== MealCraft - Installation Locale ===

1. Décompressez ce fichier dans un dossier de votre choix
2. Ouvrez le fichier index.html avec votre navigateur
3. Ajoutez cette page à vos favoris pour un accès rapide
4. Optionnel : Installez comme application (icône + dans la barre d'adresse)

=== Données ===
Toutes vos données sont stockées localement dans votre navigateur.
Pour sauvegarder : Menu > Exporter mes données
Pour restaurer : Menu > Importer mes données

=== Support ===
Email : support@mealcraft.app
```

## Distribution progressive

### Phase 1 : Tests privés (1-2 mois)
- 5-10 testeurs proches
- Builds manuels toutes les semaines
- Feedback direct par email/Discord

### Phase 2 : Tests élargis (2-3 mois)
- 20-50 testeurs
- Mise en place d'un formulaire de feedback
- Builds automatisés

### Phase 3 : Beta publique (1-2 mois)
- Distribution plus large
- Préparation de la migration cloud
- Tests de migration avec volontaires

## Avantages de cette approche

### Technique
- **Pas de serveur** : Coût zéro
- **Pas de base de données** : Simplicité maximale
- **Déploiement instantané** : Juste un .zip
- **Pas de maintenance** : L'app fonctionne seule

### Utilisateur
- **Installation simple** : Double-clic
- **Confidentialité totale** : Données jamais transmises
- **Performance maximale** : Tout en local
- **Fonctionnement offline** : Toujours disponible

### Business
- **Feedback rapide** : Utilisateurs réels rapidement
- **Coûts maîtrisés** : Pas d'infrastructure
- **Flexibilité** : Pivot rapide si nécessaire
- **Validation concept** : Avant investissement cloud

## Migration future simplifiée

Quand vous passerez au cloud, les utilisateurs auront :
1. Un code d'export de leurs données
2. Un lien vers la nouvelle version
3. Un import automatique de leurs données
4. Continuité totale de l'expérience

Cette stratégie est parfaite pour votre projet !
