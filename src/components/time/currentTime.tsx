import React, { useState, useEffect } from 'react';
import { cityNamesMap } from "@/enums";

const CurrentTimeAndIftarCountdown = () => {
    const [iftarData, setIftarData] = useState<any>(null);
    const [countdown, setCountdown] = useState<string>('');

    function translateCityName(cityName: string): string {
        return cityNamesMap[cityName] || cityName;
    }

    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        const formattedToday = today.toISOString().split('T')[0];

        const todayForDisplay = new Date().toISOString().split('T')[0];

        fetch(`http://ip-api.com/json/?fields=city`)
            .then((response) => response.json())
            .then((data) => {
                const cityEnglish = data.city;
                const cityTurkish = translateCityName(cityEnglish);

                return fetch(`https://namaz-vakti.vercel.app/api/timesFromPlace?country=Turkey&region=${cityTurkish}&city=${cityTurkish}&date=${formattedToday}&days=1&timezoneOffset=180&calculationMethod=Turkey`);
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
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    const startCountdown = (iftarTime: string) => {
        const updateCountdown = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();
            const iftarDate = new Date(`${year}-${month + 1}-${day} ${iftarTime}`);

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
                        <h2 className="text-3xl font-semibold text-gray-900 mb-4">{iftarData.city}</h2>
                        <div className="text-lg text-gray-600 mb-6">{iftarData.today}</div>
                        <div className="text-4xl font-bold text-green-600 mb-6">
                            {countdown}
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <div className="border-t-2 border-green-600 w-full max-w-xs py-2">
                                <p className="text-center text-green-600">Kalan Süre</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 justify-center mx-auto">
                        {iftarData.times.map((time: string, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow flex flex-col items-center justify-center">
                                <div className={`text-md font-semibold ${index === 4 ? "text-orange-500" : "text-gray-800"}`}>{time}</div>
                                <div className="text-sm text-gray-600">{["Sahur", "Güneş", "Öğle", "İkindi", "İftar", "Teravih"][index]}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CurrentTimeAndIftarCountdown;
