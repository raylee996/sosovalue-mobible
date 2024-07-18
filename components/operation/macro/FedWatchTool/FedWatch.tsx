import React from 'react'
import { getDataChart } from 'http/home'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Chart";
import Probability from './Probability'
type ResponseData = { xName: string[]; yInfo: Record<string, string[]>; tableHeader:string; }
const FedWatch = () => {
    const [initText, setInitText] = React.useState<{ whatisDescription: string, whatisFormula: string, whatisMeaning: string }>()
    const [title, seTitle] = React.useState<string>('')
    const [options, setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [tableConfig, setTableConfig] = React.useState<{ headers: string[]; tableData: string[][] }>({ headers: [], tableData: [] })
    const setTableData = (data: ResponseData) => {
        const headers = data.xName
        const tableData = Object.keys(data.yInfo).map(key => [key, ...data.yInfo[key]])
        setTableConfig({ headers, tableData })
    }
    React.useEffect(() => {
        getDataChart('1666032986125463580').then(({ data }) => {
            
            
            const res = JSON.parse(data.responseData) as ResponseData
            let init = {
                title: res.tableHeader,
                whatisDescription: data.whatisDescription,
                whatisFormula: data.whatisFormula,
                whatisMeaning: data.whatisMeaning
            }
            setInitText(init)
            seTitle(data.name)
            setIntroduce(init)
            setTableData(res)
            const xAxis: string[] = Object.keys(res.yInfo)
            
            const option: EChartsOption = {
                title: {
                    text: '',
                    textStyle: {
                        color: '#E5E5E5',
                        fontWeight: 500,
                        fontSize: 12,
                        lineHeight: 42
                    }
                },
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
                            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName != 'Now *' ? item.seriesName.split(' ').slice(0,2).join(' ')+ ' ago' : item.seriesName}: ${item.value} %<br/>`;
                        })
                        return Paramsss;
                    }
                },
                grid: {
                    left: "40px",
                    top: "10px",
                    bottom: "70px",
                    right: "28px"
                },
                xAxis: {
                    type: 'category',
                    data: xAxis,
                    axisLine:{
                        lineStyle: {
                          color: '#343434', // 坐标轴线的颜色
                          width: 1, // 坐标轴线的宽度
                          type: 'solid' // 坐标轴线的类型（实线、虚线等）
                        }
                    },
                    axisLabel:{
                        showMaxLabel:true,
                        interval: 0,
                        color:'#8F8F8F'
                    },
                    axisTick: {
                        interval: 0
                    },
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            color: '#343434'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: res.xName.map((name, index) => ({
                    data: Object.values(res.yInfo).map(values => +values[index].replace('%', '')),
                    type: 'bar',
                    name
                }))
            }
            setOptions(option)
        })
    }, [])
    return (
        <div>
            <Probability />
            {/* <Chart option={options} classes='w-full h-[310px]' introduce={introduce} /> */}
            <div className='text-[#F4F4F4] text-sm leading-6 my-3'>Target Rate Probabilities for 1 Nov 2023 Fed Meeting</div>
            <div className="text-xs text-[#BBBBBB] text-center">
                <div className="flex items-stretch border-0 border-t border-solid border-[#343434]">
                    <div className="basis-1/5 flex items-center justify-center border-0 border-r border-solid border-[#343434]">
                        TARGET RATE (BPS)
                    </div>
                    <div className="basis-4/5">
                        <div className="flex items-center justify-center py-1 border-0 border-b border-solid border-[#343434]">PROBABILITY(%)</div>
                        <div className="flex">
                            {
                                tableConfig.headers.map((name, index) => (
                                    <div key={index}
                                        className={`uppercase basis-1/4 flex items-center justify-center py-1 ${index !== tableConfig.headers.length - 1 && 'border-0 border-r border-solid border-[#343434]'}`}>
                                        {name}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {
                    tableConfig.tableData.map((row, i) => (
                        <div className="flex items-center border-0 border-t border-solid border-[#343434]" key={i}>
                            {
                                row.map((val, index) => (
                                    <div key={index}
                                        className={`basis-1/4 flex items-center justify-center py-1 ${index !== row.length - 1 && 'border-0 border-r border-solid border-[#343434]'}`}>
                                        {val}
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FedWatch