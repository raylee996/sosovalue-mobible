import React from "react"
import Button from "@mui/material/Button"
import News from 'components/operation/news/News'
import useLoading from "hooks/useLoading"
import { transferMoney } from "helper/tools"
const newsTab = [
    {
        title: 'Research',
        categoryList: [2,8]
    },
    {
        title: 'News',
        categoryList: [1,3,7]
    },
    {
        title: 'Insights',
        categoryList: [4]
    },
    {
        title: 'SoSo Reports',
        isAuth: 1
    }
]
type Props = {
    currentCategoryList?:any,
    sector:any,
    selectToken?: API.SearchCrypto,
    sectorConfig:any,
    dateRange:any,
    categoryTitle:string,
    search?:any,
    source:string[],
    groupList:number[],
    credibility?:string,
    sourceListNum:number,
    startTime?:number,
    endTime?:number,
    tabChange:(val:any) => any,
    sectorChange:(val:any) => any,
}

const CalendarBlock = ({source,groupList,dateRange,sourceListNum,startTime,endTime,sectorConfig,currentCategoryList,credibility,sector,categoryTitle,selectToken,search,tabChange,sectorChange}:Props) => {
    const Loading = useLoading()
    
    React.useEffect( () => {
        // newsTab.length > 0 && sectorConfig.length > 0 && Loading.close()
        newsTab.length > 0  && Loading.close()
    },[newsTab,sectorConfig])
    return (
        <Loading.Component>
        <div className="h-full flex flex-col items-stretch px-3 border-0 border-r border-solid border-[#242424]">
            <div className="flex">
                {
                    newsTab.map((item,index) => <Button key={item.title} onClick={() => tabChange(item)} variant="text" className={`normal-case basis-1/4 text-base min-w-0 px-0 font-normal ${categoryTitle == item.title ? 'text-[#FF4F20] bg-[#2B2B2B]' : 'text-[#C2C2C2]'}`}><span className={`${categoryTitle == item.title ? 'text-[#FF4F20] font-bold' : 'text-[#C2C2C2]'}`}>{item.title}</span><span className="ml-2.5 text-[13px] text-[#8F8F8F]">{groupList && transferMoney(groupList[index])}</span></Button>)
                }
            </div>
            <div className="py-1.5 px-3 mt-3">
                {sectorConfig.length > 0 && <Button onClick={() => sectorChange('')} variant="text" className={`normal-case text-xs min-w-0 px-0 font-normal mr-6 ${sector === '' ? 'text-[#FF4F20]' : 'text-[#C2C2C2]'}`}><span className={`${sector === '' ? 'text-[#FF4F20] font-bold' : 'text-[#C2C2C2]'}`}>All</span></Button>}

                {
                    sectorConfig.map((item:any) => <Button key={item.label} onClick={() => sectorChange(item)} variant="text" className={`normal-case text-xs min-w-0 px-0 font-normal mr-6 ${sector.label === item.label ? 'text-[#FF4F20]' : 'text-[#C2C2C2]'}`}><span className={`${sector.label === item.label ? 'text-[#FF4F20] font-bold' : 'text-[#C2C2C2]'}`}>{item.label}</span></Button>)
                }
            </div>
            <div className='shadow-area  bg-block-color text-[#fff] flex-1 h-0 overflow-y-auto rounded-lg'>
                <News tab={newsTab} sourceListNum={sourceListNum} dateRange={dateRange} currentCategoryList={currentCategoryList} sector={sector} selectToken={selectToken} search={search} credibility={credibility} source={source} startTime={startTime} endTime={endTime} sectorChange={sectorChange}/>
            </div>
        </div>
        </Loading.Component>
    )
}

export default CalendarBlock