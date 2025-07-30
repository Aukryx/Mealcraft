## Stack technique
- Framework : Next.js (App Router)
- Langage : TypeScript
- Styling : Tailwind CSS
- Stockage local : LocalStorage ou IndexedDB (lib idb)
- Gestion d’état : Zustand (ou Context API)
- Installation mobile : PWA (next-pwa)
- Librairie calendrier : react-calendar ou FullCalendar

## Architecture du projet
- `src/app/` : pages principales (layout, accueil, setup, calendrier, recettes, génération)
- `src/components/` : composants réutilisables (ex : CardRecette, CalendarCell)
- `src/data/` : données de base (recettes, tags, unités)
- `src/lib/` : fonctions utilitaires (génération, nutrition)
- `src/store/` : stores Zustand (profil, recettes, calendrier)
- `src/types/` : types TypeScript
- `src/assets/` : icônes, images
- `public/manifest.json` : configuration PWA

## Modèles de données

### Profil utilisateur
```ts
 type Profil = {
   nom: string
   préférences?: {
     végétarien?: boolean
     rapide?: boolean
   }
 }
```

### Recette
```ts
 type Ingrédient = {
   nom: string
   quantité: number
   unité: string
 }

 type Recette = {
   id: string
   nom: string
   ingrédients: Ingrédient[]
   instructions: string[]
   tags: string[]
   nutrition: {
     calories: number
     protéines: number
     glucides: number
     lipides: number
     fibres?: number
   }
 }
```

### Calendrier
```ts
 type PlanningJournalier = {
   déjeuner?: Recette
   dîner?: Recette
 }

 type Calendrier = {
   [date: string]: PlanningJournalier
 }
```

### Stockage local
```ts
 {
   profil: Profil
   recettes: Recette[]
   calendrier: Calendrier
 }
```

## Comportement au lancement
- Vérifie l’existence d’un profil : si oui, redirige vers l’accueil ; sinon, vers `/setup`
- Charge les recettes de base, les recettes utilisateur et le calendrier depuis le stockage local

## Fonctionnalités techniques à implémenter
1. Création du profil (formulaire, sauvegarde locale)
2. Gestion des recettes (CRUD, tags, nutrition)
3. Générateur de repas (tirage aléatoire, filtres, éviter les doublons)
4. Calendrier des repas (affichage, génération, modification, verrouillage, persistance)
5. Offline & PWA (manifest, service worker, fonctionnement hors-ligne)

## Tests et validations
- Vérifier le fonctionnement offline, la persistance locale, la diversité des repas générés
- Tester sur desktop, Android (Chrome), iOS (Safari)
