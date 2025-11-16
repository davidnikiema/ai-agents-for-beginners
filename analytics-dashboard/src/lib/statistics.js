/**
 * BIBLIOTHÈQUE DE FONCTIONS STATISTIQUES AVANCÉES
 *
 * Ce module implémente tous les tests statistiques et algorithmes
 * nécessaires pour l'analyse rigoureuse de données.
 */

import * as math from 'mathjs';
import _ from 'lodash';

/**
 * Calcule les statistiques descriptives d'un tableau de nombres
 */
export function descriptiveStats(data) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;

  const mean = math.mean(data);
  const median = math.median(data);
  const std = math.std(data, 'unbiased');
  const variance = math.variance(data, 'unbiased');

  // Quartiles
  const q1 = math.quantileSeq(sorted, 0.25);
  const q3 = math.quantileSeq(sorted, 0.75);
  const iqr = q3 - q1;

  // Mode (valeur la plus fréquente)
  const frequency = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(Number);

  return {
    n,
    mean,
    median,
    mode: mode.length === n ? null : mode, // Pas de mode si toutes valeurs uniques
    std,
    variance,
    min: math.min(data),
    max: math.max(data),
    q1,
    q3,
    iqr,
    range: math.max(data) - math.min(data),
    cv: (std / mean) * 100, // Coefficient de variation
    skewness: calculateSkewness(data, mean, std),
    kurtosis: calculateKurtosis(data, mean, std)
  };
}

/**
 * Calcule le coefficient d'asymétrie (skewness)
 */
function calculateSkewness(data, mean, std) {
  const n = data.length;
  const sum = data.reduce((acc, val) => acc + Math.pow((val - mean) / std, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

/**
 * Calcule le coefficient d'aplatissement (kurtosis)
 */
function calculateKurtosis(data, mean, std) {
  const n = data.length;
  const sum = data.reduce((acc, val) => acc + Math.pow((val - mean) / std, 4), 0);
  const kurtosis = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum;
  const adjustment = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  return kurtosis - adjustment; // Excess kurtosis
}

/**
 * Test de normalité de Shapiro-Wilk (implémentation simplifiée)
 * Pour n < 50, sinon utiliser Kolmogorov-Smirnov
 */
export function shapiroWilkTest(data) {
  if (data.length < 3 || data.length > 5000) {
    return { statistic: null, pValue: null, isNormal: null, error: 'Taille échantillon invalide' };
  }

  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = math.mean(sorted);

  // Calcul simplifié - pour production, utiliser une bibliothèque spécialisée
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);

  // W statistic (approximation)
  let numerator = 0;
  const k = Math.floor(n / 2);

  for (let i = 0; i < k; i++) {
    const ai = shapiroWilkCoefficient(n, i);
    numerator += ai * (sorted[n - 1 - i] - sorted[i]);
  }

  const W = Math.pow(numerator, 2) / variance;

  // p-value approximation (simplified)
  const pValue = approximateShapiroPValue(W, n);

  return {
    statistic: W,
    pValue,
    isNormal: pValue > 0.05,
    interpretation: pValue > 0.05
      ? 'Les données suivent une distribution normale (p > 0.05)'
      : 'Les données ne suivent pas une distribution normale (p ≤ 0.05)'
  };
}

/**
 * Coefficients pour Shapiro-Wilk (approximation)
 */
function shapiroWilkCoefficient(n, i) {
  // Approximation simplifiée
  return 1 / Math.sqrt(n);
}

/**
 * Approximation de la p-value pour Shapiro-Wilk
 */
function approximateShapiroPValue(W, n) {
  // Transformation log pour approximation
  const mu = -1.5861 - 0.31082 * Math.log(n) - 0.083751 * Math.pow(Math.log(n), 2);
  const sigma = Math.exp(-0.4803 - 0.082676 * Math.log(n) + 0.0030302 * Math.pow(Math.log(n), 2));

  const z = (Math.log(1 - W) - mu) / sigma;

  // Approximation de la fonction de répartition normale
  return 1 - normalCDF(z);
}

/**
 * Fonction de répartition de la loi normale standard
 */
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return x > 0 ? 1 - probability : probability;
}

/**
 * Corrélation de Pearson entre deux variables
 */
export function pearsonCorrelation(x, y) {
  if (x.length !== y.length || x.length < 2) return null;

  const n = x.length;
  const meanX = math.mean(x);
  const meanY = math.mean(y);

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

  const r = numerator / Math.sqrt(denomX * denomY);

  // Test de significativité
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const df = n - 2;
  const pValue = 2 * (1 - tDistributionCDF(Math.abs(t), df));

  return {
    coefficient: r,
    pValue,
    isSignificant: pValue < 0.05,
    interpretation: interpretCorrelation(r, pValue)
  };
}

/**
 * Corrélation de Spearman (sur les rangs)
 */
export function spearmanCorrelation(x, y) {
  if (x.length !== y.length || x.length < 2) return null;

  // Convertir en rangs
  const rankX = getRanks(x);
  const rankY = getRanks(y);

  // Appliquer Pearson sur les rangs
  return pearsonCorrelation(rankX, rankY);
}

/**
 * Convertit des valeurs en rangs
 */
function getRanks(data) {
  const indexed = data.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);

  const ranks = new Array(data.length);
  let currentRank = 1;

  for (let i = 0; i < indexed.length; i++) {
    // Gestion des ex-aequo
    let j = i;
    while (j < indexed.length - 1 && indexed[j].val === indexed[j + 1].val) {
      j++;
    }

    const avgRank = (currentRank + currentRank + (j - i)) / 2;
    for (let k = i; k <= j; k++) {
      ranks[indexed[k].idx] = avgRank;
    }

    currentRank += (j - i + 1);
    i = j;
  }

  return ranks;
}

