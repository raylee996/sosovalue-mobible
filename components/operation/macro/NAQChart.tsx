import React from 'react'
import Button from '@mui/material/Button'
import { TradingViewContext, Widget } from 'store/TradingViewStore'
import { useDebounceFn } from 'ahooks'

const tabs = [
  {
    title: 'DXY',
    symbol: 'CAPITALCOM:DXY'
  },
  {
    title: 'NAQ',
    symbol: 'NASDAQ:IXIC'
  },
  {
    title: 'NQ1!',
    symbol: 'CME_MINI:NQ1!'
  },
  // {
  //   title: 'S&P500',
  //   symbol: 'CBOE:SPX'
  // },
  {
    title: 'ES1!',
    symbol: 'CME_MINI:ES1!'
  },
]

const NAQChart = () => {
  const { tradingviewLoaded } = React.useContext(TradingViewContext)
  const [symbol, setSymbol] = React.useState(tabs[0].symbol)
  const tabChange = (symbol: string) => {
    setSymbol(symbol)
    tradingViewRef.current?.iframe.contentWindow?.postMessage(
      {
        name: 'set-symbol',
        data: { symbol },
      },
      '*'
    )
  }
  const tradingViewRef = React.useRef<Widget>()
  React.useEffect(() => {
    if (tradingviewLoaded) {
      //@ts-ignore
      tradingViewRef.current = new window.TradingView.widget({
        container_id: 'naqchart-tradingview',
        width: "100%",
        height: "100%",
        autosize: true,
        symbol,
        interval: "1D",
        timezone: "exchange",
        theme: "dark",
        backgroundColor: "#171717",
        style: "1",
        // toolbar_bg: "#292929",
        // custom_css_url:`${location.origin}/tradingview-theme/theme.css`,
        // withdateranges: true,
        hide_side_toolbar: true,
        // hide_top_toolbar: true,
        // details: true,
        // allow_symbol_change: true,
        save_image: false,
        // studies: ["ROC@tv-basicstudies", "StochasticRSI@tv-basicstudies", "MASimple@tv-basicstudies"],
        // show_popup_button: true,
        // popup_width: "1000",
        // popup_height: "650",
        locale: "en",
        // disabled_features: ['header_symbol_search', 'use_localstorage_for_settings', 'top_toolbar', 'side_toolbar'],
        overrides: {
          "paneProperties.background": "#292929",
        },
        // datafeed: new window.Datafeeds.UDFCompatibleDatafeed({
        //     onready: (callback) => {
        //         console.log('[onReady]: Method call');
        //         setTimeout(() => callback({supported_resolutions: ["1S", "1", "30", "60"]}));
        //     }
        // })
      })
      tradingViewRef.current!.ready(() => { })
    }
  }, [tradingviewLoaded])
  const { run: resize } = useDebounceFn(() => {
    tradingViewRef.current?.reload()
  }, { wait: 300 })
  React.useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])
  return (
    <div className="w-full h-full flex flex-col items-stretch overflow-hidden">
      <div className='py-1'>
        {
          tabs.map(item => <Button key={item.symbol} onClick={() => tabChange(item.symbol)} variant="text" className={`normal-case text-sm min-w-0 px-3 ${item.symbol === symbol ? '' : 'text-[#8D8D8D]'}`}>{item.title}</Button>)
        }
      </div>
      <div className='overflow-hidden flex-1'>
        <div className='relative top-[-40px] left-[-1px] w-[calc(100%+1px)] h-[calc(100%+38px)]'>
          <div>
            <div id='naqchart-tradingview'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NAQChart