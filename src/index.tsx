import './style.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';

const PADDING = 10; // 10 months
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
    startDate?: Date;
    monthWidth?: number;
    onChange?: (values: Date | [Date, Date] | null) => void;
}) {
    const pickerRef = useRef<HTMLDivElement>(null);
    const [padding, setPadding] = useState(PADDING);

    const [monthData, setMonthData] = useState(() =>
        getMonthRange(startDate.getMonth(), startDate.getFullYear(), padding),
    );
    const updatePadding = useCallback(() => {
        if (!pickerRef?.current) return;

        const rect = pickerRef.current.getBoundingClientRect();
        setPadding(Math.ceil(rect.width / monthWidth));
    }, [setPadding, pickerRef]);

    useEffect(() => {
        if (pickerRef.current) {
            updatePadding();
        }

        window.addEventListener('resize', updatePadding);
        return () => {
            window.removeEventListener('resize', updatePadding);
        };
    }, [setPadding]);

    return (
        <div className={cx('hdp-picker', className)} ref={pickerRef}>
            {monthData.map((m) => (
                <MonthBox key={`${m.month}${m.year}`} width={monthWidth} data={m} />
            ))}
        </div>
    );
}

function MonthBox({ width, data }: { width: number; data: MonthData }) {
    const dateEls = [];
    const dt = new Date(data.startDate);
    let step = 0;
    for (let i = 0; i < 42; i++) {
        dt.setDate(dt.getDate() + step);
        const disabled = dt.getMonth() !== data.month;
        const tabIndex = disabled ? { tabIndex: -1 } : {};
        dateEls.push(
            <button {...tabIndex} className={cx('hdp-date', { disabled })} key={dt.getTime()}>
                {dt.getDate()}
            </button>,
        );
        step = 1;
    }

    return (
        <div className="hdp-month">
            <div className="hdp-monthname">{`${MonthNames[data.month]} ${data.year}`}</div>
            {DayNames.map((d, i) => (
                <div className="hdp-weekday" key={i}>
                    {d}
                </div>
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

    const results: MonthData[] = [];
    let step = 0;
    for (let i = 0; i < padding; i++) {
        const firstDateOfMonth = new Date(currDate.setMonth(currDate.getMonth() + step));

        // For displaying purpose, the fist day of month on calendar is not actually the first day of month.
        // It can be the day of previous month.
        if (firstDateOfMonth.getDay() > 0) {
            firstDateOfMonth.setDate(firstDateOfMonth.getDate() - firstDateOfMonth.getDay());
        }

        results.push({
            startDate: firstDateOfMonth,
            month: currDate.getMonth(),
            year: currDate.getFullYear(),
        });

        step = 1;
    }

    return results;
}
