import React, { useState, useEffect } from 'react';
import { cityNamesMap } from "@/enums";
import IconLocation from "@/components/icon/IconLocation";
import MonthlyPrayerTimes from "./monthlyPrayerTimes";

const CurrentTimeAndIftarCountdown = () => {
    const [iftarData, setIftarData] = useState<any>(null);
    const [countdown, setCountdown] = useState<string>('');
    const [monthlyTimes, setMonthlyTimes] = useState<string[][]>([]);
    const [dates, setDates] = useState<string[]>([]);

    function translateCityName(cityName: string): string {
        return cityNamesMap[cityName] || cityName;
    }

    useEffect(() => {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset() + 180);
        today.setDate(today.getDate() - 1);
        const formattedToday = today.toISOString().split('T')[0];

        const todayForDisplay = new Intl.DateTimeFormat('tr-TR').format(new Date());

        fetch(`https://get.geojs.io/v1/ip/geo.json`)
            .then((response) => response.json())
            .then((data) => {
                const cityEnglish = data.city;
                const cityTurkish = translateCityName(cityEnglish);

                return fetch(`https://namaz-vakti.vercel.app/api/timesFromPlace?country=Turkey&region=${cityTurkish}&city=${cityTurkish}&date=${formattedToday}&days=30&timezoneOffset=180&calculationMethod=Turkey`);
            })
            .then(response => response.json())
            .then(data => {
                const times = data.times[formattedToday];
                if(times && times.length > 4) {
                    setIftarData({
                        city: data.place.city,
                        iftarTime: times[4],
                        times: times,
                        today: todayForDisplay
                    });
                    startCountdown(times[4]);
                    const datesArray = Object.keys(data.times).map(date => {
                        const [year, month, day] = date.split('-').map(Number);
                        const dateObj = new Date(year, month - 1, day);
                        dateObj.setDate(dateObj.getDate() + 1);
                        return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
                    });

                    setDates(datesArray);

                    const monthlyData = Object.values(data.times).map((dayTimes: any) => {
                        if (Array.isArray(dayTimes) && dayTimes.every(time => typeof time === 'string')) {
                            return dayTimes;
                        } else {
                            return [];
                        }
                    });

                    setMonthlyTimes(monthlyData);
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    const startCountdown = (iftarTime: string) => {
        const updateCountdown = () => {
            const now = new Date();
            const iftarTimeArr = iftarTime.split(/[- :]/);
            const iftarDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(iftarTimeArr[0]), parseInt(iftarTimeArr[1]), iftarTimeArr.length > 2 ? parseInt(iftarTimeArr[2]) : 0);

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
    };

    return (
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-5xl w-full mx-auto">
            {iftarData && (
                <>
                    <div className="flex flex-col items-center text-center">
                        <IconLocation/>
                        <h2 className="text-4xl font-semibold text-gray-900 mb-4">{iftarData.city}</h2>
                        <div className="text-xl text-gray-600 mb-6">{iftarData.today}</div>

                        <div className="text-2xl sm:text-4xl font-bold text-green-600 mb-4 sm:mb-6">
                            {countdown}
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <div className="border-t-4 border-green-600 w-full max-w-xs py-2">
                                <p className="text-center text-green-600 font-semibold">İftara Kalan Süre</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 justify-center mx-auto">
                        {iftarData.times.map((time: string, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
                                <div className={`text-lg font-semibold ${index === 4 ? "text-orange-500" : "text-gray-800"}`}>{time}</div>
                                <div className="text-base text-gray-600">{["Sahur", "Güneş", "Öğle", "İkindi", "İftar", "Yatsı"][index]}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <MonthlyPrayerTimes monthlyTimes={monthlyTimes} dates={dates} />
        </div>
    );

};

export default CurrentTimeAndIftarCountdown;
