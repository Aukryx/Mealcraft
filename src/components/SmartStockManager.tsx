import React, { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import ReceiptScanner, { ReceiptItem } from './ReceiptScanner';
import OpenFoodFactsService, { ProductInfo } from '../services/OpenFoodFactsService';
import { useStock } from '../hooks/useStock';
import { useUserProfile } from '../hooks/useUserProfile';
import { normalizeIngredientUnit } from '../utils/unitConverter';
import UnitEquivalenceDisplay, { InlineEquivalence } from './UnitEquivalenceDisplay';

interface SmartStockManagerProps {
  onClose: () => void;
  isActive: boolean;
}

type ScanMode = 'menu' | 'barcode' | 'receipt' | 'results';

interface ScanResult {
  type: 'barcode' | 'receipt';
  items: (ProductInfo | ReceiptItem)[];
}

export const SmartStockManager: React.FC<SmartStockManagerProps> = ({
  onClose,
  isActive
}) => {
  const [mode, setMode] = useState<ScanMode>('menu');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showEquivalences, setShowEquivalences] = useState(false);
  
  const { stock, addIngredient } = useStock();
  const { profile } = useUserProfile();
  
  // Détection du mode développement
  const isDev = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost';

  // Gestion du scan de code-barres
  const handleBarcodeSuccess = async (barcode: string) => {
    console.log('📱 Code-barres reçu dans SmartStockManager:', barcode);
    setLoading(true);
    try {
      const product = await OpenFoodFactsService.getProductByBarcode(barcode);
      console.log('📦 Produit retourné par OpenFoodFacts:', product);
      
      if (product) {
        console.log('✅ Produit valide, affichage des résultats');
        setScanResult({
          type: 'barcode',
          items: [product]
        });
        setMode('results');
      } else {
        console.log('❌ Produit non trouvé');
        alert('Produit non trouvé dans la base de données');
        setMode('menu');
      }
    } catch (error) {
      console.error('❌ Erreur recherche produit:', error);
      alert('Erreur lors de la recherche du produit');
      setMode('menu');
    } finally {
      setLoading(false);
    }
  };

  // Gestion du scan de ticket
  const handleReceiptSuccess = (items: ReceiptItem[]) => {
    setScanResult({
      type: 'receipt',
      items
    });
    setMode('results');
  };

  // Gestion des erreurs
  const handleScanError = (error: string) => {
    console.error('Erreur scan:', error);
    alert(`Erreur: ${error}`);
  };

  // Basculer la sélection d'un item
  const toggleItemSelection = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  // Sélectionner tous les items
  const selectAllItems = () => {
    if (!scanResult) return;
    const allIndexes = scanResult.items.map((_, index) => index);
    setSelectedItems(new Set(allIndexes));
  };

  // Désélectionner tous les items
  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  // Ajouter les items sélectionnés au stock avec accumulation intelligente
  const addSelectedToStock = async () => {
    if (!scanResult || !profile) return;

    const itemsToAdd = Array.from(selectedItems).map(index => scanResult.items[index]);
    let addedCount = 0;
    
    for (const item of itemsToAdd) {
      try {
        if (scanResult.type === 'barcode') {
          const product = item as ProductInfo;
          
          // Pour les produits avec correspondance locale, utiliser directement l'ingrédient de base
          if (product.matchedIngredient) {
            // Normaliser l'unité selon le système de conversion
            const quantite = product.extractedQuantity || 1;
            const currentUnit = product.matchedIngredient.unite || 'g';
            const normalizedUnit = normalizeIngredientUnit(
              product.matchedIngredient.nom,
              product.matchedIngredient.categorie,
              currentUnit
            );
            
            const normalizedIngredient = {
              ...product.matchedIngredient,
              quantite,
              unite: normalizedUnit
            };
            
            const success = addIngredient(normalizedIngredient);
            if (success) {
              console.log(`✅ Ingrédient ajouté/mis à jour: ${normalizedIngredient.nom} x${normalizedIngredient.quantite} ${normalizedIngredient.unite}`);
              addedCount++;
            } else {
              console.error(`❌ Échec ajout: ${normalizedIngredient.nom}`);
            }
          } else {
            console.log(`⚠️ Produit externe ignoré: ${product.name} (pas de correspondance dans la base)`);
          }
        } else {
          // Gestion des items de ticket - simplifiée
          const receiptItem = item as ReceiptItem;
          console.log(`⚠️ Item de ticket ignoré: ${receiptItem.name} (mode test uniquement pour ingrédients de base)`);
        }
      } catch (error) {
        console.error('❌ Erreur ajout item:', error);
      }
    }

    if (addedCount > 0) {
      alert(`✅ ${addedCount} ingrédient(s) ajouté(s) avec succès au stock !`);
    } else {
      alert(`⚠️ Aucun ingrédient ajouté. Vérifiez que les produits correspondent à votre base de données.`);
    }
    
    onClose();
  };

  if (!isActive) return null;

  return (
    <div>
      {/* Menu principal */}
      {mode === 'menu' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
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
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.9rem',
                color: '#ffd93d',
                margin: 0
              }}>
                🎯 Smart Stock Manager
              </h2>
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

            {/* Options de scan */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <button
                onClick={() => setMode('barcode')}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                <div>Scanner Code-Barres</div>
                <div style={{ fontSize: '0.5rem', opacity: 0.8, marginTop: '0.5rem' }}>
                  {isDev ? '🧪 Mode Test - Simuler un scan' : 'Scannez un produit pour l\'identifier automatiquement'}
                </div>
              </button>

              <button
                onClick={() => setMode('receipt')}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
                <div>Scanner Ticket de Caisse</div>
                <div style={{ fontSize: '0.5rem', opacity: 0.8, marginTop: '0.5rem' }}>
                  Analysez votre ticket pour extraire tous les produits
                </div>
              </button>
            </div>

            {/* Informations */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '0.6rem',
              color: '#e2e8f0'
            }}>
              <p style={{ margin: 0 }}>
                💡 <strong>Astuce :</strong> Ces fonctionnalités utilisent votre caméra pour identifier automatiquement les produits et remplir votre stock intelligent !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scanner de code-barres */}
      <BarcodeScanner
        isActive={mode === 'barcode'}
        onScanSuccess={handleBarcodeSuccess}
        onScanError={handleScanError}
        onClose={() => setMode('menu')}
        testMode={isDev}
      />

      {/* Scanner de ticket */}
      <ReceiptScanner
        isActive={mode === 'receipt'}
        onScanSuccess={handleReceiptSuccess}
        onScanError={handleScanError}
        onClose={() => setMode('menu')}
      />

      {/* Résultats du scan */}
      {mode === 'results' && scanResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2d3748, #4a5568)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '700px',
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
                {scanResult.type === 'barcode' ? '📱 Produit Scanné' : '🧾 Articles Détectés'}
              </h3>
              <button
                onClick={() => setMode('menu')}
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

            {/* Actions de sélection */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={selectAllItems}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Tout sélectionner
              </button>
              
              <button
                onClick={deselectAllItems}
                style={{
                  background: 'rgba(74, 85, 104, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                ❌ Tout désélectionner
              </button>
              
              <button
                onClick={() => setShowEquivalences(!showEquivalences)}
                style={{
                  background: 'rgba(33, 150, 243, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                📏 {showEquivalences ? 'Masquer' : 'Guide'} équivalences
              </button>
            </div>

            {/* Liste des items */}
            <div style={{
              maxHeight: '400px',
              overflow: 'auto',
              marginBottom: '1.5rem'
            }}>
              {scanResult.items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => toggleItemSelection(index)}
                  style={{
                    background: selectedItems.has(index) 
                      ? 'rgba(76, 175, 80, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedItems.has(index) 
                      ? '2px solid #4CAF50' 
                      : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(index)}
                      onChange={() => toggleItemSelection(index)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 0.5rem 0',
                        color: '#e2e8f0',
                        fontSize: '0.8rem'
                      }}>
                        {scanResult.type === 'barcode' 
                          ? (item as ProductInfo).name 
                          : (item as ReceiptItem).name}
                      </h4>
                      
                      <div style={{
                        fontSize: '0.6rem',
                        color: '#a0aec0',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}>
                        {scanResult.type === 'barcode' ? (
                          <>
                            {(() => {
                              const product = item as ProductInfo;
                              const existingStock = stock.find(s => 
                                s.id === product.matchedIngredient?.id || 
                                s.id === product.name.toLowerCase().replace(/\s+/g, '_')
                              );
                              
                              return (
                                <>
                                  {product.matchedIngredient && (
                                    <span style={{ color: '#4CAF50' }}>
                                      ✅ Correspondance: {product.matchedIngredient.nom}
                                    </span>
                                  )}
                                  {product.extractedQuantity && (
                                    <span>
                                      📊 Quantité: {product.extractedQuantity} {product.unit}
                                      {product.matchedIngredient && (
                                        <InlineEquivalence 
                                          unit={product.unit || 'g'} 
                                          ingredientName={product.matchedIngredient.nom} 
                                        />
                                      )}
                                    </span>
                                  )}
                                  {existingStock && (
                                    <span style={{ color: '#ffd93d' }}>
                                      📈 Stock actuel: {existingStock.quantite || 0} → {(existingStock.quantite || 0) + (product.extractedQuantity || 1)}
                                    </span>
                                  )}
                                  <span>� {product.category}</span>
                                  {product.brand && (
                                    <span>🏷️ {product.brand}</span>
                                  )}
                                  {product.confidence && (
                                    <span>🎯 Confiance: {Math.round(product.confidence * 100)}%</span>
                                  )}
                                </>
                              );
                            })()}
                          </>
                        ) : (
                          <>
                            {(() => {
                              const receiptItem = item as ReceiptItem;
                              const existingStock = stock.find(s => 
                                s.id === receiptItem.name.toLowerCase().replace(/\s+/g, '_')
                              );
                              
                              return (
                                <>
                                  <span>📊 Confiance: {Math.round(receiptItem.confidence * 100)}%</span>
                                  <span>📏 {receiptItem.quantity} {receiptItem.unit}</span>
                                  {existingStock && (
                                    <span style={{ color: '#ffd93d' }}>
                                      📈 Stock: {existingStock.quantite || 0} → {(existingStock.quantite || 0) + (receiptItem.quantity || 1)}
                                    </span>
                                  )}
                                  {receiptItem.price && (
                                    <span>💰 {receiptItem.price}€</span>
                                  )}
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Guide des équivalences */}
            {showEquivalences && (
              <UnitEquivalenceDisplay 
                compact={true}
                showAllUnits={true}
              />
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={addSelectedToStock}
                disabled={selectedItems.size === 0}
                style={{
                  background: selectedItems.size > 0 
                    ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                    : 'rgba(74, 85, 104, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: selectedItems.size > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                🎯 Ajouter au stock ({selectedItems.size})
              </button>
              
              <button
                onClick={() => setMode('menu')}
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
                🔄 Nouveau scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2d3748, #4a5568)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            color: '#e2e8f0'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <p>Recherche du produit...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartStockManager;
