/**
 * UTILITAIRES D'EXPORT
 *
 * Fonctions pour exporter les données et analyses en différents formats
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exporte les données en CSV
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) return;

  const columns = Object.keys(data[0]);
  const csv = [
    columns.join(','), // Header
    ...data.map(row => columns.map(col => {
      const value = row[col];
      // Échapper les guillemets et virgules
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

/**
 * Exporte les données en Excel
 */
export function exportToExcel(data, filename = 'export.xlsx', sheetName = 'Données') {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Générer le fichier
  XLSX.writeFile(workbook, filename);
}

/**
 * Exporte les résultats d'analyse en Excel (multiple sheets)
 */
export function exportAnalysisToExcel(analysisResults, filename = 'analyse_complete.xlsx') {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Données originales
  if (analysisResults.data && analysisResults.data.length > 0) {
    const dataSheet = XLSX.utils.json_to_sheet(analysisResults.data);
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Données');
  }

  // Sheet 2: Statistiques descriptives
  if (analysisResults.descriptiveStats) {
    const statsData = Object.entries(analysisResults.descriptiveStats).map(([column, stats]) => ({
      Colonne: column,
      N: stats.n,
      Moyenne: stats.mean,
      Médiane: stats.median,
      'Écart-type': stats.std,
      Min: stats.min,
      Max: stats.max,
      Q1: stats.q1,
      Q3: stats.q3
    }));
    const statsSheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistiques');
  }

  // Sheet 3: Matrice de corrélation
  if (analysisResults.correlationMatrix) {
    const { matrix, labels } = analysisResults.correlationMatrix;
    const corrData = matrix.map((row, i) => {
      const rowData = { Variable: labels[i] };
      labels.forEach((label, j) => {
        rowData[label] = row[j] !== null ? row[j].toFixed(3) : 'N/A';
      });
      return rowData;
    });
    const corrSheet = XLSX.utils.json_to_sheet(corrData);
    XLSX.utils.book_append_sheet(workbook, corrSheet, 'Corrélations');
  }

  // Sheet 4: Anomalies
  if (analysisResults.outliers) {
    const outlierData = [];
    Object.entries(analysisResults.outliers).forEach(([column, result]) => {
      result.indices.forEach((idx, i) => {
        outlierData.push({
          Colonne: column,
          Index: idx,
          Valeur: result.outliers[i],
          Méthode: 'IQR'
        });
      });
    });

    if (outlierData.length > 0) {
      const outlierSheet = XLSX.utils.json_to_sheet(outlierData);
      XLSX.utils.book_append_sheet(workbook, outlierSheet, 'Anomalies');
    }
  }

  XLSX.writeFile(workbook, filename);
}

/**
 * Exporte en JSON
 */
export function exportToJSON(data, filename = 'export.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveAs(blob, filename);
}

/**
 * Exporte un graphique en PNG
 */
export async function exportChartToPNG(elementId, filename = 'chart.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Élément non trouvé:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2 // Haute résolution
    });

    canvas.toBlob((blob) => {
      saveAs(blob, filename);
    });
  } catch (error) {
    console.error('Erreur lors de l\'export PNG:', error);
  }
}

/**
 * Génère un rapport PDF complet
 */
