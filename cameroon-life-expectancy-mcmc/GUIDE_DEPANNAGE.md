# 🔧 Guide de Dépannage - Simulation MCMC Cameroun

## ❌ Problème: Cameroun non trouvé dans les simulations

### 🔍 Solution 1: Trouver le bon code pays

Le code pays pour le Cameroun peut varier selon les versions de bayesLife. Voici comment trouver le bon code:

#### **ÉTAPE 1: Exécutez le script de vérification**

```r
source("00_verification_cameroun.R")
```

Ce script va:
- ✅ Chercher le Cameroun dans la base de données
- ✅ Afficher tous les codes possibles
- ✅ Vérifier que les données existent
- ✅ Sauvegarder le bon code dans `CAMEROON_CODE.txt`

#### **ÉTAPE 2: Vérifiez le résultat**

Le script affichera quelque chose comme:
```
✓✓✓ CODE PAYS CORRECT POUR LE CAMEROUN: 120 ✓✓✓
```

#### **ÉTAPE 3: Mettez à jour tous les scripts**

Option A - **Automatique** (recommandé):
```r
# Lire le code trouvé
cameroon_code <- as.numeric(readLines("CAMEROON_CODE.txt"))

# Utiliser ce code dans vos simulations
```

Option B - **Manuel**:
Modifiez la ligne suivante dans chaque script:
```r
# AVANT:
cameroon_code <- 120

# APRÈS (avec le code trouvé):
cameroon_code <- VOTRE_CODE_ICI
```

---

## 🌍 Codes pays alternatifs à essayer

Si le code 120 ne fonctionne pas, essayez ces codes courants:

| Code | Pays |
|------|------|
| 120 | Cameroun (code ISO standard) |
| 124 | Cameroun (code ONU alternatif) |
| 204 | Benin (pour tester) |
| 566 | Nigeria |
| 686 | Sénégal |
| 854 | Burkina Faso |

### Test rapide d'un code:

```r
library(bayesLife)
test_code <- 120  # Changez ce numéro

# Vérifier si des données existent
data(e0F)
test_data <- e0F[e0F$country_code == test_code, ]

if (nrow(test_data) > 0) {
  cat("✓ Code", test_code, "fonctionne!\n")
  cat("Pays:", test_data$country_name[1], "\n")
  cat("Données disponibles:", nrow(test_data), "années\n")
  print(tail(test_data, 3))
} else {
  cat("✗ Aucune donnée pour le code", test_code, "\n")
}
```

---

## 📋 Liste complète des codes pays africains

Pour voir tous les pays africains disponibles:

```r
library(bayesLife)
data(UNlocations)

# Afficher tous les pays africains
african_countries <- UNlocations[UNlocations$area_name == "Africa", ]
print(african_countries[order(african_countries$name), c("country_code", "name")])
```

---

## 🐛 Autres problèmes courants

### Problème 2: "Error: Package bayesLife not found"

**Solution:**
```r
install.packages("bayesLife")
library(bayesLife)
```

### Problème 3: "Convergence not achieved"

**Cause:** Les chaînes MCMC n'ont pas convergé

**Solution:**
```r
# Prolonger la simulation
sim_mcmc <- continue.e0.mcmc(
  iter = 10000,
  output.dir = "bayesLife_output"
)
```

### Problème 4: Simulation trop lente

**Solutions:**
- Réduire le nombre d'itérations pour un test:
  ```r
  sim_mcmc <- run.e0.mcmc(iter = 5000, ...)  # Au lieu de 10000
  ```

- Réduire le nombre de chaînes:
  ```r
  sim_mcmc <- run.e0.mcmc(nr.chains = 2, ...)  # Au lieu de 3
  ```

- Augmenter le thinning:
  ```r
  sim_mcmc <- run.e0.mcmc(thin = 20, ...)  # Au lieu de 10
  ```

### Problème 5: "Cannot open file bayesLife_output/..."

**Cause:** Le dossier de sortie n'existe pas

**Solution:**
```r
output_dir <- "bayesLife_output"
if (!dir.exists(output_dir)) {
  dir.create(output_dir, recursive = TRUE)
}
```

### Problème 6: Graphiques ne s'affichent pas

**Solution:**
```r
# Sauvegarder dans un PDF
pdf("mon_graphique.pdf")
# Votre code de graphique ici
dev.off()

# Ou utiliser une fenêtre graphique
windows()  # Windows
quartz()   # Mac
x11()      # Linux
```

---

