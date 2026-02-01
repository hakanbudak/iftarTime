import { useState, useEffect, useRef } from 'react';
import { cityNamesMap } from '@/enums';

const DEFAULT_CITY = 'İstanbul';

export const useLocation = (initialCity?: string) => {
    const [city, setCity] = useState<string>(initialCity || '');
    const [loading, setLoading] = useState<boolean>(!initialCity);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (initialCity) {
            setCity(initialCity);
            setLoading(false);
            return;
        }

        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            setCity(savedCity);
            setLoading(false);
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        fetch('https://get.geojs.io/v1/ip/geo.json')
            .then((response) => response.json())
            .then((data) => {
                const cityEnglish = data.city;
                const cityTurkish = cityNamesMap[cityEnglish] || cityEnglish || DEFAULT_CITY;
                setCity(cityTurkish);
            })
            .catch((error) => {
                console.error('Location fetch error:', error);
                setCity(DEFAULT_CITY);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [initialCity]);

    const changeCity = (newCity: string) => {
        setCity(newCity);
        localStorage.setItem('selectedCity', newCity);
    };

    return { city, changeCity, loading };
};
