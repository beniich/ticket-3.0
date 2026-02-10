'use client';

import { EvidencePhoto } from '@/types/ticket';

interface EvidencePhotosProps {
    photos: EvidencePhoto[];
}

export function EvidencePhotos({ photos }: EvidencePhotosProps) {
    return (
        <div className="bg-surface-dark rounded-xl shadow-xl border border-border-dark overflow-hidden">
            <div className="p-4 border-b border-border-dark bg-slate-800/50">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">
                    Evidence & Photos
                </h4>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="aspect-square rounded-xl bg-slate-800 overflow-hidden relative group cursor-pointer border border-slate-700 shadow-inner"
                        >
                            <img
                                alt={photo.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={photo.url}
                            />
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-xs">
                    <span className="material-symbols-outlined text-base">cloud_upload</span> Upload Document
                </button>
            </div>
        </div>
    );
}
