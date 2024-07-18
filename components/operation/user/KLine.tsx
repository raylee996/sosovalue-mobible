import React from 'react'
import Button from '@mui/material/Button'
import { TradingViewContext, Widget } from 'store/TradingViewStore'
import { useDebounceFn } from 'ahooks'

type Props = {
  symbol: string;
  interval:string,
  id:string
}

const KLine = ({ symbol,interval,id }: Props) => {
  const { tradingviewLoaded } = React.useContext(TradingViewContext)
  
  const tradingViewRef = React.useRef<Widget>()
  React.useEffect(() => {
    
    if (tradingviewLoaded) {
      // if(tradingViewRef.current){
      //   tradingViewRef.current?.iframe.contentWindow?.postMessage(
      //     {
      //       name: 'set-symbol',
      //       data: { symbol },
      //     },
      //     '*'
      //   )
      //   return 
      // }
        //@ts-ignore
        tradingViewRef.current = new window.TradingView.widget({
          container_id: id,
          width: "100%",
          height: "100%",
          autosize: true,
          symbol,
          interval: interval,
          timezone: "exchange",
          theme: "dark",
          backgroundColor: "#171717",
          //details: true,
          style: "1",
          // toolbar_bg: "#292929",
          // custom_css_url:`${location.origin}/tradingview-theme/theme.css`,
          // withdateranges: true,
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_side_toolbar: true,
          allow_symbol_change: false,
          save_image: false,
          details:true,
          //withdateranges:true,
          // studies: ["ROC@tv-basicstudies", "StochasticRSI@tv-basicstudies", "MASimple@tv-basicstudies"],
          // show_popup_button: true,
          // popup_width: "1000",
          // popup_height: "650",
          locale: "en",
          disabled_features: ['header_symbol_search', 'use_localstorage_for_settings', 'top_toolbar', 'side_toolbar'],
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
      //@ts-ignore
      
    }
  }, [tradingviewLoaded,symbol])
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
      <div className='flex-1'>
        <div id={id}></div>
      </div>
    </div>
  )
}

export default KLine