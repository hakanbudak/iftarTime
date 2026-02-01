import { useState, useEffect, useRef } from 'react';

interface VerseData {
    text: string;
    translation: string;
    surahName: string;
    ayahNumber: number;
    audioUrl: string;
}

export const useVerse = () => {
    const [verse, setVerse] = useState<VerseData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchVerse = async () => {
            // Check localStorage for today's verse to keep it consistent for the day
            const today = new Date().toDateString();
            const savedVerse = localStorage.getItem('dailyVerse');
            const savedDate = localStorage.getItem('dailyVerseDate');

            if (savedVerse && savedDate === today) {
                setVerse(JSON.parse(savedVerse));
                setLoading(false);
                return;
            }

            try {
                // Generate a random verse number between 1 and 6236 based on the date
                // Simple day-based seed to ensure all users might get the same verse (optional, random for now is fine too)
                // For true randomness per reload for dev, we can use Math.random(), but for "Verse of the Day" stick to date seed or simple random.
                // Let's go with true random for now as requested "Verse of the Day" usually implies one per day.

                // Using a pseudo-random generator seeded by date would be ideal for "Global" verse of the day,
                // but let's stick to per-user daily consistency using localStorage.

                const randomAyah = Math.floor(Math.random() * 6236) + 1;

                const response = await fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/editions/ar.alafasy,tr.diyanet`);
                const data = await response.json();

                if (data.status === 'OK' && data.data.length >= 2) {
                    const audioData = data.data[0]; // ar.alafasy has audio
                    const translationData = data.data[1]; // tr.diyanet

                    const newVerse: VerseData = {
                        text: audioData.text,
                        translation: translationData.text,
                        surahName: audioData.surah.englishName, // Or name for Arabic
                        ayahNumber: audioData.numberInSurah,
                        audioUrl: audioData.audio,
                    };

                    setVerse(newVerse);
                    localStorage.setItem('dailyVerse', JSON.stringify(newVerse));
                    localStorage.setItem('dailyVerseDate', today);
                }
            } catch (error) {
                console.error('Verse fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVerse();
    }, []);

    useEffect(() => {
        if (verse?.audioUrl) {
            audioRef.current = new Audio(verse.audioUrl);
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, [verse]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return { verse, loading, isPlaying, togglePlay };
};
