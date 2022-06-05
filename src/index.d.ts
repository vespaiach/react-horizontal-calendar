export default function DatePicker({
    className,
    startDate,
    monthBoxWidth,
    monthNameCellHeight,
    weekDayCellHeight,
    dateCellHeight,
    allowRangeSelection,
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
}): JSX.Element;
