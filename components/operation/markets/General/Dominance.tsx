import React from 'react'
import Tooltip from '@mui/material/Tooltip';
import { objectSort} from 'helper/tools'
import Image from 'next/image';
import * as echarts from 'echarts'
import { useDebounceFn } from 'ahooks';
type Props = {
  dominance: Array<number>,
  dominances: Array<number>,
  cryptoTotalList: API.cryptoTotal,
  findList: Array<API.findListToCurrency>,
  initDominances:Array<any>,
  initSosMarketCup:number,
  filterCoin:number,
  currentName:string,
  changeInitData: (data:any) => void
}
const Dominance = (props:Props) => {
    const {dominances, currentName,initDominances,  filterCoin, findList, changeInitData } = props
    const chartDiv = React.useRef<HTMLDivElement>(null)
    const chart = React.useRef<any>(null)
    const [color,setColor] = React.useState<string[]>(['#4D67BF','#4DBFBC','#07A872','#D29E08', '#ED8139','#FF453A','#FB6E77','#FF70CF', '#B382F0','#68217A','#5E5CE6','#2E50FF','#4D8FBF','#D4D7D6'])
    const [perArr,setPerArr] = React.useState<number>(0)
    const [initDominance,setInitDominance] = React.useState<any[]>([])
    const [active, setActive] = React.useState<number>()
    
    
    const changeData = (item:any,index:number) => {
      setActive(index)
      changeInitData(item)
    }

    React.useEffect(() => {
      // if(echarts && echarts.getInstanceByDom(chartDiv.current!) == undefined){
      //   chart.current = echarts.init(chartDiv.current!, 'black')
      // }
      let initDominance = [...initDominances]
      let splice
      initDominance?.map((item:any,index:number)=> {
        if(item?.name == "others"){
          splice = initDominance.splice(index,1)
        }
      })
      
      initDominance.sort(objectSort('number'))
      
      initDominance = initDominance.concat(splice)
      let perSun = 0
      initDominance?.map(item => {
        
        perSun += +item?.number
      })
      
      const arrList = initDominance?.map(item => {
        
        const arr = findList.find(i => i?.name == item?.name)
        return {
          ...arr,
          ...item,
          percent: (item?.number / perSun * 100).toFixed(2)
        }
      })
      
      let otherPer = 0
      arrList?.map((item,index) => {
        if(index< arrList.length-1){
          otherPer = otherPer + +item.percent
        }
        
      })
    setPerArr(otherPer)
    let changeDominance = [...dominances]
    let newSplices
    let perArrs:any[] = [];
    changeDominance?.map((item:any,index:number)=> {
      if(item?.name == "others"){
        newSplices = changeDominance.splice(index,1)
      }
    })
    
    changeDominance.sort(objectSort('number'))
    changeDominance = changeDominance.concat(newSplices || [])
    
    const newArrList = changeDominance?.map((item:any) => {
      const arr = findList.find(i => i?.name == item?.name)
      return {
        ...item,
        ...arr,
        
      }
    })
    
    newArrList?.map((item,index)=> {
      let newIndex = index
      let itemCon = item
      let marketCup = 0
      let marketCup1= 0
      
      if(item.fullName != 'BTC' && item.fullName != 'ETH'){
        if(item.coinLists){
          item?.coinLists?.map((i:any) => {

            if(i.price && i.currentSupply && i.change){
              marketCup += i.price * i.currentSupply
              marketCup1 += (i.price - i.change) * i.currentSupply
            }
          })
        }
      }else{
        if(item.coinLists){
          item?.coinLists?.map((i:any) => {
            
            if(i.price && i.currentSupply && i.change && (i.name == 'btc' || i.name == 'eth')){
              marketCup += i.price * i.currentSupply
              marketCup1 += (i.price - i.change) * i.currentSupply
              perArrs[newIndex] = (i.price * i.currentSupply - (i.price - i.change) * i.currentSupply)/((i.price - i.change) * i.currentSupply) * 100
            }
          })
        }
      }
      
      if(marketCup1!=0){
        perArrs[newIndex] = {name:item.name,perce:(marketCup - marketCup1)/marketCup1 *100}
      }
    })
    arrList?.map((item,index) => {
      let itemIndex = index
      
      perArrs?.map(i => {
        if(i.name == item.name){
          arrList[itemIndex] = {...item,perce:i.perce}
        }
      })
    })
    
    setInitDominance(arrList)
    let arrList1 = [...arrList]
    let otherPers = (100 - arrList1[0]?.percent- arrList1[1]?.percent- arrList1[2]?.percent- arrList1[3]?.percent
    - arrList1[4]?.percent- arrList1[5]?.percent- arrList1[6]?.percent- arrList1[7]?.percent
    - arrList1[8]?.percent- arrList1[9]?.percent- arrList1[10]?.percent-arrList1[11]?.percent-arrList1[12]?.percent).toFixed(2)
   
    const option = {
      color: ['#4D67BF','#4DBFBC','#07A872','#D29E08', '#ED8139','#FF453A','#FB6E77','#FF70CF', '#B382F0','#68217A','#5E5CE6','#2E50FF','#4D8FBF','#D4D7D6'],

      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1E1E1E',
        borderColor: '#1E1E1E',
        padding: 4,
        confine: true,
        textStyle: {
          color: '#A5A7AB',
          fontSize: 10
        },
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {

          let Paramsss = `<div>${params[0].axisValue}</div>`;
          params.map((item: any) => {
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value}% <br/>`;
          })
          return Paramsss;
        }
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '0',
        containLabel: false
      },
      xAxis: {
        show: false,
        type: 'value',
        axisLabel:{
          showMaxLabel:false
        },
        axisTick: {
          show: false
        },
        splitLine:{
          show:false
        },
      },
      yAxis: {
        type: 'category',
        data: ['Market Cap Dominance'],
        axisLabel:{
          showMaxLabel:false
        },
        axisTick: {
          show: false
        },
        splitLine:{
          show:true
        },
      },
      series: [
        {
          name: arrList1[0]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[0]?.percent]
        },
        {
          name: arrList1[1]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[1]?.percent]
        },
        {
          name: arrList1[2]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[2]?.percent]
        },
        {
          name: arrList1[3]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[3]?.percent]
        },
        {
          name: arrList1[4]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[4]?.percent]
        },
        {
          name: arrList1[5]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[5]?.percent]
        },
        {
          name: arrList1[6]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[6]?.percent]
        },
        {
          name: arrList1[7]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[7]?.percent]
        },
        {
          name: arrList1[8]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[8]?.percent]
        },
        {
          name: arrList1[9]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[9]?.percent]
        },
        {
          name: arrList1[10]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[10]?.percent]
        },
        {
          name: arrList1[11]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[11]?.percent]
        },
        {
          name: arrList1[12]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [arrList1[12]?.percent]
        },
        {
          name: arrList1[13]?.fullName,
          type: 'bar',
          stack: 'total',
          barGap:'0%',
          barCategoryGap:'0%',
          data: [otherPers]
        }
      ]
    };
    
    // if(chartDiv.current){
    //   chart.current.setOption(option)
    // } 
    }, [dominances])
    
    // const { run: resize } = useDebounceFn(() => {
    //   chart.current.resize()
    // }, {wait: 300})
    // React.useEffect(() => {
    //     window.addEventListener('resize', resize)
    //     return () => {
    //         window.removeEventListener('resize',resize)
    //     }
    // }, [])
    return (
      <div className='relative w-full h-full'>
          {/* <div className='w-full h-[26px] mb-3 flex '>
              <div ref={chartDiv} className="w-full h-[26px]"></div>
              
          </div> */}
          <div className='w-full h-[26px] mb-3 flex '>
           
              {
                initDominance.map((item,index) => {
                  return (<div key={index} className='h-[26px]' style={{'width':`${item.percent+ '%'}`,'background': `${color[index]}`}}>

                  </div>)
                })
              }
              
          </div>
          <div className='grid grid-cols-4 gap-2'>
              {
                initDominance.map((item,index:number) => {           
                  return (
                    <div key={index} className='cursor-pointer shadow-[0_0px_8px_0px_rgba(0,0,0,0.2)]'  onClick={() => changeData(item,index)}>
                      <div className={`p-2 h-[91px] rounded hover:bg-[#000000]/[0.5] hover:border hover:border-solid hover:border-[#404040]/[0.8] ${active == index && currentName ? `bg-[#111] border border-solid border-[#404040] ${item.perce > 0 && 'bg-[#24A148]/[.15] border-[#ADE25D] hover:bg-[#24A148]/[.08] hover:border-[#ADE25D]/[0.5]'} ${item.perce < 0 && 'bg-[#DA1E28]/[.15] border-[#F95200] hover:bg-[#DA1E28]/[.08] hover:border-[#F95200]/[0.5]'}` : `bg-[#1A1A1A]`}  `}>
                        <div className='flex items-center h-[16px] mb-[24px]'>
                          <div className={`w-2 h-2 ml-0.5 mr-1`} style={{'background': `${color[index]}`}} ></div>
                          {
                            item.name != 'others' ? 
                            (<div className='my-0.5 text-xs text-[#C2C2C2]'>{item.number && filterCoin && (item.percent)}%</div>)
                            :
                            (<div className='my-0.5 text-xs text-[#C2C2C2]'>{item.number && filterCoin && (100-perArr).toFixed(2)}%</div>)
                          }
                        </div>
                        
                        <div className='mb-1 text-xs text-[#C2C2C2] h-[16px] break-words'>{item?.fullName ? item?.fullName : item?.name}</div>
                          
                        
                          { 
                            item.perce > 0 && <div className='text-xs text-[#65C466] font-medium'>+{item.perce.toFixed(2)}%</div>
                          }
                          {
                            item.perce == 0 && <div className='text-xs text-[#C2C2C2]'>{0}%</div>
                          }
                          {
                            item.perce < 0 && <div className='text-xs text-[#EB4E3D] font-medium'>{item.perce.toFixed(2)}%</div>
                          }
                      </div>
                    </div>
                  )
                })
              }
              
          </div> 
      </div>
    )
}

export default Dominance