# Analyseur de Données Intelligent

Dashboard web React complet et professionnel pour l'analyse automatique de données CSV et Excel avec statistiques avancées, visualisations interactives et exports.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Fonctionnalités principales

### 📊 Analyse automatique complète

- **Upload de fichiers** : Drag & drop pour CSV et Excel (.xlsx, .xls)
- **Détection automatique** : Types de colonnes (numérique, catégoriel, temporel, texte)
- **Nettoyage intelligent** : Gestion des valeurs manquantes, validation de qualité
- **Parsing robuste** : Support de tous les encodages et formats de dates

### 📈 Statistiques descriptives

**Pour variables numériques :**
- Moyenne, médiane, mode, écart-type, variance
- Quartiles (Q1, Q3), IQR, min, max, range
- Coefficient de variation, asymétrie (skewness), kurtosis
- Tests de normalité (Shapiro-Wilk)
- Distributions et box plots interactifs

**Pour variables catégorielles :**
- Fréquences et modalités
- Entropie et diversité
- Graphiques en barres et camemberts
- Tableaux de distribution détaillés

### 🔍 Analyses avancées

**Corrélations :**
- Matrice de corrélation complète (Pearson)
- Identification automatique des corrélations significatives
- Tests de significativité (p-values)
- Visualisations heatmap interactives

**Détection d'anomalies :**
- Méthode IQR (Interquartile Range)
- Méthode Z-score (valeurs > 3σ)
- Visualisation des outliers sur graphiques
- Statistiques détaillées des anomalies

**Modélisation :**
- Régression linéaire simple avec R², RMSE, MAE
- Clustering K-means avec détermination automatique de k
- Méthode du coude (Elbow method)
- Score de silhouette pour validation
- Visualisations interactives des clusters

### 📉 Visualisations interactives

Utilise Recharts pour des graphiques hautement interactifs :
- Histogrammes et distributions
- Box plots et violin plots
- Scatter plots avec lignes de régression
- Heatmaps de corrélation
- Graphiques de clustering
- Tous avec zoom, pan, et tooltips détaillés

### 💾 Exports multiformats

- **PDF** : Rapport complet professionnel multi-pages
- **Excel** : Fichier multi-feuilles avec données, stats, corrélations, anomalies
- **CSV** : Données nettoyées
- **JSON** : Résultats d'analyse structurés

## 🚀 Démarrage rapide

### Prérequis

- Node.js 16+ et npm/yarn
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Cloner le repository
cd analytics-dashboard

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le dashboard sera accessible sur `http://localhost:3000`

### Build pour production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 📖 Guide d'utilisation

### 1. Upload de fichier

1. Glissez-déposez votre fichier CSV ou Excel dans la zone d'upload
2. Ou cliquez pour sélectionner un fichier
3. Formats supportés : `.csv`, `.xlsx`, `.xls`
4. Taille maximale recommandée : 100 Mo

### 2. Analyse automatique

Une fois le fichier chargé, le dashboard analyse automatiquement :

- **Vue d'ensemble** : Nombre de lignes/colonnes, types de données, qualité
- **Statistiques descriptives** : Pour chaque variable
- **Corrélations** : Matrice et top corrélations significatives
- **Anomalies** : Détection automatique des valeurs aberrantes
- **Modélisation** : Clustering et régressions

### 3. Configuration

Utilisez la sidebar de configuration pour :

- Choisir le mode d'analyse (automatique/manuel)
- Activer/désactiver la détection d'anomalies
- Sélectionner la méthode de détection (IQR ou Z-score)
- Activer/désactiver le clustering
- Définir le niveau de confiance (90%, 95%, 99%)

### 4. Exploration des résultats

Chaque section est interactive :

- Cliquez sur les en-têtes pour développer/réduire
- Survolez les graphiques pour voir les détails
- Cliquez sur les éléments de corrélation pour plus d'infos
- Explorez les anomalies détectées

### 5. Export

Utilisez les boutons d'export dans la sidebar :

- **Rapport PDF** : Document complet avec toutes les analyses
- **Excel complet** : Fichier multi-feuilles avec tous les résultats
- **CSV** : Données brutes pour réutilisation
- **JSON** : Résultats structurés pour traitement

## 🏗️ Architecture technique

### Stack technologique

```
Frontend:
├── React 18.3 (Hooks)
├── Vite (Build tool)
├── Tailwind CSS (Styling)
└── Recharts (Visualisations)

Traitement de données:
├── PapaParse (CSV parsing)
├── xlsx (Excel parsing)
├── mathjs (Calculs mathématiques)
└── lodash (Utilitaires)

Export:
├── jsPDF (Génération PDF)
├── html2canvas (Screenshots)
└── file-saver (Téléchargements)

Statistiques:
└── Implémentation native JavaScript
    ├── Tests de normalité (Shapiro-Wilk)
    ├── Corrélations (Pearson, Spearman)
    ├── Tests t, ANOVA, Chi-carré
    ├── Régression linéaire
    └── K-means clustering
```

### Structure du projet

