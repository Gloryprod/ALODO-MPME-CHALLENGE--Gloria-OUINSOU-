<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanyProfile extends Model
{
    protected $fillable = [
        'name',
        'sector',
        'activity_description',
        'annual_revenue',
        'strengths',
        'weaknesses',
        'challenges_description',
    ];

    public function diagnostics(): HasMany
    {
        return $this->hasMany(Diagnostic::class, 'company_id');
    }
}