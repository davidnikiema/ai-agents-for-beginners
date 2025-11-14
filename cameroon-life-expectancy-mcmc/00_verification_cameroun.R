# =============================================================================
# VÉRIFICATION DU CODE PAYS POUR LE CAMEROUN
# Ce script trouve le bon code pour le Cameroun dans bayesLife
# =============================================================================

library(bayesLife)

cat("=== RECHERCHE DU CAMEROUN DANS LES DONNÉES BAYESLIFE ===\n\n")

# Charger les données de localisation de l'ONU
data(UNlocations)

cat("1. Recherche du Cameroun dans UNlocations...\n\n")

# Rechercher le Cameroun (plusieurs variations possibles)
cameroun_variations <- c("Cameroon", "Cameroun", "CMR", "CM")

for (variation in cameroun_variations) {
  cat("Recherche de '", variation, "':\n", sep = "")
  results <- UNlocations[grepl(variation, UNlocations$name, ignore.case = TRUE), ]
  if (nrow(results) > 0) {
    print(results)
    cat("\n")
  } else {
    cat("  Aucun résultat trouvé\n\n")
  }
}

# Recherche par région (Afrique)
cat("\n2. Recherche dans les pays d'Afrique...\n\n")
african_countries <- UNlocations[UNlocations$area_name == "Africa", ]
cameroun_in_africa <- african_countries[grepl("Camer", african_countries$name, ignore.case = TRUE), ]

if (nrow(cameroun_in_africa) > 0) {
  cat("✓ Cameroun trouvé dans les pays africains!\n")
  print(cameroun_in_africa)

  # Extraire le code pays
  cameroon_code <- cameroun_in_africa$country_code[1]
  cat("\n✓✓✓ CODE PAYS CORRECT POUR LE CAMEROUN:", cameroon_code, "✓✓✓\n\n")
} else {
  cat("✗ Cameroun non trouvé dans la liste des pays africains\n")
}

# Vérifier les données d'espérance de vie
cat("\n3. Vérification des données d'espérance de vie pour le Cameroun...\n\n")

# Charger les données d'espérance de vie
data(e0F)
data(e0M)

if (exists("cameroon_code")) {
  # Données femmes
  e0F_cameroon <- e0F[e0F$country_code == cameroon_code, ]
  cat("Données d'espérance de vie (FEMMES) pour le Cameroun:\n")
  if (nrow(e0F_cameroon) > 0) {
    cat("✓ Données disponibles de", min(e0F_cameroon$year), "à", max(e0F_cameroon$year), "\n")
    cat("Dernière valeur:", tail(e0F_cameroon, 1)$value, "ans en", tail(e0F_cameroon, 1)$year, "\n")
    print(tail(e0F_cameroon, 5))
  } else {
    cat("✗ Aucune donnée trouvée\n")
  }

  cat("\n")

  # Données hommes
  e0M_cameroon <- e0M[e0M$country_code == cameroon_code, ]
  cat("Données d'espérance de vie (HOMMES) pour le Cameroun:\n")
  if (nrow(e0M_cameroon) > 0) {
    cat("✓ Données disponibles de", min(e0M_cameroon$year), "à", max(e0M_cameroon$year), "\n")
    cat("Dernière valeur:", tail(e0M_cameroon, 1)$value, "ans en", tail(e0M_cameroon, 1)$year, "\n")
    print(tail(e0M_cameroon, 5))
  } else {
    cat("✗ Aucune donnée trouvée\n")
  }
}

# Liste complète des pays africains disponibles
cat("\n\n4. Liste de TOUS les pays africains disponibles dans bayesLife:\n\n")
cat("Code | Nom du pays\n")
cat("-----+", paste(rep("-", 50), collapse = ""), "\n", sep = "")

african_sorted <- african_countries[order(african_countries$name), ]
for (i in 1:nrow(african_sorted)) {
  cat(sprintf("%4d | %s\n",
              african_sorted$country_code[i],
              african_sorted$name[i]))
}

cat("\n")
cat("="*80, "\n")
cat("RÉSUMÉ:\n")
cat("="*80, "\n")
if (exists("cameroon_code")) {
  cat("✓ Code pays pour le Cameroun:", cameroon_code, "\n")
  cat("✓ Utilisez ce code dans tous les scripts!\n\n")

  cat("COMMANDE À UTILISER DANS VOS SCRIPTS:\n")
  cat("cameroon_code <-", cameroon_code, "\n\n")
} else {
  cat("✗ Impossible de trouver le Cameroun automatiquement\n")
  cat("Consultez la liste ci-dessus et choisissez le code manuellement\n\n")
}

# Sauvegarder le code dans un fichier
if (exists("cameroon_code")) {
  writeLines(
    as.character(cameroon_code),
    "CAMEROON_CODE.txt"
  )
  cat("✓ Code pays sauvegardé dans: CAMEROON_CODE.txt\n")
}
