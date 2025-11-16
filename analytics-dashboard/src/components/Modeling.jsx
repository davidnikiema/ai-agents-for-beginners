import React, { useState } from 'react';
import { ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Brain, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { extractNumericValues } from '../utils/dataProcessor';

export default function Modeling({ clustering, regressions, data }) {
  const [expandedRegressions, setExpandedRegressions] = useState(new Set());

  if (!clustering && (!regressions || regressions.length === 0)) return null;

  const toggleRegression = (idx) => {
    const newSet = new Set(expandedRegressions);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedRegressions(newSet);
  };

  const CLUSTER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#6366f1'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
        <Brain className="w-6 h-6 mr-2 text-purple-600" />
        Modélisation et Prédiction
      </h2>

      {/* Clustering */}
      {clustering && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Analyse de clustering (K-means)</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Nombre de clusters</p>
              <p className="text-2xl font-bold text-purple-900">{clustering.k}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Silhouette Score</p>
              <p className="text-2xl font-bold text-blue-900">
                {clustering.silhouette?.toFixed(3) || 'N/A'}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Inertie</p>
              <p className="text-2xl font-bold text-green-900">
                {clustering.inertia?.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">Itérations</p>
              <p className="text-2xl font-bold text-orange-900">{clustering.iterations}</p>
            </div>
          </div>

          {/* Info sur le silhouette score */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Silhouette Score:</strong> {
                clustering.silhouette >= 0.7 ? 'Excellente séparation des clusters' :
                clustering.silhouette >= 0.5 ? 'Bonne séparation des clusters' :
                clustering.silhouette >= 0.3 ? 'Séparation moyenne des clusters' :
                'Séparation faible des clusters'
              } ({clustering.silhouette?.toFixed(3)})
            </p>
          </div>

          {/* Graphique de clustering */}
          {clustering.columns && data && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Visualisation des clusters: {clustering.columns[0]} vs {clustering.columns[1]}
              </p>

              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    name={clustering.columns[0]}
                    label={{ value: clustering.columns[0], position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis
                    dataKey="y"
                    name={clustering.columns[1]}
                    label={{ value: clustering.columns[1], angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />

                  {/* Points par cluster */}
                  {Array.from({ length: clustering.k }).map((_, clusterIdx) => {
                    const clusterPoints = data
                      .map((row, idx) => {
                        const x = parseFloat(row[clustering.columns[0]]);
                        const y = parseFloat(row[clustering.columns[1]]);

                        if (isNaN(x) || isNaN(y)) return null;

                        // Trouver l'assignment correspondant
                        let pointIdx = 0;
                        for (let i = 0; i < idx; i++) {
                          const xTest = parseFloat(data[i][clustering.columns[0]]);
                          const yTest = parseFloat(data[i][clustering.columns[1]]);
                          if (!isNaN(xTest) && !isNaN(yTest)) pointIdx++;
                        }

                        if (clustering.assignments[pointIdx] === clusterIdx) {
                          return { x, y, cluster: clusterIdx };
                        }
                        return null;
                      })
                      .filter(p => p !== null);

                    return (
                      <Scatter
                        key={clusterIdx}
                        name={`Cluster ${clusterIdx + 1}`}
                        data={clusterPoints}
                        fill={CLUSTER_COLORS[clusterIdx % CLUSTER_COLORS.length]}
                      />
                    );
                  })}

                  {/* Centroïdes */}
                  <Scatter
                    name="Centroïdes"
                    data={clustering.centroids.map((c, idx) => ({
                      x: Array.isArray(c) ? c[0] : c,
                      y: Array.isArray(c) ? c[1] : 0,
                      cluster: idx
                    }))}
                    fill="#000000"
                    shape="cross"
                    legendType="star"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Méthode du coude */}
          {clustering.elbowAnalysis && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Analyse du coude (détermination de k optimal)</p>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  {clustering.elbowAnalysis.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Régressions */}
      {regressions && regressions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Régressions linéaires</h3>

          <div className="space-y-4">
            {regressions.map((regression, idx) => {
              // Préparer les données pour le graphique
              const xValues = extractNumericValues(data, regression.xVar);
              const yValues = extractNumericValues(data, regression.yVar);

              const scatterData = xValues.map((x, i) => ({
                x,
                y: yValues[i],
                predicted: regression.predictions[i]
              }));

              // Ligne de régression
              const regressionLine = scatterData
                .sort((a, b) => a.x - b.x)
                .map(point => ({ x: point.x, predicted: point.predicted }));

              return (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => toggleRegression(idx)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center">
                      {expandedRegressions.has(idx) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
                      )}
                      <span className="font-medium text-gray-900">
                        {regression.yVar} ~ {regression.xVar}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">R² = {(regression.r2 * 100).toFixed(2)}%</span>
                      <span className={`px-3 py-1 rounded-full ${
                        regression.r2 >= 0.7 ? 'bg-green-100 text-green-700' :
                        regression.r2 >= 0.5 ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {regression.r2 >= 0.7 ? 'Bon ajustement' :
                         regression.r2 >= 0.5 ? 'Ajustement moyen' :
                         'Faible ajustement'}
                      </span>
                    </div>
                  </button>

                  {/* Contenu détaillé */}
                  {expandedRegressions.has(idx) && (
                    <div className="p-4 bg-white">
                      {/* Métriques */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">R² (ajusté)</p>
                          <p className="text-lg font-semibold">{(regression.r2 * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">RMSE</p>
                          <p className="text-lg font-semibold">{regression.rmse.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">MAE</p>
                          <p className="text-lg font-semibold">{regression.mae.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Corrélation</p>
                          <p className="text-lg font-semibold">{regression.correlation.toFixed(3)}</p>
                        </div>
                      </div>

                      {/* Équation */}
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Équation de régression:</p>
                        <p className="text-lg font-mono text-blue-800">{regression.equation}</p>
                        <p className="text-xs text-blue-600 mt-2">{regression.interpretation}</p>
                      </div>

                      {/* Graphique */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Nuage de points avec droite de régression
                        </p>
                        <ResponsiveContainer width="100%" height={350}>
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="x"
                              name={regression.xVar}
                              label={{ value: regression.xVar, position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis
                              dataKey="y"
                              name={regression.yVar}
                              label={{ value: regression.yVar, angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />

                            {/* Points observés */}
                            <Scatter
                              name="Données observées"
                              data={scatterData}
                              fill="#3b82f6"
                            />

                            {/* Ligne de régression */}
                            <Scatter
                              name="Régression linéaire"
                              data={regressionLine}
                              fill="#ef4444"
                              line={{ stroke: '#ef4444', strokeWidth: 2 }}
                              shape={() => null}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Interprétation */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Interprétation:</strong> La régression explique {(regression.r2 * 100).toFixed(2)}%
                          de la variance de {regression.yVar}. {
                            regression.slope > 0 ?
                              `Lorsque ${regression.xVar} augmente d'une unité, ${regression.yVar} augmente en moyenne de ${Math.abs(regression.slope).toFixed(4)} unités.` :
                              `Lorsque ${regression.xVar} augmente d'une unité, ${regression.yVar} diminue en moyenne de ${Math.abs(regression.slope).toFixed(4)} unités.`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
