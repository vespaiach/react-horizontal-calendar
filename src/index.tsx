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

type RangeSelection = [Date | null, Date | null];

export default function DatePicker({
    className,
    startDate = new Date(),
    monthBoxWidth = 290,
    monthNameCellHeight = 32,
    weekDayCellHeight = 32,
    dateCellHeight = 36,
    allowRangeSelection = false,
    onChange,
}: {
    className?: string;
    startDate?: Date;
    monthBoxWidth?: number;
    monthNameCellHeight?: number;
    weekDayCellHeight?: number;
    dateCellHeight?: number;
    allowRangeSelection?: boolean;
    onChange?: (values: Date | [Date, Date] | null) => void;
}) {
    const pickerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(2000);
    const [x, setX] = useState(0);
    const [monthData, setMonthData] = useState(() =>
        getMonthRange({
            startMonth: startDate.getMonth(),
            startYear: startDate.getFullYear(),
            monthBoxWidth,
            containerWidth,
            containerOffset: x,
        }),
    );
    const [selected, setSelected] = useState<RangeSelection>([null, null]);

    const updateContainerWidth = useCallback(() => {
        if (!pickerRef?.current) return;

        const rect = pickerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
    }, [setContainerWidth, pickerRef]);

    useEffect(() => {
        if (pickerRef.current) {
            updateContainerWidth();
        }

        window.addEventListener('resize', updateContainerWidth);
        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, [updateContainerWidth, pickerRef.current]);

    const update = (delta: number) => {
        setX(x + delta);
        setMonthData(
            getMonthRange({
                startMonth: startDate.getMonth(),
                startYear: startDate.getFullYear(),
                monthBoxWidth,
                containerWidth,
                containerOffset: x + delta,
            }),
        );
    };

    const bind = useGesture({
        onDrag: ({ delta: [x] }) => update(x),
        onWheel: ({ delta: [, y] }) => update(y),
    });

    const handleClick = useCallback(
        (dt: Date) => {
            if (allowRangeSelection) {
                if (selected[0] === null) {
                    setSelected([dt, null]);
                } else {
                    const s: [Date, Date] = selected[0] > dt ? [dt, selected[0]] : [selected[0], dt];
                    setSelected(s);
                    onChange?.(s);
                }
            } else {
                setSelected([dt, null]);
                onChange?.(dt);
            }
        },
        [onChange, allowRangeSelection, selected],
    );

    return (
        <div
            style={
                {
                    '--hdp-month-box-width': `${monthBoxWidth}px`,
                    '--hdp-month-name-cell-height': `${monthNameCellHeight}px`,
                    '--hdp-week-day-cell-height': `${weekDayCellHeight}px`,
                    '--hdp-date-cell-height': `${dateCellHeight}px`,
                } as React.CSSProperties
            }
            className={cx('hdp-outer-container', className)}>
            <div
                {...bind()}
                className="hdp-inner-container"
                ref={pickerRef}
                style={{ transform: `translate3d(${x}px,0px,0px)` }}>
                {monthData.map((m) => (
                    <MonthBox
                        key={`${m.month}${m.year}`}
                        data={m}
                        onClick={handleClick}
                        dateSelected={selected}
                    />
                ))}
            </div>
        </div>
    );
}

function MonthBox({
    data,
    onClick,
    dateSelected,
}: {
    onClick: (dt: Date) => void;
    data: MonthData;
    dateSelected: RangeSelection;
}) {
    const mousePointRef = useRef<{ x: number; y: number } | null>(null);
    const dateEls = [];
    const dt = new Date(data.startDate);
    let step = 0;
    for (let i = 0; i < 42; i++) {
        dt.setDate(dt.getDate() + step);
        const disabled = dt.getMonth() !== data.month;
        const copy = new Date(dt);
        const selected =
            !disabled &&
            dateSelected[0] &&
            (dateSelected[1] !== null
                ? dt >= dateSelected[0] && dt <= dateSelected[1]
                : isSameDate(dt, dateSelected[0] as Date));

        if (disabled) {
            dateEls.push(
                <button
                    tabIndex={-1}
                    className={cx('hdp-date-cell', { disabled, selected })}
                    key={dt.getTime()}>
                    {dt.getDate()}
                </button>,
            );
        } else {
            dateEls.push(
                <button
                    onMouseDown={(evt) => {
                        mousePointRef.current = { x: evt.clientX, y: evt.clientY };
                    }}
                    onMouseUp={({ clientX, clientY }) => {
                        if (!mousePointRef.current) return;

                        if (
                            Math.abs(clientX - mousePointRef.current.x) < 10 &&
                            Math.abs(clientY - mousePointRef.current.y) < 10
                        ) {
                            onClick(copy);
                            mousePointRef.current = null;
                        }
                    }}
                    className={cx('hdp-date-cell', { disabled, selected })}
                    key={dt.getTime()}>
                    {dt.getDate()}
                </button>,
            );
        }
        step = 1;
    }

    return (
        <div className="hdp-month-box" style={{ transform: `translate3d(${data.x}px,0px,0px)` }}>
            <div className="hdp-month-name-cell">{`${MonthNames[data.month]} ${data.year}`}</div>
            {DayNames.map((d, i) => (
                <div className="hdp-week-day-cell" key={i}>
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
    monthBoxWidth,
    containerWidth,
    containerOffset,
}: {
    startMonth: number;
    startYear: number;
    monthBoxWidth: number;
    containerWidth: number;
    containerOffset: number;
}): MonthData[] {
    const currDate = new Date(startYear, startMonth, 1);

    const deltaMonth = Math.trunc(Math.abs(containerOffset) / monthBoxWidth);
    currDate.setMonth(currDate.getMonth() - 3 + deltaMonth * (containerOffset > 0 ? -1 : 1));

    const totalMonths = 2 + 1 + Math.trunc(containerWidth / monthBoxWidth) + 2; // left_padding + start_month + visible_months + right_padding

    const results: MonthData[] = [];
    for (let i = 1; i <= totalMonths; i++) {
        const firstDateOfMonth = new Date(currDate.setMonth(currDate.getMonth() + 1));

        results.push({
            startDate: firstDateInMonth(firstDateOfMonth),
            month: currDate.getMonth(),
            year: currDate.getFullYear(),
            x:
                ((currDate.getFullYear() - startYear) * 12 + (currDate.getMonth() - startMonth)) *
                (monthBoxWidth + 4),
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

function isSameDate(dta: Date, dtb: Date) {
    return (
        dta.getFullYear() === dtb.getFullYear() &&
        dta.getMonth() === dtb.getMonth() &&
        dta.getDate() === dtb.getDate()
    );
}
