import React from "react"
import Button from "@mui/material/Button"
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton'
import IndicatorChart from './IndicatorChart'
import { getChartData, getIndicatorClasses, getChartInvestData } from 'http/macro'
import dayjs from 'dayjs'
import { Swiper, SwiperSlide } from 'swiper/react';
import * as SwiperClass from 'swiper'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";
import { useInfiniteScroll } from "ahooks";
import { intlNumberFormat } from 'helper/tools'
import Image from "next/image";
import { getChartDatas } from 'http/home'
import useLoading from "hooks/useLoading"
const CalendarTabId = '0'

const hideIndicatorIds = [13, 14, 16, 17, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 32, 33, 34, 35, 52, 53, 54, 55, 56, 58, 59, 60]

type Props = {
    currentIndicator?: API.Indicator;
    isCurrentDay: boolean;
    indicators: API.Indicator[];
    selectIndicator: (indicator: API.Indicator) => void;
}

type Data = {
    actual: number;
    forecast: string;
    percent: number;
    releaseTimeTimestamp: number;
}

const IndicatorList = ({ currentIndicator, isCurrentDay, indicators, selectIndicator }: Props) => {
    const swiperRef = React.useRef<SwiperClass.Swiper>()
    
    const [activeIndex, setActiveIndex] = React.useState(0)
    const slideChange = (swiper: SwiperClass.Swiper) => {
        setActiveIndex(swiper.activeIndex)
    }
    const slidePrev = () => {
        swiperRef.current?.slidePrev()
    }
    const slideNext = () => {
        swiperRef.current?.slideNext()
    }

    return (
        <div className="mb-2 pr-3">
            {
                indicators.map((indicator, index) => {

                    return (
                        <div key={index} className={`rounded-sm mb-1 hover:bg-[#282828] ${isCurrentDay && currentIndicator?.classificationId === indicator.classificationId ? 'bg-[#282828]' : ''}`} onClick={() => selectIndicator(indicator)}>
                            <Button fullWidth className="text-sm text-[#BBBBBB] h-6 px-2 normal-case justify-start">
                                <span className="truncate pointer-events-none">{indicator.name} </span>
                            </Button>
                        </div>
                    )
                })
            }
        </div>
    )
}

