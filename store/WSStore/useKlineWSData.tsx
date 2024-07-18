import { useContext, useEffect, useMemo, useState } from "react";
import { WSContext, WSEventName } from ".";
import React from "react";
import { useMemoizedFn } from "ahooks";
import { useClearEffect } from "hooks/useClearEffect";
import dayjs from "dayjs";

export type KlineWSData = {
  event: WSEventName.KLINE;
  type: KlinePeriod;
  data: Record<string, KLineData>;
};
export type KLineData = {
  P: string;
  U: number;
  c: number;
  e: string;
  h: number;
  l: number;
  m: string;
  mv: number;
  o: number;
  p: number;
  s: string;
  v: number;
  we: number;
  ws: number;
  y: string;
};
export enum KlinePeriod {
  OneMinute = "1m",
  FiveMinute = "5m",
  FifteenMinute = "15m",
  OneHour = "1h",
  FourHour = "4h",
  OneDay = "1d",
  OneWeek = "1w",
  OneMonth = "1mo",
}

type Symbol = { exchangeName: string; wsName: string };

type Params = Symbol & { period: KlinePeriod };

type KlineDataMap = Record<string, KLineData>;

type OnKlineDataMapHandle = (data: KlineDataMap) => void;

type KlineWSOption = {
  params?: Params;
  onOpen?: () => void;
  onKlineData?: (data: KLineData) => void;
  onKlineWSData?: (data: KlineWSData) => void;
  onKlineDataMap1m?: OnKlineDataMapHandle;
  onKlineDataMap5m?: OnKlineDataMapHandle;
  onKlineDataMap15m?: OnKlineDataMapHandle;
  onKlineDataMap1h?: OnKlineDataMapHandle;
  onKlineDataMap4h?: OnKlineDataMapHandle;
  onKlineDataMap1d?: OnKlineDataMapHandle;
  onKlineDataMap1w?: OnKlineDataMapHandle;
  onKlineDataMap1M?: OnKlineDataMapHandle;
};

