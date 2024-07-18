import React, { useEffect } from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import { transferMoney, formatDecimal } from 'helper/tools'
import Introduce from 'components/operation/Introduce'

const ChainsLocked = () => {
    const chartDivRef = React.useRef<HTMLDivElement>(null)
    const chart = React.useRef<any>(null)
    const chartDivRef1 = React.useRef<HTMLDivElement>(null)
    const chart1 = React.useRef<any>(null)
    const [lockedList,setLockedList] = React.useState<any>([]) 
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    useAsyncEffect(async () => {
      if(echarts && echarts.getInstanceByDom(chartDivRef.current!) == undefined){
        chart.current = echarts.init(chartDivRef.current!, 'black')
      }
      if(echarts && echarts.getInstanceByDom(chartDivRef1.current!) == undefined){
        chart1.current = echarts.init(chartDivRef1.current!, 'black')
      }
        const { data } = await getDataChart('1666032986125463573')
        let init = {
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
       setInitText(init)
       seTitle(data.name)
        const rows = JSON.parse(data.responseData) as { lockedHash: any; timestamp: number; }[]
        
        const dateXAxis: string[] = []
        const Ethereum: number[] = []
        const Tron: number[] = []
        const BSC: number[] = []
        const Arbitrum: number[] = []
        const Polygon: number[] = []
        const Optimism: number[] = []
        const Avalanche: number[] = []
        const Mixin: number[] = []
        const Cronos: number[] = []
        const Pulse: number[] = []
        const other: any = []
        let totalData:any
        let otherData:any
        let EthereumData:number
        let TronData:number
        let BSCData:number
        let ArbitrumData:number
        let PolygonData:number
        let OptimismData:number
        let AvalancheData:number
        let MixinData:number
        let CronosData:number
        let PulseData:number
        let lastData:any = []
        rows.forEach(({ lockedHash, timestamp },index) => {
            dateXAxis.push(dayjs(timestamp).format('YYYY-MM'))
            totalData = Object.values(lockedHash).reduce((a:any,b:any)=> a+b)
            
            //total.push(totalData)
            EthereumData = lockedHash.Ethereum ?  lockedHash.Ethereum / totalData : 0
            Ethereum.push(EthereumData)
            TronData = lockedHash.Tron ?  lockedHash.Tron / totalData : 0
            Tron.push(TronData)
            BSCData = lockedHash.BSC ?  lockedHash.BSC / totalData : 0
            BSC.push(BSCData)
            ArbitrumData = lockedHash.Arbitrum ?  lockedHash.Arbitrum / totalData : 0
            Arbitrum.push(ArbitrumData)
            PolygonData = lockedHash.Polygon ?  lockedHash.Polygon / totalData : 0
            Polygon.push(PolygonData)
            OptimismData = lockedHash.Optimism ?  lockedHash.Optimism / totalData : 0
            Optimism.push(OptimismData)
            AvalancheData = lockedHash.Avalanche ?  lockedHash.Avalanche / totalData : 0
            Avalanche.push(AvalancheData)
            MixinData = lockedHash.Mixin ?  lockedHash.Mixin / totalData :0
            Mixin.push(MixinData)
            CronosData = lockedHash.Cronos ?  lockedHash.Cronos / totalData : 0
            Cronos.push(CronosData)
            PulseData = lockedHash.Pulse ?  lockedHash.Pulse / totalData : 0
            Pulse.push(PulseData)
            otherData = 1 - EthereumData - TronData - BSCData - ArbitrumData - PolygonData - OptimismData - AvalancheData - MixinData - CronosData - PulseData
            other.push(otherData)
            if(index == rows.length-1){
              lastData = [
                {value: EthereumData, name: 'Ethereum'},
                {value: TronData, name: 'Tron'},
                {value: BSCData, name: 'BSC'},
                {value: ArbitrumData, name: 'Arbitrum'},
                {value: PolygonData, name: 'Polygon'},
                {value: OptimismData, name: 'Optimism'},
                {value: AvalancheData, name: 'Avalanche'},
                {value: MixinData, name: 'Mixin'},
                {value: CronosData, name: 'Cronos'},
                {value: PulseData, name: 'Pulse'},
                {value: otherData, name: 'Other'},
              ]
              setLockedList(lastData)
            }
        })
        
        //const chart = echarts.init(chartDivRef.current!, 'black')
        const option: EChartsOption = {
            color:['#519ABA','#8DC149','#CBCB41','#E37933','#CC3E44','#7494A3'],
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
                  Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value.toFixed(2)} <br/>`;
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
                axisTick: {
                  show: false
                },
                axisLine:{
                  
                },
                axisLabel:{
                  showMaxLabel:true
                },
                splitLine:{
                  show:false
                }
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
                  },
                  max:1
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
                  top: "20px",
                  bottom: "80px",
                  right: "25px"
              },
              series: [
                {
                  name: 'Ethereum',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  data: Ethereum
                },
                {
                  name: 'Tron',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
  
                  data: Tron
                },
                {
                  name: 'BSC',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  data: BSC
                },
                {
                  name: 'Arbitrum',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  data: Arbitrum
                },
                {
                  name: 'Polygon',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: Polygon
                },
                {
                  name: 'Optimism',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  data: Optimism
                },
                {
                  name: 'Avalanche',
                  type: 'line',
                  stack: 'Total',
                  data: Avalanche
                },
                {
                  name: 'Mixin',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: Mixin
                },
                {
                  name: 'Cronos',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  data: Cronos
                },
                {
                  name: 'Pulse',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: Pulse
                },
                {
                  name: 'Other',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: other
                }
              ],
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
        
        //const chart1 = echarts.init(chartDivRef1.current!, 'black')
        const option1: EChartsOption = {
            color:['#519ABA','#8DC149','#CBCB41','#E37933','#CC3E44','#7494A3'],
            //鼠标移动到饼图某一块时突出显示
         
            tooltip: {
              trigger: 'item',
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
              formatter: `{b}:{d}%`,
            },
            
              grid:{
                  left: "10px",
                  top: "10px",
                  bottom: "10px",
                  right: "10px"
              },
              series: [
                {
                  name: '',
                  type: 'pie',
                  radius: "90%",
                  center: ["50%", "50%"],
                  label: {
                    show : true,
                    position: "inside",
                    color: "#fff",
                    fontSize: 12,
                  },
                  labelLine: {
                    show: true,
                  },
                  data: lastData,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                },
                {
                  name: '',
                  type: 'pie',
                  radius: '90%',
                  center: ["50%", "50%"],
                  label: {
                    show: false,
                    position: "inside",
                    //formatter: `{d}%`,
                    color: "#fff",
                    fontSize: 14,
                  },
                  data: lastData,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
        }
        if(chartDivRef1.current){
          chart1.current.setOption(option1)
        }
    }, [])
    
    return (
        <div>
            <div className='text-[#E5E5E5] flex items-center'>
              <span className='py-[10px] px-[12px]'>{title}</span>
            </div>
            <div className='flex w-full'>
              <div ref={chartDivRef1} className='w-[248px] h-[350px]'>
               
               </div>
              <div ref={chartDivRef} className='w-[248px] h-[350px]'>
               
              </div>
            </div>
        </div>
    )
}

export default ChainsLocked