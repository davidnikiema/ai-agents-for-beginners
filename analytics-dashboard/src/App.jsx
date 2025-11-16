/**
 * ANALYSEUR DE DONNÉES INTELLIGENT
 *
 * Dashboard React complet pour l'analyse automatique de données
 * Supporte CSV et Excel avec analyses statistiques rigoureuses
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Upload, Download, FileText, BarChart3, TrendingUp,
  AlertCircle, CheckCircle, Settings, X, ChevronDown,
  ChevronRight, Loader2, Eye, EyeOff
} from 'lucide-react';

// Import des utilitaires
import {
  parseCSV,
  parseExcel,
  analyzeDataset,
  convertColumnTypes,
  extractNumericValues,
  extractCategoricalValues,
  calculateCorrelationMatrix
} from './utils/dataProcessor';

import {
  exportToCSV,
  exportToExcel,
  exportAnalysisToExcel,
  exportToJSON,
  generatePDFReport
} from './utils/exportUtils';

// Import des composants
import FileUploader from './components/FileUploader';
import DataOverview from './components/DataOverview';
import DescriptiveStats from './components/DescriptiveStats';
import CorrelationMatrix from './components/CorrelationMatrix';
import OutlierDetection from './components/OutlierDetection';
import Modeling from './components/Modeling';
import ExportPanel from './components/ExportPanel';

// Import des fonctions statistiques
import * as stats from './lib/statistics';

function App() {
  // États principaux
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // États d'analyse
  const [overview, setOverview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [analysisMode, setAnalysisMode] = useState('automatic'); // 'automatic' ou 'manual'
  const [selectedColumns, setSelectedColumns] = useState([]);

  // Configuration
  const [config, setConfig] = useState({
    removeDuplicates: false,
    detectOutliers: true,
    performClustering: true,
    confidenceLevel: 0.95,
    outliersMethod: 'iqr' // 'iqr' ou 'zscore'
  });

  /**
   * Gestion de l'upload de fichier
   */
  const handleFileUpload = useCallback(async (uploadedFile) => {
    setLoading(true);
    setError(null);
    setFile(uploadedFile);

    try {
      let parsedData;

      // Parser selon le type de fichier
      if (uploadedFile.name.endsWith('.csv')) {
        parsedData = await parseCSV(uploadedFile);
      } else if (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.xls')) {
        parsedData = await parseExcel(uploadedFile);
      } else {
        throw new Error('Format de fichier non supporté. Utilisez CSV ou Excel.');
      }

      if (!parsedData.data || parsedData.data.length === 0) {
        throw new Error('Le fichier ne contient pas de données valides.');
      }

      setData(parsedData.data);
      setColumns(parsedData.columns);

      // Analyser automatiquement
      await analyzeData(parsedData.data, parsedData.columns);

    } catch (err) {
      console.error('Erreur lors du traitement:', err);
      setError(err.message || 'Erreur lors du traitement du fichier');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Analyse complète des données
   */
  const analyzeData = useCallback(async (rawData, cols) => {
    try {
      // 1. Analyse du dataset
      const datasetAnalysis = analyzeDataset(rawData, cols);
      setOverview(datasetAnalysis);

      // 2. Convertir les types
      const convertedData = convertColumnTypes(rawData, datasetAnalysis.columnAnalysis);

      // 3. Statistiques descriptives pour colonnes numériques
      const numericColumns = datasetAnalysis.columnAnalysis
        .filter(col => col.type === 'numeric')
        .map(col => col.name);

      const descriptiveStats = {};
      numericColumns.forEach(col => {
        const values = extractNumericValues(convertedData, col);
        if (values.length > 0) {
          descriptiveStats[col] = stats.descriptiveStats(values);
        }
      });

      // 4. Statistiques pour colonnes catégorielles
      const categoricalColumns = datasetAnalysis.columnAnalysis
        .filter(col => col.type === 'categorical')
        .map(col => col.name);

      const categoricalStats = {};
      categoricalColumns.forEach(col => {
        const values = extractCategoricalValues(convertedData, col);
        if (values.length > 0) {
          categoricalStats[col] = stats.categoricalStats(values);
        }
      });

      // 5. Matrice de corrélation
      let correlationMatrix = null;
      let significantCorrelations = [];

      if (numericColumns.length >= 2) {
        correlationMatrix = calculateCorrelationMatrix(convertedData, numericColumns);

        // Identifier les corrélations significatives
        for (let i = 0; i < numericColumns.length; i++) {
          for (let j = i + 1; j < numericColumns.length; j++) {
            const r = correlationMatrix.matrix[i][j];
            if (r !== null && Math.abs(r) > 0.3) { // Seuil de corrélation modérée
              const values1 = extractNumericValues(convertedData, numericColumns[i]);
              const values2 = extractNumericValues(convertedData, numericColumns[j]);
              const corrTest = stats.pearsonCorrelation(values1, values2);

              if (corrTest.isSignificant) {
                significantCorrelations.push({
                  var1: numericColumns[i],
                  var2: numericColumns[j],
                  correlation: r,
                  pValue: corrTest.pValue
                });
              }
            }
          }
        }

        // Trier par corrélation absolue décroissante
        significantCorrelations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
      }

      // 6. Détection d'anomalies
      const outliers = {};
      if (config.detectOutliers) {
        numericColumns.forEach(col => {
          const values = extractNumericValues(convertedData, col);
          if (values.length > 0) {
            outliers[col] = config.outliersMethod === 'iqr'
              ? stats.detectOutliersIQR(values)
              : stats.detectOutliersZScore(values);
          }
        });
      }

      // 7. Tests de normalité
      const normalityTests = {};
      numericColumns.forEach(col => {
        const values = extractNumericValues(convertedData, col);
        if (values.length >= 3 && values.length <= 5000) {
          normalityTests[col] = stats.shapiroWilkTest(values);
        }
      });

      // 8. Clustering (si demandé et si au moins 2 colonnes numériques)
      let clustering = null;
      if (config.performClustering && numericColumns.length >= 2) {
        // Utiliser les 2 premières colonnes numériques pour le clustering
        const col1 = numericColumns[0];
        const col2 = numericColumns[1];

        const points = convertedData.map(row => [
          parseFloat(row[col1]) || 0,
          parseFloat(row[col2]) || 0
        ]).filter(p => !isNaN(p[0]) && !isNaN(p[1]));

        if (points.length >= 10) {
          // Déterminer k optimal (max 10)
          const elbowResult = stats.elbowMethod(points, Math.min(10, Math.floor(points.length / 5)));
          const optimalK = elbowResult.optimalK;

          // Faire le clustering avec k optimal
          clustering = {
            ...stats.kMeansClustering(points, optimalK),
            columns: [col1, col2],
            elbowAnalysis: elbowResult
          };
        }
      }

      // 9. Régressions (pour paires significativement corrélées)
      const regressions = [];
      if (significantCorrelations.length > 0) {
        significantCorrelations.slice(0, 5).forEach(corr => {
          const values1 = extractNumericValues(convertedData, corr.var1);
          const values2 = extractNumericValues(convertedData, corr.var2);

          if (values1.length === values2.length && values1.length >= 3) {
            const regression = stats.linearRegression(values1, values2);
            regressions.push({
              xVar: corr.var1,
              yVar: corr.var2,
              ...regression
            });
          }
        });
      }

      // Assembler tous les résultats
      setAnalysis({
        descriptiveStats,
        categoricalStats,
        correlationMatrix,
        significantCorrelations,
        outliers,
        normalityTests,
        clustering,
        regressions,
        convertedData
      });

    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      setError('Erreur lors de l\'analyse des données: ' + err.message);
    }
  }, [config]);

  /**
   * Re-analyse avec nouvelle configuration
   */
  const handleConfigChange = useCallback((newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));

    // Re-analyser si des données sont chargées
    if (data && columns.length > 0) {
      analyzeData(data, columns);
    }
  }, [data, columns, analyzeData]);

  /**
   * Export des résultats
   */
  const handleExport = useCallback(async (format) => {
    if (!analysis || !data) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'analyse';

    switch (format) {
      case 'csv':
        exportToCSV(data, `${baseName}_${timestamp}.csv`);
        break;

      case 'excel':
        exportAnalysisToExcel({
          data,
          descriptiveStats: analysis.descriptiveStats,
          correlationMatrix: analysis.correlationMatrix,
          outliers: analysis.outliers
        }, `${baseName}_analyse_${timestamp}.xlsx`);
        break;

      case 'json':
        exportToJSON({
          overview,
          analysis,
          config,
          exportDate: new Date().toISOString()
        }, `${baseName}_${timestamp}.json`);
        break;

      case 'pdf':
        await generatePDFReport({
          fileName: file?.name,
          overview,
          descriptiveStats: analysis.descriptiveStats,
          significantCorrelations: analysis.significantCorrelations,
          outliers: analysis.outliers,
          clustering: analysis.clustering
        }, `rapport_${baseName}_${timestamp}.pdf`);
        break;

      default:
        console.warn('Format d\'export non reconnu:', format);
    }
  }, [analysis, data, file, overview, config]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analyseur de Données Intelligent
                </h1>
                <p className="text-sm text-gray-500">
                  Analyse automatique de données CSV et Excel
                </p>
              </div>
            </div>

            {/* Indicateurs de fichier */}
            {file && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{file.name}</span>
                </div>
                {overview && (
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span>{overview.rowCount} lignes</span>
                    <span>×</span>
                    <span>{overview.columnCount} colonnes</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="flex">
        {/* Sidebar de configuration */}
        {showSidebar && (
          <aside className="w-80 bg-white border-r border-gray-200 min-h-screen p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuration
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode d'analyse */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode d'analyse
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={analysisMode === 'automatic'}
                    onChange={() => setAnalysisMode('automatic')}
                    className="mr-2"
                  />
                  <span className="text-sm">Automatique</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={analysisMode === 'manual'}
                    onChange={() => setAnalysisMode('manual')}
                    className="mr-2"
                  />
                  <span className="text-sm">Manuel</span>
                </label>
              </div>
            </div>

            {/* Options d'analyse */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Options</h3>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.detectOutliers}
                  onChange={(e) => handleConfigChange({ detectOutliers: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Détecter les anomalies</span>
              </label>

              {config.detectOutliers && (
                <div className="ml-6 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={config.outliersMethod === 'iqr'}
                      onChange={() => handleConfigChange({ outliersMethod: 'iqr' })}
                      className="mr-2"
                    />
                    <span className="text-xs">Méthode IQR</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={config.outliersMethod === 'zscore'}
                      onChange={() => handleConfigChange({ outliersMethod: 'zscore' })}
                      className="mr-2"
                    />
                    <span className="text-xs">Méthode Z-score</span>
                  </label>
                </div>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.performClustering}
                  onChange={(e) => handleConfigChange({ performClustering: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Effectuer le clustering</span>
              </label>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Niveau de confiance
                </label>
                <select
                  value={config.confidenceLevel}
                  onChange={(e) => handleConfigChange({ confidenceLevel: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={0.90}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={0.99}>99%</option>
                </select>
              </div>
            </div>

            {/* Export */}
            {analysis && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Exporter</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Rapport PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Excel complet
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    JSON
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Bouton pour réafficher la sidebar */}
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Afficher la configuration
            </button>
          )}

          {/* Uploader de fichier */}
          {!data && (
            <div className="max-w-4xl mx-auto">
              <FileUploader
                onFileUpload={handleFileUpload}
                loading={loading}
                error={error}
              />
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Analyse en cours...</span>
            </div>
          )}

          {/* Résultats d'analyse */}
          {!loading && data && overview && analysis && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Vue d'ensemble */}
              <DataOverview overview={overview} />

              {/* Statistiques descriptives */}
              <DescriptiveStats
                descriptiveStats={analysis.descriptiveStats}
                categoricalStats={analysis.categoricalStats}
                normalityTests={analysis.normalityTests}
              />

              {/* Matrice de corrélation */}
              {analysis.correlationMatrix && (
                <CorrelationMatrix
                  correlationMatrix={analysis.correlationMatrix}
                  significantCorrelations={analysis.significantCorrelations}
                />
              )}

              {/* Détection d'anomalies */}
              {analysis.outliers && Object.keys(analysis.outliers).length > 0 && (
                <OutlierDetection
                  outliers={analysis.outliers}
                  data={analysis.convertedData}
                />
              )}

              {/* Modélisation */}
              {(analysis.clustering || analysis.regressions?.length > 0) && (
                <Modeling
                  clustering={analysis.clustering}
                  regressions={analysis.regressions}
                  data={analysis.convertedData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
