import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { CheckCircle, AlertCircle, ArrowRight, Building2, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function Phase2({ diagnostic, questions }) {
    // Initialisation du formulaire Inertia avec la structure attendue par le controller
    const { data, setData, post, processing, errors } = useForm({
        responses: questions.map((q) => ({
            question_id: q.id,
            user_response: '',
        })),
    });

    const { error } = usePage().props;

    // Mettre à jour la réponse sélectionnée pour une question
    const handleOptionSelect = (questionId, optionText) => {
        const updatedResponses = data.responses.map((resp) => {
            if (resp.question_id === questionId) {
                return { ...resp, user_response: optionText };
            }
            return resp;
        });
        setData('responses', updatedResponses);
    };

    // Calcul de la progression (combien de questions ont une réponse sélectionnée)
    const answeredCount = data.responses.filter((r) => r.user_response !== '').length;
    const totalCount = questions.length;
    const progressPercentage = Math.round((answeredCount / totalCount) * 100);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Soumission du formulaire au controller (storePhase2)
        post(`/diagnostic/${diagnostic.id}/phase-2`);
    };

    return (
        <>
            <Head title="Diagnostic ALODO - Phase 2" />

            <div className="min-h-screen bg-brand py-10 px-4 sm:px-6 lg:px-8">
                {/* Bannière de notification en cas de problème de service IA */}
                {error?.ai_error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 animate-fade-in">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold text-red-900">Problème avec le service d'analyse</p>
                            <p className="text-red-700">{error.ai_error}</p>
                        </div>
                    </div>
                )}
                <header className="bg-white border-b border-gray-100 py-4 px-6 sm:px-12">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary-500/20">
                                A
                            </div>
                            <span className="font-bold text-xl text-[#0A0A0A] tracking-tight">
                                ALODO MPME - Diagnostic 
                            </span>
                        </Link>
                        <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                            Étape 2 sur 2
                        </span>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto space-y-8 px-6 py-10 w-full flex-1">

                    <div>
                        <Link
                            href={`/diagnostic/phase-1/${diagnostic.id}`}
                            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour à la Phase 1</span>
                        </Link>
                    </div>
                    
                    {/* En-tête de la page */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 border border-primary-100">
                            <Sparkles className="w-3.5 h-3.5" />
                            Phase 2 : Diagnostic Approfondi
                        </span>
                        <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {diagnostic.company?.name || 'Votre Entreprise'}
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
                            Questions ciblées sur vos activités
                        </h1>
                        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                            Basé sur vos réponses initiales, notre système a identifié les axes prioritaires pour le développement de votre entreprise. Répondez sincèrement aux questions ci-dessous pour générer vos recommandations.
                        </p>
                    </div>

                    {/* Barre de progression */}
                    <div className="pt-2">
                        <div className="flex justify-between items-center text-xs font-medium text-neutral-600 mb-2">
                            <span>Progression du questionnaire</span>
                            <span className="text-primary-600 font-bold">{answeredCount} sur {totalCount} répondues ({progressPercentage}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-500 transition-all duration-300 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Formulaire des questions */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {questions.map((question, qIndex) => {
                            const currentResponse = data.responses.find((r) => r.question_id === question.id)?.user_response;
                            const hasError = errors[`responses.${qIndex}.user_response`];

                            return (
                                <div
                                    key={question.id}
                                    className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 border ${
                                        hasError
                                            ? 'border-red-300 ring-2 ring-red-50'
                                            : currentResponse
                                            ? 'border-primary-200 ring-1 ring-primary-100'
                                            : 'border-neutral-100'
                                    }`}
                                >
                                    {/* Badge Dimension & Numéro de question */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700">
                                            Dimension : <strong className="text-brand-dark">{question.dimension}</strong>
                                        </span>
                                        <span className="text-xs text-neutral-400 font-semibold">
                                            Question {qIndex + 1}/{totalCount}
                                        </span>
                                    </div>

                                    {/* Intitulé de la question */}
                                    <h2 className="text-base sm:text-lg font-semibold text-brand-dark leading-snug mb-5">
                                        {question.label}
                                    </h2>

                                    {/* Choix des options */}
                                    <div className="space-y-3">
                                        {question.options && question.options.map((option, oIndex) => {
                                            const isSelected = currentResponse === option;

                                            return (
                                                <button
                                                    type="button"
                                                    key={oIndex}
                                                    onClick={() => handleOptionSelect(question.id, option)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 group ${
                                                        isSelected
                                                            ? 'bg-primary-50/60 border-primary-500 text-brand-dark shadow-xs'
                                                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-neutral-50'
                                                    }`}
                                                >
                                                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                                        isSelected
                                                            ? 'border-primary-500 bg-primary-500 text-white'
                                                            : 'border-neutral-300 group-hover:border-primary-400 bg-white'
                                                    }`}>
                                                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                                                    </div>

                                                    <span className="text-sm font-medium leading-relaxed">
                                                        {option}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Message d'erreur s'il manque la réponse */}
                                    {hasError && (
                                        <p className="mt-3 text-xs text-red-600 flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Veuillez sélectionner une réponse pour cette question.
                                        </p>
                                    )}
                                </div>
                            );
                        })}

                        {/* Bouton de soumission */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-neutral-500 text-center sm:text-left flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4 text-neutral-400" />
                                Vos données restent confidentielles et sécurisées.
                            </p>

                            <button
                                type="submit"
                                disabled={processing || answeredCount < totalCount}
                                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 ${
                                    answeredCount === totalCount && !processing
                                        ? 'bg-primary-500 hover:bg-primary-600 active:scale-[0.99] cursor-pointer'
                                        : 'bg-neutral-300 cursor-not-allowed opacity-70'
                                }`}
                            >
                                {processing ? (
                                    <span>Génération du bilan en cours...</span>
                                ) : (
                                    <>
                                        <span>Valider et voir le bilan</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}