import './style.css';

import React, { useRef, useState } from 'react';
import cx from 'classnames';

const PADDING = 5; // 5 months to the left and right of startDate
const DayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthData {
    startDate: Date;
    month: number;
    year: number;
}

export default function DatePicker({
    className,
    startDate = new Date(),
    monthWidth = 290,
    onChange,
}: {
    className?: string;
    startDate: Date;
    monthWidth: number;
    onChange: (values: Date | [Date, Date] | null) => void;
}) {
    const pickerRef = useRef<HTMLDivElement>(null);

    const [monthData, setMonthData] = useState(() =>
        getMonthRange(startDate.getMonth(), startDate.getFullYear(), PADDING),
    );

    return (
        <div className={cx('picker', className)} ref={pickerRef}>
            {monthData.map((m) => (
                <MonthBox key={`${m.month}${m.year}`} width={monthWidth} data={m} />
            ))}
        </div>
    );
}

function MonthBox({ width, data }: { width: number; data: MonthData }) {
    const dateEls = [];
    const dt = new Date(data.startDate);
    for (let i = 0; i < 36; i++) {
        dt.setDate(dt.getDate() + i);
        dateEls.push(
            <button className="date" key={dt.getTime()}>
                {dt.getDate()}
            </button>,
        );
    }

    return (
        <div style={{ width }} className="month">
            <div style={{ gridColumn: '1 / 8' }}>{`${MonthNames[data.month]} ${data.year}`}</div>
            {DayNames.map((d) => (
                <div key={d}>{d}</div>
            ))}
            {dateEls}
        </div>
    );
}

/**
 * Generate a list of continuous month data: [currMonth, currMonth + padding]
 */
function getMonthRange(currMonth: number, currYear: number, padding: number): MonthData[] {
    const currDate = new Date(currYear, currMonth, 1);
    const fromDate = new Date(currDate.setMonth(currDate.getMonth() - padding));

    const results: MonthData[] = [];
    for (let i = 0; i < padding; i++) {
        const firstDateOfMonth = new Date(fromDate.setMonth(fromDate.getMonth() + i));

        // For displaying purpose, the fist day of month on calendar is not actually the first day of month.
        // It can be the day of previous month.
        if (firstDateOfMonth.getDay() > 0) {
            firstDateOfMonth.setDate(firstDateOfMonth.getDate() - firstDateOfMonth.getDay());
        }

        results.push({
            startDate: firstDateOfMonth,
            month: fromDate.getMonth(),
            year: fromDate.getFullYear(),
        });
    }

    return results;
}
