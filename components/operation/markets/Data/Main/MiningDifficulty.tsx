import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import Introduce from 'components/operation/Introduce'
import { transferMoney } from 'helper/tools'
import Chart from "components/base/Charts";
type Props = {
    status:boolean,
    classes?: string;
} 
const MarketCap = ({status, classes} : Props) => {
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const chartOption:EChartsOption = {
        params: [{
          chartName: 'BTC_Mining_difficulty',
          name:'BTC Mining difficulty',
          color:'#E5E5E5',
          series:{
            type: 'line',
          }
        },
    ],
        grid:{
            left: "45px",
            top: "20px",
            bottom: "70px",
            right: "35px"
        },
        yAxis: [
            {
              type: 'log',
              name: '',
              axisLabel: {
                show:true,
                fontSize : 12,
                fontFamily:'JetBrains Mono',
                formatter: function (value:number, index:number) {
                    if(value >= 1000000000000){
                        return value / 1000000000000 + 'T'
                    }else if(value >= 1000000000){
                        return value / 1000000000 + 'B'
                    }else if(value >= 1000000){
                        return value / 1000000 + 'M'
                    }else if(value >= 1000){
                        return value / 1000 + 'K'
                    }else{
                        return '0';
                    }   
                }
              },
              min:1,
              logBase: 1000,
              splitLine: {
                lineStyle: {
                    color: '#343434'
                }
            }
        },
        ],
        showDataZoom: true,
        transferMoney:true
    }
    const getInitData = async () => {
        let init = {
            title:'BTC Mining difficulty',
            whatisDescription: '',
            whatisFormula: '',
            whatisMeaning: 'BTC mining difficulty is a measure of how difficult it is to mine a new block on the Bitcoin network. It is adjusted every 2016 blocks (approximately every two weeks) to ensure that blocks are found at a consistent rate of one every 10 minutes. The difficulty is determined by the total computational power of the network, with higher difficulty levels requiring more computational power to mine new blocks.',
        }
        
        setIntroduce(init)
        /*
        const { data } = await getDataChart('1666032986125463563')
        let init = {
            title:data.name,
            whatisDescription: data.whatisDescription,
            whatisFormula: data.whatisFormula,
            whatisMeaning: data.whatisMeaning
        }
        seTitle(data.name)
        setInitText(init)
        
        setIntroduce(init)
        const rows = JSON.parse(data.responseData) as { symbol: string; totalMarketCap: number; totalVolume24H: number; timestamp: string; }[]
        const dateXAxis: string[] = []
        const lineData: number[] = []
        const barData: number[] = []
        rows.forEach(({ symbol, totalMarketCap, totalVolume24H, timestamp }) => {
            dateXAxis.push(dayjs(timestamp).format('YY/MM'))
            lineData.push(totalMarketCap)
            barData.push(totalVolume24H)
        })
        
        const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
        //const chart = echarts.init(chartDivRef.current!, 'black')
        const legend = [
            {
                height: '2px',
                name: 'Market Cap',
                color:'#E5E5E5',
                val: transferMoney(lineData[lineData.length -1]) || '',
                time: LastTime,
            },
            {
                height: '8px',
                name: '24h Vol',
                color:'#4D67BF',
                val: transferMoney(barData[barData.length -1]) || '',
                time: LastTime,
            }
        ]
       
        setLegend(legend)

        const option: EChartsOption = {    
            color:['#E5E5E5','#4D67BF','#4D8FBF','#4DBFBC','#4DBF60','#BFB64D','#BF8F4D','#BF694D','#BF4D61','#BF4DBB','#7C4DBF'],
            
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#1E1E1E',
                borderColor: '#1E1E1E',
                padding: 4,
                textStyle: {
                  color: '#A5A7AB',
                  fontSize: 10,
                  fontFamily:'JetBrains Mono'
                },
               
                formatter: function (params: any) {
        
                  let Paramsss = `<div>${params[0].axisValue}</div>`;
                  params.map((item: any) => {
                    Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${transferMoney(item.value)} <br/>`;
                  })
                  return Paramsss;
                }
            },
            title: {
                text: '',
                textStyle: { 
                    color: '#E5E5E5',
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: 42,
                    fontFamily:'JetBrains Mono'
                }
            },
            grid:{
                left: "55px",
                top: "20px",
                bottom: "70px",
                right: "25px"
            },
            xAxis: {
                type: 'category',
                data: dateXAxis,
                axisLine:{
                    show: true, // 是否显示坐标轴线
                    lineStyle: {
                        color: '#343434', // 坐标轴线的颜色
                        width: 1, // 坐标轴线的宽度
                        type: 'solid' // 坐标轴线的类型（实线、虚线等）
                    }
                },
                axisLabel:{
                    showMaxLabel:true,
                    color:'#8F8F8F'
                },
                axisTick: {
                    show: false,
                    
                },
            },
            yAxis: [
                {
                  type: 'log',
                  name: '',
                  
                  axisLabel: {
                    show:true,
                    fontSize : 12,
                    fontFamily:'JetBrains Mono',
                    formatter: function (value:number, index:number) {
                        if(value >= 1000000000000){
                            return value / 1000000000000 + 'T'
                        }else if(value >= 1000000000){
                            return value / 1000000000 + 'B'
                        }else if(value >= 1000000){
                            return value / 1000000 + 'M'
                        }else if(value >= 1000){
                            return value / 1000 + 'K'
                        }else{
                            return '0';
                        }   
                    }
                  },
                  min:1,
                  logBase: 1000,
                  splitLine: {
                    lineStyle: {
                        color: '#343434'
                    }
                }
            },
            ],
            series: [
                {
                    name: 'Market Cap',
                    data: lineData,
                    type: 'line',
                    lineStyle:{
                        width:1
                    },
                    showSymbol: false,
                    smooth:true
                },
                {
                    name: '24h Vol',
                    type: 'bar',
                    data: barData,
                    large: true
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    zoomLock: true,
                    start:76,
                    end:100
                },
                {
                    type: 'slider',
                    height:24,
                    backgroundColor:'rgba(174, 174, 174, 0.10)',
                    dataBackground :{
                        lineStyle:{
                            color:"#404040"
                        },
                        areaStyle:{
                            color:"#292929"
                        },
                    },
                    selectedDataBackground:{
                        lineStyle:{
                            color:"#2174FF"
                        },
                        areaStyle:{
                            color:"#2174FF"
                        },
                    },
                    fillerColor :'rgba(33, 116, 255, .15)',
                    borderColor:'transparent',
                    handleSize: '100%',
                    handleStyle:{
                        color: 'rgba(41, 41, 41, 1)',
                        borderColor :'rgba(64, 64, 64, 1)',
                        borderWidth:2,
                        borderJoin: 'miter',
                        borderMiterLimit :10
                    },
                    moveHandleSize:0,
                    showDetail:false,
                }
            ],
        }
        setOptions(option)
        */
    }
    React.useEffect(() => {
        if(status){
            getInitData()
        }
    }, [status])
    
    return (
        <div className='w-full h-full bg-block-color rounded-lg'>
            {/* <div className='text-[#E5E5E5] flex items-center'>
                <span className='p-3'>{title}</span>
            </div> */}
            <Chart option={options} classes={classes || 'w-full h-[390px]'} introduce={introduce} legend={legend} chartOption={chartOption}/>
            {/* <div ref={chartDivRef} className='w-full h-[350px]'></div> */}
        </div>
    )
}

export default MarketCap