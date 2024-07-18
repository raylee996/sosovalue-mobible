import React from 'react'
import Traders from './Traders'
import Trades from './Trades'
import Volume from './Volume'
const NFT = () => {
    return (
        <div className='bg-[#1E1E1E]' id='hidden-scroll'>
            <Volume/>
            <Trades/>
            <Traders/>
        </div>
    )
}

export default NFT