/**
 * Interprétation de la corrélation
 */
function interpretCorrelation(r, pValue) {
  const absR = Math.abs(r);
  let strength = '';

  if (absR < 0.3) strength = 'faible';
  else if (absR < 0.5) strength = 'modérée';
  else if (absR < 0.7) strength = 'forte';
  else strength = 'très forte';

  const direction = r > 0 ? 'positive' : 'négative';
  const significance = pValue < 0.05 ? 'significative' : 'non significative';

  return `Corrélation ${direction} ${strength} (r = ${r.toFixed(3)}), ${significance} (p = ${pValue.toFixed(4)})`;
}

/**
 * Test t de Student (échantillons indépendants)
 */
export function tTest(sample1, sample2, paired = false) {
  if (paired && sample1.length !== sample2.length) {
    return { error: 'Les échantillons appariés doivent avoir la même taille' };
  }

  if (paired) {
    return pairedTTest(sample1, sample2);
  }

  const n1 = sample1.length;
  const n2 = sample2.length;
  const mean1 = math.mean(sample1);
  const mean2 = math.mean(sample2);
  const var1 = math.variance(sample1, 'unbiased');
  const var2 = math.variance(sample2, 'unbiased');

  // Pooled variance
  const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  const se = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));

  const t = (mean1 - mean2) / se;
  const df = n1 + n2 - 2;
  const pValue = 2 * (1 - tDistributionCDF(Math.abs(t), df));

  return {
    statistic: t,
    df,
    pValue,
    isSignificant: pValue < 0.05,
    mean1,
    mean2,
    meanDifference: mean1 - mean2,
    interpretation: `Différence de moyennes ${pValue < 0.05 ? 'significative' : 'non significative'} (p = ${pValue.toFixed(4)})`
  };
}

/**
 * Test t apparié
 */
function pairedTTest(sample1, sample2) {
  const differences = sample1.map((val, i) => val - sample2[i]);
  const n = differences.length;
  const meanDiff = math.mean(differences);
  const stdDiff = math.std(differences, 'unbiased');
  const se = stdDiff / Math.sqrt(n);

  const t = meanDiff / se;
  const df = n - 1;
  const pValue = 2 * (1 - tDistributionCDF(Math.abs(t), df));

  return {
    statistic: t,
    df,
    pValue,
    isSignificant: pValue < 0.05,
    meanDifference: meanDiff,
    interpretation: `Différence appariée ${pValue < 0.05 ? 'significative' : 'non significative'} (p = ${pValue.toFixed(4)})`
  };
}

