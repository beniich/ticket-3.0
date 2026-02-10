'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useComplaint, ComplaintStatus } from '@/hooks/useComplaints';
import { useTeams } from '@/hooks/useTeams';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    ChevronLeft,
    MoreVertical,
    Calendar,
    MapPin,
    Phone,
    User,
    Clock,
    CheckCircle2,
    AlertTriangle,
    MessageSquare,
    ArrowRight,
    UserPlus,
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { complaint, loading, error, updateComplaint, assignTeam } = useComplaint(id);
    const { teams } = useTeams();
    const [newNote, setNewNote] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const handleStatusUpdate = async (newStatus: ComplaintStatus) => {
        setIsUpdating(true);
        const result = await updateComplaint({ status: newStatus });
        setIsUpdating(false);

        if (result.success) {
            toast.success(`Statut mis à jour: ${newStatus}`);
        } else {
            toast.error(result.error || 'Erreur lors de la mise à jour');
        }
    };

    const handleAssignTeam = async (teamId: string) => {
        setIsAssigning(true);
        const result = await assignTeam(teamId);
        setIsAssigning(false);
        setShowAssignModal(false);

        if (result.success) {
            toast.success('Équipe assignée avec succès !');
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-4 max-w-md text-center">
                    {error || 'Réclamation introuvable'}
                </div>
                <button onClick={() => router.push('/complaints')} className="text-primary font-bold hover:underline">
                    Retour à la liste
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-100 min-h-screen font-display pb-20 lg:pb-0">
            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Assigner une Équipe</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Services Opérationnels Disponibles</p>
                        </div>
                        <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                            {teams.map(team => (
                                <button
                                    key={team._id}
                                    onClick={() => handleAssignTeam(team._id)}
                                    disabled={isAssigning}
                                    className="w-full p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 text-left transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{team.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{team.status}</p>
                                    </div>
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </button>
                            ))}
                            {teams.length === 0 && (
                                <p className="text-center py-8 text-slate-500 text-sm font-bold">Aucune équipe opérationnelle trouvée</p>
                            )}
                        </div>
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Nav */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => router.push('/complaints')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
                                <span>Ticket Management</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-primary">{complaint.number}</span>
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Détails de l'Intervention</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-6 md:p-8">
                {/* Hero Summary */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${complaint.status === 'résolue' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                complaint.status === 'en cours' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-purple-50 text-purple-600 border-purple-100'
                                }`}>
                                {complaint.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${complaint.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                                complaint.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    'bg-slate-50 text-slate-600 border-slate-100'
                                }`}>
                                Priority: {complaint.priority || 'low'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{complaint.leakType}</h2>
                        <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <Calendar className="w-4 h-4" />
                            Créé le {format(new Date(complaint.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {complaint.status !== 'résolue' && (
                            <button
                                onClick={() => handleStatusUpdate('résolue')}
                                disabled={isUpdating}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4" />
                                MARQUER COMME RÉSOLUE
                            </button>
                        )}
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <UserPlus className="w-4 h-4" />
                            ASSIGNER ÉQUIPE
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Details & Notes */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Description Card */}
                        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                                <Clock className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Description de la Réclamation</h3>
                            </div>
                            <div className="p-8">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {complaint.description || "Aucune description supplémentaire fournie pour cette réclamation."}
                                </p>
                            </div>
                        </section>

                        {/* Note Input */}
                        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-8">
                            <h3 className="font-bold mb-6 flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Notes d'Intervention
                            </h3>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs flex-shrink-0">
                                    AD
                                </div>
                                <div className="flex-1 space-y-3">
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-100"
                                        placeholder="Ajouter une note de suivi..."
                                        rows={3}
                                    />
                                    <div className="flex justify-end">
                                        <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition-all">
                                            Publier la Note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Info Panels */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Customer Info */}
                        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Client Info</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                        {complaint.firstName[0]}{complaint.lastName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{complaint.firstName} {complaint.lastName}</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Reported via App</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                        <span className="font-medium">{complaint.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                        <span className="font-medium">{complaint.phone}</span>
                                    </div>
                                </div>
                                <button className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Appeler le Client
                                </button>
                            </div>
                        </section>

                        {/* Assignment Status */}
                        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Assignment</h3>
                            </div>
                            <div className="p-8 text-center">
                                {complaint.assignedTo ? (
                                    <div className="space-y-4">
                                        <div className="size-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-2">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Team Alpha Dispatched</p>
                                            <p className="text-xs text-slate-500">Assigned 2 hours ago</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-4">
                                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                                            <AlertTriangle className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-500">Pas d'équipe assignée</p>
                                        <button className="text-primary font-bold text-xs hover:underline uppercase tracking-widest">Assigner Maintenant</button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
