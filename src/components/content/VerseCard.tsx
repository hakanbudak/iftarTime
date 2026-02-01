import React from 'react';
import SimpleCard from '@/components/layout/SimpleCard';
import { useVerse } from '@/hooks/useVerse';

const VerseCard = () => {
    const { verse, loading, isPlaying, togglePlay } = useVerse();

    if (loading) {
        return (
            <SimpleCard className="flex items-center justify-center min-h-[150px] animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </SimpleCard>
        );
    }

    if (!verse) return null;

    return (
        <SimpleCard className="relative overflow-hidden !p-8 animate-fade-in border-l-4 border-emerald-500 bg-gradient-to-r from-white to-emerald-50/30">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center w-full mb-2">
                    <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100 px-3 py-1 rounded-full">Günün Ayeti</span>
                </div>

                <p className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed italic font-serif">
                    &quot;{verse.translation}&quot;
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
                    <span>{verse.surahName}, {verse.ayahNumber}. Ayet</span>
                </div>

                <button
                    onClick={togglePlay}
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95
                        ${isPlaying
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 shadow-sm'}
                    `}
                >
                    {isPlaying ? (
                        <>
                            <svg className="w-5 h-5 fill-current animate-pulse" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                            <span className="font-medium">Duraklat</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"></path>
                            </svg>
                            <span className="font-medium">Dinle</span>
                        </>
                    )}
                </button>
            </div>
        </SimpleCard>
    );
};

export default VerseCard;
