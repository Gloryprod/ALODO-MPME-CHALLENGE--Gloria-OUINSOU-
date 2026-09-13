<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyProfileRequest;
use App\Models\CompanyProfile;
use App\Models\Diagnostic;
use App\Models\DiagnosticQuestion;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Services\GeminiService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DiagnosticController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function showPhase1(?Diagnostic $diagnostic = null): Response
    {
        // Chargement de la relation entreprise si le diagnostic existe
        if ($diagnostic) {
            $diagnostic->load('company');
        }

        return Inertia::render('Diagnostic/phase1', [
            'diagnostic' => $diagnostic,
            'company' => $diagnostic ? $diagnostic->company : null,
        ]);
    }

    public function storePhase1(CompanyProfileRequest $request, ?Diagnostic $diagnostic = null): RedirectResponse
    {
        $validated = $request->validated();

        if ($diagnostic) {
            // Mise à jour de l'entreprise existante
            $diagnostic->company->update($validated);
        } else {
            // Création de la nouvelle entreprise et du diagnostic
            $company = CompanyProfile::create($validated);

            $diagnostic = Diagnostic::create([
                'company_id' => $company->id,
            ]);
        }

        return redirect()->route('diagnostic.phase2', ['diagnostic' => $diagnostic->id]);
    }

    /**
     * PHASE 2 (Affichage) : Génération et enregistrement des 5 questions ciblées dans `diagnostic_questions`
     */
    public function showPhase2(Diagnostic $diagnostic)
    {
        $company = $diagnostic->company;

        // Si aucune question n'est liée à ce diagnostic, l'IA les génère
        if ($diagnostic->questions()->count() === 0) {
            $aiData = $this->geminiService->generatePhase2Diagnostic($company);

            if (!$aiData || !isset($aiData['questions'])) {
                return back()->with('error', 'Impossible de générer les questions pour le moment.');
            }

            // Enregistrement des questions générées dans la table diagnostic_questions
            DB::transaction(function () use ($diagnostic, $aiData) {
                foreach ($aiData['questions'] as $q) {
                    $diagnostic->questions()->create([
                        'label' => $q['label'],
                        'dimension' => $q['dimension'],
                        'type' => $q['type'] ?? 'multiple_choice',
                        'options' => $q['options'] ?? [],
                    ]);
                }
            });
        }

        // Charger les questions créées pour l'affichage dans la vue
        $questions = $diagnostic->questions;

        return Inertia::render('Diagnostic/phase2', [
            'diagnostic' => $diagnostic,
            'questions' => $questions,
        ]);
    }

    /**
     * PHASE 2 (Soumission) : Traitement des réponses, calcul IA/Scores,Recommandations & Synthèse
     */
    public function storePhase2(Request $request, Diagnostic $diagnostic): RedirectResponse
    {
        $request->validate([
            'responses' => 'required|array',
            'responses.*.question_id' => 'required|exists:diagnostic_questions,id',
            'responses.*.user_response' => 'required|string',
        ]);

        DB::transaction(function () use ($request, $diagnostic) {
            // 1. Sauvegarder les réponses de l'entreprise
            foreach ($request->input('responses') as $resp) {
                DiagnosticQuestion::where('id', $resp['question_id'])
                    ->where('diagnostic_id', $diagnostic->id)
                    ->update(['user_response' => $resp['user_response']]);
            }

            // 2. Recharger le diagnostic avec les questions et leurs réponses
            $diagnostic->load(['company', 'questions']);

            // 3. Appeler le service IA pour générer le bilan (scores, synthèse, recommandations)
            $evaluation = $this->geminiService->evaluateDiagnostic($diagnostic);

            if (!$evaluation) {
                return back()->withErrors([
                    'error' => "Une erreur est survenue lors de l'évaluation par l'IA. Veuillez réessayer."
                ]);
            }

            dd($evaluation); // Pour débogage, à retirer en production

            // 4. Mettre à jour les scores et la synthèse dans la table diagnostics
            $diagnostic->update([
                'global_score' => $evaluation['global_score'],
                'summary' => $evaluation['summary'],
                'dimension_scores' => $evaluation['dimension_scores'],
            ]);
        });

        return redirect()->route('diagnostic.report', ['diagnostic' => $diagnostic->id]);
    }

    /**
     * Affiche le bilan et le rapport final du diagnostic.
     */
    public function showReport(Diagnostic $diagnostic): Response
    {
        // Charger la relation company et les recommandations ordonnées par priorité
        $diagnostic->load([
            'company',
        ]);

        return Inertia::render('Diagnostic/rapport', [
            'diagnostic' => $diagnostic,
        ]);
    }
}