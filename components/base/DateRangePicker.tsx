import React, { CSSProperties } from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { ModalProps } from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import dayjs, { Dayjs } from "dayjs";
import Grow from "@mui/material/Grow";

type Props = {
  value?: Dayjs[];
  onChange?: (value: Dayjs[]) => void;
  anchorEl?: null | Element | (() => Element) | undefined;
  onClose?: () => void;
};

type PickersDayProps = {
  outsideCurrentMonth: boolean;
  day: Dayjs;
  today: boolean;
};
enum Mode {
  DAY,
  MONTH,
  YEAR,
}

const weeks = ["S", "M", "T", "W", "T", "F", "S"];
const years = Array.from({ length: 2100 - 1900 }).map((_, i) => 1900 + i);
const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const rows = [0, 1, 2, 3, 4, 5];
const cols = [0, 1, 2, 3, 4, 5, 6];

const isBetween = (date: Dayjs, [startDate, endDate]: [Dayjs, Dayjs]) => {
  return date.isAfter(startDate) && date.isBefore(endDate);
};

const weekNodes = weeks.map((week, index) => (
  <span
    key={index}
    className="text-[#E3E3E3] text-xs w-10 h-10 flex items-center justify-center"
  >
    {week}
  </span>
));
const DateRangePicker = ({ anchorEl, onClose, value, onChange }: Props) => {
  const today = dayjs();
  const [mode, setMode] = React.useState(Mode.DAY);
  const [pickerLeftDate, setPickerLeftDate] = React.useState(
    today.startOf("month")
  );
  const pickerRightDate = React.useMemo(
    () => pickerLeftDate.add(1, "month"),
    [pickerLeftDate]
  );
  const indexRange = React.useMemo(() => {
    const leftStartIndex = pickerLeftDate.day();
    const leftEndIndex = pickerLeftDate.endOf("month").day();
    const rightStartIndex = pickerRightDate.day();
    const rightEndIndex = pickerRightDate.endOf("month").day();
    return {
      leftStartIndex,
      leftEndIndex,
      rightStartIndex,
      rightEndIndex,
    };
  }, [pickerLeftDate, pickerRightDate]);
  const [dateRange, setDateRange] = React.useState<Dayjs[]>(value || []);
  const [startDate, endDate] = dateRange;
  const open = Boolean(anchorEl);
  const dateRangeChange = (day: Dayjs) => {
    if (!startDate || endDate) {
      setDateRange([day]);
    } else {
      const newDateRange = startDate.isBefore(day)
        ? [startDate, day]
        : [day, startDate];
      setDateRange(newDateRange);
      onChange && onChange(newDateRange);
      onPopoverClose();
    }
  };
  const onPopoverClose = () => {
    onClose && onClose();
  };
  const toPrevMonth = () => {
    setPickerLeftDate(pickerLeftDate.subtract(1, "month"));
  };
  const toNextMonth = () => {
    setPickerLeftDate(pickerLeftDate.add(1, "month"));
  };
  const onTransitionEnd = () => {
    if (!open && mode !== Mode.DAY) {
      setMode(Mode.DAY);
    }
  };
  const changeYear = (year: number) => {
    setPickerLeftDate(pickerLeftDate.year(year));
    setMode(Mode.MONTH);
  };
  const changeMonth = (month: number) => {
    setPickerLeftDate(pickerLeftDate.month(month));
    setMode(Mode.DAY);
  };
  React.useEffect(() => {
    setDateRange(value || []);
  }, [value]);
  const generateDivStyle = (day: Dayjs): CSSProperties => {
    const style: CSSProperties = {};
    if (endDate) {
      if (isBetween(day, [startDate, endDate])) {
        style.background = "#1E1E1E";
        if (day.day() === 0) {
          style.borderRadius = "50% 0 0 50%";
        } else if (day.day() === 6) {
          style.borderRadius = "0 50% 50% 0";
        }
      } else if (day.isSame(startDate)) {
        style.background = "#1E1E1E";
        style.borderRadius = "50% 0 0 50%";
      } else if (day.isSame(endDate)) {
        style.background = "#1E1E1E";
        style.borderRadius = "0 50% 50% 0";
      }
    }
    return style;
  };
  const generateButtonStyle = ({
    day,
    today,
  }: PickersDayProps): CSSProperties => {
    const style: CSSProperties = {};
    if (day.isSame(startDate) || day.isSame(endDate)) {
      style.background = "#C2C1C1";
      style.color = "#1D222E";
    } else if (today) {
      style.border = "1px";
      style.borderStyle = "solid";
      style.borderColor = "#E6E6E6";
      style.color = "#E6E6E6";
    } else {
      style.color = "#E6E6E6";
    }
    return style;
  };
  const renderDay = (props: PickersDayProps): React.ReactElement => {
    const { outsideCurrentMonth, day, today } = props;
    return outsideCurrentMonth ? (
      <div className="w-10 h-10"></div>
    ) : (
      <div style={generateDivStyle(day)} className="w-10 h-10 box-border">
        <Button
          style={generateButtonStyle(props)}
          onClick={() => dateRangeChange(day)}
          className="min-w-0 p-0 w-10 h-10 text-xs font-normal rounded-full"
        >
          {day.date()}
        </Button>
      </div>
    );
  };
  const renderMonth = (
    pickerDate: Dayjs,
    startIndex: number,
    endIndex: number
  ) => {
    return rows.map((row) => (
      <div key={row} className="flex my-0.5">
        {cols.map((col) => {
          const dayNum = row * 7 + col;
          const day = pickerDate.day(dayNum);
          const outsideCurrentMonth = day.month() !== pickerDate.month();
          const isToday = today.isSame(day, "day");
          const props = {
            outsideCurrentMonth,
            day,
            today: isToday,
          };
          return <div key={col}>{renderDay(props)}</div>;
        })}
      </div>
    ));
  };
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onPopoverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      onTransitionExited={onTransitionEnd}
    >
      <div className="bg-[#292929] text-[#E6E6E6] p-6 w-full">
        {mode === Mode.DAY && (
          <Grow in={mode === Mode.DAY}>
            <div className="px-4">
              <div className="flex">
                <div>
                  <div className="flex items-center justify-center relative h-2 mb-2">
                    <IconButton
                      onClick={toPrevMonth}
                      className="text-[#E6E6E6] absolute top-1/2 -translate-y-1/2 left-0"
                    >
                      <KeyboardArrowLeftRoundedIcon />
                    </IconButton>
                    <Button
                      onClick={() => setMode(Mode.YEAR)}
                      className="text-[#E6E6E6] capitalize"
                    >
                      {pickerLeftDate.format("MMMM")} {pickerLeftDate.year()}
                    </Button>
                  </div>
                  <div className="flex items-center">{weekNodes}</div>
                  <div>
                    {renderMonth(
                      pickerLeftDate,
                      indexRange.leftStartIndex,
                      indexRange.leftEndIndex
                    )}
                  </div>
                </div>
              </div>
              <div className="flex">
                <div>
                  <div className="flex items-center justify-center relative h-2 mb-2">
                    <IconButton
                      onClick={toNextMonth}
                      className="text-[#E6E6E6] absolute top-1/2 -translate-y-1/2 right-0"
                    >
                      <KeyboardArrowRightRoundedIcon />
                    </IconButton>
                    <Button
                      onClick={() => setMode(Mode.YEAR)}
                      className="text-[#E6E6E6] capitalize"
                    >
                      {pickerRightDate.format("MMMM")} {pickerRightDate.year()}
                    </Button>
                  </div>
                  <div className="flex items-center">{weekNodes}</div>
                  <div className="">
                    {renderMonth(
                      pickerRightDate,
                      indexRange.rightStartIndex,
                      indexRange.rightEndIndex
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Grow>
        )}
        {mode === Mode.YEAR && (
          <Grow in={mode === Mode.YEAR}>
            <div className="h-full overflow-y-auto">
              {years.map((year) => {
                const isSelectYear = pickerLeftDate.year() === year;
                return (
                  <Button
                    key={year}
                    onClick={() => changeYear(year)}
                    className={`text-[#E6E6E6] rounded-full ${
                      isSelectYear && "bg-[#C2C1C1] text-[#1D222E]"
                    }`}
                  >
                    {year}
                  </Button>
                );
              })}
            </div>
          </Grow>
        )}
        {mode === Mode.MONTH && (
          <Grow in={mode === Mode.MONTH}>
            <div className="h-full overflow-y-auto grid grid-cols-4 grid-rows-3">
              {months.map((month) => {
                const isSelectMonth = pickerLeftDate.month() === month;
                const monthName = pickerLeftDate.month(month).format("MMM");
                return (
                  <div
                    key={month}
                    className="col-1 row-1 flex items-center justify-center"
                  >
                    <Button
                      onClick={() => changeMonth(month)}
                      className={`text-[#E6E6E6] rounded-full capitalize ${
                        isSelectMonth && "bg-[#C2C1C1] text-[#1D222E]"
                      }`}
                    >
                      {monthName}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Grow>
        )}
      </div>
    </Popover>
  );
};

export default DateRangePicker;
