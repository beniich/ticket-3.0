'use client';

import { useState } from 'react';
import { Preferences } from '@/types/settings';

interface AppPreferencesProps {
    preferences: Preferences;
    onUpdate: (preferences: Partial<Preferences>) => void;
}

export function AppPreferences({ preferences, onUpdate }: AppPreferencesProps) {
    const [localPrefs, setLocalPrefs] = useState(preferences);

    const handleLanguageChange = (language: string) => {
        setLocalPrefs(prev => ({ ...prev, language }));
        onUpdate({ language });
    };

    const toggleDarkMode = () => {
        const newValue = !localPrefs.darkMode;
        setLocalPrefs(prev => ({ ...prev, darkMode: newValue }));
        onUpdate({ darkMode: newValue });
    };

    const toggleCompactView = () => {
        const newValue = !localPrefs.compactView;
        setLocalPrefs(prev => ({ ...prev, compactView: newValue }));
        onUpdate({ compactView: newValue });
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-icons text-primary">tune</span>
                    App Preferences
                </h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Interface Language</label>
                    <select
                        className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary"
                        value={localPrefs.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>
                <div className="pt-4 flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Dark Mode</p>
                        <p className="text-xs text-slate-500">Toggle system appearance</p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-6 rounded-full relative flex items-center transition-colors ${localPrefs.darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                    >
                        <div
                            className={`absolute w-4 h-4 bg-white rounded-full transition-all ${localPrefs.darkMode ? 'right-1' : 'left-1'
                                }`}
                        ></div>
                    </button>
                </div>
                <div className="pt-4 flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Compact View</p>
                        <p className="text-xs text-slate-500">Reduce padding in lists</p>
                    </div>
                    <button
                        onClick={toggleCompactView}
                        className={`w-12 h-6 rounded-full relative flex items-center transition-colors ${localPrefs.compactView ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                    >
                        <div
                            className={`absolute w-4 h-4 bg-white rounded-full transition-all ${localPrefs.compactView ? 'right-1' : 'left-1'
                                }`}
                        ></div>
                    </button>
                </div>
            </div>
        </section>
    );
}
