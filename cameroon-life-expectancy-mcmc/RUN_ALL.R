# =============================================================================
# SCRIPT D'EXÉCUTION RAPIDE - Simulation MCMC Espérance de Vie Cameroun
# =============================================================================
# Ce script exécute automatiquement toutes les étapes de l'analyse
# Utilisez-le pour une exécution complète automatisée
# =============================================================================

cat("╔═══════════════════════════════════════════════════════════════╗\n")
cat("║  SIMULATION MCMC - ESPÉRANCE DE VIE DU CAMEROUN              ║\n")
cat("║  Package: bayesLife                                          ║\n")
cat("╚═══════════════════════════════════════════════════════════════╝\n\n")

# Enregistrer l'heure de début
start_time <- Sys.time()

# =============================================================================
# ÉTAPE 1: Installation et Configuration
# =============================================================================
cat("\n[1/5] Installation et configuration...\n")
cat("─────────────────────────────────────────────────────\n")

tryCatch({
  source("01_installation.R")
  cat("✓ Installation et configuration réussies!\n\n")
}, error = function(e) {
  cat("✗ ERREUR lors de l'installation:\n")
  cat(e$message, "\n")
  cat("Vérifiez que tous les packages sont installés.\n")
  stop("Installation échouée")
})

# Pause pour laisser l'utilisateur voir les résultats
Sys.sleep(2)

# =============================================================================
# ÉTAPE 2: Simulation MCMC et Projections
# =============================================================================
cat("\n[2/5] Simulation MCMC et projections...\n")
cat("─────────────────────────────────────────────────────\n")
cat("⏱️  Cette étape peut prendre 15-30 minutes\n")
cat("☕ Allez prendre un café!\n\n")

tryCatch({
  source("02_simulation_mcmc.R")
  cat("✓ Simulation MCMC terminée avec succès!\n\n")
}, error = function(e) {
  cat("✗ ERREUR lors de la simulation:\n")
  cat(e$message, "\n")
  stop("Simulation échouée")
})

# =============================================================================
# ÉTAPE 3: Visualisations Avancées
# =============================================================================
cat("\n[3/5] Création des visualisations avancées...\n")
cat("─────────────────────────────────────────────────────\n")

tryCatch({
  source("03_visualisation_avancee.R")
  cat("✓ Visualisations créées avec succès!\n\n")
}, error = function(e) {
  cat("✗ ERREUR lors de la visualisation:\n")
  cat(e$message, "\n")
  cat("Continuons malgré l'erreur...\n")
})

# =============================================================================
# ÉTAPE 4: Analyse des Paramètres MCMC
# =============================================================================
cat("\n[4/5] Analyse détaillée des paramètres MCMC...\n")
cat("─────────────────────────────────────────────────────\n")

tryCatch({
  source("04_analyse_parametres_mcmc.R")
  cat("✓ Analyse des paramètres terminée!\n\n")
}, error = function(e) {
  cat("✗ ERREUR lors de l'analyse:\n")
  cat(e$message, "\n")
  cat("Continuons malgré l'erreur...\n")
})

# =============================================================================
# ÉTAPE 5: Génération du Rapport Final
# =============================================================================
cat("\n[5/5] Génération du rapport final...\n")
cat("─────────────────────────────────────────────────────\n")

# Créer un rapport HTML simple
output_dir <- "bayesLife_output"

# Calculer le temps d'exécution
end_time <- Sys.time()
execution_time <- difftime(end_time, start_time, units = "mins")

# Créer un résumé final
sink(file.path(output_dir, "RAPPORT_FINAL.txt"))

