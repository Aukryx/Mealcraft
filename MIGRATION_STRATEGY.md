# Stratégie de migration Local → Cloud pour MealCraft

## 1. Architecture hybride dès le départ

### Structure de données compatible
```typescript
// Structure qui fonctionne en local ET en cloud
export type DataSync = {
  version: string;
  lastSync: Date;
  userId?: string; // null en local, uuid en cloud
  data: {
    recettes: Recette[];
    stock: Ingredient[];
    settings: UserSettings;
    planning: Planning[];
    achievements: Achievement[];
  };
  metadata: {
    deviceId: string;
    appVersion: string;
    platform: string;
  };
};
```

### Service d'abstraction
```typescript
// Interface unique pour local et cloud
interface DataService {
  save(data: any): Promise<void>;
  load(): Promise<any>;
  sync?(): Promise<void>; // Optionnel pour le cloud
}

class LocalDataService implements DataService {
  async save(data: any) {
    localStorage.setItem('mealcraft_data', JSON.stringify(data));
  }
  
  async load() {
    return JSON.parse(localStorage.getItem('mealcraft_data') || '{}');
  }
}

class CloudDataService implements DataService {
  async save(data: any) {
    await fetch('/api/data', { method: 'POST', body: JSON.stringify(data) });
  }
  
  async load() {
    const response = await fetch('/api/data');
    return response.json();
  }
  
  async sync() {
    // Logique de synchronisation
  }
}
```

## 2. Système de migration intégré

### Code de migration dans l'app
```typescript
export class MigrationService {
  static async detectMigrationNeeded(): Promise<boolean> {
    // Vérifier si des données locales existent
    const localData = localStorage.getItem('mealcraft_data');
    return localData !== null;
  }
  
  static async exportLocalData(): Promise<string> {
    const data = localStorage.getItem('mealcraft_data');
    return btoa(data || '{}'); // Encodage base64
  }
  
  static async importToCloud(encodedData: string): Promise<void> {
    const data = JSON.parse(atob(encodedData));
    await fetch('/api/import', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

### Interface de migration
```tsx
function MigrationModal() {
  const [migrationCode, setMigrationCode] = useState('');
  
  const generateCode = async () => {
    const code = await MigrationService.exportLocalData();
    setMigrationCode(code);
  };
  
  return (
    <div>
      <h2>Migrer vos données vers le cloud</h2>
      <button onClick={generateCode}>
        Générer le code de migration
      </button>
      {migrationCode && (
        <textarea value={migrationCode} readOnly />
      )}
      <p>Copiez ce code et collez-le dans la version cloud</p>
    </div>
  );
}
```

## 3. Stratégie de versioning

### Gestion des versions
- **v1.0-local** : Version locale pure
- **v1.1-hybrid** : Préparation cloud (même structure de données)
- **v2.0-cloud** : Version cloud avec migration

### Rétrocompatibilité
```typescript
const MIGRATION_SCHEMAS = {
  '1.0': (data: any) => {
    // Migration depuis v1.0
    return {
      ...data,
      version: '1.1',
      userId: null,
      metadata: generateMetadata()
    };
  },
  '1.1': (data: any) => {
    // Migration depuis v1.1
    return {
      ...data,
      version: '2.0',
      userId: generateUserId()
    };
  }
};
```

## 4. Distribution progressive

### Phase 1 : Local pur (3-6 mois)
- Distribution via .zip
- Données localStorage uniquement
- Feedback et itérations rapides

### Phase 2 : Hybride (1-2 mois)
- Même app, structure compatible cloud
- Option d'export des données
- Tests de migration

### Phase 3 : Cloud avec migration
- Lancement de la version hébergée
- Assistant de migration intégré
- Coexistence temporaire des deux versions

## 5. Avantages de cette approche

### Pour le développement
- **Feedback rapide** : Tests utilisateurs immédiats
- **Itérations agiles** : Pas de contraintes serveur
- **Coûts réduits** : Pas d'infrastructure pendant les tests

### Pour les utilisateurs
- **Pas de perte de données** : Migration transparente
- **Choix** : Garder en local ou migrer
- **Confiance** : Continuité de l'expérience

## 6. Outils techniques

### PWA dès le départ
```json
// manifest.json
{
  "name": "MealCraft",
  "start_url": "/",
  "display": "standalone",
  "background_sync": true,
  "offline_support": true
}
```

### Service Worker pour la transition
```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'data-sync') {
    event.waitUntil(syncDataToCloud());
  }
});
```

## 7. Checklist de préparation

- [ ] Structure de données unifiée
- [ ] Service d'abstraction des données
- [ ] Système de versioning
- [ ] Interface d'export/import
- [ ] Tests de migration
- [ ] Documentation utilisateur
- [ ] Plan de communication

Cette approche vous permet de lancer rapidement en local tout en préparant sereinement la transition vers le cloud.
