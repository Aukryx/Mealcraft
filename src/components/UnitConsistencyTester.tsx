import React, { useState, useEffect } from 'react';
import { analyzeUnitInconsistencies, getUnitConsistencyReport, generateNormalizedIngredients } from '../utils/unitAnalyzer';

interface Inconsistency {
  name: string;
  currentUnit: string;
  recommendedUnit: string;
  category: string;
}

export const UnitConsistencyTester: React.FC = () => {
  const [inconsistencies, setInconsistencies] = useState<Inconsistency[]>([]);
  const [normalizedData, setNormalizedData] = useState<string>('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const issues = analyzeUnitInconsistencies();
    setInconsistencies(issues);
    
    // Génération du code normalisé
    const normalized = generateNormalizedIngredients();
    const codeString = `export const ingredientsDeBase = ${JSON.stringify(normalized, null, 2)};`;
    setNormalizedData(codeString);
  }, []);

  const runReport = () => {
    getUnitConsistencyReport();
    setShowReport(true);
  };

  const groupedInconsistencies = inconsistencies.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Inconsistency[]>);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔍 Analyseur de Consistance des Unités
      </h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-blue-800 font-semibold">
              {inconsistencies.length} inconsistances détectées
            </span>
          </div>
          <button
            onClick={runReport}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Rapport Console
          </button>
        </div>
      </div>

      {inconsistencies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Inconsistances par catégorie :</h3>
          <div className="space-y-4">
            {Object.entries(groupedInconsistencies).map(([category, items]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 uppercase">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((item, index) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-red-600">
                        {item.currentUnit} → {item.recommendedUnit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Code normalisé généré :</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {normalizedData.substring(0, 1000)}
            {normalizedData.length > 1000 && (
              <span className="text-blue-600">... (code tronqué, voir console pour le code complet)</span>
            )}
          </pre>
        </div>
        <button
          onClick={() => {
            console.log('📋 CODE NORMALISÉ COMPLET :');
            console.log(normalizedData);
          }}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Afficher le code complet dans la console
        </button>
      </div>

      {showReport && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800">
            ✅ Rapport généré dans la console ! Ouvrez les outils de développement pour voir les détails.
          </p>
        </div>
      )}
    </div>
  );
};

export default UnitConsistencyTester;
