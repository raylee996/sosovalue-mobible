import React, { useEffect, useMemo, useState } from "react";
import { getWs } from "helper/config";
import {
  useEventEmitter,
  useIsomorphicLayoutEffect,
  useMemoizedFn,
  useCreation,
  useDocumentVisibility,
  useUpdateEffect,
} from "ahooks";
import { decodeAndDecompress } from "helper/pako";
import { PriceWSData } from "./usePriceWSData";
import { TickerWSData } from "./useTickerWSData";
import { HkTickerWSData } from "./useHkTickerWSData";
import { KlineWSData } from "./useKlineWSData";
import { GweiWSData } from "./useGweiWSData";
import { GasWSData } from "./useGasWSData";
import { OpeninteresWSData } from "./useOpeninteresWSData";
import { SectorWSData } from "./useSectorWSData";
import { MarketCapWSData } from "./useMarketCapWSData";
import { CurrencyWSData } from "./useCurrencyWSData";
import { ETFPremDscWSData } from "./useETFPremDscWSData";
import { debugWS } from "./debugWS";
import { errorToJSON } from "next/dist/server/render";

type MemoEvents = {
  price: Record<string, number>;
  kline: Record<string, number>;
  gwei: boolean;
  gas: boolean;
  openinteres: boolean;
  sector: boolean;
  marketCap: boolean;
  currency: boolean;
  etfPremDsc: boolean;
};
type WSContext = {
  open: boolean;
  memoEvents: MemoEvents;
  msgEvent: ReturnType<typeof useMsgEvent>;
  send: (msg: string) => void;
  onOpen: (dep: () => void) => () => void;
};

const createInitMemoEvents = (): MemoEvents => ({
  price: {},
  kline: {},
  gwei: false,
  gas: false,
  openinteres: false,
  sector: false,
  marketCap: false,
  currency: false,
  etfPremDsc: false,
});
export const WSContext = React.createContext<WSContext>({
  memoEvents: createInitMemoEvents(),
} as WSContext);
enum Detection {
  PING = "ping",
  PONG = "pong",
}

export enum WSEventName {
  GWEI = "GWEI",
  GAS = "GAS",
  OPENINTERES = "OPENINTERES",
  KLINE = "KLINE",
  MARKETCAP = "MARKETCAP", //市值数据推送
  SECTOR = "SECTOR", //市值数据推送
  CURRENCY_VOLUME = "CURRENCY_VOLUME", // 币种相关数据
  TICKER24 = "24TICKER",
  HKEtfTicker = "HKEtfTicker",
  EtfTicker = "EtfTicker",
  ETF_PREM_DSC = "ETFPremDsc",
}

export type WSData =
  | PriceWSData
  | TickerWSData
  | HkTickerWSData
  | GweiWSData
  | GasWSData
  | OpeninteresWSData
  | SectorWSData
  | MarketCapWSData
  | CurrencyWSData
  | KlineWSData
  | ETFPremDscWSData

