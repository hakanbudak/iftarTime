import { useEffect, useState } from 'react';
import { IftarData } from '@/types';

export const useNotifications = (iftarData: IftarData | null) => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) return;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
        } catch (error) {
            console.error('Notification permission error:', error);
        }
    };

    useEffect(() => {
        if (!iftarData) return;

        const checkTime = () => {
            if (permission !== 'granted') return;

            const now = new Date();
            const iftarTimeArr = iftarData.iftarTime.split(/[- :]/);
            const iftarDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                parseInt(iftarTimeArr[0]), parseInt(iftarTimeArr[1]), 0);

            const diff = iftarDate.getTime() - now.getTime();
            const diffMinutes = Math.floor(diff / 1000 / 60);

            if (diffMinutes === 15) {
                new Notification('İftar Vaktine 15 Dakika Kaldı!', {
                    body: `${iftarData.city} için iftar vakti yaklaşıyor.`,
                    icon: '/icon.png'
                });
            }

            if (diffMinutes === 0 && diff > 0 && diff < 60000) {
                new Notification('Hayırlı İftarlar!', {
                    body: `${iftarData.city} için iftar vakti girdi.`,
                    icon: '/icon.png'
                });
            }
        };

        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, [iftarData, permission]);

    return { permission, requestPermission };
};
