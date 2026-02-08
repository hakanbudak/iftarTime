import React, { useMemo } from 'react';

interface Props {
    monthlyTimes: string[][];
    dates: string[];
}

const MonthlyPrayerTimes = ({ monthlyTimes, dates }: Props) => {
    const headers = ["Tarih", "İmsak", "Güneş", "Öğle", "İkindi", "İftar", "Yatsı"];

    // Bugünün tarihini DD/MM/YYYY formatında al
    const todayStr = useMemo(() => {
        const today = new Date();
        return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    }, []);

    // Bugünün index'ini bul
    const todayIndex = useMemo(() => {
        return dates.findIndex(date => date === todayStr);
    }, [dates, todayStr]);

    // Verileri bugünden başlayacak şekilde sırala
    const sortedData = useMemo(() => {
        if (todayIndex === -1) return { times: monthlyTimes, dates: dates };

        const reorderedTimes = [
            ...monthlyTimes.slice(todayIndex),
            ...monthlyTimes.slice(0, todayIndex)
        ];
        const reorderedDates = [
            ...dates.slice(todayIndex),
            ...dates.slice(0, todayIndex)
        ];

        return { times: reorderedTimes, dates: reorderedDates };
    }, [monthlyTimes, dates, todayIndex]);

    // Gün isimlerini al
    const getDayName = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Aylık İmsakiye</h3>
                    <p className="text-sm text-gray-400">{monthlyTimes.length} günlük namaz vakitleri</p>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div
                    className="overflow-x-auto max-h-[550px] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    <table className="min-w-full">
                        {/* Table Header */}
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {headers.map((header, idx) => (
                                    <th
                                        key={header}
                                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-left text-gray-500
                                            ${idx === 0 ? 'sticky left-0 bg-gray-50 z-30' : ''}
                                        `}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {sortedData.times.length > 0 ? (
                                sortedData.times.map((day, index) => {
                                    const isToday = sortedData.dates[index] === todayStr;
                                    const dayName = getDayName(sortedData.dates[index]);

                                    return (
                                        <tr
                                            key={index}
                                            className={`border-b border-gray-50 transition-colors duration-150
                                                ${isToday
                                                    ? 'bg-primary-100'
                                                    : 'hover:bg-gray-50/50'
                                                }
                                            `}
                                        >
                                            {/* Tarih Kolonu */}
                                            <td className={`px-4 py-3 text-sm whitespace-nowrap sticky left-0 z-10 ${isToday ? 'bg-primary-100' : 'bg-white'}`}>
                                                <div>
                                                    <span className={`font-semibold ${isToday ? 'text-primary-700' : 'text-gray-800'}`}>
                                                        {sortedData.dates[index]}
                                                    </span>
                                                    <span className={`ml-2 text-xs ${isToday ? 'text-primary-600' : 'text-gray-400'}`}>
                                                        {dayName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Vakit Kolonları */}
                                            {day.map((time, idx) => {
                                                const isIftar = idx === 4;
                                                const isSahur = idx === 0;

                                                return (
                                                    <td
                                                        key={idx}
                                                        className={`px-4 py-3 text-sm whitespace-nowrap tabular-nums ${isToday ? 'bg-primary-100' : ''}`}
                                                    >
                                                        <span className={`
                                                            ${isToday ? 'text-primary-700' : 'text-gray-600'}
                                                            ${(isIftar || isSahur) ? 'font-semibold' : ''}
                                                        `}>
                                                            {time}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 animate-spin">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-400">Veriler yükleniyor...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MonthlyPrayerTimes;
