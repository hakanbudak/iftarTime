import { useState, useEffect } from 'react';
import { PrayerTimesResponse, IftarData } from '@/types';

export const usePrayerTimes = (city: string) => {
    const [data, setData] = useState<IftarData | null>(null);
    const [monthlyData, setMonthlyData] = useState<any[]>([]); // Keeping strict typing loose for monthly for now or reuse logic
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return;

        setLoading(true);
        setError(null);

        const today = new Date();
        // Adjust for timezone if needed, but the original code had this logic.
        // Simplifying: The API takes a date. Let's use current date logic from original code to ensure consistency.
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset() + 180);
        today.setDate(today.getDate() - 1); // Original code logic: why -1? Maybe API peculiarity. Keeping it safe.
        // Actually, looking at original code:
        // today.setDate(today.getDate() - 1);
        // const formattedToday = today.toISOString().split('T')[0];

        // Let's stick closer to a clean implementation but respect the original logic if it was working for the user's specific API behavior.
        // Or better, let's try to be more standard. 
        // If I look at the original code: 
        // const today = new Date();
        // today.setMinutes(today.getMinutes() - today.getTimezoneOffset() + 180);
        // today.setDate(today.getDate() - 1);
        // This seems like a hack for timezone or API offset. I will preserve it to avoid breaking data fetching.

        const formattedDate = today.toISOString().split('T')[0];

        // Display date
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
                if (times && times.length > 5) { // Ensure we have enough times
                    // Original: times[4] is Iftar (Evening/Akşam)
                    // times: [Imsak, Sun, Noon, Afternoon, Evening, Night]
                    // wait, original code says: times[4] is Iftar.
                    // Standard array usually: 0: Imsak, 1: Gunes, 2: Ogle, 3: Ikindi, 4: Aksam (Iftar), 5: Yatsi

                    setData({
                        city: resData.place.city,
                        iftarTime: times[4],
                        sahurTime: times[0],
                        times: times,
                        today: todayForDisplay
                    });

                    // Process monthly data
                    const datesArray = Object.keys(resData.times).map(dateStr => {
                        const [year, month, day] = dateStr.split('-').map(Number);
                        const dateObj = new Date(year, month - 1, day);
                        // Original code had +1 day offset in display?? 
                        // dateObj.setDate(dateObj.getDate() + 1);
                        // Let's keep it 1:1 with original logic to be safe for now.
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