export const useKlineWSData = (option?: KlineWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const paramsMsg = useMemo(() => {
    if (option?.params) {
      const { exchangeName, wsName, period } = option.params;
      return `${exchangeName}@${wsName}@${period}`;
    }
  }, [
    option?.params?.exchangeName,
    option?.params?.wsName,
    option?.params?.period,
  ]);
  const [klineData, setKlineData] = React.useState<KLineData>();

  const [klineWSData, setKlineWSData] = React.useState<KlineWSData>();

  const [klineDataMap1m, setKlineDataMap1m] = useState<KlineDataMap>();
  const [klineDataMap5m, setKlineDataMap5m] = useState<KlineDataMap>();
  const [klineDataMap15m, setKlineDataMap15m] = useState<KlineDataMap>();
  const [klineDataMap1h, setKlineDataMap1h] = useState<KlineDataMap>();
  const [klineDataMap4h, setKlineDataMap4h] = useState<KlineDataMap>();
  const [klineDataMap1d, setKlineDataMap1d] = useState<KlineDataMap>();
  const [klineDataMap1w, setKlineDataMap1w] = useState<KlineDataMap>();
  const [klineDataMap1M, setKlineDataMap1M] = useState<KlineDataMap>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (klineWSData: KlineWSData) => {
    setKlineWSData(klineWSData);

    if (paramsMsg) {
      const klineData =
        klineWSData.data[paramsMsg.replace(`@${klineWSData.type}`, "")];
      if (klineData) {
        setKlineData(klineData);

        option?.onKlineData?.(klineData);
      }
    }
    option?.onKlineWSData?.(klineWSData);
    if (klineWSData.type === KlinePeriod.OneMinute) {
      setKlineDataMap1m(klineWSData.data);
      option?.onKlineDataMap1m?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.FiveMinute) {
      setKlineDataMap5m(klineWSData.data);
      option?.onKlineDataMap5m?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.FifteenMinute) {
      setKlineDataMap15m(klineWSData.data);
      option?.onKlineDataMap15m?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.OneHour) {
      setKlineDataMap1h(klineWSData.data);
      option?.onKlineDataMap1h?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.FourHour) {
      setKlineDataMap4h(klineWSData.data);
      option?.onKlineDataMap4h?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.OneDay) {
      setKlineDataMap1d(klineWSData.data);
      option?.onKlineDataMap1d?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.OneWeek) {
      setKlineDataMap1w(klineWSData.data);
      option?.onKlineDataMap1w?.(klineWSData.data);
    } else if (klineWSData.type === KlinePeriod.OneMonth) {
      console.log(klineWSData);
      setKlineDataMap1M(klineWSData.data);
      option?.onKlineDataMap1M?.(klineWSData.data);
    }
  };
  msgEvent.klineEvent.useSubscription(messageHandle);
  const checkIsNeedSub = (params: string) => {
    const klineMemo = memoEvents.kline;
    const count = klineMemo[params] || 0;
    klineMemo[params] = count + 1;
    return !count;
  };
  const checkIsNeedCancel = (params: string) => {
    const klineMemo = memoEvents.kline;
    const count = (klineMemo[params] || 0) - 1;
    klineMemo[params] = count < 0 ? 0 : count;
    return count <= 0;
  };

  function subscribePeriod<T extends Symbol | Symbol[] | any[]>(
    target: T,
    period: KlinePeriod,
    transform?: (item: T) => { exchangeName: string; wsName: string }
  ) {
    const list = Array.isArray(target) ? target : [target];
    const onOpenClear = onOpen(() => {
      const msgList: string[] = [];
      list.forEach((item) => {
        const { exchangeName, wsName } = transform?.(item) || item;
        const params = `${exchangeName}@${wsName}@${period}`;
        if (checkIsNeedSub(params)) {
          msgList.push(params);
        }
      });
      if (msgList.length) {
        const msg = JSON.stringify(msgList);

        send(
          `{"method":"SUBSCRIBE","event":${WSEventName.KLINE}, "params": ${msg}}`
        );
      }
    });
    const clear = () => {
      onOpenClear();
      const msgList: string[] = [];
      list.forEach((item) => {
        const { exchangeName, wsName } = transform?.(item) || item;
        const params = `${exchangeName}@${wsName}@${period}`;
        if (checkIsNeedCancel(params)) {
          msgList.push(params);
        }
      });
      if (msgList.length) {
        const msg = JSON.stringify(msgList);
        send(
          `{"method":"CANCEL","event":${WSEventName.KLINE}, "params": ${msg}}`
        );
      }
    };
    return clear;
  }

  const subscribe = (params: Params) => {
    return subscribePeriod(params, params.period);
  };

  const createSubscribePeriod = (period: KlinePeriod) => {
    function subscribe(symbol: Symbol | Symbol[]): () => void;
    function subscribe<T>(
      data: T[],
      transform: (data: T) => Symbol
    ): () => void;
    function subscribe<T extends Symbol | T[]>(
      data: T,
      transform?: (data: T) => Symbol
    ) {
      return subscribePeriod(data, period, transform);
    }
    return subscribe;
  };

  const subscribe1m = createSubscribePeriod(KlinePeriod.OneMinute);
  const subscribe5m = createSubscribePeriod(KlinePeriod.FiveMinute);
  const subscribe15m = createSubscribePeriod(KlinePeriod.FifteenMinute);
  const subscribe1h = createSubscribePeriod(KlinePeriod.OneHour);
  const subscribe4h = createSubscribePeriod(KlinePeriod.FourHour);
  const subscribe1d = createSubscribePeriod(KlinePeriod.OneDay);
  const subscribe1w = createSubscribePeriod(KlinePeriod.OneWeek);
  const subscribe1M = createSubscribePeriod(KlinePeriod.OneMonth);

  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => {
    let clear: (() => void) | undefined;
    if (paramsMsg) {
      clear = subscribe(option!.params!);
    }
    return () => {
      clear && clear();
    };
  }, [paramsMsg]);

  return {
    klineData,
    klineWSData,
    klineDataMap1m,
    klineDataMap5m,
    klineDataMap15m,
    klineDataMap1h,
    klineDataMap4h,
    klineDataMap1d,
    klineDataMap1w,
    klineDataMap1M,
    subscribe,
    subscribe1m,
    subscribe5m,
    subscribe15m,
    subscribe1h,
    subscribe4h,
    subscribe1d,
    subscribe1w,
    subscribe1M,
  };
};
