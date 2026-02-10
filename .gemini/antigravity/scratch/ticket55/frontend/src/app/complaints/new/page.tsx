'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useComplaints, ComplaintPriority } from '@/hooks/useComplaints';
import { useAI } from '@/hooks/useAI';
import {
    Shield,
    ArrowLeft,
    Send,
    User,
    MapPin,
    Phone,
    AlertCircle,
    FileText,
    CheckCircle2,
    Sparkles,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewComplaintPage() {
    const router = useRouter();
    const { createComplaint } = useComplaints();
    const { classifyComplaint, loading: aiLoading } = useAI();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        leakType: 'Fuite visible',
        description: '',
        priority: 'medium' as ComplaintPriority,
    });

    const handleAIClassify = async () => {
        if (!formData.description) {
            toast.error('Veuillez d\'abord saisir une description');
            return;
        }

        const result = await classifyComplaint(formData.description, formData.address);
        if (result.success && result.classification) {
            const { priority, category, subcategory } = result.classification;
            setFormData(prev => ({
                ...prev,
                priority: priority as ComplaintPriority,
                leakType: subcategory || category || prev.leakType
            }));
            toast.success('IA: Classification suggérée appliquée !');
        } else {
            toast.error(result.error || 'Erreur IA');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.address || !formData.phone || !formData.leakType) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setIsSubmitting(true);
        const result = await createComplaint(formData);
        setIsSubmitting(false);

        if (result.success) {
            toast.success('Réclamation enregistrée avec succès');
            router.push('/complaints');
        } else {
            toast.error(result.error || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Nouvelle Réclamation</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Formulaire d'admission d'incident</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/complaints')}
                        className="text-sm font-bold text-slate-500 hover:text-primary transition-colors px-4 py-2"
                    >
                        Annuler
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-[800px] mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Client Info */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="font-bold text-lg">Informations du Demandeur</h2>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Prénom *</label>
                                    <input
                                        required
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Jean"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Nom *</label>
                                    <input
                                        required
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Dupont"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Téléphone *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="+213 XX XX XX XX"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Incident Details */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                </div>
                                <h2 className="font-bold text-lg">Détails de l'Incident</h2>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Type de Fuite *</label>
                                        <select
                                            name="leakType"
                                            value={formData.leakType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                        >
                                            <option value="Fuite visible">Fuite visible</option>
                                            <option value="Baisse de pression">Baisse de pression</option>
                                            <option value="Infiltration murale">Infiltration murale</option>
                                            <option value="Compteur défectueux">Compteur défectueux</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Priorité</label>
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                            {(['low', 'medium', 'high', 'urgent'] as ComplaintPriority[]).map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${formData.priority === p
                                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Adresse Exacte *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Adresse précise de l'intervention"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Description (Optionnel)</label>
                                        <button
                                            type="button"
                                            onClick={handleAIClassify}
                                            disabled={aiLoading}
                                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                        >
                                            {aiLoading ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-3 h-3" />
                                            )}
                                            Analyse IA
                                        </button>
                                    </div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Plus de précisions sur le problème..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                        <span>Envoi...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Enregistrer la Réclamation</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
