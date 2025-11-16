import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { extractNumericValues } from '../utils/dataProcessor';

export default function OutlierDetection({ outliers, data }) {
  const [expandedColumns, setExpandedColumns] = useState(new Set());

  if (!outliers || Object.keys(outliers).length === 0) return null;

  const toggleColumn = (col) => {
    const newSet = new Set(expandedColumns);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      newSet.add(col);
    }
    setExpandedColumns(newSet);
  };

  // Calculer le total d'anomalies
  const totalOutliers = Object.values(outliers).reduce((sum, result) => sum + (result.count || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
          Détection d'anomalies
        </h2>

        <div className="px-4 py-2 bg-orange-100 rounded-lg">
          <p className="text-sm font-semibold text-orange-900">
            {totalOutliers} anomalie{totalOutliers > 1 ? 's' : ''} détectée{totalOutliers > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {totalOutliers === 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Aucune anomalie détectée dans les données.
          </p>
        </div>
      )}

      {totalOutliers > 0 && (
        <div className="space-y-4">
          {Object.entries(outliers).map(([column, result]) => {
            if (result.count === 0) return null;

            // Préparer les données pour le graphique
            const values = extractNumericValues(data, column);
            const scatterData = values.map((val, idx) => ({
              index: idx,
              value: val,
              isOutlier: result.indices.includes(idx)
            }));

            return (
              <div key={column} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => toggleColumn(column)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center">
                    {expandedColumns.has(column) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
                    )}
                    <span className="font-medium text-gray-900">{column}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {result.count} anomalie{result.count > 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-gray-600">
                      {result.percentage.toFixed(2)}% des données
                    </span>
                  </div>
                </button>

                {/* Contenu détaillé */}
                {expandedColumns.has(column) && (
                  <div className="p-4 bg-white">
                    {/* Statistiques */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {result.lowerBound !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500">Limite inférieure</p>
                          <p className="text-lg font-semibold">{result.lowerBound.toFixed(2)}</p>
                        </div>
                      )}
                      {result.upperBound !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500">Limite supérieure</p>
                          <p className="text-lg font-semibold">{result.upperBound.toFixed(2)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Anomalies</p>
                        <p className="text-lg font-semibold text-orange-600">{result.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pourcentage</p>
                        <p className="text-lg font-semibold text-orange-600">{result.percentage.toFixed(2)}%</p>
                      </div>
                    </div>

                    {/* Graphique scatter */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Visualisation des données (anomalies en rouge)
                      </p>
                      <ResponsiveContainer width="100%" height={250}>
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="index"
                            name="Index"
                            label={{ value: 'Index', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis
                            dataKey="value"
                            name="Valeur"
                            label={{ value: 'Valeur', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            formatter={(value, name) => [value.toFixed(4), name === 'value' ? 'Valeur' : name]}
                          />
                          <Scatter data={scatterData} fill="#3b82f6">
                            {scatterData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.isOutlier ? '#ef4444' : '#3b82f6'} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Limites visuelles (si disponibles) */}
                    {result.lowerBound !== undefined && result.upperBound !== undefined && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">
                          Les valeurs en dehors de l'intervalle [{result.lowerBound.toFixed(2)}, {result.upperBound.toFixed(2)}] sont considérées comme des anomalies.
                        </p>
                        <p className="text-xs text-gray-500">
                          Méthode: {result.threshold !== undefined ? 'Z-score (seuil = ' + result.threshold + ')' : 'IQR (Interquartile Range)'}
                        </p>
                      </div>
                    )}

                    {/* Liste des anomalies (limité à 20) */}
                    {result.outliers.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Valeurs aberrantes {result.outliers.length > 20 && `(affichage des 20 premières sur ${result.outliers.length})`}
                        </p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Index</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Valeur</th>
                                {result.zScores && (
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Z-score</th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {result.outliers.slice(0, 20).map((val, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-3 py-2">{result.indices[idx]}</td>
                                  <td className="px-3 py-2 font-medium text-orange-600">{val.toFixed(4)}</td>
                                  {result.zScores && (
                                    <td className="px-3 py-2">{result.zScores[result.indices[idx]].toFixed(2)}</td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
