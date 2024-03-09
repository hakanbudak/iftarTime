import React, { useState, useEffect } from 'react';
import { cityNamesMap } from "@/enums";

const CurrentTimeAndIftarCountdown = () => {
    const [iftarData, setIftarData] = useState<any>(null);
    const [countdown, setCountdown] = useState<string>('');

    function translateCityName(cityName: string): string {
        return cityNamesMap[cityName] || cityName;
    }
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        fetch('http://ip-api.com/json/?fields=city')
            .then((response) => response.json())
            .then((data) => {
                const cityEnglish = data.city;
                const cityTurkish = translateCityName(cityEnglish);

                return fetch(`https://namaz-vakti.vercel.app/api/timesFromPlace?country=Turkey&region=${cityTurkish}&city=${cityTurkish}&date=${today}&days=1&timezoneOffset=180&calculationMethod=Turkey`);
            })
            .then(response => response.json())
            .then(data => {
                const iftarTime =  data.times[today][4];;
                setIftarData({
                    city: data.place.city,
                    iftarTime: iftarTime
                });
                startCountdown(iftarTime);

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
        <div>
            {iftarData && (
                <div>
                    <p> {iftarData.city}</p>
                    <p>Iftar Saati: {iftarData.iftarTime}</p>
                    <p>İftara Kalan Süre: {countdown}</p>
                </div>
            )}
        </div>

    );
};

export default CurrentTimeAndIftarCountdown;
