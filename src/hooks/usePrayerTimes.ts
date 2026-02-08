import { useState, useEffect } from 'react';
import { AladhanResponse, AladhanDayData, IftarData } from '@/types';

// Vakit string'inden timezone bilgisini çıkar ve sadece saat:dakika al
// Örnek: "06:47 (+03)" -> "06:47"
const cleanTimeString = (time: string): string => {
    if (!time) return '';
    // Sadece HH:MM kısmını al (ilk 5 karakter)
    const match = time.match(/^(\d{2}:\d{2})/);
    return match ? match[1] : time.replace(/\s*\([^)]*\)\s*/g, '').trim();
};

// Aladhan timings objesinden diziye dönüştür
// Sıralama: İmsak, Güneş, Öğle, İkindi, Akşam (İftar), Yatsı
const extractTimesArray = (timings: AladhanDayData['timings']): string[] => {
    return [
        cleanTimeString(timings.Fajr),      // İmsak / Sabah (Fajr daha doğru)
        cleanTimeString(timings.Sunrise),   // Güneş Doğuşu
        cleanTimeString(timings.Dhuhr),     // Öğle
        cleanTimeString(timings.Asr),       // İkindi
        cleanTimeString(timings.Maghrib),   // Akşam / İftar
        cleanTimeString(timings.Isha),      // Yatsı
    ];
};

// Sahur için Imsak değerini al (Fajr'dan ~10 dk önce)
const getSahurTime = (timings: AladhanDayData['timings']): string => {
    return cleanTimeString(timings.Imsak);
};

interface Coordinates {
    latitude: number;
    longitude: number;
}

// Koordinat tabanlı namaz vakitleri hook'u
export const usePrayerTimes = (coords: Coordinates | null, displayLocation: string) => {
    const [data, setData] = useState<IftarData | null>(null);
    const [monthlyData, setMonthlyData] = useState<string[][]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!coords) return;

        setLoading(true);
        setError(null);

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const todayForDisplay = new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).format(today);

        const todayDateStr = `${String(today.getDate()).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;

        // Koordinat tabanlı API - Türkiye için Diyanet metodu (method=13)
        const apiUrl = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=13`;

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then((resData: AladhanResponse) => {
                if (resData.code !== 200 || !resData.data || resData.data.length === 0) {
                    throw new Error('Veri bulunamadı');
                }

                const todayData = resData.data.find(
                    (day) => day.date.gregorian.date === todayDateStr
                );

                const targetData = todayData || resData.data[0];
                const times = extractTimesArray(targetData.timings);
                const sahurTime = getSahurTime(targetData.timings);

                setData({
                    city: displayLocation,
                    iftarTime: times[4],    // Maghrib = İftar
                    sahurTime: sahurTime,   // Imsak = Sahur bitiş vakti
                    times: times,
                    today: todayForDisplay
                });

                // Aylık verileri hazırla
                const monthly = resData.data.map((day) => extractTimesArray(day.timings));
                setMonthlyData(monthly);

                // Tarihleri hazırla
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

        // coords veya displayLocation değiştiğinde yeniden fetch et
    }, [coords, displayLocation]);

    return { data, monthlyData, dates, loading, error };
};
