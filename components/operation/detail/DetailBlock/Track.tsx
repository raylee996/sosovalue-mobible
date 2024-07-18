import React from 'react'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import Chart from "components/base/Chart";
import Volume from 'components/operation/markets/Data/NFT/Volume'

const Track = ({ originalCurrencyDetail }: { originalCurrencyDetail?: API.OriginalCurrencyDetail }) => {
    // const chartDivRef = React.useRef<HTMLDivElement>(null)
    // const chart = React.useRef<any>(null)
    // const [initText, setInitText] = React.useState<{ whatisDescription: string, whatisFormula: string, whatisMeaning: string }>()
    // const [title, seTitle] = React.useState<string>('')
    // const [legend, setLegend] = React.useState<API.legend[]>()
    // const [options, setOptions] = React.useState<EChartsOption>({})
    // const [introduce, setIntroduce] = React.useState<API.initText>()
    // useAsyncEffect(async () => {
    //     if (originalCurrencyDetail) {
    //         const { data } = await getDataChart(originalCurrencyDetail.charId)
    //         let init = {
    //             title: data.name,
    //             whatisDescription: data.whatisDescription,
    //             whatisFormula: data.whatisFormula,
    //             whatisMeaning: data.whatisMeaning
    //         }
    //         setInitText(init)
    //         seTitle(data.name)

    //         setIntroduce(init)
    //         const rows = JSON.parse(data.responseData) as { quote: Array<any>; timestamp: string; }[]
    //         console.log(rows)
    //         return
    //         const dateXAxis: string[] = []
    //         const btcData: number[] = []
    //         const ethData: number[] = []
    //         const usdData: number[] = []
    //         const bnbData: number[] = []
    //         const barData: number[] = []
    //         rows.forEach(({ quote, timestamp }) => {

    //             dateXAxis.push(dayjs(timestamp).format('YY/MM'))
    //             quote.map(item => {
    //                 if (item.name == 'Bitcoin') {
    //                     btcData.push(parseFloat(item.marketPercent))
    //                 }
    //                 if (item.name == "Ethereum") {
    //                     ethData.push(parseFloat(item.marketPercent))
    //                 }
    //                 if (item.name == "USD Coin") {
    //                     usdData.push(parseFloat(item.marketPercent))
    //                 }
    //                 if (item.name == 'BNB') {
    //                     bnbData.push(parseFloat(item.marketPercent))
    //                 }
    //             })
    //         })
    //         const legend = [
    //             {
    //                 height: '8px',
    //                 name: 'BTC',
    //                 color: '#2174FF',
    //                 val: btcData[btcData.length - 1] + '%'
    //             },
    //             {
    //                 height: '8px',
    //                 name: 'ETH',
    //                 color: '#3CB1FB',
    //                 val: ethData[ethData.length - 1] + '%'
    //             },
    //             {
    //                 height: '8px',
    //                 name: 'USDT',
    //                 color: '#07A872',
    //                 val: usdData[usdData.length - 1] + '%'
    //             },
    //             {
    //                 height: '8px',
    //                 name: 'BNB',
    //                 color: '#D29E08',
    //                 val: bnbData[bnbData.length - 1] + '%'
    //             }
    //         ]

    //         setLegend(legend)
    //         const option: EChartsOption = {
    //             color: ['#2174FF', '#3CB1FB', '#07A872', '#D29E08'],
    //             tooltip: {
    //                 trigger: 'axis',
    //                 backgroundColor: '#1E1E1E',
    //                 borderColor: '#1E1E1E',
    //                 padding: 4,
    //                 textStyle: {
    //                     color: '#A5A7AB',
    //                     fontSize: 10
    //                 },
    //                 axisPointer: {
    //                     type: 'line'
    //                 },
    //                 formatter: function (params: any) {

    //                     let Paramsss = `<div>${params[0].axisValue}</div>`;
    //                     params.map((item: any) => {
    //                         Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} %<br/>`;
    //                     })
    //                     return Paramsss;
    //                 }
    //             },
    //             legend: {
    //                 icon: 'rect',
    //                 itemWidth: 8,
    //                 itemHeight: 8,
    //                 textStyle: {
    //                     color: '#BBBBBB'
    //                 },
    //                 data: ['BTC', 'ETH', 'USDT', 'BNB']
    //             },
    //             grid: {
    //                 left: "45px",
    //                 top: "20px",
    //                 bottom: "70px",
    //                 right: "28px"
    //             },
    //             xAxis: {
    //                 type: 'category',
    //                 data: dateXAxis,
    //                 axisLabel: {
    //                     showMaxLabel: true,
    //                 },
    //                 axisTick: {
    //                     show: false
    //                 },

    //                 axisLine: {
    //                     show: false, // 不显示坐标轴线
    //                 },

    //             },
    //             yAxis: {
    //                 type: 'value',
    //                 axisLabel: {
    //                     show: true,
    //                     formatter: '{value}%'
    //                 },
    //                 splitLine: {
    //                     show: false,
    //                     lineStyle: {
    //                         color: '#333333'
    //                     }
    //                 }
    //             },
    //             series: [
    //                 {
    //                     data: btcData,
    //                     type: 'line',
    //                     showSymbol: false,
    //                     smooth: true,
    //                     name: 'BTC',
    //                     areaStyle: {
    //                         color: '#2174FF',
    //                         opacity: 0.15
    //                     }
    //                 },
    //                 {
    //                     data: ethData,
    //                     type: 'line',
    //                     showSymbol: false,
    //                     smooth: true,
    //                     name: 'ETH',
    //                     areaStyle: {
    //                         color: '#3CB1FB',
    //                         opacity: 0.15
    //                     }
    //                 },
    //                 {
    //                     data: usdData,
    //                     type: 'line',
    //                     showSymbol: false,
    //                     smooth: true,
    //                     name: 'USDT',
    //                     areaStyle: {
    //                         color: '#07A872',
    //                         opacity: 0.15
    //                     }
    //                 },
    //                 {
    //                     data: bnbData,
    //                     type: 'line',
    //                     showSymbol: false,
    //                     smooth: true,
    //                     name: 'BNB',
    //                     z: 101,
    //                     areaStyle: {
    //                         color: '#D29E08',
    //                         opacity: 0.15
    //                     }
    //                 },
    //             ],
    //             dataZoom: [
    //                 {
    //                     type: 'inside',
    //                     zoomLock: true,
    //                     start: 80,
    //                     end: 100
    //                 },
    //                 {
    //                     type: 'slider',
    //                     height: 24,
    //                     backgroundColor: 'rgba(174, 174, 174, 0.10)',
    //                     dataBackground: {
    //                         lineStyle: {
    //                             color: "#404040"
    //                         },
    //                         areaStyle: {
    //                             color: "#292929"
    //                         },
    //                     },
    //                     selectedDataBackground: {
    //                         lineStyle: {
    //                             color: "#2174FF"
    //                         },
    //                         areaStyle: {
    //                             color: "#2174FF"
    //                         },
    //                     },
    //                     fillerColor: 'rgba(33, 116, 255, .15)',
    //                     borderColor: 'transparent',
    //                     handleSize: '100%',
    //                     handleStyle: {
    //                         color: 'rgba(41, 41, 41, 1)',
    //                         borderColor: 'rgba(64, 64, 64, 1)',
    //                         borderWidth: 2,
    //                         borderJoin: 'miter',
    //                         borderMiterLimit: 10
    //                     },
    //                     moveHandleSize: 0,
    //                     showDetail: false,
    //                 }
    //             ],
    //         }
    //         setOptions(option)
    //     }
    // }, [originalCurrencyDetail])
    return (
        <div className='w-full h-full'>
            <div className='h-[436px] text-[#fff] bg-[#171717] rounded-lg'>
                <Volume/>
                {/* <Chart option={options} classes='w-full h-[380px]' introduce={introduce} /> */}
            </div>
        </div>

    )
}

export default Track