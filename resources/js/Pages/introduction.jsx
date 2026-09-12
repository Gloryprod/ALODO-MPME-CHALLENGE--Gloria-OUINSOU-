import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Portail Diagnostic" />

            <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col justify-between">
                {/* En-tête / Navbar */}
                <header className="bg-white border-b border-gray-100 py-4 px-6 sm:px-12">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary-500/20">
                                A
                            </div>
                            <span className="font-bold text-xl text-brand-dark tracking-tight">
                                ALODO MPME Diagnostic - Introduction
                            </span>
                        </div>
                    </div>
                </header>

                {/* Contenu Principal */}
                <main className="max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
                    {/* Badge Hero */}
                    <div className="inline-flex items-center space-x-2 self-start bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                        <span>Évaluation guidée par l'Intelligence Artificielle</span>
                    </div>

                    {/* Titre & Description */}
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight mb-4">
                        Évaluez la maturité numérique et organisationnelle de votre entreprise
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl">
                        Obtenez une analyse personnalisée et un plan d'action concret en quelques minutes. 
                        Notre outil évalue vos processus clés et formule des recommandations adaptées aux enjeux de votre secteur.
                    </p>

                    {/* Cartes d'information clés */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Objectif */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="font-bold text-brand-dark mb-1">Objectif clair</h2>
                            <p className="text-sm text-gray-600">
                                Identifier vos forces, axes de vulnérabilité et opportunités de digitalisation.
                            </p>
                        </div>

                        {/* Durée */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="font-bold text-brand-dark mb-1">Durée estimée</h2>
                            <p className="text-sm text-gray-600">
                                10 à 15 minutes réparties en 2 étapes simples et guidées.
                            </p>
                        </div>

                        {/* Principe */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="font-bold text-brand-dark mb-1">Principe adaptatif</h2>
                            <p className="text-sm text-gray-600">
                                Profilage rapide suivi d'un questionnaire sur-mesure généré pour votre activité.
                            </p>
                        </div>
                    </div>

                    {/* Bloc d'action / CTA */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/diagnostic/phase-1"
                            className="w-full sm:w-auto text-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Commencer le diagnostic →
                        </Link>
                        <span className="text-xs text-gray-500">
                            Sans inscription préalable requise
                        </span>
                    </div>
                </main>

                {/* Pied de page */}
                <footer className="py-6 px-6 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
                    © {new Date().getFullYear()} Diagnostic MPME — Plateforme d'auto-évaluation organisationnelle.
                </footer>
            </div>
        </>
    );
}