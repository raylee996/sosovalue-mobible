import React from 'react'
import TotalLocked from './TotalLocked'
import Liquidationlevels from './Liquidationlevels'
import ChainsLocked from './ChainsLocked'
const Main = () => {
    return (
        <div className='relative'>
            <TotalLocked/>
            <ChainsLocked/>
            <Liquidationlevels/>
        </div>
    )
}

export default Main