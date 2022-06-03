import './style.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useGesture } from '@use-gesture/react';

const DayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthData {
    startDate: Date;
    x: number;
    month: number;
    year: number;
}

export default function DatePicker({
    className,
    startDate = new Date(),
    boxWidth = 290,
    onChange,
}: {
    className?: string;
    startDate?: Date;
    boxWidth?: number;
    onChange?: (values: Date | [Date, Date] | null) => void;
}) {
    const pickerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(2000);
    const [x, setX] = useState(0);

    const [monthData, setMonthData] = useState(() =>
        getMonthRange({
            startMonth: startDate.getMonth(),
            startYear: startDate.getFullYear(),
            boxWidth,
            containerWidth,
            containerOffset: x,
        }),
    );
    const updatePadding = useCallback(() => {
        if (!pickerRef?.current) return;

        const rect = pickerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
    }, [setContainerWidth, pickerRef]);

    useEffect(() => {
        if (pickerRef.current) {
            updatePadding();
        }

        window.addEventListener('resize', updatePadding);
        return () => {
            window.removeEventListener('resize', updatePadding);
        };
    }, [updatePadding, pickerRef.current]);

    const bind = useGesture({
        onDrag: ({ delta: [dx] }) => {
            setX(x + dx);
            setMonthData(
                getMonthRange({
                    startMonth: startDate.getMonth(),
                    startYear: startDate.getFullYear(),
                    boxWidth,
                    containerWidth,
                    containerOffset: x + dx,
                }),
            );
        },
    });

    return (
        <div className={cx('hdp-container', className)}>
            <div
                {...bind()}
                className="hdp-picker"
                ref={pickerRef}
                style={{ transform: `translate3d(${x}px,0px,0px)` }}>
                {monthData.map((m) => (
                    <MonthBox key={`${m.month}${m.year}`} data={m} />
                ))}
            </div>
        </div>
    );
}

function MonthBox({ data }: { data: MonthData }) {
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
        <div className="hdp-month" style={{ transform: `translate3d(${data.x}px,0px,0px)` }}>
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
 * Generate a list of continuous month data:
 * [two padding months, startMonth + deltaMonth, months after (based on container's width), two padding months]
 */
function getMonthRange({
    startMonth,
    startYear,
    boxWidth,
    containerWidth,
    containerOffset,
}: {
    startMonth: number;
    startYear: number;
    boxWidth: number;
    containerWidth: number;
    containerOffset: number;
}): MonthData[] {
    const currDate = new Date(startYear, startMonth, 1);

    const deltaMonth = Math.trunc(Math.abs(containerOffset) / boxWidth);
    currDate.setMonth(currDate.getMonth() - 2 + deltaMonth * (containerOffset > 0 ? -1 : 1));

    const totalMonths = 2 + 1 + Math.trunc(containerWidth / boxWidth) + 2; // left_padding + start_month + visible_months + right_padding

    const results: MonthData[] = [];
    for (let i = 1; i <= totalMonths; i++) {
        const firstDateOfMonth = new Date(currDate.setMonth(currDate.getMonth() + 1));

        results.push({
            startDate: firstDateInMonth(firstDateOfMonth),
            month: currDate.getMonth(),
            year: currDate.getFullYear(),
            x:
                ((currDate.getFullYear() - startYear) * 12 + (currDate.getMonth() - startMonth)) *
                (boxWidth + 4),
        });
    }

    return results;
}

/**
 * For displaying purpose, the fist day of month on calendar is not actually the first day of month.
 * It can be the day of previous month.
 */
function firstDateInMonth(firstDateOfMonth: Date): Date {
    if (firstDateOfMonth.getDay() > 0) {
        firstDateOfMonth.setDate(firstDateOfMonth.getDate() - firstDateOfMonth.getDay());
    }

    return firstDateOfMonth;
}
