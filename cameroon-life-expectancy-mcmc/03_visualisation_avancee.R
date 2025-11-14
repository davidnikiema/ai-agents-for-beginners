# =============================================================================
# Visualisation Avancée des Résultats MCMC - Espérance de vie Cameroun
# =============================================================================

library(bayesLife)
library(ggplot2)
library(dplyr)
library(tidyr)

# Configuration
output_dir <- "bayesLife_output"
cameroon_code <- 120

cat("=== Chargement des résultats de la simulation ===\n")

# Charger les résultats de la simulation
pred <- get.e0.prediction(sim.dir = output_dir)
sim_mcmc <- get.e0.mcmc(output_dir)

cat("Résultats chargés avec succès!\n\n")

# =============================================================================
# VISUALISATION 1: Trajectoires multiples avec ggplot2
# =============================================================================
cat("Création de la visualisation 1: Trajectoires multiples...\n")

# Extraire les trajectoires
trajectories <- get.e0.trajectories(pred, country = cameroon_code)
years <- as.numeric(rownames(trajectories))

# Créer un dataframe pour ggplot
df_traj <- data.frame(
  year = years,
  median = apply(trajectories, 1, median),
  q025 = apply(trajectories, 1, quantile, probs = 0.025),
  q975 = apply(trajectories, 1, quantile, probs = 0.975),
  q10 = apply(trajectories, 1, quantile, probs = 0.10),
  q90 = apply(trajectories, 1, quantile, probs = 0.90)
)

# Ajouter quelques trajectoires individuelles
n_traj_show <- 50
sample_traj <- trajectories[, sample(ncol(trajectories), min(n_traj_show, ncol(trajectories)))]
df_individual <- as.data.frame(sample_traj) %>%
  mutate(year = years) %>%
  pivot_longer(cols = -year, names_to = "trajectory", values_to = "value")

# Graphique avec ggplot2
p1 <- ggplot() +
  # Trajectoires individuelles (transparentes)
  geom_line(data = df_individual,
            aes(x = year, y = value, group = trajectory),
            alpha = 0.1, color = "steelblue") +
  # Intervalle de confiance 95%
  geom_ribbon(data = df_traj,
              aes(x = year, ymin = q025, ymax = q975),
              alpha = 0.3, fill = "blue") +
  # Intervalle de confiance 80%
  geom_ribbon(data = df_traj,
              aes(x = year, ymin = q10, ymax = q90),
              alpha = 0.3, fill = "darkblue") +
  # Médiane
  geom_line(data = df_traj,
            aes(x = year, y = median),
            color = "red", size = 1.2) +
  labs(
    title = "Projections de l'espérance de vie - Cameroun",
    subtitle = "Simulations MCMC avec bayesLife",
    x = "Année",
    y = "Espérance de vie à la naissance (années)",
    caption = "Zone bleue foncée: IC 80% | Zone bleue claire: IC 95% | Ligne rouge: Médiane"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(hjust = 0.5, face = "bold", size = 16),
    plot.subtitle = element_text(hjust = 0.5, size = 12),
    panel.grid.minor = element_blank()
  )

ggsave(
  file.path(output_dir, "viz1_trajectoires_ggplot.png"),
  p1,
  width = 12,
  height = 7,
  dpi = 300
)

cat("Visualisation 1 sauvegardée!\n\n")

# =============================================================================
# VISUALISATION 2: Distribution de l'espérance de vie pour des années clés
# =============================================================================
cat("Création de la visualisation 2: Distributions pour années clés...\n")

# Années d'intérêt
years_of_interest <- c(2025, 2050, 2075, 2100)

# Extraire les distributions pour ces années
df_dist <- data.frame()
for (year in years_of_interest) {
  year_idx <- which(years == year)
  if (length(year_idx) > 0) {
    values <- trajectories[year_idx, ]
    df_temp <- data.frame(
      year = as.factor(year),
      value = values
    )
    df_dist <- rbind(df_dist, df_temp)
  }
}

# Graphique en violon
p2 <- ggplot(df_dist, aes(x = year, y = value, fill = year)) +
  geom_violin(alpha = 0.7, draw_quantiles = c(0.25, 0.5, 0.75)) +
  geom_jitter(alpha = 0.02, size = 0.5) +
  labs(
    title = "Distribution de l'espérance de vie pour différentes années - Cameroun",
    x = "Année",
    y = "Espérance de vie (années)",
    fill = "Année"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(hjust = 0.5, face = "bold", size = 14),
    legend.position = "none"
  ) +
  scale_fill_brewer(palette = "Set3")

ggsave(
  file.path(output_dir, "viz2_distributions_annees.png"),
  p2,
  width = 10,
  height = 6,
  dpi = 300
)

cat("Visualisation 2 sauvegardée!\n\n")

