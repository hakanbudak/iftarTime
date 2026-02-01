import React from 'react';

interface SahurAlarmButtonProps {
    sahurTime: string; // HH:MM format
}

const SahurAlarmButton: React.FC<SahurAlarmButtonProps> = ({ sahurTime }) => {
    const handleSetAlarm = () => {
        const now = new Date();
        const [hours, minutes] = sahurTime.split(':').map(Number);

        // Calculate Sahur Date (Usually tomorrow early morning)
        let sahurDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        // If Sahur time has passed today (e.g. it's 2 PM and Sahur was 5 AM), it means the next sahur is tomorrow
        // OR if it's currently night (e.g. 11 PM) and Sahur is next morning (5 AM), it is tomorrow.
        // Actually, logic is simpler: If sahurDate is in the past, add 1 day.
        if (sahurDate < now) {
            sahurDate.setDate(sahurDate.getDate() + 1);
        }

        // 45 minutes before Sahur for preparation
        const alarmDate = new Date(sahurDate.getTime() - 45 * 60 * 1000);

        const formatDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, '');
        };

        const startDate = formatDate(alarmDate);
        const endDate = formatDate(sahurDate);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            'SUMMARY:Sahur Vakti - IftarVaktim',
            'DESCRIPTION:Sahur vakti yaklaştı! Hayırlı sahurlar.',
            'BEGIN:VALARM',
            'TRIGGER:-PT0M',
            'ACTION:DISPLAY',
            'DESCRIPTION:Sahur Reminder',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sahur_alarm.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleSetAlarm}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all border border-indigo-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Takvimine sahur için alarm ekle"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Sahur Alarmı Kur</span>
        </button>
    );
};

export default SahurAlarmButton;
