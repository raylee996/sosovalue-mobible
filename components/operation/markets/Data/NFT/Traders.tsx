import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import Introduce from 'components/operation/Introduce'
const Data = () => {
  const chartDiv = React.useRef<HTMLDivElement>(null)
  const chart = React.useRef<any>(null)
  const [title,seTitle] = React.useState<string>('')
  const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
  const getData = async () => {
    if(echarts && echarts.getInstanceByDom(chartDiv.current!) == undefined){
      chart.current = echarts.init(chartDiv.current!, 'black')
    }
    const { data } = await getDataChart('1666032986125463556')
    let init = {
      whatisDescription: data.whatisDescription,
      whatisFormula: data.whatisFormula,
      whatisMeaning: data.whatisMeaning
    }
   setInitText(init)
   seTitle(data.name)
    const rows = JSON.parse(data.responseData).result.rows
    let length = data.initFixedScale
    rows.sort((a: any, b: any) => a.time.localeCompare(b.time))
    let openSea: any = []
    let blur: any = []
    let gem: any = []
    let AlphaSharks: any = []

    let time: any = []
    rows.forEach((item: any) => {
      if (item.name && item.name === "OpenSea" && length && openSea.length <= +length) {
        openSea.push(item.traders)
        time.push(item.time.slice(5, 10))
      }
      if (item.name && item.name === "Blur" && length && blur.length <= +length) {
        blur.push(item.traders)
      }
      if (item.name && item.name === "Gem" && length && gem.length <= +length) {
        gem.push(item.traders)
      }
      if (item.name && item.name === "Alpha Sharks" && length && AlphaSharks.length <= +length) {
        AlphaSharks.push(item.traders)
      }
    })
    
    const option = {
      color: ['#519ABA', '#8DC149', '#CBCB41', '#E37933'],

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
      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: time,
          axisLabel:{
            showMaxLabel:true
          },
          axisTick: {
            show: false
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#3C3C3C'
            }
          }
        }
      ],
      series: [
        {
          name: 'openSea',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: openSea
        },
        {
          name: 'blur',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: blur
        },
        {
          name: 'gem',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: gem
        },
        {
          name: 'Alpha Sharks',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: AlphaSharks
        }]
    };
    
   // const chart = echarts.init(chartDiv.current!, 'black')
    if(chartDiv.current){
      chart.current.setOption(option)
    }

  }
  React.useEffect(() => {
    getData()
  }, [])
  return (
    

      <div className='relative w-[500px] '>
        <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
          <div className='text-[#E5E5E5]'>{title}</div>
        </div>
        <div ref={chartDiv} className="w-[500px] h-[366px]">

        </div>
      </div>

  )
}

export default Data