<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiagnosticRecommendation extends Model
{
    protected $fillable = [
        'diagnostic_id',
        'dimension',
        'priority',
        'issue',
        'action',
        'impact',
    ];

    public function diagnostic(): BelongsTo
    {
        return $this->belongsTo(Diagnostic::class);
    }
}