import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

interface ReceiptScannerProps {
  onScanSuccess: (items: ReceiptItem[]) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
  isActive: boolean;
}

export interface ReceiptItem {
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
  confidence: number;
}

// Fonction utilitaire pour nettoyer les noms de produits
const cleanProductName = (name: string): string => {
  return name
    .replace(/[^\w\sÀ-ÿ\-]/g, '') // Supprimer caractères spéciaux
    .replace(/\s+/g, ' ') // Normaliser espaces
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Fonction pour parser le texte du ticket
const parseReceiptText = (text: string): ReceiptItem[] => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const items: ReceiptItem[] = [];

  // Patterns pour détecter les produits alimentaires
  const productPatterns = [
    /([A-Za-zÀ-ÿ\s\-]+)\s+(\d+[,.]?\d*)\s*([€$])/,  // Nom Prix
    /(\d+[,.]?\d*)\s*x?\s*([A-Za-zÀ-ÿ\s\-]+)\s+(\d+[,.]?\d*)\s*([€$])/,  // Quantité Nom Prix
    /([A-Za-zÀ-ÿ\s\-]+)\s+(\d+[,.]?\d*)\s*(kg|g|l|ml|pcs?)\s+(\d+[,.]?\d*)\s*([€$])/,  // Nom Quantité Unité Prix
  ];

  // Mots-clés à exclure (non alimentaires)
  const excludeKeywords = [
    'sac', 'plastique', 'ticket', 'total', 'tva', 'cb', 'carte', 'espèces',
    'caisse', 'reçu', 'facture', 'merci', 'retour', 'change', 'solde'
  ];

  // Mots-clés alimentaires pour augmenter la confiance
  const foodKeywords = [
    'pain', 'lait', 'fromage', 'yaourt', 'beurre', 'œuf', 'poisson', 'viande',
    'pomme', 'banane', 'salade', 'tomate', 'carotte', 'oignon', 'ail',
    'pâtes', 'riz', 'farine', 'sucre', 'sel', 'huile', 'vinaigre',
    'bio', 'frais', 'surgelé', 'conserve'
  ];

  lines.forEach(line => {
    const cleanLine = line.toLowerCase();
    
    // Exclure les lignes avec des mots-clés non alimentaires
    if (excludeKeywords.some(keyword => cleanLine.includes(keyword))) {
      return;
    }

    // Essayer les différents patterns
    for (const pattern of productPatterns) {
      const match = line.match(pattern);
      if (match) {
        let name = '';
        let quantity = 1;
        let unit = 'pièce';
        let price = 0;
        let confidence = 0.6;

        // Analyser selon le pattern
        if (pattern === productPatterns[0]) {
          // Pattern: Nom Prix
          name = match[1].trim();
          price = parseFloat(match[2].replace(',', '.'));
        } else if (pattern === productPatterns[1]) {
          // Pattern: Quantité Nom Prix
          quantity = parseFloat(match[1].replace(',', '.'));
          name = match[2].trim();
          price = parseFloat(match[3].replace(',', '.'));
        } else if (pattern === productPatterns[2]) {
          // Pattern: Nom Quantité Unité Prix
          name = match[1].trim();
          quantity = parseFloat(match[2].replace(',', '.'));
          unit = match[3];
          price = parseFloat(match[4].replace(',', '.'));
          confidence = 0.8; // Plus de confiance avec unité
        }

        // Augmenter la confiance si contient des mots-clés alimentaires
        if (foodKeywords.some(keyword => cleanLine.includes(keyword))) {
          confidence += 0.2;
        }

        // Filtrer les noms trop courts ou suspects
        if (name.length >= 3 && !name.match(/^\d+$/)) {
          items.push({
            name: cleanProductName(name),
            quantity,
            unit,
            price,
            confidence: Math.min(confidence, 1.0)
          });
        }
        break;
      }
    }
  });

  // Trier par confiance et retourner les meilleurs résultats
  return items
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 20); // Limiter à 20 articles
};

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  onScanSuccess,
  onScanError,
  onClose,
  isActive
}) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const scanReceipt = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setProgress(0);

    try {
      const { data: { text } } = await Tesseract.recognize(
        selectedFile,
        'fra', // Français
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      console.log('📄 Texte extrait du ticket:', text);
      
      const items = parseReceiptText(text);
      console.log('🛒 Articles détectés:', items);
      
      onScanSuccess(items);
      
    } catch (error) {
      console.error('Erreur scan ticket:', error);
      if (onScanError) {
        onScanError('Erreur lors du scan du ticket');
      }
    } finally {
      setScanning(false);
      setProgress(0);
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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '2px solid rgba(255, 255, 255, 0.1)'
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
            🧾 Scanner Ticket de Caisse
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

        {/* Zone de téléchargement */}
        <div style={{
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {!selectedFile ? (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
                Sélectionnez une photo de votre ticket
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                📂 Choisir une image
              </button>
            </div>
          ) : (
            <div>
              <img
                src={previewUrl!}
                alt="Aperçu ticket"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: '#4CAF50', fontSize: '0.8rem' }}>
                ✅ Image sélectionnée: {selectedFile.name}
              </p>
            </div>
          )}
        </div>

        {/* Barre de progression */}
        {scanning && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#ffd93d', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              🔍 Analyse en cours... {progress}%
            </p>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.7rem',
          color: '#e2e8f0'
        }}>
          <p><strong>💡 Conseils pour un meilleur scan :</strong></p>
          <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1rem' }}>
            <li>Utilisez un bon éclairage</li>
            <li>Assurez-vous que le texte est lisible</li>
            <li>Évitez les reflets et ombres</li>
            <li>Gardez le ticket bien à plat</li>
          </ul>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {selectedFile && !scanning && (
            <button
              onClick={scanReceipt}
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
              🧾 Analyser ticket
            </button>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
            style={{
              background: scanning ? 'rgba(74, 85, 104, 0.5)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: scanning ? 'not-allowed' : 'pointer'
            }}
          >
            📂 Changer image
          </button>
          
          <button
            onClick={onClose}
            disabled={scanning}
            style={{
              background: 'rgba(74, 85, 104, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: scanning ? 'not-allowed' : 'pointer'
            }}
          >
            ❌ Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
