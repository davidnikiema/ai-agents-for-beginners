# Les Modèles de Durée et leur Application en Assurance Vie

## Table des matières

1. [Introduction](#introduction)
2. [Concepts fondamentaux](#concepts-fondamentaux)
3. [Types de modèles de durée](#types-de-modèles-de-durée)
4. [Applications en assurance vie](#applications-en-assurance-vie)
5. [Méthodologie et estimation](#méthodologie-et-estimation)
6. [Avantages et limites](#avantages-et-limites)
7. [Exemples pratiques](#exemples-pratiques)
8. [Conclusion](#conclusion)

---

## Introduction

Les modèles de durée jouent un rôle crucial dans le secteur de l'assurance vie, permettant aux actuaires et aux gestionnaires de risques d'analyser et de prédire la durée jusqu'à la survenance d'un événement spécifique. Ces modèles sont essentiels pour :

- L'évaluation du risque de mortalité
- La tarification des produits d'assurance vie
- La gestion des réserves techniques
- L'analyse de la persistance des contrats
- La gestion actif-passif (ALM)

## Concepts fondamentaux

### Qu'est-ce qu'un modèle de durée ?

Un modèle de durée (ou modèle de survie) est un outil statistique qui analyse le temps écoulé jusqu'à la survenance d'un événement d'intérêt. En assurance vie, cet événement peut être :

- Le décès de l'assuré
- Le rachat d'un contrat
- L'arrivée à échéance d'une police
- La survenance d'une invalidité

### Fonctions clés

#### 1. Fonction de survie S(t)

La probabilité qu'un individu survive au-delà du temps t :

```
S(t) = P(T > t)
```

où T est la variable aléatoire représentant le temps jusqu'à l'événement.

#### 2. Fonction de risque (hazard function) h(t)

Le taux instantané de survenance de l'événement au temps t, sachant que l'individu a survécu jusqu'à t :

```
h(t) = lim(Δt→0) P(t ≤ T < t + Δt | T ≥ t) / Δt
```

#### 3. Fonction de répartition F(t)

La probabilité cumulative qu'un événement survienne avant ou au temps t :

```
F(t) = 1 - S(t) = P(T ≤ t)
```

## Types de modèles de durée

### 1. Modèles paramétriques

Ces modèles supposent une distribution spécifique pour la durée de survie.

#### a) Distribution exponentielle

- **Formule** : h(t) = λ (taux constant)
- **Caractéristique** : Propriété de sans-mémoire
- **Application** : Modélisation simple de la mortalité sur de courtes périodes

#### b) Distribution de Weibull

- **Formule** : h(t) = λp(λt)^(p-1)
- **Caractéristique** : Permet un taux de risque croissant (p > 1), décroissant (p < 1) ou constant (p = 1)
- **Application** : Modélisation de la mortalité avec vieillissement

#### c) Distribution de Gompertz

- **Formule** : h(t) = αe^(βt)
- **Caractéristique** : Risque qui augmente exponentiellement avec l'âge
- **Application** : Très utilisée en assurance vie pour modéliser la mortalité adulte

#### d) Distribution log-normale

- **Caractéristique** : Le logarithme de la durée suit une distribution normale
- **Application** : Modélisation de durées de vie avec variabilité importante

### 2. Modèles semi-paramétriques

#### Modèle de Cox (régression à risques proportionnels)

- **Formule** : h(t|X) = h₀(t) × exp(β₁X₁ + β₂X₂ + ... + βₚXₚ)
- **Caractéristique** : Ne nécessite pas de spécifier la forme de h₀(t)
- **Application** : Analyse de l'impact des covariables (âge, sexe, tabagisme, etc.)

### 3. Modèles non-paramétriques

#### a) Estimateur de Kaplan-Meier

- **Utilité** : Estimation de la fonction de survie sans hypothèse de distribution
- **Application** : Analyse descriptive de la survie dans différents groupes

#### b) Test du log-rank

- **Utilité** : Comparaison de courbes de survie entre différents groupes
- **Application** : Comparaison de la mortalité entre fumeurs et non-fumeurs

## Applications en assurance vie

### 1. Tarification des produits

Les modèles de durée permettent de :

- **Calculer les primes pures** en estimant la probabilité de décès
- **Ajuster les primes** en fonction des caractéristiques individuelles (âge, sexe, état de santé)
- **Développer des produits adaptés** aux différents segments de marché

**Exemple** : Pour une assurance temporaire décès, la prime annuelle P peut être calculée comme :

```
P = (Valeur actuelle des prestations futures) / (Valeur actuelle des primes futures)
```

où les probabilités de survie sont estimées par les modèles de durée.

### 2. Évaluation des réserves techniques

Les modèles de durée sont utilisés pour :

- **Calculer les provisions mathématiques** nécessaires pour faire face aux engagements futurs
- **Estimer les flux de trésorerie futurs** (décès, rachats, arrivées à terme)
- **Effectuer des tests de suffisance du passif**

### 3. Gestion du risque de longévité

Pour les rentes viagères :

- **Modélisation de l'amélioration de la mortalité** au fil du temps
- **Estimation du risque de longévité** (risque que les assurés vivent plus longtemps que prévu)
- **Stratégies de couverture** (réassurance, instruments financiers)

### 4. Analyse de la persistance

Les modèles de durée permettent d'analyser :

- **Le risque de rachat** des contrats d'assurance vie
- **Les facteurs influençant la persistance** (rendement, conditions économiques)
- **L'impact sur la rentabilité** des portefeuilles

### 5. Gestion actif-passif (ALM)

Application des modèles pour :

- **Projeter les flux de passif** sur le long terme
- **Optimiser l'allocation d'actifs** en fonction des engagements
- **Gérer le risque de taux d'intérêt** et le risque de longévité

### 6. Souscription et sélection des risques

Utilisation pour :

- **Évaluer le risque individuel** à la souscription
- **Classifier les assurés** en fonction de leur profil de risque
- **Appliquer des surprimes** ou des exclusions si nécessaire

## Méthodologie et estimation

### Collecte et préparation des données

#### Données requises :

1. **Données individuelles** :
   - Date de naissance
   - Date de souscription
   - Date de décès ou de censure (fin d'observation)
   - Caractéristiques (sexe, tabagisme, profession, etc.)

2. **Données de censure** :
   - Rachat du contrat
   - Fin de la période d'observation
   - Perte de suivi

### Estimation des paramètres

#### Pour les modèles paramétriques :

- **Méthode du maximum de vraisemblance**
- **Méthode des moments**

#### Pour le modèle de Cox :

- **Maximum de vraisemblance partielle**
- Pas besoin d'estimer h₀(t) pour obtenir les coefficients β

### Validation du modèle

1. **Tests d'adéquation** :
   - Test de Kolmogorov-Smirnov
   - Test du chi-deux

2. **Analyse des résidus** :
   - Résidus de Cox-Snell
   - Résidus de Schoenfeld (pour tester l'hypothèse de proportionnalité)

3. **Validation croisée** :
   - Diviser les données en échantillons d'apprentissage et de test
   - Évaluer la performance prédictive

### Gestion de la censure

Types de censure couramment rencontrés :

1. **Censure à droite** : L'événement n'a pas encore eu lieu à la fin de l'observation
2. **Censure à gauche** : L'événement a eu lieu avant le début de l'observation
3. **Censure par intervalle** : L'événement est connu pour avoir eu lieu dans un intervalle de temps

## Avantages et limites

### Avantages

1. **Prise en compte des données censurées** : Utilisation efficace de toutes les informations disponibles
2. **Flexibilité** : Adaptation à différents types de distributions et de risques
3. **Incorporation de covariables** : Analyse de l'impact de multiples facteurs sur la durée
4. **Base pour la tarification** : Fondement scientifique pour le calcul des primes
5. **Gestion proactive du risque** : Anticipation des évolutions démographiques

### Limites

1. **Hypothèses restrictives** :
   - Certains modèles supposent des formes spécifiques de distribution
   - L'hypothèse de proportionnalité dans le modèle de Cox peut être violée

2. **Qualité des données** :
   - Nécessite des données historiques fiables et suffisantes
   - Sensible aux erreurs de mesure et aux données manquantes

3. **Stabilité dans le temps** :
   - Les tendances de mortalité peuvent évoluer (amélioration médicale, changements de comportement)
   - Nécessité de réestimer régulièrement les modèles

4. **Complexité** :
   - Certains modèles avancés nécessitent une expertise actuarielle poussée
   - Interprétation des résultats peut être délicate

5. **Risque de modèle** :
   - Le choix du mauvais modèle peut conduire à une tarification inadéquate
   - Sous-estimation ou surestimation des réserves

## Exemples pratiques

### Exemple 1 : Tarification d'une assurance temporaire décès

**Contexte** : Assurance temporaire de 20 ans, capital 100 000 €, assuré homme de 40 ans, non-fumeur.

**Démarche** :

1. **Sélection du modèle** : Modèle de Gompertz-Makeham pour la mortalité masculine
   ```
   μ(x) = A + Bc^x
   ```
   où x est l'âge

2. **Estimation des paramètres** (exemple fictif) :
   - A = 0.0005
   - B = 0.00001
   - c = 1.09

3. **Calcul de la probabilité de survie** :
   Pour chaque année t de 0 à 20, calculer :
   ```
   ₜp₄₀ = exp(-∫₀ᵗ μ(40+s)ds)
   ```

4. **Calcul de la probabilité de décès** pour chaque année :
   ```
   q₄₀₊ₜ = 1 - p₄₀₊ₜ
   ```

5. **Valeur actuelle des prestations** (taux d'actualisation i = 2%) :
   ```
   VAP = 100 000 × Σ(t=1 to 20) [v^t × ₜ₋₁p₄₀ × q₄₀₊ₜ₋₁]
   ```
   où v = 1/(1+i)

6. **Valeur actuelle des primes** :
   ```
   VAP = P × Σ(t=0 to 19) [v^t × ₜp₄₀]
   ```

7. **Prime pure annuelle** :
   ```
   P = VAP_prestations / VAP_primes
   ```

8. **Prime commerciale** : Ajouter les chargements (frais, marge de sécurité)

### Exemple 2 : Analyse de la persistance avec le modèle de Cox

**Contexte** : Analyser les facteurs influençant le rachat de contrats d'assurance vie.

**Variables explicatives** :
- Âge du contrat
- Rendement du contrat vs. rendements du marché
- Âge de l'assuré
- Montant de la prime
- Canal de distribution

**Modèle de Cox** :
```
h(t|X) = h₀(t) × exp(β₁×ancienneté + β₂×écart_rendement + β₃×âge + β₄×prime + β₅×canal)
```

**Résultats typiques** (exemple fictif) :

| Variable | Coefficient (β) | HR (exp(β)) | Interprétation |
|----------|----------------|-------------|----------------|
| Ancienneté | -0.15 | 0.86 | Diminution de 14% du risque de rachat par année supplémentaire |
| Écart rendement | 0.50 | 1.65 | Si rendement inférieur de 1% au marché, risque de rachat augmente de 65% |
| Âge | -0.02 | 0.98 | Légère diminution avec l'âge |
| Prime (en log) | 0.10 | 1.11 | Primes plus élevées = risque de rachat légèrement plus élevé |
| Canal (agent vs. direct) | -0.30 | 0.74 | Contrats via agents ont 26% moins de risque de rachat |

**Application** :
- Identifier les contrats à haut risque de rachat
- Adapter les stratégies de rétention
- Améliorer les projections de flux de trésorerie

### Exemple 3 : Projection de la mortalité avec tendance temporelle

**Contexte** : Projection de la mortalité future pour évaluer le risque de longévité d'un portefeuille de rentes.

**Modèle de Lee-Carter** :
```
ln(m(x,t)) = a(x) + b(x)×k(t) + ε(x,t)
```

où :
- m(x,t) est le taux de mortalité à l'âge x et au temps t
- a(x) décrit le profil moyen de mortalité par âge
- b(x) décrit la sensibilité de chaque âge aux variations temporelles
- k(t) est un indice de mortalité temporel

**Démarche** :

1. **Estimation historique** : Utiliser 30-50 ans de données de mortalité
2. **Projection de k(t)** : Modèle ARIMA ou marche aléatoire avec dérive
3. **Calcul des taux futurs** : Application de la formule pour projeter m(x,t)
4. **Calcul de l'espérance de vie** : Intégration des taux de survie projetés
5. **Évaluation du passif** : Actualisation des flux de rentes futurs

**Impact** :
- Si l'espérance de vie à 65 ans passe de 20 à 22 ans, le coût d'une rente viagère peut augmenter de 8-10%
- Nécessité de provisions supplémentaires ou d'ajustement des tarifs

## Conclusion

Les modèles de durée constituent un pilier fondamental de l'actuariat moderne en assurance vie. Leur application permet :

1. **Une tarification rigoureuse** basée sur des principes statistiques solides
2. **Une gestion efficace des risques** à travers l'identification et la quantification des facteurs de risque
3. **Une meilleure compréhension** du comportement des assurés et de l'évolution de la mortalité
4. **Des décisions éclairées** en matière de gestion actif-passif et de stratégie d'entreprise

### Perspectives d'avenir

L'évolution des modèles de durée en assurance vie s'oriente vers :

1. **Modèles de machine learning** :
   - Forêts aléatoires de survie
   - Réseaux de neurones pour l'analyse de survie
   - Capacité à capturer des relations non-linéaires complexes

2. **Big data et nouvelles sources de données** :
   - Données connectées (objets portables, santé)
   - Données génétiques (avec considérations éthiques)
   - Données comportementales et sociales

3. **Modélisation dynamique** :
   - Mise à jour en temps réel des estimations
   - Adaptation aux changements rapides de mortalité (pandémies, avancées médicales)

4. **Intégration avec d'autres risques** :
   - Modèles multivariés (mortalité, morbidité, rachat)
   - Approche holistique de la gestion des risques

5. **Considérations ESG** :
   - Impact du changement climatique sur la mortalité
   - Facteurs environnementaux et sociaux dans les modèles

### Recommandations pour les actuaires

1. **Formation continue** : Se tenir au courant des dernières avancées méthodologiques
2. **Validation rigoureuse** : Tester systématiquement les hypothèses des modèles
3. **Communication** : Expliquer clairement les résultats et les incertitudes aux décideurs
4. **Éthique** : Assurer l'équité et la transparence dans l'utilisation des modèles
5. **Prudence** : Incorporer des marges de sécurité appropriées dans les calculs

---

## Références bibliographiques

1. **Ouvrages de référence** :
   - Bowers, N.L. et al. (1997). *Actuarial Mathematics*, Society of Actuaries
   - Klein, J.P. & Moeschberger, M.L. (2003). *Survival Analysis: Techniques for Censored and Truncated Data*, Springer
   - Therneau, T.M. & Grambsch, P.M. (2000). *Modeling Survival Data: Extending the Cox Model*, Springer

2. **Articles académiques** :
   - Cox, D.R. (1972). "Regression models and life-tables", *Journal of the Royal Statistical Society*
   - Kaplan, E.L. & Meier, P. (1958). "Nonparametric estimation from incomplete observations", *Journal of the American Statistical Association*
   - Lee, R.D. & Carter, L.R. (1992). "Modeling and forecasting U.S. mortality", *Journal of the American Statistical Association*

3. **Ressources en ligne** :
   - Institut des Actuaires (France)
   - Society of Actuaries (SOA)
   - Casualty Actuarial Society (CAS)
   - Human Mortality Database (www.mortality.org)

---

**Document préparé pour : Applications en assurance vie**

**Date : Novembre 2025**

**Note** : Ce document présente un aperçu des modèles de durée et de leurs applications. Pour des applications spécifiques, consulter un actuaire qualifié et se référer aux réglementations locales en vigueur.
