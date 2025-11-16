import React from 'react';
import { Database, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function DataOverview({ overview }) {
  if (!overview) return null;

  const getQualityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Database className="w-6 h-6 mr-2 text-blue-600" />
          Vue d'ensemble des données
        </h2>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Lignes</p>
          <p className="text-2xl font-bold text-blue-900">{overview.rowCount.toLocaleString()}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Colonnes</p>
          <p className="text-2xl font-bold text-purple-900">{overview.columnCount}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-medium">Valeurs manquantes</p>
          <p className="text-2xl font-bold text-orange-900">
            {overview.missingPercentage.toFixed(2)}%
          </p>
        </div>

        <div className={`${getQualityBgColor(overview.qualityScore)} rounded-lg p-4`}>
          <p className={`text-sm font-medium ${getQualityColor(overview.qualityScore)}`}>
            Score de qualité
          </p>
          <p className={`text-2xl font-bold ${getQualityColor(overview.qualityScore)}`}>
            {overview.qualityScore.toFixed(1)}/100
          </p>
        </div>
      </div>

      {/* Types de données */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Types de données</h3>
        <div className="flex flex-wrap gap-2">
          {overview.dataTypes.numeric > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {overview.dataTypes.numeric} numériques
            </span>
          )}
          {overview.dataTypes.categorical > 0 && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {overview.dataTypes.categorical} catégorielles
            </span>
          )}
          {overview.dataTypes.temporal > 0 && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {overview.dataTypes.temporal} temporelles
            </span>
          )}
          {overview.dataTypes.text > 0 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {overview.dataTypes.text} textuelles
            </span>
          )}
          {overview.dataTypes.boolean > 0 && (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              {overview.dataTypes.boolean} booléennes
            </span>
          )}
        </div>
      </div>

      {/* Détails des colonnes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Détails des colonnes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Colonne
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Valeurs valides
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Valeurs uniques
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Manquantes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overview.columnAnalysis.map((col, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                    {col.name}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      col.type === 'numeric' ? 'bg-blue-100 text-blue-700' :
                      col.type === 'categorical' ? 'bg-green-100 text-green-700' :
                      col.type === 'temporal' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {col.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {col.validValues} / {col.totalValues}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {col.uniqueValues} ({col.uniquePercentage.toFixed(1)}%)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {col.missingPercentage > 0 ? (
                      <span className={`${
                        col.missingPercentage > 50 ? 'text-red-600' :
                        col.missingPercentage > 20 ? 'text-orange-600' :
                        'text-yellow-600'
                      }`}>
                        {col.missingPercentage.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-green-600">0%</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertes */}
      {overview.qualityScore < 70 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Attention à la qualité des données</p>
            <p className="text-sm text-yellow-700 mt-1">
              Le score de qualité est inférieur à 70. Vérifiez les valeurs manquantes et les types de données.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
