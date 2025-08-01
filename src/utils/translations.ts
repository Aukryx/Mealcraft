// Système de traduction simple et léger
import React from 'react';

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Navigation
    'nav.cookbook': 'Livre de recettes',
    'nav.fridge': 'Frigo',
    'nav.pantry': 'Placard',
    'nav.calendar': 'Planning',
    
    // Onboarding
    'onboarding.welcome': 'Bienvenue dans MealCraft !',
    'onboarding.name_question': 'Comment vous appelez-vous ?',
    'onboarding.name_placeholder': 'Votre prénom',
    'onboarding.start': 'Commencer !',
    'onboarding.kitchen_ready': 'Votre cuisine est prête !',
    'onboarding.next': 'Suivant',
    'onboarding.enter_kitchen': 'Entrer dans ma cuisine !',
    
    // Recettes
    'recipe.add': 'Ajouter une recette',
    'recipe.edit': 'Modifier',
    'recipe.delete': 'Supprimer',
    'recipe.portions': 'Portions',
    'recipe.prep_time': 'Temps de préparation',
    'recipe.cook_time': 'Temps de cuisson',
    'recipe.ingredients': 'Ingrédients',
    'recipe.steps': 'Étapes',
    'recipe.nutrition': 'Valeurs nutritionnelles',
    
    // Stock
    'stock.add_ingredient': 'Ajouter un ingrédient',
    'stock.quantity': 'Quantité',
    'stock.expiry_date': 'Date d\'expiration',
    'stock.low_stock': 'Stock faible',
    
    // Planning
    'planning.generate': 'Générer',
    'planning.lunch': 'Déjeuner',
    'planning.dinner': 'Dîner',
    'planning.day': 'Jour',
    'planning.week': 'Semaine',
    'planning.month': 'Mois',
    
    // Général
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.settings': 'Paramètres',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
  },
  
  en: {
    // Navigation
    'nav.cookbook': 'Recipe Book',
    'nav.fridge': 'Fridge',
    'nav.pantry': 'Pantry',
    'nav.calendar': 'Meal Plan',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to MealCraft!',
    'onboarding.name_question': 'What\'s your name?',
    'onboarding.name_placeholder': 'Your first name',
    'onboarding.start': 'Get Started!',
    'onboarding.kitchen_ready': 'Your kitchen is ready!',
    'onboarding.next': 'Next',
    'onboarding.enter_kitchen': 'Enter my kitchen!',
    
    // Recettes
    'recipe.add': 'Add Recipe',
    'recipe.edit': 'Edit',
    'recipe.delete': 'Delete',
    'recipe.portions': 'Servings',
    'recipe.prep_time': 'Prep Time',
    'recipe.cook_time': 'Cook Time',
    'recipe.ingredients': 'Ingredients',
    'recipe.steps': 'Steps',
    'recipe.nutrition': 'Nutrition Facts',
    
    // Stock
    'stock.add_ingredient': 'Add Ingredient',
    'stock.quantity': 'Quantity',
    'stock.expiry_date': 'Expiry Date',
    'stock.low_stock': 'Low Stock',
    
    // Planning
    'planning.generate': 'Generate',
    'planning.lunch': 'Lunch',
    'planning.dinner': 'Dinner',
    'planning.day': 'Day',
    'planning.week': 'Week',
    'planning.month': 'Month',
    
    // Général
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.settings': 'Settings',
    'common.loading': 'Loading...',
    'common.error': 'Error',
  }
};

// Hook pour la traduction
export function useTranslation() {
  const [language, setLanguage] = React.useState<Language>('fr');
  
  React.useEffect(() => {
    const saved = localStorage.getItem('mealcraft_language');
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);
  
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('mealcraft_language', lang);
  };
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };
  
  return { language, changeLanguage, t };
}
