<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Diagnostic extends Model
{
    protected $fillable = [
        'company_id',
        'global_score',
        'summary',
        'dimension_scores',
        'phase1_data',
        'phase2_response',  
    ];

    protected $casts = [
        'dimensions_score' => 'array',
        'phase1_data' => 'array',
        'phase2_response' => 'array',
        'global_score' => 'float',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class, 'company_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(DiagnosticQuestion::class);
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(DiagnosticRecommendation::class);
    }
}