import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function CorrelationMatrix({ correlationMatrix, significantCorrelations }) {
  const [selectedPair, setSelectedPair] = useState(null);

  if (!correlationMatrix) return null;

  const { matrix, labels } = correlationMatrix;

  // Fonction pour obtenir la couleur selon la corrélation
  const getColor = (value) => {
    if (value === null) return 'bg-gray-100';

    const absValue = Math.abs(value);
    if (absValue >= 0.7) return value > 0 ? 'bg-red-600' : 'bg-blue-600';
    if (absValue >= 0.5) return value > 0 ? 'bg-red-400' : 'bg-blue-400';
    if (absValue >= 0.3) return value > 0 ? 'bg-red-300' : 'bg-blue-300';
    return 'bg-gray-200';
  };

  const getTextColor = (value) => {
    if (value === null) return 'text-gray-500';
    const absValue = Math.abs(value);
    return absValue >= 0.5 ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
        <Activity className="w-6 h-6 mr-2 text-blue-600" />
        Matrice de corrélation
      </h2>

      {/* Légende */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">Corrélation:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-xs">Négative forte</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-xs">Faible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-xs">Positive forte</span>
          </div>
        </div>
      </div>

      {/* Matrice de corrélation */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500"></th>
              {labels.map((label, idx) => (
                <th
                  key={idx}
                  className="px-2 py-2 text-center text-xs font-medium text-gray-500"
                  style={{ minWidth: '60px' }}
                >
                  <div className="transform -rotate-45 origin-left truncate" style={{ maxWidth: '80px' }}>
                    {label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="px-2 py-2 text-xs font-medium text-gray-700 sticky left-0 bg-white">
                  {labels[i]}
                </td>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className={`px-2 py-2 text-center text-xs ${getColor(value)} ${getTextColor(value)} font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => value !== null && i !== j && setSelectedPair({ var1: labels[i], var2: labels[j], r: value })}
                  >
                    {value !== null ? value.toFixed(2) : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top corrélations significatives */}
      {significantCorrelations && significantCorrelations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top {Math.min(10, significantCorrelations.length)} corrélations significatives
          </h3>

          <div className="space-y-2">
            {significantCorrelations.slice(0, 10).map((corr, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedPair({ var1: corr.var1, var2: corr.var2, r: corr.correlation })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {corr.correlation > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {corr.var1} ↔ {corr.var2}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-semibold ${
                      Math.abs(corr.correlation) >= 0.7 ? 'text-purple-700' :
                      Math.abs(corr.correlation) >= 0.5 ? 'text-blue-700' :
                      'text-gray-700'
                    }`}>
                      r = {corr.correlation.toFixed(3)}
                    </span>
                    <span className="text-xs text-gray-500">
                      p = {corr.pValue.toFixed(4)}
                    </span>

                    {/* Barre de force */}
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          corr.correlation > 0 ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interprétation */}
                <p className="text-xs text-gray-600 mt-1 ml-6">
                  {Math.abs(corr.correlation) >= 0.7 ? 'Corrélation très forte' :
                   Math.abs(corr.correlation) >= 0.5 ? 'Corrélation forte' :
                   Math.abs(corr.correlation) >= 0.3 ? 'Corrélation modérée' :
                   'Corrélation faible'}
                  {' • '}
                  {corr.correlation > 0 ? 'Les deux variables évoluent dans le même sens' : 'Les deux variables évoluent en sens inverse'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info si pas de corrélations significatives */}
      {(!significantCorrelations || significantCorrelations.length === 0) && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Aucune corrélation significative détectée (|r| &gt; 0.3 et p &lt; 0.05)
          </p>
        </div>
      )}

      {/* Modal ou détail de la paire sélectionnée */}
      {selectedPair && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPair(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Corrélation: {selectedPair.var1} ↔ {selectedPair.var2}
              </h3>
              <button
                onClick={() => setSelectedPair(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-center">
                r = {selectedPair.r.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600 text-center mt-2">
                Coefficient de corrélation de Pearson
              </p>
            </div>

            <div className="text-sm text-gray-700">
              <p className="mb-2">
                <strong>Interprétation:</strong> {Math.abs(selectedPair.r) >= 0.7 ? 'Très forte' :
                Math.abs(selectedPair.r) >= 0.5 ? 'Forte' :
                Math.abs(selectedPair.r) >= 0.3 ? 'Modérée' : 'Faible'} corrélation {selectedPair.r > 0 ? 'positive' : 'négative'}
              </p>
              <p>
                <strong>Signification:</strong> {selectedPair.r > 0 ?
                  'Quand ' + selectedPair.var1 + ' augmente, ' + selectedPair.var2 + ' tend à augmenter également.' :
                  'Quand ' + selectedPair.var1 + ' augmente, ' + selectedPair.var2 + ' tend à diminuer.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
