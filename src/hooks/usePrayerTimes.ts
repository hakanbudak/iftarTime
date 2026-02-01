import { useState, useEffect } from 'react';
import { PrayerTimesResponse, IftarData } from '@/types';

export const usePrayerTimes = (city: string) => {
    const [data, setData] = useState<IftarData | null>(null);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return;

        setLoading(true);
        setError(null);

        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset() + 180);
        today.setDate(today.getDate() - 1);

        const formattedDate = today.toISOString().split('T')[0];

        const todayForDisplay = new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).format(new Date());

        fetch(`https://vakit.vercel.app/api/timesFromPlace?country=Turkey&region=${city}&city=${city}&date=${formattedDate}&days=30&timezoneOffset=180&calculationMethod=Turkey`)
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then((resData: PrayerTimesResponse) => {
                const times = resData.times[formattedDate];
                if (times && times.length > 5) {

                    setData({
                        city: resData.place.city,
                        iftarTime: times[4],
                        sahurTime: times[0],
                        times: times,
                        today: todayForDisplay
                    });

                    const datesArray = Object.keys(resData.times).map(dateStr => {
                        const [year, month, day] = dateStr.split('-').map(Number);
                        const dateObj = new Date(year, month - 1, day);
                        dateObj.setDate(dateObj.getDate() + 1);
                        return `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
                    });
                    setDates(datesArray);

                    const monthly = Object.values(resData.times).map((dayTimes: any) => {
                        if (Array.isArray(dayTimes) && dayTimes.every(t => typeof t === 'string')) {
                            return dayTimes;
                        }
                        return [];
                    });
                    setMonthlyData(monthly);
                } else {
                    setError('Vakitler bulunamadı.');
                }
            })
            .catch(err => {
                console.error(err);
                setError('Veri çekilemedi.');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [city]);

    return { data, monthlyData, dates, loading, error };
};
