import React, { useState, useEffect } from 'react';
import IconLocation from "@/components/icon/IconLocation";
import MonthlyPrayerTimes from "./monthlyPrayerTimes";
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import SimpleCard from '@/components/layout/SimpleCard';
import { useNotifications } from '@/hooks/useNotifications';
import VerseCard from '@/components/content/VerseCard';
import { cityNamesMap } from '@/enums';

const CurrentTimeAndIftarCountdown = () => {
    const { city, changeCity, loading: locationLoading } = useLocation();
    const { data: iftarData, monthlyData, dates, loading: timesLoading, error } = usePrayerTimes(city);

    useNotifications(iftarData);

    const [countdown, setCountdown] = useState<string>('');
    const sortedCities = React.useMemo(() => {
        return Array.from(new Set(Object.values(cityNamesMap))).sort();
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const filteredCities = React.useMemo(() => {
        return sortedCities.filter(c =>
            c.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedCities, searchTerm]);

    // Close dropdown when outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search when dropdown closes
    useEffect(() => {
        if (!isDropdownOpen) {
            setSearchTerm('');
        }
    }, [isDropdownOpen]);

    // Countdown logic
    useEffect(() => {
        if (!iftarData?.iftarTime) return;

        const updateCountdown = () => {
            const now = new Date();
            const iftarTimeArr = iftarData.iftarTime.split(/[- :]/);
            const iftarDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                parseInt(iftarTimeArr[0]), parseInt(iftarTimeArr[1]), 0);

            const difference = iftarDate.getTime() - now.getTime();

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setCountdown(`${hours} saat ${minutes} dakika ${seconds} saniye`);
            } else {
                setCountdown('Hayırlı İftarlar!');
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [iftarData]);

    if (locationLoading) {
        return (
            <SimpleCard className="flex items-center justify-center min-h-[400px]">
                <div className="text-xl font-medium text-gray-500 animate-pulse">Konum Bulunuyor...</div>
            </SimpleCard>
        );
    }

    if (error) {
        return (
            <SimpleCard className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-xl font-semibold text-red-500 mb-4">{error}</div>
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between min-w-[200px] gap-2 bg-primary-50 border border-primary-200 text-gray-700 py-3 px-6 rounded-full focus:outline-none focus:bg-white focus:border-primary-500 transition-all font-medium"
                    >
                        {city || 'Şehir Seçiniz'}
                        <svg
                            className={`fill-current h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-[300px] overflow-hidden animate-fade-in flex flex-col">
                            <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                                <input
                                    type="text"
                                    placeholder="Şehir Ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="overflow-y-auto overflow-x-hidden flex-1">
                                {filteredCities.length > 0 ? (
                                    filteredCities.map((c) => (
                                        <div
                                            key={c}
                                            onClick={() => {
                                                changeCity(c);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-3 cursor-pointer transition-colors text-left text-sm
                                                ${c === city ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                            `}
                                        >
                                            {c}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-400 text-center">Şehir bulunamadı</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </SimpleCard>
        );
    }

    return (
        <div className="w-full mx-auto space-y-8 animate-fade-in max-w-4xl">
            {iftarData ? (
                <SimpleCard className="relative overflow-visible text-center !p-10 border-t-8 border-primary-500">
                    <div className="flex flex-col items-center z-10 relative">
                        <div className="relative mb-4" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-all cursor-pointer border border-transparent hover:border-gray-200"
                            >
                                <IconLocation className="w-5 h-5 text-primary-500" />
                                <span className="text-2xl font-bold tracking-tight">{iftarData.city}</span>
                                <svg
                                    className={`h-4 w-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[300px] overflow-hidden animate-fade-in text-left flex flex-col">
                                    <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                                        <input
                                            type="text"
                                            placeholder="Şehir Ara..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 bg-white"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="overflow-y-auto overflow-x-hidden flex-1">
                                        {filteredCities.length > 0 ? (
                                            filteredCities.map((c) => (
                                                <div
                                                    key={c}
                                                    onClick={() => {
                                                        changeCity(c);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`px-4 py-3 cursor-pointer transition-colors text-sm border-b border-gray-50 last:border-0
                                                        ${c === city ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                                    `}
                                                >
                                                    {c}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-400 text-center">Şehir bulunamadı</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-gray-500 text-lg mb-10 font-medium">{iftarData.today}</div>

                        <div className="mb-12 w-full px-2">
                            <div className="text-3xl sm:text-6xl font-bold text-gray-800 mb-2 tabular-nums tracking-tight leading-tight">
                                {countdown}
                            </div>
                            <p className="text-center text-primary-600 font-semibold uppercase tracking-widest text-sm sm:text-lg">İftara Kalan Süre</p>
                        </div>

                        {/* Minimal Grid for Times */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 w-full">
                            {iftarData.times.map((time: string, index: number) => {
                                const labels = ["İmsak", "Güneş", "Öğle", "İkindi", "İftar", "Yatsı"];
                                const isIftar = index === 4;
                                return (
                                    <div key={index}
                                        className={`p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-all
                                        ${isIftar ? 'bg-primary-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                                        <div className={`text-lg font-bold mb-1 ${isIftar ? 'text-white' : 'text-gray-900'}`}>
                                            {time}
                                        </div>
                                        <div className={`text-[10px] sm:text-xs uppercase tracking-wider font-medium ${isIftar ? 'text-white/90' : 'text-gray-500'}`}>
                                            {labels[index]}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </SimpleCard>
            ) : (
                <SimpleCard className="flex items-center justify-center min-h-[300px]">
                    <div className="text-gray-400">Veriler yükleniyor...</div>
                </SimpleCard>
            )}

            <VerseCard />

            <SimpleCard>
                <MonthlyPrayerTimes monthlyTimes={monthlyData} dates={dates} />
            </SimpleCard>
        </div>
    );
};

export default CurrentTimeAndIftarCountdown;
