import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Trophy, 
    Building2, 
    Download, 
    RotateCcw,
    Target,
    ArrowRight
} from 'lucide-react';

export default function Report({ diagnostic }) {
    // Récupération des données depuis Inertia
    const { company, global_score, summary, dimension_scores } = diagnostic || {};

    console.log('Diagnostic Data:', dimension_scores); // Pour débogage, à retirer en production

    // Transformation de l'objet dimension_scores en tableau exploitable
    const dimensionsList = React.useMemo(() => {
        if (!dimension_scores) return [];

        let parsedScores = dimension_scores;

        // 1. Si les données arrivent sous forme de chaîne de caractères (string)
        if (typeof parsedScores === 'string') {
            try {
                parsedScores = JSON.parse(parsedScores);
            } catch (error) {
                console.error("Erreur de décodage JSON pour dimension_scores:", error);
                return [];
            }
        }

        // 2. Extraire et transformer les dimensions (Comptabilité, Digitalisation, Commercial...)
        if (typeof parsedScores === 'object' && parsedScores !== null) {
            return Object.entries(parsedScores).map(([dimensionName, data]) => ({
                name: dimensionName,
                score: data?.score || 0,
                recommendations: data?.recommendations || [],
            }));
        }

        return [];
    }, [dimension_scores]);

    console.log('Dimensions List:', dimensionsList); // Pour débogage, à retirer en production

    // Couleur et statut en fonction du score global
    const getScoreBadge = (score) => {
        if (score >= 75) return { label: 'Excellente maturité', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        if (score >= 50) return { label: 'Maturité intermédiaire', color: 'bg-amber-50 text-amber-700 border-amber-200' };
        return { label: 'Maturité à consolider', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    };

    // Style des badges de priorité pour les recommandations
    const getPriorityBadge = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'haute':
            case 'high':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'moyenne':
            case 'medium':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const scoreInfo = getScoreBadge(global_score || 0);
    const companyName = company?.name || 'Entreprise';
    const companySector = company?.sector || 'Secteur non renseigné';

    return (
        <>
            <Head title={`Rapport Diagnostic - ${companyName}`} />

            <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Entête & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                Référentiel ALODO MPME
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                                Bilan du Diagnostic Organisationnel
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <Download className="w-4 h-4 text-slate-500" />
                                Imprimer / PDF
                            </button>
                            <Link
                                href="/diagnostic/phase-1"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Nouveau diagnostic
                            </Link>
                        </div>
                    </div>

                    {/* Fiche Synthèse Executive & Score */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                       
                        <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-slate-800">{companyName}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">{companySector}</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Synthèse Exécutive
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {summary || "Aucune synthèse disponible pour ce diagnostic."}
                            </p>
                        </div>

                        {/* Bloc Score Global */}
                        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                            <Trophy className="w-8 h-8 text-amber-500 mb-2" />
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Score Global de Maturité
                            </span>
                            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 my-2">
                                {Math.round(global_score || 0)}
                                <span className="text-lg font-normal text-slate-400">/100</span>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${scoreInfo.color}`}>
                                {scoreInfo.label}
                            </span>
                        </div>
                    </div>

                    {/* Section : Dimensions & Recommandations */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-900">
                                    Résultats & Recommandations par Dimension
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                                Diagnostic ALODO - Phase 2
                            </span>
                        </div>

                        {dimensionsList.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                                Aucune dimension trouvée dans le rapport.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {dimensionsList.map((dim, index) => (
                                    <div 
                                        key={index} 
                                        className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 space-y-4"
                                    >
                                        {/* Entête Dimension avec barre de progression */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-3">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-slate-900 text-base">
                                                    {dim.name}
                                                </h4>
                                                <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            dim.score >= 75 ? 'bg-emerald-500' : dim.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                        style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-lg font-extrabold text-blue-600 self-start sm:self-auto">
                                                {Math.round(dim.score)} <span className="text-xs font-normal text-slate-400">/ 100</span>
                                            </span>
                                        </div>

                                        {/* Liste des recommandations */}
                                        <div className="space-y-3 pt-1">
                                            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Plan d'action recommandé ({dim.recommendations?.length || 0})
                                            </h5>

                                            {!dim.recommendations || dim.recommendations.length === 0 ? (
                                                <p className="text-xs text-slate-500 italic">
                                                    Aucune recommandation spécifique pour cette dimension.
                                                </p>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {dim.recommendations.map((rec, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${getPriorityBadge(rec.priority)}`}>
                                                                    Priorité {rec.priority}
                                                                </span>
                                                            </div>

                                                            <div className="space-y-1.5 text-xs">
                                                                <p className="text-slate-800 font-medium leading-relaxed">
                                                                    <strong className="text-slate-900 font-semibold">Constat / Frein :</strong> {rec.issue}
                                                                </p>
                                                                <p className="text-slate-700 leading-relaxed flex items-start gap-1.5">
                                                                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                                                    <span><strong className="text-slate-900 font-semibold">Action corrective :</strong> {rec.action}</span>
                                                                </p>
                                                                {rec.impact && (
                                                                    <p className="text-emerald-700 font-medium leading-relaxed bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                                                                        <strong>Impact attendu :</strong> {rec.impact}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}