import { useState, useEffect, useRef } from 'react';

const DEFAULT_CITY = 'İstanbul';
const DEFAULT_COORDS = { latitude: 41.0082, longitude: 28.9784 }; // İstanbul

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LocationData {
    city: string;      // İl
    district: string;  // İlçe
    coords: Coordinates | null;
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
            // initialCity varsa varsayılan koordinat kullan
            setCoords(DEFAULT_COORDS);
            setLoading(false);
            return;
        }

        // localStorage'dan kayıtlı konum
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

        // GPS ile konum al
        getLocationWithGPS();
    }, [initialCity]);

    const getLocationWithGPS = async () => {
        // Tarayıcı GPS desteği kontrolü
        if (!navigator.geolocation) {
            console.warn('Geolocation desteklenmiyor, varsayılan konuma geçiliyor');
            fallbackToDefault();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Koordinatları kaydet
                setCoords({ latitude, longitude });
                localStorage.setItem('selectedLat', latitude.toString());
                localStorage.setItem('selectedLon', longitude.toString());

                // Şehir/ilçe adını bulmak için reverse geocode
                await reverseGeocode(latitude, longitude);
            },
            (error) => {
                console.warn('GPS hatası:', error.message);
                fallbackToDefault();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 dakika cache
            }
        );
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=tr`,
                {
                    headers: {
                        'User-Agent': 'IftarVaktim/1.0'
                    }
                }
            );

            const data = await response.json();

            if (data && data.address) {
                const detectedDistrict = data.address.county || data.address.town || data.address.city_district || '';
                const detectedCity = data.address.province || data.address.state || data.address.city || DEFAULT_CITY;

                const cleanDistrict = detectedDistrict.replace(/ İlçesi$/i, '').trim();

                setCity(detectedCity);
                setDistrict(cleanDistrict);

                localStorage.setItem('selectedCity', detectedCity);
                localStorage.setItem('selectedDistrict', cleanDistrict);
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

    // Şehir değiştirme - manuel seçimde koordinat Nominatim'den alınır
    const changeCity = async (newCity: string) => {
        setLoading(true);
        setCity(newCity);
        setDistrict(''); // Şehir değişince ilçe sıfırlanır
        localStorage.setItem('selectedCity', newCity);
        localStorage.removeItem('selectedDistrict');

        // Şehir için koordinat bul
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

    // İlçe değiştirme
    const changeDistrict = async (newDistrict: string) => {
        setLoading(true);
        setDistrict(newDistrict);
        if (newDistrict) {
            localStorage.setItem('selectedDistrict', newDistrict);

            // İlçe için koordinat bul
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

    // API'ye gönderilecek konum adı (UI için)
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
