import React, { useEffect, useState } from 'react';
import IOSInstallModal from './IOSInstallModal';

const PwaInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if running as PWA
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');
        setIsStandalone(isStandaloneMode);

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else if (isIOS) {
            setShowModal(true);
        } else {
            alert("Uygulamayı tarayıcı menüsünden yükleyebilirsiniz.");
        }
    };

    // Don't show if already installed
    if (isStandalone) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 animate-fade-in"
                title="Uygulamayı Yükle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Uygulamayı Yükle</span>
            </button>

            <IOSInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default PwaInstallButton;