const useMsgEvent = () => {
  const priceEvent = useEventEmitter<PriceWSData>();
  const tickerEvent = useEventEmitter<TickerWSData>();
  const hkTickerEvent = useEventEmitter<HkTickerWSData>();
  const klineEvent = useEventEmitter<KlineWSData>();
  const gweiEvent = useEventEmitter<GweiWSData>();
  const gasEvent = useEventEmitter<GasWSData>();
  const openinteresEvent = useEventEmitter<OpeninteresWSData>();
  const sectorEvent = useEventEmitter<SectorWSData>();
  const marketCapEvent = useEventEmitter<MarketCapWSData>();
  const currencyEvent = useEventEmitter<CurrencyWSData>();
  const etfPremDscEvent = useEventEmitter<ETFPremDscWSData>();
  const emit = useMemoizedFn((wsData: WSData) => {
    if (wsData.event === WSEventName.TICKER24) {
      priceEvent.emit(wsData);
    } else if (wsData.event === WSEventName.EtfTicker) {
      tickerEvent.emit(wsData);
    } else if (wsData.event === WSEventName.HKEtfTicker) {
      hkTickerEvent.emit(wsData);
    } else if (wsData.event === WSEventName.KLINE) {
      klineEvent.emit(wsData);
    } else if (wsData.event === WSEventName.GWEI) {
      gweiEvent.emit(wsData);
    } else if (wsData.event === WSEventName.GAS) {
      gasEvent.emit(wsData);
    } else if (wsData.event === WSEventName.OPENINTERES) {
      openinteresEvent.emit(wsData);
    } else if (wsData.event === WSEventName.SECTOR) {
      sectorEvent.emit(wsData);
    } else if (wsData.event === WSEventName.MARKETCAP) {
      marketCapEvent.emit(wsData);
    } else if (wsData.event === WSEventName.CURRENCY_VOLUME) {
      currencyEvent.emit(wsData);
    } else if (wsData.event === WSEventName.ETF_PREM_DSC) {
      etfPremDscEvent.emit(wsData);
    }
    debugWS(wsData);
  });
  return useMemo(
    () => ({
      emit,
      priceEvent,
      tickerEvent,
      klineEvent,
      hkTickerEvent,
      gweiEvent,
      gasEvent,
      openinteresEvent,
      sectorEvent,
      marketCapEvent,
      currencyEvent,
      etfPremDscEvent,
    }),
    []
  );
};

const WSStore = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const openDeps = useCreation(() => new Set<() => void>(), []);
  const onOpen = (dep: () => void) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      dep();
    }
    openDeps.add(dep);
    return () => {
      openDeps.delete(dep);
    };
  };
  const msgEvent = useMsgEvent();
  let memoEvents = useCreation(() => createInitMemoEvents(), []);

  const wsRef = React.useRef<WebSocket | null>(null);
  const timer = React.useRef<number>(-1);

  const send = (msg: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.send(msg);
    }
  };

  const bootstrap = () => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket(getWs());
      wsRef.current.binaryType = "arraybuffer";
      wsRef.current.onopen = () => {
        setOpen(true);
        openDeps.forEach((dep) => dep());
        detect();
      };
      wsRef.current.onclose = () => {
        setOpen(false);
        reset();
        if (document.visibilityState === "visible") {
          bootstrap();
        }
        console.log("ws close");
      };
      wsRef.current.onerror = (error) => {
        setOpen(false);
        reset();
        console.log(error);
      };
      wsRef.current.onmessage = async (e) => {
        if (e.data != Detection.PONG) {
          const msg = decodeAndDecompress(e.data);
          const data = JSON.parse(msg) as WSData;
          msgEvent.emit(data);
        }
      };
    }
  };
  const reset = () => {
    Object.assign(memoEvents, createInitMemoEvents());
    clearInterval(timer.current);
    timer.current = -1;
    wsRef.current = null;
  };
  const close = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.close();
    }
    reset();
  };
  const detect = () => {
    timer.current = window.setInterval(function () {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current?.send(Detection.PING);
      }
    }, 60000);
  };

  const value = React.useMemo(
    () => ({
      open,
      memoEvents,
      msgEvent,
      onOpen,
      send,
      close,
    }),
    [open]
  );
  useEffect(() => {
    bootstrap();
    const visibilitychange = () => {
      if (
        document.visibilityState === "visible" &&
        wsRef.current?.readyState !== WebSocket.OPEN &&
        wsRef.current?.readyState !== WebSocket.CONNECTING
      ) {
        reset();
        bootstrap();
      }
    };
    document.addEventListener("visibilitychange", visibilitychange);
    return () => {
      document.removeEventListener("visibilitychange", visibilitychange);
    };
  }, []);
  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
};

export default WSStore;

export const useWSState = () => {
  const { open } = React.useContext(WSContext);
  return open;
};
