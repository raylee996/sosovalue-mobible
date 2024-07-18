import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useClearEffect } from "hooks/useClearEffect";
import { useMemoizedFn } from "ahooks";

export type MarketCapWSData = {
  data: MarketCap;
  event: WSEventName.MARKETCAP;
};
type MarketCap = {
  marketcap: number;
  rate: number;
};
type MarketCapWSOption = {
  onOpen?: () => void;
  onMarketCap?: (marketCap: MarketCap) => void;
};

export const useMarketCapWSData = (option?: MarketCapWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [marketCap, setMarketCap] = useState<MarketCap>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (marketCapWSData: MarketCapWSData) => {
    setMarketCap(marketCapWSData.data);
    option?.onMarketCap?.(marketCapWSData.data);
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.marketCap) {
        memoEvents.marketCap = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.MARKETCAP}}`);
      }
    });
  };
  msgEvent.marketCapEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    marketCap,
  };
};
