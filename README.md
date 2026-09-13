ALODO MPME — Parcours Diagnostic Maturité Organisationnel

1. Présentation — qu’avez-vous construit ?
ALODO MPME est une application web interactive conçue pour aider les Micro, Petites et Moyennes Entreprises (MPME) à évaluer leur niveau de maturité organisationnelle.
Grâce à un parcours en deux phases et à l'intégration d'un modèle d'IA (Gemini), la plateforme identifie les dimensions critiques liées aux faiblesses de l’entreprise et génère dynamiquement un questionnaire sur-mesure puis produit un bilan de maturité complet assorti d'un plan d'action personnalisé et téléchargeable au format PDF.

2. Choix produit — pourquoi ces dimensions/questions ?
Le parcours utilisateur repose sur un ciblage progressif en deux phases. Afin de garantir un diagnostic personnalisé et ancré dans la réalité de l'entreprise, le système n'impose pas un questionnaire générique. Il analyse d'abord le contexte et les vulnérabilités déclarées par l'organisation pour sélectionner dynamiquement les dimensions prioritaires à évaluer en tenant compte du RÉFÉRENTIEL DES 8 DIMENSIONS fourni dans le document challenge-alodo-dev.
•	Phase 1 (Profilage initial) : Collecte des données contextuelles de l'entreprise (secteur, description des activités et auto-évaluation brève sur les difficultés et points faibles ).
•	Phase 2 (Diagnostic approfondi) : Questions générées sur-mesure par l'IA en fonction du profil défini en Phase 1.

3. Choix techniques — pourquoi cette stack ?
La stack technique a été sélectionnée pour ma  maîtrise de ces technologies, me permettant d'assurer un développement rapide, fiable et efficace. En complément, l'intégration d'un modèle d'IA apporte une véritable valeur ajoutée en générant dynamiquement des questionnaires de diagnostic sur-mesure.

Composant	Technologie	Justification du choix
Backend	Laravel 11 (PHP 8.2+)	Framework robuste, gestion fluide des bases de données et transactions complexes.
Frontend	React & Inertia.js	Permet de créer un composant React réactif tout en conservant le routage côté serveur de Laravel.
Design / UI	Tailwind CSS & Lucide Icons	Design moderne, responsive et intégration facilitée de thèmes CSS personnalisés.
IA Engine	Google Gemini API	Génération de questionnaires ciblés et analyse automatisée des réponses avec prompt engineering structuré (JSON).
Base de données	MySQL	Stockage relationnel fiable des profils, questions, réponses et bilans générés.

4. Installation — comment lancer le projet ?
Prérequis
•	PHP >= 8.2

•	Composer

•	Node.js >= 18.x & npm

•	Clé d'API Google Gemini

Étapes d'installation
Bash
# 1. Cloner le repository
git clone https://github.com/Gloryprod/ALODO-MPME-CHALLENGE--Gloria-OUINSOU-.git
cd alodo-mpme-diagnostic

# 2. Installer les dépendances PHP et JavaScript
composer install
npm install

# 3. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 4. Configurer les variables dans le .env
# DB_DATABASE=alodo_db
# GEMINI_API_KEY=votre_cle_api_gemini
# GEMINI_MODEL=modèle_gemini_choisi
# 5. Lancer les migrations de la base de données
php artisan migrate
# 6. Lancer le serveur de développement
npm run dev
php artisan serve
L'application sera accessible sur http://localhost:8000.

5. Fonctionnalités — qu’est-ce qui fonctionne ?
•	Page d'introduction : Présentation de l’objectif du parcours diagnostic ALODO MPME et de la durée et du principe.

•	Phase 1 - Profilage Entreprise : Saisie et enregistrement des informations de l'entreprise.

•	Phase 2 - Diagnostic sur-mesure (IA) :
    o	Génération automatique de questions adaptées au secteur d’activité, et aux faiblesses déclarées par l'IA en fonction des dimensions critiques identifiées.
    o	Suivi de progression dynamique (barre de progression, validation des champs).
•	Rapport & Bilan de Maturité :
    o	Calcul du score global de maturité (sur 100).
    o	Score détaillé et niveau de maturité par dimension.
    o	Recommandations hiérarchisées (Priorité Haute / Moyenne / Basse) avec Constat, Action et Impact attendu.
    o	Exportation / Impression en PDF (window.print).

6. Limites — qu’avez-vous volontairement laissé de côté ?
•	Espace Client / Authentification : L'évaluation se fait actuellement en accès libre via l’identifiant du diagnostic pour simplifier le parcours.
•	Historique des diagnostics : Pas de comparaison directe entre un diagnostic réalisé à T0 et un autre à T+6 mois.
•	Édition des réponses Phase 2 : Une fois le bilan généré, l'utilisateur doit relancer la Phase 2 s'il souhaite modifier une réponse spécifique.

7. Améliorations — qu’auriez-vous ajouté avec plus de temps ?
1.	Espace Compte & Suivi Temporel : Permettre aux MPME de créer un compte pour suivre l'évolution de leurs scores au fil du temps.
2.	Benchmarking de secteur : Comparer le score d'une MPME avec la moyenne des autres entreprises de son secteur.
3.	Intégration d'un catalogue d'experts : Recommander directement des prestataires/consultants partenaires en fonction des priorités identifiées (ex: un expert-comptable si l'organisation financière de l'entreprise  est faible).

