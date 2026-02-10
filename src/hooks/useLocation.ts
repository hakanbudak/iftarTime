import { useState, useEffect, useRef } from 'react';

const DEFAULT_CITY = 'İstanbul';
const DEFAULT_COORDS = { latitude: 41.0082, longitude: 28.9784 };

interface Coordinates {
    latitude: number;
    longitude: number;
}

export const useLocation = (initialCity?: string) => {
    const [city, setCity] = useState<string>(initialCity || '');
    const [district, setDistrict] = useState<string>('');
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [loading, setLoading] = useState<boolean>(!initialCity);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (initialCity) {
            setCity(initialCity);
            setDistrict('');
            geocodeCity(initialCity);
            return;
        }

        const savedCity = localStorage.getItem('selectedCity');
        const savedDistrict = localStorage.getItem('selectedDistrict');
        const savedLat = localStorage.getItem('selectedLat');
        const savedLon = localStorage.getItem('selectedLon');

        if (savedCity && savedLat && savedLon) {
            setCity(savedCity);
            setDistrict(savedDistrict || '');
            setCoords({
                latitude: parseFloat(savedLat),
                longitude: parseFloat(savedLon)
            });
            setLoading(false);
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        getLocationWithGPS();
    }, [initialCity]);

    const geocodeCity = async (cityName: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)},Turkey&limit=1`,
                { headers: { 'User-Agent': 'IftarVaktim/1.0' } }
            );
            const data = await response.json();
            if (data && data.length > 0) {
                const newCoords = {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
                setCoords(newCoords);
                localStorage.setItem('selectedLat', newCoords.latitude.toString());
                localStorage.setItem('selectedLon', newCoords.longitude.toString());
            } else {
                setCoords(DEFAULT_COORDS);
            }
        } catch {
            setCoords(DEFAULT_COORDS);
        } finally {
            setLoading(false);
        }
    };

    const getLocationWithGPS = async () => {
        if (!navigator.geolocation) {
            console.warn('Geolocation desteklenmiyor');
            fallbackToDefault();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ latitude, longitude });
                localStorage.setItem('selectedLat', latitude.toString());
                localStorage.setItem('selectedLon', longitude.toString());
                await reverseGeocode(latitude, longitude);
            },
            () => {
                fallbackToDefault();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=tr&zoom=10`,
                { headers: { 'User-Agent': 'IftarVaktim/1.0' } }
            );

            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;

                // İl tespiti: province > state (province her zaman il adını içerir)
                const detectedCity = addr.province || addr.state || DEFAULT_CITY;

                // İlçe tespiti: town > county > city_district
                // Büyükşehirlerde "city" alanı bazen ilçe adını içerir, onu da kontrol et
                let detectedDistrict = addr.town || addr.county || addr.city_district || '';

                // Eğer city alanı province'dan farklıysa ve ilçe bulunamadıysa, city ilçe olabilir
                if (!detectedDistrict && addr.city && addr.city !== detectedCity) {
                    detectedDistrict = addr.city;
                }

                const cleanCity = detectedCity.replace(/ İli$/i, '').replace(/ Province$/i, '').trim();
                const cleanDistrict = detectedDistrict.replace(/ İlçesi$/i, '').trim();

                setCity(cleanCity);
                setDistrict(cleanDistrict);

                localStorage.setItem('selectedCity', cleanCity);
                if (cleanDistrict) {
                    localStorage.setItem('selectedDistrict', cleanDistrict);
                }
            } else {
                setCity(DEFAULT_CITY);
                setDistrict('');
            }
        } catch (error) {
            console.error('Reverse geocoding hatası:', error);
            setCity(DEFAULT_CITY);
            setDistrict('');
        } finally {
            setLoading(false);
        }
    };

    const fallbackToDefault = () => {
        setCity(DEFAULT_CITY);
        setDistrict('');
        setCoords(DEFAULT_COORDS);
        setLoading(false);
    };

    const changeCity = async (newCity: string) => {
        setLoading(true);
        setCity(newCity);
        setDistrict('');
        localStorage.setItem('selectedCity', newCity);
        localStorage.removeItem('selectedDistrict');

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newCity)},Turkey&limit=1`,
                { headers: { 'User-Agent': 'IftarVaktim/1.0' } }
            );
            const data = await response.json();
            if (data && data.length > 0) {
                const newCoords = {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
                setCoords(newCoords);
                localStorage.setItem('selectedLat', newCoords.latitude.toString());
                localStorage.setItem('selectedLon', newCoords.longitude.toString());
            }
        } catch (error) {
            console.error('Şehir koordinatı alınamadı:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeDistrict = async (newDistrict: string) => {
        setLoading(true);
        setDistrict(newDistrict);
        if (newDistrict) {
            localStorage.setItem('selectedDistrict', newDistrict);

            try {
                const searchQuery = `${newDistrict}, ${city}, Turkey`;
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
                    { headers: { 'User-Agent': 'IftarVaktim/1.0' } }
                );
                const data = await response.json();
                if (data && data.length > 0) {
                    const newCoords = {
                        latitude: parseFloat(data[0].lat),
                        longitude: parseFloat(data[0].lon)
                    };
                    setCoords(newCoords);
                    localStorage.setItem('selectedLat', newCoords.latitude.toString());
                    localStorage.setItem('selectedLon', newCoords.longitude.toString());
                }
            } catch (error) {
                console.error('İlçe koordinatı alınamadı:', error);
            }
        } else {
            localStorage.removeItem('selectedDistrict');
        }
        setLoading(false);
    };

    const locationForAPI = district || city;

    return {
        city,
        district,
        coords,
        locationForAPI,
        changeCity,
        changeDistrict,
        loading
    };
};
