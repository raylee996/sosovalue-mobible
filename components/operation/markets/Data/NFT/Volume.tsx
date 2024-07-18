import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import Introduce from 'components/operation/Introduce'
import dayjs from 'dayjs'
const Data = () => {
  const chartDiv = React.useRef<HTMLDivElement>(null)
  const chart = React.useRef<any>(null)

  const [title,seTitle] = React.useState<string>('')
  const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
  const getData = async () => {
    if(echarts && echarts.getInstanceByDom(chartDiv.current!) == undefined){
      chart.current = echarts.init(chartDiv.current!, 'black')
    }
    const { data } = await getDataChart('1666032986125463557')
    let length = data.initFixedScale
    let init = {
      whatisDescription: data.whatisDescription,
      whatisFormula: data.whatisFormula,
      whatisMeaning: data.whatisMeaning
    }
    setInitText(init)
    seTitle(data.name)
    const rows = JSON.parse(data.responseData).result.rows
    
    rows.sort((a: any, b: any) => a.time.localeCompare(b.time))
    let openSea: any = []
    let blur: any = []
    let looksrare: any = []
    let x2y2: any = []
    let cryptopunks: any = []
    let time: any = []
    rows.forEach((item: any,index:number) => {
      if (item.project && item.project === "OpenSea" && length && openSea.length <= +length) {
        time.push(item.time)
        openSea.push(0)
        looksrare.push(0)
        x2y2.push(0)
        blur.push(0)
        cryptopunks.push(0)
      }
    })
    time.forEach((item: any,index:number) => {
      let indexNum = index
      rows.forEach((items: any,indexs:number) => {
        
        if(item == items.time){
          if(items.project === "OpenSea"){
            openSea[indexNum] = items.volume
          }
          if (items.project === "Blur") {
            blur[indexNum] = items.volume
          }
          if (items.project === "LooksRare") {
            looksrare[indexNum] = items.volume
          }
          if (items.project === "X2Y2") {
            x2y2[indexNum] = items.volume
          }
          if (items.project === "CryptoPunks") {
            cryptopunks[indexNum] = items.volume
          }
        }
      })
    })
    const timeStamp = time.map((item:string) => dayjs(item).format('MM-DD'))
    /*
    rows.forEach((item: any,index:number) => {
      if (item.project && item.project === "OpenSea" && length && openSea.length <= +length) {
        openSea.push(item.volume)
      }
      if (item.project && item.project === "Blur" && length && blur.length <= +length) {
        blur.push(item.volume)
      }
      if (item.project && item.project === "LooksRare" && length && looksrare.length <= +length) {
        looksrare.push(item.volume)
      }
      if (item.project && item.project === "X2Y2" && length && x2y2.length <= +length) {
        x2y2.push(item.volume)
      }
      if (item.project && item.project === "CryptoPunks" && length && cryptopunks.length <= +length) {
        cryptopunks.push(item.volume)
      }
    })
*/
    const option = {
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
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value.toFixed(2)} <br/>`;
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
          data: timeStamp,
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
          name: 'blur',
          type: 'bar',
          stack: 'volume',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: blur
        },
        {
          name: 'openSea',
          type: 'bar',
          stack: 'volume',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: openSea
        },
        
        {
          name: 'LooksRare',
          type: 'bar',
          stack: 'volume',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: looksrare
        },
        {
          name: 'X2Y2',
          type: 'bar',
          stack: 'volume',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: x2y2
        },
        {
          name: 'CryptoPunks',
          type: 'bar',
          stack: 'volume',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: cryptopunks
        }
      ]
    };
    
    if(chartDiv.current){
      chart.current.setOption(option)
    }
    
  }


  React.useEffect(() => {
    getData()
  }, [])
  return (
   
      <div className='relative w-full h-full flex flex-col items-stretch'>
        <div className='p-3 flex leading-4 text-sm justify-between items-center w-full'>
          <div className='text-[#C2C2C2]'>Track data</div>
        </div>
        <div ref={chartDiv} className="w-full h-0 flex-1">

        </div>
      </div>
      
    
  )
}

export default Data