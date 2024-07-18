import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import Chart from "components/base/Charts";
import { transferMoney } from 'helper/tools'
type Props = {
    status:boolean,
    classes?: string;
} 
const MarketCapitalization = ({status, classes} : Props) => {
    const chartDivRef = React.useRef<HTMLDivElement>(null)
    const chart = React.useRef<any>(null)
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const chartOption:EChartsOption = {
        params: [{
          chartName: 'Stablecoin_Total_Market_Cap_Mcap',
          name:'Market Cap',
          color:'#E5E5E5',
          height: '8px',
          series:{
            type: 'line',
            areaStyle: {
                color:'#E5E5E5',
                opacity:0.15
            },
          }
        },
        {
          chartName: 'Stablecoin_Total_Market_Cap_usdt',
          name:'USDT',
          color:'#4D67BF',
          height: '8px',
          series:{
            type: 'line',
            areaStyle: {
                color:'#4D67BF',
                opacity:0.15
            },
          }
        },
        {
            chartName: 'Stablecoin_Total_Market_Cap_usdc',
            name:'USDC',
            height: '8px',
            color:'#4D8FBF',
            series:{
              type: 'line',
              areaStyle: {
                color:'#4D8FBF',
                opacity:0.15
              },
            }
        },
        {
            chartName: 'Stablecoin_Total_Market_Cap_busd',
            name:'BUSD',
            height: '8px',
            color:'#4DBFBC',
            series:{
              type: 'line',
              areaStyle: {
                color:'#4DBFBC',
                opacity:0.15
              },
            }
        }
    ],
        grid:{
            left: "45px",
            top: "20px",
            bottom: "70px",
            right: "35px"
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: true,
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
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#333333'
                }
            }
        },
        showDataZoom: true,
        transferMoney:true
    }
    
    useAsyncEffect(async () => {
        if(status){
        const { data } = await getDataChart('1666032986125463565')
        let init = {
            title:data.name,
            whatisDescription: data.whatisDescription,
            whatisFormula: data.whatisFormula,
            whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)
        setIntroduce(init)
        const rows = JSON.parse(data.responseData) as { symbol: string; Mcap: number; TVL: number; busd: number; usdc: number; usdt: number; ustc: number; timestamp: string; }[]
        const dateXAxis: string[] = []
        const mcapData: number[] = []
        const tvlData: number[] = []
        const busdData: number[] = []
        const usdcData: number[] = []
        const usdtData: number[] = []
        const ustcData: number[] = []
        let coin = ''
        const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
        rows.forEach(({ symbol, Mcap, TVL, busd, usdc, usdt, ustc, timestamp }) => {
            coin = symbol
            dateXAxis.push(dayjs(timestamp).format('YY/MM'))
            mcapData.push(Mcap)
            tvlData.push(TVL)
            busdData.push(busd)
            usdcData.push(usdc)
            usdtData.push(usdt)
            ustcData.push(ustc)
        })
        
        const legend = [
            {
                height: '8px',
                name: 'Market Cap',
                color:'#E5E5E5',
                val: transferMoney(mcapData[mcapData.length -1]) || '',
                time: LastTime,
            },
            // {
            //     height: '8px',
            //     name: 'TVL',
            //     color:'#63E6E2',
            //     val: transferMoney(tvlData[tvlData.length -1]) || '',
            // },
            {
                height: '8px',
                name: 'USDT',
                color:'#4D67BF',
                val:  transferMoney(usdtData[usdtData.length -1]) || '',
                time: LastTime,
            },
            {
                height: '8px',
                name: 'USDC',
                color:'#4D8FBF',
                val: transferMoney(usdcData[usdcData.length -1]) || '',
                time: LastTime,
            },
            {
                height: '8px',
                name: 'BUSD',
                color:'#4DBFBC',
                val: transferMoney(busdData[busdData.length -1]) || '',
                time: LastTime,
            },
            // {
            //     height: '8px',
            //     name: 'USTC',
            //     color:'#4DBF60',
            //     val: transferMoney(ustcData[ustcData.length -1]) || '',
            // },
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
                  fontSize: 10
                },
                axisPointer: {
                  type: 'line'
                },
                formatter: function (params: any) {
        
                  let Paramsss = `<div>${params[0].axisValue}</div>`;
                  params.map((item: any) => {
                    Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${transferMoney(item.value)} <br/>`;
                  })
                  return Paramsss;
                }
            },
            grid:{
                left: "45px",
                top: "20px",
                bottom: "70px",
                right: "35px"
            },
            xAxis: {
                type: 'category',
                data: dateXAxis,
                axisLine:{
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
                    show: false
                },
            },
            yAxis: {
                type: 'value',
                //min:1,
                
                axisLabel: {
                    show: true,
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
                //logBase: 1000,
                splitLine: {
                    show: false,
                    lineStyle: {
                        
                        color: '#333333'
                    }
                }
            },
            
            series: [
                {
                    data: mcapData,
                    name: 'Market Cap',
                    type: 'line',
                    smooth:true,
                    areaStyle: {
                        color:'#E5E5E5',
                        opacity:0.15
                    },
                    lineStyle:{
                        width:1
                    },
                    showSymbol: false,
                },
                // {
                //     data: mcapData,
                //     name: 'TVL',
                //     type: 'line',
                //     showSymbol: false,
                //     z:101
                // },
                {
                    data: usdtData,
                    name: 'USDT',
                    type: 'line',
                    areaStyle: {
                        color:'#4D67BF',
                        opacity:0.15
                    },
                    lineStyle:{
                        width:1
                    },
                    showSymbol: false,
                    smooth:true,
                },
                {
                    data: usdcData,
                    name: 'USDC',
                    type: 'line',
                    areaStyle: {
                        color:'#4D8FBF',
                        opacity:0.15
                    },
                    lineStyle:{
                        width:1
                    },
                    showSymbol: false,
                    smooth:true,
                },
                {
                    data: busdData,
                    name: 'BUSD',
                    type: 'line',
                    areaStyle: {
                        color:'#4DBFBC',
                        opacity:0.15
                    },
                    lineStyle:{
                        width:1
                    },
                    showSymbol: false,
                    smooth:true,
                    
                },
                // {
                //     data: ustcData,
                //     name: 'USTC',
                //     type: 'line',
                //     areaStyle: {
                //         color:'#FB6E77',
                //         opacity:0.15
                //     },
                //     lineStyle:{
                //         width:1
                //     },
                //     showSymbol: false,
                //     smooth:true,
                // },
                
            ],
            dataZoom: [
                {
                    type: 'inside',
                    zoomLock: true,
                    start: 75,
                    end: 100
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
    }
    }, [status])
    
    return (
        <div className='w-full h-block bg-block-color rounded-lg'>
            <Chart option={options} classes={classes || 'w-full h-[390px]'} introduce={introduce} legend={legend} chartOption={chartOption}/>
        </div>
    )
}

export default MarketCapitalization