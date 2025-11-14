# 🚀 Démarrage Rapide - Simulation MCMC Cameroun

## ⚡ Démarrage en 3 étapes (pour les pressés)

### Étape 1: Vérification (1 minute)
```r
source("00_verification_cameroun.R")
```
**Important:** Ce script trouve automatiquement le code pays du Cameroun

### Étape 2: Exécution complète (20-40 minutes)
```r
source("RUN_ALL.R")
```
**Allez prendre un café!** ☕ Ce script fait TOUT automatiquement.

### Étape 3: Voir les résultats
Ouvrez le fichier:
```
bayesLife_output/viz4_historique_vs_projections.png
```

---

## 📖 Démarrage détaillé

### Option A: Exécution automatique complète

Si vous voulez tout faire d'un coup sans vous soucier des détails:

```r
# 1. Vérifier le code pays
source("00_verification_cameroun.R")

# 2. Tout exécuter
source("RUN_ALL.R")
```

⏱️ Temps total: **20-40 minutes**

### Option B: Exécution étape par étape

Si vous préférez comprendre chaque étape:

```r
# Étape 1: Vérification du code pays (OBLIGATOIRE)
source("00_verification_cameroun.R")

# Étape 2: Installation et configuration
source("01_installation.R")

# Étape 3: Simulation MCMC (15-30 minutes)
source("02_simulation_mcmc.R")

# Étape 4: Visualisations avancées
source("03_visualisation_avancee.R")

# Étape 5: Analyse des paramètres MCMC
source("04_analyse_parametres_mcmc.R")
```

---

## 🎯 Que faire si ça ne marche pas?

### Problème 1: "Cameroun non trouvé"

**Solution rapide:**
```r
# Exécutez ce script qui trouve le bon code
source("00_verification_cameroun.R")

# Puis lisez le code trouvé
cameroon_code <- as.numeric(readLines("CAMEROON_CODE.txt"))
cat("Code trouvé:", cameroon_code, "\n")
```

### Problème 2: "Package bayesLife not found"

**Solution:**
```r
install.packages("bayesLife")
install.packages(c("ggplot2", "dplyr", "tidyr"))
```

### Problème 3: Simulation trop lente

**Solution - Test rapide d'abord:**
```r
# Dans 02_simulation_mcmc.R, modifiez:
sim_mcmc <- run.e0.mcmc(
  nr.chains = 1,    # Au lieu de 3
  iter = 5000,      # Au lieu de 10000
  thin = 10,
  output.dir = output_dir
)
```

### Plus de problèmes?

Consultez le **[Guide de Dépannage](GUIDE_DEPANNAGE.md)** complet!

---

## 📂 Structure des fichiers

```
cameroon-life-expectancy-mcmc/
│
├── 00_verification_cameroun.R    ⭐ COMMENCEZ ICI
├── 01_installation.R             Installation
├── 02_simulation_mcmc.R          Simulation principale
├── 03_visualisation_avancee.R    Graphiques
├── 04_analyse_parametres_mcmc.R  Diagnostics
├── RUN_ALL.R                     ⚡ Tout automatique
│
├── README.md                     Documentation complète
├── GUIDE_DEPANNAGE.md           Résolution de problèmes
├── DEMARRAGE_RAPIDE.md          Ce fichier
│
└── bayesLife_output/            📊 Dossier des résultats
    ├── *.pdf                    Graphiques
    ├── *.csv                    Données
    └── *.png                    Visualisations
```

---

## 📊 Résultats principaux à consulter

Après l'exécution, consultez ces fichiers dans `bayesLife_output/`:

### 🎨 Visualisations (COMMENCEZ PAR LÀ)
1. **viz4_historique_vs_projections.png** - Vue d'ensemble
2. **viz1_trajectoires_ggplot.png** - Trajectoires avec IC
3. **viz2_distributions_annees.png** - Distributions par année

### 📄 Données chiffrées
1. **RAPPORT_FINAL.txt** - Résumé complet
2. **tableau_synthese_annees_cles.csv** - Données pour 2025, 2050, 2075, 2100
3. **cameroun_projections_resume.csv** - Toutes les années

### 🔬 Diagnostics (pour les experts)
1. **diagnostics_convergence.pdf** - Vérifier la convergence
2. **rapport_diagnostic_complet.txt** - Analyse détaillée

---

## 💡 Conseils pratiques

### Pour une première utilisation:

1. ✅ **Toujours commencer par:** `source("00_verification_cameroun.R")`
2. ✅ **Utiliser:** `source("RUN_ALL.R")` pour tout automatiser
3. ✅ **Vérifier:** `viz4_historique_vs_projections.png` en premier

### Pour personnaliser:

- **Changer le pays:** Modifiez `cameroon_code` dans les scripts
- **Projections plus lointaines:** Changez `end.year = 2100` à `2150`
- **Plus de précision:** Augmentez `iter = 10000` à `20000`

### Pour comprendre:

- **MCMC:** Méthode statistique pour estimer les paramètres
- **IC 95%:** Zone bleue = 95% de chances que la vraie valeur soit dedans
- **Médiane:** Ligne rouge = valeur centrale projetée

---

## 🔢 Codes pays utiles

Si vous voulez analyser d'autres pays:

```r
# Quelques codes utiles
cameroon_code <- 120   # Cameroun (vérifier avec 00_verification_cameroun.R)
senegal_code <- 686    # Sénégal
nigeria_code <- 566    # Nigeria
france_code <- 250     # France (pour comparer)
usa_code <- 840        # États-Unis

# Changer le code dans vos scripts:
country_code <- senegal_code  # Par exemple
```

---

## ⏱️ Estimation du temps

| Tâche | Temps |
|-------|-------|
| Vérification du code pays | < 1 min |
| Installation | < 1 min |
| Simulation MCMC | 15-30 min |
| Visualisations | 3-5 min |
| Analyse paramètres | 3-5 min |
| **TOTAL (RUN_ALL.R)** | **20-40 min** |

**Note:** Le temps dépend de votre ordinateur. Un ordinateur moderne avec plusieurs cœurs sera plus rapide.

---

## ✅ Checklist avant de commencer

- [ ] R est installé (version 4.0+)
- [ ] RStudio est installé (recommandé)
- [ ] Connexion Internet active
- [ ] Packages installés: `install.packages(c("bayesLife", "ggplot2", "dplyr", "tidyr"))`
- [ ] Au moins 500 MB d'espace disque libre
- [ ] 30-40 minutes de temps disponible

---

## 🆘 Support

1. **Guide de Dépannage:** [GUIDE_DEPANNAGE.md](GUIDE_DEPANNAGE.md)
2. **Documentation complète:** [README.md](README.md)
3. **Forum R:** https://stackoverflow.com/questions/tagged/r
4. **Documentation bayesLife:** `?bayesLife` dans R

---

## 🎓 Pour aller plus loin

Une fois les résultats obtenus:

1. **Interpréter les résultats:**
   - Lisez le fichier `RAPPORT_FINAL.txt`
   - Consultez la section "Interprétation des résultats" du README

2. **Améliorer la simulation:**
   - Augmentez le nombre d'itérations si la convergence est faible
   - Comparez avec d'autres pays de la région

3. **Publications et rapports:**
   - Utilisez les graphiques PNG pour vos présentations
   - Exportez les CSV pour Excel/Tableau
   - Citez: Raftery et al. (2013) - Bayesian Probabilistic Projections

---

**Bonne chance avec vos simulations!** 🎉

Si vous avez des questions, consultez le [Guide de Dépannage](GUIDE_DEPANNAGE.md) ou le [README complet](README.md).
