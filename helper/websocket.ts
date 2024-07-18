import { useState, useRef, useEffect } from 'react';
import { getWs } from 'helper/config'
const useWebsocket = (msg:any) => {
  let time: string | number | NodeJS.Timeout | undefined
  const ws = useRef<WebSocket | null>(null);
  // socket 数据
  const [wsData, setMessage] = useState<any>([]);
  //  socket 状态
  const [readyState, setReadyState] = useState<any>({ key: 0, value: '正在连接中' });

  const creatWebSocket = () => {
    const stateArr = [
      { key: 0, value: '正在连接中' },
      { key: 1, value: '已经连接并且可以通讯' },
      { key: 2, value: '连接正在关闭' },
      { key: 3, value: '连接已关闭或者没有连接成功' },
    ];
     
    try {
      ws.current = new WebSocket(getWs());
      
      ws.current.onopen = () => {
        for(let i = 0; i< msg.length; i++){

          sendMessage('{"method":"SUBSCRIBE","event":'+msg[i]+'}')
        }
        
        time = setInterval(function(){
          sendMessage('ping')
        },3000)
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onclose = () => {
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onerror = (error) => {
        clearInterval(time)
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      
      ws.current.onmessage = e => {
        const { data } = e
        
        if(e.data != 'pong'){
          setMessage(data) 
          //setMessage(JSON.parse((JSON.parse(data)))) 
        }

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
export default useWebsocket;
