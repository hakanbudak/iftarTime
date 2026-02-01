import React from 'react';
interface Props {
    monthlyTimes: string[][];
    dates: string[]
}
const MonthlyPrayerTimes = ({ monthlyTimes, dates }: Props) => {
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Aylık Namaz Vakitleri</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {["Tarih", "İmsak", "Güneş", "Öğle", "İkindi", "İftar", "Yatsı"].map((header) => (
                                <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyTimes.length > 0 ? (
                            monthlyTimes.map((day, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                        {dates[index]}
                                    </td>
                                    {day.map((time, idx) => (
                                        <td key={idx} className={`px-4 py-3 text-sm ${idx === 4 ? 'text-primary-600 font-bold' : 'text-gray-600'}`}>
                                            {time}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-400">Veriler yükleniyor...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyPrayerTimes;

