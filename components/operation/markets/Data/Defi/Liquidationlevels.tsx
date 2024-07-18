import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { transferMoney, formatDecimal } from 'helper/tools'
import Introduce from 'components/operation/Introduce'
const Data = () => {
  const chartDiv1 = React.useRef<HTMLDivElement>(null)
  const chart1 = React.useRef<any>(null)
  const [value,setValue] = React.useState<any>([])
  const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
  const [title,seTitle] = React.useState<string>('')
  const [active,setActive] = React.useState<string>('ETH')
  const getData1 = async (coin:string) => {
    if(echarts && echarts.getInstanceByDom(chartDiv1.current!) == undefined){
      chart1.current = echarts.init(chartDiv1.current!, 'black')
    }
    const { data } = await getDataChart('1666032986125463574')
    let init = {
      whatisDescription: data.whatisDescription,
      whatisFormula: data.whatisFormula,
      whatisMeaning: data.whatisMeaning
    }
    setInitText(init)
    seTitle(data.name)
    const rows = Object.values(JSON.parse(data.responseData).protocolData)
    const totalLiquidatable = JSON.parse(data.responseData).totalLiquidatable
    const within= JSON.parse(data.responseData).within
    const change = JSON.parse(data.responseData).change
    const binSize = JSON.parse(data.responseData).binSize
    let MakerDao: any = []
    let Liquity: any = []
    let AaveV2: any = []
    let Compound: any = []

    let time: any = []
    const arr = [totalLiquidatable,within,change]
    setValue([...arr])
    rows.forEach((item: any,index:number) => {
      
      time.push((binSize * index).toFixed(2))

      item.forEach((i:any) => {
        if (i.chain === "maker" && coin == 'ETH') {
          MakerDao.push(i.native)
        }
        if (i.chain === "maker" && coin == 'USD') {
          MakerDao.push(i.usd)
        }
        if (i.chain === "liquity" && coin == 'ETH') {
          Liquity.push(i.native)
        }
        if (i.chain === "liquity" && coin == 'USD') {
          Liquity.push(i.usd)
        }
        if (i.chain === "aave-v2" && coin == 'ETH') {
          AaveV2.push(i.native)
        }
        if (i.chain === "aave-v2" && coin == 'USD') {
          AaveV2.push(i.usd)
        }
        if (i.chain === "compound" && coin == 'ETH') {
          Compound.push(i.native)
        }
        if (i.chain === "compound" && coin == 'USD') {
          Compound.push(i.usd)
        }
      })
      
      
      
    })
    
    const option1 = {
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
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>Liquidations at ~ $ ${item.seriesName}: ${item.value.toFixed(2)} <br/>`;
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
        axisLabel: {
          show: true,
          showMaxLabel:true,
          interval:10,
        },
        axisTick: {
          show: false
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
        left: "20px",
        top: "20px",
        bottom: "20px",
        right: "20px"
      },
      series: [
        {
          name: 'MakerDao',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: MakerDao
        },
        {
          name: 'Liquity',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: Liquity
        },
        {
          name: 'Aave V2',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: AaveV2
        },
        {
          name: 'Compound',
          type: 'bar',
          stack: 'trades',
          tooltip: {
            valueFormatter: function (value: number) {
              return value;
            }
          },
          data: Compound
        }]
    }
    
    //const chart1 = echarts.init(chartDiv1.current!, 'black')
    if(chartDiv1.current){
      chart1.current.setOption(option1)
    }

  }
  const changeHandle = (coin:string) => {
    setActive(coin)
    getData1(coin)
  }
  React.useEffect(() => {
    getData1('ETH')
  }, [])
  return (
      <div>
        <div className='text-[#E5E5E5] w-[500px] flex justify-between items-center'>
          <span className='py-[10px] px-[20px] text-sm color-[#676564]'>{title}</span>
          <div className='flex mr-[20px]'>
            <div className={`${active == 'ETH' ? 'bg-[#333333] text-[##E5E5E5]' : 'text-[##808080]'} px-2 cursor-pointer text-xs`} onClick={() => changeHandle('ETH')}>ETH</div>
            <div className={`${active == 'USD' ? 'bg-[#333333] text-[##E5E5E5]' : 'text-[##808080]'} px-2 cursor-pointer text-xs`} onClick={() => changeHandle('USD')}>USD</div>
          </div>
        </div>
        <div className='px-[20px] w-[496px] flex justify-between text-[#E5E5E5] text-[14px]'>
          <div>
            <div className='text-[#676564] text-xs'>Total Liquidatable <br/> (USD)</div>
            <div className='text-[#FFFFFF] text-sm font-bold'>${transferMoney(value[0])}</div>
          </div>
          <div>
            <div className='text-[#676564] text-xs'>Liquidatable value <br/> change (24h)</div>
            <div className='text-[#FFFFFF] text-sm font-bold'>{(value[2] * 100).toFixed(2)}%</div>
          </div>
          <div>
            <div className='text-[#676564] text-xs'>Within -20% of <br/> current price</div>
            <div className='text-[#FFFFFF] text-sm font-bold'>${transferMoney(value[1])}</div>
          </div>
        </div>
        <div ref={chartDiv1} className='w-full h-[350px]'>
            
        </div>
      </div>
  )
}

export default Data