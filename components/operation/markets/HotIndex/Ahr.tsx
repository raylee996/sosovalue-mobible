import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import dayjs from 'dayjs'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Charts";
import { intlNumberFormat } from 'helper/tools'
type Props = {
  status:boolean,
}  
const AHR = ({status} : Props) => {
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const chartOption:EChartsOption = {
      params: [{
        chartName: 'AHR999_Indicator_value',
        name:'BTC Price',
        
        color:'#E5E5E5',
        series:{
          type:'line',
          yAxisIndex: 1,
        }
      },
      {
        chartName: 'AHR999_Indicator_ahr999',
        name:'AHR999',
        color:'#4D67BF',
        
        series:{
          type:'line',
          //yAxisIndex: true,
        }
      },
      {
        chartName: '',
        name:'Fixed investment zome',
        static: 0.45,
        color:'#D9575E',
        series:{
          type:'line',
        }
      },
      {
        chartName: '',
        name:'Buy at the bottom',
        static: 1.20,
        
        color:'#57D98D',
        series:{
          type:'line',
        }
      }],
      grid:{
        left: "50px",
        top: "20px",
        bottom: "80px",
        right: "60px"
      },
      yAxis: [
        {
          type: 'log',
          min: 0.1,
          position: 'left',
          logBase:10,
          axisLabel: {
            show:true,
            formatter: function (value:number, index:number) {
              if(value == 0.1){
                return '0';
              }else{
                return value + ''
              }   
            }
          },
          //min:1,
          //max:Math.max(...tList),
          //interval:Math.max(...tList)/10,
          //logBase: 10,
          splitLine: {
            show:true,
            lineStyle: {
                color: '#343434'
            }
          }
        },
        {
          type: 'log',
          min: 1,
          splitNumber:7,
          position: 'right',
          logBase:10,
          axisLabel: {
            show:true,
            formatter: function (value:number, index:number) {
              if(value == 1){
                return '0';
              }else{
                return value + ''
              }   
            }
          },
          // min:0,
          // max:Math.max(...dList),
          // interval:Math.max(...dList)/10,
          
          splitLine:{
            show:false
          }
        }
      ],
      showDataZoom: true
    }
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [tab,setTab] = React.useState('Daily')
    const [tabList,setTabList] = React.useState<string[]>(['Daily','Weekly'])
    const [title,seTitle] = React.useState<string>('')
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const getData = async () => {
        const { data } = await getDataChart('1666032986125463576')
        let init = {
          title:data.name,
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)
        setIntroduce(init)
        /*
        const rows = JSON.parse(data.responseData)
        const tList = rows.map((item: any) => {
            return item.ahr999
        })
        const buyList = rows.map((item: any) => {
          return 0.45
        })
        const fixList = rows.map((item: any) => {
          return 1.20
        })
        const dList = rows.map((item: any) => {
          return item.value
        })
        
        const cost = rows.map((item: any) => {
          return item.avg
        })
        
        const time = rows.map((item: any) => {
            
            return dayjs(item.date).format('YY/MM')
        })
        const LastTime = dayjs(rows[rows.length - 1].date).format('MMM D')
        const legend = [
          {
            height: '2px',
            name: 'BTC Price',
            color:'#E5E5E5',
            val: intlNumberFormat(dList[dList.length -1]),
            time: LastTime,
          },
          {
              height: '2px',
              name: 'AHR999',
              color:'#4D67BF',
              val: tList[tList.length -1].toFixed(2),
              time: LastTime,
          },
          
          {
              height: '2px',
              name: 'Fixed investment zome',
              color:'#D9575E',
              val: fixList[fixList.length -1],
              time: LastTime,
          },
          {
              height: '2px',
              name: 'Buy at the bottom',
              color:'#57D98D',
              val: buyList[buyList.length -1],
              time: LastTime,
          }
        ]
      
        setLegend(legend)
        const option:EChartsOption = {
          color:['#E5E5E5','#4D67BF','#D9575E','#57D98D','#57D98D','#BFB64D','#BF8F4D','#BF694D','#BF4D61','#BF4DBB','#7C4DBF'],
            tooltip: {
              trigger: 'axis',
              backgroundColor: '#1E1E1E',
              borderColor: '#1E1E1E',
              padding: 1,
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
                  Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
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
                splitLine:{
                  show:false
                }
              },
              yAxis: [
                {
                  type: 'log',
                  min: 0.1,
                  position: 'left',
                  logBase:10,
                  axisLabel: {
                    show:true,
                    formatter: function (value:number, index:number) {
                      if(value == 0.1){
                        return '0';
                      }else{
                        return value + ''
                      }   
                    }
                  },
                  //min:1,
                  //max:Math.max(...tList),
                  //interval:Math.max(...tList)/10,
                  //logBase: 10,
                  splitLine: {
                    show:true,
                    lineStyle: {
                        color: '#343434'
                    }
                  }
                },
                {
                  type: 'log',
                  min: 1,
                  splitNumber:7,
                  position: 'right',
                  logBase:10,
                  axisLabel: {
                    show:true,
                    formatter: function (value:number, index:number) {
                      if(value == 1){
                        return '0';
                      }else{
                        return value + ''
                      }   
                    }
                  },
                  // min:0,
                  // max:Math.max(...dList),
                  // interval:Math.max(...dList)/10,
                  
                  splitLine:{
                    show:false
                  }
                }
              ],
              grid:{
                  left: "30px",
                  top: "20px",
                  bottom: "80px",
                  right: "60px"
              },
              series: [
                {
                  name: 'BTC Price',
                  type: 'line',
                  showSymbol: false,
                  smooth:true,
                  lineStyle:{
                    width:1
                  },
                  yAxisIndex: 1,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: dList
              },
                {
                  name: 'AHR999',
                  type: 'line',
                  showSymbol: false,
                  lineStyle:{
                    width:1
                  },
                  smooth:true,
                  //yAxisIndex: 1,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: tList
              },
              
            {
              name: 'Fixed investment zome',
              type: 'line',
              showSymbol: false,
              smooth:true,
              lineStyle:{
                width:1
              },
              // tooltip: {
              //   valueFormatter: function (value:number) {
              //     return value;
              //   }
              // },
              data: fixList
            },
            {
              name: 'Buy at the bottom',
              type: 'line',
              showSymbol: false,
              smooth:true,
              lineStyle:{
                width:1
              },
              // tooltip: {
              //   valueFormatter: function (value:number) {
              //     return value;
              //   }
              // },
              data: buyList
            },
            
          //   {
          //     name: '200 Day Cost',
          //     type: 'line',
          //     tooltip: {
          //       valueFormatter: function (value:number) {
          //         return value;
          //       }
          //     },
          //     data: cost
          // },
            ],
            dataZoom: [
                {
                    type: 'inside',
                    zoomLock: true,
                    start: 92,
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
        */
    }
    const handleClickTab = (val:string) => {
      setTab(val)
    }
    React.useEffect(() => {
      //setChartOption()
    }, [])
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
      <Chart option={options} classes='w-full h-[390px]' introduce={introduce} legend={legend}
        chartOption = {chartOption}
      />
      {/* <div ref={chartDivRef} className='w-full h-[350px]'></div> */}
  </div>
    )
}

export default AHR