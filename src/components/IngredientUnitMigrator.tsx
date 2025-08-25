// Composant pour migrer les unités abstraites vers unités concrètes
import React, { useState, useEffect } from 'react';
import { ingredientsDeBase } from '../data/recettesDeBase';
import { 
  migrateAllIngredients, 
  displayMigrationReport, 
  generateMigrationReport 
} from '../utils/ingredientMigration';

export const IngredientUnitMigrator: React.FC = () => {
  const [migrationReport, setMigrationReport] = useState<{
    migrations: Array<{
      ingredient: string;
      oldUnit: string;
      newUnit: string;
      defaultQuantity: number;
      description: string;
    }>;
    unchanged: Array<{
      ingredient: string;
      unit: string;
      reason: string;
    }>;
  } | null>(null);
  
  const [migratedData, setMigratedData] = useState<string>('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const report = generateMigrationReport(ingredientsDeBase);
    setMigrationReport(report);
    
    // Génération du code migré
    const migratedIngredients = migrateAllIngredients(ingredientsDeBase);
    const codeString = `export const ingredientsDeBase = ${JSON.stringify(migratedIngredients, null, 2)};`;
    setMigratedData(codeString);
  }, []);

  const runMigration = () => {
    console.log('🚀 DÉMARRAGE DE LA MIGRATION DES UNITÉS');
    displayMigrationReport(ingredientsDeBase);
    setShowReport(true);
  };

  const copyMigratedData = () => {
    navigator.clipboard.writeText(migratedData);
    alert('📋 Code migré copié dans le presse-papiers !');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f4e6 0%, #e8dcc0 100%)',
      border: '2px solid #8b7355',
      borderRadius: '12px',
      padding: '1.5rem',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '0.7rem',
      margin: '1rem',
      maxWidth: '1200px'
    }}>
      <h2 style={{ 
        color: '#8b7355', 
        marginBottom: '1rem',
        fontSize: '0.8rem' 
      }}>
        🔄 Migrateur d'Unités Abstraites → Concrètes
      </h2>

      <div style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        <p>Ce composant convertit les unités abstraites (pincée, càs, pot, etc.) en unités concrètes (g, ml).</p>
        <p><strong>Conversions principales :</strong></p>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>🥄 1 pincée → 0.5 g</li>
          <li>🥄 1 cuillère à soupe → 15 ml</li>
          <li>🥄 1 cuillère à café → 5 ml</li>
          <li>🫙 1 pot de yaourt → 125 g</li>
          <li>📦 1 sachet de levure → 11 g</li>
          <li>🍞 1 tranche de pain → 30 g</li>
          <li>🧄 1 gousse d'ail → 3 g</li>
        </ul>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={runMigration}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.8rem 1.2rem',
            cursor: 'pointer',
            fontSize: '0.7rem'
          }}
        >
          🔍 Analyser les Migrations
        </button>
        
        <button
          onClick={copyMigratedData}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.8rem 1.2rem',
            cursor: 'pointer',
            fontSize: '0.7rem'
          }}
        >
          📋 Copier le Code Migré
        </button>
      </div>

      {migrationReport && showReport && (
        <div style={{
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ 
            color: '#28a745', 
            marginBottom: '1rem',
            fontSize: '0.8rem' 
          }}>
            📊 Rapport de Migration
          </h3>

          {migrationReport.migrations.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#007bff', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                🔄 {migrationReport.migrations.length} ingrédients à migrer :
              </h4>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                background: '#f8f9fa',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                {migrationReport.migrations.map((migration, index) => (
                  <div key={index} style={{ 
                    marginBottom: '0.3rem',
                    fontSize: '0.6rem',
                    color: '#495057'
                  }}>
                    <strong>{migration.ingredient}</strong>: {migration.oldUnit} → {migration.newUnit} ({migration.description})
                  </div>
                ))}
              </div>
            </div>
          )}

          {migrationReport.unchanged.length > 0 && (
            <div>
              <h4 style={{ color: '#6c757d', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                ✅ {migrationReport.unchanged.length} ingrédients déjà en unités concrètes :
              </h4>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                background: '#f8f9fa',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                {migrationReport.unchanged.slice(0, 10).map((item, index) => (
                  <div key={index} style={{ 
                    marginBottom: '0.2rem',
                    fontSize: '0.6rem',
                    color: '#6c757d'
                  }}>
                    ✓ {item.ingredient} ({item.unit})
                  </div>
                ))}
                {migrationReport.unchanged.length > 10 && (
                  <div style={{ fontSize: '0.6rem', fontStyle: 'italic', color: '#6c757d' }}>
                    ... et {migrationReport.unchanged.length - 10} autres
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem',
            background: '#e9ecef',
            borderRadius: '4px',
            fontSize: '0.6rem',
            color: '#495057'
          }}>
            📈 <strong>Résumé :</strong> {migrationReport.migrations.length} migrations à appliquer, {migrationReport.unchanged.length} ingrédients conservés
          </div>
        </div>
      )}

      {showReport && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.6rem',
          lineHeight: '1.4'
        }}>
          <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>
            ⚠️ Instructions d'Application
          </h4>
          <p>
            1. <strong>Sauvegardez</strong> votre fichier actuel<br/>
            2. <strong>Copiez</strong> le code migré avec le bouton ci-dessus<br/>
            3. <strong>Remplacez</strong> le contenu de recettesDeBase.ts<br/>
            4. <strong>Testez</strong> l'application pour vérifier que tout fonctionne<br/>
            5. <strong>Committez</strong> les changements
          </p>
        </div>
      )}
    </div>
  );
};

export default IngredientUnitMigrator;
