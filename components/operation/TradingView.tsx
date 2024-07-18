import React from 'react';
import { TradingViewContext } from 'store/TradingViewStore';

type Props = {
    symbol: string;
}

const TradingView = ({ symbol }: Props) => {
    const { tradingviewCreated, setTradingViewStyle, changeSymbol, hideTradingView } = React.useContext(TradingViewContext)
    const divRef = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        if (tradingviewCreated) {
            setTradingViewStyle({
                position: 'absolute',
                width: divRef.current?.offsetWidth,
                height: divRef.current?.offsetHeight,
                left: 50,
                top: 58,
                opacity: 1
            })
        }
        return () => hideTradingView()
    }, [tradingviewCreated])
    React.useEffect(() => {
        if (tradingviewCreated) {
            changeSymbol(symbol)
        }
    }, [symbol, tradingviewCreated])
    return <div ref={divRef} className='h-full' />
}

export default TradingView
