# 🎨 Guide Aseprite pour MealCraft

## 🎯 **Configuration Aseprite Optimisée**

### 📐 **Dimensions de Canvas Recommandées**

#### **🖼️ Scènes Principales (Backgrounds)**
```
Canvas Aseprite : 320×180px (ratio 16:9)
Scale final : ×6 = 1920×1080px
Mode couleur : Indexed (16-64 couleurs max)
```

#### **🎮 Sprites Objets**
```
Calendar: 48×48px → export 192×192px (×4)
Cookbook: 40×60px → export 160×240px (×4)  
Fridge: 40×70px → export 160×280px (×4)
Pantry: 50×60px → export 200×240px (×4)
Stove: 60×50px → export 240×200px (×4)
Counter: 75×40px → export 300×160px (×4)
```

---

## 🎨 **Workflow Aseprite Recommandé**

### **1. Configuration Projet**
```
• Créer un projet avec palette personnalisée
• Mode : Indexed Color (meilleure compression)
• Background : Transparent pour sprites
• Grid : 8×8px ou 16×16px selon détail souhaité
```

### **2. Palette Pixel Art**
```aseprite
Couleurs de base (16 couleurs) :
#000000 - Noir pur
#1a1c2c - Bleu très sombre  
#5d275d - Violet sombre
#b13e53 - Rouge
#ef7d57 - Orange
#ffcd75 - Jaune
#a7f070 - Vert clair
#38b764 - Vert
#257179 - Bleu-vert
#29366f - Bleu marine
#3b5dc9 - Bleu
#41a6f6 - Bleu clair
#73eff7 - Cyan
#f4f4f4 - Blanc cassé
#94b0c2 - Gris clair
#566c86 - Gris foncé
```

### **3. Nomenclature de Fichiers**
```
/aseprite_sources/
├── scenes/
│   ├── kitchen-main.aseprite
│   ├── fridge-interior.aseprite
│   └── pantry-interior.aseprite
├── sprites/
│   ├── calendar.aseprite
│   ├── cookbook.aseprite
│   ├── fridge.aseprite
│   ├── pantry.aseprite
│   ├── stove.aseprite
│   └── counter.aseprite
```

---

## 🎬 **Animations Hover**

### **📖 Cookbook (4 frames, 8fps)**
```
Frame 1: Livre fermé
Frame 2: Livre entrouvert (5°)
Frame 3: Livre ouvert (15°) 
Frame 4: Pages qui bougent légèrement
Export: cookbook-hover-00.png à cookbook-hover-03.png
```

### **🧊 Fridge (6 frames, 12fps)**
```
Frame 1: Porte fermée
Frame 2: Porte entrouverte (2px)
Frame 3: Porte entrouverte (5px)
Frame 4: Porte entrouverte (8px)
Frame 5: Lumière qui s'allume
Frame 6: Reflets sur les étagères
```

### **🔥 Stove (8 frames, 16fps)**
```
Frame 1-8: Animation de flammes dansantes
Variation de hauteur : 2-3 pixels
Couleurs : Orange → Rouge → Jaune
Particules optionnelles
```

---

## 🛠️ **Settings d'Export Aseprite**

### **Pour les Sprites Animés**
```
Format: PNG Sequence
Scale: 4x ou 6x  
Algorithm: Nearest Neighbor (CRUCIAL!)
Transparent: Oui
Trim: Non (garde les dimensions exactes)
```

### **Pour les Backgrounds**
```
Format: PNG
Scale: 6x (320×180 → 1920×1080)
Algorithm: Nearest Neighbor
Dithering: Désactivé
Compression: Optimale
```

### **Script d'Export Automatique** (Optionnel)
```lua
-- Script Aseprite pour export automatique
local sprite = app.activeSprite
if not sprite then return end

-- Export base
app.command.ExportSpriteSheet {
  type = SpriteSheetType.PACKED,
  textureFilename = sprite.filename:gsub("%.aseprite", "-base.png"),
  scale = 4
}

-- Export hover animation si présente
if #sprite.frames > 1 then
  app.command.ExportSpriteSheet {
    type = SpriteSheetType.HORIZONTAL,
    textureFilename = sprite.filename:gsub("%.aseprite", "-hover.png"),
    scale = 4
  }
end
```

---

## 🎯 **Assets à Créer en Priorité**

### **Phase 1 : Scène Principale**
```
✅ kitchen-main.aseprite (background principal)
✅ calendar-idle.png (statique)
✅ cookbook-idle.png (statique)
✅ fridge-idle.png (statique)  
✅ pantry-idle.png (statique)
✅ stove-idle.png (statique)
✅ counter-idle.png (statique)
```

### **Phase 2 : Animations Hover**
```
🎬 cookbook-hover.aseprite (4 frames)
🎬 fridge-hover.aseprite (6 frames)
🎬 stove-hover.aseprite (8 frames)
🎬 calendar-hover.aseprite (2 frames)
🎬 pantry-hover.aseprite (3 frames)
🎬 counter-hover.aseprite (2 frames)
```

### **Phase 3 : États Actifs**
```
⭐ Tous les sprites en version "active"
⭐ Effets de sélection (contours, glow)
⭐ Variations de couleur/luminosité
```

### **Phase 4 : Scènes Secondaires**
```
🏠 fridge-interior.aseprite
🏠 pantry-interior.aseprite  
🏠 cooking-interface.aseprite
🏠 planning-wall.aseprite
```

---

## 💡 **Conseils Techniques Aseprite**

### **Optimisation Performance**
```
• Limiter à 16-32 couleurs max par sprite
• Animations courtes (4-8 frames max)
• Frames identiques pour économiser la mémoire
• Compression PNG optimale
```

### **Cohérence Visuelle**
```
• Utiliser la même palette pour tous les assets
• Source de lumière cohérente (top-left)
• Style de contour uniforme (1-2px)
• Proportions harmonieuses
```

### **Workflow Efficace**
```
1. Créer la palette maître
2. Dessiner tous les sprites base d'abord
3. Ajouter les animations une par une
4. Exporter en batch à la fin
5. Tester dans l'app en temps réel
```

---

## 🚀 **Intégration avec le Code**

### **Structure de Fichiers Finale**
```
/public/
├── scenes/
│   ├── kitchen-main.png
│   ├── fridge-interior.png
│   └── pantry-interior.png
├── sprites/
│   ├── calendar-idle.png
│   ├── calendar-hover-00.png
│   ├── calendar-hover-01.png
│   ├── cookbook-idle.png
│   ├── cookbook-hover-00.png
│   ├── cookbook-hover-01.png
│   ├── cookbook-hover-02.png
│   ├── cookbook-hover-03.png
│   └── ...
```

### **Test Rapide**
```typescript
// Pour tester vos sprites rapidement
const testSprite = {
  base: '/sprites/calendar-idle.png',
  hover: '/sprites/calendar-hover.png',
  active: '/sprites/calendar-active.png',
  pixelScale: 4,
  frameCount: 2,
  frameRate: 8,
  sourceSize: { width: 48, height: 48 },
  scenePosition: { x: 8, y: 12, width: 12, height: 12 }
};
```

---

## ⚡ **Démarrage Rapide**

### **Étapes Immédiates :**
1. **Créer kitchen-main.aseprite** (320×180px, palette 16 couleurs)
2. **Dessiner 6 sprites basiques** (48×48px environ)
3. **Exporter en PNG ×4** dans `/public/sprites/`
4. **Tester avec SceneManager** 
5. **Itérer et améliorer**

**Temps estimé : 1-2 jours pour une version fonctionnelle !**
