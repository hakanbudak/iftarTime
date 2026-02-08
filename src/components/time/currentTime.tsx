import React, { useState, useEffect } from 'react';
import IconLocation from "@/components/icon/IconLocation";
import MonthlyPrayerTimes from "./monthlyPrayerTimes";
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import SimpleCard from '@/components/layout/SimpleCard';
import { useNotifications } from '@/hooks/useNotifications';
import VerseCard from '@/components/content/VerseCard';
import { cityNamesMap } from '@/enums';
import NotificationButton from '@/components/layout/NotificationButton';
import PwaInstallButton from '@/components/layout/PwaInstallButton';
import { useAdhan } from '@/hooks/useAdhan';
import SahurAlarmButton from '@/components/layout/SahurAlarmButton';

interface Props {
    initialCity?: string;
}

const CurrentTimeAndIftarCountdown = ({ initialCity }: Props) => {
    const { city, changeCity, loading: locationLoading } = useLocation(initialCity);
    const { data: iftarData, monthlyData, dates, loading: timesLoading, error } = usePrayerTimes(city);

    const { permission, requestPermission } = useNotifications(iftarData);
    const { isPlaying, stopAdhan } = useAdhan(iftarData);

    const [countdown, setCountdown] = useState<string>('');
    const [targetLabel, setTargetLabel] = useState<string>('İFTARA KALAN SÜRE');
    const [greeting, setGreeting] = useState<string>('');
    const [ramadanDay, setRamadanDay] = useState<number | null>(null);

    const sortedCities = React.useMemo(() => {
        return Array.from(new Set(Object.values(cityNamesMap))).sort();
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const filteredCities = React.useMemo(() => {
        return sortedCities.filter(c =>
            c.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
        );
    }, [sortedCities, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isDropdownOpen) {
            setSearchTerm('');
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        const now = new Date();
        const ramadanStart = new Date(2026, 1, 19);

        const diffTime = now.getTime() - ramadanStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0 && diffDays <= 30) {
            setRamadanDay(diffDays);
        } else if (diffDays === 0) {
            setRamadanDay(1);
        } else {
            setRamadanDay(null);
        }
    }, []);

    useEffect(() => {
        if (!iftarData?.iftarTime || !iftarData?.sahurTime) return;

        const updateCountdown = () => {
            const now = new Date();

            const parseTime = (timeStr: string) => {
                const [hours, minutes] = timeStr.split(/[- :]/).map(Number);
                const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
                return date;
            };

            const iftarDate = parseTime(iftarData.iftarTime);
            const sahurDate = parseTime(iftarData.sahurTime);

            let targetDate = iftarDate;
            let label = 'İFTARA KALAN SÜRE';
            let nextGreeting = '';
            let newBg = 'bg-gray-50'; // Default

            const hour = now.getHours();

            if (now < sahurDate) {
                targetDate = sahurDate;
                label = 'SAHURA KALAN SÜRE';
                nextGreeting = 'Hayırlı Sahurlar, Bereketli Olsun';
                newBg = 'bg-gradient-to-b from-indigo-50 to-white'; // Night/Sahur
            }
            else if (now >= sahurDate && now < iftarDate) {
                targetDate = iftarDate;
                label = 'İFTARA KALAN SÜRE';
                if (targetDate.getTime() - now.getTime() < 1000 * 60 * 60) {
                    nextGreeting = 'Sabrın sonu selamettir, az kaldı...';
                    newBg = 'bg-gradient-to-b from-orange-50 to-white'; // Evening approach
                } else if (hour >= 11 && hour < 17) {
                    nextGreeting = 'Hayırlı Günler, Kolaylıklar Dilerim';
                    newBg = 'bg-gradient-to-b from-amber-50/50 to-white'; // Day
                } else {
                    nextGreeting = 'Hayırlı Sabahlar';
                    newBg = 'bg-gradient-to-b from-sky-50/50 to-white'; // Morning
                }
            }
            else {
                const tomorrowSahur = new Date(sahurDate);
                tomorrowSahur.setDate(tomorrowSahur.getDate() + 1);
                targetDate = tomorrowSahur;

                label = 'SAHURA KALAN SÜRE';
                nextGreeting = 'Allah Kabul Etsin, Hayırlı İftarlar';

                if (hour >= 22 || hour < 4) {
                    nextGreeting = 'Hayırlı Geceler, Allah Rahatlık Versin';
                    newBg = 'bg-gradient-to-b from-slate-100 to-white'; // Late night
                } else {
                    newBg = 'bg-gradient-to-b from-indigo-50/50 to-white'; // After Iftar
                }
            }

            setTargetLabel(label);
            setGreeting(nextGreeting);

            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setCountdown(`${hours} saat ${minutes} dakika ${seconds} saniye`);
            } else {
                setCountdown('Vakit Geldi...');
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
                        {/* Greeting & Ramadan Progress */}
                        <div className="w-full flex justify-between items-center mb-6 px-2 text-sm text-primary-600 font-medium flex-nowrap gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                                <span className="flex-shrink-0">🌙</span>
                                <span className="truncate">{ramadanDay ? `Ramazan'ın ${ramadanDay}. Günü` : 'Ramazan Bekleniyor'}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {isPlaying && (
                                    <button
                                        onClick={stopAdhan}
                                        className="flex items-center gap-2 bg-green-600 animate-pulse hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all text-sm font-medium focus:outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                                            <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                                        </svg>
                                        <span className="hidden sm:inline">Ezan Okunuyor...</span>
                                    </button>
                                )}

                                {targetLabel === 'SAHURA KALAN SÜRE' && (
                                    <SahurAlarmButton sahurTime={iftarData.sahurTime} />
                                )}

                                <NotificationButton permission={permission} onRequestPermission={requestPermission} />
                                <PwaInstallButton />
                            </div>
                        </div>

                        <div className="italic opacity-80 mb-4">{greeting}</div>

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
                            <p className="text-center text-primary-600 font-semibold uppercase tracking-widest text-sm sm:text-lg">{targetLabel}</p>
                        </div>

                        {/* Minimal Grid for Times */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 w-full">
                            {iftarData.times.map((time: string, index: number) => {
                                const labels = ["İmsak", "Güneş", "Öğle", "İkindi", "İftar", "Yatsı"];
                                const isSahur = index === 0;
                                const isIftar = index === 4;

                                // Aktif sayaca göre vurgulama
                                const isSahurActive = targetLabel === 'SAHURA KALAN SÜRE' && isSahur;
                                const isIftarActive = targetLabel === 'İFTARA KALAN SÜRE' && isIftar;
                                const isActive = isSahurActive || isIftarActive;

                                return (
                                    <div key={index}
                                        className={`p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-all
                                        ${isActive ? 'bg-primary-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                                        <div className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                            {time}
                                        </div>
                                        <div className={`text-[10px] sm:text-xs uppercase tracking-wider font-medium ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
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
