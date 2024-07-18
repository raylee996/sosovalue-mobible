import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import dayjs from 'dayjs'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Charts";
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import { fontFamily } from '@mui/system'
type Props = {
  status:boolean,
} 
const FGI = (props : Props) => {
    const introHeight = 'h-[158px]'
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [greed,setGreed] = React.useState<number>()
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const chartOption:EChartsOption = {
      params: [{
        chartName: 'index_fgi',
        name:'Crypto Fear & Greed Index',
        color:'#2174FF',
        series:{
          type:'line',
        }
      }],
      yAxis: [
        {
          type: 'value',
          name: '',
          min:0,
          max:100,
          interval:20,
          axisLabel: {
            show:false,
            
          },
          splitLine: {
            show:false,
            lineStyle: {
                color: '#333333'
            }
          },
          
        },
        
      ],
      visualMap:[
        {
          show:false,
          type:'continuous',
          //min:Math.min(...tList.slice(0, tList.length - 1)),
          min:0,
          max:100,
          //max:Math.max(...tList.slice(0, tList.length - 1)),
          color:['#24A148','#72C14E','#D29E08','#ED8139','#DA1E28']
        }
      ],
      grid:{
        left: "45px",
        top: "10px",
        bottom: "80px",
        right: "40px"
      },
      graphic:{
        type: 'image',
        left: 'center',
        top: 70,
        z: 10,
        style: {
          image: '/img/watermark.svg',
          x: 0,
          y: 0,
          width: 200,
          height: 44,
          opacity: 1
      }
      },
      hideLegend: false,
      showDataZoom: true 
    }
    const getData = async () => {
      let init = {
          title:'FGI Indicator',
          whatisDescription: '',
          whatisFormula: '',
          whatisMeaning: 'The crypto market behaviour is very emotional. People tend to get greedy when the market is rising which results in FOMO (Fear of missing out). Also, people often sell their coins in irrational reaction of seeing red numbers. With Fear and Greed Index, we try to save you from your own emotional overreations. There are two simple assumptions:Extreme fear can be a sign that investors are too worried. That could be a buying opportunity.When Investors are getting too greedy, that means the market is due for a correction.',
      }
    
      setIntroduce(init)
      /*
        const { data } = await getDataChart('1666032986125463575')
        let init = {
          title:data.name,
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
       
        setIntroduce(init)
        const rows = JSON.parse(data.responseData)
        let tList:number[] = []
        let time:string[] = []
        rows.forEach((item: any,index:number) => {
          if(length && (index > (rows.length - 31)) && index <= rows.length){
            time.push(dayjs(item.timestamp * 1000).format('MM/DD')) 
            tList.push(item.fgi)
          }
        })
        setGreed(tList[tList.length-1])
        const legend = [
          {
              height: '8px',
              name: 'FGI',
              color:'#2174FF',
              val: tList[tList.length -1]
          }
        ]
     
        setLegend(legend)
        const option:EChartsOption = {
            color:['#2174FF'],
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
                  Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
                })
                return Paramsss;
              }
            },
            
            xAxis: {
                type: 'category',
                data: time,
                
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
                  show:false
                }
              },
              yAxis: [
                {
                  type: 'value',
                  name: '',
                  min:0,
                  max:100,
                  interval:20,
                  axisLabel: {
                    show:false,
                    
                  },
                  splitLine: {
                    show:false,
                    lineStyle: {
                        color: '#333333'
                    }
                  },
                  
                },
                
              ],
              // visualMap:{
              //   type:'piecewise',
              //   pieces: [
              //     {min: 50,color: '#24A148'}, // 不指定 max，表示 max 为无限大（Infinity）。
              //     {min: 0, max: 50,color: '#DA1E28'},
              //   ],

              // },
              visualMap:[
                {
                  show:false,
                  type:'continuous',
                  //min:Math.min(...tList.slice(0, tList.length - 1)),
                  min:0,
                  max:100,
                  //max:Math.max(...tList.slice(0, tList.length - 1)),
                  color:['#24A148','#72C14E','#D29E08','#ED8139','#DA1E28']
                }
              ],
              grid:{
                  left: "45px",
                  top: "10px",
                  bottom: "210px",
                  right: "200px"
              },
              series: [
                {
                  name: 'Crypto Fear & Greed Index',
                  type: 'line',
                  showSymbol: false,
                  smooth:true,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: tList
              },
             
              ],
              dataZoom: [
                {
                  type: 'inside',
                  zoomLock: true,
                  start: 0,
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
    
    React.useEffect(() => {
      if(props.status){
        getData() 
      }  
    }, [props.status])
    return (
      <div className='w-full h-full relative'>
        {/* <div className='p-3 text-[#F4F4F4] text-sm leading-6 flex items-center'>
          <span className='mr-2 text-[#C2C2C2]'>FGI Indicator</span>
          <Tooltip classes={{tooltip:'bg-[#141414] border border-solid border-[#404040]'}} title={`We analyze the current sentiment of the Bitcoin market and crunch the numbers into a simple meter from 0 to 100. Zero means "Extreme Fear", while 100 means "Extreme Greed".
let’s list all the different factors we’re including in the current index:Volatility (25 %),Market Momentum/Volume (25%),Social Media (15%),Dominance (10%),Trends (10%)`} className='text-justify'>
              <Image src='/img/svg/Info.svg' width={16} height={16} alt='' className='cursor-pointer' />
            </Tooltip>
        </div> */}
      {/* <div className='absolute left-[5px] top-[200px] text-xs text-[#24A148]'>Greed</div>
      <div className='absolute left-[12px] top-[290px] text-xs text-[#DA1E28]'>Fear</div> */}
      {/* { greed && greed > 50 ? (<div className={`absolute right-[10px] top-[14px] text-sm text-[#F4F4F4] bg-[#24A148] px-2`}>{greed} Greed</div>
      ) : (  <div className={`absolute right-[10px] top-[14px] text-sm text-[#F4F4F4] bg-[#DA1E28] px-2`}>{greed} Fear</div>
      )} */}
      <Chart option={options}  introduce={introduce} classes='w-full h-[390px]' introHeight={introHeight} chartOption={chartOption}/>
      {/* <div ref={chartDivRef} className='w-full h-[350px]'></div> */}
  </div>
    )
}

export default FGI