## 🆘 Procédure de dépannage complète

### Étape 1: Vérification de base

```r
# Tester l'installation
library(bayesLife)
packageVersion("bayesLife")

# Vérifier les données
data(e0F)
cat("Nombre total de pays avec données:", length(unique(e0F$country_code)), "\n")
```

### Étape 2: Trouver le Cameroun

```r
source("00_verification_cameroun.R")
```

### Étape 3: Test avec le code trouvé

```r
# Utiliser le code trouvé
cameroon_code <- as.numeric(readLines("CAMEROON_CODE.txt"))

# Test rapide de simulation (2 minutes)
test_sim <- run.e0.mcmc(
  nr.chains = 1,
  iter = 1000,
  thin = 5,
  output.dir = "test_output",
  verbose = TRUE
)

# Si ça marche, continuer avec les vrais paramètres
```

### Étape 4: Si rien ne fonctionne

Essayez avec un autre pays d'abord pour vérifier que bayesLife fonctionne:

```r
# Tester avec la France (code 250)
test_code <- 250

sim_test <- run.e0.mcmc(
  nr.chains = 1,
  iter = 1000,
  output.dir = "test_france"
)

pred_test <- e0.predict(sim.dir = "test_france")
e0.trajectories.plot(pred_test, country = test_code)
```

Si cela fonctionne, le problème vient du code pays du Cameroun.

---

## 📞 Obtenir de l'aide

1. **Documentation officielle:** `?bayesLife`
2. **Exemples:** `example(run.e0.mcmc)`
3. **Forum R:** https://stackoverflow.com/questions/tagged/r
4. **CRAN:** https://cran.r-project.org/web/packages/bayesLife/

---

## ✅ Checklist de vérification

Avant de lancer une simulation complète:

- [ ] bayesLife est installé: `library(bayesLife)`
- [ ] Le code pays est correct: `source("00_verification_cameroun.R")`
- [ ] Les données existent: Vérifier que le script affiche des données
- [ ] Le dossier de sortie existe: `dir.exists("bayesLife_output")`
- [ ] Test rapide réussi: Simulation de 1000 itérations
- [ ] Espace disque suffisant: >500 MB recommandé

---

## 🎯 Script de test rapide complet

Copiez-collez ce code pour un diagnostic complet:

```r
# ============================================
# DIAGNOSTIC COMPLET
# ============================================

cat("=== DIAGNOSTIC BAYESLIFE ===\n\n")

# 1. Version
cat("1. Version de bayesLife:", as.character(packageVersion("bayesLife")), "\n\n")

# 2. Recherche du Cameroun
cat("2. Recherche du Cameroun...\n")
library(bayesLife)
data(UNlocations)
data(e0F)

cameroon <- UNlocations[grepl("Camer", UNlocations$name, ignore.case = TRUE), ]
if (nrow(cameroon) > 0) {
  cat("✓ Trouvé:", cameroon$name[1], "\n")
  cat("✓ Code:", cameroon$country_code[1], "\n")

  cameroon_code <- cameroon$country_code[1]

  # 3. Vérifier les données
  cat("\n3. Données d'espérance de vie:\n")
  cam_data <- e0F[e0F$country_code == cameroon_code, ]
  cat("✓ Nombre d'années:", nrow(cam_data), "\n")
  cat("✓ Dernière année:", max(cam_data$year), "\n")
  cat("✓ Dernière valeur:", tail(cam_data$value, 1), "ans\n")

  # 4. Test de simulation ultra-rapide
  cat("\n4. Test de simulation (30 secondes)...\n")
  test_dir <- "diagnostic_test"

  test_sim <- try({
    run.e0.mcmc(
      nr.chains = 1,
      iter = 100,
      thin = 1,
      output.dir = test_dir,
      verbose = FALSE
    )
  })

  if (!inherits(test_sim, "try-error")) {
    cat("✓✓✓ TOUT FONCTIONNE! ✓✓✓\n")
    cat("\nVous pouvez lancer les simulations complètes!\n")
    cat("Code à utiliser: cameroon_code <-", cameroon_code, "\n")
  } else {
    cat("✗ Erreur pendant la simulation test\n")
    print(test_sim)
  }

} else {
  cat("✗ Cameroun non trouvé\n")
  cat("Codes africains disponibles:\n")
  africa <- UNlocations[UNlocations$area_name == "Africa", ]
  print(africa[1:10, c("country_code", "name")])
}
```

---

**Dernière mise à jour:** 2025-11-14
