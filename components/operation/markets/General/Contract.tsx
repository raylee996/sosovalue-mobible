import React from 'react'
import MenuItem from '@mui/material/MenuItem';
import { getDataRekt, getDataInterest, getDataBuySell } from 'http/home'
import { transferMoney } from 'helper/tools'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Image from 'next/image';
import Tooltip from '@mui/material/Tooltip';
import useLoading from "hooks/useLoading"
import Watermark from 'components/operation/Watermark'
type Props = {
  positionData: any,
  status:boolean
}
const FundFlow = (props: Props) => {
  const { positionData } = props
  
  //const positionDataInfo = positionData && positionData.length > 0 && [...positionData]
  //const positionDataInfo = []
  const Loading = useLoading()
  const [coin, setCoin] = React.useState('BTC');
  const [liquidationInfo, setLiquidationInfo] = React.useState<any>()
  const [openInterest, setOpenInterest] = React.useState<any>()
  const [buySellRatio, setBuySellRatio] = React.useState<any>()
  const [volumn, setVolumn] = React.useState<any>()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [tab,setTab] = React.useState('5m')
  const [tabList,setTabList] = React.useState<string[]>(['5m','1h','4h','1d'])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = async (value: 'BTC' | 'ETH') => {
    handleClose()
    setCoin(value);
    if (value == 'BTC') {
      const { data } = await getDataRekt('BTC')
      setLiquidationInfo(data)
      const res = await getDataInterest('BTC',{'period':tab})
      setOpenInterest(res.data)
      const result = await getDataBuySell('BTC',{'period':tab})
      setBuySellRatio(JSON.parse(result.data))

    } else {
      const { data } = await getDataRekt('ETH')
      setLiquidationInfo(data)
      const res = await getDataInterest('ETH',{'period':tab})
      setOpenInterest(res.data)
      const result = await getDataBuySell('ETH',{'period':tab})
      setBuySellRatio(JSON.parse(result.data))

    }
  }
  const clickTab = async (val:string) => {
    setTab(val)
    const res = await getDataInterest(coin,{'period':val})
    setOpenInterest(res.data)
    const result = await getDataBuySell(coin,{'period':val})
    setBuySellRatio(JSON.parse(result.data))
  }
  React.useEffect(() => {
    getDataRekt('BTC').then(res => {
      setLiquidationInfo(res.data)
      Loading.close()
    })
    getDataInterest('BTC',{'period':tab}).then(res => {
      setOpenInterest(res.data)
      Loading.close()
    })
    getDataBuySell('BTC',{'period':tab}).then(res => {
      setBuySellRatio(JSON.parse(res.data))
      Loading.close()
    })
  }, [])
  React.useEffect(() => {
    if(props.status){
      if (tab == '5m') {
        if(coin == 'BTC'){
          positionData?.BTC && setLiquidationInfo(positionData.BTC.liquidationInfo)
          positionData?.BTC && setOpenInterest(positionData.BTC.openInterest)
          positionData?.BTC.takerBuySellVolume && setBuySellRatio(JSON.parse(positionData.BTC.takerBuySellVolume))
        }else{
          positionData && positionData?.ETH && setLiquidationInfo(positionData && positionData.ETH.liquidationInfo)
          positionData && positionData?.ETH && setOpenInterest(positionData && positionData.ETH.openInterest)
          positionData.ETH?.takerBuySellVolume && setBuySellRatio(positionData && JSON.parse(positionData.ETH.takerBuySellVolume))
        } 
      }else{
        if(coin == 'BTC'){
          positionData && setLiquidationInfo(positionData.BTC.liquidationInfo)
        }else{
          setLiquidationInfo(positionData && positionData.ETH.liquidationInfo)
        } 
      }
    }
    

  }, [positionData,props.status])
  return (
    <Loading.Component>
    <div className='w-full h-full p-3 relative'>
      
      <div className='flex leading-4 text-sm justify-between items-center w-full'>
        <div className='text-[#E5E5E5] flex items-center'>
          <Button onClick={handleClick} className='bg-[#333333] h-[22px] text-sm text-[#E5E5E5]' endIcon={<Image src='/img/svg/CaretDown.svg' width={12} height={12} alt='' />}>{coin}</Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            classes={{
              paper: 'w-16 mt-2 rounded-lg bg-[#333333] shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]',
              list: 'py-0'
            }}
          > 
            <MenuItem className='font-bold text-sm text-[#C6C6C6]' onClick={() => handleChange('BTC')}>BTC</MenuItem>
            <MenuItem className='font-bold text-sm text-[#C6C6C6]' onClick={() => handleChange('ETH')}>ETH</MenuItem>
          </Menu>
          <span className='mx-2 text-[#C2C2C2]'>Contract</span>
          <Tooltip classes={{tooltip:'bg-[#141414] border border-solid border-[#404040]'}}  title="Rekt data is for the entire network, while others is only for binance. This table summarizes the common contracts and positions data, reflecting the current market situation and structure from the perspective of derivatives." className='text-justify'>
              <Image src='/img/svg/Info.svg' width={16} height={16} alt='' className='cursor-pointer' />
          </Tooltip>
        </div>
        {
          tabList && (
              <div className='flex'>
                  {
                      tabList.map((item:string,index:number) => {
                          return (
                              <div key={index} className={`${tab == item ? 'text-[#FF4F20] font-bold' : 'text-[#8D8D8D]' } text-sm bg-[#282828] px-2 cursor-pointer`} onClick={() => clickTab(item)}>{item}</div>
                          )
                      })
                  }
              </div>
          )
        }
        {/* <div className='text-[#BBBBBB]'>64 <span className='bg-[#008D4D] py-0.5 px-1'>Greedy</span></div> */}
      </div>
      
      <div className="w-full h-[380px]">
        <div className='mt-5'>
          <div className='flex justify-between items-center'>
            <div className='text-[#8D8D8D] text-xs'>Number of long volume </div>
            <div className='text-[#8D8D8D] text-xs'>Number of short volume</div>
          </div>
          <div className='flex justify-between items-center mb-5'>
            <div className={`text-xs leading-4 mx-0.5 ml-[-1px] `} style={{ width: `${(buySellRatio) ? (((+buySellRatio[0]?.buyVol)/((+buySellRatio[0]?.buyVol) + (+buySellRatio[0]?.sellVol))) *100 ).toFixed(2) : '50'}%` }}>
              <div className='bg-[#008D4D] rounded-sm w-full pl-2 h-[24px] leading-[24px] text-[#E5E5E5]'>Long {buySellRatio && (((+buySellRatio[0]?.buyVol)/((+buySellRatio[0]?.buyVol) + (+buySellRatio[0]?.sellVol))) *100 ).toFixed(2)}%</div>
            </div>
            <div className={`text-xs leading-4 mx-0.5 mr-[-1px] `} style={{ width: `${(buySellRatio) ? (((+buySellRatio[0]?.sellVol)/((+buySellRatio[0]?.buyVol) + (+buySellRatio[0]?.sellVol))) *100 ).toFixed(2) : '50'}% ` }}>
              <div className='w-full bg-[#B7252F] rounded-sm whitespace-nowrap  pr-2 h-[24px] leading-[24px] text-right text-[#E5E5E5]'>Short {buySellRatio && (((+buySellRatio[0]?.sellVol)/((+buySellRatio[0]?.buyVol) + (+buySellRatio[0]?.sellVol))) *100 ).toFixed(2)}%</div>
            </div>
          </div>
          <div className='flex justify-between items-center '>
            <div className='text-[#8D8D8D] text-xs'>Number of long accounts</div>
            <div className='text-[#8D8D8D] text-xs'>Number of short accounts</div>
          </div>
          <div className='flex justify-between items-center mb-5'>
            <div className={`text-xs leading-4 mx-0.5 ml-[-1px] rounded-sm`} style={{ width: `${openInterest ? (openInterest?.longAccount * 100).toFixed(2) : '50'}%` }}>
              
              <div className='bg-[#008D4D] w-full pl-2 h-[24px]  rounded-sm leading-[24px] text-[#E5E5E5]'>Long {openInterest && (openInterest?.longAccount * 100).toFixed(2)}%</div>
            </div>
            <div className={`text-xs leading-4 mx-0.5 mr-[-1px] rounded-sm`} style={{ width: `${openInterest ? (openInterest?.shortAccount * 100).toFixed(2) : '50'}% ` }}>
              <div className='w-full bg-[#B7252F] pr-2 h-[24px]  rounded-sm leading-[24px] text-right text-[#E5E5E5]'>Short {openInterest && (openInterest?.shortAccount * 100).toFixed(2)}%</div>
            </div>
          </div>
          <div className='flex justify-between items-center text-[#CCCCCC] text-xs leading-4 border-0 border-t border-[#343434] border-solid'>
            <div className='w-full py-6'>
              <div className='flex items-center p-1'>
                <div className='flex-1 text-xs text-[#8D8D8D]'>24H Rekt</div>
                <div className='flex-1 text-sm text-[#F4F4F4] font-bold'>${transferMoney(Number(liquidationInfo?.totalVolUsd))}</div>
              </div>
              <div className='flex items-center p-1'>
                <div className='flex-1 text-xs text-[#8D8D8D]'>24H Long Rekt</div>
                <div className='flex-1 text-sm text-[#F4F4F4] font-bold'>${transferMoney(Number(liquidationInfo?.shortVolUsd))}</div>
              </div>
              <div className='flex items-center p-1'>
                <div className='flex-1 text-xs text-[#8D8D8D]'>24H Short Rekt</div>
                <div className='flex-1 text-sm text-[#F4F4F4] font-bold'>${transferMoney(Number(liquidationInfo?.longVolUsd))}</div>
              </div>
            </div>
          </div>
          <div className='flex justify-between items-center text-[#CCCCCC] text-xs leading-4 border-0 border-t border-[#343434] border-solid'>
            <div className=' w-full py-6'>
            <div className='flex items-center p-1'>
                <div className='flex-1 text-xs text-[#8D8D8D]'>Current Open Interest</div>
                <div className='flex-1 text-sm text-[#F4F4F4] font-bold'>{transferMoney(Number(openInterest?.openInterest))}</div>
              </div>
              <div className='flex items-center p-1'>
                <div className='flex-1 text-xs text-[#8D8D8D]'>24H History High OI</div>
                <div className='flex-1 text-sm text-[#F4F4F4] font-bold'>{transferMoney(Number(openInterest?.sumOpenInterestValue))}</div>
              </div>
              <div className='flex items-center p-1'>
                <div className='flex-1 text-xs text-[#8D8D8D]'>Long/Short Account Ratio</div>
                <div className='flex-1 text-sm text-[#F4F4F4] font-bold'>{openInterest?.longShortRatio}</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <Watermark />
      
    </div>
    </Loading.Component>
  )
}

export default FundFlow