cat("═══════════════════════════════════════════════════════════════\n")
cat("  RAPPORT FINAL - SIMULATION MCMC ESPÉRANCE DE VIE CAMEROUN\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

cat("Date d'exécution:", format(end_time, "%Y-%m-%d %H:%M:%S"), "\n")
cat("Temps d'exécution total:", round(execution_time, 2), "minutes\n\n")

cat("───────────────────────────────────────────────────────────────\n")
cat("FICHIERS GÉNÉRÉS\n")
cat("───────────────────────────────────────────────────────────────\n\n")

cat("📊 DIAGNOSTICS MCMC:\n")
cat("  • diagnostics_convergence.pdf\n")
cat("  • analyse_trace_plots.pdf\n")
cat("  • analyse_densites_posteriori.pdf\n")
cat("  • analyse_autocorrelation.pdf\n")
cat("  • analyse_comparaison_chaines.pdf\n")
cat("  • analyse_burnin.pdf\n\n")

cat("📈 PROJECTIONS:\n")
cat("  • cameroun_projections.pdf\n")
cat("  • cameroun_densite_2050.pdf\n")
cat("  • cameroun_projections_resume.csv\n")
cat("  • cameroun_trajectoires_echantillon.csv\n\n")

cat("🎨 VISUALISATIONS AVANCÉES:\n")
cat("  • viz1_trajectoires_ggplot.png\n")
cat("  • viz2_distributions_annees.png\n")
cat("  • viz3_evolution_incertitude.png\n")
cat("  • viz4_historique_vs_projections.png\n")
cat("  • tableau_synthese_annees_cles.csv\n\n")

cat("📝 RAPPORTS:\n")
cat("  • rapport_diagnostic_complet.txt\n")
cat("  • RAPPORT_FINAL.txt (ce fichier)\n\n")

cat("───────────────────────────────────────────────────────────────\n")
cat("RÉSUMÉ DES RÉSULTATS\n")
cat("───────────────────────────────────────────────────────────────\n\n")

# Charger et afficher le résumé des projections
pred <- get.e0.prediction(sim.dir = output_dir)
summary_pred <- summary(pred, country = 120)

cat("Projections de l'espérance de vie pour le Cameroun:\n\n")
print(summary_pred)

cat("\n───────────────────────────────────────────────────────────────\n")
cat("POINTS CLÉS À VÉRIFIER\n")
cat("───────────────────────────────────────────────────────────────\n\n")

cat("1. CONVERGENCE MCMC:\n")
cat("   → Ouvrez diagnostics_convergence.pdf\n")
cat("   → Vérifiez que les chaînes se mélangent bien\n")
cat("   → R-hat doit être proche de 1.0\n\n")

cat("2. QUALITÉ DES PROJECTIONS:\n")
cat("   → Ouvrez cameroun_projections.pdf\n")
cat("   → Vérifiez que les tendances sont réalistes\n")
cat("   → Les intervalles de confiance doivent être raisonnables\n\n")

cat("3. VISUALISATIONS:\n")
cat("   → Examinez viz4_historique_vs_projections.png\n")
cat("   → Vérifiez la cohérence avec les données historiques\n\n")

cat("───────────────────────────────────────────────────────────────\n")
cat("PROCHAINES ÉTAPES\n")
cat("───────────────────────────────────────────────────────────────\n\n")

cat("Si la convergence est insuffisante:\n")
cat("  run.e0.mcmc(iter = 20000, ...)\n\n")

cat("Pour continuer une simulation existante:\n")
cat("  continue.e0.mcmc(iter = 5000, output.dir = 'bayesLife_output')\n\n")

cat("Pour analyser d'autres pays:\n")
cat("  Modifiez cameroon_code dans les scripts\n")
cat("  Codes pays disponibles dans: data(UNlocations)\n\n")

cat("───────────────────────────────────────────────────────────────\n")
cat("RÉFÉRENCES\n")
cat("───────────────────────────────────────────────────────────────\n\n")

cat("• Documentation bayesLife:\n")
cat("  https://cran.r-project.org/web/packages/bayesLife/\n\n")

cat("• Article scientifique:\n")
cat("  Raftery et al. (2013) - Bayesian Probabilistic Projections\n")
cat("  of Life Expectancy for All Countries. Demography.\n\n")

cat("═══════════════════════════════════════════════════════════════\n")
cat("FIN DU RAPPORT\n")
cat("═══════════════════════════════════════════════════════════════\n")

sink()

cat("✓ Rapport final généré!\n\n")

# =============================================================================
# AFFICHAGE FINAL
# =============================================================================
cat("\n╔═══════════════════════════════════════════════════════════════╗\n")
cat("║                   🎉 ANALYSE TERMINÉE! 🎉                    ║\n")
cat("╚═══════════════════════════════════════════════════════════════╝\n\n")

cat("⏱️  Temps total d'exécution:", round(execution_time, 2), "minutes\n\n")

cat("📁 Tous les fichiers ont été sauvegardés dans:", output_dir, "\n\n")

cat("📖 FICHIERS PRINCIPAUX À CONSULTER:\n")
cat("   1. RAPPORT_FINAL.txt - Résumé complet de l'analyse\n")
cat("   2. viz4_historique_vs_projections.png - Vue d'ensemble graphique\n")
cat("   3. tableau_synthese_annees_cles.csv - Données chiffrées clés\n\n")

cat("💡 CONSEIL:\n")
cat("   Commencez par ouvrir viz4_historique_vs_projections.png\n")
cat("   pour une vue d'ensemble visuelle des résultats!\n\n")

cat("═══════════════════════════════════════════════════════════════\n")
cat("Merci d'avoir utilisé bayesLife pour vos analyses!\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# Ouvrir automatiquement le dossier de sortie (si possible)
if (.Platform$OS.type == "windows") {
  shell.exec(output_dir)
} else if (Sys.info()["sysname"] == "Darwin") {
  system(paste("open", output_dir))
} else {
  cat("Pour voir les résultats, ouvrez le dossier:", output_dir, "\n")
}
