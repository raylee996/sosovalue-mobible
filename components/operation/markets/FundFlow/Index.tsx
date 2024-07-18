import React from 'react'

import EthActivities from './EthActivities'
import EthAmout from './EthAmout'
import EstimatedRatio from './EstimatedRatio'
type Props = {
    status:boolean,
} 
const Main = ({status} : Props) => {
    return (
        <div className='w-full h-full grid grid-cols-3 gap-4'>
            {/* <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <BtcNetTransfer status={status}/>
            </div>
            <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <EthNetTransfer status={status}/>
            </div> */}
            
            {/* <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <EthActivities status={status}/>
            </div> */}
            <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <EthAmout status={status}/>
            </div>
            <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <EstimatedRatio status={status}/>
            </div>
         </div>
    )
}

export default Main