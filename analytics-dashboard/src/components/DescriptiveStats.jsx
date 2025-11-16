import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

export default function DescriptiveStats({ descriptiveStats, categoricalStats, normalityTests }) {
  const [expandedNumeric, setExpandedNumeric] = useState(new Set());
  const [expandedCategorical, setExpandedCategorical] = useState(new Set());

  if (!descriptiveStats && !categoricalStats) return null;

  const toggleNumeric = (col) => {
    const newSet = new Set(expandedNumeric);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      newSet.add(col);
    }
    setExpandedNumeric(newSet);
  };

  const toggleCategorical = (col) => {
    const newSet = new Set(expandedCategorical);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      newSet.add(col);
    }
    setExpandedCategorical(newSet);
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
        Analyses descriptives
      </h2>

      {/* Variables numériques */}
      {descriptiveStats && Object.keys(descriptiveStats).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Variables numériques</h3>

          <div className="space-y-4">
            {Object.entries(descriptiveStats).map(([column, stats]) => (
              <div key={column} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => toggleNumeric(column)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center">
                    {expandedNumeric.has(column) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
                    )}
                    <span className="font-medium text-gray-900">{column}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>μ = {stats.mean.toFixed(2)}</span>
                    <span>σ = {stats.std.toFixed(2)}</span>
                    <span>n = {stats.n}</span>
                  </div>
                </button>

                {/* Contenu détaillé */}
                {expandedNumeric.has(column) && (
                  <div className="p-4 bg-white">
                    {/* Statistiques en grille */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Moyenne</p>
                        <p className="text-lg font-semibold">{stats.mean.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Médiane</p>
                        <p className="text-lg font-semibold">{stats.median.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Écart-type</p>
                        <p className="text-lg font-semibold">{stats.std.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Variance</p>
                        <p className="text-lg font-semibold">{stats.variance.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Minimum</p>
                        <p className="text-lg font-semibold">{stats.min.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Q1 (25%)</p>
                        <p className="text-lg font-semibold">{stats.q1.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Q3 (75%)</p>
                        <p className="text-lg font-semibold">{stats.q3.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Maximum</p>
                        <p className="text-lg font-semibold">{stats.max.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IQR</p>
                        <p className="text-lg font-semibold">{stats.iqr.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">CV (%)</p>
                        <p className="text-lg font-semibold">{stats.cv.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Asymétrie</p>
                        <p className="text-lg font-semibold">{stats.skewness.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Kurtosis</p>
                        <p className="text-lg font-semibold">{stats.kurtosis.toFixed(4)}</p>
                      </div>
                    </div>

                    {/* Test de normalité */}
                    {normalityTests && normalityTests[column] && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {normalityTests[column].isNormal ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {normalityTests[column].interpretation}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            W = {normalityTests[column].statistic?.toFixed(4)},
                            p = {normalityTests[column].pValue?.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Box plot simple (représentation textuelle) */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Distribution (box plot)</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-600">Min</span>
                        <div className="flex-1 relative h-8 bg-gray-100 rounded">
                          <div
                            className="absolute h-full bg-blue-200 border-l-2 border-r-2 border-blue-600"
                            style={{
                              left: `${((stats.q1 - stats.min) / (stats.max - stats.min)) * 100}%`,
                              right: `${(1 - (stats.q3 - stats.min) / (stats.max - stats.min)) * 100}%`
                            }}
                          />
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-600"
                            style={{
                              left: `${((stats.median - stats.min) / (stats.max - stats.min)) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-gray-600">Max</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variables catégorielles */}
      {categoricalStats && Object.keys(categoricalStats).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Variables catégorielles</h3>

          <div className="space-y-4">
            {Object.entries(categoricalStats).map(([column, stats]) => (
              <div key={column} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => toggleCategorical(column)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center">
                    {expandedCategorical.has(column) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
                    )}
                    <span className="font-medium text-gray-900">{column}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{stats.uniqueValues} modalités</span>
                    <span>Mode: {stats.mode}</span>
                  </div>
                </button>

                {/* Contenu détaillé */}
                {expandedCategorical.has(column) && (
                  <div className="p-4 bg-white">
                    {/* Métriques */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Valeurs uniques</p>
                        <p className="text-lg font-semibold">{stats.uniqueValues}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-lg font-semibold">{stats.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mode</p>
                        <p className="text-lg font-semibold">{stats.mode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Entropie</p>
                        <p className="text-lg font-semibold">{stats.entropy.toFixed(3)}</p>
                      </div>
                    </div>

                    {/* Distribution */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Distribution</p>

                      {/* Graphique en barres */}
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.distribution.slice(0, 10)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="value"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value) => [`${value} (${((value / stats.total) * 100).toFixed(1)}%)`, 'Nombre']}
                          />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {stats.distribution.slice(0, 10).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Tableau */}
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Valeur</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Pourcentage</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Barre</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {stats.distribution.slice(0, 15).map((item, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2 font-medium">{item.value}</td>
                                <td className="px-3 py-2">{item.count}</td>
                                <td className="px-3 py-2">{item.percentage.toFixed(2)}%</td>
                                <td className="px-3 py-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