# =============================================================================
# VISUALISATION 3: Évolution de l'incertitude
# =============================================================================
cat("Création de la visualisation 3: Évolution de l'incertitude...\n")

# Calculer l'amplitude des intervalles de confiance
df_traj$ic95_width <- df_traj$q975 - df_traj$q025
df_traj$ic80_width <- df_traj$q90 - df_traj$q10

p3 <- ggplot(df_traj, aes(x = year)) +
  geom_line(aes(y = ic95_width, color = "IC 95%"), size = 1.2) +
  geom_line(aes(y = ic80_width, color = "IC 80%"), size = 1.2) +
  labs(
    title = "Évolution de l'incertitude des projections - Cameroun",
    subtitle = "Largeur des intervalles de confiance au fil du temps",
    x = "Année",
    y = "Largeur de l'intervalle (années)",
    color = "Intervalle"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(hjust = 0.5, face = "bold", size = 14),
    plot.subtitle = element_text(hjust = 0.5, size = 11),
    legend.position = "bottom"
  ) +
  scale_color_manual(values = c("IC 95%" = "blue", "IC 80%" = "darkblue"))

ggsave(
  file.path(output_dir, "viz3_evolution_incertitude.png"),
  p3,
  width = 10,
  height = 6,
  dpi = 300
)

cat("Visualisation 3 sauvegardée!\n\n")

# =============================================================================
# VISUALISATION 4: Comparaison historique vs projections
# =============================================================================
cat("Création de la visualisation 4: Historique vs Projections...\n")

# Obtenir les données historiques
data(e0Fproj)
historical_data <- e0Fproj[e0Fproj$country_code == cameroon_code, ]

# Identifier la première année de projection
first_proj_year <- min(years)

# Créer le graphique
p4 <- ggplot() +
  # Données historiques
  geom_line(data = historical_data,
            aes(x = year, y = value),
            color = "black", size = 1.2, linetype = "solid") +
  geom_point(data = historical_data,
             aes(x = year, y = value),
             color = "black", size = 2) +
  # Projections futures
  geom_ribbon(data = df_traj[df_traj$year >= first_proj_year, ],
              aes(x = year, ymin = q025, ymax = q975),
              alpha = 0.3, fill = "blue") +
  geom_line(data = df_traj[df_traj$year >= first_proj_year, ],
            aes(x = year, y = median),
            color = "red", size = 1.2, linetype = "dashed") +
  geom_vline(xintercept = first_proj_year,
             linetype = "dotted",
             color = "gray50",
             size = 1) +
  annotate("text",
           x = first_proj_year,
           y = max(df_traj$q975) * 0.95,
           label = "Début des projections",
           angle = 90,
           vjust = -0.5,
           color = "gray50") +
  labs(
    title = "Espérance de vie au Cameroun: Historique et Projections",
    subtitle = "Données historiques (noir) et projections MCMC (bleu/rouge)",
    x = "Année",
    y = "Espérance de vie à la naissance (années)",
    caption = "Zone bleue: IC 95% | Ligne rouge: Médiane projetée"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(hjust = 0.5, face = "bold", size = 14),
    plot.subtitle = element_text(hjust = 0.5, size = 11)
  )

ggsave(
  file.path(output_dir, "viz4_historique_vs_projections.png"),
  p4,
  width = 12,
  height = 7,
  dpi = 300
)

cat("Visualisation 4 sauvegardée!\n\n")

# =============================================================================
# VISUALISATION 5: Tableau de synthèse
# =============================================================================
cat("Création du tableau de synthèse...\n")

# Créer un tableau récapitulatif pour les années clés
summary_table <- df_traj %>%
  filter(year %in% years_of_interest) %>%
  select(year, median, q025, q975, ic95_width) %>%
  mutate(
    median = round(median, 2),
    q025 = round(q025, 2),
    q975 = round(q975, 2),
    ic95_width = round(ic95_width, 2)
  )

colnames(summary_table) <- c("Année", "Médiane", "IC 95% Min", "IC 95% Max", "Largeur IC 95%")

write.csv(
  summary_table,
  file.path(output_dir, "tableau_synthese_annees_cles.csv"),
  row.names = FALSE
)

cat("\nTableau de synthèse:\n")
print(summary_table)

cat("\n========================================\n")
cat("VISUALISATIONS TERMINÉES!\n")
cat("========================================\n\n")
cat("Fichiers générés:\n")
cat("1. viz1_trajectoires_ggplot.png - Trajectoires avec IC\n")
cat("2. viz2_distributions_annees.png - Distributions par année\n")
cat("3. viz3_evolution_incertitude.png - Évolution de l'incertitude\n")
cat("4. viz4_historique_vs_projections.png - Comparaison historique\n")
cat("5. tableau_synthese_annees_cles.csv - Tableau récapitulatif\n\n")
