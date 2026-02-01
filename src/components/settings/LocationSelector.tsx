import React from 'react';
import { cityNamesMap } from '@/enums';
import SimpleCard from '../layout/SimpleCard';

interface LocationSelectorProps {
    currentCity: string;
    onCityChange: (city: string) => void;
    onClose: () => void;
}

const LocationSelector = ({ currentCity, onCityChange, onClose }: LocationSelectorProps) => {
    const cities = Object.values(cityNamesMap).sort();
    // Ensure we have a unique list in case of duplicates
    const uniqueCities = Array.from(new Set(cities));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md max-h-[80vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">Şehir Seçiniz</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {uniqueCities.map((city) => (
                        <button
                            key={city}
                            onClick={() => {
                                onCityChange(city);
                                onClose();
                            }}
                            className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all text-left truncate
                        ${city === currentCity
                                    ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
