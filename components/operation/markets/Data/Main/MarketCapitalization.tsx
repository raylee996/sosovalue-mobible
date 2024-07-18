import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import Chart from "components/base/Chart";
type Props = {
    status:boolean,
} 
const MarketCapitalization = ({status} : Props) => {
    const chartDivRef = React.useRef<HTMLDivElement>(null)
    const chart = React.useRef<any>(null)
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    useAsyncEffect(async () => {
        if(status){
        const { data } = await getDataChart('1666032986125463564')
        let init = {
            title:data.name,
            whatisDescription: data.whatisDescription,
            whatisFormula: data.whatisFormula,
            whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)

        setIntroduce(init)
        const rows = JSON.parse(data.responseData) as { quote: Array<any>;  timestamp: string; }[]
        const dateXAxis: string[] = []
        const btcData: number[] = []
        const ethData: number[] = []
        const usdData: number[] = []
        const bnbData: number[] = []
        const barData: number[] = []
        rows.forEach(({ quote, timestamp }) => {
            
            dateXAxis.push(dayjs(timestamp).format('YY/MM'))
            quote.map(item => {
                if(item.name == 'Bitcoin'){
                    btcData.push(parseFloat(item.marketPercent))
                }
                if(item.name == "Ethereum"){
                    ethData.push(parseFloat(item.marketPercent))
                }
                if(item.name == "Tether USDt"){
                    usdData.push(parseFloat(item.marketPercent))
                }
                if(item.name == 'BNB'){
                    bnbData.push(parseFloat(item.marketPercent))
                }
            })
        })
        const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
        const legend = [
            {
                height: '8px',
                name: 'BTC',
                color:'#E5E5E5',
                val: btcData[btcData.length -1] + '%',
                time: LastTime,
            },
            {
                height: '8px',
                name: 'ETH',
                color:'#4D67BF',
                val: ethData[ethData.length -1] + '%',
                time: LastTime,
            },
            {
                height: '8px',
                name: 'USDT',
                color:'#4D8FBF',
                val: usdData[usdData.length -1] + '%',
                time: LastTime,
            },
            {
                height: '8px',
                name: 'BNB',
                color:'#4DBFBC',
                val: bnbData[bnbData.length -1] + '%',
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
                  fontSize: 10
                },
                axisPointer: {
                  type: 'line'
                },
                formatter: function (params: any) {
        
                  let Paramsss = `<div>${params[0].axisValue}</div>`;
                  params.map((item: any) => {
                    Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} %<br/>`;
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
                axisLabel:{
                    showMaxLabel:true,
                    color:'#8F8F8F'
                },
                axisLine:{
                    lineStyle: {
                      color: '#343434', // 坐标轴线的颜色
                      width: 1, // 坐标轴线的宽度
                      type: 'solid' // 坐标轴线的类型（实线、虚线等）
                    }
                },
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: true,
                    formatter: '{value}%'
                },
                splitLine: {
                    show:false,
                    lineStyle: {
                        color: '#333333'
                    }
                }
            },
            series: [
                {
                    data: btcData,
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    lineStyle:{
                        width:1
                    },
                    name:'BTC',
                    areaStyle: {
                        color:'#E5E5E5',
                        opacity:0.15
                    }
                },
                {
                    data: ethData,
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    name:'ETH',
                    lineStyle:{
                        width:1
                    },
                    areaStyle: {
                        color:'#4D67BF',
                        opacity:0.15
                    }
                },
                {
                    data: usdData,
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    name:'USDT',
                    lineStyle:{
                        width:1
                    },
                    areaStyle: {
                        color:'#4D8FBF',
                        opacity:0.15
                    }
                },
                {
                    data: bnbData,
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    name: 'BNB',
                    lineStyle:{
                        width:1
                    },
                    z:101,
                    areaStyle: {
                        color:'#4DBFBC',
                        opacity:0.15
                    }
                },
            ],
            dataZoom: [
                {
                    type: 'inside',
                    zoomLock: true,
                    start: 80,
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
            <Chart option={options} classes='w-full h-[390px]' introduce={introduce} legend={legend}/>
        </div> 
    )
}

export default MarketCapitalization