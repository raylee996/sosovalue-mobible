import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import Introduce from 'components/operation/Introduce'
const Data = () => {
  const chartDiv = React.useRef<HTMLDivElement>(null)
  const chart = React.useRef<any>(null)
  const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
  const [title,seTitle] = React.useState<string>('')
  const getData = async () => {
    const { data } = await getDataChart('1666032986125463555')
    let init = {
      whatisDescription: data.whatisDescription,
      whatisFormula: data.whatisFormula,
      whatisMeaning: data.whatisMeaning
    }
    setInitText(init)
    seTitle(data.name)
    const rows = JSON.parse(data.responseData).result.rows
    rows.sort((a: any, b: any) => a.time.localeCompare(b.time))
    let length = data.initFixedScale
    let openSea: any = []
    let blur: any = []
    let gem: any = []
    let AlphaSharks: any = []

    let time: any = []
    rows.forEach((item: any) => {
      if (item.name && item.name === "OpenSea" && length && openSea.length <= +length) {
        openSea.push(item.total_trades)
        time.push(item.time.slice(5, 10))
      }
      if (item.name && item.name === "Blur" && length && blur.length <= +length) {
        blur.push(item.total_trades)
      }
      if (item.name && item.name === "Gem" && length && gem.length <= +length) {
        gem.push(item.total_trades)
      }
      if (item.name && item.name === "Alpha Sharks" && length && AlphaSharks.length <= +length) {
        AlphaSharks.push(item.total_trades)
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

      xAxis: {
        type: 'category',
        data: time,
        nameTextStyle: {
          color: '#A0A0A0',
          fontWeight: 400,
          fontSize: 10
        },
        boundaryGap: ['20%', '20%'],
        axisLine: {

        },
        axisTick: {
          show: false
        },
        axisLabel:{
          showMaxLabel:true
        },
        splitLine: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '',
          axisLabel: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#3C3C3C'
            }
          }
        },
        {
          type: 'value',
          name: '',
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
      grid: {
        left: "18px",
        top: "50px",
        bottom: "30px",
        right: "18px"
      },
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
    }
    if(echarts && echarts.getInstanceByDom(chartDiv.current!) == undefined){
      chart.current = echarts.init(chartDiv.current!, 'black')
    }
    if(chartDiv.current){
      chart.current.setOption(option)
    }

  }
  React.useEffect(() => {
    getData()


  }, [])
  return (
      <div className='relative w-[500px] mb-0.5'>
        <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
          <div className='text-[#E5E5E5]'>{title}</div>
        </div>
        <div ref={chartDiv} className="w-[500px] h-[366px]">

        </div>
      </div>
  )
}

export default Data