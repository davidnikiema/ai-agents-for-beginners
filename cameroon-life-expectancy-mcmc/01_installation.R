# =============================================================================
# Installation et Configuration pour bayesLife
# Simulation MCMC de l'espérance de vie du Cameroun
# =============================================================================

# Installation des packages nécessaires
# Décommentez la ligne suivante si vous n'avez pas encore installé les packages
# install.packages(c("bayesLife", "ggplot2", "dplyr", "tidyr"))

# Chargement des librairies
library(bayesLife)
library(ggplot2)
library(dplyr)
library(tidyr)

# Vérification de la version de bayesLife
cat("Version de bayesLife:", packageVersion("bayesLife"), "\n")

# Configuration du répertoire de travail
# Créer un dossier pour stocker les résultats des simulations
output_dir <- "bayesLife_output"
if (!dir.exists(output_dir)) {
  dir.create(output_dir, recursive = TRUE)
  cat("Dossier de sortie créé:", output_dir, "\n")
}

# Affichage des données disponibles dans bayesLife
cat("\n=== Données d'espérance de vie disponibles ===\n")
data(e0Fproj)
head(e0Fproj)

# Vérification que les données du Cameroun sont disponibles
cameroon_code <- 120  # Code ISO pour le Cameroun
cat("\n=== Vérification des données du Cameroun (Code pays:", cameroon_code, ") ===\n")

# Liste de tous les pays disponibles
data(UNlocations)
cameroon_info <- UNlocations[UNlocations$country_code == cameroon_code, ]
if (nrow(cameroon_info) > 0) {
  cat("Pays trouvé:", cameroon_info$name, "\n")
} else {
  cat("Attention: Données du Cameroun non trouvées avec le code", cameroon_code, "\n")
}

cat("\n=== Configuration terminée avec succès! ===\n")
