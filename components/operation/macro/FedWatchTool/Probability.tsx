import React from 'react'
import { getDataChart } from 'http/home'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Chart";
import dayjs, { Dayjs } from 'dayjs';
type ResponseData = { xName: string[]; yInfo: Record<string, string[]>; }
const FedWatch = () => {
    const [initText, setInitText] = React.useState<{ whatisDescription: string, whatisFormula: string, whatisMeaning: string }>()
    const [title, seTitle] = React.useState<string>('')
    const [options, setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [tableConfig, setTableConfig] = React.useState<{ headers: string[]; tableData: string[][] }>({ headers: [], tableData: [] })
    const setTableData = (data: any) => {
        const headers = data.xName
        const tableData = Object.keys(data.yInfo).map(key => [key, ...data.yInfo[key]])
        setTableConfig({ headers, tableData })
    }
    React.useEffect(() => {
        getDataChart('1666032986125463595').then(({ data }) => {
            let init = {
                title: 'MEETING PROBABILITIES',
                whatisDescription: data.whatisDescription,
                whatisFormula: data.whatisFormula,
                whatisMeaning: data.whatisMeaning
            }
            setInitText(init)
            seTitle(data.name)
            setIntroduce(init)
           
            const dataList = JSON.parse(data.responseData) as ResponseData
            
            //const xName = Object.keys(dataList).slice(1)
            const xName:any = Object.values(dataList)[0]
            const keys:any = Object.keys(dataList).slice(1)
            const values = Object.values(dataList).slice(1)
            let yInfo:any = {}
             
            
            
            keys.forEach((item:any,index:number) => {
                yInfo[`${dayjs(item).format('YYYY/MM/DD')}`] = values[index]
            })
            
           
            const res:any = {
                xName,
                yInfo
            }
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
                            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} %<br/>`;
                        })
                        return Paramsss;
                    }
                },
                grid: {
                    left: "40px",
                    top: "10px",
                    bottom: "30px",
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
                series: res?.xName?.map((name:any, index:number) => ({
                    data: Object.values(res.yInfo).map((values:any) => +values[index].replace('%', '')),
                    type: 'bar',
                    name
                }))
            }
            setOptions(option)
        })
    }, [])
    return (
        <div>
            <div className='text-[#F4F4F4] text-sm leading-6 my-3'>FOMC Target Rate Probabilities</div>
            {/* <Chart option={options} classes='w-full h-[310px]' introduce={introduce} /> */}
            <div className="text-xs text-[#BBBBBB] text-center w-full overflow-x-auto">
                <div className='w-[480px] min-h-[250px mx-auto'>
                    <div className="border-0 border-t border-solid border-[#343434]">
                        <div className="w-[80px] inline-block items-center border-0 border-r border-solid border-[#343434]">
                            MEETING DATE
                        </div>
                        <div className="w-[400px] inline-block">
                            {/* <div className="flex items-center justify-center py-1 border-0 border-b border-solid border-[#343434]">PROBABILITY(%)</div> */}
                            <div className="inline-block">
                                {
                                    tableConfig.headers.map((name, index) => (
                                        <div key={index}
                                            className={`w-[40px] inline-block uppercase items-center justify-center py-1 ${index !== tableConfig.headers.length - 1 && 'border-0 border-r border-solid border-[#343434]'}`}>
                                            {name}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    {
                        tableConfig.tableData.map((row, i) => {
                            const arr = row.map(item => {
                                if(item != ''){
                                    return parseFloat(item)
                                }else{
                                    return 0
                                }
                                
                            }).slice(1)
                            
                            let max = (Math.max(...arr))
                            
                            return (
                            <div className="border-0 border-t border-solid border-[#343434]" key={i}>
                                {
                                    row.map((val, index) => (
                                        
                                            index == 0 ? (
                                                <div key={index}
                                            className={`w-[80px] inline-block box-border ${parseFloat(val) == max ? 'text-primary font-bold' : ''} items-center justify-center py-1 ${index !== row.length - 1 && 'border-0 border-r border-solid border-[#343434]'}`}>
                                            {val} 
                                        </div>
                                            ) : (
                                                <div key={index}
                                            className={`w-[40px] inline-block box-border ${parseFloat(val) == max ? 'text-primary font-bold' : ''} items-center justify-center py-1 ${index !== row.length - 1 && 'border-0 border-r border-solid border-[#343434]'}`}>
                                            {val} 
                                        </div>
                                            )

                                        
                                        
                                    ))
                                }
                            </div>
                        )})
                    }
                </div>
               
            </div>
        </div>
    )
}

export default FedWatch