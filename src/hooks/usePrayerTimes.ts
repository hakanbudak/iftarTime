import { useState, useEffect } from 'react';
import { AladhanResponse, AladhanDayData, IftarData } from '@/types';

// Vakit string'inden timezone bilgisini çıkar: "06:41 (+03)" -> "06:41"
const cleanTimeString = (time: string): string => {
    return time.replace(/\s*\([^)]*\)\s*/g, '').trim();
};

// Aladhan timings objesinden diziye dönüştür (mevcut sıralama: İmsak, Güneş, Öğle, İkindi, İftar, Yatsı)
const extractTimesArray = (timings: AladhanDayData['timings']): string[] => {
    return [
        cleanTimeString(timings.Imsak),    // İmsak (Sahur)
        cleanTimeString(timings.Sunrise),  // Güneş
        cleanTimeString(timings.Dhuhr),    // Öğle
        cleanTimeString(timings.Asr),      // İkindi
        cleanTimeString(timings.Maghrib),  // İftar (Akşam)
        cleanTimeString(timings.Isha),     // Yatsı
    ];
};

export const usePrayerTimes = (city: string) => {
    const [data, setData] = useState<IftarData | null>(null);
    const [monthlyData, setMonthlyData] = useState<string[][]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return;

        setLoading(true);
        setError(null);

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // JavaScript ayları 0-indexed

        const todayForDisplay = new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).format(today);

        // Bugünün tarihini DD-MM-YYYY formatında al (API yanıtıyla eşleştirmek için)
        const todayDateStr = `${String(today.getDate()).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;

        fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=Turkey&method=13`)
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then((resData: AladhanResponse) => {
                if (resData.code !== 200 || !resData.data || resData.data.length === 0) {
                    throw new Error('Veri bulunamadı');
                }

                // Bugünün verisini bul
                const todayData = resData.data.find(
                    (day) => day.date.gregorian.date === todayDateStr
                );

                if (!todayData) {
                    // Bugün bulunamazsa ilk günü kullan (ay başında test için)
                    const fallbackData = resData.data[0];
                    const times = extractTimesArray(fallbackData.timings);

                    setData({
                        city: city,
                        iftarTime: times[4], // Maghrib = İftar
                        sahurTime: times[0], // Imsak = Sahur
                        times: times,
                        today: todayForDisplay
                    });
                } else {
                    const times = extractTimesArray(todayData.timings);

                    setData({
                        city: city,
                        iftarTime: times[4], // Maghrib = İftar
                        sahurTime: times[0], // Imsak = Sahur
                        times: times,
                        today: todayForDisplay
                    });
                }

                // Aylık verileri hazırla
                const monthly = resData.data.map((day) => extractTimesArray(day.timings));
                setMonthlyData(monthly);

                // Tarihleri DD/MM/YYYY formatında hazırla
                const datesArray = resData.data.map((day) => {
                    const [d, m, y] = day.date.gregorian.date.split('-');
                    return `${d}/${m}/${y}`;
                });
                setDates(datesArray);
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
