import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import dayjs from 'dayjs'
import { useDebounceFn } from 'ahooks';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import Loading from 'components/operation/Loading'
import { useThrottle } from 'ahooks';
type Props = {
  over: Array<number>,
}
 
const FundFlow = (props:Props) => {
    const { over } = props
    const  [loading, setLoading] = React.useState<boolean>(true)
    const [down, setDown] = React.useState<number | boolean>(0)
    const [up, setUp] = React.useState<number | boolean>(0)
    const throttledValue = useThrottle(
        over,
        { wait: 1000 }
    );
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor:'#1E1E1E',
        borderColor:'#1E1E1E',
        padding:4,
        textStyle:{
            color:'#A5A7AB',
            fontSize:10
        },
        axisPointer: {
            type: 'line'
        },
        formatter: function (params:any) {
           // console.log(params[0]); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            let firstParams = params[0];
            let Paramsss = `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${params[0].color}"></i>`;
            if(firstParams.name == '10+'){
                Paramsss += `[10%, ∞）: ${firstParams.data.value}`
            }else if(firstParams.name < 10 && firstParams.name >= -8){
                Paramsss += `[${+firstParams.name-2}%, ${+firstParams.name}%) : ${firstParams.data.value}`
            }else{
                Paramsss += `[∞, ${+firstParams.name}%) : ${firstParams.data.value}`
            }
            return Paramsss;
         }
        },
    
      xAxis: {
        type: 'category',
        data: ['-10%', '-8%', '-6%', '-4%', '-2%', '0%', '2%', '4%', '6%', '8%', '10%',''],
        nameTextStyle:{
          color:'#A0A0A0',
          fontWeight:400,
          fontSize: 10
        },
        axisTick: {
            show: false
          },
        boundaryGap : ['20%', '20%'],
        axisLine:{
            show: true, // 是否显示坐标轴线
            lineStyle: {
                color: '#343434', // 坐标轴线的颜色
                width: 1, // 坐标轴线的宽度
                type: 'solid' // 坐标轴线的类型（实线、虚线等）
            }
        },
        axisLabel: {
          padding: [0, 0, 0, 48],
          interval: 0,
          color:'#8F8F8F'
        },
        splitLine:{
          show:false
        }
      },
      graphic:{
        type: 'image',
        left: 'center',
        top: 'center',
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
      yAxis: {
        type: 'value',
        axisLabel: {
          show:false,
          
        },
        splitLine:{
          lineStyle:{
              color: '#343434'
          }
        }
      },
      grid:{
          left: "12px",
          top: "50px",
          bottom: "30px",
          right: "12px"
      },
      series: [
        {
          data: [
          {
              name: '-10',
              value: over[0],
              itemStyle: {
                  color: '#B7252F'
              },
              
          },
          {
              name: '-8',
              value: over[1],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '-6',
              value: over[2],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '-4',
              value: over[3],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '-2', 
              value: over[4],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '0', 
              value: over[5],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '2', 
              value: over[6],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '4', 
              value: over[7],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '6', 
              value: over[8],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '8',
              value: over[9],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '10',
              value: over[10],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '10+',
              value: over[11],
              itemStyle: {
                  color: '#008D4D'
              }
          }
          ],
          type: 'bar',
          
        }
      ]
    };
    
    const chartDiv = React.useRef<HTMLDivElement>(null)
    const chart = React.useRef<any>(null)
    React.useEffect(() => {
     
      const down = over.length >0 && over.slice(0,6).reduce((a,b) => a+b)
      const up = over.length >0 && over.slice(6).reduce((a,b) => a+b)
      setDown(down)
      setUp(up)
      setLoading(false)
        if(echarts && echarts.getInstanceByDom(chartDiv.current!) == undefined){
            chart.current = echarts.init(chartDiv.current!, 'black')
        }
        if(chartDiv.current){
            chart.current.setOption(option)
        }
    },[throttledValue])
    const { run: resize } = useDebounceFn(() => {
        chart.current.resize()
      }, {wait: 300})
      React.useEffect(() => {
          window.addEventListener('resize', resize)
          return () => {
              window.removeEventListener('resize',resize)
          }
      }, [])
    return (
        <div className='relative w-full h-full'>
            <div className='w-full h-full absolute'>
                { loading && <Loading />}
            </div>
                    <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full z-10'>
                        <div className='text-[#BBBBBB]'>
                        <span className='mr-2 text-[#C2C2C2]'>Distribution of ups/downs</span> 
                        <Tooltip classes={{tooltip:'bg-[#141414] border border-solid border-[#404040]'}}  title='The number of tokens in this table is linked to the number of tokens in the watchlist.
        The change% of this table are calculated based on the 24-hour change% of the token, and the horizontal coordinate is set at an interval of 2%. 
        With this chart, you can quickly and intuitively understand the current market situation and the rise and fall of various dominances in the cryptocurrency market.' className='text-justify'>
                            <Image src='/img/svg/Info.svg' width={16} height={16} alt='' className='cursor-pointer align-top' />
                        </Tooltip>
                        </div>
                    <div className='text-[#8D8D8D]'>↓ {down} ↑ {up} </div>
                </div>
                <div ref={chartDiv} className="w-full h-full"></div>
          
        </div>
    )
}

export default FundFlow