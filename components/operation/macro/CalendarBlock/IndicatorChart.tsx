import React from 'react'
import { EChartsOption, LineSeriesOption } from 'echarts'
import Image from 'next/image';
import Chart from "components/base/Chart";
import IconButton from '@mui/material/IconButton';
import { getLastUpdateTime } from 'http/macro';
import dayjs from 'dayjs';
import Link from 'next/link';
import { intlNumberFormat } from 'helper/tools'
type Props = {
  indicatorData: Array<API.IndicatorData & { previous: number; pubDateString: string;precent: number; }>;
  currentIndicator?: API.Indicator;
}
const colorConfig = [
  {
    name: 'Actual',
    key: 'actual',
    color: '#2174FF'
  },
  {
    name: 'Forecast',
    key: 'forecast',
    color: '#4D8FBF'
  },
  {
    name: 'Previous',
    key: 'previous',
    color: '#07A872'
  }
]
const IndicatorChart = ({ indicatorData, currentIndicator }: Props) => {
  
  const updateTimeStr = indicatorData ? `Update time: ${indicatorData[0]?.pubDateString}` : ''
  const { legend, options } = React.useMemo(() => {
    
    const data = indicatorData[0]
    
    const legend = colorConfig.map(({ name, key, color }) => {
      return ({
      height: '8px',
      name,
      color,
      val: data ? `${data[key as keyof Props['indicatorData'][0]] !== '' ? ((data[key as keyof Props['indicatorData'][0]] + '').indexOf('%') == -1 ? intlNumberFormat(+data[key as keyof Props['indicatorData'][0]]) :  data[key as keyof Props['indicatorData'][0]] ): '-' }` : '-'
    })
  })
    const dateXAxis: string[] = []
    const publishedValueSeries: LineSeriesOption = {
      data: [],
      type: 'line',
      showSymbol: false,
      name: colorConfig[0].name,
      lineStyle: { color: colorConfig[0].color }
    }
    const previousSeries: LineSeriesOption = {
      data: [],
      type: 'line',
      showSymbol: false,
      name: colorConfig[1].name,
      lineStyle: { color: colorConfig[1].color }
    }
    //indicatorData.slice().forEach(({ publishedValue, predictedValue,actual,forecast,percent,releaseTimeTimestamp, previous, pubDateString, indicatorClassificationDoVO }) => {
    indicatorData.slice().reverse().forEach(({ publishedValue, predictedValue,actual,forecast,percent,releaseTimeTimestamp, previous, pubDateString, indicatorClassificationDoVO }) => {
      const getValueStr = (value: number) => percent === 0 ? value : `${value}`
      dateXAxis.push(pubDateString)
      publishedValueSeries.data!.push({ value: parseFloat(actual + ''), valueStr: getValueStr(actual), name: colorConfig[0].name, color: colorConfig[0].color } as any)
      previousSeries.data!.push({ value: parseFloat(previous + ''), valueStr: getValueStr(previous), name: colorConfig[1].name, color: colorConfig[1].color } as any)
    })
    const options: EChartsOption = {
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
        formatter: function (params: any, ticket) {
          let Paramsss = `<div>${params[0].axisValue}</div>`;
          params.map((item: any) => {
            const color = item.data.color
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${color}"></i>${item.seriesName}: ${item.data.valueStr}<br/>`;
          })
          return Paramsss;
        }
      },
      grid: {
        left: "28px",
        top: "10px",
        bottom: "70px",
        right: "28px"
      },
      graphic: {
        type: 'image',
        left: 'center',
        top: 'center',
        z: 10,
        //rotation: Math.PI / 4,
        style: {
          image: '/img/watermark.svg',
          x: 0,
          y: 0,
          width: 200,
          height: 44,
          opacity: 1
      }
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
        axisLabel: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#343434'
          }
        }
      },
      series: [publishedValueSeries]
    }
    return {
      legend,
      options
    }
  }, [indicatorData])
  return (
    <div>
      <div className='px-3'>
        <div className='flex items-center justify-between'>
          <span className='font-medium text-[#BBBBBB] text-base'>{currentIndicator?.name}</span>
          {/* <Link href={currentIndicator?.websiteLink || ''} target='_blank'>
            <IconButton>
              <Image src='/img/svg/openlink.svg' width={24} height={24} alt='' />
            </IconButton>
          </Link> */}
        </div>
        <div className='text-[#BBBBBB] text-sm my-4 flex items-center'>
          <Image className='mr-1' src='/img/svg/ClockCounterClockwise.svg' width={16} height={16} alt='' />
          {updateTimeStr}
        </div>
      </div>
      <Chart option={options} classes='w-full h-[240px] overflow-hidden' legend={legend} />
    </div>
  )
}

export default IndicatorChart