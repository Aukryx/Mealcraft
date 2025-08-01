// Système de gestion des versions pour distribution locale
export const APP_VERSION = '1.0.0';
export const DATA_VERSION = '1.0';

export type AppMetadata = {
  version: string;
  dataVersion: string;
  buildDate: string;
  features: string[];
};

// Métadonnées de l'application
export const appMetadata: AppMetadata = {
  version: APP_VERSION,
  dataVersion: DATA_VERSION,
  buildDate: new Date().toISOString(),
  features: [
    'Gestion des recettes',
    'Stock d\'ingrédients',
    'Planning de repas',
    'Mode offline complet',
    'Export/import des données',
    'Support multilingue (FR/EN)',
    'Navigation clavier',
    'Interface mobile optimisée'
  ]
};

// Vérification des mises à jour (pour version future)
export class UpdateChecker {
  static async checkForUpdates(): Promise<{ hasUpdate: boolean; latestVersion?: string }> {
    try {
      // En local : pas de vérification possible
      // En production : call API pour vérifier la version
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return { hasUpdate: false };
      }
      
      // Future implementation pour version hébergée
      const response = await fetch('/api/version');
      const { version } = await response.json();
      
      return {
        hasUpdate: version !== APP_VERSION,
        latestVersion: version
      };
    } catch {
      return { hasUpdate: false };
    }
  }

  static showUpdateNotification(latestVersion: string) {
    if (confirm(`Une nouvelle version (${latestVersion}) est disponible. Souhaitez-vous la télécharger ?`)) {
      window.open('https://mealcraft.app/download', '_blank');
    }
  }
}

// Export des données pour migration
export class DataExporter {
  static async exportAllData(): Promise<string> {
    const data = {
      metadata: {
        exportDate: new Date().toISOString(),
        appVersion: APP_VERSION,
        dataVersion: DATA_VERSION
      },
      userProfile: await this.getProfileData(),
      recettes: await this.getRecettesData(),
      stock: await this.getStockData(),
      planning: await this.getPlanningData(),
      settings: await this.getSettingsData()
    };
    
    return btoa(JSON.stringify(data));
  }
  
  private static async getProfileData() {
    try {
      const { db } = await import('../data/database');
      return await db.userProfile.toArray();
    } catch {
      return [];
    }
  }
  
  private static async getRecettesData() {
    try {
      const { db } = await import('../data/database');
      return await db.recettes.toArray();
    } catch {
      return [];
    }
  }
  
  private static async getStockData() {
    try {
      const { db } = await import('../data/database');
      return await db.stock.toArray();
    } catch {
      return [];
    }
  }
  
  private static async getPlanningData() {
    try {
      const { db } = await import('../data/database');
      return await db.planning.toArray();
    } catch {
      return [];
    }
  }
  
  private static async getSettingsData() {
    return JSON.parse(localStorage.getItem('mealcraft_settings') || '{}');
  }
}

// Instructions pour les mises à jour manuelles
export const UPDATE_INSTRUCTIONS = {
  fr: `
### Comment mettre à jour MealCraft

1. **Exporter vos données** :
   - Allez dans Paramètres > Exporter mes données
   - Copiez le code généré

2. **Télécharger la nouvelle version** :
   - Téléchargez le nouveau fichier .zip
   - Décompressez-le dans un nouveau dossier

3. **Importer vos données** :
   - Ouvrez la nouvelle version
   - Allez dans Paramètres > Importer mes données
   - Collez votre code d'export

4. **Supprimer l'ancienne version** (optionnel)
  `,
  
  en: `
### How to update MealCraft

1. **Export your data**:
   - Go to Settings > Export my data
   - Copy the generated code

2. **Download the new version**:
   - Download the new .zip file
   - Extract it to a new folder

3. **Import your data**:
   - Open the new version
   - Go to Settings > Import my data
   - Paste your export code

4. **Delete the old version** (optional)
  `
};