/**
 * CDF de la distribution t de Student (approximation)
 */
function tDistributionCDF(t, df) {
  // Approximation pour grands df
  if (df > 30) {
    return normalCDF(t);
  }

  // Utilisation de la fonction bêta incomplète (approximation)
  const x = df / (df + t * t);
  return 1 - 0.5 * betaIncomplete(df / 2, 0.5, x);
}

/**
 * Fonction bêta incomplète (approximation simplifiée)
 */
function betaIncomplete(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Approximation par série de Taylor (limitée)
  let sum = 0;
  let term = Math.pow(x, a) / a;

  for (let n = 0; n < 100; n++) {
    sum += term;
    term *= x * (1 - b + n) / (a + n + 1);
    if (Math.abs(term) < 1e-10) break;
  }

  return sum;
}

/**
 * ANOVA (Analysis of Variance) à un facteur
 */
export function oneWayANOVA(groups) {
  if (groups.length < 2) {
    return { error: 'Au moins 2 groupes requis' };
  }

  // Calculs préliminaires
  const allData = groups.flat();
  const grandMean = math.mean(allData);
  const n = allData.length;
  const k = groups.length;

  // Sum of Squares Between groups (SSB)
  let ssb = 0;
  groups.forEach(group => {
    const groupMean = math.mean(group);
    ssb += group.length * Math.pow(groupMean - grandMean, 2);
  });

  // Sum of Squares Within groups (SSW)
  let ssw = 0;
  groups.forEach(group => {
    const groupMean = math.mean(group);
    group.forEach(val => {
      ssw += Math.pow(val - groupMean, 2);
    });
  });

  // Degrees of freedom
  const dfBetween = k - 1;
  const dfWithin = n - k;

  // Mean Squares
  const msb = ssb / dfBetween;
  const msw = ssw / dfWithin;

  // F-statistic
  const F = msb / msw;

  // p-value (approximation)
  const pValue = fDistributionPValue(F, dfBetween, dfWithin);

  return {
    statistic: F,
    dfBetween,
    dfWithin,
    pValue,
    isSignificant: pValue < 0.05,
    ssb,
    ssw,
    msb,
    msw,
    interpretation: `Les moyennes des groupes sont ${pValue < 0.05 ? 'significativement différentes' : 'non significativement différentes'} (p = ${pValue.toFixed(4)})`
  };
}

/**
 * p-value pour distribution F (approximation)
 */
function fDistributionPValue(F, df1, df2) {
  // Approximation grossière - pour production utiliser une bibliothèque
  const x = df2 / (df2 + df1 * F);
  return betaIncomplete(df2 / 2, df1 / 2, x);
}

/**
 * Test du Chi-carré d'indépendance
 */
export function chiSquareTest(observedMatrix) {
  const rowTotals = observedMatrix.map(row => row.reduce((a, b) => a + b, 0));
  const colTotals = observedMatrix[0].map((_, colIndex) =>
    observedMatrix.reduce((sum, row) => sum + row[colIndex], 0)
  );
  const total = rowTotals.reduce((a, b) => a + b, 0);

  // Expected frequencies
  const expected = observedMatrix.map((row, i) =>
    row.map((_, j) => (rowTotals[i] * colTotals[j]) / total)
  );

  // Chi-square statistic
  let chiSquare = 0;
  for (let i = 0; i < observedMatrix.length; i++) {
    for (let j = 0; j < observedMatrix[i].length; j++) {
      const obs = observedMatrix[i][j];
      const exp = expected[i][j];
      if (exp > 0) {
        chiSquare += Math.pow(obs - exp, 2) / exp;
      }
    }
  }

  const df = (observedMatrix.length - 1) * (observedMatrix[0].length - 1);
  const pValue = chiSquarePValue(chiSquare, df);

  return {
    statistic: chiSquare,
    df,
    pValue,
    isSignificant: pValue < 0.05,
    expected,
    interpretation: `Les variables sont ${pValue < 0.05 ? 'dépendantes' : 'indépendantes'} (p = ${pValue.toFixed(4)})`
  };
}

