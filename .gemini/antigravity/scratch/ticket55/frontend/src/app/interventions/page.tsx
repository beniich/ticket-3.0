'use client';

import React, { useState } from 'react';
import { useInterventions, Intervention, InterventionStatus } from '@/hooks/useInterventions';
import {
    Search,
    SlidersHorizontal,
    Plus,
    Kanban,
    List,
    MoreVertical,
    MapPin,
    Clock,
    Wrench,
    X,
    Edit,
    Trash2,
    CheckCircle,
    User,
    AlertCircle,
    MessageSquare,
    Phone,
    Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterventionsPage() {
    const { interventions, loading, error, updateIntervention } = useInterventions();
    const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredInterventions = interventions.filter(int =>
        int.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        int.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getColumnInterventions = (status: InterventionStatus) => {
        return filteredInterventions.filter(int => int.status === status);
    };

    const handleStatusChange = async (id: string, newStatus: InterventionStatus) => {
        const result = await updateIntervention(id, { status: newStatus });
        if (result.success) {
            toast.success(`Statut mis à jour vers ${newStatus}`);
            if (selectedIntervention && selectedIntervention._id === id) {
                setSelectedIntervention(result.data);
            }
        } else {
            toast.error(result.error || 'Erreur lors de la mise à jour');
        }
    };

    const columns: { label: string; status: InterventionStatus; color: string }[] = [
        { label: 'En attente', status: 'En attente', color: 'slate' },
        { label: 'En cours', status: 'En cours', color: 'blue' },
        { label: 'Validation', status: 'Validation', color: 'purple' },
        { label: 'Terminé', status: 'Terminé', color: 'emerald' },
    ];

    if (loading && interventions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Wrench className="text-primary w-6 h-6" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">Interventions</h1>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">
                        {interventions.filter(i => i.status !== 'Terminé').length} Actives
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <Kanban className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm font-bold">
                        <Plus className="w-4 h-4" />
                        Nouveau Ticket
                    </button>
                </div>
            </header>

            {/* Filters Toolbar */}
            <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-transparent backdrop-blur-sm sticky top-16 z-30">
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 w-64 text-sm transition-all"
                        placeholder="Rechercher une intervention..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtres
                </button>
            </div>

            {/* Main Content: Kanban Board */}
            <main className="flex-1 overflow-x-auto p-6 scrollbar-hide">
                <div className="flex gap-6 min-w-max h-full">
                    {columns.map(col => (
                        <div key={col.status} className="w-80 flex flex-col h-full group/column">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-black text-[11px] uppercase tracking-widest ${col.color === 'blue' ? 'text-blue-500' :
                                            col.color === 'purple' ? 'text-purple-500' :
                                                col.color === 'emerald' ? 'text-emerald-500' :
                                                    'text-slate-400'
                                        }`}>
                                        {col.label}
                                    </h3>
                                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {getColumnInterventions(col.status).length}
                                    </span>
                                </div>
                                <button className="text-slate-400 hover:text-primary opacity-0 group-hover/column:opacity-100 transition-opacity">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/40 rounded-3xl p-3 space-y-4 overflow-y-auto border border-dashed border-slate-200 dark:border-slate-800">
                                {getColumnInterventions(col.status).map(int => (
                                    <div
                                        key={int._id}
                                        onClick={() => setSelectedIntervention(int)}
                                        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 cursor-pointer transition-all group/card"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${int.priority === 'Critique' ? 'bg-red-50 text-red-600' :
                                                    int.priority === 'Haute' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-slate-50 text-slate-500'
                                                }`}>
                                                {int.priority}
                                            </span>
                                            <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover/card:text-primary transition-colors">
                                            {int.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                                            {int.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                            <MapPin className="w-3 h-3 text-primary" />
                                            <span className="truncate">{int.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                                    {int.teamId?.name?.[0] || 'T'}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{int.teamId?.name || 'Non assignée'}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">2h 15m</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {getColumnInterventions(col.status).length === 0 && (
                                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl opacity-20">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vide</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Details Modal */}
            {selectedIntervention && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Modal Header */}
                        <div className="h-16 border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedIntervention(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                                    <X className="w-5 h-5" />
                                </button>
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Intervention Detail</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedIntervention.status !== 'Terminé' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedIntervention._id, 'Terminé')}
                                        className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        MARQUER TERMINÉ
                                    </button>
                                )}
                                <button className="p-2 text-slate-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-1 rounded">
                                        {selectedIntervention.status}
                                    </span>
                                    <span className="text-slate-400 text-xs font-medium">Ticket ID: {selectedIntervention._id.slice(-6).toUpperCase()}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedIntervention.title}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lieu</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {selectedIntervention.location}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Équipe</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" />
                                        {selectedIntervention.teamId?.name || 'Non assignée'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Description
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                                    {selectedIntervention.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center justify-between">
                                    <span>Checklist de Sécurité</span>
                                    <span className="text-[10px] font-black text-slate-400">0/3 Complétés</span>
                                </h4>
                                <div className="space-y-2">
                                    {['Sécurisation du périmètre', 'Coupure eau/gaz', 'Équipement de protection'].map((task, i) => (
                                        <label key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary appearance-none transition-all" />
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{task}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex gap-3">
                                <input
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Ajouter une note de suivi..."
                                />
                                <button className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
