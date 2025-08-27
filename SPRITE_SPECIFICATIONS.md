# 📐 Spécifications Sprites MealCraft

## 🎯 **Dimensions Précises par Objet**

### **📅 Calendar (Calendrier mural)**
```
Format SVG : viewBox="0 0 100 100"
Format PNG : 200x200px @2x (100x100px base)

Style suggéré :
- Calendrier suspendu au mur
- Pages visibles avec quelques dates
- Couleurs : blanc/beige avec accents rouges
- Ombre portée subtile
```

### **📖 Cookbook (Livre de recettes)**  
```
Format SVG : viewBox="0 0 80 120"
Format PNG : 160x240px @2x (80x120px base)

Style suggéré :
- Livre épais ouvert ou fermé
- Couleurs : brun/cuir avec dorures
- Marque-page visible
- Texture papier/cuir
```

### **🧊 Fridge (Réfrigérateur)**
```
Format SVG : viewBox="0 0 80 140" 
Format PNG : 160x280px @2x (80x140px base)

Style suggéré :
- Réfrigérateur 2 portes moderne
- Couleurs : blanc/inox avec poignées chromées
- Petites lumières LED (optionnel)
- Ombrage réaliste
```

### **🥫 Pantry (Placard/garde-manger)**
```
Format SVG : viewBox="0 0 100 120"
Format PNG : 200x240px @2x (100x120px base)

Style suggéré :
- Placard avec portes partiellement ouvertes
- Étagères visibles avec quelques produits
- Couleurs : bois naturel/blanc
- Poignées métalliques
```

### **🔥 Stove (Cuisinière/Four)**
```
Format SVG : viewBox="0 0 120 100"
Format PNG : 240x200px @2x (120x100px base)

Style suggéré :
- Cuisinière avec 4 feux + four
- Couleurs : blanc/inox/noir
- Boutons de contrôle visibles
- Flammes subtiles (état actif)
```

### **🍽️ Counter (Plan de travail)**
```
Format SVG : viewBox="0 0 150 80"
Format PNG : 300x160px @2x (150x80px base)

Style suggéré :
- Surface de travail avec quelques ustensiles
- Couleurs : marbre/bois/granit
- Évier intégré (optionnel)
- Reflets subtils
```

---

## 🎨 **États Visuels Requis**

### **Pour CHAQUE objet, créer 4 variants :**

#### **1. Base (état normal)**
```
- Couleurs standards
- Éclairage neutre  
- Pas d'effets spéciaux
```

#### **2. Hover (survol - tablette/desktop)**
```
- Couleurs légèrement plus vives (+10% saturation)
- Ombre portée plus marquée
- Optionnel : petit halo lumineux
```

#### **3. Active (sélectionné/en cours)**
```
- Contour coloré (vert/bleu)
- Effet de brillance/glow
- Légère augmentation de contraste
```

#### **4. Disabled (indisponible)**
```
- Désaturation (-70%)
- Opacité réduite (50%)
- Optionnel : effet "grisé"
```

---

## 🖼️ **Background Principal**

### **Kitchen Background**
```
Dimensions : 1920x1080px minimum (2560x1440px idéal)
Format : PNG ou JPG (SVG si style très simple)

Composition suggérée :
- Vue perspective d'une cuisine moderne
- Plan de travail central dégagé
- Zones libres pour placer les objets interactifs
- Éclairage chaleureux et uniforme
- Couleurs harmonieuses (tons chauds)

Zones à prévoir :
- Mur du fond : pour calendar + cookbook
- Côté gauche : pour fridge + pantry  
- Centre : pour stove + counter
- Espaces libres pour futures extensions
```

---

## 📱 **Optimisations Mobile/Tablette**

### **Règles de design :**

#### **Contraste élevé**
```
- Contours bien définis
- Couleurs contrastées avec le background
- Éviter les détails trop fins
```

#### **Zones tactiles**
```
- Minimum 44x44px sur mobile
- Espacement minimum 8px entre objets
- Formes reconnaissables instantanément
```

#### **Performance**
```
PNG : Maximum 50Ko par sprite
SVG : Maximum 10Ko par sprite  
JPG Background : Maximum 200Ko
```

---

## 🎨 **Palette de Couleurs Suggérée**

### **Couleurs principales :**
```css
--kitchen-primary: #8B4513    /* Brun chaud */
--kitchen-secondary: #D2B48C  /* Beige */
--kitchen-accent: #4CAF50     /* Vert nature */
--kitchen-neutral: #F5F5DC    /* Blanc cassé */
--kitchen-metal: #C0C0C0      /* Inox */
```

### **États interactifs :**
```css
--hover-glow: #FFD700         /* Or pour hover */
--active-border: #2196F3      /* Bleu pour sélection */
--disabled-gray: #808080      /* Gris pour disabled */
```

---

## 🛠️ **Outils Recommandés**

### **Pour SVG :**
- **Figma** (gratuit, collaboratif)
- **Adobe Illustrator** (professionnel)
- **Inkscape** (gratuit, open source)

### **Pour PNG :**
- **Figma** (avec export @2x)
- **Adobe Photoshop** 
- **GIMP** (gratuit)

### **Optimisation :**
- **SVGO** pour compresser les SVG
- **TinyPNG** pour optimiser les PNG
- **ImageOptim** (Mac) pour batch processing

---

## 📋 **Checklist de Validation**

### **Avant livraison, vérifier :**

✅ **Dimensions exactes** selon spécifications  
✅ **4 états** pour chaque objet (base/hover/active/disabled)  
✅ **Cohérence visuelle** entre tous les sprites  
✅ **Lisibilité** sur petit écran mobile  
✅ **Taille de fichier** optimisée  
✅ **Noms de fichiers** selon convention :
```
calendar-base.svg
calendar-hover.svg  
calendar-active.svg
calendar-disabled.svg
cookbook-base.svg
...
```

✅ **Test sur vraie app** avec différentes tailles d'écran

---

## 🚀 **Phase de Développement**

### **Option Rapide (1-2 jours) :**
- Sprites SVG minimalistes
- Style flat design
- 2 états seulement (base + active)

### **Option Complète (3-5 jours) :**
- Sprites détaillés avec textures
- 4 états complets
- Animations CSS intégrées
- Background personnalisé

### **Option Professionnelle (1-2 semaines) :**
- Sprites haute qualité avec ombres/reflets
- Animations micro-interactives
- Multiple backgrounds (jour/nuit)
- Assets pour différents thèmes
```
