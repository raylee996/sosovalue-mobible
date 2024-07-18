import React, { CSSProperties, useState } from 'react'
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { ModalProps } from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import dayjs, { Dayjs } from 'dayjs';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';

type Props = {
    value?: Dayjs[];
    onChange?: (value: Dayjs[]) => void;
    anchorEl?: null | Element | (() => Element) | undefined;
    onClose?: () => void;
}

type PickersDayProps = {
    outsideCurrentMonth: boolean;
    day: Dayjs;
    today: boolean;
}
enum Mode {
    DAY, MONTH, YEAR
}

enum Direction {
    Left = 'left', Right = 'right'
}

const weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const years = Array.from({ length: 2100 - 1900 }).map((_, i) => 1900 + i)
const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const rows = [0, 1, 2, 3, 4, 5]
const cols = [0, 1, 2, 3, 4, 5, 6]

const isBetween = (date: Dayjs, [startDate, endDate]: [Dayjs, Dayjs]) => {
    return date.isAfter(startDate) && date.isBefore(endDate)
}

const weekNodes = weeks.map((week, index) => <span key={index} className='text-title text-base flex-1 h-10 flex items-center justify-center'>{week}</span>)
const SingleDateRangePicker = ({ anchorEl, onClose, value, onChange }: Props) => {
    const today = dayjs()
    const [mode, setMode] = React.useState(Mode.DAY)
    const [currentMonth, setCurrentMonth] = React.useState(today.startOf('month'))
    const [prevOrNextMonth, setPrevOrNextMonth] = React.useState(currentMonth)
    const [direction, setDirection] = useState<Direction>(Direction.Left)
    const [renderSwitch, setRenderSwitch] = useState(true)
    const [dateRange, setDateRange] = React.useState<Dayjs[]>(value || [])
    const [startDate, endDate] = dateRange
    const [activeRangeType, setActiveRangeType] = useState(-1)
    const [disable, setDisable] = useState(false)
    const open = Boolean(anchorEl);
    const dateRangeChange = (day: Dayjs) => {
        setActiveRangeType(-1)
        if (!startDate || endDate) {
            setDateRange([day.startOf('day')])
        } else {
            const newDateRange = startDate.isBefore(day) ? [startDate.startOf('day'), day.endOf('day')] : [day.startOf('day'), startDate.endOf('day')]
            setDateRange(newDateRange)

        }
    }
    const onPopoverClose = () => {
        onClose && onClose()
    }
    const ok = () => {
        if (dateRange.length === 2) {
            onChange && onChange(dateRange)
            onPopoverClose()
        }
    }
    const toPrevMonth = () => {
        setDisable(true)
        setRenderSwitch(!renderSwitch)
        setDirection(Direction.Left)
        setPrevOrNextMonth(currentMonth)
        setCurrentMonth(currentMonth.subtract(1, 'month'))
    }
    const toNextMonth = () => {
        setDisable(true)
        setRenderSwitch(!renderSwitch)
        setDirection(Direction.Right)
        setPrevOrNextMonth(currentMonth)
        setCurrentMonth(currentMonth.add(1, 'month'))
    }
    const onTransitionEnd = () => {
        if (!open && mode !== Mode.DAY) {
            setMode(Mode.DAY)
        }
    }
    const changeYear = (year: number) => {
        setCurrentMonth(currentMonth.year(year))
        setMode(Mode.MONTH)
    }
    const changeMonth = (month: number) => {
        setCurrentMonth(currentMonth.month(month))
        setMode(Mode.DAY)
    }
    const checkIsOnCurrentMonth = () => {
        if (currentMonth.isBefore(today, 'month')) {
            setDisable(true)
            setRenderSwitch(!renderSwitch)
            setDirection(Direction.Right)
            setPrevOrNextMonth(currentMonth)
            setCurrentMonth(today.startOf('month'))
        } else if (currentMonth.isAfter(today, 'month')) {
            setDisable(true)
            setRenderSwitch(!renderSwitch)
            setDirection(Direction.Left)
            setPrevOrNextMonth(currentMonth)
            setCurrentMonth(today.startOf('month'))
        }
    }
    const selectToday = () => {
        checkIsOnCurrentMonth()
        setActiveRangeType(0)
        setDateRange([today.startOf('day'), today.endOf('day')])

    }
    const select7Day = () => {
        checkIsOnCurrentMonth()
        setActiveRangeType(1)
        setDateRange([today.subtract(6, 'day').startOf('day'), today.endOf('day')])
    }
    const select1Month = () => {
        checkIsOnCurrentMonth()
        setActiveRangeType(2)
        setDateRange([today.subtract(1, 'month').startOf('day'), today.endOf('day')])
    }
    const select90Day = () => {
        checkIsOnCurrentMonth()
        setActiveRangeType(3)
        setDateRange([today.subtract(3, 'month').startOf('day'), today.endOf('day')])
    }
    const select1Year = () => {
        checkIsOnCurrentMonth()
        setActiveRangeType(4)
        setDateRange([today.subtract(1, 'year').startOf('day'), today.endOf('day')])
    }
    React.useEffect(() => {
        setDateRange(value || [])
    }, [value])
    const generateDivStyle = (day: Dayjs): CSSProperties => {
        const style: CSSProperties = {}
        if (endDate) {
            if (day.startOf('day').isSame(startDate)) {
                if (!day.endOf('day').isSame(endDate)) {
                    style.background = '#1E1E1E'
                    style.borderRadius = '50% 0 0 50%'
                }
            } else if (day.endOf('day').isSame(endDate)) {
                style.background = '#1E1E1E'
                style.borderRadius = '0 50% 50% 0'
            } else if (isBetween(day, [startDate, endDate])) {
                style.background = '#1E1E1E'
                if (day.day() === 0) {
                    style.borderRadius = '50% 0 0 50%'
                } else if (day.day() === 6) {
                    style.borderRadius = '0 50% 50% 0'
                }
            }
        }
        return style
    }
    const generateButtonStyle = ({ day, today }: PickersDayProps): CSSProperties => {
        const style: CSSProperties = {}
        if (day.startOf('day').isSame(startDate) || day.endOf('day').isSame(endDate)) {
            style.background = '#C2C1C1'
            style.color = '#1D222E'
        } else if (today) {
            style.border = '1px'
            style.borderStyle = 'solid'
            style.borderColor = '#E6E6E6'
            style.color = '#C2C2C2'
        } else {
            style.color = '#C2C2C2'
        }
        return style
    }
    const renderDay = (props: PickersDayProps): React.ReactElement => {
        const { outsideCurrentMonth, day, today } = props
        return outsideCurrentMonth ? <div className='w-full h-10'></div>
            : (
                <div style={generateDivStyle(day)} className='w-full text-center h-10 box-border'>
                    <Button
                        style={generateButtonStyle(props)}
                        onClick={() => dateRangeChange(day)}
                        className='min-w-0 p-0 w-10 h-10 text-base text-[#0D0D0D] font-normal rounded-full'>{day.date()}</Button>
                </div>
            )
    }
    const renderMonth = (pickerDate: Dayjs) => {
        return rows.map(row => (
            <div key={row} className='flex w-full mb-1'>
                {
                    cols.map(col => {
                        const dayNum = row * 7 + col
                        const day = pickerDate.day(dayNum)
                        const outsideCurrentMonth = day.month() !== pickerDate.month()
                        const isToday = today.isSame(day, 'day')
                        const props = {
                            outsideCurrentMonth,
                            day,
                            today: isToday
                        }
                        return <div key={col} className='flex-1'>{renderDay(props)}</div>
                    })
                }
            </div>
        ))
    }
    const renderMonthSlide = (transitionIn: boolean) => {
        if (transitionIn) {
            return (
                <Slide in={transitionIn} appear={false} direction={direction === Direction.Left ? Direction.Right : Direction.Left} unmountOnExit
                    onTransitionEnd={() => setDisable(false)}>
                    <div className='w-full'>
                        {
                            renderMonth(currentMonth)
                        }
                    </div>
                </Slide>
            )
        } else {
            return (
                <Slide in={transitionIn} appear={false} direction={direction === Direction.Left ? Direction.Left : Direction.Right} unmountOnExit
                    onTransitionEnd={() => setDisable(false)}>
                    <div className='w-full'>
                        {
                            renderMonth(prevOrNextMonth)
                        }
                    </div>
                </Slide>
            )
        }
    }
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onPopoverClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            onTransitionExited={onTransitionEnd}
            classes={{ paper: 'bg-block-color shadow-area rounded-lg' }}
        >
            <div className='text-[#E6E6E6] px-4 w-[360px] h-[470px]'>
                {
                    mode === Mode.DAY && (
                        <Grow in={mode === Mode.DAY}>
                            <div className='w-full'>
                                <div className='flex items-center pt-2 pb-2 -mx-4 px-4 border-0 border-b border-solid border-[#242424]'>
                                    <Button onClick={selectToday} className={`${activeRangeType === 0 && 'bg-[#C2C2C1] !text-[#1D222E]'} text-sub-title text-[13px] normal-case bg-[#262626] rounded-full min-w-0 px-4 mr-2`}>Today</Button>
                                    <Button onClick={select7Day} className={`${activeRangeType === 1 && 'bg-[#C2C2C1] !text-[#1D222E]'} text-sub-title text-[13px] normal-case bg-[#262626] rounded-full min-w-0 px-4 mr-2`}>7D</Button>
                                    <Button onClick={select1Month} className={`${activeRangeType === 2 && 'bg-[#C2C2C1] !text-[#1D222E]'} text-sub-title text-[13px] normal-case bg-[#262626] rounded-full min-w-0 px-4 mr-2`}>30D</Button>
                                    <Button onClick={select90Day} className={`${activeRangeType === 3 && 'bg-[#C2C2C1] !text-[#1D222E]'} text-sub-title text-[13px] normal-case bg-[#262626] rounded-full min-w-0 px-4 mr-2`}>90D</Button>
                                    <Button onClick={select1Year} className={`${activeRangeType === 4 && 'bg-[#C2C2C1] !text-[#1D222E]'} text-sub-title text-[13px] normal-case bg-[#262626] rounded-full min-w-0 px-4 mr-2`}>1Y</Button>
                                </div>
                                <div className='flex items-center justify-between relative h-12 mb-2'>
                                    <Button onClick={() => setMode(Mode.YEAR)} endIcon={<ArrowDropDownIcon />} className='text-[#E6E6E6] capitalize text-sm font-medium'>{currentMonth.format('MMMM')} {currentMonth.year()}</Button>
                                    <div>
                                        <IconButton disabled={disable} onClick={toPrevMonth} className='text-[#E6E6E6]'>
                                            <KeyboardArrowLeftRoundedIcon />
                                        </IconButton>
                                        <IconButton disabled={disable} onClick={toNextMonth} className='text-[#E6E6E6]'>
                                            <KeyboardArrowRightRoundedIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <div className='flex items-center mb-1'>
                                    {weekNodes}
                                </div>
                                <div className='flex items-stretch w-full'>
                                    {renderMonthSlide(renderSwitch)}
                                    {renderMonthSlide(!renderSwitch)}
                                </div>
                                <div className='flex justify-end py-2 pr-4 -mx-4 border-0 border-t border-solid border-[#242424]'>
                                    <Button onClick={onPopoverClose} className='normal-case text-sm font-medium text-[#C2C1C1] min-w-0'>Cancel</Button>
                                    <Button onClick={ok} className='normal-case text-sm font-medium text-[#C2C1C1] min-w-0 px-4 ml-2'>OK</Button>
                                </div>
                            </div>
                        </Grow>
                    )
                }
                {
                    mode === Mode.YEAR && (
                        <Grow in={mode === Mode.YEAR}>
                            <div className='h-full overflow-y-auto'>
                                {
                                    years.map(year => {
                                        const isSelectYear = currentMonth.year() === year
                                        return <Button key={year} onClick={() => changeYear(year)} className={`text-[#E6E6E6] rounded-full ${isSelectYear && 'bg-[#C2C1C1] !text-[#1D222E]'}`}>{year}</Button>
                                    })
                                }
                            </div>
                        </Grow>
                    )
                }
                {
                    mode === Mode.MONTH && (
                        <Grow in={mode === Mode.MONTH}>
                            <div className='h-full overflow-y-auto grid grid-cols-4 grid-rows-3'>
                                {
                                    months.map(month => {
                                        const isSelectMonth = currentMonth.month() === month
                                        const monthName = currentMonth.month(month).format('MMM')
                                        return (
                                            <div key={month} className='col-1 row-1 flex items-center justify-center'>
                                                <Button onClick={() => changeMonth(month)} className={`text-[#E6E6E6] rounded-full capitalize ${isSelectMonth && 'bg-[#C2C1C1] !text-[#1D222E]'}`}>{monthName}</Button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Grow>
                    )
                }
            </div>
        </Popover>
    )
}

export default SingleDateRangePicker