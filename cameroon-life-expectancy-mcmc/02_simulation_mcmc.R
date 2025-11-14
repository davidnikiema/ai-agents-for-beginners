# =============================================================================
# Simulation MCMC de l'espérance de vie du Cameroun avec bayesLife
# =============================================================================

library(bayesLife)
library(ggplot2)

# Configuration
output_dir <- "bayesLife_output"
cameroon_code <- 120  # Code ISO pour le Cameroun

cat("=== Démarrage de la simulation MCMC pour le Cameroun ===\n\n")

# =============================================================================
# ÉTAPE 1: Simulation MCMC (Phase I)
# =============================================================================
cat("ÉTAPE 1: Lancement de la simulation MCMC (Phase I)...\n")

# Paramètres de la simulation
# - iter: nombre d'itérations MCMC
# - nr.chains: nombre de chaînes MCMC parallèles
# - thin: intervalle d'échantillonnage (pour réduire l'autocorrélation)
# - output.dir: répertoire de sortie

sim_mcmc <- run.e0.mcmc(
  nr.chains = 3,              # 3 chaînes pour vérifier la convergence
  iter = 10000,               # 10000 itérations (peut être augmenté pour plus de précision)
  thin = 10,                  # Conserver 1 échantillon sur 10
  output.dir = output_dir,
  verbose = TRUE
)

cat("\nSimulation MCMC Phase I terminée!\n")
cat("Nombre total d'échantillons conservés par chaîne:", 10000/10, "\n\n")

# =============================================================================
# ÉTAPE 2: Diagnostics de convergence
# =============================================================================
cat("ÉTAPE 2: Diagnostics de convergence MCMC...\n")

# Statistique de Gelman-Rubin (R-hat)
# Valeurs proches de 1.0 indiquent une bonne convergence
# Valeurs > 1.1 suggèrent de continuer la simulation

# Créer des graphiques de diagnostic
pdf(file.path(output_dir, "diagnostics_convergence.pdf"), width = 12, height = 8)
e0.diagnose(sim_mcmc, country = cameroon_code, thin = 1)
dev.off()

cat("Diagnostics de convergence sauvegardés dans:",
    file.path(output_dir, "diagnostics_convergence.pdf"), "\n\n")

# =============================================================================
# ÉTAPE 3: Continuation de la simulation si nécessaire (optionnel)
# =============================================================================
# Décommentez les lignes suivantes si vous souhaitez continuer la simulation
# pour améliorer la convergence

# cat("ÉTAPE 3: Continuation de la simulation...\n")
# sim_mcmc <- continue.e0.mcmc(
#   iter = 5000,
#   output.dir = output_dir,
#   verbose = TRUE
# )
# cat("Continuation terminée!\n\n")

# =============================================================================
# ÉTAPE 4: Projections d'espérance de vie
# =============================================================================
cat("ÉTAPE 4: Génération des projections d'espérance de vie...\n")

# Générer les projections jusqu'en 2100
pred <- e0.predict(
  sim.dir = output_dir,
  end.year = 2100,           # Projeter jusqu'en 2100
  nr.traj = 1000,            # Nombre de trajectoires de projection
  save.as.ascii = 0,
  verbose = TRUE
)

cat("\nProjections générées jusqu'en 2100!\n")
cat("Nombre de trajectoires:", 1000, "\n\n")

# =============================================================================
# ÉTAPE 5: Résumé des résultats pour le Cameroun
# =============================================================================
cat("ÉTAPE 5: Résumé des résultats pour le Cameroun...\n\n")

# Obtenir les résumés de projection
summary_pred <- summary(pred, country = cameroon_code)

cat("=== Projections de l'espérance de vie pour le Cameroun ===\n")
print(summary_pred)

# Exporter les résultats en CSV
write.csv(
  summary_pred,
  file.path(output_dir, "cameroun_projections_resume.csv"),
  row.names = TRUE
)

cat("\nRésumé exporté dans:",
    file.path(output_dir, "cameroun_projections_resume.csv"), "\n\n")

# =============================================================================
# ÉTAPE 6: Visualisation graphique
# =============================================================================
cat("ÉTAPE 6: Création des graphiques de projection...\n")

# Graphique des projections avec intervalles de confiance
pdf(file.path(output_dir, "cameroun_projections.pdf"), width = 12, height = 8)

e0.trajectories.plot(
  pred,
  country = cameroon_code,
  pi = c(80, 95),  # Intervalles de prédiction à 80% et 95%
  main = "Projections de l'espérance de vie - Cameroun",
  xlab = "Année",
  ylab = "Espérance de vie à la naissance (années)"
)

dev.off()

cat("Graphiques sauvegardés dans:",
    file.path(output_dir, "cameroun_projections.pdf"), "\n\n")

# =============================================================================
# ÉTAPE 7: Graphique de densité pour des années spécifiques
# =============================================================================
cat("ÉTAPE 7: Création des graphiques de densité...\n")

# Graphique de densité pour l'année 2050
pdf(file.path(output_dir, "cameroun_densite_2050.pdf"), width = 10, height = 6)

e0.trajectories.plot(
  pred,
  country = cameroon_code,
  typical.trajectory = TRUE,
  show.legend = TRUE
)

dev.off()

cat("Graphique de densité sauvegardé dans:",
    file.path(output_dir, "cameroun_densite_2050.pdf"), "\n\n")

# =============================================================================
# ÉTAPE 8: Extraction de trajectoires individuelles
# =============================================================================
cat("ÉTAPE 8: Extraction des trajectoires individuelles...\n")

# Obtenir toutes les trajectoires
trajectories <- get.e0.trajectories(pred, country = cameroon_code)

# Sauvegarder quelques trajectoires échantillons
traj_sample <- trajectories[, sample(ncol(trajectories), min(100, ncol(trajectories)))]
write.csv(
  traj_sample,
  file.path(output_dir, "cameroun_trajectoires_echantillon.csv"),
  row.names = TRUE
)

cat("Échantillon de trajectoires exporté dans:",
    file.path(output_dir, "cameroun_trajectoires_echantillon.csv"), "\n\n")

# =============================================================================
# Résumé final
# =============================================================================
cat("========================================\n")
cat("SIMULATION TERMINÉE AVEC SUCCÈS!\n")
cat("========================================\n\n")
cat("Fichiers générés dans le dossier:", output_dir, "\n")
cat("1. diagnostics_convergence.pdf - Diagnostics MCMC\n")
cat("2. cameroun_projections.pdf - Graphiques de projection\n")
cat("3. cameroun_densite_2050.pdf - Densités de probabilité\n")
cat("4. cameroun_projections_resume.csv - Résumé des projections\n")
cat("5. cameroun_trajectoires_echantillon.csv - Échantillon de trajectoires\n\n")

# Afficher quelques statistiques clés
cat("=== Statistiques clés ===\n")
cat("Espérance de vie estimée pour 2050:\n")
summary_2050 <- summary_pred[rownames(summary_pred) == "2050", ]
if (length(summary_2050) > 0) {
  print(summary_2050)
} else {
  cat("Année 2050 non disponible dans les résultats\n")
}
