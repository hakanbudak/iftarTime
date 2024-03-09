import React, { useState, useEffect } from 'react';
import { cityNamesMap } from "@/enums";

const CurrentTimeAndIftarCountdown = () => {
    const [iftarData, setIftarData] = useState<any>(null);

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

            })
            .catch((error) => console.error('Error:', error));
    }, []);



    return (
        <div>
            {iftarData && (
                <div>
                    <p> {iftarData.city}</p>
                    <p>Iftar Saati: {iftarData.iftarTime}</p>
                </div>
            )}
        </div>

    );
};

export default CurrentTimeAndIftarCountdown;
