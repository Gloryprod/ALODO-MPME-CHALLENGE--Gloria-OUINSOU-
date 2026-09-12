import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Phase1Form() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sector: '',
        activity_description: '',
        annual_revenue: '',
        strengths: '',
        weaknesses: '',
        challenges_description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/diagnostic/phase-1');
    };

    return (
        <>
            <Head title="Phase 1 : Profil de l'entreprise" />

            <div className="min-h-screen bg-[#FEFEFE] text-[#0A0A0A] flex flex-col justify-between">
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
                            Étape 1 sur 2
                        </span>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-10 w-full flex-1">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] tracking-tight mb-2">
                            Phase 1 : Profil de l'entreprise
                        </h1>
                        <p className="text-sm text-gray-600">
                            Renseignez ces informations initiales pour nous permettre de contextualiser l'analyse de votre activité.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-[#0A0A0A] border-b border-gray-100 pb-2">
                                1. Identification générale
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Nom ou raison sociale <span className="text-primary-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ex: AgriBio Bénin"
                                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                                            errors.name ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Secteur d'activité <span className="text-primary-500">*</span>
                                    </label>
                                    <select
                                        value={data.sector}
                                        onChange={(e) => setData('sector', e.target.value)}
                                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white ${
                                            errors.sector ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                                    >
                                        <option value="">Sélectionner un secteur</option>
                                        <option value="Agroalimentaire & Transformation">Agroalimentaire & Transformation</option>
                                        <option value="Commerce & Distribution">Commerce & Distribution</option>
                                        <option value="Services & Conseil">Services & Conseil</option>
                                        <option value="Artisanat & BTP">Artisanat & BTP</option>
                                        <option value="Technologies & Numérique">Technologies & Numérique</option>
                                        <option value="Transport & Logistique">Transport & Logistique</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    {errors.sector && (
                                        <p className="text-xs text-red-500 mt-1">{errors.sector}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Description succincte des activités
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.activity_description}
                                    onChange={(e) => setData('activity_description', e.target.value)}
                                    placeholder="Décrivez vos produits, services principaux et votre cible de clientèle..."
                                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                                            errors.activity_description ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none`}
                                ></textarea>
                                {errors.activity_description && (
                                    <p className="text-xs text-red-500 mt-1">{errors.activity_description}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Chiffre d'affaires annuel estimé (FCFA) 
                                </label>
                                <select
                                    value={data.annual_revenue}
                                    onChange={(e) => setData('annual_revenue', e.target.value)}
                                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white ${
                                        errors.annual_revenue ? 'border-red-500' : 'border-gray-200'
                                    }
                                    focus:outline-none  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                                >
                                    <option value="">Sélectionner une tranche</option>
                                    <option value="Moins de 5 millions FCFA">Moins de 5 millions FCFA</option>
                                    <option value="5 à 15 millions FCFA">5 à 15 millions FCFA</option>
                                    <option value="15 à 50 millions FCFA">15 à 50 millions FCFA</option>
                                    <option value="50 à 250 millions FCFA">50 à 250 millions FCFA</option>
                                    <option value="Plus de 250 millions FCFA">Plus de 250 millions FCFA</option>
                                </select>
                                {errors.annual_revenue && (
                                    <p className="text-xs text-red-500 mt-1">{errors.annual_revenue}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-brand-dark border-b border-gray-100 pb-2">
                                2. Auto-évaluation rapide
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Citez deux à trois de vos points forts <span className="text-primary-500">*</span>
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={data.strengths}
                                        onChange={(e) => setData('strengths', e.target.value)}
                                        placeholder="Ex: Bonne réputation, produit de qualité, clientèle fidèle..."
                                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                                            errors.strengths ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none`}
                                    ></textarea>
                                    {errors.strengths && (
                                        <p className="text-xs text-red-500 mt-1">{errors.strengths}</p>
                                    )}

                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Citez deux à trois de vos points faibles <span className="text-primary-500">*</span>
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={data.weaknesses}
                                        onChange={(e) => setData('weaknesses', e.target.value)}
                                        placeholder="Ex: Suivi comptable informel, manque de visibilité en ligne..."
                                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                                            errors.weaknesses ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none`}
                                    ></textarea>
                                    {errors.weaknesses && (
                                        <p className="text-xs text-red-500 mt-1">{errors.weaknesses}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Difficultés majeures rencontrées au quotidien <span className="text-primary-500">*</span>
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.challenges_description}
                                    onChange={(e) => setData('challenges_description', e.target.value)}
                                    placeholder="Ex: Trésorerie tendue, difficulté d'accès au crédit..."
                                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                                        errors.challenges_description ? 'border-red-500' : 'border-gray-200'
                                    } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none`}
                                ></textarea>
                                {errors.challenges_description && (
                                    <p className="text-xs text-red-500 mt-1">{errors.challenges_description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer w-full sm:w-auto px-8 py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all text-sm flex items-center justify-center space-x-2"
                            >
                                {processing ? (
                                    <span>Enregistrement...</span>
                                ) : (
                                    <>
                                        <span>Passer à la Phase 2 (Questionnaire)</span>
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </main>

                <footer className="py-4 px-6 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
                    © {new Date().getFullYear()} Diagnostic MPME — Phase 1 : Profilage
                </footer>
            </div>
        </>
    );
}