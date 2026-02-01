import { useState, useEffect, useRef } from 'react';
import { cityNamesMap } from '@/enums';

const DEFAULT_CITY = 'İstanbul';

export const useLocation = () => {
    const [city, setCity] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Try to get from localStorage first
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            setCity(savedCity);
            setLoading(false);
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        // If not, fetch from IP
        fetch('https://get.geojs.io/v1/ip/geo.json')
            .then((response) => response.json())
            .then((data) => {
                const cityEnglish = data.city;
                const cityTurkish = cityNamesMap[cityEnglish] || cityEnglish || DEFAULT_CITY;
                setCity(cityTurkish);
                // We don't save IP-detected city to localStorage automatically to allow re-detect if they travel, 
                // but we could. For now, let's keep it ephemeral unless they explicitly select it.
            })
            .catch((error) => {
                console.error('Location fetch error:', error);
                setCity(DEFAULT_CITY);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const changeCity = (newCity: string) => {
        setCity(newCity);
        localStorage.setItem('selectedCity', newCity);
    };

    return { city, changeCity, loading };
};