/**
 * p-value pour distribution Chi-carré
 */
function chiSquarePValue(chiSquare, df) {
  // Approximation par la distribution gamma
  return 1 - gammaLowerIncomplete(df / 2, chiSquare / 2);
}

/**
 * Fonction gamma incomplète inférieure (approximation)
 */
function gammaLowerIncomplete(s, x) {
  if (x <= 0) return 0;

  // Série de Taylor
  let sum = 0;
  let term = Math.pow(x, s) * Math.exp(-x) / gammaFunction(s);

  for (let n = 0; n < 100; n++) {
    sum += term;
    term *= x / (s + n + 1);
    if (Math.abs(term) < 1e-10) break;
  }

  return sum;
}

/**
 * Fonction gamma (approximation de Stirling)
 */
function gammaFunction(n) {
  if (n === 1) return 1;
  if (n === 0.5) return Math.sqrt(Math.PI);

  return Math.sqrt(2 * Math.PI / n) * Math.pow(n / Math.E, n);
}

/**
 * Détection d'outliers par la méthode IQR
 */
export function detectOutliersIQR(data) {
  const stats = descriptiveStats(data);
  if (!stats) return { outliers: [], indices: [] };

  const lowerBound = stats.q1 - 1.5 * stats.iqr;
  const upperBound = stats.q3 + 1.5 * stats.iqr;

  const outliers = [];
  const indices = [];

  data.forEach((val, idx) => {
    if (val < lowerBound || val > upperBound) {
      outliers.push(val);
      indices.push(idx);
    }
  });

  return {
    outliers,
    indices,
    lowerBound,
    upperBound,
    count: outliers.length,
    percentage: (outliers.length / data.length) * 100
  };
}

/**
 * Détection d'outliers par Z-score
 */
export function detectOutliersZScore(data, threshold = 3) {
  const mean = math.mean(data);
  const std = math.std(data, 'unbiased');

  const outliers = [];
  const indices = [];
  const zScores = [];

  data.forEach((val, idx) => {
    const z = Math.abs((val - mean) / std);
    zScores.push(z);

    if (z > threshold) {
      outliers.push(val);
      indices.push(idx);
    }
  });

  return {
    outliers,
    indices,
    zScores,
    count: outliers.length,
    percentage: (outliers.length / data.length) * 100,
    threshold
  };
}

/**
 * Régression linéaire simple
 */
export function linearRegression(x, y) {
  if (x.length !== y.length || x.length < 2) {
    return { error: 'Données invalides' };
  }

  const n = x.length;
  const meanX = math.mean(x);
  const meanY = math.mean(y);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // Prédictions
  const predictions = x.map(xi => slope * xi + intercept);

  // R² (coefficient de détermination)
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => sum + Math.pow(yi - predictions[i], 2), 0);
  const r2 = 1 - (ssResidual / ssTotal);

  // RMSE et MAE
  const rmse = Math.sqrt(ssResidual / n);
  const mae = y.reduce((sum, yi, i) => sum + Math.abs(yi - predictions[i]), 0) / n;

  // Corrélation
  const correlation = pearsonCorrelation(x, y);

  return {
    slope,
    intercept,
    r2,
    rmse,
    mae,
    correlation: correlation.coefficient,
    predictions,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    interpretation: `R² = ${(r2 * 100).toFixed(2)}% de la variance expliquée`
  };
}

/**
 * Régression linéaire multiple (matrice)
 */
