const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COURSE_ID = 'course-r-stats';

const lessons = [
  // ── MODULE 1 : Introduction à R ──────────────────────────────────────────
  {
    title: 'Introduction à R et RStudio',
    order: 1,
    duration: 20,
    content: 'Découverte de R, installation et premiers pas dans l\'environnement.',
    contents: [
      {
        title: 'Qu\'est-ce que R ?',
        contentType: 'text',
        order: 1,
        content: `# Qu'est-ce que R ?

R est un langage de programmation et un environnement logiciel libre dédié aux **statistiques**, à la **visualisation de données** et à l'**apprentissage automatique**.

## Pourquoi apprendre R ?

- **Open source** et gratuit
- **CRAN** : plus de 20 000 packages disponibles
- Standard dans la recherche académique et la finance
- Intégration native avec Excel, SQL, Python
- Graphiques de qualité publication avec **ggplot2**

## R vs Python

| Critère | R | Python |
|---|---|---|
| Statistiques | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Visualisation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Machine Learning | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Finance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

> R est le choix numéro 1 des statisticiens, économètres et quants en finance.`
      },
      {
        title: 'Premiers pas : syntaxe de base',
        contentType: 'code',
        order: 2,
        content: `# ── Syntaxe de base R ───────────────────────────────────────────────────

# 1. Variables et assignation
x <- 42          # opérateur préféré en R
y = 3.14         # fonctionne aussi
nom <- "Elsayf"

cat("x =", x, "\\n")
cat("y =", y, "\\n")
cat("nom =", nom, "\\n")

# 2. Types de base
entier <- 10L            # integer
reel   <- 3.14           # numeric (double)
texte  <- "bonjour"      # character
booleen <- TRUE          # logical

cat("\\nTypes :\\n")
cat("class(entier) :", class(entier), "\\n")
cat("class(reel)   :", class(reel),   "\\n")
cat("class(texte)  :", class(texte),  "\\n")
cat("class(booleen):", class(booleen),"\\n")

# 3. Opérations arithmétiques
cat("\\nOpérations :\\n")
cat("5 + 3 =", 5 + 3, "\\n")
cat("10 / 3 =", 10 / 3, "\\n")
cat("2^8 =", 2^8, "\\n")
cat("17 %% 5 =", 17 %% 5, "\\n")  # modulo`
      },
      {
        title: 'Vecteurs : la structure fondamentale',
        contentType: 'code',
        order: 3,
        content: `# ── Vecteurs en R ───────────────────────────────────────────────────────

# Création de vecteurs
notes <- c(14, 18, 12, 16, 9, 17, 15, 11)
noms  <- c("Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hugo")

cat("=== Notes de la classe ===\\n")
print(notes)
cat("\\nNombre d'étudiants :", length(notes), "\\n")

# Statistiques instantanées
cat("\\n=== Statistiques ===\\n")
cat("Moyenne :", mean(notes), "\\n")
cat("Min     :", min(notes),  "\\n")
cat("Max     :", max(notes),  "\\n")
cat("Médiane :", median(notes), "\\n")

# Sélection (indexation commence à 1 en R !)
cat("\\n=== Sélection ===\\n")
cat("1ère note   :", notes[1], "\\n")
cat("Notes 2 à 4 :", notes[2:4], "\\n")

# Opérations vectorisées
notes_sur_20 <- notes
notes_bonus  <- notes + 2
cat("\\nAvec bonus (+2) :", notes_bonus, "\\n")

# Filtrage
admis <- noms[notes >= 10]
cat("Admis :", admis, "\\n")`
      }
    ]
  },

  // ── MODULE 1 : Suite ─────────────────────────────────────────────────────
  {
    title: 'Structures de données : data frames',
    order: 2,
    duration: 25,
    content: 'Maîtrisez les data frames, la structure centrale pour l\'analyse de données en R.',
    contents: [
      {
        title: 'Créer et manipuler un data frame',
        contentType: 'code',
        order: 1,
        content: `# ── Data Frames ─────────────────────────────────────────────────────────

# Créer un data frame
entreprises <- data.frame(
  nom       = c("Apple", "Google", "Microsoft", "Amazon", "Tesla"),
  secteur   = c("Tech", "Tech", "Tech", "E-commerce", "Auto"),
  ca_2024   = c(383, 307, 245, 575, 97),     # milliards $
  employes  = c(161000, 182000, 228000, 1540000, 140000),
  benefice  = c(97, 73, 88, 30, 15)          # milliards $
)

cat("=== Data Frame : Grandes Entreprises ===\\n")
print(entreprises)

# Dimensions
cat("\\nDimensions:", nrow(entreprises), "lignes x", ncol(entreprises), "colonnes\\n")

# Accès aux colonnes
cat("\\nChiffres d'affaires :", entreprises$ca_2024, "Md$\\n")

# Calcul : marge bénéficiaire
entreprises$marge <- round(entreprises$benefice / entreprises$ca_2024 * 100, 1)
cat("\\nMarges (%) :\\n")
print(entreprises[, c("nom", "marge")])

# Filtrage : entreprises avec marge > 25%
cat("\\nEntreprises très rentables (marge > 25%) :\\n")
print(entreprises[entreprises$marge > 25, "nom"])`
      },
      {
        title: 'Lire des données externes',
        contentType: 'text',
        order: 2,
        content: `# Importer des données en R

## Formats supportés

\`\`\`r
# CSV (le plus courant)
df <- read.csv("donnees.csv", sep=",", header=TRUE, encoding="UTF-8")

# Excel (package readxl)
# install.packages("readxl")
library(readxl)
df <- read_excel("classeur.xlsx", sheet="Feuille1")

# Depuis Internet
url <- "https://raw.githubusercontent.com/datasets/s-and-p-500/master/data/all.csv"
df <- read.csv(url)

# Afficher les premières lignes
head(df, 5)

# Résumé rapide
str(df)      # structure des colonnes
summary(df)  # statistiques par colonne
\`\`\`

## Bonnes pratiques

1. Vérifiez toujours \`nrow(df)\` et \`ncol(df)\` après import
2. Utilisez \`str(df)\` pour voir les types de colonnes
3. \`summary(df)\` détecte les NA et les outliers
4. \`View(df)\` ouvre un tableau interactif dans RStudio`
      }
    ]
  },

  // ── MODULE 2 : Statistiques Descriptives ────────────────────────────────
  {
    title: 'Statistiques descriptives fondamentales',
    order: 3,
    duration: 30,
    content: 'Maîtrisez les mesures de tendance centrale, de dispersion et les tests de normalité.',
    contents: [
      {
        title: 'Mesures de tendance centrale et dispersion',
        contentType: 'code',
        order: 1,
        content: `# ── Statistiques Descriptives Complètes ─────────────────────────────────

set.seed(42)
# Simulation de rendements boursiers journaliers (en %)
rendements <- rnorm(252, mean = 0.05, sd = 1.2)

cat("========================================\\n")
cat("   ANALYSE DES RENDEMENTS BOURSIERS     \\n")
cat("========================================\\n\\n")

# Tendance centrale
cat("--- TENDANCE CENTRALE ---\\n")
cat("Moyenne      :", round(mean(rendements), 4), "%\\n")
cat("Médiane      :", round(median(rendements), 4), "%\\n")

# Mode approximé
hist_data <- hist(rendements, plot=FALSE, breaks=20)
mode_approx <- hist_data$mids[which.max(hist_data$counts)]
cat("Mode (aprox) :", round(mode_approx, 4), "%\\n")

# Dispersion
cat("\\n--- DISPERSION ---\\n")
cat("Variance     :", round(var(rendements), 4), "\\n")
cat("Écart-type   :", round(sd(rendements), 4), "%\\n")
cat("Étendue      :", round(diff(range(rendements)), 4), "%\\n")

# Quantiles
q <- quantile(rendements, probs = c(0.01, 0.05, 0.25, 0.50, 0.75, 0.95, 0.99))
cat("\\n--- QUANTILES ---\\n")
for (i in seq_along(q)) {
  cat(sprintf("Q%-4s : %+.4f%%\\n", names(q)[i], q[i]))
}

# Forme de la distribution
cat("\\n--- FORME ---\\n")
n <- length(rendements)
m <- mean(rendements)
s <- sd(rendements)
skewness <- (sum((rendements - m)^3) / n) / s^3
kurtosis <- (sum((rendements - m)^4) / n) / s^4 - 3
cat("Asymétrie (skewness) :", round(skewness, 4), "\\n")
cat("Aplatissement (kurt) :", round(kurtosis, 4), "\\n")`
      },
      {
        title: 'Tests statistiques : normalité et comparaison',
        contentType: 'code',
        order: 2,
        content: `# ── Tests Statistiques ───────────────────────────────────────────────────

set.seed(123)

# Deux groupes : rendements avant/après événement
avant  <- rnorm(50, mean = 0.1, sd = 1.0)
apres  <- rnorm(50, mean = 0.5, sd = 1.2)

cat("=== TEST DE NORMALITÉ (Shapiro-Wilk) ===\\n")
cat("H0 : la distribution est normale\\n\\n")

test_avant <- shapiro.test(avant)
test_apres <- shapiro.test(apres)

cat("Avant  - W:", round(test_avant$statistic, 4),
    "| p-value:", round(test_avant$p.value, 4),
    "| Normal:", test_avant$p.value > 0.05, "\\n")
cat("Après  - W:", round(test_apres$statistic, 4),
    "| p-value:", round(test_apres$p.value, 4),
    "| Normal:", test_apres$p.value > 0.05, "\\n")

cat("\\n=== TEST T DE STUDENT (comparaison de moyennes) ===\\n")
cat("H0 : les deux groupes ont la même moyenne\\n\\n")

t_test <- t.test(avant, apres, alternative = "two.sided")
cat("t-statistic :", round(t_test$statistic, 4), "\\n")
cat("p-value     :", round(t_test$p.value, 4), "\\n")
cat("IC 95%      :", round(t_test$conf.int[1], 4), "à", round(t_test$conf.int[2], 4), "\\n")
cat("Conclusion  :", ifelse(t_test$p.value < 0.05,
    "Différence SIGNIFICATIVE (reject H0)",
    "Différence NON significative (H0 conservée)"), "\\n")

cat("\\n=== CORRÉLATION ===\\n")
x <- rnorm(100)
y <- 0.7 * x + rnorm(100, sd = 0.5)
cor_test <- cor.test(x, y)
cat("r de Pearson :", round(cor_test$estimate, 4), "\\n")
cat("p-value      :", round(cor_test$p.value, 6), "\\n")`
      }
    ]
  },

  // ── MODULE 3 : Visualisation ─────────────────────────────────────────────
  {
    title: 'Visualisation de données avec ggplot2',
    order: 4,
    duration: 35,
    content: 'Créez des graphiques professionnels avec la grammaire des graphiques ggplot2.',
    contents: [
      {
        title: 'La grammaire de ggplot2',
        contentType: 'text',
        order: 1,
        content: `# La grammaire des graphiques (ggplot2)

ggplot2 est basé sur le concept de **"Grammar of Graphics"** — chaque graphique est construit par couches.

## Anatomie d'un graphique ggplot2

\`\`\`r
ggplot(data = mes_donnees,           # 1. Données
       aes(x = colonne_x,           # 2. Esthétiques (axes, couleurs...)
           y = colonne_y,
           color = groupe)) +
  geom_point() +                     # 3. Géométrie (type de graphique)
  geom_smooth(method = "lm") +       # 4. Couches supplémentaires
  labs(title = "Mon graphique",      # 5. Labels
       x = "Axe X", y = "Axe Y") +
  theme_minimal()                    # 6. Thème visuel
\`\`\`

## Types de géométries

| geom_ | Usage |
|---|---|
| \`geom_point()\` | Nuage de points |
| \`geom_line()\` | Courbes |
| \`geom_bar()\` | Diagramme en barres |
| \`geom_histogram()\` | Histogramme |
| \`geom_boxplot()\` | Boîte à moustaches |
| \`geom_density()\` | Densité |
| \`geom_heatmap()\` | Carte de chaleur |

> **Installation** : \`install.packages("ggplot2")\` ou via tidyverse : \`install.packages("tidyverse")\``
      },
      {
        title: 'Graphiques financiers essentiels',
        contentType: 'code',
        order: 2,
        content: `# ── Graphiques financiers sans ggplot2 (base R) ──────────────────────────
# (ggplot2 nécessite une installation - base R toujours disponible)

set.seed(42)
n <- 252  # jours de trading

# Simulation prix d'une action (marche aléatoire)
rendements_j <- rnorm(n, mean = 0.0005, sd = 0.015)
prix <- 100 * cumprod(1 + rendements_j)
jours <- 1:n

cat("=== STATISTIQUES DU PRIX ===\\n")
cat("Prix initial  : 100.00\\n")
cat("Prix final    :", round(tail(prix, 1), 2), "\\n")
cat("Performance   :", round((tail(prix,1)/100 - 1) * 100, 2), "%\\n")
cat("Volatilité an.:", round(sd(rendements_j) * sqrt(252) * 100, 2), "%\\n")
cat("Max Drawdown  :", round(min(prix/cummax(prix) - 1) * 100, 2), "%\\n")

# Distribution des rendements
cat("\\n=== DISTRIBUTION DES RENDEMENTS ===\\n")
positifs <- sum(rendements_j > 0)
cat("Jours positifs:", positifs, "/", n, "(", round(positifs/n*100, 1), "%)\\n")
cat("Meilleur jour :", round(max(rendements_j)*100, 2), "%\\n")
cat("Pire jour     :", round(min(rendements_j)*100, 2), "%\\n")

# VaR et CVaR
var_95  <- quantile(rendements_j, 0.05)
cvar_95 <- mean(rendements_j[rendements_j <= var_95])
cat("\\nVaR  95%      :", round(var_95  * 100, 3), "%\\n")
cat("CVaR 95%      :", round(cvar_95 * 100, 3), "%\\n")

# Ratio de Sharpe (taux sans risque 3%)
rf_j <- 0.03 / 252
sharpe <- (mean(rendements_j) - rf_j) / sd(rendements_j) * sqrt(252)
cat("Sharpe Ratio  :", round(sharpe, 3), "\\n")`
      }
    ]
  },

  // ── MODULE 4 : Régression ────────────────────────────────────────────────
  {
    title: 'Régression linéaire et modélisation',
    order: 5,
    duration: 40,
    content: 'Apprenez à construire, interpréter et valider des modèles de régression.',
    contents: [
      {
        title: 'Régression linéaire simple',
        contentType: 'code',
        order: 1,
        content: `# ── Régression Linéaire Simple ───────────────────────────────────────────

set.seed(2024)
n <- 100

# Données : relation taux d'intérêt → performance obligataire
taux_interet   <- runif(n, min = 0.5, max = 8)  # en %
perf_oblig     <- -2.5 * taux_interet + 15 + rnorm(n, sd = 2)

cat("=== RÉGRESSION : Perf_obligations ~ Taux_intérêt ===\\n\\n")

# Ajuster le modèle
model <- lm(perf_oblig ~ taux_interet)
s <- summary(model)

# Coefficients
cat("--- Coefficients ---\\n")
cat("Intercept (a) :", round(coef(model)[1], 4), "\\n")
cat("Pente (b)     :", round(coef(model)[2], 4), "\\n")
cat("Équation      : y =", round(coef(model)[1],2), "+",
    round(coef(model)[2],2), "* x\\n")

# Qualité du modèle
cat("\\n--- Qualité d'ajustement ---\\n")
cat("R²            :", round(s$r.squared, 4), "\\n")
cat("R² ajusté     :", round(s$adj.r.squared, 4), "\\n")
cat("RMSE          :", round(sqrt(mean(s$residuals^2)), 4), "\\n")
cat("F-statistic   :", round(s$fstatistic[1], 2),
    "| p-value:", round(pf(s$fstatistic[1], s$fstatistic[2], s$fstatistic[3], lower.tail=FALSE), 6), "\\n")

# Interprétation
cat("\\n--- Interprétation ---\\n")
cat("Pour chaque +1% de taux d'intérêt,\\n")
cat("la perf. obligataire change de", round(coef(model)[2], 2), "%\\n")
cat("(relation inverse = duration négative)\\n")

# Prédiction
nouveau_taux <- 4.5
prediction <- predict(model, data.frame(taux_interet = nouveau_taux),
                      interval = "confidence", level = 0.95)
cat("\\n--- Prédiction pour taux =", nouveau_taux, "% ---\\n")
cat("Prévision     :", round(prediction[1], 2), "%\\n")
cat("IC 95%        :", round(prediction[2], 2), "à", round(prediction[3], 2), "%\\n")`
      },
      {
        title: 'Régression multiple et sélection de modèle',
        contentType: 'code',
        order: 2,
        content: `# ── Régression Multiple ─────────────────────────────────────────────────

set.seed(999)
n <- 200

# Données macro-économiques → croissance PIB
inflation    <- runif(n, 0, 8)
chomage      <- runif(n, 3, 15)
taux_banque  <- runif(n, 0.5, 6)
investissem  <- runif(n, 15, 40)

pib_growth   <- 3.5 - 0.3 * inflation - 0.4 * chomage +
                0.5 * investissem - 0.2 * taux_banque +
                rnorm(n, sd = 0.8)

df <- data.frame(pib_growth, inflation, chomage, taux_banque, investissem)

cat("=== RÉGRESSION MULTIPLE : PIB ~ Macro ===\\n\\n")

# Modèle complet
model_full <- lm(pib_growth ~ inflation + chomage + taux_banque + investissem, data = df)
s <- summary(model_full)

cat("--- Coefficients (modèle complet) ---\\n")
coefs <- round(s$coefficients, 4)
for (i in 1:nrow(coefs)) {
  sig <- ifelse(coefs[i,4] < 0.001, "***",
         ifelse(coefs[i,4] < 0.01,  "**",
         ifelse(coefs[i,4] < 0.05,  "*",
         ifelse(coefs[i,4] < 0.1,   ".", " "))))
  cat(sprintf("  %-14s : %+.4f (p=%s) %s\\n",
              rownames(coefs)[i], coefs[i,1], format(coefs[i,4], scientific=TRUE, digits=2), sig))
}

cat("\\nR² :", round(s$r.squared, 4),
    "| R² ajusté :", round(s$adj.r.squared, 4),
    "| AIC :", round(AIC(model_full), 2), "\\n")

# Sélection automatique par AIC (stepwise)
cat("\\n--- Sélection automatique (stepwise AIC) ---\\n")
model_step <- step(model_full, direction = "both", trace = 0)
cat("Variables retenues :", paste(names(coef(model_step))[-1], collapse=", "), "\\n")
cat("AIC final :", round(AIC(model_step), 2), "\\n")`
      }
    ]
  },

  // ── MODULE 5 : Finance Quantitative ─────────────────────────────────────
  {
    title: 'Finance quantitative : portefeuille et risque',
    order: 6,
    duration: 45,
    content: 'Appliquez R à la gestion de portefeuille, au calcul du risque et à l\'optimisation.',
    contents: [
      {
        title: 'Théorie moderne du portefeuille (Markowitz)',
        contentType: 'code',
        order: 1,
        content: `# ── Théorie de Markowitz - Optimisation de Portefeuille ─────────────────

set.seed(42)
n_jours <- 252

# Simulation de 4 actifs
actifs <- list(
  BTC    = list(mu = 0.001,   sigma = 0.04),
  SPY    = list(mu = 0.0004,  sigma = 0.012),
  GOLD   = list(mu = 0.0002,  sigma = 0.008),
  BONDS  = list(mu = 0.0001,  sigma = 0.004)
)

# Générer les rendements
rendements <- sapply(actifs, function(a) rnorm(n_jours, a$mu, a$sigma))
colnames(rendements) <- names(actifs)

cat("=== ANALYSE INDIVIDUELLE DES ACTIFS ===\\n\\n")
cat(sprintf("%-8s | Rend. Ann. | Vol. Ann. | Sharpe\\n", "Actif"))
cat(rep("-", 45), "\\n", sep="")

rf <- 0.03 / 252

for (nom in colnames(rendements)) {
  r     <- rendements[, nom]
  mu    <- mean(r) * 252
  sigma <- sd(r) * sqrt(252)
  sharpe <- (mean(r) - rf) / sd(r) * sqrt(252)
  cat(sprintf("%-8s | %+7.2f%%   | %7.2f%%  | %6.3f\\n",
              nom, mu*100, sigma*100, sharpe))
}

# Matrice de corrélation
cat("\\n=== MATRICE DE CORRÉLATION ===\\n")
cor_mat <- round(cor(rendements), 3)
print(cor_mat)

# Portefeuille équipondéré
w_eq <- rep(0.25, 4)
r_port_eq <- rendements %*% w_eq
mu_port_eq <- mean(r_port_eq) * 252
sigma_port_eq <- sd(r_port_eq) * sqrt(252)
sharpe_eq <- (mean(r_port_eq) - rf) / sd(r_port_eq) * sqrt(252)

cat("\\n=== PORTEFEUILLE ÉQUIPONDÉRÉ (25% chaque) ===\\n")
cat(sprintf("Rendement annuel  : %+.2f%%\\n", mu_port_eq * 100))
cat(sprintf("Volatilité ann.   : %.2f%%\\n", sigma_port_eq * 100))
cat(sprintf("Sharpe Ratio      : %.3f\\n", sharpe_eq))
cat(sprintf("VaR 95%% (journal.): %.3f%%\\n",
            quantile(r_port_eq, 0.05) * 100))`
      },
      {
        title: 'Backtesting d\'une stratégie simple',
        contentType: 'code',
        order: 2,
        content: `# ── Backtesting : Stratégie Momentum ────────────────────────────────────

set.seed(2024)
n <- 500  # 2 ans de trading

# Simulation prix
r_daily <- rnorm(n, mean = 0.0003, sd = 0.015)
prix <- 100 * cumprod(1 + r_daily)

# Stratégie : Momentum 20 jours
# Acheter si prix > moyenne 20j, sinon cash
fenetre <- 20
ma20    <- filter(prix, rep(1/fenetre, fenetre), sides=1)

# Signaux de trading
signal <- rep(0, n)
for (i in (fenetre+1):n) {
  if (!is.na(ma20[i])) {
    signal[i] <- ifelse(prix[i] > ma20[i], 1, 0)  # 1=long, 0=cash
  }
}

# Rendements de la stratégie
r_strat  <- signal * r_daily    # on gagne seulement quand on est long
r_buyhold <- r_daily            # buy & hold classique

# Métriques
cat("==============================================\\n")
cat("   BACKTESTING : MOMENTUM vs BUY & HOLD      \\n")
cat("==============================================\\n\\n")

stats <- function(r, nom) {
  mu    <- mean(r, na.rm=TRUE) * 252
  sigma <- sd(r, na.rm=TRUE)   * sqrt(252)
  rf_j  <- 0.03/252
  sharpe <- (mean(r,na.rm=T) - rf_j) / sd(r,na.rm=T) * sqrt(252)
  cum_r  <- prod(1 + r, na.rm=TRUE) - 1
  prices  <- cumprod(1 + r)
  dd      <- min(prices / cummax(prices) - 1, na.rm=TRUE)

  cat(nom, "\\n")
  cat(sprintf("  Performance totale : %+.2f%%\\n", cum_r * 100))
  cat(sprintf("  Rendement annuel   : %+.2f%%\\n", mu * 100))
  cat(sprintf("  Volatilité ann.    : %.2f%%\\n",   sigma * 100))
  cat(sprintf("  Sharpe Ratio       : %.3f\\n",    sharpe))
  cat(sprintf("  Max Drawdown       : %.2f%%\\n\\n", dd * 100))
}

stats(r_strat,    "MOMENTUM 20j")
stats(r_buyhold,  "BUY & HOLD   ")`
      },
      {
        title: 'Séries temporelles et prévision',
        contentType: 'code',
        order: 3,
        content: `# ── Séries Temporelles avec R ───────────────────────────────────────────

set.seed(42)

# Simulation d'une série temporelle économique mensuelle
n_mois <- 120  # 10 ans

# Composantes : tendance + saisonnalité + bruit
tendance    <- 0.3 * (1:n_mois)
saisonnalite <- 5 * sin(2 * pi * (1:n_mois) / 12)
bruit       <- rnorm(n_mois, 0, 2)

# Série : ex. croissance de ventes
ventes <- 100 + tendance + saisonnalite + bruit

# Créer un objet ts (time series)
ts_ventes <- ts(ventes, start = c(2014, 1), frequency = 12)

cat("=== ANALYSE SÉRIE TEMPORELLE : VENTES ===\\n\\n")
cat("Période          :", start(ts_ventes), "à", end(ts_ventes), "\\n")
cat("Fréquence        : mensuelle\\n")
cat("Observations     :", length(ts_ventes), "\\n")
cat("Moyenne générale :", round(mean(ts_ventes), 2), "\\n")
cat("Tendance         : +0.3 unités/mois\\n")

# Décomposition STL
decomp <- decompose(ts_ventes)

cat("\\n--- Décomposition (Moyenne par composante) ---\\n")
cat("Tendance moy.   :", round(mean(decomp$trend, na.rm=TRUE), 2), "\\n")
cat("Saisonnalité max:", round(max(decomp$seasonal), 2),
    "| min:", round(min(decomp$seasonal), 2), "\\n")
cat("Résidus (sd)    :", round(sd(decomp$random, na.rm=TRUE), 3), "\\n")

# Prévision naïve : moyenne des 12 derniers mois
derniers_12 <- tail(as.numeric(ts_ventes), 12)
prev_6mois  <- mean(derniers_12)
cat("\\n--- Prévision (6 prochains mois) ---\\n")
cat("Méthode          : Moyenne mobile\\n")
cat("Prévision        :", round(prev_6mois, 2), "(± 2*sd)\\n")
cat("IC 95%           :", round(prev_6mois - 1.96*sd(derniers_12), 2),
    "à", round(prev_6mois + 1.96*sd(derniers_12), 2), "\\n")`
      }
    ]
  },

  // ── MODULE 6 : Projet Final ─────────────────────────────────────────────
  {
    title: 'Projet : Analyse complète d\'un portefeuille',
    order: 7,
    duration: 60,
    content: 'Projet intégrateur : construisez une analyse de portefeuille complète de A à Z.',
    contents: [
      {
        title: 'Projet guidé : Analyse de portefeuille complète',
        contentType: 'code',
        order: 1,
        content: `# ── PROJET FINAL : Analyse de Portefeuille Complète ─────────────────────
# Objectif : analyser un portefeuille 3 actifs et produire un rapport

set.seed(2025)
n <- 252

# ── 1. DONNÉES ───────────────────────────────────────────────────────────
actifs_data <- list(
  TECH   = list(mu=0.0008, sigma=0.022, poids=0.40),
  IMMO   = list(mu=0.0004, sigma=0.012, poids=0.35),
  OBLIG  = list(mu=0.0002, sigma=0.005, poids=0.25)
)

# Générer prix
prix_list <- lapply(actifs_data, function(a) {
  r <- rnorm(n, a$mu, a$sigma)
  list(prix=100*cumprod(1+r), rendements=r)
})

cat("══════════════════════════════════════════════════\\n")
cat("          RAPPORT D'ANALYSE DE PORTEFEUILLE       \\n")
cat("══════════════════════════════════════════════════\\n\\n")

# ── 2. STATISTIQUES INDIVIDUELLES ────────────────────────────────────────
cat("1. PERFORMANCE INDIVIDUELLE DES ACTIFS\\n")
cat("─────────────────────────────────────\\n")
rf <- 0.03/252

for (nom in names(actifs_data)) {
  r  <- prix_list[[nom]]$rendements
  p  <- prix_list[[nom]]$prix
  mu <- mean(r)*252
  sg <- sd(r)*sqrt(252)
  sh <- (mean(r)-rf)/sd(r)*sqrt(252)
  dd <- min(p/cummax(p)-1)*100

  cat(sprintf("\\n[%s] (poids: %.0f%%)\\n", nom, actifs_data[[nom]]$poids*100))
  cat(sprintf("  Perf. annuelle : %+.2f%%\\n", mu*100))
  cat(sprintf("  Volatilité     : %.2f%%\\n",  sg*100))
  cat(sprintf("  Sharpe         : %.3f\\n",    sh))
  cat(sprintf("  Max Drawdown   : %.2f%%\\n",  dd))
}

# ── 3. PORTEFEUILLE ───────────────────────────────────────────────────────
cat("\\n2. PERFORMANCE DU PORTEFEUILLE GLOBAL\\n")
cat("──────────────────────────────────────\\n")

poids <- sapply(actifs_data, function(a) a$poids)
rend_matrix <- sapply(prix_list, function(x) x$rendements)
r_port  <- rend_matrix %*% poids

mu_port  <- mean(r_port)*252
sg_port  <- sd(r_port)*sqrt(252)
sh_port  <- (mean(r_port)-rf)/sd(r_port)*sqrt(252)
var95    <- quantile(r_port, 0.05)*100
cvar95   <- mean(r_port[r_port <= quantile(r_port,0.05)])*100
prix_port <- cumprod(1+r_port)*100
dd_port  <- min(prix_port/cummax(prix_port)-1)*100
perf_tot <- (tail(prix_port,1)-100)

cat(sprintf("Rendement annuel : %+.2f%%\\n",  mu_port*100))
cat(sprintf("Volatilité ann.  : %.2f%%\\n",   sg_port*100))
cat(sprintf("Sharpe Ratio     : %.3f\\n",     sh_port))
cat(sprintf("VaR 95%%          : %.3f%%\\n",  var95))
cat(sprintf("CVaR 95%%         : %.3f%%\\n",  cvar95))
cat(sprintf("Max Drawdown     : %.2f%%\\n",   dd_port))
cat(sprintf("Performance 1 an : %+.2f%%\\n",  perf_tot))

cat("\\n3. CONCLUSION\\n")
cat("─────────────\\n")
note <- ifelse(sh_port > 1, "Excellent", ifelse(sh_port > 0.5, "Bon", "Moyen"))
cat(sprintf("Évaluation : %s (Sharpe = %.2f)\\n", note, sh_port))
cat("Rapport généré avec R 4.4.3 - Elsayf Platform\\n")`
      },
      {
        title: 'Ressources et prochaines étapes',
        contentType: 'text',
        order: 2,
        content: `# Félicitations — Vous avez terminé le cours R Statistics Finance !

## Ce que vous avez appris

✅ **Module 1** — Syntaxe R, vecteurs, data frames
✅ **Module 2** — Statistiques descriptives, tests d'hypothèses
✅ **Module 3** — Visualisation avec ggplot2
✅ **Module 4** — Régression linéaire simple et multiple
✅ **Module 5** — Finance quantitative, portefeuille, backtesting, séries temporelles
✅ **Module 6** — Projet intégrateur complet

## Prochaines étapes recommandées

### Packages à approfondir
- **tidyverse** : dplyr, tidyr, purrr, readr
- **quantmod** : données financières Yahoo Finance en temps réel
- **PerformanceAnalytics** : métriques de portefeuille avancées
- **forecast** / **fable** : prévisions ARIMA, ETS
- **caret** / **tidymodels** : machine learning

### Projets pratiques
1. Analyser le S&P 500 avec \`quantmod\`
2. Construire un modèle CAPM avec vos propres données
3. Créer un dashboard interactif avec **Shiny**
4. Implémenter un algorithme de trading algorithmique

### Ressources
- [CRAN Task View : Finance](https://cran.r-project.org/view=Finance)
- [R for Data Science (Hadley Wickham)](https://r4ds.had.co.nz/)
- Utilisez le **R IDE intégré** sur Elsayf pour pratiquer !

> 💡 **Conseil** : La pratique quotidienne avec de vraies données est la clé. Téléchargez des données sur Yahoo Finance et analysez-les avec les techniques apprises.`
      }
    ]
  }
];

