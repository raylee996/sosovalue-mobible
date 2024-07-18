import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { getIndicatorData } from 'http/macro'
import dayjs from "dayjs";
import { useInfiniteScroll } from 'ahooks';
import FedWatch from "./FedWatch";
import Probability from './Probability'
import { transferMoney } from "helper/tools";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const tabs = [
    {
        title: 'FedWatch tool',
        category: 0,
    },
    // {
    //     title: 'Probability',
    //     category: 1,
    // },
    {
        title: 'SOFR',
        category: 57
    },
    {
        title: 'TGCR',
        category: 54
    },
    {
        title: 'BGCR',
        category: 58
    },
    {
        title: 'ON RRP',
        category: 63
    }
]

const FedWatchTool = () => {
    const tableRef = React.useRef<HTMLDivElement>(null)
    const [category, setCategory] = React.useState(tabs[0].category)
    const { data } = useInfiniteScroll<Required<API.ListResponse<API.IndicatorData & { pubDateString: string; }>>>(
        async data => {
            if (category !== 0) {
                const res = await getIndicatorData({ pageNum: data ? Number(data.pageNum) + 1 : 1, pageSize: 20, classificationId: category, isDisplay: 0 })
                const indicatorData = res.data.list || []
                const list = indicatorData.map((data, index) => {
                    return {
                        ...data,
                        previous: index === indicatorData.length - 1 ? 0 : indicatorData[index + 1].publishedValue,
                        pubDateString: data.dateType === 1 ? dayjs((+data.pubDate) * 1000).format('MMMM DD, YYYY') : data.pubDate
                    }
                })
                return { ...res.data, list }
            }
            return {
                list: [],
                total: 0,
                totalPage: 0,
                pageNum: 1,
                pageSize: 10
            }
        },
        {
            target: tableRef.current,
            reloadDeps: [category],
            isNoMore: (data) => {
                return Number(data?.pageNum) >= Number(data?.totalPage)
            },
        },
    )
    const tabChange = (event: React.SyntheticEvent, category: number) => {
        setCategory(category)
    }
    return (
        <div className="h-full flex flex-col items-stretch relative">
            
            {/* <List className='flex py-0 h-10'>
                {
                    tabs.map(({ title, category: itemCategory }) => (
                        <ListItem disablePadding key={itemCategory} className='px-3 whitespace-nowrap'>
                            <ListItemButton className={`px-0 ${itemCategory === category ? 'text-primary' : 'text-[#8D8D8D]'}`} onClick={() => tabChange(itemCategory)}>
                                <span className='text-sm'>{title}</span>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List> */}
            <Tabs
                value={category}
                onChange={tabChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                className="min-h-0 h-10 relative"
                classes={{scrollButtons: 'text-[#F4F4F4] area-shadow', indicator: 'hidden'}}
                sx={{
                    '& .MuiTabs-scrollButtons:first-of-type': {
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        background: '#0D0D0D',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                    },
                    '& .MuiTabs-scrollButtons:last-of-type': {
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        background: '#0D0D0D',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                    }
                }}
            >
                {
                    tabs.map(({ title, category: itemCategory }) => <Tab key={itemCategory} className="text-[#8D8D8D] normal-case px-3 py-2 min-w-0 min-h-0 h-10" classes={{selected: 'text-primary'}} label={title} value={itemCategory} />)
                }
            </Tabs>
            {
                category === 0 && (
                    <div className="px-3 flex-1 h-0 overflow-y-auto">
                        <FedWatch />
                    </div>
                )

            }
            {
                category === 1 && (
                    <div className="px-3 flex-1 h-0 overflow-y-auto">
                        <Probability />
                    </div>
                )
            }
            {
                category !== 0 && category !== 1 && (
                    <div className="text-xs px-3 text-[#BBBBBB] text-center mt-4 flex-1 h-0 overflow-y-auto" ref={tableRef}>
                        <div className="flex border-0 border-b border-[#242424] border-solid pb-1.5">
                            <div className="basis-1/3 flex items-center justify-center">Release date</div>
                            <div className="basis-1/3 flex items-center justify-center">Actual</div>
                            {/* <div className="basis-1/3 flex items-center justify-center">Forecast</div> */}
                            <div className="basis-1/3 flex items-center justify-center">Previous</div>
                        </div>
                        {
                            data?.list.map(({ pubDateString, publishedValue, predictedValue }, i) => (
                                <div className="flex items-center h-4 mt-1" key={i}>
                                    <div className="basis-1/3 flex items-center justify-center">{pubDateString}</div>
                                    <div className="basis-1/3 flex items-center justify-center">{transferMoney(publishedValue)}</div>
                                    {/* <div className="basis-1/3 flex items-center justify-center">{predictedValue ? transferMoney(predictedValue) : '-'}</div> */}
                                    <div className="basis-1/3 flex items-center justify-center">{transferMoney(i === data.list.length - 1 ? 0 : data.list[i + 1].publishedValue)}</div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default FedWatchTool