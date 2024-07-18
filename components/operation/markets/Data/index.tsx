import React from 'react'
import MarketCap from './Main/MarketCap'
import MarketCapitalization from './Main/MarketCapitalization'
import MarketValue from './Main/MarketValue' 
import ActiveAddress from './Main/ActiveAddress'
import ChainTransaction from './Main/ChainTransaction'
import Hashrate from './Main/Hashrate'
import MiningDifficulty from './Main/MiningDifficulty'
type Props = {
  status:boolean,
} 
const Data = ({status} : Props) => {
  return (
    <div className='w-full h-full grid grid-cols-3 gap-4'>
      <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
        <MarketCap status={status}/>
      </div>
      {/* <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
        <MarketCapitalization status={status}/>
      </div> */}
      <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
        <MarketValue status={status}/>
      </div>
      <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
        <ActiveAddress status={status}/>
      </div>
      <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
        <ChainTransaction status={status}/>
      </div>
      <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
          <Hashrate status={status}/>
      </div>
      <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
          <MiningDifficulty status={status}/>
      </div>
    </div>
  )
}

export default Data