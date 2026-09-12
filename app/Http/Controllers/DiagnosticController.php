<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyProfileRequest;
use App\Models\CompanyProfile;
use App\Models\Diagnostic;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DiagnosticController extends Controller
{
    public function showPhase1(): Response
    {
        return Inertia::render('Diagnostic/phase1');
    }

    public function storePhase1(CompanyProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $company = CompanyProfile::create($validated);

        $diagnostic = Diagnostic::create([
            'company_id' => $company->id,
            'phase1_data' => $validated,
        ]);

        return redirect()->route('diagnostic.phase2', ['diagnostic' => $diagnostic->id]);
    }

    public function showPhase2(Diagnostic $diagnostic): Response
    {
        $diagnostic->load('company');

        return Inertia::render('Diagnostic/Phase2Questionnaire', [
            'diagnostic' => $diagnostic,
        ]);
    }
}