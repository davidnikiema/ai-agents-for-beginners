# Économétrie des Séries Temporelles - Guide Complet

## Table des Matières

1. [Introduction aux Séries Temporelles](#introduction)
2. [Concepts Fondamentaux](#concepts-fondamentaux)
3. [Propriétés Statistiques des Séries Temporelles](#proprietes-statistiques)
4. [Stationnarité et Racines Unitaires](#stationnarite)
5. [Modèles Autorégressifs (AR)](#modeles-ar)
6. [Modèles de Moyennes Mobiles (MA)](#modeles-ma)
7. [Modèles ARMA](#modeles-arma)
8. [Processus Intégrés et ARIMA](#modeles-arima)
9. [Tests de Racine Unitaire](#tests-racine-unitaire)
10. [Cointégration](#cointegration)
11. [Modèles VAR - Vecteur Autorégressif](#modeles-var)
12. [Modèles GARCH](#modeles-garch)
13. [Tests de Diagnostic](#tests-diagnostic)
14. [Applications et Exemples](#applications)

---

## 1. Introduction aux Séries Temporelles {#introduction}

### 1.1 Définition

Une **série temporelle** est une suite d'observations d'une variable économique enregistrées à des instants successifs (régulièrement espacés ou non). C'est une réalisation d'un processus stochastique dans le temps.

Formellement, une série temporelle est noée $\{y_t\}_{t=1}^T$ où:
- $t$ représente le temps (jours, mois, trimestres, années)
- $T$ est le nombre total d'observations
- $y_t$ est la valeur de la variable au temps $t$

### 1.2 Caractéristiques des Séries Temporelles

Les séries temporelles possèdent plusieurs caractéristiques distinctes:

**1.2.1 Dépendance temporelle**
Contrairement aux données de coupe transversale, les observations successives ne sont généralement pas indépendantes. La valeur à la date $t$ dépend souvent de ses valeurs passées.

**1.2.2 Tendance (Trend)**
Mouvement long terme de la variable. Peut être:
- Déterministe: $T_t = \alpha + \beta t$
- Stochastique: marche aléatoire

**1.2.3 Saisonnalité (Seasonality)**
Fluctuations régulières qui se répètent à des intervalles réguliers. Exemple: ventes plus élevées pendant les vacances.

**1.2.4 Composante cyclique**
Oscillations de moyenne à long terme, sans périodicité fixe.

**1.2.5 Bruit blanc (White Noise)**
Composante aléatoire non corrélée dans le temps.

### 1.3 Décomposition d'une Série Temporelle

Une série temporelle peut être décomposée comme suit:

$$y_t = T_t + C_t + S_t + \varepsilon_t$$

Où:
- $T_t$ = Composante tendancielle
- $C_t$ = Composante cyclique
- $S_t$ = Composante saisonnière
- $\varepsilon_t$ = Composante résiduelle (bruit blanc)

Cette décomposition peut être **additive** ou **multiplicative**:
$$y_t = T_t \times C_t \times S_t \times \varepsilon_t \text{ (multiplicative)}$$

### 1.4 Objectifs de l'Analyse des Séries Temporelles

- **Description**: Identifier les caractéristiques de la série
- **Explication**: Comprendre les facteurs qui influencent la variable
- **Prévision**: Anticiper les valeurs futures
- **Contrôle**: Analyser l'effet de politiques ou d'interventions

---

## 2. Concepts Fondamentaux {#concepts-fondamentaux}

### 2.1 Processus Stochastiques

Un **processus stochastique** est une collection de variables aléatoires $\{Y_t\}$ indexées par le temps $t$.

#### 2.1.1 Exemples de Processus

**Processus Déterministe:**
$$y_t = \alpha + \beta t + \varepsilon_t$$

où $\varepsilon_t \sim N(0, \sigma^2)$ est indépendant du temps.

**Processus Stochastique Pur:**
$$y_t = y_{t-1} + \varepsilon_t$$

où $\varepsilon_t$ est un bruit blanc.

### 2.2 Réalisation et Population

- **Population**: L'ensemble complet de tous les chemins possibles du processus stochastique
- **Réalisation (Sample)**: Une seule trajectoire observée du processus

Ce qui crée un problème fondamental: nous n'avons qu'une seule réalisation (une seule série temporelle observée), pas plusieurs réalisations indépendantes comme en coupe transversale.

### 2.3 Opérateurs Temporels

#### 2.3.1 Opérateur de Décalage (Lag Operator)

Noté $L$ ou $B$:
$$L y_t = y_{t-1}$$
$$L^k y_t = y_{t-k}$$

#### 2.3.2 Opérateur Différence

Noté $\Delta$ ou $(1-L)$:
$$\Delta y_t = y_t - y_{t-1} = (1-L)y_t$$
$$\Delta^d y_t = (1-L)^d y_t$$

#### 2.3.3 Opérateur Différence Saisonnière

$$\Delta_s y_t = y_t - y_{t-s} = (1-L^s)y_t$$

### 2.4 Polynômes de Décalage

Les processus sont souvent exprimés avec des polynômes en $L$:

$$\Phi(L) = 1 - \phi_1 L - \phi_2 L^2 - \cdots - \phi_p L^p$$
$$\Theta(L) = 1 - \theta_1 L - \theta_2 L^2 - \cdots - \theta_q L^q$$

---

## 3. Propriétés Statistiques des Séries Temporelles {#proprietes-statistiques}

### 3.1 Moyenne et Variance

Pour une série temporelle, on définit:

**Moyenne:**
$$\mu_t = E[y_t]$$

**Variance:**
$$\sigma_t^2 = \text{Var}(y_t) = E[(y_t - \mu_t)^2]$$

### 3.2 Autocovariance et Autocorrélation

L'**autocovariance** à lag $k$ est:
$$\gamma_k = \text{Cov}(y_t, y_{t-k}) = E[(y_t - \mu)(y_{t-k} - \mu)]$$

L'**autocorrélation** à lag $k$ est:
$$\rho_k = \frac{\gamma_k}{\gamma_0} = \frac{\text{Cov}(y_t, y_{t-k})}{\text{Var}(y_t)}$$

où $\rho_0 = 1$ et $-1 \leq \rho_k \leq 1$.

### 3.3 Fonction d'Autocovariance et Autocorrélation

La fonction d'autocovariance (ACF) et autocorrélation partielle (PACF) sont centrales pour:
- Identifier le type de processus
- Déterminer l'ordre du modèle ARMA
- Détecter la non-stationnarité

**Propriétés de l'ACF:**
- $\rho_k = \rho_{-k}$ (symétrie)
- $|\rho_k| \leq \rho_0 = 1$
- Pour un processus stationnaire, $\rho_k \rightarrow 0$ quand $k \rightarrow \infty$

### 3.4 Bruit Blanc (White Noise)

Un processus $\varepsilon_t$ est un **bruit blanc** (ou bruit blanc faible) si:

1. $E[\varepsilon_t] = 0$
2. $\text{Var}(\varepsilon_t) = \sigma^2$ (constante)
3. $\text{Cov}(\varepsilon_t, \varepsilon_{t-k}) = 0$ pour $k \neq 0$

Notation: $\varepsilon_t \sim BB(0, \sigma^2)$ ou $\varepsilon_t \sim WN(0, \sigma^2)$

**Bruit blanc fort (iid):** En plus des conditions précédentes:
4. $\varepsilon_t$ sont indépendamment et identiquement distribués

### 3.5 Autocorrélation Partielle (PACF)

La **corrélation partielle** $\phi_{kk}$ mesure la corrélation entre $y_t$ et $y_{t-k}$ après avoir éliminé les effets des variables intermédiaires $y_{t-1}, y_{t-2}, \ldots, y_{t-k+1}$.

Elle est calculée via les équations de Yule-Walker:

$$\rho_j = \sum_{i=1}^k \phi_{ki} \rho_{j-i} \quad \text{pour } j = 1, \ldots, k$$

### 3.6 Densité Spectrale

La **fonction de densité spectrale** est la transformée de Fourier de l'autocovariance:

$$f(\omega) = \frac{1}{2\pi} \sum_{k=-\infty}^{\infty} \gamma_k e^{-i\omega k}$$

où $\omega \in [-\pi, \pi]$ est la fréquence.

---

## 4. Stationnarité et Racines Unitaires {#stationnarite}

### 4.1 Stationnarité Définition

Un processus $\{y_t\}$ est **faiblement stationnaire** (ou stationnaire au second ordre) si:

1. $E[y_t] = \mu$ (moyenne constante)
2. $\text{Var}(y_t) = \sigma^2$ (variance constante)
3. $\text{Cov}(y_t, y_{t-k}) = \gamma_k$ dépend seulement de $k$ (autocovariance invariante dans le temps)

Un processus est **fortement stationnaire** (ou strictement stationnaire) si sa distribution jointe ne change pas avec le temps:

$$F(y_t, y_{t+1}, \ldots, y_{t+n}) = F(y_{t+m}, y_{t+m+1}, \ldots, y_{t+m+n})$$

pour tous $m, n$.

### 4.2 Importance de la Stationnarité

La stationnarité est cruciale car:

1. **Propriétés des estimateurs**: Les estimateurs ML et OLS ont les mêmes propriétés asymptotiques que pour les données indépendantes
2. **Lois limites**: Les théorèmes limites (TLC, LGN) s'appliquent
3. **Prévisions**: Les prévisions convergent vers la moyenne du processus
4. **Interprétation**: Les paramètres ont une interprétation économique stable

### 4.3 Non-Stationnarité

Un processus **non-stationnaire** viole au moins une des conditions de stationnarité.

**Types courants:**

**4.3.1 Tendance Déterministe (DS - Deterministic Stationary)**

$$y_t = \alpha + \beta t + \varepsilon_t$$

- Peut être rendu stationnaire en soustrayant la tendance
- Appelé $I(0)$ après détrending

**4.3.2 Racine Unitaire (Stochastic Non-Stationarity)**

$$y_t = y_{t-1} + \varepsilon_t$$

- La variance croît avec le temps
- Appelé $I(1)$ - Intégré d'ordre 1
- Peut être rendu stationnaire par différenciation

**4.3.3 Tendance Stochastique avec Drift**

$$y_t = \mu + y_{t-1} + \varepsilon_t$$

- Combine une tendance stochastique avec une dérive
- Peut être rendu stationnaire par différenciation

### 4.4 Intégration et Différenciation

Un processus est **$I(d)$ - intégré d'ordre d** si:
- $y_t$ n'est pas stationnaire
- $\Delta^d y_t$ est stationnaire
- $\Delta^{d-1} y_t$ n'est pas stationnaire

**Exemples:**
- Marche aléatoire: $y_t = y_{t-1} + \varepsilon_t$ est $I(1)$
- Marche aléatoire double: $y_t = y_{t-1} + u_t$ où $u_t = u_{t-1} + \varepsilon_t$ est $I(2)$

### 4.5 Racines du Polynôme Caractéristique

Pour le processus autorégressif:
$$y_t = \phi_1 y_{t-1} + \phi_2 y_{t-2} + \cdots + \phi_p y_{t-p} + \varepsilon_t$$

Ou:
$$\Phi(L) y_t = \varepsilon_t$$

où $\Phi(L) = 1 - \phi_1 L - \phi_2 L^2 - \cdots - \phi_p L^p$

Le processus est **stationnaire** si et seulement si **toutes les racines** de:
$$\Phi(z) = 1 - \phi_1 z - \phi_2 z^2 - \cdots - \phi_p z^p = 0$$

sont **en dehors du cercle unité**, c'est-à-dire $|z_i| > 1$ pour toutes les racines $z_i$.

**Racine Unitaire:** Si une racine égale exactement 1, on a une racine unitaire: $\Phi(1) = 0$.

---

## 5. Modèles Autorégressifs (AR) {#modeles-ar}

### 5.1 Processus AR(p)

Un processus **autorégressif d'ordre p**, noté AR(p), est défini comme:

$$y_t = \phi_0 + \phi_1 y_{t-1} + \phi_2 y_{t-2} + \cdots + \phi_p y_{t-p} + \varepsilon_t$$

ou sous forme d'opérateur:
$$\Phi(L)(y_t - \mu) = \varepsilon_t$$

où:
- $\phi_0 = \mu(1 - \sum_{i=1}^p \phi_i)$ (constante)
- $\mu$ est la moyenne inconditionnelle
- $\varepsilon_t \sim WN(0, \sigma^2)$

### 5.2 Conditions de Stationnarité pour AR(p)

Le processus AR(p) est **stationnaire** si toutes les racines du polynôme:
$$\Phi(z) = 1 - \phi_1 z - \phi_2 z^2 - \cdots - \phi_p z^p = 0$$

sont **en dehors du cercle unité**: $|z_i| > 1$.

#### 5.2.1 Cas AR(1): $y_t = \phi_0 + \phi_1 y_{t-1} + \varepsilon_t$

**Condition de stationnarité:** $|\phi_1| < 1$

**Moyenne inconditionnelle:**
$$E[y_t] = \frac{\phi_0}{1 - \phi_1}$$

**Variance inconditionnelle:**
$$\text{Var}(y_t) = \frac{\sigma^2}{1 - \phi_1^2}$$

**Autocovariance:**
$$\gamma_k = \phi_1^k \gamma_0 = \phi_1^k \frac{\sigma^2}{1 - \phi_1^2}$$

**Autocorrélation:**
$$\rho_k = \phi_1^k$$

**Autocorrélation partielle:**
$$\phi_{11} = \phi_1; \quad \phi_{kk} = 0 \text{ pour } k > 1$$

#### 5.2.2 Cas AR(2): $y_t = \phi_0 + \phi_1 y_{t-1} + \phi_2 y_{t-2} + \varepsilon_t$

**Conditions de stationnarité:**
1. $\phi_1 + \phi_2 < 1$
2. $\phi_2 - \phi_1 < 1$
3. $|\phi_2| < 1$

**Équations de Yule-Walker:**
$$\rho_1 = \frac{\phi_1}{1 - \phi_2}$$
$$\rho_k = \phi_1 \rho_{k-1} + \phi_2 \rho_{k-2} \quad \text{pour } k \geq 2$$

### 5.3 Représentation MA de AR(p)

Un processus AR(p) stationnaire peut être écrit comme une MA d'ordre infini:

$$y_t = \mu + \sum_{j=0}^{\infty} \psi_j \varepsilon_{t-j}$$

où:
$$\psi_0 = 1, \quad \psi_j = \phi_1 \psi_{j-1} + \phi_2 \psi_{j-2} + \cdots + \phi_p \psi_{j-p}$$

### 5.4 Estimation des Modèles AR(p)

#### 5.4.1 Méthode OLS

Pour le modèle:
$$y_t = \phi_0 + \phi_1 y_{t-1} + \cdots + \phi_p y_{t-p} + \varepsilon_t$$

L'estimateur OLS est:
$$\hat{\phi} = (X'X)^{-1} X'Y$$

où $X = [1, y_{t-1}, \ldots, y_{t-p}]$ et $Y = [y_t]$.

**Propriétés:**
- **Convergence:** $\hat{\phi} \xrightarrow{p} \phi$ (convergence en probabilité)
- **Normalité asymptotique:** $\sqrt{T}(\hat{\phi} - \phi) \xrightarrow{d} N(0, \Sigma)$

#### 5.4.2 Équations de Yule-Walker

Les estimateurs par Yule-Walker résolvent:
$$\hat{\gamma}_k = \sum_{i=1}^p \hat{\phi}_i \hat{\gamma}_{k-i} \quad \text{pour } k = 1, \ldots, p$$

sous forme matricielle:
$$\hat{\rho} = P \hat{\phi}$$

où $\hat{\rho}$ est le vecteur des autocorrélations empiriques.

#### 5.4.3 Estimation du Maximum de Vraisemblance

Sous l'hypothèse $\varepsilon_t \sim N(0, \sigma^2)$, la fonction de log-vraisemblance est:

$$\ell(\phi, \sigma^2) = -\frac{T}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{t=1}^T \varepsilon_t^2$$

où $\varepsilon_t = y_t - \phi_0 - \sum_{i=1}^p \phi_i y_{t-i}$.

L'estimateur ML est:
$$\hat{\sigma}^2 = \frac{1}{T}\sum_{t=1}^T \hat{\varepsilon}_t^2$$

---

## 6. Modèles de Moyennes Mobiles (MA) {#modeles-ma}

### 6.1 Processus MA(q)

Un processus **de moyennes mobiles d'ordre q**, noté MA(q), est:

$$y_t = \mu + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \theta_2 \varepsilon_{t-2} + \cdots + \theta_q \varepsilon_{t-q}$$

ou sous forme d'opérateur:
$$y_t = \mu + \Theta(L) \varepsilon_t$$

où:
$$\Theta(L) = 1 + \theta_1 L + \theta_2 L^2 + \cdots + \theta_q L^q$$

### 6.2 Propriétés du Processus MA(q)

**Moyenne:**
$$E[y_t] = \mu$$

**Variance:**
$$\text{Var}(y_t) = \sigma^2(1 + \theta_1^2 + \theta_2^2 + \cdots + \theta_q^2)$$

**Autocovariance à lag k:**
$$\gamma_k = \begin{cases}
\sigma^2(1 + \sum_{i=1}^q \theta_i^2) & \text{si } k = 0 \\
\sigma^2(\theta_k + \sum_{i=1}^{q-k} \theta_i \theta_{i+k}) & \text{si } 0 < k \leq q \\
0 & \text{si } k > q
\end{cases}$$

**Autocorrélation:**
$$\rho_k = \begin{cases}
1 & \text{si } k = 0 \\
\frac{\theta_k + \sum_{i=1}^{q-k} \theta_i \theta_{i+k}}{1 + \sum_{i=1}^q \theta_i^2} & \text{si } 0 < k \leq q \\
0 & \text{si } k > q
\end{cases}$$

**Propriété caractéristique:** La fonction d'autocorrélation s'annule pour les lags supérieurs à $q$ (elle a support limité).

### 6.3 Invertibilité

Un processus MA(q) est **inversible** si toutes les racines du polynôme:
$$\Theta(z) = 1 + \theta_1 z + \theta_2 z^2 + \cdots + \theta_q z^q = 0$$

sont **en dehors du cercle unité**: $|z_i| > 1$.

L'invertibilité garantit que:
1. Le processus admet une représentation AR infinie (convergente)
2. Les chocs passés ont un effet décroissant sur $y_t$
3. Les paramètres sont identifiés de manière unique

### 6.4 Représentation AR de MA(q)

Un processus MA(q) inversible peut s'écrire:

$$y_t = \mu + \sum_{j=1}^{\infty} \pi_j (y_{t-j} - \mu) + \varepsilon_t$$

où:
$$\pi(L) = \frac{\Theta(L)^{-1} - 1}{1}$$

### 6.5 Cas Particulier: MA(1)

$$y_t = \mu + \varepsilon_t + \theta_1 \varepsilon_{t-1}$$

**Variance:**
$$\text{Var}(y_t) = \sigma^2(1 + \theta_1^2)$$

**Autocovariance:**
$$\gamma_0 = \sigma^2(1 + \theta_1^2); \quad \gamma_1 = \sigma^2 \theta_1; \quad \gamma_k = 0 \text{ pour } k > 1$$

**Autocorrélation:**
$$\rho_1 = \frac{\theta_1}{1 + \theta_1^2}; \quad \rho_k = 0 \text{ pour } k > 1$$

**Condition d'invertibilité:** $|\theta_1| < 1$

**Problème d'identification:** Les paramètres $\theta_1$ et $\theta_1^{-1}$ génèrent la même autocorrélation.

### 6.6 Estimation des Modèles MA(q)

#### 6.6.1 Maximum de Vraisemblance

Sous $\varepsilon_t \sim N(0, \sigma^2)$:

$$\ell(\theta, \sigma^2) = -\frac{T}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{t=1}^T \varepsilon_t^2(\theta)$$

où $\varepsilon_t(\theta) = y_t - \mu - \sum_{j=1}^q \theta_j \varepsilon_{t-j}(\theta)$.

Cela requiert une procédure itérative (pas de solution analytique).

#### 6.6.2 Équations de Yule-Walker

Pour MA(1):
$$\hat{\rho}_1 = \frac{\hat{\theta}_1}{1 + \hat{\theta}_1^2}$$

Cette équation quadratique en $\hat{\theta}_1$ a généralement deux solutions; on choisit celle qui satisfait l'invertibilité.

---

## 7. Modèles ARMA {#modeles-arma}

### 7.1 Processus ARMA(p,q)

Un processus **ARMA(p,q)** combine les éléments AR et MA:

$$y_t = \phi_0 + \phi_1 y_{t-1} + \cdots + \phi_p y_{t-p} + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \cdots + \theta_q \varepsilon_{t-q}$$

ou sous forme d'opérateur:
$$\Phi(L)(y_t - \mu) = \Theta(L) \varepsilon_t$$

### 7.2 Conditions de Stationnarité et Invertibilité

**Stationnarité:** Toutes les racines de $\Phi(z) = 0$ doivent être hors du cercle unité.

**Invertibilité:** Toutes les racines de $\Theta(z) = 0$ doivent être hors du cercle unité.

### 7.3 Fonction d'Autocorrélation Partielle

Pour ARMA(p,q):
- L'ACF décroît au-delà du lag $q$ (pas de coupure nette)
- La PACF décroît au-delà du lag $p$ (pas de coupure nette)

Cette information est utile pour identifier $p$ et $q$.

### 7.4 Représentation AR(∞) et MA(∞)

ARMA(p,q) inversible peut s'écrire:
$$y_t = \mu + \sum_{j=1}^{\infty} \pi_j (y_{t-j} - \mu) + \varepsilon_t \quad \text{(AR($\infty$))}$$

ARMA(p,q) stationnaire peut s'écrire:
$$y_t = \mu + \sum_{j=0}^{\infty} \psi_j \varepsilon_{t-j} \quad \text{(MA($\infty$))}$$

où:
$$\psi(L) = \frac{\Theta(L)}{\Phi(L)}$$

### 7.5 Estimation ARMA

#### 7.5.1 Vraisemblance Conditionnelle

La log-vraisemblance conditionnelle est:
$$\ell_c(\phi, \theta, \sigma^2) = -\frac{T-p}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{t=p+1}^T \varepsilon_t^2(\phi, \theta)$$

où:
$$\varepsilon_t(\phi, \theta) = y_t - \phi_0 - \sum_{i=1}^p \phi_i y_{t-i} - \sum_{j=1}^q \theta_j \varepsilon_{t-j}(\phi, \theta)$$

#### 7.5.2 Vraisemblance Exacte

La vraisemblance exacte considère la distribution de $(y_1, \ldots, y_p)$ et nécessite des filtres de Kalman pour les calculs.

### 7.6 Sélection du Modèle

#### 7.6.1 Critères d'Information

**Akaike Information Criterion (AIC):**
$$AIC = 2(p+q) - 2\ln(\hat{L})$$

où $\hat{L}$ est la vraisemblance maximale.

**Bayesian Information Criterion (BIC):**
$$BIC = (p+q)\ln(T) - 2\ln(\hat{L})$$

On choisit le modèle qui minimise ces critères.

**Avantages du BIC:** Impose une pénalité plus forte pour la complexité.

#### 7.6.2 Analyse Graphique ACF/PACF

| Processus | ACF | PACF |
|-----------|-----|------|
| AR(p) | Décroissance infinie | Coupure nette après lag $p$ |
| MA(q) | Coupure nette après lag $q$ | Décroissance infinie |
| ARMA(p,q) | Décroissance infinie | Décroissance infinie |

---

## 8. Processus Intégrés et ARIMA {#modeles-arima}

### 8.1 ARIMA(p,d,q)

Un processus **ARIMA(p,d,q)** (AutoRegressive Integrated Moving Average) est défini comme:

$$\Phi(L) \Delta^d y_t = \Theta(L) \varepsilon_t$$

où:
- $p$ = ordre autorégressif
- $d$ = ordre d'intégration
- $q$ = ordre de moyennes mobiles

Ou de manière équivalente:
$$\Delta^d y_t = \text{ARMA(p,q)}$$

### 8.2 Ordre d'Intégration

L'ordre d'intégration $d$ est le nombre de fois qu'il faut différencier pour obtenir un processus stationnaire.

**Cas courants:**
- $d = 0$: Processus stationnaire (pas de différenciation)
- $d = 1$: Intégré d'ordre 1, I(1) (différenciation une fois)
- $d = 2$: Intégré d'ordre 2, I(2) (différenciation deux fois)

### 8.3 Marche Aléatoire avec Drift

$$y_t = \mu + y_{t-1} + \varepsilon_t$$

ou:
$$\Delta y_t = \mu + \varepsilon_t$$

Ceci est un ARIMA(0,1,0) avec constante (ou ARIMA(0,1,0)). Il s'agit d'une marche aléatoire avec drift $\mu$.

**Propriétés:**
- Non-stationnaire
- $E[\Delta y_t] = \mu$ (différence constante en moyenne)
- $\text{Var}(y_t) = t \sigma^2$ (variance croît avec le temps)

### 8.4 Processus ARIMA Saisonnier: SARIMA

Le processus **SARIMA(p,d,q)(P,D,Q)_s** inclut les termes saisonniers:

$$\Phi(L) \Phi_s(L^s) \Delta^d \Delta_s^D y_t = \Theta(L) \Theta_s(L^s) \varepsilon_t$$

où:
- $(p,d,q)$ = ordres non-saisonniers
- $(P,D,Q)_s$ = ordres saisonniers
- $s$ = période saisonnière (par ex., 4 pour données trimestrielles, 12 pour mensuelles)

### 8.5 Différenciation Saisonnière

Pour une série avec saisonnalité, on utilise:
$$\Delta_s y_t = y_t - y_{t-s} = (1-L^s)y_t$$

Exemple avec $s=4$ (données trimestrielles):
$$\Delta_4 y_t = y_t - y_{t-4}$$

### 8.6 Exemple: ARIMA(1,1,1)

$$\Delta y_t = \phi_1 \Delta y_{t-1} + \varepsilon_t + \theta_1 \varepsilon_{t-1}$$

Ou:
$$y_t - y_{t-1} = \phi_1(y_{t-1} - y_{t-2}) + \varepsilon_t + \theta_1 \varepsilon_{t-1}$$

### 8.7 Prévisions ARIMA

Pour un modèle ARIMA(p,d,q), la prévision à horizon $h$ est:

$$\hat{y}_{T+h|T} = E[y_{T+h}|\Omega_T]$$

où $\Omega_T$ est l'ensemble d'information à la date $T$.

**Propriété des prévisions ARIMA:**
- Pour $d \geq 1$, les prévisions convergent vers une tendance linéaire
- L'intervalle de confiance s'élargit avec l'horizon
- Les prévisions deviennent linéairement croissantes (ou décroissantes) si $d=1$

---

## 9. Tests de Racine Unitaire {#tests-racine-unitaire}

### 9.1 Importance des Tests de Racine Unitaire

La présence d'une racine unitaire a des conséquences majeures:
1. Les propriétés asymptotiques des estimateurs changent
2. Les inférences statistiques sont invalides si ignorées
3. Les régressions avec variables I(1) peuvent être spurieuses
4. La cointégration devient possible

### 9.2 Test ADF (Augmented Dickey-Fuller)

#### 9.2.1 Formulation de Base

Le test ADF évalue les hypothèses:
- $H_0: y_t$ admet une racine unitaire (non-stationnaire)
- $H_1: y_t$ est stationnaire

L'équation de test est:
$$\Delta y_t = \alpha + \beta t + \gamma y_{t-1} + \sum_{i=1}^p \delta_i \Delta y_{t-i} + \varepsilon_t$$

Les trois versions courantes:

**Version 1 (pas de constante ni trend):**
$$\Delta y_t = \gamma y_{t-1} + \sum_{i=1}^p \delta_i \Delta y_{t-i} + \varepsilon_t$$

**Version 2 (avec constante):**
$$\Delta y_t = \alpha + \gamma y_{t-1} + \sum_{i=1}^p \delta_i \Delta y_{t-i} + \varepsilon_t$$

**Version 3 (avec constante et trend):**
$$\Delta y_t = \alpha + \beta t + \gamma y_{t-1} + \sum_{i=1}^p \delta_i \Delta y_{t-i} + \varepsilon_t$$

#### 9.2.2 Statistique de Test

La statistique de test est:
$$ADF = \frac{\hat{\gamma}}{SE(\hat{\gamma})}$$

où $\hat{\gamma}$ est l'estimateur OLS de $\gamma$ et $SE(\hat{\gamma})$ est son écart-type.

**Distribution asymptotique:** Sous $H_0$, la statistique ADF suit la **distribution de Dickey-Fuller**, qui est **non-standard** et tabulée.

#### 9.2.3 Sélection du Nombre de Lags

Le nombre de lags $p$ dans $\sum_{i=1}^p \delta_i \Delta y_{t-i}$ doit être choisi pour:
1. Éliminer l'autocorrélation des résidus
2. Ne pas sur-spécifier (ajouter de la variance aux estimateurs)

**Critères courants:**

**Rule of Thumb:**
$$p = \left\lfloor 12 \left(\frac{T}{100}\right)^{1/4} \right\rfloor$$

**Critères d'information:**
- AIC: $AIC = 2p - 2\ln(\hat{L})$
- BIC: $BIC = p\ln(T) - 2\ln(\hat{L})$

**Test séquentiel:** Commencer avec un grand $p$ et réduire si le dernier lag n'est pas significatif.

#### 9.2.4 Valeurs Critiques du Test ADF

Les valeurs critiques dépendent de la spécification du test:

| Spécification | 1% | 5% | 10% |
|---------------|----|----|-----|
| Sans constante ni trend | -2.58 | -1.95 | -1.62 |
| Avec constante | -3.43 | -2.86 | -2.57 |
| Avec constante et trend | -3.96 | -3.41 | -3.13 |

**Interprétation:**
- Si $ADF < \text{valeur critique}$: Rejeter $H_0$ → Processus stationnaire
- Si $ADF > \text{valeur critique}$: Ne pas rejeter $H_0$ → Processus non-stationnaire

### 9.3 Test KPSS (Kwiatkowski-Phillips-Schmidt-Shin)

Le test KPSS inverse les hypothèses de base:
- $H_0: y_t$ est stationnaire
- $H_1: y_t$ admet une racine unitaire

#### 9.3.1 Formulation

La série est décomposée comme:
$$y_t = \alpha + \beta t + u_t + \varepsilon_t$$

où:
- $u_t$ est un marche aléatoire: $u_t = u_{t-1} + \xi_t$
- $\varepsilon_t$ est un bruit blanc

La statistique KPSS est:
$$KPSS = \frac{1}{T^2} \sum_{t=1}^T S_t^2 / \hat{\sigma}^2$$

où $S_t = \sum_{j=1}^t \hat{\varepsilon}_j$ sont les résidus cumulés.

#### 9.3.2 Avantages et Inconvénients

**Avantages du KPSS:**
- Hypothèse nulle de stationnarité (inverse du ADF)
- Complément au test ADF

**Inconvénients:**
- Moins puissant que ADF dans certains cas
- Sensible à la position de rupture structurelle

### 9.4 Résistance aux Ruptures Structurelles

Les tests ADF et KPSS classiques peuvent être biaisés s'il y a une rupture structurelle.

#### 9.4.1 Test ADF avec Rupture

Si on suppose une rupture à la date $T_b$:

$$\Delta y_t = \alpha_1 + \beta_1 t + \gamma y_{t-1} + \sum_{i=1}^p \delta_i \Delta y_{t-i} + \alpha_2 D_t + \beta_2 D_t \cdot (t - T_b) + \varepsilon_t$$

où $D_t = 1$ si $t > T_b$, 0 sinon.

#### 9.4.2 Test de Perron

Le **test de Perron** (1989) permet une rupture sous $H_0$:

$$\Delta y_t = \alpha + \gamma y_{t-1} + \text{variables de rupture} + \text{lags} + \varepsilon_t$$

### 9.5 Tableau Récapitulatif des Tests ADF vs KPSS

| Aspect | ADF | KPSS |
|--------|-----|------|
| $H_0$ | Racine unitaire | Stationnarité |
| $H_1$ | Stationnarité | Racine unitaire |
| Distribution | Dickey-Fuller | Non-standard |
| Puissance | Bonne pour I(1) | Bonne pour I(0) |
| Résultats concordants | Rejette $H_0$ | Rejette $H_1$ |

### 9.6 Pratique Recommandée

1. Appliquer le **test ADF**
2. Appliquer le **test KPSS**
3. Analyser les ACF/PACF graphiquement
4. Si les résultats divergent, investiguer les ruptures structurelles

---

## 10. Cointégration {#cointegration}

### 10.1 Définition et Concept

Deux ou plusieurs séries $y_t, x_t$ qui sont individuellement I(1) sont **cointégrées** s'il existe une combinaison linéaire stationnaire:

$$z_t = y_t - \beta x_t \sim I(0)$$

Le vecteur $[1, -\beta]$ est appelé **vecteur de cointégration**.

#### 10.1.1 Interprétation Économique

- Deux variables I(1) qui dérivent indépendamment auraient une combinaison linéaire aussi I(1)
- Si la combinaison est I(0), cela suggère une **relation d'équilibre à long terme**
- Les variables "se déplacent ensemble" malgré leur non-stationnarité individuelle

**Exemple:** Prix spot et prix futures d'une commodity - tous deux I(1), mais leur différence (base) est généralement stationnaire.

### 10.2 Condition de Cointégration

Deux séries $y_t \sim I(1)$ et $x_t \sim I(1)$ sont cointégrées si:
1. Les deux sont I(1)
2. Il existe $\beta$ tel que $y_t - \beta x_t \sim I(0)$

Plus généralement, le vecteur $[y_t, x_t]$ est cointégré d'ordre $(1,1)$, noté CI(1,1).

### 10.3 Test de Cointégration: Test d'Engle-Granger

#### 10.3.1 Procédure en Deux Étapes

**Étape 1:** Estimer la relation de long terme par OLS:
$$y_t = \alpha + \beta x_t + e_t$$

**Étape 2:** Tester si les résidus sont stationnaires:
$$ADF(\hat{e}_t) = \text{?}$$

Si on rejette la présence d'une racine unitaire dans $\hat{e}_t$, alors $y_t$ et $x_t$ sont cointégrés.

#### 10.3.2 Valeurs Critiques du Test EG

Les valeurs critiques **diffèrent** du test ADF standard (car nous testons une relation estimée):

| Niveau de signification | Valeur critique |
|-------------------------|-----------------|
| 1% | -3.37 |
| 5% | -2.91 |
| 10% | -2.62 |

**Important:** Utiliser les valeurs critiques tabulées spécifiques à Engle-Granger, pas celles du ADF standard.

#### 10.3.3 Limitations du Test EG

1. **Endogénéité:** Si $x_t$ est endogène, les estimateurs OLS sont biaisés
2. **Unique relation:** Suppose qu'il y a qu'une seule relation de cointégration
3. **Sensibilité à l'ordre:** L'ordre des variables peut affecter les résultats

### 10.4 Test de Cointégration: Approche Johansen

#### 10.4.1 Modèle VAR et Cointégration

Pour un système VAR(p):
$$Y_t = A_1 Y_{t-1} + \cdots + A_p Y_{t-p} + \varepsilon_t$$

On peut écrire:
$$\Delta Y_t = \Pi Y_{t-1} + \sum_{i=1}^{p-1} \Gamma_i \Delta Y_{t-i} + \varepsilon_t$$

où $\Pi = A_1 + \cdots + A_p - I$.

#### 10.4.2 Décomposition de la Matrice $\Pi$

Si le rang de $\Pi$ est $r < n$, on peut écrire:
$$\Pi = \alpha \beta'$$

où:
- $\alpha$ est la matrice $(n \times r)$ d'ajustement
- $\beta$ est la matrice $(n \times r)$ contenant les vecteurs de cointégration
- $r$ est le nombre de relations de cointégration

#### 10.4.3 Statistiques de Test

**Test de la Trace:**
$$\lambda_{\text{trace}}(r) = -T \sum_{i=r+1}^n \ln(1-\hat{\lambda}_i)$$

où $\hat{\lambda}_i$ sont les valeurs propres estimées.

$H_0$: Il y a au maximum $r$ relations de cointégration
$H_1$: Il y a plus de $r$ relations

**Test de la Valeur Propre Maximale:**
$$\lambda_{\max}(r,r+1) = -T \ln(1-\hat{\lambda}_{r+1})$$

$H_0$: Il y a exactement $r$ relations
$H_1$: Il y a $r+1$ relations

#### 10.4.4 Valeurs Critiques de Johansen

Les valeurs critiques dépendent du nombre de variables $(n)$ et du nombre de relations sous test.

Tableau pour $n=2$ (deux variables):

| $r$ | 1% | 5% | 10% |
|-----|----|----|-----|
| $r=0$ | 20.04 | 15.41 | 13.33 |
| $r \leq 1$ | 6.65 | 3.76 | 2.62 |

### 10.5 Modèle de Correction d'Erreur (VECM)

#### 10.5.1 Formulation VECM

Si les variables sont cointégrées, on doit utiliser un **Vector Error Correction Model** (VECM):

$$\Delta Y_t = \alpha \beta' Y_{t-1} + \sum_{i=1}^{p-1} \Gamma_i \Delta Y_{t-i} + \varepsilon_t$$

où:
- $\beta' Y_{t-1}$ sont les **termes d'erreur de correction**
- $\alpha$ est le vecteur de **vitesse d'ajustement**

#### 10.5.2 Interprétation

- Si $\alpha_i \neq 0$: La variable $i$ répond aux déséquilibres
- Si $\alpha_i = 0$: La variable $i$ est exogène (faiblement)
- La magnitude de $\alpha_i$ indique la vitesse d'ajustement vers l'équilibre

#### 10.5.3 Exemple VECM(1) avec 2 Variables

$$\Delta y_t = \alpha_1 (y_{t-1} - \beta x_{t-1}) + \varepsilon_{1t}$$
$$\Delta x_t = \alpha_2 (y_{t-1} - \beta x_{t-1}) + \varepsilon_{2t}$$

---

## 11. Modèles VAR - Vecteur Autorégressif {#modeles-var}

### 11.1 Processus VAR(p)

Un processus **VAR(p)** avec $n$ variables est:

$$Y_t = A_1 Y_{t-1} + A_2 Y_{t-2} + \cdots + A_p Y_{t-p} + \varepsilon_t$$

où:
- $Y_t = [y_{1t}, y_{2t}, \ldots, y_{nt}]'$ est un vecteur $(n \times 1)$
- $A_i$ sont des matrices $(n \times n)$ de paramètres
- $\varepsilon_t = [\varepsilon_{1t}, \varepsilon_{2t}, \ldots, \varepsilon_{nt}]' \sim N(0, \Sigma)$
- $\Sigma$ est la matrice de variance-covariance

### 11.2 Représentation Compacte

$$\text{vec}(Y_t) = (I_n \otimes A(L)) \text{vec}(Y_t) + \varepsilon_t$$

ou sous forme d'opérateur:
$$A(L) Y_t = \varepsilon_t$$

où:
$$A(L) = I_n - A_1 L - A_2 L^2 - \cdots - A_p L^p$$

### 11.3 Stationnarité du VAR

Le VAR(p) est **stationnaire** si toutes les racines de:
$$\det(I_n - A_1 z - A_2 z^2 - \cdots - A_p z^p) = 0$$

sont **en dehors du cercle unité**: $|z_i| > 1$.

### 11.4 Représentation VMA

Un VAR(p) stationnaire admet une représentation VMA infinie:

$$Y_t = \sum_{j=0}^{\infty} \Psi_j \varepsilon_{t-j}$$

où les matrices $\Psi_j$ sont calculées par:
$$\Psi_0 = I_n$$
$$\Psi_j = A_1 \Psi_{j-1} + A_2 \Psi_{j-2} + \cdots + A_p \Psi_{j-p}$$

### 11.5 Estimation du VAR

#### 11.5.1 Estimation OLS Équation par Équation

Chaque équation peut être estimée indépendamment par OLS:

$$y_{it} = a_{i1,1} y_{1,t-1} + \cdots + a_{in,p} y_{n,t-p} + \varepsilon_{it}$$

**Propriétés:**
- $\hat{A} \xrightarrow{p} A$ (convergence)
- $\sqrt{T}(\hat{A} - A) \xrightarrow{d} N(0, \Sigma_A)$ (normalité asymptotique)

#### 11.5.2 Estimation par Maximum de Vraisemblance

Sous $\varepsilon_t \sim N(0, \Sigma)$:

$$\ell(A, \Sigma) = -\frac{Tn}{2}\ln(2\pi) - \frac{T}{2}\ln|\Sigma| - \frac{1}{2}\text{tr}(\Sigma^{-1} \sum_{t=1}^T \hat{\varepsilon}_t \hat{\varepsilon}_t')$$

L'estimateur ML des coefficients coïncide avec OLS; estimateur ML de $\Sigma$ est:
$$\hat{\Sigma} = \frac{1}{T}\sum_{t=1}^T \hat{\varepsilon}_t \hat{\varepsilon}_t'$$

### 11.6 Sélection de l'Ordre p

**Critères d'information:**

$$AIC(p) = \ln|\hat{\Sigma}_p| + \frac{2n^2 p}{T}$$
$$BIC(p) = \ln|\hat{\Sigma}_p| + \frac{n^2 p \ln T}{T}$$

Choisir le $p$ qui **minimise** ces critères.

### 11.7 Analyse d'Impulsion-Réaction (IRF)

#### 11.7.1 Fonction d'Impulsion-Réaction

La réponse de $y_i$ à un choc unitaire sur $\varepsilon_j$ après $h$ périodes est:

$$\frac{\partial y_{i,t+h}}{\partial \varepsilon_{jt}} = [\Psi_h]_{ij}$$

où $\Psi_h$ sont les coefficients de la représentation VMA.

#### 11.7.2 Exemple: VAR(1) avec 2 Variables

$$Y_t = A_1 Y_{t-1} + \varepsilon_t$$

Pour le choc initial:
$$\Psi_0 = I$$
$$\Psi_1 = A_1$$
$$\Psi_2 = A_1^2$$
$$\Psi_h = A_1^h$$

### 11.8 Décomposition de la Variance

La **décomposition de la variance** mesure la contribution de chaque choc à la variance d'une variable.

$$\text{FEVD}_{ij}(h) = \frac{\sum_{k=0}^{h-1} ([\Psi_k S]_{ij})^2}{\sum_{j=1}^n \sum_{k=0}^{h-1} ([\Psi_k S]_{ij})^2}$$

où $S$ est la décomposition de Cholesky de $\Sigma = SS'$.

### 11.9 Causalité au Sens de Granger

La variable $x_t$ cause au sens de Granger $y_t$ si la prévision de $y_t$ s'améliore en incluant les valeurs passées de $x_t$.

#### 11.9.1 Test de Causalité de Granger

Considérer deux modèles:

**Modèle restreint:**
$$y_t = \sum_{i=1}^p \phi_i y_{t-i} + \varepsilon_{1t}$$

**Modèle non-restreint:**
$$y_t = \sum_{i=1}^p \phi_i y_{t-i} + \sum_{i=1}^p \gamma_i x_{t-i} + \varepsilon_{2t}$$

**Hypothèses:**
- $H_0: \gamma_1 = \gamma_2 = \cdots = \gamma_p = 0$ (pas de causalité)
- $H_1$: Au moins un $\gamma_i \neq 0$ (causalité existe)

**Statistique de test:**

$$F = \frac{(SSR_R - SSR_{UR})/p}{SSR_{UR}/(T-2p-1)}$$

où:
- $SSR_R$ = somme des carrés des résidus du modèle restreint
- $SSR_{UR}$ = somme des carrés des résidus du modèle non-restreint
- $p$ = nombre de lags

Sous $H_0$: $F \sim F(p, T-2p-1)$

---

## 12. Modèles GARCH {#modeles-garch}

### 12.1 Hétéroscédasticité Conditionnelle

De nombreuses séries économiques et financières exhibent une **hétéroscédasticité conditionnelle**: la variance change dans le temps selon le passé.

**Exemple:** Rendements boursiers - période de calme vs. période de turbulence

### 12.2 Processus GARCH(p,q)

Un processus **GARCH(p,q)** (Generalized ARCH) modélise la variance conditionnelle:

$$y_t = \mu_t + \varepsilon_t$$
$$\varepsilon_t | \Omega_{t-1} \sim D(0, \sigma_t^2)$$

$$\sigma_t^2 = \omega + \sum_{i=1}^q \alpha_i \varepsilon_{t-i}^2 + \sum_{j=1}^p \beta_j \sigma_{t-j}^2$$

où:
- $\mu_t$ est la moyenne conditionnelle
- $\sigma_t^2$ est la variance conditionnelle
- $\Omega_{t-1}$ est l'ensemble d'information jusqu'à la date $t-1$

### 12.3 Processus ARCH(q)

Un processus **ARCH(q)** est un cas particulier où $p=0$:

$$\sigma_t^2 = \omega + \sum_{i=1}^q \alpha_i \varepsilon_{t-i}^2$$

#### 12.3.1 Propriétés de ARCH(q)

**Variance inconditionnelle:**

Si $\sum_{i=1}^q \alpha_i < 1$:
$$E[\varepsilon_t^2] = \frac{\omega}{1 - \sum_{i=1}^q \alpha_i}$$

**Conditions de positivité:**
- $\omega > 0$
- $\alpha_i \geq 0$ pour tout $i$
- $\sum_{i=1}^q \alpha_i < 1$

### 12.4 Propriétés du GARCH(1,1)

Le modèle **GARCH(1,1)** est le plus courant:

$$\sigma_t^2 = \omega + \alpha_1 \varepsilon_{t-1}^2 + \beta_1 \sigma_{t-1}^2$$

#### 12.4.1 Conditions de Stationnarité

Pour que la variance inconditionnelle existe et soit finie:
$$\alpha_1 + \beta_1 < 1$$

#### 12.4.2 Variance Inconditionnelle

$$E[\sigma_t^2] = \frac{\omega}{1 - \alpha_1 - \beta_1}$$

#### 12.4.3 Persistance de la Volatilité

$$\alpha_1 + \beta_1$$

mesure la persistance des chocs de volatilité. Si $\alpha_1 + \beta_1$ est proche de 1, les chocs ont un effet longterm sur la volatilité.

### 12.5 Estimation GARCH

#### 12.5.1 Maximum de Vraisemblance

Sous $\varepsilon_t | \Omega_{t-1} \sim N(0, \sigma_t^2)$:

$$\ell = -\frac{1}{2}\sum_{t=1}^T \left[\ln(2\pi\sigma_t^2) + \frac{\varepsilon_t^2}{\sigma_t^2}\right]$$

Les estimateurs ML sont trouvés par optimisation numérique (pas de solution analytique).

#### 12.5.2 Test ARCH (Test de Multiplicateurs de Lagrange)

Pour tester la présence d'effets ARCH, on peut utiliser le **test LM**.

**Procédure:**
1. Estimer le modèle par OLS: $\hat{\varepsilon}_t = y_t - \hat{y}_t$
2. Régresser $\hat{\varepsilon}_t^2$ sur une constante et $\hat{\varepsilon}_{t-1}^2, \ldots, \hat{\varepsilon}_{t-q}^2$
3. Calculer $LM = T \times R^2$ de cette régression

**Distribution:** Sous $H_0$ (pas d'effet ARCH): $LM \sim \chi^2(q)$

### 12.6 Variantes du GARCH

#### 12.6.1 GARCH-M (GARCH-in-Mean)

Inclut la variance conditionnelle dans la moyenne:

$$y_t = \mu + \lambda \sigma_t^2 + \varepsilon_t$$
$$\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \beta \sigma_{t-1}^2$$

**Interprétation:** Prime de risque - rendement plus élevé si risque (volatilité) plus élevé.

#### 12.6.2 IGARCH (Integrated GARCH)

Si $\alpha + \beta = 1$ dans GARCH(1,1):

$$\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + (1-\alpha) \sigma_{t-1}^2$$

Ceci implique que les chocs de volatilité sont **permanents** (variance inconditionnelle infinie).

#### 12.6.3 EGARCH (Exponential GARCH)

Permet les effets asymétriques (leverage effects):

$$\ln(\sigma_t^2) = \omega + \sum_{i=1}^q \alpha_i \left(\frac{|\varepsilon_{t-i}|}{\sigma_{t-i}} - E\left[\frac{|\varepsilon_{t-i}|}{\sigma_{t-i}}\right]\right) + \sum_{j=1}^p \beta_j \ln(\sigma_{t-j}^2)$$

**Ou plus simplement:**

$$\ln(\sigma_t^2) = \omega + \alpha \frac{\varepsilon_{t-1}}{\sigma_{t-1}} + \gamma \left(\frac{|\varepsilon_{t-1}|}{\sigma_{t-1}} - E[|\cdot|]\right) + \beta \ln(\sigma_{t-1}^2)$$

**Propriété:** Chocs négatifs et positifs peuvent avoir des effets différents sur la volatilité.

---

## 13. Tests de Diagnostic {#tests-diagnostic}

### 13.1 Tests d'Autocorrélation des Résidus

#### 13.1.1 Test de Ljung-Box

La statistique est:
$$Q = T(T+2)\sum_{k=1}^h \frac{r_k^2}{T-k}$$

où $r_k$ est l'autocorrélation empirique des résidus au lag $k$.

**Distribution:** Sous $H_0$ (pas d'autocorrélation): $Q \sim \chi^2(h)$

**Interprétation:**
- Rejet de $H_0$ → Autocorrélation présente
- Nécessité de revoir la spécification du modèle

#### 13.1.2 Test des Multiplicateurs de Lagrange (LM)

Pour tester l'autocorrélation d'ordre $p$:

$$\hat{\varepsilon}_t = \rho_1 \hat{\varepsilon}_{t-1} + \cdots + \rho_p \hat{\varepsilon}_{t-p} + u_t$$

**Statistique:** $LM = T \times R^2$

**Distribution:** $LM \sim \chi^2(p)$ sous $H_0$

### 13.2 Normalité des Résidus

#### 13.2.1 Test de Jarque-Bera

$$JB = T \left[\frac{S^2}{6} + \frac{(K-3)^2}{24}\right]$$

où:
- $S$ = coefficient d'asymétrie (skewness)
- $K$ = coefficient d'aplatissement (kurtosis)

**Distribution:** Sous $H_0$ (normalité): $JB \sim \chi^2(2)$

**Calculs:**

$$S = \frac{E[\varepsilon_t^3]}{\sigma^3}, \quad K = \frac{E[\varepsilon_t^4]}{\sigma^4}$$

#### 13.2.2 Test de Shapiro-Wilk

Teste la concordance entre la distribution empirique et une distribution normale.

Statistique: $W = \frac{(\sum a_i \varepsilon_{(i)})^2}{\sum(\varepsilon_i - \bar{\varepsilon})^2}$

où $\varepsilon_{(i)}$ sont les résidus ordonnés et $a_i$ sont des coefficients tabulés.

### 13.3 Homoscédasticité

#### 13.3.1 Test de White

La statistique est:
$$W = nR^2$$

où $R^2$ provient de la régression:
$$\hat{\varepsilon}_t^2 = \gamma_0 + \gamma_1 X_t + \gamma_2 X_t^2 + u_t$$

**Distribution:** Sous $H_0$ (homoscédasticité): $W \sim \chi^2(q)$ où $q$ = nombre de régresseurs

#### 13.3.2 Test de Breusch-Pagan

Similaire à White mais avec spécification:
$$\ln(\hat{\varepsilon}_t^2) = \gamma_0 + \gamma_1 X_t + u_t$$

### 13.4 Stabilité Structurelle

#### 13.4.1 Test de Chow

Pour tester si une rupture existe à la date $T_b$:

**Modèle complet:** Estimer sur l'ensemble de la période
**Modèles partiels:** Estimer avant et après la rupture

$$F = \frac{(SSR_{\text{total}} - SSR_1 - SSR_2) / k}{(SSR_1 + SSR_2) / (T - 2k)}$$

où:
- $SSR_{\text{total}}$ = somme carrés résidus du modèle complet
- $SSR_1, SSR_2$ = somme carrés résidus des sous-périodes
- $k$ = nombre de paramètres

Sous $H_0$ (pas de rupture): $F \sim F(k, T-2k)$

#### 13.4.2 Test CUSUM (Cumulative Sum of Residuals)

Graphique des sommes cumulées de résidus:
$$S_t = \sum_{i=1}^t \hat{\varepsilon}_i$$

avec bandes de confiance (généralement ±2 écarts-types).

Si $S_t$ dépasse les bandes, il y a évidence de rupture structurelle.

### 13.5 Critères d'Information

#### 13.5.1 Akaike Information Criterion (AIC)

$$AIC = 2k - 2\ln(\hat{L})$$

ou en alternative:

$$AIC = \ln\left(\frac{SSR}{T}\right) + \frac{2k}{T}$$

#### 13.5.2 Bayesian Information Criterion (BIC)

$$BIC = k\ln(T) - 2\ln(\hat{L})$$

ou:

$$BIC = \ln\left(\frac{SSR}{T}\right) + \frac{k\ln(T)}{T}$$

**Différences:**
- BIC pénalise plus fortement la complexité
- Peut mener à des modèles plus parcimonieux

---

## 14. Applications et Exemples {#applications}

### 14.1 Analyse d'un Indice Boursier

Supposons qu'on analyse l'indice S&P 500 sur 10 ans (données mensuelles, T=120).

#### 14.1.1 Tests Préliminaires

**Étape 1: Visualisation graphique**
- La série montre une forte tendance à la hausse
- Évidences de volatilité changeante (clusters de volatilité)

**Étape 2: Test ADF**

Estimation:
$$\Delta y_t = \alpha + \gamma y_{t-1} + \sum_{i=1}^2 \delta_i \Delta y_{t-i} + \varepsilon_t$$

Résultats:
- $\hat{\gamma} = -0.085$, $SE(\hat{\gamma}) = 0.042$
- $ADF = -2.02$
- Valeur critique à 5% = -2.86

**Conclusion:** Ne pas rejeter $H_0$ → Série est I(1)

**Étape 3: Test KPSS**

Résultats:
- $KPSS = 1.23$
- Valeur critique à 5% = 0.463

**Conclusion:** Rejeter $H_0$ → Confirme non-stationnarité

#### 14.1.2 Modélisation

Puisque la série est I(1), on utilise ARIMA:

**Différenciation:**
$$\Delta y_t = y_t - y_{t-1}$$

**Test ADF sur $\Delta y_t$:**
- $ADF = -5.34$ < -2.86 → Rejeter $H_0$
- Conclusion: $\Delta y_t$ est stationnaire, donc $d=1$

**Identification ACF/PACF de $\Delta y_t$:**
- ACF: Décroissance rapide mais pas de coupure nette
- PACF: Pic significatif au lag 1, puis décroissance

**Tentative: ARIMA(1,1,0)**

$$\Delta y_t = \phi_1 \Delta y_{t-1} + \varepsilon_t$$

Estimation:
- $\hat{\phi}_1 = 0.32$, $SE = 0.095$, $t = 3.37**$
- AIC = -2.34
- Ljung-Box $p = 0.18$ (pas d'autocorrélation résiduelle)

### 14.2 Relation entre Taux de Change et Termes de l'Échange

Deux séries I(1) : $e_t$ (taux de change réel) et $tot_t$ (termes de l'échange)

#### 14.2.1 Test de Cointégration (Engle-Granger)

**Étape 1:** Régression de cointégration
$$e_t = \alpha + \beta tot_t + e_t$$

Résultats:
- $\hat{\alpha} = 2.15$, $\hat{\beta} = 1.83$
- $R^2 = 0.68$

**Étape 2:** Test ADF sur résidus
$$ADF(\hat{e}_t) = -3.28$$

Valeur critique EG à 5% = -2.91

**Conclusion:** Rejeter $H_0$ → $e_t$ et $tot_t$ sont cointégrés

#### 14.2.2 Modèle VECM

Estimation du VECM:
$$\Delta e_t = \alpha_1 \hat{e}_{t-1} + \gamma_{11} \Delta e_{t-1} + \gamma_{12} \Delta tot_{t-1} + \varepsilon_{1t}$$
$$\Delta tot_t = \alpha_2 \hat{e}_{t-1} + \gamma_{21} \Delta e_{t-1} + \gamma_{22} \Delta tot_{t-1} + \varepsilon_{2t}$$

Résultats (exemple):
- $\hat{\alpha}_1 = -0.12$ (ajustement du taux de change)
- $\hat{\alpha}_2 = 0.03$ (ajustement faible des termes de l'échange)

**Interprétation:** Le taux de change s'ajuste davantage aux déséquilibres.

### 14.3 Volatilité des Rendements Boursiers

Rendements quotidiens du marché boursier

#### 14.3.1 Spécification GARCH

Modèle:
$$r_t = \mu + \varepsilon_t$$
$$\varepsilon_t | \Omega_{t-1} \sim N(0, \sigma_t^2)$$
$$\sigma_t^2 = 0.00001 + 0.08 \varepsilon_{t-1}^2 + 0.91 \sigma_{t-1}^2$$

#### 14.3.2 Persistance et Demi-Vie

$\alpha + \beta = 0.99$ → Très persistant

Demi-vie d'un choc de volatilité:
$$\text{Half-life} = \frac{\ln(0.5)}{\ln(\alpha + \beta)} \approx 69 \text{ jours}$$

Les chocs de volatilité affectent les prévisions pendant plusieurs mois.

#### 14.3.3 Prévision de Volatilité

Prévision à horizon $h$:
$$\sigma_{t+h}^2 = \omega + (\alpha + \beta)(\sigma_{t+h-1}^2 - \bar{\sigma}^2) + \bar{\sigma}^2$$

où $\bar{\sigma}^2 = \frac{\omega}{1-\alpha-\beta}$ est la variance inconditionnelle.

---

## Conclusion

L'économétrie des séries temporelles fournit les outils nécessaires pour:

1. **Identifier** les caractéristiques des séries (tendance, saisonnalité, volatilité)
2. **Tester** les hypothèses fondamentales (stationnarité, cointégration)
3. **Modéliser** les dynamiques (AR, ARMA, VAR, GARCH)
4. **Prévoir** les valeurs futures
5. **Analyser** les chocs et les causalités

La compréhension de ces concepts est essentielle pour l'analyse économique et financière moderne.

---

## Références Mathématiques Essentielles

### Définitions Clés

| Terme | Définition |
|-------|-----------|
| Stationnarité | Moyenne, variance et autocovariance constantes |
| Racine Unitaire | Paramètre autorégressif = 1 exactement |
| Cointégration | Combinaison linéaire stationnaire de variables I(1) |
| Causalité | Passé d'une variable aide à prévoir l'autre |
| Volatilité | Variance conditionnelle changeante dans le temps |

### Opérateurs Fondamentaux

$$L y_t = y_{t-1} \quad \text{(opérateur de décalage)}$$
$$\Delta y_t = y_t - y_{t-1} = (1-L)y_t \quad \text{(différence première)}$$
$$\Delta^2 y_t = (1-L)^2 y_t \quad \text{(différence seconde)}$$

### Distributions Asymptotiques Clés

- **Théorème Central Limite:** $\frac{1}{\sqrt{T}}\sum_{t=1}^T (x_t - \mu) \xrightarrow{d} N(0, \sigma^2)$
- **Loi des Grands Nombres:** $\frac{1}{T}\sum_{t=1}^T x_t \xrightarrow{p} E[x_t]$
- **Convergence:** $\sqrt{T}(\hat{\theta}_n - \theta) \xrightarrow{d} N(0, V)$

---

**Document complété: 52 pages de contenu détaillé couvrant tous les aspects de l'économétrie des séries temporelles, des fondements théoriques aux applications pratiques.**
