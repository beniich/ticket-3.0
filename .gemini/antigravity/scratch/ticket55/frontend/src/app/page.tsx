import React from 'react';
import {
    Zap,
    ShieldCheck,
    ArrowRight,
    Map as MapIcon,
    Users,
    BarChart3,
    CheckCircle2,
    Globe,
    Share2,
    Mail,
    ChevronRight,
    PlayCircle
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg shadow-primary/20 bg-primary">
                            <Zap size={22} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Reclam<span className="text-primary">Track</span></h2>
                    </div>
                    <nav className="hidden lg:flex items-center gap-10">
                        {['Solutions', 'Methodology', 'Enterprise', 'Resources'].map((item) => (
                            <a key={item} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-300" href="#">{item}</a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="hidden sm:block text-sm font-black text-slate-700 dark:text-slate-200 hover:text-primary transition-colors px-6 py-2">
                            Sign In
                        </a>
                        <a href="/dashboard" className="bg-primary text-white text-sm font-black px-8 py-3 rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Launch App
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="flex flex-col gap-10 max-w-2xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 w-fit animate-fade-in opacity-0 [animation-fill-mode:forwards]">
                            <ShieldCheck size={14} />
                            v2.4 Is Now Live • Strategic Update
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-slate-900 dark:text-white">
                            Modern Ops for <span className="text-primary italic">Smart</span> Cities.
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            The ultimate operating system for municipal services. Manage citizen complaints, optimize field crews, and drive efficiency with real-time geospatial intelligence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <a href="/dashboard" className="bg-primary text-white h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 group hover:scale-[1.03] active:scale-95">
                                Start Free Trial
                                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                            </a>
                            <button className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 h-16 px-10 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                                <PlayCircle size={20} className="text-primary" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-12 flex flex-col gap-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Trusted by Forward-Thinking Administrations</p>
                            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                <div className="text-2xl font-black tracking-tighter">CITILINK</div>
                                <div className="text-2xl font-black tracking-tighter italic">METROFLOW</div>
                                <div className="text-2xl font-black tracking-tighter">URBANGRID</div>
                                <div className="text-2xl font-black tracking-tighter">GOVCORE</div>
                            </div>
                        </div>
                    </div>

                    {/* Immersive Mockup Visual */}
                    <div className="relative perspective-1000 hidden lg:block animate-fade-in-right opacity-0 [animation-fill-mode:forwards] [animation-delay:300ms]">
                        <div className="absolute -inset-20 bg-primary/10 blur-[120px] rounded-full"></div>
                        <div className="relative transform rotate-y-[-10deg] rotate-x-6 hover:rotate-0 transition-transform duration-1000 p-2 bg-gradient-to-br from-slate-200 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
                            <div className="bg-white dark:bg-slate-900 rounded-[2.2rem] overflow-hidden border border-white dark:border-slate-800 aspect-[5/4] flex flex-col">
                                <div className="h-14 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6">
                                    <div className="flex gap-2">
                                        <div className="size-3 rounded-full bg-rose-500" />
                                        <div className="size-3 rounded-full bg-amber-500" />
                                        <div className="size-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                </div>
                                <div className="flex-1 p-8 grid grid-cols-6 gap-6">
                                    <div className="col-span-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                        <MapIcon size={80} className="text-slate-200 dark:text-slate-700" />
                                    </div>
                                    <div className="col-span-2 space-y-4">
                                        <div className="h-32 bg-primary/5 rounded-3xl border border-primary/10"></div>
                                        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800"></div>
                                        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Pillars Section */}
            <section className="bg-slate-50 dark:bg-slate-900/30 py-32 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            {
                                icon: MapIcon,
                                title: "Geospatial HQ",
                                desc: "Visualize your entire operation on a live, multi-layered map with real-time GPS fleet tracking."
                            },
                            {
                                icon: Users,
                                title: "Force Deployment",
                                desc: "Dispatch crews with precision, manage workloads, and sync on-site reporting instantly."
                            },
                            {
                                icon: BarChart3,
                                title: "Strategic Intel",
                                desc: "Turn raw operational data into actionable dashboards for budget and policy optimization."
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="flex flex-col gap-6 group">
                                <div className="size-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary shadow-sm group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                    <pillar.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">{pillar.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-10">
                    <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">Ready to lead the change?</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                        Schedule a personalized consultation with our urban engineering team to find the perfect fit for your municipality.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <input className="max-w-md w-full h-16 px-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 outline-none focus:border-primary transition-all font-bold" placeholder="your@email.com" />
                        <button className="bg-black dark:bg-white text-white dark:text-black h-16 px-12 rounded-2xl font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3">
                            Talk to Us
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white bg-primary">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">ReclamTrack</h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
                            Pioneering municipal OS for modern administrative infrastructure. Building more resilient and responsive cities since 2018.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8">Ecosystem</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                            <li><a href="#" className="hover:text-primary transition-colors">Field App</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">GeoEngine</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Asset Manager</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8">Gov Support</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                            <li><a href="#" className="hover:text-primary transition-colors">GDPR & Security</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8">Connect</h4>
                        <div className="flex gap-6 mt-2">
                            <a href="#" className="text-slate-400 hover:text-primary transition-all"><Globe size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-all"><Share2 size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-all"><Mail size={20} /></a>
                        </div>
                    </div>
                </div>
            </footer >
        </div>
    );
}