```
analytics-dashboard/
├── src/
│   ├── components/          # Composants React
│   │   ├── FileUploader.jsx
│   │   ├── DataOverview.jsx
│   │   ├── DescriptiveStats.jsx
│   │   ├── CorrelationMatrix.jsx
│   │   ├── OutlierDetection.jsx
│   │   ├── Modeling.jsx
│   │   └── ExportPanel.jsx
│   ├── lib/                 # Bibliothèques
│   │   └── statistics.js   # Fonctions statistiques
│   ├── utils/               # Utilitaires
│   │   ├── dataProcessor.js
│   │   └── exportUtils.js
│   ├── App.jsx             # Composant principal
│   ├── main.jsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🧪 Tests et validation

### Données de test

Pour tester l'application, vous pouvez :

1. Utiliser vos propres fichiers CSV/Excel
2. Générer des données de test (fonctionnalité intégrée - à venir)
3. Utiliser des datasets publics (Kaggle, UCI ML Repository)

### Validation des résultats

Les algorithmes statistiques ont été validés contre :
- Numpy/Scipy (Python)
- R (language statistique)
- Excel (pour vérification basique)

## 📊 Exemple de workflow

```
1. L'utilisateur charge un fichier CSV de ventes (50k lignes, 15 colonnes)
   ↓
2. Le système analyse automatiquement en 3-5 secondes
   ↓
3. Affiche :
   - Aperçu : 50,000 lignes × 15 colonnes, qualité 87/100
   - Types détectés : 8 numériques, 4 catégorielles, 3 temporelles
   - 45 graphiques automatiques pertinents
   - Matrice de corrélation avec 12 relations significatives
   - 3 clusters identifiés (silhouette = 0.68)
   - 127 anomalies détectées (2.5% des données)
   - 5 régressions calculées pour paires corrélées
   ↓
4. L'utilisateur clique sur "Exporter Rapport PDF"
   ↓
5. Reçoit un PDF professionnel de 28 pages avec toutes les analyses
```

## 🔧 Configuration avancée

### Variables d'environnement

Aucune variable d'environnement n'est requise pour le fonctionnement de base.

### Personnalisation

Vous pouvez personnaliser :

- **Seuils statistiques** : Modifier dans `src/lib/statistics.js`
- **Couleurs** : Éditer `tailwind.config.js`
- **Nombre de bins** : Ajuster dans `src/utils/dataProcessor.js`
- **Formats d'export** : Personnaliser dans `src/utils/exportUtils.js`

## 🐛 Résolution de problèmes

### Le fichier ne se charge pas

- Vérifiez le format (CSV ou Excel uniquement)
- Assurez-vous que le fichier n'est pas corrompu
- Vérifiez la taille (< 100 Mo recommandé)

### Erreur "Out of memory"

- Réduisez la taille du dataset
- Fermez les autres applications
- Utilisez un navigateur 64-bit

### Les graphiques ne s'affichent pas

- Vérifiez la console pour les erreurs
- Assurez-vous que JavaScript est activé
- Essayez un autre navigateur

### Résultats statistiques inattendus

- Vérifiez la qualité des données (valeurs manquantes, types)
- Consultez les avertissements dans la section Vue d'ensemble
- Vérifiez que les colonnes sont du bon type

## 📚 Documentation des fonctions statistiques

### Tests implémentés

- **Shapiro-Wilk** : Test de normalité pour n < 5000
- **Pearson** : Corrélation linéaire
- **Spearman** : Corrélation de rang
- **T-test** : Comparaison de moyennes (indépendant et apparié)
- **ANOVA** : Comparaison de multiples groupes
- **Chi-carré** : Test d'indépendance

### Métriques de régression

- **R²** : Coefficient de détermination
- **RMSE** : Root Mean Square Error
- **MAE** : Mean Absolute Error

### Clustering

- **K-means** : Avec initialisation aléatoire
- **Elbow method** : Détermination automatique de k
- **Silhouette score** : Validation de la qualité

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- React et l'équipe Vite pour les outils de développement
- Recharts pour la bibliothèque de visualisation
- La communauté open-source pour les bibliothèques utilisées

## 📧 Contact

Pour toute question ou suggestion :

- Ouvrir une issue sur GitHub
- Contribuer au projet
- Partager vos cas d'usage

## 🗺️ Roadmap

### Version 1.1 (à venir)

- [ ] Support de plus de formats (Parquet, JSON, SQL)
- [ ] Analyse de séries temporelles avancée
- [ ] Tests statistiques supplémentaires (Kruskal-Wallis, Mann-Whitney)
- [ ] Modèles de Machine Learning (Random Forest, SVM)
- [ ] Dashboard personnalisable (drag & drop)
- [ ] Sauvegarde de sessions
- [ ] Comparaison de datasets
- [ ] API REST pour intégration

### Version 2.0 (futur)

- [ ] Mode sombre complet
- [ ] Internationalisation (i18n)
- [ ] Collaboration en temps réel
- [ ] Intégration cloud (AWS, Azure, GCP)
- [ ] Application mobile (React Native)
- [ ] Plugin Excel/Google Sheets

---

**Fait avec ❤️ pour l'analyse de données**
