import React, { useEffect } from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import { transferMoney, formatDecimal } from 'helper/tools'
import Introduce from 'components/operation/Introduce'
const TotalLocked = () => {
    const chartDivRef = React.useRef<HTMLDivElement>(null)
    const chart = React.useRef<any>(null)
    const [lockedList,setLockedList] = React.useState<any>([]) 
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    useAsyncEffect(async () => {
      if(echarts && echarts.getInstanceByDom(chartDivRef.current!) == undefined){
        chart.current = echarts.init(chartDivRef.current!, 'black')
      }
        const { data } = await getDataChart('1666032986125463572')
        let init = {
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)
        const rows = JSON.parse(data.responseData).tvl as { tvl: number; timestamp: number; }[]
        const lock = []
        lock.push(rows[rows.length-1].tvl)
        lock.push(JSON.parse(data.responseData).volume)
        lock.push(JSON.parse(data.responseData).lido)
        setLockedList(lock)
        const dateXAxis: string[] = []
        const vData: number[] = []
        rows.forEach(({ tvl, timestamp }) => {
            dateXAxis.push(dayjs(timestamp).format('YYYY-MM'))
            vData.push(tvl)
        })
        
        //const chart = echarts.init(chartDivRef.current!, 'black')
        const option: EChartsOption = {
            color:['#519ABA'],
            tooltip: {
              trigger: 'axis',
              backgroundColor: '#1E1E1E',
              borderColor: '#1E1E1E',
              padding: 4,
              textStyle: {
                color: '#A5A7AB',
                fontSize: 10
              },
              axisPointer: {
                type: 'line'
              },
              formatter: function (params: any) {
      
                let Paramsss = `<div>${params[0].axisValue}</div>`;
                params.map((item: any) => {
                  Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${transferMoney(item.value)} USD<br/>`;
                })
                return Paramsss;
              }
          },
            
            xAxis: {
                type: 'category',
                data: dateXAxis,
                nameTextStyle:{
                  color:'#A0A0A0',
                  fontWeight:400,
                  fontSize: 10
                },
                
                axisLine:{
                  
                },
                axisLabel:{
                  showMaxLabel:true
                },
                splitLine:{
                  show:false
                },
                axisTick: {
                  show: false
                },
              },
              yAxis: [
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:false
                  },
                  splitLine:{
                    lineStyle:{
                        color: '#3C3C3C'
                    }
                  }
                },
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:false
                  },
                  splitLine:{
                    lineStyle:{
                        color: '#3C3C3C'
                    }
                  }
                }
              ],
              grid:{
                  left: "25px",
                  top: "30px",
                  bottom: "80px",
                  right: "25px"
              },
              series: [
                  {
                      name: 'Total Value Locked',
                      type: 'line',
                      yAxisIndex: 1,
                      data: vData
                  }],
                  dataZoom: [
                      {
                          type: 'inside',
                          zoomLock: true,
                      },
                      {
                          type: 'slider'
                      }
                  ]
        }
        if(chartDivRef.current){
          chart.current.setOption(option)
        }
    }, [])
    
    return (
        <div>
            <div className='text-[#E5E5E5] w-[500px] flex items-center'>
              <span className='px-[20px] py-[12px]'>{title}</span>
            </div>
            <div className='flex px-[20px] w-[496px] justify-between text-[#E5E5E5]'>
              <div>
                <div className='text-[#676564] text-xs'>Total Value Locked</div>
                <div className='text-[#FFFFFF] text-sm font-bold'>${transferMoney(lockedList[0])}</div>
              </div>
              <div>
                <div className='text-[#676564] text-xs'>Volume (24h)</div>
                <div className='text-[#FFFFFF] text-sm font-bold'>{lockedList[1]?.toUpperCase()}</div>
              </div>
              <div>
                <div className='text-[#676564] text-xs'>Lido Dominance</div>
                <div className='text-[#FFFFFF] text-sm font-bold'>{lockedList[2]}%</div>
              </div>
            </div>
            <div ref={chartDivRef} className='w-full h-[350px]'>
               
            </div>
        </div>
    )
}

export default TotalLocked