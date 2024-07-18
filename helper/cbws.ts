import { useState, useRef, useEffect } from 'react';
import { getWs } from 'helper/config'
import CryptoJS from 'crypto-js'
const cbWebsocket = () => {
  let time: string | number | NodeJS.Timeout | undefined
  const ws = useRef<WebSocket | null>(null);
  // socket 数据
  const [wsData, setMessage] = useState<any>([]);
  //  socket 状态
  const [readyState, setReadyState] = useState<any>({ key: 0, value: '正在连接中' });
  const SIGNING_KEY = 'v3zfE9s1VKVwmXhU';
  const API_KEY = 'aXApptW4O9aF3dyLfnyLS4IKM2NU2TuO';
  const CHANNEL_NAMES = {
    level2: 'level2',
    user: 'user',
    tickers: 'ticker',
    ticker_batch: 'ticker_batch',
    status: 'status',
    market_trades: 'market_trades',
   };
   
  const creatWebSocket = () => {
    const stateArr = [
      { key: 0, value: '正在连接中' },
      { key: 1, value: '已经连接并且可以通讯' },
      { key: 2, value: '连接正在关闭' },
      { key: 3, value: '连接已关闭或者没有连接成功' },
    ];
    function sign(str:any, secret:any) {
      const hash = CryptoJS.HmacSHA256(str, secret);
      return hash.toString();
     }
     function timestampAndSign(message:any, channel:any, products = []) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const strToSign = `${timestamp}${channel}${products.join(',')}`;
      console.log(strToSign)
      const sig = sign(strToSign, SIGNING_KEY);
      return { ...message, signature: sig, timestamp: timestamp };
     }
     function subscribeToProducts(products:any, channelName:any, ws:any) {
      const message = {
        type: 'subscribe',
        channel: channelName,
        api_key: API_KEY,
        product_ids: products,
      };
      const subscribeMsg = timestampAndSign(message, channelName, products);
      sendMessage(JSON.stringify(subscribeMsg));
     }
     
    try {
      ws.current = new WebSocket('wss://advanced-trade-ws.coinbase.com');
      
      ws.current.onopen = () => {
        // for(let i = 0; i< msg.length; i++){

        //   sendMessage('{"method":"SUBSCRIBE","event":'+msg[i]+'}')
        // }
        const products = ['BTC-USD'];
        subscribeToProducts(products, CHANNEL_NAMES.user, ws.current);
         
        
        time = setInterval(function(){
          sendMessage('ping')
        },3000)
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onclose = () => {
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onerror = (error:any) => {
        clearInterval(time)
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      
      ws.current.onmessage = (e:any) => {
        const { data } = e
        console.log(data)
        // if(e.data != 'pong'){
        //   setMessage(data) 
        //   //setMessage(JSON.parse((JSON.parse(data)))) 
        // }

      };
    } catch (error) {
      //console.log(error);
    }
  };

  const webSocketInit = () => {
    
    if (!ws.current || ws.current.readyState === 3) {
      creatWebSocket();
    }
  };

  //  关闭 WebSocket
  const closeWebSocket = () => {
    clearInterval(time)
    ws.current?.close();
  };

  

  // 发送数据
  const sendMessage = (str: string) => {
    
    if(ws.current?.readyState === 1){
        ws.current?.send(str);
    }
  };

  //重连
  const reconnect = () => {
    try {
      closeWebSocket();
      ws.current = null;
      setTimeout(function(){
        creatWebSocket();
      },1000)
      
    } catch (e) {
      //console.log(e);
    }
  };

  useEffect(() => {
    webSocketInit();
    return () => {
      ws.current?.close();
    };
  }, [ws]);

  //    wsData （获得的 socket 数据）、readyState（当前 socket 状态）、closeWebSocket （关闭 socket）、reconnect（重连）
  return {
    wsData,
    readyState,
    closeWebSocket,
    reconnect,
    sendMessage,
  };
};
export default cbWebsocket
