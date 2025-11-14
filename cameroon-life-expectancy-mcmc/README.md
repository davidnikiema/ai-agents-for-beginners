# Simulation MCMC de l'Espérance de Vie du Cameroun avec bayesLife

Ce projet contient des scripts R pour effectuer des simulations Monte Carlo par Chaînes de Markov (MCMC) afin de projeter l'espérance de vie au Cameroun en utilisant le package `bayesLife`.

## 📋 Table des matières

- [Description](#description)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Scripts disponibles](#scripts-disponibles)
- [Interprétation des résultats](#interprétation-des-résultats)
- [Paramètres MCMC](#paramètres-mcmc)
- [Références](#références)

## 🎯 Description

Le package `bayesLife` implémente une approche bayésienne pour projeter l'espérance de vie à la naissance. Cette méthode utilise:

- **MCMC (Markov Chain Monte Carlo)** pour estimer les paramètres du modèle
- **Modèle bayésien hiérarchique** pour capturer les tendances démographiques
- **Projections probabilistes** avec intervalles de confiance
- **Données de l'ONU** comme base historique

## 💻 Prérequis

- **R version 4.0 ou supérieure**
- **RStudio** (recommandé)
- Connexion Internet pour télécharger les packages

### Packages R requis

```r
install.packages(c(
  "bayesLife",
  "ggplot2",
  "dplyr",
  "tidyr"
))
```

## 🚀 Installation

1. Clonez ou téléchargez ce repository
2. Ouvrez R ou RStudio
3. Définissez le répertoire de travail:

```r
setwd("chemin/vers/cameroon-life-expectancy-mcmc")
```

4. **⚠️ IMPORTANT: Vérifiez d'abord le code pays du Cameroun**

```r
source("00_verification_cameroun.R")
```

Ce script va:
- ✅ Trouver automatiquement le bon code pays pour le Cameroun
- ✅ Vérifier que les données existent
- ✅ Sauvegarder le code dans `CAMEROON_CODE.txt`

**Si vous rencontrez des problèmes pour trouver le Cameroun, consultez le [Guide de Dépannage](GUIDE_DEPANNAGE.md)**

5. Exécutez le script d'installation:

```r
source("01_installation.R")
```

## 📊 Utilisation

### Exécution rapide (3 scripts principaux)

#### 1. Installation et vérification

```r
source("01_installation.R")
```

Ce script:
- Vérifie les packages installés
- Crée le dossier de sortie `bayesLife_output`
- Vérifie la disponibilité des données du Cameroun

#### 2. Simulation MCMC et projections

```r
source("02_simulation_mcmc.R")
```

⏱️ **Temps d'exécution**: 15-30 minutes (dépend de votre ordinateur)

Ce script réalise:
- Simulation MCMC avec 3 chaînes de 10,000 itérations chacune
- Diagnostics de convergence
- Projections jusqu'en 2100
- Génération de 1,000 trajectoires de projection

#### 3. Visualisations avancées

```r
source("03_visualisation_avancee.R")
```

Ce script crée:
- Graphiques des trajectoires avec intervalles de confiance
- Distributions pour les années clés (2025, 2050, 2075, 2100)
- Évolution de l'incertitude
- Comparaison historique vs projections

### Personnalisation des paramètres

Vous pouvez modifier les paramètres dans `02_simulation_mcmc.R`:

```r
# Augmenter le nombre d'itérations pour plus de précision
sim_mcmc <- run.e0.mcmc(
  nr.chains = 5,              # Plus de chaînes (3-5 recommandé)
  iter = 20000,               # Plus d'itérations
  thin = 10,                  # Intervalle d'échantillonnage
  output.dir = output_dir
)

# Projections plus lointaines
pred <- e0.predict(
  sim.dir = output_dir,
  end.year = 2150,            # Projeter jusqu'en 2150
  nr.traj = 2000              # Plus de trajectoires
)
```

## 📁 Scripts disponibles

| Script | Description | Temps d'exécution |
|--------|-------------|-------------------|
| `00_verification_cameroun.R` | **⭐ Vérification du code pays (À EXÉCUTER EN PREMIER)** | < 1 min |
| `01_installation.R` | Installation et configuration | < 1 min |
| `02_simulation_mcmc.R` | Simulation MCMC et projections | 15-30 min |
| `03_visualisation_avancee.R` | Visualisations graphiques avancées | 2-5 min |
| `04_analyse_parametres_mcmc.R` | Analyse détaillée des paramètres MCMC | 3-5 min |
| `RUN_ALL.R` | **Exécution automatique de tous les scripts** | 20-40 min |

### Scripts et guides supplémentaires

| Fichier | Description |
|---------|-------------|
| `GUIDE_DEPANNAGE.md` | Guide complet de résolution des problèmes |
| `CAMEROON_CODE.txt` | Code pays trouvé (généré automatiquement) |

## 📈 Interprétation des résultats

### Fichiers générés

Tous les résultats sont sauvegardés dans le dossier `bayesLife_output/`:

#### Diagnostics MCMC
- `diagnostics_convergence.pdf`: Graphiques de convergence des chaînes MCMC
  - **Trace plots**: Montrent l'évolution des paramètres
  - **R-hat**: Valeurs proches de 1.0 = bonne convergence

#### Projections
- `cameroun_projections.pdf`: Trajectoires avec intervalles de confiance
- `cameroun_projections_resume.csv`: Résumé statistique par année
- `cameroun_trajectoires_echantillon.csv`: Échantillon de 100 trajectoires

#### Visualisations avancées
- `viz1_trajectoires_ggplot.png`: Trajectoires multiples avec IC 80% et 95%
- `viz2_distributions_annees.png`: Distributions en violon pour années clés
- `viz3_evolution_incertitude.png`: Largeur des intervalles de confiance
- `viz4_historique_vs_projections.png`: Données historiques et projections

### Lecture du tableau de résumé

Le fichier `cameroun_projections_resume.csv` contient:

- **mean**: Espérance de vie moyenne projetée
- **median**: Médiane (plus robuste que la moyenne)
- **lower.bound**: Limite inférieure de l'IC à 95%
- **upper.bound**: Limite supérieure de l'IC à 95%

Exemple d'interprétation:
```
Année 2050: médiane = 70.5 ans, IC 95% = [67.2, 73.8]
→ Il y a 95% de chances que l'espérance de vie soit entre 67.2 et 73.8 ans
```

## ⚙️ Paramètres MCMC

### Paramètres clés

| Paramètre | Valeur par défaut | Description |
|-----------|------------------|-------------|
| `nr.chains` | 3 | Nombre de chaînes MCMC parallèles |
| `iter` | 10,000 | Nombre d'itérations par chaîne |
| `thin` | 10 | Intervalle d'échantillonnage |
| `burnin` | Auto | Période de rodage (automatique) |

### Quand augmenter les paramètres?

**Augmentez `iter` si**:
- R-hat > 1.1 (mauvaise convergence)
- Les chaînes n'ont pas convergé

**Augmentez `nr.chains` si**:
- Vous voulez un meilleur diagnostic de convergence
- Vous avez un ordinateur multi-cœurs

**Réduisez `thin` si**:
- Vous voulez plus d'échantillons
- L'autocorrélation est faible

## 🔍 Vérification de la qualité

### 1. Convergence MCMC

Vérifiez le fichier `diagnostics_convergence.pdf`:

✅ **Bonne convergence**:
- Trace plots: chaînes bien mélangées
- R-hat ≈ 1.0 (< 1.1)
- Pas de tendances apparentes

❌ **Mauvaise convergence**:
- Chaînes ne se chevauchent pas
- R-hat > 1.1
- Tendances persistantes

**Solution**: Augmenter `iter` ou continuer la simulation

### 2. Qualité des projections

✅ **Bonnes projections**:
- Intervalles de confiance raisonnables
- Tendance cohérente avec l'historique
- Pas de sauts brusques

❌ **Projections douteuses**:
- IC trop larges ou trop étroits
- Tendances irréalistes
- Discontinuités

## 📚 Références

### Package bayesLife

- **Documentation**: [CRAN - bayesLife](https://cran.r-project.org/web/packages/bayesLife/index.html)
- **Article scientifique**: Raftery, A. E., et al. (2013). "Bayesian Probabilistic Projections of Life Expectancy for All Countries." *Demography*.

### Méthode MCMC

- Gelman, A., et al. (2013). *Bayesian Data Analysis*, 3rd ed.
- Metropolis, N., et al. (1953). "Equation of State Calculations by Fast Computing Machines."

### Données

- **Source**: United Nations Population Division
- **WPP (World Population Prospects)**: Données d'espérance de vie historiques

## ❓ Questions fréquentes

### La simulation est trop longue, que faire?

Réduisez `iter` à 5000 pour un test rapide:
```r
sim_mcmc <- run.e0.mcmc(iter = 5000, ...)
```

### Comment interpréter les intervalles de confiance?

- **IC 80%**: Zone bleue foncée - plage probable
- **IC 95%**: Zone bleue claire - plage très probable
- Plus l'IC est large, plus l'incertitude est grande

### Puis-je comparer plusieurs pays?

Oui! Modifiez le code `cameroon_code` pour d'autres pays:
```r
# Exemples de codes pays
senegal_code <- 686
nigeria_code <- 566
france_code <- 250
```

### Erreur: "convergence not achieved"

C'est normal! Exécutez:
```r
sim_mcmc <- continue.e0.mcmc(iter = 5000, output.dir = output_dir)
```

## 📧 Contact & Support

Pour toute question ou problème:
- Consultez la documentation officielle de bayesLife
- Forums R: [Stack Overflow](https://stackoverflow.com/questions/tagged/r)

## 📄 Licence

Ce code est fourni à des fins éducatives et de recherche.

---

**Auteur**: Projet de démonstration bayesLife
**Dernière mise à jour**: 2025