const CalendarBlock = () => {
    const tableRef = React.useRef<HTMLDivElement>(null)
    const Loading = useLoading()
    const [tabId, setTabId] = React.useState(CalendarTabId)
    const [calendarIndicators, setCalendarIndicators] = React.useState<{ timeStamp: number; timeString: string; indicators: API.Indicator[] }[]>([])
    const [topIndicators, setTopIndicators] = React.useState<API.Indicator[]>([])
    const [childIndicators, setChildIndicators] = React.useState<API.Indicator[]>([])
    const [currentIndicator, setCurrentIndicator] = React.useState<API.Indicator>()
    const [allDataMap, setAllDataMap] = React.useState<Data[]>()
    const [currentTimeStamp, setCurrentTimeStamp] = React.useState<number>()
    
    const indicatorData = React.useMemo(() => {
        // console.log(currentIndicator)
        // console.log(allDataMap)
        const indicatorData = allDataMap || []
        //const indicatorData = currentIndicator && allDataMap ? allDataMap[currentIndicator.classificationId] || allDataMap[currentIndicator.id] : []
        
        //console.log(indicatorData)
        return indicatorData.map((data: any, index: number) => {

            return {
                ...data,
                precent: data.precent,
                previous: index === 0 ? 0 : indicatorData[index - 1].actual,
                pubDateString: dayjs((+data.releaseTimeTimestamp)).format('YYYY-MM-DD')
            }
        }).reverse()
    }, [allDataMap, currentIndicator])

    const tabChange = (parentId: string) => {
        tableRef.current?.scrollTo({top:0})
        setTabId(parentId)
        if (parentId === '0') {
            initCalendarIndicators()
        } else {
            getIndicatorClasses({ parentId, type: 2 }).then(res => {
                if (res.data) {
                    const filterData = res.data.filter(item => !hideIndicatorIds.includes(Number(item.id)))
                    setChildIndicators(filterData)
                    setCurrentIndicator(filterData[0])
                    setCurrentTimeStamp(undefined)
                }
            })
        }
    }
    const selectIndicator = async (indicator: API.Indicator, timeStamp?: number) => {
        //console.log(indicator)
        
        // console.log(timeStamp)
        
        //console.log(data)
        tableRef.current?.scrollTo({top:0})
        setCurrentIndicator(indicator)
        setCurrentTimeStamp(timeStamp)
    }


    const initCalendarIndicators = async () => {
        const today = dayjs().hour(0).minute(0).second(0)
        const startTime = today.unix()
        const endTime = today.add(14, 'day').hour(23).minute(59).second(59).unix()

        getChartInvestData('1666032986125463593', { startTime, endTime }).then(res => {
            if (res.data) {
                Loading.close()
                const data = JSON.parse(res.data.responseData)
                //console.log(res.data.responseData)
                const timeRange = res.data.timeRange
                const calendarIndicators = timeRange.map(timeStamp => {
                    const timeStampNum = (+timeStamp) * 1000
                    return {
                        timeStamp: timeStampNum,
                        timeString: dayjs(timeStampNum).format('M-D ddd'),
                        indicators: data[timeStamp] ? data[timeStamp] : []
                    }
                })
                setCalendarIndicators(calendarIndicators)
                const firstCalendarIndicator = calendarIndicators.find(({ indicators }) => indicators.length)
                if (firstCalendarIndicator) {
                    const { timeStamp, indicators } = firstCalendarIndicator
                    selectIndicator(indicators[0], timeStamp)
                }
            }
        })
    }

    React.useEffect(() => {
        if(currentIndicator){
            const params_id = currentIndicator.id ? currentIndicator.id : currentIndicator.classificationId
            
            getChartDatas({nameList:[params_id,params_id+"_1"]}).then(res => {
                const obj:any = {};
                const actualList  = res.data[params_id] && JSON.parse(res.data[params_id])
                const forecastList  = res.data[params_id+"_1"] && JSON.parse(res.data[params_id+"_1"])
                
                const indicatorData = actualList.map((item:string[],index:number) => {
                    return {
                        releaseTimeTimestamp:item[0],
                        actual:item[1],
                        forecast:forecastList[index][1]
                    }
                })
                obj[params_id] = indicatorData
                setAllDataMap(indicatorData)
                //console.log(obj)
                // return indicatorData.map((data: any, index: number) => {

                //     return {
                //         ...data,
                //         //precent: data.precent,
                //         previous: index === 0 ? 0 : indicatorData[index - 1].actual,
                //         pubDateString: dayjs((+data.releaseTimeTimestamp)).format('YYYY-MM-DD')
                //     }
                // })
                
            })
        } 
        // getChartData('1666032986125463594').then(res => {
        //     const allData = JSON.parse(res.data.responseData) as Record<string, Data[]>[]
        //     const dataMap = allData.reduce<Record<string, Data[]>>((map, item) => {
        //         Object.keys(item).forEach(id => map[id] = item[id])
        //         return map
        //     }, {})
        //     console.log(dataMap)
        //     setAllDataMap(dataMap)
        // })
    }, [currentIndicator])
    React.useEffect(() => {
        getIndicatorClasses({ level: 1, type: 2 }).then(res => {
            setTopIndicators(res.data.filter(item => !hideIndicatorIds.includes(Number(item.id))))
        })
        initCalendarIndicators()
    }, [])
    return (
        <Loading.Component>
        <div className="p-3 h-full overflow-hidden flex flex-col items-stretch">
            <div className="flex">
                <Button variant="text" onClick={() => tabChange('0')} startIcon={<Image src={tabId === '0' ? '/img/svg/CalendarPlus.svg' : '/img/svg/CalendarPlusGray.svg'} width={16} height={16} alt=''/>} className={`normal-case text-sm font-bold min-w-0 px-0 ${tabId === '0' ? '' : 'text-[#8D8D8D]'}`}>Calendar</Button>
                <Divider className="border-l-[2px] border-[#343434] mx-6" orientation="vertical" variant="middle" flexItem />
                {
                    topIndicators.map(({ nameEn, id }) => <Button key={id} onClick={() => tabChange(id)} variant="text" className={`normal-case text-sm min-w-0 px-0 mr-6 ${tabId === id ? '' : 'text-[#8D8D8D]'}`}>{nameEn}</Button>)
                }
            </div>
            <div className="h-0 flex-1 flex gap-2">
                <div className="flex-1 overflow-hidden">
                    {
                        tabId === CalendarTabId ? (
                            <div className="w-full h-full overflow-y-auto">
                                {
                                    calendarIndicators.map(({ timeString, timeStamp, indicators }, i) => (
                                        <div key={i}>
                                            <div key={i}>
                                                <div className={`text-base overflow-hidden mb-2 ${currentTimeStamp === timeStamp ? 'text-primary' : 'text-[#F4F4F4]'}`}>
                                                    {timeString}
                                                </div>
                                                <IndicatorList isCurrentDay={currentTimeStamp === timeStamp} currentIndicator={currentIndicator} indicators={indicators} selectIndicator={indicator => selectIndicator(indicator, timeStamp)} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <List>
                                {
                                    childIndicators.map((indicator, index) => (
                                        <ListItem key={index} disablePadding className="mt-1 rounded-sm" onClick={() => selectIndicator(indicator)}>
                                            <ListItemButton className={`flex items-center text-sm text-[#BBBBBB] h-6 px-2 hover:bg-[#282828] ${currentIndicator?.id === indicator.id ? 'bg-[#282828]' : ''}`}>
                                                <span className="truncate">{indicator.nameEn}</span>
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        )
                    }
                </div>
                <div className="flex-1 overflow-y-auto" ref={tableRef}>
                    <IndicatorChart currentIndicator={currentIndicator} indicatorData={[...indicatorData.slice(0, 12)]} />
                    <div className="text-xs text-[#BBBBBB] text-center -mt-8">
                        <div className="flex border-0 border-b border-[#242424] border-solid pb-1.5">
                            <div className="basis-1/4 flex items-center justify-center">Date</div>
                            <div className="basis-1/4 flex items-center justify-center">Actual</div>
                            <div className="basis-1/4 flex items-center justify-center">Forecast</div>
                            <div className="basis-1/4 flex items-center justify-center">Previous</div>
                        </div>
                        <div>
                            {
                                indicatorData.map(({ pubDateString, publishedValue, predictedValue, actual, forecast, previous, indicatorClassificationDoVO, percent }, i) => {
                                    const getValueStr = (value: number) => {
                                        // if(percent === 0 ){
                                        //     if(value || value === 0) return intlNumberFormat(value)
                                        //     return '-'
                                        // }else{
                                        //     if(value || value === 0) return value + '%'
                                        //     return '-'
                                        // }
                                        if(value || value === 0){
                                            if((value+'').indexOf('%') == -1) return intlNumberFormat(value)
                                            return value
                                        } 
                                        return '-'
                                        //percent === 0 ? ((value && value !== 0) ? intlNumberFormat(value) : '-') : `${(value && value !== 0) ? value+'%' : `${value === 0 ? 0+'%' : '-'}`}`
                                    }

                                    return (
                                        <div className="flex items-center h-4 mt-1" key={i}>
                                            <div className="basis-1/4 flex items-center justify-center">{pubDateString} </div>
                                            <div className="basis-1/4 flex items-center justify-center">{getValueStr(actual)}</div>
                                            <div className="basis-1/4 flex items-center justify-center">{getValueStr(forecast) || '-'}</div>
                                            <div className="basis-1/4 flex items-center justify-center">{getValueStr(previous)}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Loading.Component>
    )
}

export default CalendarBlock