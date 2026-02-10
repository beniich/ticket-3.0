'use client';

import React, { useState } from 'react';
import { useTeams, Team } from '@/hooks/useTeams';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Phone,
    Mail,
    MapPin,
    Star,
    ChevronDown,
    UserPlus,
    LayoutGrid,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamsPage() {
    const { teams, loading, error, updateTeamStatus } = useTeams();
    const [activeTab, setActiveTab] = useState('All Teams');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusChange = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'disponible' ? 'intervention' :
            currentStatus === 'intervention' ? 'repos' : 'disponible';
        const result = await updateTeamStatus(id, nextStatus);
        if (result.success) {
            toast.success(`Statut mis à jour vers ${nextStatus}`);
        } else {
            toast.error(result.error);
        }
    };

    if (loading && teams.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Users className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Team Management</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700">
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-xs font-black uppercase tracking-widest">
                        <Plus className="w-4 h-4" />
                        Create Team
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto space-y-8">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-full md:w-auto backdrop-blur-sm">
                            {['All Teams', 'Technical', 'Maintenance', 'Emergency'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-primary" />
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                                    placeholder="Search teams or technicians..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all shadow-sm hover:scale-105">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTeams.map((team) => (
                            <div key={team._id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all group flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <button
                                        onClick={() => handleStatusChange(team._id, team.status)}
                                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm transition-all hover:scale-105 ${team.status === 'disponible' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                team.status === 'intervention' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}
                                    >
                                        {team.status}
                                    </button>
                                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Unité Opérationnelle</p>

                                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {(team.members || []).slice(0, 3).map((m: any, i: number) => (
                                            <div key={i} className="size-9 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-black">
                                                {m.firstName?.[0] || 'U'}
                                            </div>
                                        ))}
                                        {team.members?.length > 3 && (
                                            <div className="size-9 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">
                                                +{team.members.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{team.members?.length || 0} Membres</span>
                                </div>

                                <button className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    Voir Planning
                                </button>
                            </div>
                        ))}

                        {filteredTeams.length === 0 && (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 opacity-50">
                                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-500">Aucune équipe trouvée</p>
                            </div>
                        )}
                    </div>

                    {/* Technicians List */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-12">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Répertoire Techniciens</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Expertise & Disponibilité Temps Réel</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5 text-left">Personnel</th>
                                        <th className="px-8 py-5 text-left">Expertise</th>
                                        <th className="px-8 py-5 text-left">Assignation</th>
                                        <th className="px-8 py-5 text-left">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {teams.flatMap(t => t.members || []).map((tech: any, i) => (
                                        <tr key={tech._id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary group-hover:bg-primary group-hover:text-white transition-all uppercase">
                                                        {tech.firstName?.[0]}{tech.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{tech.firstName} {tech.lastName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tech.role || 'Technicien'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Maintenance</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500">Équipe Active</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-2 rounded-full bg-emerald-500"></div>
                                                    <span className="text-[10px] font-black uppercase">Disponible</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all"><Phone size={16} /></button>
                                                    <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all"><Mail size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
