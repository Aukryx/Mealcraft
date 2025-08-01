import { useState, useEffect } from 'react';

// Interface commune pour local et cloud
interface DataService {
  save(key: string, data: unknown): Promise<void>;
  load(key: string): Promise<unknown>;
  sync?(): Promise<void>;
}

// Service local
class LocalDataService implements DataService {
  async save(key: string, data: unknown): Promise<void> {
    localStorage.setItem(`mealcraft_${key}`, JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0',
      source: 'local'
    }));
  }

  async load(key: string): Promise<unknown> {
    const stored = localStorage.getItem(`mealcraft_${key}`);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed.data;
  }
}

// Service cloud (pour plus tard)
class CloudDataService implements DataService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async save(key: string, data: unknown): Promise<void> {
    await fetch(`/api/users/${this.userId}/data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '2.0',
        source: 'cloud'
      })
    });
  }

  async load(key: string): Promise<unknown> {
    const response = await fetch(`/api/users/${this.userId}/data/${key}`);
    const result = await response.json();
    return result.data;
  }

  async sync(): Promise<void> {
    // Synchronisation bidirectionnelle
  }
}

// Hook unifié
export function useDataService() {
  const [service, setService] = useState<DataService>(new LocalDataService());
  const [isCloudMode, setIsCloudMode] = useState(false);

  // Détection automatique du mode
  useEffect(() => {
    const cloudUserId = localStorage.getItem('mealcraft_cloud_user_id');
    if (cloudUserId && navigator.onLine) {
      setService(new CloudDataService(cloudUserId));
      setIsCloudMode(true);
    }
  }, []);

  // Méthodes de migration
  const exportLocalData = async (): Promise<string> => {
    const allKeys = ['recettes', 'stock', 'settings', 'planning'];
    const exportData: Record<string, unknown> = {};
    
    for (const key of allKeys) {
      exportData[key] = await service.load(key);
    }
    
    return btoa(JSON.stringify({
      ...exportData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }));
  };

  const importCloudData = async (encodedData: string): Promise<void> => {
    const data = JSON.parse(atob(encodedData));
    
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'exportDate' && key !== 'version') {
        await service.save(key, value);
      }
    }
  };

  const switchToCloud = async (userId: string): Promise<void> => {
    localStorage.setItem('mealcraft_cloud_user_id', userId);
    setService(new CloudDataService(userId));
    setIsCloudMode(true);
  };

  return {
    service,
    isCloudMode,
    exportLocalData,
    importCloudData,
    switchToCloud
  };
}
