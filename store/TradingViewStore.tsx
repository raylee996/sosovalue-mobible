import React from "react";
import Script from 'next/script';

type TradingViewContext = {
    tradingviewCreated: boolean;
    tradingviewLoaded: boolean;
    setTradingViewStyle: (style: React.CSSProperties) => void;
    changeSymbol: (symbol: string) => void;
    hideTradingView: () => void;
}

export type Widget = {
    iframe: HTMLIFrameElement;
    ready: (cb: () => void) => void;
    render: () => void;
    reload: () => void;
}

const noop = () => { }

export const TradingViewContext = React.createContext<TradingViewContext>({
    tradingviewCreated: false,
    tradingviewLoaded: false,
    setTradingViewStyle: () => { },
    changeSymbol: () => { },
    hideTradingView: () => { }
})

const initStyle: React.CSSProperties = {
    width: 800, height: 700,
    position: 'fixed',
    left: 100000,
    bottom: 100000,
    opacity: 0
}
const TradingViewStore = ({ children }: React.PropsWithChildren) => {
    const [tradingviewCreated, setTradingviewCreated] = React.useState(false)
    const [tradingviewLoaded, setTradingviewLoaded] = React.useState(false)
    const [style, setStyle] = React.useState<React.CSSProperties>(initStyle)
    const tradingViewRef = React.useRef<Widget>()
    const containerRef = React.useRef<HTMLDivElement>(null)
    const setTradingViewStyle = (style: React.CSSProperties) => {
        setStyle(style)
    }
    const hideTradingView = () => setStyle({ ...initStyle, width: style.width, height: style.height })
    const changeSymbol = (symbol: string) => {
        tradingViewRef.current?.iframe.contentWindow?.postMessage(
            {
                name: 'set-symbol',
                data: { symbol },
            },
            '*'
        )
    }
    const value = React.useMemo(() => ({
        tradingviewCreated, tradingviewLoaded,
        setTradingViewStyle,
        changeSymbol,
        hideTradingView
    }), [tradingviewCreated, tradingviewLoaded])
    const onLoad = () => {
        setTradingviewLoaded(true)
        // if (document.getElementById('tradingview') && 'TradingView' in window) {
        //     //@ts-ignore
        //     console.log(window.TradingView);
        //     //@ts-ignore
        //     tradingViewRef.current = new window.TradingView.widget({
        //         container_id: "tradingview",
        //         width: "100%",
        //         height: "100%",
        //         autosize: true,
        //         symbol: 'BINANCE:BTCUSDT',
        //         interval: "1D",
        //         timezone: "exchange",
        //         theme: "dark",
        //         backgroundColor: "#171717",
        //         style: "1",
        //         toolbar_bg: "#292929",
        //         // withdateranges: true,
        //         // custom_css_url:`${location.origin}/tradingview-theme/theme.css`,
        //         // withdateranges: true,
        //         hide_side_toolbar: true,
        //         // hide_top_toolbar: true,
        //         // withDateRanges: true,
        //         // details: true,
        //         // allow_symbol_change: true,
        //         save_image: false,
        //         // studies: ["ROC@tv-basicstudies", "StochasticRSI@tv-basicstudies", "MASimple@tv-basicstudies"],
        //         show_popup_button: true,
        //         popup_width: "1000",
        //         popup_height: "650",
        //         locale: "en",
        //         // disabled_features: ['header_symbol_search', 'header_resolutions'],
        //         overrides: {
        //             "paneProperties.background": "#292929",
        //         },
        //         // datafeed: new window.Datafeeds.UDFCompatibleDatafeed({
        //         //     onready: (callback) => {
        //         //         console.log('[onReady]: Method call');
        //         //         setTimeout(() => callback({supported_resolutions: ["1S", "1", "30", "60"]}));
        //         //     }
        //         // })
        //     })
        //     // console.log(`${location.origin}/tradingview-theme/theme.css`)
        //     tradingViewRef.current!.ready(() => {
        //         setTradingviewCreated(true)
        //     })
        // }
    }
    return (
        <TradingViewContext.Provider value={value}>
            {children}
            <div style={{...style, overflow: 'hidden'}}>
                <div className="w-full absolute left-0" style={{ top: -38, height: style.height as number + 38 }}>
                    <div>
                        <div id='tradingview' ref={containerRef} className="w-full h-full rounded-lg overflow-hidden"></div>
                    </div>
                </div>
            </div>
            <Script src="https://s3.tradingview.com/tv.js" id='tradingview-widget-loading-script' type='text/javascript' onLoad={onLoad} />
        </TradingViewContext.Provider>
    )
}

export default TradingViewStore