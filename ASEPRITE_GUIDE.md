# 🎨 Guide Aseprite pour MealCraft Mobile

Ce guide vous explique comment créer vos sprites et scènes avec Aseprite pour votre application mobile MealCraft.

## 📱 Dimensions et Échelles

### Tailles de Canvas Recommandées dans Aseprite

#### Pour les Scènes (Backgrounds)
- **Mobile** : 130x281 pixels (390/3 x 844/3)
- **Tablette** : 192x256 pixels (768/4 x 1024/4) 
- **Desktop** : 320x180 pixels (1920/6 x 1080/6)

#### Pour les Sprites Individuels
- **Petits objets** : 16x16 px (boutons, icônes)
- **Objets moyens** : 32x32 px (ustensiles, ingrédients)
- **Gros objets** : 48x48 px (frigo, four, placard)
- **Très gros objets** : 64x64 px (plans de travail)

## 🎭 États des Sprites Interactifs

Chaque objet interactif doit avoir 3 versions :

### 1. **Base** (`object-idle.png`)
- État normal, au repos
- Static (pas d'animation)
- Couleurs neutres

### 2. **Hover** (`object-hover.png`) 
- État survolé/touché
- **Peut être animé** ! (2-8 frames max)
- Couleurs plus vives, effets de brillance
- Exemples d'animations :
  - Frigo : porte qui s'entrouvre légèrement
  - Livre : pages qui bougent
  - Four : flammes qui dansent
  - Étagères : reflets qui bougent

### 3. **Active** (`object-active.png`)
- État sélectionné/pressé
- Static généralement
- Couleurs différentes, effet "enfoncé"

## 🔧 Configuration Aseprite

### Paramètres d'Export
```
Format : PNG
Mode couleur : Indexed (pour taille optimale)
Transparence : Activée
Scale : x1 (on scale dans le code)
```

### Palette Recommandée
Utilisez cette palette cohérente pour tous vos sprites :
```
#000000, #1a1c2c, #5d275d, #b13e53, #ef7d57,
#ffcd75, #a7f070, #38b764, #257179, #29366f,
#3b5dc9, #41a6f6, #73eff7, #f4f4f4, #94b0c2, #566c86
```

### Animations
- **FPS recommandé** : 6-10 FPS (économie batterie mobile)
- **Frames max** : 8 frames par animation
- **Durée** : Loops infinis pour hover

## 📁 Structure des Fichiers

```
public/
├── scenes/
│   ├── kitchen-main.png          # Scène principale
│   ├── fridge-open.png           # Intérieur du frigo
│   ├── pantry-interior.png       # Intérieur du placard
│   └── planning-wall.png         # Mur planning
└── sprites/
    ├── calendar-idle.png         # Calendrier normal
    ├── calendar-hover.png        # Calendrier avec animation
    ├── calendar-active.png       # Calendrier sélectionné
    ├── fridge-idle.png
    ├── fridge-hover.png          # Porte qui s'entrouvre
    ├── fridge-active.png
    └── ...
```

## 🎯 Workflow de Création

### 1. Créer une Scène
1. Nouveau fichier Aseprite : 130x281px (mobile)
2. Dessiner le background de votre cuisine
3. **Important** : Garder des zones libres pour les objets interactifs
4. Exporter en PNG : `kitchen-main.png`

### 2. Créer les Sprites Interactifs
1. Nouveau fichier : 32x32px (par exemple)
2. Dessiner l'objet (ex: frigo) en état normal
3. Dupliquer le layer pour créer les variantes :
   - Hover : ajouter effets, modifier couleurs
   - Active : version "pressée"
4. Pour les animations hover :
   - Créer plusieurs frames
   - Timeline : 8 FPS
   - Loop : Infinite

### 3. Positionnement
Les positions sont en **pourcentages** dans la config :
```typescript
scenePosition: { 
  x: 10,     // 10% depuis la gauche
  y: 15,     // 15% depuis le haut  
  width: 12, // 12% de largeur
  height: 15 // 15% de hauteur
}
```

### 4. Zones Tactiles (Mobile)
Pour mobile, agrandissez les zones cliquables :
```typescript
touchArea: { 
  x: 8,      // Zone plus large que le sprite
  y: 13, 
  width: 16, // Plus large pour le doigt
  height: 19 
}
```

## 🎨 Conseils Artistiques

### Style Pixel Art
- **Pas d'anti-aliasing** : pixels nets uniquement
- **Contraste élevé** : important pour lisibilité mobile
- **Couleurs saturées** mais pas trop criantes
- **Ombres simples** : 1-2 pixels max

### Mobile-First
- **Détails visibles** même petits
- **Contours marqués** pour séparer les objets
- **Icônes reconnaissables** universellement

### Animations Hover
- **Subtiles** : pas trop agressives
- **Fluides** : 6-10 FPS suffisent
- **Significatives** : doivent donner envie de cliquer

## 🔄 Intégration dans le Code

Une fois vos sprites créés, mettez à jour la config :

```typescript
// src/config/asepriteConfig.ts
fridge: {
  base: '/sprites/fridge-idle.png',
  hover: '/sprites/fridge-hover.png',    
  active: '/sprites/fridge-active.png',
  
  pixelScale: 3,           // Mobile scale
  frameCount: 4,           // Si hover animé
  frameRate: 8,            // FPS
  sourceSize: { width: 40, height: 70 },
  
  // Position sur la scène (%)
  scenePosition: { x: 12, y: 55, width: 20, height: 30 },
  
  // Zone tactile élargie mobile
  touchArea: { x: 10, y: 53, width: 24, height: 34 },
  hapticFeedback: 'medium'
}
```

## 🚀 Test et Optimisation

1. **Testez sur mobile** : vérifiez que tout est cliquable
2. **Performance** : surveillez la fluidité
3. **Accessibilité** : contrastes suffisants
4. **Cohérence** : style uniforme entre tous les sprites

---

Vos sprites seront automatiquement **responsifs** et **adaptatifs** selon l'appareil grâce au SceneManager ! 🎮📱
