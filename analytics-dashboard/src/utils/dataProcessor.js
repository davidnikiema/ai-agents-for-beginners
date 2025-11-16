/**
 * UTILITAIRES POUR LE TRAITEMENT DES DONNÉES
 *
 * Détection automatique de types, nettoyage, parsing
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import _ from 'lodash';

/**
 * Parse un fichier CSV
 */
export async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        resolve({
          data: results.data,
          columns: results.meta.fields,
          errors: results.errors
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Parse un fichier Excel
 */
export async function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Prendre la première feuille
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convertir en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });

        const columns = Object.keys(jsonData[0] || {});

        resolve({
          data: jsonData,
          columns,
          sheetName: firstSheetName,
          allSheets: workbook.SheetNames
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Détecte automatiquement le type d'une colonne
 */
export function detectColumnType(values) {
  // Filtrer les valeurs nulles/undefined
  const validValues = values.filter(v => v !== null && v !== undefined && v !== '');

  if (validValues.length === 0) {
    return { type: 'empty', confidence: 1 };
  }

  // Compter les types
  let numCount = 0;
  let dateCount = 0;
  let boolCount = 0;
  let stringCount = 0;

  validValues.forEach(val => {
    // Vérifier si nombre
    if (typeof val === 'number' || (!isNaN(val) && !isNaN(parseFloat(val)))) {
      numCount++;
    }
    // Vérifier si date
    else if (isDate(val)) {
      dateCount++;
    }
    // Vérifier si booléen
    else if (typeof val === 'boolean' || ['true', 'false', 'yes', 'no', '0', '1'].includes(String(val).toLowerCase())) {
      boolCount++;
    }
    // Sinon c'est une string
    else {
      stringCount++;
    }
  });

  const total = validValues.length;
  const threshold = 0.8; // 80% de confiance minimum

  // Déterminer le type majoritaire
  if (numCount / total >= threshold) {
    return { type: 'numeric', confidence: numCount / total };
  }
  if (dateCount / total >= threshold) {
    return { type: 'temporal', confidence: dateCount / total };
  }
  if (boolCount / total >= threshold) {
    return { type: 'boolean', confidence: boolCount / total };
  }

  // Si peu de valeurs uniques (< 5% du total), considérer comme catégoriel
  const uniqueValues = new Set(validValues).size;
  if (uniqueValues < total * 0.05 && uniqueValues < 50) {
    return { type: 'categorical', confidence: 1 - (uniqueValues / total) };
  }

  // Sinon, texte
  return { type: 'text', confidence: stringCount / total };
}

/**
 * Vérifie si une valeur est une date
 */
function isDate(value) {
  if (value instanceof Date && !isNaN(value)) return true;

  // Patterns de dates courants
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/,  // DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/,  // DD-MM-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/,  // YYYY/MM/DD
  ];

  if (typeof value === 'string') {
    const matches = datePatterns.some(pattern => pattern.test(value));
    if (matches) {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
  }

  return false;
}

/**
 * Analyse complète d'un dataset
 */
export function analyzeDataset(data, columns) {
  const rowCount = data.length;
  const columnCount = columns.length;

  // Analyser chaque colonne
  const columnAnalysis = columns.map(col => {
    const values = data.map(row => row[col]);
    const validValues = values.filter(v => v !== null && v !== undefined && v !== '');

    const typeInfo = detectColumnType(values);
    const missingCount = values.length - validValues.length;
    const uniqueCount = new Set(validValues).size;

    return {
      name: col,
      type: typeInfo.type,
      typeConfidence: typeInfo.confidence,
      totalValues: values.length,
      validValues: validValues.length,
      missingValues: missingCount,
      missingPercentage: (missingCount / values.length) * 100,
      uniqueValues: uniqueCount,
      uniquePercentage: (uniqueCount / validValues.length) * 100,
      cardinality: uniqueCount === validValues.length ? 'high' : uniqueCount < 10 ? 'low' : 'medium'
    };
  });

  // Statistiques globales
  const totalMissing = columnAnalysis.reduce((sum, col) => sum + col.missingValues, 0);
  const totalCells = rowCount * columnCount;

  // Quality score
  const qualityScore = calculateDataQuality(columnAnalysis, rowCount, columnCount);

  return {
    rowCount,
    columnCount,
    totalCells,
    totalMissing,
    missingPercentage: (totalMissing / totalCells) * 100,
    columnAnalysis,
    qualityScore,
    dataTypes: {
      numeric: columnAnalysis.filter(c => c.type === 'numeric').length,
      categorical: columnAnalysis.filter(c => c.type === 'categorical').length,
      temporal: columnAnalysis.filter(c => c.type === 'temporal').length,
      text: columnAnalysis.filter(c => c.type === 'text').length,
      boolean: columnAnalysis.filter(c => c.type === 'boolean').length
    }
  };
}

/**
 * Calcule un score de qualité des données
 */
function calculateDataQuality(columnAnalysis, rowCount, columnCount) {
  let score = 100;

  // Pénalités pour valeurs manquantes
  columnAnalysis.forEach(col => {
    if (col.missingPercentage > 50) score -= 10;
    else if (col.missingPercentage > 20) score -= 5;
    else if (col.missingPercentage > 5) score -= 2;
  });

  // Bonus pour types bien définis
  const avgTypeConfidence = columnAnalysis.reduce((sum, col) => sum + col.typeConfidence, 0) / columnCount;
  score += (avgTypeConfidence - 0.5) * 10;

  // Pénalité pour dataset trop petit
  if (rowCount < 10) score -= 20;
  else if (rowCount < 30) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Convertit les colonnes au bon type
 */
export function convertColumnTypes(data, columnAnalysis) {
  return data.map(row => {
    const convertedRow = {};

    columnAnalysis.forEach(col => {
      const value = row[col.name];

      if (value === null || value === undefined || value === '') {
        convertedRow[col.name] = null;
        return;
      }

      switch (col.type) {
        case 'numeric':
          convertedRow[col.name] = parseFloat(value);
          break;

        case 'temporal':
          convertedRow[col.name] = parseDate(value);
          break;

        case 'boolean':
          convertedRow[col.name] = parseBoolean(value);
          break;

        case 'categorical':
        case 'text':
        default:
          convertedRow[col.name] = String(value).trim();
          break;
      }
    });

    return convertedRow;
  });
}

/**
 * Parse une date depuis différents formats
 */
function parseDate(value) {
  if (value instanceof Date) return value;

  // Essayer le parsing natif
  const date = new Date(value);
  if (!isNaN(date.getTime())) return date;

  // Formats européens (DD/MM/YYYY ou DD-MM-YYYY)
  const europeanMatch = String(value).match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (europeanMatch) {
    const [, day, month, year] = europeanMatch;
    const parsed = new Date(`${year}-${month}-${day}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return value; // Retourner la valeur originale si parsing échoue
}

/**
 * Parse un booléen
 */
function parseBoolean(value) {
  const str = String(value).toLowerCase();
  if (['true', 'yes', '1', 'oui', 'vrai'].includes(str)) return true;
  if (['false', 'no', '0', 'non', 'faux'].includes(str)) return false;
  return value;
}

/**
 * Nettoie les données
 */
export function cleanData(data, options = {}) {
  const {
    removeDuplicates = false,
    removeOutliers = false,
    fillMissing = false,
    fillMethod = 'mean' // 'mean', 'median', 'mode', 'forward', 'backward'
  } = options;

  let cleaned = [...data];

  // Supprimer les doublons
  if (removeDuplicates) {
    cleaned = _.uniqWith(cleaned, _.isEqual);
  }

  return {
    data: cleaned,
    original: data.length,
    cleaned: cleaned.length,
    removed: data.length - cleaned.length
  };
}

/**
 * Extrait les valeurs numériques d'une colonne
 */
export function extractNumericValues(data, columnName) {
  return data
    .map(row => row[columnName])
    .filter(val => val !== null && val !== undefined && !isNaN(val))
    .map(val => parseFloat(val));
}

/**
 * Extrait les valeurs catégorielles d'une colonne
 */
export function extractCategoricalValues(data, columnName) {
  return data
    .map(row => row[columnName])
    .filter(val => val !== null && val !== undefined && val !== '')
    .map(val => String(val));
}

/**
 * Crée une matrice de contingence pour deux variables catégorielles
 */
export function createContingencyTable(data, col1, col2) {
  const values1 = [...new Set(data.map(row => row[col1]).filter(v => v !== null && v !== undefined))];
  const values2 = [...new Set(data.map(row => row[col2]).filter(v => v !== null && v !== undefined))];

  const matrix = values1.map(v1 => {
    return values2.map(v2 => {
      return data.filter(row => row[col1] === v1 && row[col2] === v2).length;
    });
  });

  return {
    matrix,
    rowLabels: values1,
    colLabels: values2
  };
}

/**
 * Crée des bins pour un histogramme
 */
export function createBins(data, numBins = 10) {
  if (data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / numBins;

  const bins = [];
  for (let i = 0; i < numBins; i++) {
    const binMin = min + i * binWidth;
    const binMax = binMin + binWidth;
    const count = data.filter(val => val >= binMin && (i === numBins - 1 ? val <= binMax : val < binMax)).length;

    bins.push({
      min: binMin,
      max: binMax,
      midpoint: (binMin + binMax) / 2,
      count,
      label: `[${binMin.toFixed(2)}, ${binMax.toFixed(2)}${i === numBins - 1 ? ']' : ')'}`
    });
  }

  return bins;
}

/**
 * Calcule une matrice de corrélation pour toutes les variables numériques
 */
export function calculateCorrelationMatrix(data, numericColumns) {
  const matrix = [];
  const labels = numericColumns;

  numericColumns.forEach(col1 => {
    const row = [];
    const values1 = extractNumericValues(data, col1);

    numericColumns.forEach(col2 => {
      const values2 = extractNumericValues(data, col2);

      // S'assurer que les deux colonnes ont la même longueur
      const minLength = Math.min(values1.length, values2.length);
      const v1 = values1.slice(0, minLength);
      const v2 = values2.slice(0, minLength);

      if (v1.length < 2) {
        row.push(null);
        return;
      }

      // Calcul de corrélation de Pearson
      const correlation = calculatePearson(v1, v2);
      row.push(correlation);
    });

    matrix.push(row);
  });

  return { matrix, labels };
}

/**
 * Calcul simple de corrélation de Pearson
 */
function calculatePearson(x, y) {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  if (denomX === 0 || denomY === 0) return 0;

  return numerator / Math.sqrt(denomX * denomY);
}

/**
 * Génère des données pour un dataset exemple
 */
export function generateSampleData() {
  const categories = ['A', 'B', 'C', 'D'];
  const n = 100;

  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    valeur1: Math.random() * 100,
    valeur2: Math.random() * 50 + 25,
    categorie: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(2024, 0, 1 + Math.floor(Math.random() * 365)).toISOString().split('T')[0],
    booleen: Math.random() > 0.5
  }));
}
