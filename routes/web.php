<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DiagnosticController;

Route::get('/', function () {
    return Inertia::render('introduction');
})->name('introduction') ;

// Routes du Diagnostic
Route::get('/diagnostic/phase-1', [DiagnosticController::class, 'showPhase1'])->name('diagnostic.phase1');
Route::post('/diagnostic/phase-1', [DiagnosticController::class, 'storePhase1'])->name('diagnostic.phase1.store');
Route::get('/diagnostic/{diagnostic}/phase-2', [DiagnosticController::class, 'showPhase2'])->name('diagnostic.phase2');