import { useState, useRef, useEffect } from 'react';
import { getWs } from 'helper/config'

let websocket: WebSocket | null = null
const subscribedEvents: WSEventName[] = []
let time: string | number | NodeJS.Timeout | undefined

enum Source {
    BINANCE
}
enum Detection {
    PING = 'ping',
    PONG = 'pong'
}

type Options = {
    events: WSEventName[]
}

type DataFactory = {

}

type WSData = {
    priceData?: BinancePriceData;
    gweiData?: BinanceGweiData;
    openinteresData?: BinanceOpeninteresData[]
}

export enum WSEventName {
    PRICE = 'PRICE',
    GWEI = 'GWEI',
    OPENINTERES = 'OPENINTERES'
}
type BinancePriceWSData = {
    data: string;
    event: WSEventName.PRICE;
}
type BinancePriceData = {
    steam: string;
    data: API.MarketCap[];
}
type BinanceGweiWSData = {
    data: string;
    event: WSEventName.GWEI;
}
type BinanceGweiData = {
    message: string;
    result: {};
    status: string;
}
type BinanceOpeninteresWSData = {
    data: BinanceOpeninteresData[];
    event: WSEventName.OPENINTERES;
}
type BinanceOpeninteresData = {
    liquidationInfo: {};
    openInterest: {};
}
type BinanceWSData = BinancePriceWSData | BinanceGweiWSData | BinanceOpeninteresWSData
const createBinanceDataFactory = (ws: WebSocket) => {
    return {
        subscribe(events: WSEventName[]) {
            events.filter(event => !subscribedEvents.includes(event)).forEach(event => {
                ws.send(`{"method":"SUBSCRIBE","event":${event}}`)
            })
        },
        transform(dataStr: string) {
            const data = JSON.parse(dataStr) as BinanceWSData
            let priceData: BinancePriceData | undefined = undefined
            let gweiData: BinanceGweiData | undefined = undefined
            let openinteresData: BinanceOpeninteresData[] | undefined = undefined
            if (data.event === WSEventName.PRICE) {
                priceData = JSON.parse(data.data)
            } else if (data.event === WSEventName.GWEI) {
                gweiData = JSON.parse(data.data)
            } else if (data.event === WSEventName.OPENINTERES) {
                openinteresData = data.data
            }
            return { priceData, gweiData, openinteresData }
        },
        unsubscribe() {

        },
    }
}
const createDataFactory = (source: Source) => {
    if (source === Source.BINANCE) {
        return createBinanceDataFactory
    }
}
const useWebsocket = ({ events }: Options) => {
    // socket 数据
    const [data, setData] = useState<WSData>({});

    const connect = () => {
        if (!websocket) {
            websocket = new WebSocket(getWs());
            const { subscribe, transform } = createBinanceDataFactory(websocket)
            websocket.onopen = () => {
                subscribe(events)
                detect()
            };
            websocket.onclose = () => {
                console.log('close')
            };
            websocket.onerror = (error) => {
            };
            websocket.onmessage = e => {
                console.log(e.data != Detection.PONG)
                if (e.data != Detection.PONG) {
                    setData(transform(e.data))
                }
            };
        } else {
            console.log(websocket.readyState, WebSocket.OPEN)
            if (websocket.readyState === WebSocket.OPEN) {
                const dataFactory = createBinanceDataFactory(websocket)
                dataFactory.subscribe(events)
            }
        }
    };
    const detect = () => {
        time = setInterval(function () {
            websocket?.send(Detection.PING)
        }, 3000)
    }

    //  关闭 WebSocket
    const closeWebSocket = () => {
        clearInterval(time)
        websocket?.close();
        websocket = null
    };

    useEffect(() => {
        connect();
    }, []);

    return { data, closeWebSocket };
};
export default useWebsocket;
