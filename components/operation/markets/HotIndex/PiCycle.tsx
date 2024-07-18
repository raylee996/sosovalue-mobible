import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import dayjs from 'dayjs'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Chart";
import { intlNumberFormat } from 'helper/tools'
type Props = {
  status:boolean,
} 
const FundFlow = ({status} : Props) => {

    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const getData = async () => {
        const { data } = await getDataChart('1666032986125463577')
        const rows = JSON.parse(data.responseData).priceList
        let init = {
          title:data.name,
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)
        setIntroduce(init)
        const tList = rows.map((item: any) => {
            return item.price
        })
        const smaList = rows.map((item: any) => {
          if(item['111 SMA']){
            return item['111 SMA']
          }else{
            return 0.01
          }
        })
        const samList1 = rows.map((item: any) => {
          if(item['2*350 SMA']){
            return item['2*350 SMA']
          }else{
            return 0.01
          }
        })
        const piCycleList = rows.map((item: any) => {
          if(item['piCycle']){
            return item['piCycle']
          }else{
            return 0
          }
          // return item.piCycle
        })
        const time = rows.map((item: any) => {
            return dayjs(item.timestamp).format('YY/MM')
        })
        const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
        const legend = [
          {
              height: '2px',
              name: 'Price',
              color:'#E5E5E5',
              val: intlNumberFormat(tList[tList.length -1].toFixed(2)),
              time: LastTime,
          },
          {
              height: '2px',
              name: '111 SMA',
              color:'#D9575E',
              val: intlNumberFormat(smaList[smaList.length -1].toFixed(2)),
              time: LastTime,
          },
          {
              height: '2px',
              name: '2*350 SMA',
              color:'#57D98D',
              val: intlNumberFormat(samList1[samList1.length -1].toFixed(2)),
              time: LastTime,
          },
          {
              height: '2px',
              name: 'Pi Cycle',
              color:'#4D67BF',
              val: intlNumberFormat(piCycleList[piCycleList.length -1].toFixed(2)),
              time: LastTime,
          }
        ]
      
        setLegend(legend)
        const option:EChartsOption = {
          color:['#E5E5E5','#D9575E','#57D98D','#4D67BF','#57D98D','#BFB64D','#BF8F4D','#BF694D','#BF4D61','#BF4DBB','#7C4DBF'],
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
                  if(item.value != 0.01){
                    Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${intlNumberFormat(+item.value.toFixed(2))} <br/>`;
                  }else{
                    Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: 0.00 <br/>`;
                  }
                })
                return Paramsss;
              }
            },
            
            xAxis: {
                type: 'category',
                data: time,
                nameTextStyle:{
                  color:'#A0A0A0',
                  fontWeight:400,
                  fontSize: 10
                },
                axisTick: {
                  show: false
                },
                
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
                splitLine:{
                  //show:false
                }
              },
              yAxis: [
                {
                  type: 'value',
                  // logBase:10,
                  // min:0.01,
                  // max:100000,
                  axisLabel: {
                    show:true,
                    formatter: function (value:number, index:number) {
                      if(value == 0.01){
                        return '0';
                      }else{
                        return value + ''
                      }   
                    }
                  },
                  splitLine: {
                    lineStyle: {
                        color: '#343434'
                    }
                  },
                  
                },
                {
                  type: 'value',
                  min: -3,
                  max:0.5,
                  interval:0.5,
                  axisLabel: {
                    show:true
                  },
                  splitLine:{
                    show:false
                  }
                }
              ],
              grid:{
                  left: "57px",
                  top: "20px",
                  bottom: "80px",
                  right: "40px"
              },
              series: [
                {
                  name: 'Price',
                  type: 'line',
                  showSymbol: false,
                  smooth:true,
                  lineStyle:{
                    width:1
                  },
                  //lineMinHeight: 1,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: tList
                },
                {
                  name: '111 SMA',
                  type: 'line',
                  showSymbol: false,
                  lineStyle:{
                    width:1
                  },
                  smooth:true,
                  data: smaList
                },
                {
                  name: '2*350 SMA',
                  type: 'line',
                  showSymbol: false,
                  lineStyle:{
                    width:1
                  },
                  smooth:true,
                  data: samList1
                },
                {
                  name: 'Pi Cycle',
                  type: 'line',
                  showSymbol: false,
                  lineStyle:{
                    width:1
                  },
                  yAxisIndex:1,
                  smooth:true,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: piCycleList
                },
            ],
            dataZoom: [
                {
                    type: 'inside',
                    zoomLock: true,
                    start:90,
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
              ]
        }
        setOptions(option)
    }
    React.useEffect(() => {
      if(status){
        getData()   
      }   
    }, [status])
    return (
      <div className='w-full h-full'>
        {/* <div className='text-[#E5E5E5] flex items-center'>
            <span className='p-3'>{title}</span>
        </div> */}
        <Chart option={options} classes='w-full h-[390px]' introduce={introduce} legend={legend} />
        {/* <div ref={chartDivRef} className='w-full h-[350px]'></div> */}
    </div>
    )
}

export default FundFlow