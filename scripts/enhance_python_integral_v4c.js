const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const lessonData = [
  {
    title: "Python Avancé — Astuces et Bonnes Pratiques",
    order: 15,
    duration: 65,
    content: "Vous maîtrisez maintenant les bases de Python. Il est temps de franchir le cap vers le code professionnel. Cette leçon couvre les constructions avancées qui caractérisent le code d'un développeur Python expérimenté : générateurs, décorateurs, type hints, context managers, et les idiomes qui rendent votre code non seulement fonctionnel, mais élégant, performant et maintenable.",
    extra: `## Les Générateurs — Économiser la Mémoire

\`\`\`python
# PROBLÈME : Une liste de 10 millions de carrés
# carres = [x**2 for x in range(10_000_000)]  # ~800 MB en mémoire !

# SOLUTION : Un générateur (calcule à la demande)
def generer_carres(n):
    for x in range(n):
        yield x**2  # yield au lieu de return

# Utilisation identique à une liste
gen = generer_carres(10_000_000)  # Pratiquement 0 mémoire !
print(next(gen))   # 0
print(next(gen))   # 1
print(next(gen))   # 4

# Parcourir avec for
for carre in generer_carres(5):
    print(carre)   # 0, 1, 4, 9, 16

# Generator expression (comme list comprehension, mais lazy)
gen_expr = (x**2 for x in range(10_000_000))  # Économe en mémoire

# Exemple concret : lire un gros fichier ligne par ligne
def lire_gros_fichier(chemin):
    with open(chemin, "r") as f:
        for ligne in f:
            yield ligne.strip()

# for ligne in lire_gros_fichier("10GB_logs.txt"):  # Ne charge pas tout !
#     traiter(ligne)
\`\`\`

---

## Les Décorateurs — Augmenter les Fonctions

\`\`\`python
import time
import functools

# 1. Décorateur de timing
def timer(func):
    @functools.wraps(func)  # Préserve les métadonnées de func
    def wrapper(*args, **kwargs):
        debut = time.perf_counter()
        resultat = func(*args, **kwargs)
        duree = time.perf_counter() - debut
        print(f"⏱  {func.__name__}() terminée en {duree:.4f}s")
        return resultat
    return wrapper

# 2. Décorateur de cache (mémoïsation)
def memoriser(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

# 3. Décorateur de retry (réessayer en cas d'erreur)
def retry(max_tentatives=3, delai=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for tentative in range(max_tentatives):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if tentative < max_tentatives - 1:
                        print(f"Tentative {tentative+1} échouée : {e}. Réessai...")
                        time.sleep(delai)
                    else:
                        raise
        return wrapper
    return decorator

# Utilisation
@timer
@memoriser
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(35))   # Rapide grâce au cache

@retry(max_tentatives=3, delai=0.5)
def appel_api_fragile():
    import random
    if random.random() < 0.7:
        raise ConnectionError("Timeout API")
    return "Données reçues !"

# Python intègre functools.lru_cache :
from functools import lru_cache

@lru_cache(maxsize=128)
def fib_lru(n):
    if n <= 1:
        return n
    return fib_lru(n-1) + fib_lru(n-2)
\`\`\`

---

## Les Type Hints — Code Auto-Documenté

\`\`\`python
from typing import List, Dict, Optional, Tuple, Union, Callable
from dataclasses import dataclass

# Sans type hints (ambigu)
def calculer_moyenne(notes):
    return sum(notes) / len(notes)

# Avec type hints (clair et vérifiable avec mypy)
def calculer_moyenne(notes: List[float]) -> float:
    return sum(notes) / len(notes)

# Types complexes
def analyser_etudiants(
    donnees: List[Dict[str, Union[str, float]]],
    seuil: float = 10.0,
    formateur: Optional[str] = None
) -> Tuple[List[str], List[str]]:
    admis = [d["nom"] for d in donnees if d["note"] >= seuil]
    recales = [d["nom"] for d in donnees if d["note"] < seuil]
    return admis, recales

# Dataclasses — Créer des classes simples sans boilerplate
@dataclass
class Etudiant:
    nom: str
    age: int
    notes: List[float]
    ville: str = "Paris"  # Valeur par défaut

    def moyenne(self) -> float:
        return sum(self.notes) / len(self.notes)

    def est_admis(self, seuil: float = 10.0) -> bool:
        return self.moyenne() >= seuil

# Utilisation
e = Etudiant("Alice", 23, [14, 17, 15, 18])
print(e)              # Etudiant(nom='Alice', age=23, ...)
print(e.moyenne())    # 16.0
print(e.est_admis())  # True
\`\`\`

---

## Idiomes Python Avancés

\`\`\`python
# 1. Unpacking avancé
premier, *reste, dernier = [1, 2, 3, 4, 5]
print(premier, reste, dernier)  # 1 [2, 3, 4] 5

a, b, *_ = (10, 20, 30, 40, 50)  # Ignorer le reste
print(a, b)  # 10 20

# 2. Walrus operator := (Python 3.8+) — Assigner et tester
donnees = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
if (n = len(donnees)) > 5:
    print(f"Grande liste : {n} éléments")

# Dans une boucle
import re
textes = ["Email: alice@test.com", "Pas d'email ici", "Contact: bob@demo.fr"]
for texte in textes:
    if match := re.search(r'[\\w.]+@[\\w.]+', texte):
        print(f"Email trouvé : {match.group()}")

# 3. Compréhensions avancées
# Dict comprehension avec condition
notes = {"Alice": 18, "Bob": 9, "Charlie": 14, "Diana": 11}
admis_dict = {nom: note for nom, note in notes.items() if note >= 10}

# Set comprehension
voyelles_uniques = {c for c in "python est génial" if c in "aeiouy"}

# 4. Context managers personnalisés
from contextlib import contextmanager

@contextmanager
def connexion_base(url: str):
    print(f"Connexion à {url}")
    conn = {"status": "open", "url": url}  # Simule une connexion
    try:
        yield conn
    except Exception as e:
        print(f"Erreur : rollback !")
        raise
    finally:
        conn["status"] = "closed"
        print("Connexion fermée proprement")

with connexion_base("postgresql://localhost/madb") as conn:
    print(f"Requête sur {conn['url']}")
    # conn.execute("SELECT ...")
\`\`\`

---

## Performance et Profiling

\`\`\`python
import timeit
import cProfile

# Comparer deux approches
# Approche 1 : Boucle classique
def somme_boucle(n):
    total = 0
    for i in range(n):
        total += i
    return total

# Approche 2 : Built-in (optimisé en C)
def somme_builtin(n):
    return sum(range(n))

# Approche 3 : Formule mathématique
def somme_formule(n):
    return n * (n - 1) // 2

# Benchmarking
n = 100_000
t1 = timeit.timeit(lambda: somme_boucle(n), number=100)
t2 = timeit.timeit(lambda: somme_builtin(n), number=100)
t3 = timeit.timeit(lambda: somme_formule(n), number=100)

print(f"Boucle  : {t1:.3f}s")
print(f"Built-in: {t2:.3f}s (x{t1/t2:.1f} plus rapide)")
print(f"Formule : {t3:.6f}s (x{t1/t3:.0f} plus rapide)")

# Profiler une fonction complète
# cProfile.run('ma_fonction_lente()')
\`\`\`

> [!TIP]
> La règle d'or de l'optimisation : **"Premature optimization is the root of all evil"** (Donald Knuth). Faites d'abord fonctionner votre code correctement, puis profilez pour trouver les vrais goulots d'étranglement avant d'optimiser.

---

## Les Modules Avancés de la Standard Library

\`\`\`python
# itertools — Outils d'itération puissants
from itertools import chain, combinations, permutations, product, groupby

# Chaîner des iterables
for elem in chain([1,2], [3,4], [5,6]):
    print(elem, end=" ")  # 1 2 3 4 5 6

# Combinaisons et permutations
print(list(combinations("ABCD", 2)))
# [('A','B'), ('A','C'), ('A','D'), ('B','C'), ('B','D'), ('C','D')]

print(list(permutations([1,2,3])))
# [(1,2,3), (1,3,2), (2,1,3), ...]

# functools
from functools import reduce, partial

# reduce — appliquer une fonction cumulativement
produit = reduce(lambda x, y: x * y, [1, 2, 3, 4, 5])
print(produit)  # 120

# partial — créer des fonctions spécialisées
def puissance(base, exposant):
    return base ** exposant

carre = partial(puissance, exposant=2)
cube = partial(puissance, exposant=3)
print(carre(5), cube(3))  # 25 27
\``
  },
  {
    title: "Web Scraping avec BeautifulSoup",
    order: 16,
    duration: 75,
    content: "Internet contient des quantités astronomiques de données publiques — prix de produits, articles de presse, données météo, profils LinkedIn, offres d'emploi... Le Web Scraping est l'art d'extraire ces données automatiquement pour les analyser. C'est une compétence très recherchée en Data Science et en marketing digital. Dans cette leçon, vous maîtriserez les deux outils rois du scraping en Python : Requests et BeautifulSoup.",
    extra: `## Installation

\`\`\`bash
pip install requests beautifulsoup4 lxml
\`\`\`

---

## Les Bases : Requêtes HTTP avec Requests

\`\`\`python
import requests

# Requête GET simple
response = requests.get("https://httpbin.org/get")

# Informations sur la réponse
print(f"Status Code : {response.status_code}")  # 200 = OK
print(f"Content-Type : {response.headers['Content-Type']}")
print(f"Taille : {len(response.content)} octets")

# Codes de statut importants :
# 200 OK, 301/302 Redirection, 403 Interdit, 404 Introuvable, 429 Trop de requêtes, 500 Erreur serveur

# Toujours vérifier le statut
response = requests.get("https://httpbin.org/json")
response.raise_for_status()  # Lève une exception si erreur HTTP

# Récupérer du JSON
data = response.json()
print(data)

# Passer des paramètres dans l'URL
params = {"q": "python data science", "lang": "fr", "page": 1}
r = requests.get("https://httpbin.org/get", params=params)
print(r.url)  # URL avec paramètres ajoutés automatiquement

# Headers personnalisés (simuler un navigateur)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9"
}
r = requests.get("https://httpbin.org/headers", headers=headers)

# Session (réutilise la connexion, maintient les cookies)
with requests.Session() as session:
    session.headers.update(headers)
    r1 = session.get("https://httpbin.org/cookies/set?user=alice")
    r2 = session.get("https://httpbin.org/cookies")
    print(r2.json())  # Les cookies sont conservés
\`\`\`

---

## Parser le HTML avec BeautifulSoup

\`\`\`python
from bs4 import BeautifulSoup
import requests

# HTML d'exemple
html = """
<html>
<head><title>Catalogue Produits</title></head>
<body>
  <h1 class="titre-principal">Notre Catalogue</h1>
  <div class="produits">
    <article class="produit" data-id="1">
      <h2 class="nom">Laptop Pro 15"</h2>
      <span class="prix">1299.99</span>
      <span class="stock">En stock</span>
      <ul class="tags"><li>Informatique</li><li>Premium</li></ul>
    </article>
    <article class="produit" data-id="2">
      <h2 class="nom">Souris Sans Fil</h2>
      <span class="prix">39.95</span>
      <span class="stock">Rupture de stock</span>
      <ul class="tags"><li>Accessoire</li></ul>
    </article>
    <article class="produit" data-id="3">
      <h2 class="nom">Clavier Mécanique</h2>
      <span class="prix">149.00</span>
      <span class="stock">En stock</span>
      <ul class="tags"><li>Accessoire</li><li>Gaming</li></ul>
    </article>
  </div>
  <a href="/page/2" class="suivant">Page suivante</a>
</body>
</html>
"""

soup = BeautifulSoup(html, "lxml")

# Trouver des éléments
titre = soup.find("h1")
print(titre.text)  # "Notre Catalogue"

# Trouver par classe CSS
tous_produits = soup.find_all("article", class_="produit")
print(f"{len(tous_produits)} produits trouvés")

# Naviguer dans le DOM
premier_produit = tous_produits[0]
print(premier_produit.find("h2").text)     # Laptop Pro 15"
print(premier_produit.find("span", class_="prix").text)  # 1299.99
print(premier_produit["data-id"])          # 1 (attribut)

# Sélecteurs CSS (très puissants !)
noms = soup.select("article.produit h2.nom")
for nom in noms:
    print(nom.text)

# Extraire tous les liens
liens = soup.find_all("a")
for lien in liens:
    print(f"Texte: {lien.text} | URL: {lien.get('href')}")
\`\`\`

---

## Projet Complet : Scraper un Site de Citations

\`\`\`python
import requests
from bs4 import BeautifulSoup
import csv
import time
import random

def scraper_citations(nb_pages=3):
    """
    Scrape des citations depuis quotes.toscrape.com
    (Site conçu pour pratiquer le scraping légalement)
    """
    base_url = "https://quotes.toscrape.com"
    toutes_citations = []

    for page in range(1, nb_pages + 1):
        url = f"{base_url}/page/{page}/"
        print(f"Scraping page {page}...")

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            # Extraire les citations
            citations = soup.find_all("div", class_="quote")

            for citation in citations:
                texte = citation.find("span", class_="text").text
                auteur = citation.find("small", class_="author").text
                tags = [tag.text for tag in citation.find_all("a", class_="tag")]

                toutes_citations.append({
                    "texte": texte.strip('"'),
                    "auteur": auteur,
                    "tags": ", ".join(tags),
                    "page": page
                })

            # Politesse : attendre entre les requêtes
            delai = random.uniform(1, 2)
            print(f"  {len(citations)} citations trouvées. Attente {delai:.1f}s...")
            time.sleep(delai)

        except requests.exceptions.RequestException as e:
            print(f"Erreur page {page}: {e}")
            continue

    return toutes_citations

def sauvegarder_csv(citations, fichier="citations.csv"):
    if not citations:
        print("Aucune citation à sauvegarder")
        return

    with open(fichier, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["texte", "auteur", "tags", "page"])
        writer.writeheader()
        writer.writerows(citations)

    print(f"\\n✅ {len(citations)} citations sauvegardées dans '{fichier}'")

# Lancer le scraping
# citations = scraper_citations(nb_pages=3)
# sauvegarder_csv(citations)

# Analyse rapide
# import pandas as pd
# df = pd.read_csv("citations.csv")
# print(df["auteur"].value_counts().head(10))
\`\`\`

---

## Scraping Avancé : Gestion des Paginations et Anti-Scraping

\`\`\`python
import requests
from bs4 import BeautifulSoup
import time
import random

def scraper_avec_pagination(url_depart, max_pages=10):
    """Scraper qui suit automatiquement la pagination."""
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (compatible; DataBot/1.0)"
    })

    resultats = []
    url_actuelle = url_depart
    page = 0

    while url_actuelle and page < max_pages:
        page += 1
        try:
            r = session.get(url_actuelle, timeout=15)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "lxml")

            # Extraire les données de cette page
            elements = soup.find_all("div", class_="item")  # Adapter selon le site
            for elem in elements:
                resultats.append({
                    "titre": elem.find("h2").text if elem.find("h2") else "",
                    "url": url_actuelle
                })

            # Trouver le lien "Page suivante"
            suivant = soup.find("a", {"rel": "next"}) or soup.find("a", class_="next")
            if suivant:
                url_actuelle = suivant.get("href")
                if not url_actuelle.startswith("http"):
                    from urllib.parse import urljoin
                    url_actuelle = urljoin(url_depart, url_actuelle)
            else:
                url_actuelle = None

            time.sleep(random.uniform(1, 3))

        except Exception as e:
            print(f"Erreur page {page}: {e}")
            break

    return resultats

# Outils anti-détection (pour usage éthique uniquement)
import random

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
]

def obtenir_headers_aleatoires():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    }
\`\`\`

> [!WARNING]
> **Éthique du Web Scraping** : Vérifiez toujours le fichier \`robots.txt\` (ex: \`https://site.com/robots.txt\`) et les CGU avant de scraper. Respectez les délais entre les requêtes, ne surchargez pas les serveurs, et n'utilisez pas les données à des fins commerciales sans autorisation.

> [!TIP]
> Pour les sites qui chargent leur contenu en JavaScript (Single Page Applications), BeautifulSoup ne suffira pas. Utilisez **Playwright** ou **Selenium** pour piloter un vrai navigateur.`
  },
  {
    title: "Travailler avec les APIs",
    order: 17,
    duration: 70,
    content: "Les APIs (Application Programming Interfaces) sont les autoroutes de l'internet moderne. Elles permettent à vos programmes Python de communiquer avec des services externes : récupérer la météo, envoyer des SMS, accéder aux données financières, utiliser l'IA de OpenAI... Comprendre comment consommer et créer des APIs REST est une compétence fondamentale pour tout développeur ou Data Scientist.",
    extra: `## Les Concepts Fondamentaux des APIs REST

### Architecture REST
\`\`\`
Client (Python)  ←→  Internet  ←→  Serveur API
      GET /users/123           →   { "id": 123, "nom": "Alice" }
      POST /users + données    →   201 Created
      PUT /users/123 + données →   200 OK
      DELETE /users/123        →   204 No Content
\`\`\`

### Codes de Statut HTTP
\`\`\`
2xx Succès    : 200 OK, 201 Created, 204 No Content
3xx Redirect  : 301 Moved Permanently, 302 Found
4xx Erreur    : 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests
5xx Serveur   : 500 Internal Server Error, 503 Service Unavailable
\`\`\`

---

## Consommer une API Publique — Exemples Réels

### API Météo (OpenWeatherMap)
\`\`\`python
import requests
import json
from datetime import datetime

# Configuration (remplacez par votre clé sur openweathermap.org)
API_KEY = "votre_cle_api_ici"
BASE_URL = "https://api.openweathermap.org/data/2.5"

def obtenir_meteo(ville: str) -> dict:
    """Récupère la météo actuelle pour une ville."""
    url = f"{BASE_URL}/weather"
    params = {
        "q": ville,
        "appid": API_KEY,
        "units": "metric",  # Celsius
        "lang": "fr"
    }

    response = requests.get(url, params=params, timeout=10)

    if response.status_code == 404:
        raise ValueError(f"Ville '{ville}' non trouvée")
    elif response.status_code == 401:
        raise PermissionError("Clé API invalide")

    response.raise_for_status()
    return response.json()

def afficher_meteo(ville: str):
    try:
        data = obtenir_meteo(ville)
        print(f"\\n🌍 Météo à {data['name']}, {data['sys']['country']}")
        print(f"🌡️  Température : {data['main']['temp']:.1f}°C")
        print(f"💧 Humidité : {data['main']['humidity']}%")
        print(f"💨 Vent : {data['wind']['speed']} m/s")
        print(f"☁️  Conditions : {data['weather'][0]['description'].capitalize()}")

        lever = datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M')
        coucher = datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M')
        print(f"🌅 Lever/Coucher du soleil : {lever} / {coucher}")

    except Exception as e:
        print(f"Erreur : {e}")

# afficher_meteo("Paris")
# afficher_meteo("Alger")
\`\`\`

### API JSONPlaceholder (Tests sans inscription)
\`\`\`python
import requests

BASE = "https://jsonplaceholder.typicode.com"

# GET — Lire des ressources
r = requests.get(f"{BASE}/users/1")
user = r.json()
print(f"Utilisateur : {user['name']} ({user['email']})")

# Lister tous les posts d'un utilisateur
r = requests.get(f"{BASE}/posts", params={"userId": 1})
posts = r.json()
print(f"\\n{len(posts)} posts de {user['name']}:")
for post in posts[:3]:
    print(f"  - {post['title'][:50]}...")

# POST — Créer une ressource
nouveau_post = {
    "title": "Mon article sur Python",
    "body": "Python est un langage fantastique pour l'automatisation et la data science.",
    "userId": 1
}
r = requests.post(f"{BASE}/posts", json=nouveau_post)
print(f"\\nPost créé (status {r.status_code}) :")
print(json.dumps(r.json(), indent=2, ensure_ascii=False))

# PUT — Modifier une ressource
maj = {"id": 1, "title": "Titre modifié", "body": "Contenu mis à jour", "userId": 1}
r = requests.put(f"{BASE}/posts/1", json=maj)
print(f"Modification : {r.status_code}")

# DELETE — Supprimer
r = requests.delete(f"{BASE}/posts/1")
print(f"Suppression : {r.status_code}")  # 200
\`\`\`

---

## Authentification et Sécurité

\`\`\`python
import requests
import os

# 1. API Key dans les headers (méthode la plus courante)
headers = {
    "Authorization": "Bearer votre_token_jwt",
    "X-API-Key": "votre_cle_api"
}
r = requests.get("https://api.exemple.com/data", headers=headers)

# 2. API Key dans l'URL (moins sécurisé)
r = requests.get("https://api.exemple.com/data?api_key=MA_CLE")

# 3. HTTP Basic Auth
r = requests.get("https://api.exemple.com/", auth=("user", "password"))

# BONNE PRATIQUE : Stocker les clés dans les variables d'environnement
import os
from dotenv import load_dotenv  # pip install python-dotenv

load_dotenv()  # Charge le fichier .env
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise EnvironmentError("Variable OPENAI_API_KEY non définie !")

# Fichier .env (NE JAMAIS committer sur Git !) :
# OPENAI_API_KEY=sk-...
# WEATHER_API_KEY=abc123
\`\`\`

---

## Gestion des Limites et Robustesse

\`\`\`python
import requests
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def creer_session_robuste() -> requests.Session:
    """Crée une session avec retry automatique."""
    session = requests.Session()

    # Retry automatique sur erreurs réseau et 5xx
    retry = Retry(
        total=3,               # 3 tentatives maximum
        backoff_factor=0.5,    # Attente exponentielle : 0.5s, 1s, 2s
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["GET", "POST"]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    session.headers.update({"User-Agent": "MonApp/1.0"})
    return session

def appel_api_avec_rate_limit(urls: list, requetes_par_seconde: int = 2):
    """Appelle plusieurs URLs en respectant la limite de taux."""
    session = creer_session_robuste()
    resultats = []
    intervalle = 1 / requetes_par_seconde

    for url in urls:
        debut = time.time()
        try:
            r = session.get(url, timeout=10)
            r.raise_for_status()
            resultats.append({"url": url, "data": r.json(), "status": "ok"})
        except requests.exceptions.RequestException as e:
            resultats.append({"url": url, "error": str(e), "status": "error"})

        # Respecter le rate limit
        elapsed = time.time() - debut
        if elapsed < intervalle:
            time.sleep(intervalle - elapsed)

    return resultats
\`\`\`

---

## Créer sa Propre API avec Flask

\`\`\`python
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Base de données en mémoire (pour l'exemple)
etudiants = {
    1: {"id": 1, "nom": "Alice", "note": 18},
    2: {"id": 2, "nom": "Bob", "note": 15},
}
next_id = 3

@app.route("/api/etudiants", methods=["GET"])
def lister_etudiants():
    """GET /api/etudiants — Retourne tous les étudiants."""
    filtres = request.args
    resultat = list(etudiants.values())

    if "note_min" in filtres:
        resultat = [e for e in resultat if e["note"] >= int(filtres["note_min"])]

    return jsonify({"data": resultat, "total": len(resultat)})

@app.route("/api/etudiants/<int:id>", methods=["GET"])
def obtenir_etudiant(id):
    """GET /api/etudiants/1 — Retourne un étudiant par ID."""
    etudiant = etudiants.get(id)
    if not etudiant:
        return jsonify({"error": f"Étudiant #{id} non trouvé"}), 404
    return jsonify(etudiant)

@app.route("/api/etudiants", methods=["POST"])
def creer_etudiant():
    """POST /api/etudiants — Crée un nouvel étudiant."""
    global next_id
    data = request.get_json()
    if not data or "nom" not in data or "note" not in data:
        return jsonify({"error": "Champs 'nom' et 'note' requis"}), 400
    if not (0 <= data["note"] <= 20):
        return jsonify({"error": "La note doit être entre 0 et 20"}), 400

    nouvel_etudiant = {"id": next_id, "nom": data["nom"], "note": data["note"]}
    etudiants[next_id] = nouvel_etudiant
    next_id += 1
    return jsonify(nouvel_etudiant), 201

@app.route("/api/etudiants/<int:id>", methods=["DELETE"])
def supprimer_etudiant(id):
    if id not in etudiants:
        return jsonify({"error": "Non trouvé"}), 404
    del etudiants[id]
    return "", 204

if __name__ == "__main__":
    app.run(debug=True, port=5000)
\`\`\`

> [!NOTE]
> Testez vos APIs avec **Postman** (interface graphique) ou **httpie** en ligne de commande : \`http GET localhost:5000/api/etudiants\`. Pour Python, la bibliothèque **httpx** est une excellente alternative moderne à requests.`
  },
  {
    title: "Automatisation Excel & Rapports",
    order: 18,
    duration: 65,
    content: "L'automatisation des tâches bureautiques est l'une des applications les plus rentables de Python en entreprise. Imaginez : générer 200 rapports Excel personnalisés en quelques secondes, fusionner des dizaines de fichiers CSV automatiquement, ou envoyer des emails avec des rapports attachés. Ce qui prenait des heures chaque semaine peut être réduit à un script qui tourne en arrière-plan.",
    extra: `## Installation des Bibliothèques

\`\`\`bash
pip install openpyxl xlrd pandas reportlab schedule
\`\`\`

---

## Lire et Analyser des fichiers Excel avec Pandas

\`\`\`python
import pandas as pd
import numpy as np

# Lire un fichier Excel multi-feuilles
fichier = "rapport_ventes.xlsx"

# Lister les feuilles
xl = pd.ExcelFile(fichier)
print(f"Feuilles disponibles : {xl.sheet_names}")

# Lire une feuille spécifique
df = pd.read_excel(fichier, sheet_name="Ventes 2024",
                   usecols=["Date", "Produit", "Quantite", "Prix", "Ville"],
                   parse_dates=["Date"])

# Lire toutes les feuilles dans un dict de DataFrames
tous_df = pd.read_excel(fichier, sheet_name=None)  # None = toutes les feuilles
for nom_feuille, df_feuille in tous_df.items():
    print(f"{nom_feuille}: {len(df_feuille)} lignes")

# Combiner toutes les feuilles
df_complet = pd.concat(tous_df.values(), ignore_index=True)
\`\`\`

---

## Créer des Rapports Excel Formatés avec openpyxl

\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import (Font, PatternFill, Alignment, Border,
                              Side, numbers)
from openpyxl.chart import BarChart, Reference
from openpyxl.utils.dataframe import dataframe_to_rows
import pandas as pd
from datetime import datetime

def generer_rapport_excel(df: pd.DataFrame, fichier_sortie: str):
    """Génère un rapport Excel professionnel avec mise en forme."""
    wb = Workbook()

    # =========================================
    # FEUILLE 1 : Données brutes formatées
    # =========================================
    ws_data = wb.active
    ws_data.title = "Données"

    # En-tête stylisé
    style_entete = {
        "font": Font(bold=True, color="FFFFFF", size=11),
        "fill": PatternFill("solid", fgColor="2C3E50"),
        "alignment": Alignment(horizontal="center", vertical="center"),
        "border": Border(
            bottom=Side(style="medium", color="1ABC9C")
        )
    }

    entetes = ["Date", "Produit", "Catégorie", "Quantité", "Prix Unit.", "CA"]
    for col, titre in enumerate(entetes, 1):
        cell = ws_data.cell(row=1, column=col, value=titre)
        for prop, val in style_entete.items():
            setattr(cell, prop, val)

    ws_data.row_dimensions[1].height = 30

    # Styles alternatifs pour les lignes
    style_pair = PatternFill("solid", fgColor="ECF0F1")
    style_impair = PatternFill("solid", fgColor="FFFFFF")

    for row_idx, row in enumerate(dataframe_to_rows(df, index=False, header=False), 2):
        for col_idx, value in enumerate(row, 1):
            cell = ws_data.cell(row=row_idx, column=col_idx, value=value)
            cell.fill = style_pair if row_idx % 2 == 0 else style_impair
            cell.alignment = Alignment(horizontal="center")

            # Formater les montants en euros
            if col_idx in [5, 6]:
                cell.number_format = '#,##0.00 "€"'

    # Ajuster la largeur des colonnes
    largeurs = [15, 25, 20, 12, 15, 15]
    for col, largeur in enumerate(largeurs, 1):
        ws_data.column_dimensions[chr(64+col)].width = largeur

    # Figer les volets (header toujours visible)
    ws_data.freeze_panes = "A2"

    # Filtre automatique
    ws_data.auto_filter.ref = ws_data.dimensions

    # =========================================
    # FEUILLE 2 : Tableau de synthèse
    # =========================================
    ws_synth = wb.create_sheet("Synthèse")

    # Titre principal
    ws_synth["A1"] = "RAPPORT DE SYNTHÈSE DES VENTES"
    ws_synth["A1"].font = Font(bold=True, size=16, color="2C3E50")
    ws_synth["A2"] = f"Généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
    ws_synth["A2"].font = Font(italic=True, color="7F8C8D")
    ws_synth.merge_cells("A1:F1")

    # KPIs
    kpis = [
        ("CA Total", f'{df["CA"].sum():,.0f}€'),
        ("Commandes", len(df)),
        ("Panier Moyen", f'{df["CA"].mean():,.0f}€'),
        ("Top Produit", df.groupby("Produit")["CA"].sum().idxmax()),
    ]

    for i, (label, valeur) in enumerate(kpis, 4):
        ws_synth.cell(row=i, column=1, value=label).font = Font(bold=True)
        ws_synth.cell(row=i, column=2, value=str(valeur))

    # Graphique intégré
    if "Categorie" in df.columns:
        cat_ca = df.groupby("Categorie")["CA"].sum()

        row_start = 10
        ws_synth.cell(row=row_start, column=1, value="Catégorie").font = Font(bold=True)
        ws_synth.cell(row=row_start, column=2, value="CA (€)").font = Font(bold=True)
        for i, (cat, ca) in enumerate(cat_ca.items(), row_start + 1):
            ws_synth.cell(row=i, column=1, value=cat)
            ws_synth.cell(row=i, column=2, value=ca).number_format = '#,##0.00'

        chart = BarChart()
        chart.title = "Chiffre d'Affaires par Catégorie"
        chart.style = 10
        chart.width = 15
        chart.height = 10

        data_ref = Reference(ws_synth, min_col=2, min_row=row_start,
                             max_row=row_start + len(cat_ca))
        cats_ref = Reference(ws_synth, min_col=1, min_row=row_start + 1,
                             max_row=row_start + len(cat_ca))

        chart.add_data(data_ref, titles_from_data=True)
        chart.set_categories(cats_ref)
        ws_synth.add_chart(chart, "D10")

    wb.save(fichier_sortie)
    print(f"✅ Rapport '{fichier_sortie}' généré avec succès!")

# Exemple d'utilisation
df_exemple = pd.DataFrame({
    "Date": pd.date_range("2024-01-01", periods=20),
    "Produit": ["Laptop", "Souris", "Clavier"] * 6 + ["Écran", "Webcam"],
    "Categorie": ["Informatique"] * 20,
    "Quantite": range(1, 21),
    "Prix": [999, 29, 89] * 6 + [349, 79],
    "CA": range(1000, 21000, 1000)
})

# generer_rapport_excel(df_exemple, "rapport_2024.xlsx")
\`\`\`

---

## Automatiser la Génération de Rapports par Email

\`\`\`python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os

def envoyer_rapport_email(
    destinataire: str,
    sujet: str,
    corps: str,
    fichier_joint: str,
    expediteur: str,
    mot_de_passe: str
):
    """Envoie un rapport Excel par email."""
    msg = MIMEMultipart()
    msg["From"] = expediteur
    msg["To"] = destinataire
    msg["Subject"] = sujet

    # Corps du message HTML
    corps_html = f"""
    <html><body>
    <h2 style="color: #2C3E50;">Rapport Automatique</h2>
    <p>{corps}</p>
    <p style="color: #7F8C8D; font-size: 12px;">
        Ce rapport a été généré automatiquement par le système Python.
    </p>
    </body></html>
    """
    msg.attach(MIMEText(corps_html, "html"))

    # Pièce jointe
    if os.path.exists(fichier_joint):
        with open(fichier_joint, "rb") as f:
            piece_jointe = MIMEBase("application", "octet-stream")
            piece_jointe.set_payload(f.read())
            encoders.encode_base64(piece_jointe)
            piece_jointe.add_header(
                "Content-Disposition",
                f'attachment; filename="{os.path.basename(fichier_joint)}"'
            )
            msg.attach(piece_jointe)

    # Envoi via Gmail (utilisez un App Password)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as serveur:
        serveur.login(expediteur, mot_de_passe)
        serveur.sendmail(expediteur, destinataire, msg.as_string())

    print(f"✅ Email envoyé à {destinataire}")

# Planifier l'envoi automatique chaque lundi
import schedule
import time

def tache_rapport_hebdomadaire():
    print("Génération du rapport hebdomadaire...")
    # generer_rapport_excel(obtenir_donnees_semaine(), "rapport_semaine.xlsx")
    # envoyer_rapport_email("directeur@entreprise.com", "Rapport Hebdo", ...)

# schedule.every().monday.at("08:00").do(tache_rapport_hebdomadaire)
# while True:
#     schedule.run_pending()
#     time.sleep(60)
\`\`\`

> [!TIP]
> Combinez **openpyxl** pour la mise en forme avancée et **pandas** pour les calculs. Utilisez pandas pour préparer vos données, puis openpyxl pour créer des rapports visuellement soignés.

> [!NOTE]
> Pour les très gros fichiers Excel (+100k lignes), utilisez le mode d'écriture optimisé d'openpyxl : \`wb = Workbook(write_only=True)\` — il consomme beaucoup moins de mémoire.`
  },
  {
    title: "Introduction au Web Dev avec Flask",
    order: 19,
    duration: 75,
    content: "Avec Flask, Python devient un outil de développement web à part entière. Ce micro-framework minimaliste vous permet de créer des applications web, des APIs REST, des tableaux de bord interactifs ou des outils internes en très peu de code. Flask est parfait pour les projets Data Science qui nécessitent une interface utilisateur — exposez vos modèles ML, créez des dashboards, ou construisez des APIs pour partager vos analyses.",
    extra: `## Installation et Premier Serveur

\`\`\`bash
pip install flask flask-sqlalchemy flask-cors
\`\`\`

\`\`\`python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def accueil():
    return "Bienvenue sur mon API Python !"

@app.route("/saluer/<nom>")
def saluer(nom):
    return f"Bonjour, {nom} !"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    # Accédez à http://127.0.0.1:5000
\`\`\`

---

## Le Routing — Définir les URLs

\`\`\`python
from flask import Flask, request, jsonify, abort

app = Flask(__name__)

# Routes avec types de paramètres
@app.route("/users/<int:user_id>")
def get_user(user_id):
    return jsonify({"id": user_id, "nom": "Alice"})

@app.route("/produits/<string:slug>")
def get_produit(slug):
    return jsonify({"slug": slug})

# Méthodes HTTP multiples
@app.route("/api/notes", methods=["GET", "POST"])
def gerer_notes():
    if request.method == "GET":
        # Paramètres de query string : /api/notes?min=10&max=20
        note_min = request.args.get("min", type=int, default=0)
        note_max = request.args.get("max", type=int, default=20)
        return jsonify({"filtre": f"{note_min}-{note_max}"})

    elif request.method == "POST":
        data = request.get_json()
        if not data:
            abort(400, description="Corps JSON requis")
        return jsonify({"message": "Note ajoutée", "data": data}), 201

# Gestion des erreurs
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Ressource non trouvée", "code": 404}), 404

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": str(e.description), "code": 400}), 400
\`\`\`

---

## Templates Jinja2 — Pages HTML Dynamiques

\`\`\`python
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/dashboard")
def dashboard():
    donnees = {
        "titre": "Tableau de Bord",
        "stats": {
            "utilisateurs": 1250,
            "commandes": 3847,
            "ca_mensuel": 42580.50
        },
        "top_produits": [
            {"nom": "Laptop Pro", "ventes": 142, "ca": 184898},
            {"nom": "Clavier Meca", "ventes": 289, "ca": 43061},
            {"nom": "Souris Sans Fil", "ventes": 512, "ca": 20454},
        ]
    }
    return render_template("dashboard.html", **donnees)
\`\`\`

\`\`\`html
<!-- templates/dashboard.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{{ titre }}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: auto; padding: 20px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-card { background: #3498db; color: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; }
        .stat-card h2 { margin: 0; font-size: 2em; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #2c3e50; color: white; }
        tr:hover { background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>{{ titre }}</h1>
    <p>Généré le {{ now().strftime('%d/%m/%Y') if now is defined else '' }}</p>

    <div class="stats">
        <div class="stat-card">
            <h2>{{ "{:,}".format(stats.utilisateurs) }}</h2>
            <p>Utilisateurs</p>
        </div>
        <div class="stat-card">
            <h2>{{ "{:,}".format(stats.commandes) }}</h2>
            <p>Commandes</p>
        </div>
        <div class="stat-card">
            <h2>{{ "{:,.0f}€".format(stats.ca_mensuel) }}</h2>
            <p>CA Mensuel</p>
        </div>
    </div>

    <h2>Top Produits</h2>
    <table>
        <tr><th>Produit</th><th>Ventes</th><th>CA (€)</th></tr>
        {% for produit in top_produits %}
        <tr>
            <td>{{ produit.nom }}</td>
            <td>{{ produit.ventes }}</td>
            <td>{{ "{:,.0f}".format(produit.ca) }}€</td>
        </tr>
        {% endfor %}
    </table>
</body>
</html>
\`\`\`

---

## API REST Complète avec Base de Données

\`\`\`python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///formation.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)  # Autoriser les requêtes cross-origin

# Modèle de données
class Etudiant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    note = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "email": self.email,
            "note": self.note,
            "inscrit_le": self.created_at.isoformat()
        }

# Créer les tables
with app.app_context():
    db.create_all()

# CRUD complet
@app.route("/api/etudiants", methods=["GET"])
def lister():
    page = request.args.get("page", 1, type=int)
    par_page = request.args.get("par_page", 10, type=int)
    note_min = request.args.get("note_min", 0, type=float)

    query = Etudiant.query.filter(Etudiant.note >= note_min)
    pagination = query.order_by(Etudiant.note.desc()).paginate(
        page=page, per_page=par_page, error_out=False
    )

    return jsonify({
        "data": [e.to_dict() for e in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages
    })

@app.route("/api/etudiants", methods=["POST"])
def creer():
    data = request.get_json()
    if not data or not all(k in data for k in ["nom", "email", "note"]):
        return jsonify({"error": "Champs requis : nom, email, note"}), 400
    if not (0 <= data["note"] <= 20):
        return jsonify({"error": "Note invalide"}), 400

    etudiant = Etudiant(**data)
    db.session.add(etudiant)
    db.session.commit()
    return jsonify(etudiant.to_dict()), 201

@app.route("/api/etudiants/<int:id>", methods=["PUT"])
def modifier(id):
    etudiant = Etudiant.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(etudiant, key):
            setattr(etudiant, key, value)
    db.session.commit()
    return jsonify(etudiant.to_dict())

@app.route("/api/etudiants/<int:id>", methods=["DELETE"])
def supprimer(id):
    etudiant = Etudiant.query.get_or_404(id)
    db.session.delete(etudiant)
    db.session.commit()
    return "", 204

if __name__ == "__main__":
    app.run(debug=True, port=5000)
\`\`\`

> [!TIP]
> Pour des projets plus importants, explorez **FastAPI** — plus moderne, plus rapide, avec validation automatique via Pydantic et documentation interactive Swagger générée automatiquement.

> [!NOTE]
> Pour les applications de production, utilisez un serveur WSGI comme **Gunicorn** : \`gunicorn -w 4 -b 0.0.0.0:8000 app:app\`. Ne jamais utiliser le serveur de développement Flask en production.`
  },
  {
    title: "Workflow Professionnel & Déploiement",
    order: 20,
    duration: 70,
    content: "Félicitations — vous avez parcouru un long chemin ! Cette dernière leçon est celle qui transforme un coder en développeur professionnel. Écrire du bon code est une chose, mais le rendre reproductible, testable, versionné et déployable en est une autre. Vous allez maîtriser les outils essentiels du workflow professionnel : environnements virtuels, Git, tests automatisés, Docker et les plateformes de déploiement cloud.",
    extra: `## 1. Environnements Virtuels — Isoler vos Projets

\`\`\`bash
# Créer un environnement virtuel
python -m venv env          # Crée un dossier 'env'
python -m venv .venv        # Convention de nommage commune

# Activer l'environnement
source env/bin/activate     # Linux / macOS
env\\Scripts\\activate        # Windows (CMD)
.venv\\Scripts\\activate.ps1  # Windows (PowerShell)

# Vérifier que l'env est actif
which python                # Devrait pointer vers env/bin/python

# Installer les dépendances du projet
pip install flask pandas numpy matplotlib

# Sauvegarder les dépendances exactes
pip freeze > requirements.txt

# Sur un autre machine / environnement :
pip install -r requirements.txt

# Désactiver l'environnement
deactivate
\`\`\`

### Structure Standard d'un Projet Python
\`\`\`
mon_projet/
├── .env                    # Variables d'environnement (NE PAS committer !)
├── .gitignore              # Fichiers à ignorer par Git
├── requirements.txt        # Dépendances de production
├── requirements-dev.txt    # Dépendances de développement
├── README.md               # Documentation
├── setup.py                # Configuration du package (si bibliothèque)
├── src/                    # Code source
│   ├── __init__.py
│   ├── app.py
│   ├── models.py
│   └── utils.py
├── tests/                  # Tests unitaires
│   ├── __init__.py
│   ├── test_models.py
│   └── test_utils.py
├── data/                   # Données (gitignore si volumineuses)
└── notebooks/              # Jupyter notebooks d'exploration
\`\`\`

---

## 2. Git — Contrôle de Version

\`\`\`bash
# Initialisation
git init                    # Nouveau repo local
git clone URL               # Cloner un repo existant

# Workflow quotidien
git status                  # État des fichiers
git add fichier.py          # Stager un fichier
git add .                   # Stager tous les changements
git commit -m "feat: ajouter l'analyse de données"
git push origin main        # Pousser vers GitHub

# Branches — développement parallèle
git checkout -b feature/analyse-ventes   # Créer et switcher sur une branche
git checkout main                        # Revenir sur main
git merge feature/analyse-ventes         # Fusionner la branche

# Historique et différences
git log --oneline           # Historique compact
git diff                    # Voir les changements non stagés

# Annuler des changements
git checkout -- fichier.py  # Annuler les modifs non commitées
git revert HEAD             # Annuler le dernier commit (safe)
\`\`\`

### .gitignore pour Projet Python
\`\`\`
# Environnements virtuels
env/
.venv/
venv/

# Python
__pycache__/
*.pyc
*.pyo
*.egg-info/
dist/
build/

# Jupyter
.ipynb_checkpoints/

# Variables d'environnement (CRITIQUE !)
.env
.env.local

# Base de données
*.db
*.sqlite

# Données volumineuses
data/*.csv
data/*.xlsx

# IDE
.vscode/
.idea/
\`\`\`

---

## 3. Tests Automatisés avec pytest

\`\`\`bash
pip install pytest pytest-cov
\`\`\`

\`\`\`python
# src/calculs.py
def calculer_moyenne(notes: list) -> float:
    if not notes:
        raise ValueError("La liste de notes ne peut pas être vide")
    return sum(notes) / len(notes)

def est_admis(note: float, seuil: float = 10.0) -> bool:
    if not (0 <= note <= 20):
        raise ValueError(f"Note invalide : {note}")
    return note >= seuil

def normaliser_texte(texte: str) -> str:
    return texte.strip().lower().replace("  ", " ")

# tests/test_calculs.py
import pytest
from src.calculs import calculer_moyenne, est_admis, normaliser_texte

class TestCalculerMoyenne:
    def test_cas_normal(self):
        assert calculer_moyenne([10, 15, 20]) == 15.0

    def test_note_unique(self):
        assert calculer_moyenne([18]) == 18.0

    def test_liste_vide_leve_erreur(self):
        with pytest.raises(ValueError, match="ne peut pas être vide"):
            calculer_moyenne([])

    def test_avec_decimales(self):
        assert abs(calculer_moyenne([14.5, 15.5]) - 15.0) < 0.001

class TestEstAdmis:
    @pytest.mark.parametrize("note,seuil,attendu", [
        (10.0, 10.0, True),
        (9.9, 10.0, False),
        (20.0, 10.0, True),
        (0.0, 10.0, False),
        (15.0, 14.0, True),
    ])
    def test_parametrise(self, note, seuil, attendu):
        assert est_admis(note, seuil) == attendu

    def test_note_invalide_leve_erreur(self):
        with pytest.raises(ValueError):
            est_admis(25.0)

class TestNormaliserTexte:
    def test_espaces(self):
        assert normaliser_texte("  Alice  ") == "alice"

    def test_majuscules(self):
        assert normaliser_texte("PYTHON") == "python"
\`\`\`

\`\`\`bash
# Lancer les tests
pytest                          # Tous les tests
pytest tests/test_calculs.py    # Un fichier spécifique
pytest -v                       # Mode verbose
pytest --cov=src                # Rapport de couverture de code
pytest -k "TestEstAdmis"        # Filtrer par classe
\`\`\`

---

## 4. Docker — Containeriser votre Application

\`\`\`dockerfile
# Dockerfile
FROM python:3.12-slim

# Variables d'environnement
ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PIP_NO_CACHE_DIR=1

# Répertoire de travail
WORKDIR /app

# Installer les dépendances (couche cachée par Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY src/ ./src/

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "src.app:app"]
\`\`\`

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db/mydb
      - SECRET_KEY=ma_cle_secrete
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

\`\`\`bash
# Commandes Docker
docker build -t mon-app .           # Construire l'image
docker run -p 5000:5000 mon-app     # Lancer un conteneur
docker-compose up -d --build        # Lancer toute la stack
docker-compose logs -f web          # Voir les logs
docker-compose down                 # Arrêter la stack
\`\`\`

---

## 5. Déploiement Cloud

### Render.com (Gratuit, simple)
\`\`\`yaml
# render.yaml
services:
  - type: web
    name: mon-api-python
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn src.app:app
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: ma-base
          property: connectionString
\`\`\`

### GitHub Actions — CI/CD Automatique
\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Installer les dépendances
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Lancer les tests
        run: pytest --cov=src --cov-report=xml

      - name: Vérifier la couverture (minimum 80%)
        run: pytest --cov=src --cov-fail-under=80
\`\`\`

---

## Récapitulatif : Checklist Projet Professionnel

\`\`\`
✅ Environnement virtuel configuré et .gitignore en place
✅ Variables sensibles dans .env (jamais dans le code)
✅ requirements.txt à jour (pip freeze > requirements.txt)
✅ Code testé avec pytest (couverture > 80%)
✅ Type hints sur les fonctions publiques
✅ Docstrings sur les modules et fonctions
✅ README.md avec instructions d'installation et d'utilisation
✅ CI/CD configuré (GitHub Actions)
✅ Docker pour la portabilité
✅ Logs applicatifs (logging, pas print) en production
\`\`\`

> [!IMPORTANT]
> **Ne jamais mettre de données sensibles dans le code ou sur Git** : clés API, mots de passe, tokens. Utilisez toujours des variables d'environnement ou des services dédiés comme AWS Secrets Manager ou HashiCorp Vault.

> [!TIP]
> Commencez petit : pour votre prochain projet, appliquez au moins les environnements virtuels, Git, et un fichier .env. C'est 80% du chemin vers le professionnalisme.

---

## Félicitations !

Vous avez terminé la **Formation Python Intégrale**. Vous maîtrisez maintenant :

- **Les fondamentaux** : Variables, boucles, fonctions, POO
- **La gestion des données** : Fichiers, JSON, CSV, exceptions
- **La Data Science** : NumPy, Pandas, Matplotlib, Seaborn
- **Le développement web** : Flask, APIs REST, Web Scraping
- **Le workflow pro** : Git, tests, Docker, déploiement

La prochaine étape ? **Construisez un projet concret** qui vous passionne. C'est ainsi qu'on consolide vraiment ses compétences. Bonne chance !`
  }
];

