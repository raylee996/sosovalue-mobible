import React from 'react'
import * as echarts from 'echarts'
import InputLabel from '@mui/material/InputLabel';
import { getDataBuySell } from 'http/home'
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Image from 'next/image';
import dayjs from 'dayjs'
import Tooltip from '@mui/material/Tooltip';
import { EChartsOption } from 'echarts'
import Chart from "components/base/Chart";
const FundFlow = () => {
  const [legend,setLegend] =  React.useState<API.legend[]>()
  const [options,setOptions] = React.useState<EChartsOption>({})
  const [introduce, setIntroduce] = React.useState<API.initText>()
  const [chartSelect, setChartSelect] = React.useState('BTC');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  const getBuySellData = async (coin: string) => {
    const { data } = await getDataBuySell(coin,{'period':'5m'})
    const rows = JSON.parse(data)
    let buySellRatio:number[] = []
    let time:string[] = []
    rows.forEach( (item:any, index:number) => {
      if(index > 0){
        buySellRatio.push(item.buySellRatio)
        time.push(dayjs(item.timestamp).format('MM-DD'))
      }
    })
    
    const option2:EChartsOption = {
      color: ['#519ABA', '#B7252F'],
      legend: {
        data: ['', ''],
        left: '10%'
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
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
          })
          return Paramsss;
        }
      },
      xAxis: {
        data: time.slice(0, time.length - 1),
        name: 'X Axis',
        axisTick: {
          show: false
        }, 
        axisLabel:{
          showMaxLabel:true
        },
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false }
      },
      yAxis: {
        axisLabel: {
          show: false
        },
        min:Math.min(...buySellRatio.slice(0, buySellRatio.length - 1)),
        max:Math.max(...buySellRatio.slice(0, buySellRatio.length - 1)),
        interval:(Math.max(...buySellRatio.slice(0, buySellRatio.length - 1)) - Math.min(...buySellRatio.slice(0, buySellRatio.length - 1)))/5,
        splitLine: {
          lineStyle: {
            color: '#3C3C3C'
          }
        }
      },
      grid: {
        left: "2px",
        top: "0px",
        bottom: "40px",
        right: "2px"
      },
      series: [
        {
          name: 'long/short ratio',
          type: 'line',
          stack: 'one',
          data: buySellRatio.slice(0, buySellRatio.length - 1),
          //smooth:true,
          showSymbol:false
          //emphasis: emphasisStyle,
          //data: buyVol.slice(0, buyVol.length - 1)
        },
      ]
    };

    setOptions(option2)
  }
  const handleRatioChange = (value:string) => {
    handleClose()
    setChartSelect(value);
    if (value == 'BTC') {
      getBuySellData('BTC')
    } else {
      getBuySellData('ETH')
    }
    
  }
  React.useEffect(() => {

    getBuySellData('BTC')

  }, [])
  return (
    <div className='relative w-full h-full p-3'>
      <div className='z-10 flex h-4 leading-4 text-sm justify-between items-center w-full'>
        <div className='text-[#E5E5E5] flex items-center'>
          <Button onClick={handleClick} className='bg-[#333333] h-[22px] text-sm text-[#E5E5E5]' endIcon={<Image src='/img/svg/CaretDown.svg' width={12} height={12} alt='' />}>{chartSelect}</Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            classes={{
              paper: 'w-16 mt-2 rounded-lg bg-[#333333] shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]',
              list: 'py-0'
            }}
          >
            <MenuItem className='font-bold text-sm text-[#C6C6C6]' onClick={() => handleRatioChange('BTC')}>BTC</MenuItem>
            <MenuItem className='font-bold text-sm text-[#C6C6C6]' onClick={() => handleRatioChange('ETH')}>ETH</MenuItem>
          </Menu>
          {/* <Select name='projectState' value={selectVal} label='状态' size="small" options={selectOption} /> */}
          <span className='mx-2'>Long/short ratio</span>
          <Tooltip classes={{tooltip:'bg-[#141414] border border-solid border-[#404040]'}} title="Taker Buy/Sell volume data from Binance.">
              <Image src='/img/svg/Info.svg' width={16} height={16} alt='' className='cursor-pointer' />
          </Tooltip>
        </div>
        <div className='text-[#BBBBBB]'></div>
      </div>
      <div className="w-full h-full">
        <Chart option={options} classes='w-full h-[159px]' introduce={introduce} legend={legend} />
      </div>
    </div>
  //    <div className='w-full h-full bg-[#292929]'>
      
  //    <Chart option={options} classes='w-full h-[209px]' introduce={introduce} legend={legend} chartSelect={chartSelect} handleChange={handleRatioChange}/>

  //  </div>
  )
}

export default FundFlow