export function multipleLinearRegression(X, y) {
  // X est une matrice (array de arrays), y est un vecteur
  try {
    // Ajouter une colonne de 1 pour l'intercept
    const XWithIntercept = X.map(row => [1, ...row]);

    // Calculer (X'X)^-1 X'y
    const Xt = math.transpose(XWithIntercept);
    const XtX = math.multiply(Xt, XWithIntercept);
    const XtXinv = math.inv(XtX);
    const Xty = math.multiply(Xt, y);
    const coefficients = math.multiply(XtXinv, Xty);

    // Prédictions
    const predictions = XWithIntercept.map(row =>
      row.reduce((sum, val, i) => sum + val * coefficients[i], 0)
    );

    // Métriques
    const meanY = math.mean(y);
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const ssResidual = y.reduce((sum, yi, i) => sum + Math.pow(yi - predictions[i], 2), 0);
    const r2 = 1 - (ssResidual / ssTotal);

    const n = y.length;
    const p = X[0].length;
    const adjustedR2 = 1 - ((1 - r2) * (n - 1)) / (n - p - 1);

    const rmse = Math.sqrt(ssResidual / n);

    return {
      coefficients,
      r2,
      adjustedR2,
      rmse,
      predictions,
      interpretation: `R² ajusté = ${(adjustedR2 * 100).toFixed(2)}%`
    };
  } catch (error) {
    return { error: 'Impossible de calculer la régression: ' + error.message };
  }
}

/**
 * K-means clustering
 */
export function kMeansClustering(data, k, maxIterations = 100) {
  if (data.length < k) {
    return { error: 'Pas assez de points pour k clusters' };
  }

  // Initialisation aléatoire des centroïdes
  let centroids = _.sampleSize(data, k);
  let assignments = new Array(data.length);
  let iterations = 0;
  let converged = false;

  while (!converged && iterations < maxIterations) {
    // Assignation aux clusters
    const newAssignments = data.map(point => {
      const distances = centroids.map(centroid => euclideanDistance(point, centroid));
      return distances.indexOf(Math.min(...distances));
    });

    // Vérifier la convergence
    converged = newAssignments.every((val, i) => val === assignments[i]);
    assignments = newAssignments;

    // Recalculer les centroïdes
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, idx) => assignments[idx] === i);
      if (clusterPoints.length > 0) {
        centroids[i] = calculateCentroid(clusterPoints);
      }
    }

    iterations++;
  }

  // Calculer l'inertie (within-cluster sum of squares)
  let inertia = 0;
  data.forEach((point, idx) => {
    inertia += Math.pow(euclideanDistance(point, centroids[assignments[idx]]), 2);
  });

  // Silhouette score (simplifié)
  const silhouette = calculateSilhouetteScore(data, assignments, k);

  return {
    assignments,
    centroids,
    k,
    iterations,
    inertia,
    silhouette,
    converged
  };
}

/**
 * Distance euclidienne entre deux points
 */
function euclideanDistance(p1, p2) {
  if (typeof p1 === 'number') return Math.abs(p1 - p2);

  return Math.sqrt(
    p1.reduce((sum, val, i) => sum + Math.pow(val - p2[i], 2), 0)
  );
}

/**
 * Calcule le centroïde d'un ensemble de points
 */
function calculateCentroid(points) {
  if (typeof points[0] === 'number') {
    return math.mean(points);
  }

  const dimensions = points[0].length;
  const centroid = new Array(dimensions);

  for (let d = 0; d < dimensions; d++) {
    centroid[d] = math.mean(points.map(p => p[d]));
  }

  return centroid;
}

/**
 * Calcule le score de silhouette
 */
function calculateSilhouetteScore(data, assignments, k) {
  if (k === 1) return 0;

  let totalScore = 0;

  data.forEach((point, i) => {
    const cluster = assignments[i];
    const sameCluster = data.filter((_, idx) => assignments[idx] === cluster && idx !== i);

    if (sameCluster.length === 0) return;

    // a: distance moyenne aux points du même cluster
    const a = sameCluster.reduce((sum, p) => sum + euclideanDistance(point, p), 0) / sameCluster.length;

    // b: distance moyenne au cluster le plus proche
    let minB = Infinity;
    for (let otherCluster = 0; otherCluster < k; otherCluster++) {
      if (otherCluster === cluster) continue;

      const otherPoints = data.filter((_, idx) => assignments[idx] === otherCluster);
      if (otherPoints.length === 0) continue;

      const avgDist = otherPoints.reduce((sum, p) => sum + euclideanDistance(point, p), 0) / otherPoints.length;
      minB = Math.min(minB, avgDist);
    }

    const s = (minB - a) / Math.max(a, minB);
    totalScore += s;
  });

  return totalScore / data.length;
}