async function main() {
    const course = await prisma.course.findUnique({
        where: { slug: 'python-integral' }
    });

    if (!course) {
        console.error('Cours "python-integral" non trouvé.');
        return;
    }

    console.log(`\nCours trouvé: "${course.title}" (ID: ${course.id})`);
    console.log('--- Enrichissement Partie 3/3 (Leçons 15-20) ---\n');

    for (const data of lessonData) {
        process.stdout.write(`Traitement: "${data.title}"... `);

        let lesson = await prisma.lesson.findFirst({
            where: { courseId: course.id, title: data.title }
        });

        if (!lesson) {
            lesson = await prisma.lesson.create({
                data: {
                    title: data.title,
                    order: data.order,
                    duration: data.duration,
                    courseId: course.id,
                    content: data.content
                }
            });
            process.stdout.write('[CRÉÉE] ');
        } else {
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { content: data.content, order: data.order, duration: data.duration }
            });
            process.stdout.write('[MAJ] ');
        }

        const existing = await prisma.courseContent.findFirst({
            where: { lessonId: lesson.id, contentType: 'text' }
        });

        if (existing) {
            await prisma.courseContent.update({
                where: { id: existing.id },
                data: { content: data.extra, title: "Contenu Détaillé" }
            });
        } else {
            await prisma.courseContent.create({
                data: {
                    lessonId: lesson.id,
                    contentType: 'text',
                    title: "Contenu Détaillé",
                    content: data.extra,
                    order: 1
                }
            });
        }
        console.log('OK');
    }

    console.log('\n✅ Partie 3/3 terminée (leçons 15-20 enrichies).');
    console.log('\n🎉 Formation Python Intégrale entièrement enrichie !');
    console.log('   20 leçons avec contenu professionnel complet.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
