set.seed(123)

simulate_data <- function(n, effect = 0.2, noise_sd = 1) {
  id <- rep(seq_len(n), each = 2)
  time <- rep(c(0, 1), times = n)
  treated <- rbinom(n, 1, 0.5)
  treated_rep <- rep(treated, each = 2)
  subgroup <- sample(c("A", "B"), n, replace = TRUE)
  subgroup_rep <- rep(subgroup, each = 2)
  covariate <- rnorm(n)
  covariate_rep <- rep(covariate, each = 2)
  noise <- rnorm(2 * n, sd = noise_sd)

  y <- 1 + 0.1 * time + 0.2 * treated_rep + effect * treated_rep * time +
    0.4 * covariate_rep + ifelse(subgroup_rep == "B", 0.1, 0) + noise

  y_alt <- y + 0.3 * treated_rep - 0.2 * time + rnorm(2 * n, sd = 1.5)

  data.frame(
    id = id,
    time = time,
    treated = treated_rep,
    subgroup = subgroup_rep,
    covariate = covariate_rep,
    y = y,
    y_alt = y_alt
  )
}

winsorize <- function(x, p = 0.05) {
  bounds <- quantile(x, probs = c(p, 1 - p))
  pmin(pmax(x, bounds[[1]]), bounds[[2]])
}

run_did <- function(df, outcome, include_covariate = TRUE) {
  formula_parts <- c(paste(outcome, "~ treated * time"))
  if (include_covariate) {
    formula_parts <- c(formula_parts, "+ covariate")
  }
  model <- lm(as.formula(paste(formula_parts, collapse = " ")), data = df)
  summary(model)$coefficients["treated:time", "Pr(>|t|)"]
}

run_scenario <- function(label, df, outcome, include_covariate = TRUE, winsor_p = NA) {
  df_work <- df
  if (!is.na(winsor_p)) {
    df_work[[outcome]] <- winsorize(df_work[[outcome]], winsor_p)
  }

  p_value <- run_did(df_work, outcome, include_covariate)
  data.frame(
    scenario = label,
    n = nrow(df_work),
    outcome = outcome,
    covariate = include_covariate,
    winsor_p = ifelse(is.na(winsor_p), "none", winsor_p),
    p_value = round(p_value, 4),
    stringsAsFactors = FALSE
  )
}

base_data <- simulate_data(800)
small_data <- simulate_data(200)
large_data <- simulate_data(2000)

results <- rbind(
  run_scenario("Baseline", base_data, "y", include_covariate = TRUE),
  run_scenario("Outcome change", base_data, "y_alt", include_covariate = TRUE),
  run_scenario("No covariate", base_data, "y", include_covariate = FALSE),
  run_scenario("Winsor 5%", base_data, "y", include_covariate = TRUE, winsor_p = 0.05),
  run_scenario("Winsor 1%", base_data, "y", include_covariate = TRUE, winsor_p = 0.01),
  run_scenario("Small sample", small_data, "y", include_covariate = TRUE),
  run_scenario("Large sample", large_data, "y", include_covariate = TRUE),
  run_scenario("Subgroup A", subset(base_data, subgroup == "A"), "y", include_covariate = TRUE),
  run_scenario("Subgroup B", subset(base_data, subgroup == "B"), "y", include_covariate = TRUE)
)

print(results)

cat(
  "\nInterpreting these variations:\n",
  "- Changing the outcome, sample size, subgroup, or modeling choices can move the p-value.\n",
  "- This illustrates how p-hacking, HARKing, or cherry-picking can produce different narratives.\n"
)
