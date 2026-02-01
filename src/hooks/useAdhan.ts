import { useEffect, useRef, useState } from 'react';
import { IftarData } from '@/types';

export const useAdhan = (iftarData: IftarData | null) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayedForToday, setHasPlayedForToday] = useState(false);

    useEffect(() => {
        // Initialize audio
        // Using a reliable source for Adhan (Makkah Adhan is generally preferred)
        audioRef.current = new Audio('https://www.islamcan.com/audio/adhan/azan2.mp3');

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!iftarData) return;

        const checkTime = () => {
            const now = new Date();
            const iftarTimeArr = iftarData.iftarTime.split(/[- :]/);

            // Create date object for today's iftar
            const iftarDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                parseInt(iftarTimeArr[0]), parseInt(iftarTimeArr[1]), 0);

            // Calculate difference in milliseconds
            const diff = iftarDate.getTime() - now.getTime();

            // Trigger if within the target window (e.g., between 0 and 2 seconds after iftar time)
            // ensuring we don't re-trigger if logic runs multiple times
            if (diff <= 0 && diff > -60000 && !hasPlayedForToday) {
                playAdhan();
                setHasPlayedForToday(true);
            }

            // Reset hasPlayedForToday around midnight or next day to handle persistent tabs
            if (diff < -60000 * 60) { // 1 hour after
                // Logic to reset could be complex with state, but for simple daily usage, 
                // we might just want to ensure it plays once per "iftar data load" or "day".
                // Since iftarData changes daily, that might handle it, or we can simply not reset 
                // until the component unmounts/remounts or iftarData changes.
            }
        };

        // Reset played state when iftarData changes (new day/city)
        setHasPlayedForToday(false);

        const timer = setInterval(checkTime, 1000); // Check every second for precision
        return () => clearInterval(timer);
    }, [iftarData]); // Dependency on iftarData ensures we reset for new data

    const playAdhan = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Audio play failed (likely autoplay policy):", error);
                // Optional: Show a "Play" button UI if autoplay fails
            });

            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    const stopAdhan = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return { isPlaying, stopAdhan };
};
