import React from 'react';
interface Props {
    monthlyTimes: string[][];
    dates: string[]
}
const MonthlyPrayerTimes = ({ monthlyTimes, dates }:Props) => {
    return (
        <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-8 max-w-full sm:max-w-5xl w-full mx-auto">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 my-4">Namaz Vakitleri</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                    <tr>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Tarih
                        </th>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Imsak
                        </th>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Güneş
                        </th>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Öğle
                        </th>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            İkindi
                        </th>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Akşam
                        </th>
                        <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Yatsı
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {monthlyTimes.length > 0 ? (
                        monthlyTimes.map((day, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="px-2 sm:px-5 py-4 text-sm bg-white">
                                    {dates[index]}
                                </td>
                                {day.map((time, idx) => (
                                    <td key={idx} className="px-2 sm:px-5 py-4 text-sm bg-white">
                                        {time}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="text-center py-5">Yükleniyor...</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyPrayerTimes;
