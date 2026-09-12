<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiagnosticQuestion extends Model
{
    protected $fillable = [
        'diagnostic_id',
        'label',
        'dimension',
        'type',
        'options',
        'user_response',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function diagnostic(): BelongsTo
    {
        return $this->belongsTo(Diagnostic::class);
    }
}