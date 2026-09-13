<?php

namespace App\Services;

use App\Models\CompanyProfile;
use App\Models\Diagnostic;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiService
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl;

    /**
     * Les 8 dimensions officielles du référentiel ALODO MPME
     */
    public const DIMENSIONS_ALODO = [
        'Formalisation' => 'Statut légal, documents administratifs, conformité, séparation pro/perso',
        'Finance' => 'CA, dépenses, trésorerie, marges, bénéfices, dettes, créances, prévisions',
        'Comptabilité' => 'Organisation comptable, pièces justificatives, états financiers, outils',
        'Commercial' => 'Acquisition, clients, prospects, ventes, conversion, fidélisation',
        'Digitalisation' => 'Outils numériques, présence digitale, WhatsApp Business, paiements, automatisation',
        'Opérations' => 'Processus, fournisseurs, stock, production, dépendance au dirigeant',
        'Ressources humaines' => 'Organisation, rôles, contrats, recrutement, formation, dépendance aux personnes',
        'Préparation au financement' => 'Historique financier, documents, endettement, besoin de financement',
    ];

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->model = config('services.gemini.model', 'gemini-1.5-flash');
        $this->baseUrl = config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta/models/');
    }

    /**
     * Phase 2 : Génère les questions ciblées destinées à alimenter la table `diagnostic_questions`.
     *
     * @param CompanyProfile $company Profil de l'entreprise (Phase 1)
     * @param int $questionsCount Nombre de questions ciblées à générer (défaut : 8)
     * @return array|null Format: ['questions' => [ ['label', 'dimension', 'type', 'options'], ... ]]
     */
    public function generatePhase2Diagnostic(CompanyProfile $company, int $questionsCount = 8): ?array
{
    if (empty($this->apiKey)) {
        Log::error('GeminiService Error: Clé API manquante.');
        return null;
    }

    $endpoint = "{$this->baseUrl}{$this->model}:generateContent?key={$this->apiKey}";

    // 1. Formattage enrichi du Référentiel avec explicitation des sous-aspects
    $cadreDimensions = "";
    foreach (self::DIMENSIONS_ALODO as $nom => $description) {
        $cadreDimensions .= "- **{$nom}** (Sous-aspects à couvrir obligatoirement : {$description})\n";
    }

    // 2. Directives système orientées couverture intégrale des sous-aspects
    $systemInstruction = <<<TEXT
Tu es un expert en audit organisationnel et diagnostic opérationnel des MPME (référentiel ALODO MPME).

RÉFÉRENTIEL DES 8 DIMENSIONS ET LEURS SOUS-ASPECTS OBLIGATOIRES :
{$cadreDimensions}

MISSION & CONSIGNES DE SÉLECTION ET GÉNÉRATION :
1. SÉLECTION DES DIMENSIONS CRITIQUES :
   - Analyse le profil, le secteur et les "Points faibles" déclarés par l'entreprise.
   - Identifie les 2 à 3 dimensions ALODO les plus impactées par ces failles.

2. COUVERTURE STRUCTURÉE DES QUESTIONS :
   - Pour chaque dimension retenue, tu NE DOIS NOTAMMENT PAS te focaliser sur un seul sujet isolé.
   - Tu DOIS balayer la diversité des sous-aspects listés dans la description de la dimension (ex: pour la Digitalisation, couvre AUSSI BIEN les paiements/Mobile Money que les outils internes ou la visibilité).
   - Chaque question doit viser à mettre en lumière la structure actuelle, le niveau de formalisation et les failles de fonctionnement.

3. FORMAT ET GRADUATION DES RÉPONSES (3 OPTIONS STRICTES) :
   Pour chaque question, tu dois fournir exactement 3 options représentatives des paliers de maturité :
   - Option A : Pratique informelle, absente ou risquée (Maturité faible).
   - Option B : Pratique manuelle, partielle ou intermédiaire (Maturité moyenne).
   - Option C : Pratique formalisée, structurée ou automatisée (Maturité élevée).
TEXT;

    // 3. Prompt contextuel
    $prompt = <<<PROMPT
PROFIL DE L'ENTREPRISE À AUDITER :
- Nom : {$company->name}
- Secteur d'activité : {$company->sector}
- Points forts déclarés : {$company->strengths}
- Points faibles / vulnérabilités déclarées : {$company->weaknesses}

CONSIGNE EXÉCUTION :
Génère un total de {$questionsCount} questions (réparties sur les 2 à 3 dimensions les plus critiques). Veille à ce que les questions couvrent des angles/sous-aspects DIFFÉRENTS de chaque dimension pour éviter tout doublon de sujet.
PROMPT;

    // 4. Schéma JSON strict
    $jsonSchema = [
        'type' => 'OBJECT',
        'properties' => [
            'selected_dimensions' => [
                'type' => 'ARRAY',
                'description' => 'Liste des 2 ou 3 dimensions ALODO sélectionnées pour le diagnostic.',
                'items' => [
                    'type' => 'STRING',
                    'enum' => array_keys(self::DIMENSIONS_ALODO)
                ]
            ],
            'questions' => [
                'type' => 'ARRAY',
                'description' => 'Liste des questions ciblées et équilibrées pour la Phase 2.',
                'items' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'dimension' => [
                            'type' => 'STRING',
                            'description' => 'Nom exact de la dimension rattachée.',
                            'enum' => array_keys(self::DIMENSIONS_ALODO)
                        ],
                        'sub_aspect' => [
                            'type' => 'STRING',
                            'description' => 'Le sous-aspect spécifique de la dimension traité par cette question (ex: "Paiements", "Stock", "Archivage").'
                        ],
                        'label' => [
                            'type' => 'STRING',
                            'description' => 'Intitulé précis et pragmatique de la question.'
                        ],
                        'type' => [
                            'type' => 'STRING',
                            'description' => 'Valeur fixe: multiple_choice'
                        ],
                        'options' => [
                            'type' => 'ARRAY',
                            'description' => 'Exactement 3 options graduées (Informel -> Manuel -> Structuré).',
                            'items' => [
                                'type' => 'STRING'
                            ]
                        ]
                    ],
                    'required' => ['dimension', 'sub_aspect', 'label', 'type', 'options']
                ]
            ]
        ],
        'required' => ['selected_dimensions', 'questions']
    ];

    $payload = [
        'system_instruction' => [
            'parts' => [['text' => $systemInstruction]]
        ],
        'contents' => [
            [
                'parts' => [['text' => $prompt]]
            ]
        ],
        'generationConfig' => [
            'responseMimeType' => 'application/json',
            'responseSchema' => $jsonSchema,
            'temperature' => 0.25, // Légère flexibilité pour varier les angles de questions
        ],
    ];

    try {
        $response = Http::timeout(40)->post($endpoint, $payload);

        if ($response->failed()) {
            Log::error('GeminiService generatePhase2Diagnostic - Erreur HTTP', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return null;
        }

        $rawText = $response->json('candidates.0.content.parts.0.text');
        return json_decode($rawText, true);

    } catch (Exception $e) {
        Log::error('GeminiService generatePhase2Diagnostic Exception : ' . $e->getMessage());
        return null;
    }
}

    /**
     * Phase 2 (Évaluation) : Évalue les réponses enregistrées et produit les données pour
     * la table `diagnostics` (scores + résumé).
     *
     * @param Diagnostic $diagnostic Le diagnostic contenant les questions et réponses
     * @return array|null
     */
    public function evaluateDiagnostic(Diagnostic $diagnostic): ?array
{
    if (empty($this->apiKey)) {
        Log::error('GeminiService Error: Clé API manquante.');
        return null;
    }

    $endpoint = "{$this->baseUrl}{$this->model}:generateContent?key={$this->apiKey}";
    $company = $diagnostic->company;

    // 1. Structuration explicite : Regroupement des questions par dimension
    $questionsAndAnswers = [];
    foreach ($diagnostic->questions as $q) {
        $dimKey = trim($q->dimension);
        if (!isset($questionsAndAnswers[$dimKey])) {
            $questionsAndAnswers[$dimKey] = [];
        }
        $questionsAndAnswers[$dimKey][] = [
            'question' => $q->label,
            'reponse_entreprise' => $q->user_response ?? 'Non renseigné',
        ];
    }

    // Identifie clairement quelles dimensions sont soumises à l'évaluation
    $dimensionsEvaluees = array_keys($questionsAndAnswers);

    // Cadre des dimensions ALODO
    $cadreDimensions = "";
    foreach (self::DIMENSIONS_ALODO as $nom => $description) {
        $cadreDimensions .= "- **{$nom}** : {$description}\n";
    }

    // 2. Directives système clarifiées et sans ambiguïté
    $systemInstruction = <<<TEXT
Tu es un consultant senior en audit et diagnostic d'entreprise pour les MPME (référentiel ALODO MPME).

Référentiel ALODO MPME :
{$cadreDimensions}

DIRECTIVES D'ÉVALUATION ET DE CALCUL DES SCORES :
1. PÉRIMÈTRE :
   - Évalue UNIQUEMENT les dimensions présentes dans le JSON de données transmis.
   - Ne génère AUCUNE entrée pour les dimensions absentes du questionnaire.

2. BARÈME DE NOTATION DES QUESTIONS (sur 100) :
   - Pratique informelle / absente / à haut risque (ex: gestion uniquement orale, absence de pièces) = 0 à 25 points.
   - Pratique partielle / manuelle / artisanale (ex: cahier de caisse papier, WhatsApp perso) = 40 à 60 points.
   - Pratique formalisée / structurée / numérique (ex: compte pro séparé, logiciels dédiés) = 75 à 100 points.

3. SCORE DE CHAQUE DIMENSION (`score`) :
   - Pour chaque dimension évaluée, attribue une note globale de 0 à 100 cohérente avec le barème et la moyenne des réponses fournies.

4. SCORE GLOBAL (`global_score`) :
   - Calcule la moyenne exacte des scores attribués aux dimensions évaluées.

5. RECOMMANDATIONS & SYNTHÈSE :
   - Fournis des recommandations concrètes et adaptées aux faiblesses décelées.
   - Synthétise le profil de l'entreprise en tenant compte de ses points forts connus : "{$company->strengths}" et points faibles connus : "{$company->weaknesses}".
TEXT;

    $prompt = "ENTREPRISE : {$company->name} (Secteur : {$company->sector})\n";
    $prompt .= "DIMENSIONS À ÉVALUER : " . implode(', ', $dimensionsEvaluees) . "\n\n";
    $prompt .= "DONNÉES DU QUESTIONNAIRE PAR DIMENSION :\n" . json_encode($questionsAndAnswers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
    $prompt .= "Procède au calcul des scores et à la génération des recommandations au format JSON demandé.";

    $jsonSchema = [
        'type' => 'OBJECT',
        'properties' => [
            'global_score' => [
                'type' => 'NUMBER',
                'description' => 'Moyenne arithmétique des scores des dimensions évaluées (sur 100).'
            ],
            'summary' => [
                'type' => 'STRING',
                'description' => 'Synthèse globale du diagnostic, analyse des forces/faiblesses et perspectives.'
            ],
            'dimension_scores' => [
                'type' => 'ARRAY',
                'description' => 'Évaluation explicite de CHAQUE dimension présente dans le questionnaire.',
                'items' => [
                    'type' => 'OBJECT',
                    'properties' => [
                        'dimension_name' => [
                            'type' => 'STRING',
                            'description' => 'Nom exact de la dimension ALODO évaluée.',
                            'enum' => array_keys(self::DIMENSIONS_ALODO)
                        ],
                        'score' => [
                            'type' => 'NUMBER',
                            'description' => 'Score calculé de 0 à 100 pour cette dimension.'
                        ],
                        'recommendations' => [
                            'type' => 'ARRAY',
                            'description' => 'Plan d\'action et recommandations pour cette dimension.',
                            'items' => [
                                'type' => 'OBJECT',
                                'properties' => [
                                    'priority' => [
                                        'type' => 'STRING',
                                        'enum' => ['haute', 'moyenne', 'basse'],
                                        'description' => 'Priorité de l\'action.'
                                    ],
                                    'issue' => [
                                        'type' => 'STRING',
                                        'description' => 'Constat ou frein identifié dans la réponse.'
                                    ],
                                    'action' => [
                                        'type' => 'STRING',
                                        'description' => 'Action corrective à mener.'
                                    ],
                                    'impact' => [
                                        'type' => 'STRING',
                                        'description' => 'Impact métier attendu.'
                                    ]
                                ],
                                'required' => ['priority', 'issue', 'action', 'impact']
                            ]
                        ]
                    ],
                    'required' => ['dimension_name', 'score', 'recommendations']
                ]
            ]
        ],
        'required' => ['global_score', 'summary', 'dimension_scores']
    ];

    $payload = [
        'system_instruction' => [
            'parts' => [['text' => $systemInstruction]]
        ],
        'contents' => [
            [
                'parts' => [['text' => $prompt]]
            ]
        ],
        'generationConfig' => [
            'responseMimeType' => 'application/json',
            'responseSchema' => $jsonSchema,
            'temperature' => 0.1, // Reste bas pour la rigueur des calculs
        ],
    ];

    try {
        $response = Http::timeout(60)->post($endpoint, $payload);

        if ($response->failed()) {
            Log::error('GeminiService evaluateDiagnostic - Erreur HTTP', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return null;
        }

        $rawText = $response->json('candidates.0.content.parts.0.text');
        $result = json_decode($rawText, true);

        // 3. Post-traitement et re-calcul PHP de sécurité (Optionnel mais recommandé)
        if (isset($result['dimension_scores']) && is_array($result['dimension_scores'])) {
            $formattedScores = [];
            $sumScores = 0;
            $count = 0;

            foreach ($result['dimension_scores'] as $item) {
                if (isset($item['dimension_name'])) {
                    $score = floatval($item['score'] ?? 0);
                    $formattedScores[$item['dimension_name']] = [
                        'score' => $score,
                        'recommendations' => $item['recommendations'] ?? []
                    ];

                    $sumScores += $score;
                    $count++;
                }
            }

            $result['dimension_scores'] = $formattedScores;

            // Recalcul strict du global_score en PHP pour éviter les erreurs d'arrondi ou d'inattention du LLM
            if ($count > 0) {
                $result['global_score'] = round($sumScores / $count, 1);
            }
        }

        return $result;

    } catch (Exception $e) {
        Log::error('GeminiService evaluateDiagnostic Exception : ' . $e->getMessage());
        return null;
    }
}
}