import React, { useState } from 'react';
import { UserProfile } from '../data/database';
import { UserSettings } from '../types';

interface UserProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onUpdatePreferences: (preferences: Partial<UserSettings>) => Promise<void>;
  onResetProfile: () => Promise<void>;
}

export default function UserProfileModal({ 
  profile, 
  onClose, 
  onUpdatePreferences, 
  onResetProfile 
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'preferences' | 'data'>('info');
  const [preferences, setPreferences] = useState<UserSettings>(profile.preferences);
  const [saving, setSaving] = useState(false);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await onUpdatePreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes vos données ?\n\nCette action supprimera :\n- Votre profil\n- Toutes vos recettes personnalisées\n- Votre planning\n- Votre stock\n\nCette action est irréversible.')) {
      await onResetProfile();
      window.location.reload();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #2d3748, #4a5568)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        fontFamily: 'Press Start 2P, cursive'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1rem',
            margin: 0,
            background: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            👤 Profil de {profile.nom}
          </h2>
          
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '0.25rem'
        }}>
          {[
            { key: 'info', label: '📋 Infos', icon: '📋' },
            { key: 'preferences', label: '⚙️ Préférences', icon: '⚙️' },
            { key: 'data', label: '💾 Données', icon: '💾' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                flex: 1,
                background: activeTab === tab.key 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'transparent',
                color: '#e2e8f0',
                border: 'none',
                borderRadius: '6px',
                padding: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.6rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'info' && (
          <div style={{ color: '#e2e8f0' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#ffd93d' }}>
                📊 Statistiques du profil
              </h3>
              
              <div style={{ fontSize: '0.6rem', lineHeight: 1.8 }}>
                <div><strong>🆔 ID:</strong> {profile.id}</div>
                <div><strong>📅 Créé le:</strong> {profile.dateCreation.toLocaleDateString('fr-FR')}</div>
                <div><strong>🕐 Dernière connexion:</strong> {profile.derniereConnexion.toLocaleDateString('fr-FR')}</div>
                <div><strong>🎓 Tutoriel terminé:</strong> {profile.tutorialComplete ? '✅ Oui' : '❌ Non'}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#ffd93d' }}>
                🍽️ Résumé des préférences
              </h3>
              
              <div style={{ fontSize: '0.6rem', lineHeight: 1.6 }}>
                <div><strong>👥 Portions par défaut:</strong> {preferences.portionsParDefaut}</div>
                <div><strong>🍽️ Mode consommation:</strong> {preferences.consommationMode}</div>
                <div><strong>🔔 Alertes stock:</strong> {preferences.alertesStock ? '✅ Activées' : '❌ Désactivées'}</div>
                {preferences.regimesAlimentaires.length > 0 && (
                  <div><strong>🥗 Régimes:</strong> {preferences.regimesAlimentaires.join(', ')}</div>
                )}
                {preferences.allergies.length > 0 && (
                  <div><strong>⚠️ Allergies:</strong> {preferences.allergies.join(', ')}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div style={{ color: '#e2e8f0', fontSize: '0.6rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd93d' }}>
                👥 Portions par défaut:
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={preferences.portionsParDefaut}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') return; // Ne pas traiter les valeurs vides
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 1) {
                    setPreferences({
                      ...preferences,
                      portionsParDefaut: numValue
                    });
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  color: '#e2e8f0',
                  width: '100px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd93d' }}>
                🍽️ Mode de consommation:
              </label>
              <select
                value={preferences.consommationMode}
                onChange={(e) => setPreferences({
                  ...preferences,
                  consommationMode: e.target.value as any
                })}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  color: '#e2e8f0'
                }}
              >
                <option value="simulation">🎮 Simulation</option>
                <option value="reel">🏠 Réel</option>
                <option value="planification">📅 Planification</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={preferences.alertesStock}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    alertesStock: e.target.checked
                  })}
                />
                🔔 Alertes de stock faible
              </label>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={preferences.planificationAutomatique}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    planificationAutomatique: e.target.checked
                  })}
                />
                📅 Planification automatique
              </label>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={saving}
              style={{
                background: saving ? 'rgba(0, 0, 0, 0.2)' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.6rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                marginTop: '1rem'
              }}
            >
              {saving ? '💾 Sauvegarde...' : '✅ Sauvegarder'}
            </button>
          </div>
        )}

        {activeTab === 'data' && (
          <div style={{ color: '#e2e8f0', fontSize: '0.6rem' }}>
            <div style={{
              background: 'rgba(255, 69, 69, 0.1)',
              border: '1px solid rgba(255, 69, 69, 0.3)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#ff6b6b' }}>
                ⚠️ Zone de danger
              </h3>
              
              <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                La réinitialisation supprimera définitivement toutes vos données :
              </p>
              
              <ul style={{ marginLeft: '1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                <li>• Votre profil utilisateur</li>
                <li>• Toutes vos recettes personnalisées</li>
                <li>• Votre planning de repas</li>
                <li>• Votre stock d'ingrédients</li>
                <li>• Vos préférences et paramètres</li>
              </ul>
              
              <button
                onClick={handleReset}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                🗑️ Réinitialiser toutes les données
              </button>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#ffd93d' }}>
                📊 Informations techniques
              </h3>
              
              <div style={{ fontSize: '0.6rem', lineHeight: 1.6 }}>
                <div><strong>💾 Stockage:</strong> IndexedDB (navigateur)</div>
                <div><strong>🔒 Données:</strong> 100% locales</div>
                <div><strong>🌐 Réseau:</strong> Aucune transmission</div>
                <div><strong>🔄 Sauvegarde:</strong> Automatique</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