export async function generatePDFReport(analysisResults, filename = 'rapport_analyse.pdf') {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;

  // Helper pour ajouter une nouvelle page si nécessaire
  const checkNewPage = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Page de garde
  pdf.setFontSize(24);
  pdf.text('Rapport d\'Analyse de Données', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 10;

  if (analysisResults.fileName) {
    pdf.text(`Fichier: ${analysisResults.fileName}`, margin, yPosition);
    yPosition += 10;
  }

  // Ligne de séparation
  pdf.line(margin, yPosition, 190, yPosition);
  yPosition += 15;

  // Section 1: Vue d'ensemble
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.text('1. Vue d\'ensemble des données', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  if (analysisResults.overview) {
    const overview = analysisResults.overview;
    pdf.text(`Nombre de lignes: ${overview.rowCount}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Nombre de colonnes: ${overview.columnCount}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Valeurs manquantes: ${overview.missingPercentage?.toFixed(2)}%`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Score de qualité: ${overview.qualityScore?.toFixed(1)}/100`, margin + 5, yPosition);
    yPosition += 12;
  }

  // Section 2: Types de colonnes
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.text('2. Analyse des colonnes', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  if (analysisResults.overview?.dataTypes) {
    const types = analysisResults.overview.dataTypes;
    pdf.text(`Variables numériques: ${types.numeric}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Variables catégorielles: ${types.categorical}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Variables temporelles: ${types.temporal}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Variables textuelles: ${types.text}`, margin + 5, yPosition);
    yPosition += 12;
  }

  // Section 3: Statistiques descriptives
  if (analysisResults.descriptiveStats && Object.keys(analysisResults.descriptiveStats).length > 0) {
    checkNewPage(60);
    pdf.setFontSize(16);
    pdf.text('3. Statistiques descriptives', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    Object.entries(analysisResults.descriptiveStats).forEach(([column, stats]) => {
      checkNewPage(30);

      pdf.setFontSize(12);
      pdf.text(`${column}:`, margin + 5, yPosition);
      yPosition += 7;

      pdf.setFontSize(10);
      pdf.text(`  Moyenne: ${stats.mean?.toFixed(2)}, Médiane: ${stats.median?.toFixed(2)}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`  Écart-type: ${stats.std?.toFixed(2)}, Min: ${stats.min?.toFixed(2)}, Max: ${stats.max?.toFixed(2)}`, margin + 5, yPosition);
      yPosition += 8;
    });
  }

  // Section 4: Corrélations significatives
  if (analysisResults.significantCorrelations && analysisResults.significantCorrelations.length > 0) {
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.text('4. Corrélations significatives', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    analysisResults.significantCorrelations.slice(0, 10).forEach((corr, idx) => {
      checkNewPage(15);
      pdf.text(`${idx + 1}. ${corr.var1} ↔ ${corr.var2}: r = ${corr.correlation.toFixed(3)} (p = ${corr.pValue.toFixed(4)})`, margin + 5, yPosition);
      yPosition += 7;
    });
  }

  // Section 5: Anomalies détectées
  if (analysisResults.outliers) {
    const totalOutliers = Object.values(analysisResults.outliers).reduce((sum, result) => sum + (result.count || 0), 0);

    if (totalOutliers > 0) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.text('5. Anomalies détectées', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.text(`Nombre total d'anomalies: ${totalOutliers}`, margin + 5, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      Object.entries(analysisResults.outliers).forEach(([column, result]) => {
        if (result.count > 0) {
          checkNewPage(15);
          pdf.text(`${column}: ${result.count} anomalies (${result.percentage?.toFixed(2)}%)`, margin + 5, yPosition);
          yPosition += 7;
        }
      });
    }
  }

  // Section 6: Modélisation
  if (analysisResults.clustering) {
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.text('6. Analyse de clustering', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.text(`Nombre de clusters: ${analysisResults.clustering.k}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Score de silhouette: ${analysisResults.clustering.silhouette?.toFixed(3)}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Inertie: ${analysisResults.clustering.inertia?.toFixed(2)}`, margin + 5, yPosition);
    yPosition += 10;
  }

  // Footer sur chaque page
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(128);
    pdf.text(`Page ${i} sur ${pageCount}`, margin, pageHeight - 10);
    pdf.text('Analyseur de Données Intelligent', 190 - margin, pageHeight - 10, { align: 'right' });
  }

  // Sauvegarder le PDF
  pdf.save(filename);
}

/**
 * Copie les résultats dans le presse-papiers
 */
export async function copyToClipboard(data) {
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erreur lors de la copie:', error);
    return false;
  }
}

/**
 * Télécharge des données brutes
 */
export function downloadData(data, filename, type = 'text/plain') {
  const blob = new Blob([data], { type });
  saveAs(blob, filename);
}
