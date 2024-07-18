import React from 'react'
import MarketCap from './MarketCap'
import MarketCapitalization from './MarketCapitalization'
import MarketValue from './MarketValue'
import ActiveAddress from './ActiveAddress'
import ChainTransaction from './ChainTransaction'
type Props = {
    status:boolean,
} 
const Main = ({status} : Props) => {
    return (
        <div>
            <MarketCap status={status}/>
            <MarketCapitalization status={status}/>
            <MarketValue status={status}/>
            <ActiveAddress status={status}/>
            <ChainTransaction status={status}/>
        </div>
    )
}

export default Main