<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['required', 'string', 'max:255'],
            'activity_description' => ['required', 'string', 'max:1000'],
            'annual_revenue' => ['nullable', 'string', 'max:100'],
            'strengths' => ['required', 'string', 'max:1000'],
            'weaknesses' => ['required', 'string', 'max:1000'],
            'challenges_description' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de l\'entreprise est obligatoire.',
            'sector.required' => 'Veuillez sélectionner votre secteur d\'activité.',
            'annual_revenue.required' => 'Veuillez sélectionner la tranche de votre chiffre d\'affaires.',
            'activity_description.required' => 'Veuillez fournir une description de votre activité.',
            'strengths.required' => 'Veuillez citer vos points forts.',
            'weaknesses.required' => 'Veuillez citer vos points faibles.',
        ];
    }
}