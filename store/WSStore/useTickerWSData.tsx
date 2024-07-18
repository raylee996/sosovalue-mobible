import { useContext } from "react";
import { WSContext, WSEventName } from ".";
import React from "react";
import { useClearEffect } from "hooks/useClearEffect";
import { useMemoizedFn } from "ahooks";

export type TickerWSData = {
  data: Record<string, Market.PairMarket>;
  event: WSEventName.EtfTicker;
  e: PricePeriod;
  t: string;
};
export enum PricePeriod {
  All = "ALL",
  OneDay = "1dTicker",
  FourHour = "4hTicker",
  OneHour = "1hTicker",
}
type PriceWSOption = {
  onOpen?: () => void;
  onPriceData?: (data: TickerWSData) => void;
  onPrice1h?: (data: Record<string, Market.PairMarket>) => void;
  onPrice4h?: (data: Record<string, Market.PairMarket>) => void;
  onPrice1d?: (data: Record<string, Market.PairMarket>) => void;
};

export const useTickerWSData = (option?: PriceWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [priceData, setPriceData] = React.useState<TickerWSData>();
  const [price1h, setPrice1h] =
    React.useState<Record<string, Market.PairMarket>>();
  const [price4h, setPrice4h] =
    React.useState<Record<string, Market.PairMarket>>();
  const [price1d, setPrice1d] =
    React.useState<Record<string, Market.PairMarket>>();

  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());

  const messageHandle = (priceData: TickerWSData) => {
    if (priceData?.e === PricePeriod.OneHour) {
      setPrice1h(priceData.data);
      option?.onPrice1h?.(priceData.data);
    } else if (priceData?.e === PricePeriod.FourHour) {
      setPrice4h(priceData.data);
      option?.onPrice4h?.(priceData.data);
    } else if (priceData?.e === PricePeriod.OneDay) {
      setPrice1d(priceData.data);
      option?.onPrice1d?.(priceData.data);
    }
    setPriceData(priceData);
    option?.onPriceData?.(priceData);
  };
  msgEvent.tickerEvent.useSubscription(messageHandle);
  const checkIsNeedSub = (params: string) => {
    const priceMemo = memoEvents.price;
    const allParams = params.replace(/@\w+$/, "@ALL");
    const allCount = priceMemo[allParams] || 0;
    const count = priceMemo[params] || 0;
    priceMemo[params] = count + 1;
    return !allCount && !count;
  };
  const checkIsNeedCancel = (params: string) => {
    const priceMemo = memoEvents.price;
    const allParams = params.replace(/@\w+$/, "@ALL");
    const allCount = priceMemo[allParams] || 0;
    const count = priceMemo[params] || 0;
    priceMemo[params] = count - 1;
    return count > 0 && allCount <= 0;
  };
  const subscribe = (params: string | string[]) => {
    const paramsList = Array.isArray(params) ? params : [params];
    const onOpenClear = onOpen(() => {
      const msgList = paramsList.filter((params) => checkIsNeedSub(params));
      if (msgList && msgList.length >= 0) {
        const params = JSON.stringify(msgList);
        send(
          `{"method":"SUBSCRIBE","event":${WSEventName.EtfTicker}, "params": ${params}}`
        );
      }
    });
    const clear = () => {
      onOpenClear();
      const msgList = paramsList.filter((params) => checkIsNeedCancel(params));
      if (msgList.length >= 0) {
        // todo
      }
    };
    return clear;
  };
  function subscribePeriod<T>(
    pairs: T[],
    callback: (pair: T) => { exchangeName: string },
    period: PricePeriod
  ) {
    const createMsgList = () => {
      const msgList: string[] = [];
      pairs.forEach((pair) => {
        const { exchangeName } = callback(pair);
        const params = `${exchangeName}@tiker`;
        if (checkIsNeedSub(params)) {
          msgList.push(params);
        }
      });
      return msgList;
    };
    const onOpenClear = onOpen(() => {
      const msgList = createMsgList();
      if (msgList.length >= 0) {
        const params = JSON.stringify(msgList);
        send(
          `{"method":"SUBSCRIBE","event":${WSEventName.EtfTicker}, "params": ${params}}`
        );
      }
    });
    const clear = () => {
      onOpenClear();
      const msgList = createMsgList();
      if (msgList.length >= 0) {
        // todo
      }
    };
    return clear;
  }
  function subscribe1d<T>(
    pairs: T[],
    callback: (pair: T) => { exchangeName: string }
  ) {
    return subscribePeriod(pairs, callback, PricePeriod.OneDay);
  }
  useClearEffect(() => onOpen(onOpenHandle), []);
  return {
    priceData,
    price1d,
    price1h,
    price4h,
    subscribe,
    subscribe1d,
  };
};