async function main() {
  console.log('🚀 Création du contenu du cours R Statistics Finance...\n');

  // Supprimer les lessons existantes
  await prisma.lesson.deleteMany({ where: { courseId: COURSE_ID } });
  console.log('✓ Anciennes lessons supprimées');

  for (const lesson of lessons) {
    const { contents, ...lessonData } = lesson;

    const created = await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: COURSE_ID,
        contents: {
          create: contents.map(c => ({
            title: c.title,
            content: c.content,
            contentType: c.contentType,
            order: c.order,
          }))
        }
      }
    });

    console.log(`  ✓ Leçon ${lesson.order}: "${lesson.title}" (${contents.length} blocs)`);
  }

  // Mettre à jour les métadonnées du cours
  await prisma.course.update({
    where: { id: COURSE_ID },
    data: {
      description: 'Maîtrisez R pour les statistiques et la finance quantitative : de la syntaxe de base à l\'optimisation de portefeuille et au backtesting de stratégies.',
      level: 'Intermédiaire',
      duration: '15h',
    }
  });

  console.log('\n✅ Cours R Statistics Finance créé avec succès !');
  console.log(`   ${lessons.length} leçons | ${lessons.reduce((s,l) => s + l.contents.length, 0)} blocs de contenu`);
}

main()
  .catch(e => { console.error('❌ Erreur:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
