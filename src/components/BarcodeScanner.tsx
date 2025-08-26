import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
  isActive: boolean;
  testMode?: boolean; // Nouveau: mode test sans caméra
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  onClose,
  isActive,
  testMode = false
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isActive && !testMode) {
      requestCameraPermission();
    }

    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, testMode]);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (error) {
      console.warn('Caméra non accessible:', error);
      setHasPermission(false);
      // En développement, permettre de continuer avec un mode de test
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        alert('🔧 Mode développement: Caméra non disponible en HTTP local.\n\n💡 Pour tester la caméra:\n1. Utilisez HTTPS\n2. Ou testez directement sur mobile en production');
      }
      return;
    }

    await startScanning();
  };

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('barcode-scanner');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // Caméra arrière préférée
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          console.log('📱 Code-barres scanné:', decodedText);
          onScanSuccess(decodedText);
          stopScanning();
        },
        (error) => {
          // Erreurs de scan silencieuses (normales pendant le scan)
          if (onScanError && !error.includes('No QR code found')) {
            onScanError(error);
          }
        }
      );

      setScanning(true);
    } catch (error) {
      console.error('Erreur démarrage scanner:', error);
      setHasPermission(false);
      if (onScanError) {
        onScanError('Impossible d\'accéder à la caméra');
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setScanning(false);
      } catch (error) {
        console.error('Erreur arrêt scanner:', error);
      }
    }
  };

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #2d3748, #4a5568)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.8rem',
            color: '#ffd93d',
            margin: 0
          }}>
            📱 Scanner Code-Barres
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid #ff6b6b',
              borderRadius: '6px',
              color: '#ff6b6b',
              padding: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Zone de scan ou messages */}
        {hasPermission === false ? (
          <div style={{ color: '#ff6b6b', marginBottom: '1rem' }}>
            <p>❌ Accès caméra refusé ou non disponible</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Veuillez autoriser l&apos;accès à la caméra pour scanner
            </p>
            
            {/* Mode test en développement */}
            {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(76, 175, 80, 0.2)',
                borderRadius: '8px',
                border: '1px solid #4CAF50'
              }}>
                <p style={{ color: '#4CAF50', fontSize: '0.7rem', marginBottom: '1rem' }}>
                  🧪 Mode test - Ingrédients de base
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      console.log('🧪 Test scan: Banane');
                      onScanSuccess('test_banane');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFE135, #FFA726)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.55rem',
                      cursor: 'pointer'
                    }}
                  >
                    🍌 Banane (1kg)
                  </button>

                  <button
                    onClick={() => {
                      console.log('🧪 Test scan: Yaourt');
                      onScanSuccess('test_yaourt');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #E1F5FE, #B3E5FC)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.55rem',
                      cursor: 'pointer'
                    }}
                  >
                    🥛 Yaourt (4 pots)
                  </button>

                  <button
                    onClick={() => {
                      console.log('🧪 Test scan: Poulet');
                      onScanSuccess('test_poulet');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFCDD2, #F48FB1)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.55rem',
                      cursor: 'pointer'
                    }}
                  >
                    🍗 Poulet (500g)
                  </button>

                  <button
                    onClick={() => {
                      console.log('🧪 Test scan: Carotte');
                      onScanSuccess('test_carotte');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFE0B2, #FFCC02)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.55rem',
                      cursor: 'pointer'
                    }}
                  >
                    🥕 Carotte (5 pièces)
                  </button>

                  <button
                    onClick={() => {
                      console.log('🧪 Test scan: Lait');
                      onScanSuccess('test_lait');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.55rem',
                      cursor: 'pointer'
                    }}
                  >
                    🥛 Lait (1L)
                  </button>

                  <button
                    onClick={() => {
                      console.log('🧪 Test scan: Fromage');
                      onScanSuccess('test_fromage');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFF9C4, #FFEB3B)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.55rem',
                      cursor: 'pointer'
                    }}
                  >
                    🧀 Fromage (200g)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div 
              id="barcode-scanner" 
              style={{
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto 1rem auto',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
            {scanning && (
              <p style={{
                color: '#4CAF50',
                fontSize: '0.8rem',
                marginBottom: '1rem'
              }}>
                🎯 Pointez la caméra vers le code-barres
              </p>
            )}
          </div>
        )}

        {/* Boutons de test (mode développement) */}
        {testMode && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.2)',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{
              color: '#ffc107',
              fontSize: '0.7rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              🧪 <strong>Mode Test</strong> - Simuler un scan
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => onScanSuccess('test_banane')}
                style={{
                  background: 'linear-gradient(135deg, #FFE135, #FFA726)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  fontSize: '0.55rem',
                  cursor: 'pointer'
                }}
              >
                🍌 Banane (1kg)
              </button>
              <button
                onClick={() => onScanSuccess('test_yaourt')}
                style={{
                  background: 'linear-gradient(135deg, #E1F5FE, #B3E5FC)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  fontSize: '0.55rem',
                  cursor: 'pointer'
                }}
              >
                🥛 Yaourt (4 pots)
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          fontSize: '0.7rem',
          color: '#e2e8f0'
        }}>
          {testMode ? (
            <>
              <p><strong>🧪 Mode Test :</strong></p>
              <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1rem' }}>
                <li>Cliquez sur un des boutons ci-dessus</li>
                <li>L'API OpenFoodFacts sera interrogée</li>
                <li>Le produit sera ajouté automatiquement</li>
                <li>Aucun accès caméra requis</li>
              </ul>
            </>
          ) : (
            <>
              <p><strong>💡 Instructions :</strong></p>
              <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1rem' }}>
                <li>Centrez le code-barres dans le cadre</li>
                <li>Gardez l'appareil stable</li>
                <li>Assurez-vous d&apos;avoir un bon éclairage</li>
              </ul>
            </>
          )}
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          {!scanning && hasPermission !== false && !testMode && (
            <button
              onClick={startScanning}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.6rem',
                cursor: 'pointer'
              }}
            >
              📱 Démarrer scan
            </button>
          )}
          
          <button
            onClick={onClose}
            style={{
              background: 'rgba(74, 85, 104, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: 'pointer'
            }}
          >
            ❌ Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
