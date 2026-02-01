import React from 'react';

interface IOSInstallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative z-10 animate-fade-in shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-2">
                        <img src="/icon.png" alt="App Icon" className="w-10 h-10 object-contain" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800">Uygulamayı Yükle</h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                        Bildirimleri alabilmek ve daha iyi bir deneyim için uygulamayı ana ekrana eklemelisiniz.
                    </p>

                    <div className="w-full bg-gray-50 rounded-xl p-4 text-left space-y-3 mt-2">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 font-bold text-xs text-primary-600 shadow-sm shrink-0">1</span>
                            <span>Tarayıcı menüsündeki <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-200 mx-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-600"><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0" clipRule="evenodd" /></svg></span> ikonuna basın.</span>
                        </div>
                        <div className="w-full h-px bg-gray-200/50"></div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 font-bold text-xs text-primary-600 shadow-sm shrink-0">2</span>
                            <span>Açılan menüden <span className="font-semibold text-gray-900">&quot;Ana Ekrana Ekle&quot;</span> seçeneğini seçin.</span>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs animate-bounce hidden sm:block">
                    👇 Menü aşağıda
                </div>
            </div>
        </div>
    );
};

export default IOSInstallModal;