/**
 * Méthode du coude pour déterminer k optimal
 */
export function elbowMethod(data, maxK = 10) {
  const inertias = [];
  const silhouettes = [];

  for (let k = 1; k <= Math.min(maxK, data.length - 1); k++) {
    const result = kMeansClustering(data, k);
    inertias.push({ k, inertia: result.inertia });
    silhouettes.push({ k, silhouette: result.silhouette || 0 });
  }

  // Trouver le coude (approximation)
  let optimalK = 2;
  let maxDelta = 0;

  for (let i = 1; i < inertias.length - 1; i++) {
    const delta = inertias[i - 1].inertia - 2 * inertias[i].inertia + inertias[i + 1].inertia;
    if (delta > maxDelta) {
      maxDelta = delta;
      optimalK = inertias[i].k;
    }
  }

  return {
    inertias,
    silhouettes,
    optimalK,
    recommendation: `K optimal suggéré: ${optimalK}`
  };
}

/**
 * Intervalle de confiance pour une moyenne
 */
export function confidenceInterval(data, confidence = 0.95) {
  const n = data.length;
  const mean = math.mean(data);
  const std = math.std(data, 'unbiased');
  const se = std / Math.sqrt(n);

  // Pour n > 30, utiliser distribution normale; sinon t de Student
  const alpha = 1 - confidence;
  let critical;

  if (n > 30) {
    // Z-score pour distribution normale
    critical = 1.96; // Pour 95%
    if (confidence === 0.99) critical = 2.576;
    if (confidence === 0.90) critical = 1.645;
  } else {
    // Approximation du t de Student
    const df = n - 1;
    critical = tCriticalValue(alpha / 2, df);
  }

  const marginError = critical * se;

  return {
    mean,
    lowerBound: mean - marginError,
    upperBound: mean + marginError,
    marginError,
    confidence: confidence * 100,
    interpretation: `IC à ${confidence * 100}%: [${(mean - marginError).toFixed(4)}, ${(mean + marginError).toFixed(4)}]`
  };
}

/**
 * Valeur critique de la distribution t
 */
function tCriticalValue(alpha, df) {
  // Approximation pour les valeurs courantes
  const tTable = {
    1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
    10: 2.228, 20: 2.086, 30: 2.042, 40: 2.021, 60: 2.000, 120: 1.980
  };

  for (const [key, value] of Object.entries(tTable)) {
    if (df <= parseInt(key)) return value;
  }

  return 1.96; // Approximation normale pour df élevé
}

/**
 * Calcul de l'entropie pour variables catégorielles
 */
export function calculateEntropy(frequencies) {
  const total = frequencies.reduce((sum, f) => sum + f, 0);
  const probabilities = frequencies.map(f => f / total);

  const entropy = -probabilities.reduce((sum, p) => {
    if (p === 0) return sum;
    return sum + p * Math.log2(p);
  }, 0);

  return {
    entropy,
    maxEntropy: Math.log2(frequencies.length),
    normalizedEntropy: entropy / Math.log2(frequencies.length),
    interpretation: `Entropie: ${entropy.toFixed(4)} bits`
  };
}

/**
 * Statistiques pour variables catégorielles
 */
export function categoricalStats(data) {
  const frequency = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });

  const values = Object.keys(frequency);
  const counts = Object.values(frequency);
  const total = data.length;

  const entropy = calculateEntropy(counts);
  const mode = values[counts.indexOf(Math.max(...counts))];

  return {
    uniqueValues: values.length,
    frequency,
    mode,
    modeCount: Math.max(...counts),
    total,
    entropy: entropy.entropy,
    distribution: values.map((val, i) => ({
      value: val,
      count: counts[i],
      percentage: (counts[i] / total) * 100
    }))
  };
}
