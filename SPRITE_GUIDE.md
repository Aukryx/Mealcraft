# 🎨 Guide des Sprites pour MealCraft Mobile/Tablette

## 📱 **Stratégie Recommandée : Sprites Adaptatifs**

### ✅ **POURQUOI cette approche ?**

1. **Performance** : Un seul jeu de sprites qui s'adapte
2. **Maintenance** : Une seule source de vérité  
3. **Cohérence** : Design uniforme sur tous les appareils
4. **Flexibilité** : Ajout facile de nouveaux objets

---

## 🎯 **Spécifications Techniques**

### **Format recommandé : SVG**
```
✅ Avantages :
- Qualité parfaite à toutes les tailles
- Taille de fichier optimale
- Modification facile des couleurs/styles
- Support natif dans les navigateurs
```

### **Tailles de base**
```typescript
mobile:  { width: 60-80px,  height: 60-120px }
tablet:  { width: 80-110px, height: 80-160px }  
desktop: { width: 100-140px, height: 100-200px }
```

---

## 🎨 **États des Sprites**

### **États requis pour chaque objet :**
1. **`base`** - État normal
2. **`hover`** - Survol (tablette/desktop)
3. **`active`** - Sélectionné/en cours d'utilisation
4. **`disabled`** - Indisponible

### **Exemple de nomenclature :**
```
/public/sprites/
├── calendar-base.svg
├── calendar-hover.svg  
├── calendar-active.svg
├── cookbook-base.svg
├── cookbook-hover.svg
├── cookbook-active.svg
├── fridge-base.svg
└── ...
```

---

## 📐 **Positionnement Responsif**

### **Système de pourcentages**
```typescript
// Positions en % de l'écran pour s'adapter automatiquement
mobile: {
  calendar: { x: 5%, y: 10%, width: 15%, height: 15% }
  cookbook: { x: 75%, y: 15%, width: 20%, height: 25% }
  fridge:   { x: 10%, y: 60%, width: 25%, height: 35% }
}

tablet: {
  calendar: { x: 8%, y: 12%, width: 12%, height: 12% }
  // Légèrement différent pour optimiser l'espace
}
```

---

## 🎮 **Interactions Tactiles**

### **Optimisations mobiles :**
- **Zones de toucher élargies** (minimum 44x44px)
- **Feedback visuel immédiat** sur tap
- **Prévention du zoom** sur double-tap
- **Indicateurs visuels** pour montrer l'interactivité

### **Animations fluides :**
```css
/* Transition douce lors des interactions */
transform: scale(1.05) /* Sur activation */
box-shadow: 0 4px 12px rgba(0,0,0,0.3) /* Effet de profondeur */
```

---

## 🖼️ **Assets Recommandés**

### **Background principal :**
```
kitchen-background.svg (ou .png si complexe)
- Résolution : 1920x1080 minimum
- Format : SVG privilégié, PNG en fallback
- Style : Pixel art ou illustration stylisée
```

### **Objets interactifs :**
```
7 objets principaux :
📅 calendar  - Calendrier mural
📖 cookbook  - Livre de recettes
🧊 fridge    - Réfrigérateur  
🥫 pantry    - Placard/garde-manger
🔥 stove     - Cuisinière/four
🍽️ counter   - Plan de travail
📱 device    - Appareil connecté (optionnel)
```

---

## 💡 **Conseils de Design**

### **Style cohérent :**
- **Palette de couleurs** restreinte et harmonieuse
- **Style pixel art** ou illustration vectorielle
- **Éclairage** cohérent (source de lumière unique)
- **Proportions** réalistes mais stylisées

### **Lisibilité :**
- **Contrastes** suffisants pour la lecture
- **Tailles** adaptées aux doigts (mobile)
- **Espacement** entre les éléments interactifs

---

## 🚀 **Implémentation Rapide**

### **Option 1 : Sprites SVG personnalisés**
```
Avantages : Design unique, optimisé
Temps : 2-3 jours de design
Coût : Moyen (si externe) / Élevé (temps)
```

### **Option 2 : Icônes existantes + style**
```
Avantages : Rapide, cohérent
Temps : 1 jour d'intégration  
Coût : Faible
Ressources : Feather Icons, Heroicons, etc.
```

### **Option 3 : Émojis stylisés** (DÉMARRAGE RAPIDE)
```
Avantages : Immédiat, universels
Temps : Quelques heures
Coût : Gratuit
Utilisation : Phase de prototypage
```

---

## 📱 **Tests Recommandés**

### **Appareils cibles :**
```
📱 Mobile :  iPhone SE, Galaxy S, petits écrans (320-480px)
📱 Mobile+ : iPhone Pro, Galaxy Plus (480-768px)  
📟 Tablet :  iPad, Galaxy Tab (768-1024px)
🖥️ Desktop : Écrans standards (1024px+)
```

### **Interactions à tester :**
- ✅ Tap simple sur mobile
- ✅ Hover sur tablette  
- ✅ Zones de toucher suffisantes
- ✅ Animations fluides
- ✅ Feedback visuel immédiat

---

## 🎯 **Prochaines Étapes**

1. **Définir le style visuel** (pixel art vs moderne)
2. **Créer le background principal** de la cuisine
3. **Designer les 7 objets** dans leurs différents états
4. **Intégrer avec le composant ResponsiveKitchenSprite**
5. **Tester sur vrais appareils** mobiles/tablettes

**Voulez-vous que je vous aide à créer des sprites temporaires avec des émojis pour démarrer rapidement le test ?**
