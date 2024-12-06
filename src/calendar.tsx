import React, { useState, useMemo } from 'react';
import {
    IconChevronLeft,
    IconChevronRight,
    IconCalendar,
    IconList,
    IconLayoutGrid,
    IconRowInsertTop
} from '@tabler/icons-react';

type ViewMode = 'day' | 'week' | 'month' | 'year';
type Event = {
    id: number;
    title: string;
    date: Date;
};

export const CalendarComponent: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [events, setEvents] = useState<Event[]>([]);

    const addEvent = (title: string, date: Date) => {
        setEvents([...events, { id: events.length + 1, title, date }]);
    };

    const generateDaysForWeekView = (date: Date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const generateCalendarDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const days: Date[] = [];

        // Pad beginning of calendar with previous month's days
        const startingDay = firstDayOfMonth.getDay();
        for (let i = 0; i < startingDay; i++) {
            const previousMonthDay = new Date(year, month, -startingDay + i + 1);
            days.push(previousMonthDay);
        }

        // Add current month's days
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            days.push(new Date(year, month, day));
        }

        // Pad end of calendar with next month's days
        const totalDaysToShow = 42; // 6 rows of 7 days
        while (days.length < totalDaysToShow) {
            const nextMonthDay = new Date(year, month + 1, days.length - lastDayOfMonth.getDate());
            days.push(nextMonthDay);
        }

        return days;
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);

        switch (viewMode) {
            case 'day':
                newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
                break;
            case 'year':
                newDate.setFullYear(newDate.getFullYear() + (direction === 'prev' ? -1 : 1));
                break;
        }

        setCurrentDate(newDate);
    };

    const renderDayNames = () => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames.map(day => (
            <div key={day} className="text-xs text-gray-500 text-center font-medium">
                {day}
            </div>
        ));
    };

    const renderMonthView = () => {
        const days = generateCalendarDays(currentDate);
        const currentMonth = currentDate.getMonth();

        return (
            <div className="grid grid-cols-7 gap-2 h-full">
                {renderDayNames()}
                {days.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentMonth;
                    return (
                        <div
                            key={index}
                            className={`
                p-2 text-center text-sm 
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-800'}
                hover:bg-blue-50 
                rounded-md 
                transition-colors 
                cursor-pointer
                relative
              `}
                        >
                            {day.getDate()}
                            {/* Display events */}
                            {events.filter(event => event.date.toDateString() === day.toDateString()).map(event => (
                                <div key={event.id} className="absolute bg-blue-200 p-1 rounded-md text-xs">
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return (
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-1 divide-y">
                    {hours.map(hour => (
                        <div key={hour} className="flex">
                            <div className="w-16 text-right pr-4 text-gray-500">
                                {hour.toString().padStart(2, '0')}:00
                            </div>
                            <div className="flex-grow border-l pl-2 h-12 hover:bg-blue-50 transition-colors relative">
                                {/* Display events */}
                                {events.filter(event => event.date.getDate() === currentDate.getDate() && event.date.getHours() === hour).map(event => (
                                    <div key={event.id} className="absolute bg-blue-200 p-1 rounded-md text-xs">
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekDays = generateDaysForWeekView(currentDate);
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return (
            <div className="flex flex-col h-full">
                {/* Day names */}
                <div className="grid grid-cols-8 mb-2">
                    <div className=""></div>
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-center">
                            <div className="text-xs text-gray-500">
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="font-semibold">
                                {day.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hours grid */}
                <div className="grid grid-cols-8 divide-x divide-y h-full">
                    {/* Hours column */}
                    <div className="contents">
                        {hours.map(hour => (
                            <div key={hour} className="col-span-1 text-right pr-2 text-gray-500 border-b">
                                {hour.toString().padStart(2, '0')}:00
                            </div>
                        ))}
                    </div>

                    {/* Days columns */}
                    {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="contents">
                            {hours.map(hour => (
                                <div
                                    key={hour}
                                    className="h-12 border-b hover:bg-blue-50 transition-colors relative"
                                >
                                    {/* Display events */}
                                    {events.filter(event => event.date.getDate() === day.getDate() && event.date.getHours() === hour).map(event => (
                                        <div key={event.id} className="absolute bg-blue-200 p-1 rounded-md text-xs">
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderYearView = () => {
        const months = Array.from({ length: 12 }, (_, i) => i);

        return (
            <div className="grid grid-cols-4 gap-4">
                {months.map(month => {
                    const monthDate = new Date(currentDate.getFullYear(), month, 1);
                    return (
                        <div
                            key={month}
                            className="border rounded-lg p-2 text-center hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                            {monthDate.toLocaleString('default', { month: 'long' })}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderView = () => {
        switch (viewMode) {
            case 'day': return renderDayView();
            case 'week': return renderWeekView();
            case 'month': return renderMonthView();
            case 'year': return renderYearView();
        }
    };

    const headerTitle = useMemo(() => {
        switch (viewMode) {
            case 'day':
                return currentDate.toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
            case 'week':
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - 
                ${endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            case 'month':
                return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            case 'year':
                return currentDate.getFullYear().toString();
        }
    }, [viewMode, currentDate]);

    return (
        <div className="w-screen h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                {/* Month and Year Display */}
                <div className="flex items-center space-x-2">
                    <IconCalendar className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">
                        {headerTitle}
                    </h2>
                </div>

                {/* View Mode and Navigation */}
                <div className="flex items-center space-x-4">
                    {/* View Mode Switcher */}
                    <div className="flex space-x-2 bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`p-2 rounded-full ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        >
                            <IconRowInsertTop size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`p-2 rounded-full ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        >
                            <IconList size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`p-2 rounded-full ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        >
                            <IconLayoutGrid size={16} />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigateDate('prev')}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <IconChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => navigateDate('next')}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <IconChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div className="flex-grow p-4 overflow-auto">
                {renderView()}
            </div>
        </div>
    );
};