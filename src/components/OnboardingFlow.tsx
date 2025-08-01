import React, { useState } from 'react';
import { UserProfile } from '../data/database';

type Props = {
  onProfileCreated: (profile: UserProfile) => void;
  onCreateProfile: (nom: string) => Promise<UserProfile>;
};

export default function OnboardingFlow({ onProfileCreated, onCreateProfile }: Props) {
  const [step, setStep] = useState(0);
  const [nom, setNom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProfile = async () => {
    if (!nom.trim()) {
      setError('Veuillez saisir votre nom');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profile = await onCreateProfile(nom);
      onProfileCreated(profile);
      setStep(1); // Passer à l'étape suivante
    } catch (err) {
      setError('Erreur lors de la création du profil');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // Étape 0 : Création du profil
    {
      title: "Bienvenue dans MealCraft ! 👋",
      content: (
        <div style={{ 
          padding: '2rem 1rem', 
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍳</div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              color: '#8b4513', 
              marginBottom: '1rem',
              fontFamily: 'Press Start 2P, cursive'
            }}>
              MealCraft
            </h1>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#666', 
              lineHeight: 1.6,
              fontFamily: 'Arial, sans-serif'
            }}>
              Votre assistant culinaire personnel.<br/>
              Gérez vos recettes, votre stock et planifiez vos repas !
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem',
              fontSize: '0.9rem',
              fontFamily: 'Press Start 2P, cursive'
            }}>
              Comment vous appelez-vous ?
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre prénom"
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '1rem',
                border: '3px solid #8b4513',
                borderRadius: '12px',
                fontSize: '1rem',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                background: '#FFF6B7'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
            />
            {error && (
              <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.8rem' }}>
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleCreateProfile}
            disabled={loading || !nom.trim()}
            style={{
              background: nom.trim() ? '#28a745' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontFamily: 'Press Start 2P, cursive',
              cursor: nom.trim() ? 'pointer' : 'not-allowed',
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto'
            }}
          >
            {loading ? 'Création...' : 'Commencer ! 🚀'}
          </button>
        </div>
      )
    },

    // Étape 1 : Présentation de l'interface
    {
      title: `Salut ${nom} ! 👨‍🍳`,
      content: (
        <div style={{ 
          padding: '2rem 1rem', 
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            color: '#8b4513', 
            marginBottom: '2rem',
            fontFamily: 'Press Start 2P, cursive'
          }}>
            Voici votre cuisine virtuelle !
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              borderRadius: '16px',
              padding: '1.5rem',
              margin: '1rem 0',
              border: '3px solid #8b4513'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Livre de recettes</h3>
              <p style={{ fontSize: '0.7rem', color: '#666' }}>
                Consultez, ajoutez et modifiez vos recettes
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              borderRadius: '16px',
              padding: '1.5rem',
              margin: '1rem 0',
              border: '3px solid #8b4513'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧊</div>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Frigo & Placard</h3>
              <p style={{ fontSize: '0.7rem', color: '#666' }}>
                Gérez vos ingrédients disponibles
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              borderRadius: '16px',
              padding: '1.5rem',
              margin: '1rem 0',
              border: '3px solid #8b4513'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Planning</h3>
              <p style={{ fontSize: '0.7rem', color: '#666' }}>
                Planifiez vos repas automatiquement
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontFamily: 'Press Start 2P, cursive',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto'
            }}
          >
            Suivant 👉
          </button>
        </div>
      )
    },

    // Étape 2 : Tutorial terminé
    {
      title: "C'est parti ! 🎉",
      content: (
        <div style={{ 
          padding: '2rem 1rem', 
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎊</div>
          
          <h2 style={{ 
            fontSize: '1.2rem', 
            color: '#8b4513', 
            marginBottom: '1rem',
            fontFamily: 'Press Start 2P, cursive'
          }}>
            Votre cuisine est prête !
          </h2>

          <p style={{ 
            fontSize: '0.9rem', 
            color: '#666', 
            lineHeight: 1.6,
            marginBottom: '2rem',
            fontFamily: 'Arial, sans-serif'
          }}>
            Commencez par ajouter quelques ingrédients dans votre frigo, 
            puis explorez le livre de recettes pour voir ce que vous pouvez cuisiner !
          </p>

          <div style={{ 
            background: 'rgba(40, 167, 69, 0.1)', 
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '2px solid #28a745'
          }}>
            <h3 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#28a745' }}>
              💡 Conseil de chef
            </h3>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>
              Activez les alertes de stock pour ne jamais manquer d&apos;ingrédients !
            </p>
          </div>

          <button
            onClick={() => {
              // L'onboarding se termine ici, on retourne à l'app principale
              window.location.reload();
            }}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontFamily: 'Press Start 2P, cursive',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto'
            }}
          >
            Entrer dans ma cuisine ! 🍳
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #FFF6B7, #FFD6A5)',
      zIndex: 10000,
      overflow: 'auto'
    }}>
      {/* Indicateur de progression */}
      {step > 0 && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10001
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i <= step ? '#28a745' : '#ccc',
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      )}

      {steps[step].content}
    </div>
  );
}
