
#  ALODO MPME — Parcours Diagnostic de Maturité Organisationnelle

---

##  1. Présentation — Qu'avez-vous construit ?

**ALODO MPME** est une application web interactive conçue pour aider les Micro, Petites et Moyennes Entreprises (MPME) à évaluer leur niveau de maturité organisationnelle.

Grâce à un parcours guidé en deux phases et à l'intégration du modèle d'IA **Google Gemini**, la plateforme identifie automatiquement les dimensions critiques liées aux faiblesses de l'entreprise. Elle génère dynamiquement un questionnaire sur mesure, puis produit un **bilan de maturité complet** assorti d'un plan d'action personnalisé et téléchargeable au format PDF.

---

##  2. Choix Produit — Pourquoi ces dimensions et questions ?

Le parcours utilisateur repose sur un ciblage progressif en deux phases. Afin de garantir un diagnostic personnalisé et ancré dans la réalité de chaque organisation, le système n'impose pas un questionnaire générique figé. Il analyse d'abord le contexte et les vulnérabilités déclarées par la structure pour sélectionner dynamiquement les dimensions prioritaires à évaluer (en s'appuyant sur le **Référentiel des 8 Dimensions**).

* **Phase 1 — Profilage Initial :** Collecte des données contextuelles de l'entreprise (secteur d'activité, taille, description des opérations et auto-évaluation synthétique des difficultés/points faibles).
* **Phase 2 — Diagnostic Approfondi :** Génération de questions émergentes sur mesure par l'IA en fonction du profil et des vulnérabilités identifiées en Phase 1.

---

##  3. Choix Techniques — Pourquoi cette stack ?

La stack technique a été sélectionnée pour assurer un développement rapide, fiable et performant. L'intégration du modèle Gemini apporte une véritable valeur ajoutée en automatisant l'analyse contextuelle et la génération de recommandations dynamiques.

| Composant | Technologie | Justification du choix |
| --- | --- | --- |
| **Backend** | **Laravel 11** *(PHP 8.2+)* | Framework robuste, sécurisé, offrant une gestion fluide des bases de données et des transactions. |
| **Frontend** | **React & Inertia.js** | Permet d'édifier une interface React dynamique et réactive tout en conservant la simplicité du routage côté serveur de Laravel. |
| **Design / UI** | **Tailwind CSS & Lucide Icons** | Intégration rapide d'un design moderne, responsive et adapté aux identités visuelles sur mesure. |
| **Moteur IA** | **Google Gemini API** | Génération fluide de questionnaires ciblés et analyse automatisée avec un prompt engineering structuré (format JSON). |
| **Base de Données** | **MySQL** | Stockage relationnel fiable et structuré des profils d'entreprises, questions, réponses et bilans d'évaluation. |

---

##  4. Installation — Comment lancer le projet ?

### Prérequis

* **PHP** >= 8.2
* **Composer**
* **Node.js** >= 18.x & **npm**
* **MySQL**
* Une clé d'API **Google Gemini**

---

### Étapes d'installation

**1. Cloner le dépôt et accéder au dossier :**

```bash
git clone https://github.com/Gloryprod/ALODO-MPME-CHALLENGE--Gloria-OUINSOU-.git
cd ALODO-MPME-CHALLENGE--Gloria-OUINSOU-

```

**2. Installer les dépendances PHP et JavaScript :**

```bash
composer install
npm install

```

**3. Configurer le fichier d'environnement :**

```bash
cp .env.example .env
php artisan key:generate

```

**4. Configurer la base de données et l'API Gemini dans le fichier `.env` :**

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=alodo_db
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=votre_cle_api_gemini

```

**5. Lancer les migrations de la base de données :**

```bash
php artisan migrate

```

**6. Lancer le serveur de développement et la compilation des assets :**

```bash
# Dans un premier terminal
npm run dev

# Dans un second terminal
php artisan serve

```

L'application sera accessible sur : **`http://localhost:8000`**

---

##  5. Fonctionnalités — Qu'est-ce qui fonctionne ?

* **Page d'Introduction :** Présentation claire des objectifs du diagnostic ALODO MPME, de son déroulement et de la durée estimée.
* **Phase 1 — Profilage Entreprise :** Saisie, validation et enregistrement sécurisé du profil de la MPME.
* **Phase 2 — Diagnostic Sur-Mesure (IA) :**
* Génération automatique de questions ciblées selon le secteur et les points faibles déclarés.
* Suivi de progression dynamique (barre de progression, validation des champs en temps réel).
* Résilience aux erreurs d'API IA avec feedback utilisateur explicite via flash notifications.


* **Rapport & Bilan de Maturité :**
* Calcul d'un score global de maturité (sur 100).
* Représentation visuelle des scores par dimension organisationnelle.
* Recommandations hiérarchisées (Priorité Haute / Moyenne / Basse) détaillant : *Constat*, *Action recommandée* et *Impact attendu*.
* Exportation / Impression native au format PDF (`window.print`).



---

##  6. Limites — Qu'avez-vous volontairement laissé de côté ?

* **Espace Client & Authentification :** L'évaluation est accessible directement via l'identifiant unique du diagnostic afin de fluidifier l'expérience sans barrière à l'entrée.
* **Historique Comparatif :** Pas de comparaison directe intégrée entre un diagnostic réalisé à T0 et un second réalisé à T+6 mois.
* **Édition Sélective des Réponses :** Une fois le bilan généré, la modification d'une réponse spécifique nécessite de relancer la Phase 2.

---

##  7. Améliorations Futuristes — Qu'auriez-vous ajouté avec plus de temps ?

1. **Espace Compte & Suivi Temporel :** Dashboard permettant aux dirigeants de MPME de conserver l'historique de leurs bilans et de mesurer leur progression dans le temps.
2. **Benchmarking Sectoriel :** Module de comparaison anonymisé permettant de situer le score d'une MPME par rapport à la moyenne des entreprises de son secteur.
3. **Catalogue d'Experts Partenaires :** Recommandation automatisée de prestataires ou consultants qualifiés en fonction des faiblesses prioritaires identifiées (ex: mise en relation avec un cabinet comptable si la dimension financière est critique).