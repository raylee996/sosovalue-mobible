import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useMemoizedFn } from "ahooks";
import { useClearEffect } from "hooks/useClearEffect";

export type CurrencyWSData = {
  data: Currency;
  event: WSEventName.CURRENCY_VOLUME;
  e: string;
  platformId: string;
};
type Currency = Record<
  string,
  {
    E: number;
    P: string;
    c: number;
    m: string;
    price1m: number;
    price1y: number;
    price24h: number;
    y: string;
  }
>;
type CurrencyWSOption = {
  onOpen?: () => void;
  onCurrency?: (currency: Currency) => void;
};

export const useCurrencyWSData = (option?: CurrencyWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [currency, setCurrency] = useState<Currency>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (currencyWSData: CurrencyWSData) => {
    setCurrency(currencyWSData.data);
    option?.onCurrency?.(currencyWSData.data);
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.currency) {
        memoEvents.currency = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.CURRENCY_VOLUME}}`);
      }
    });
  };
  msgEvent.currencyEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    currency,
  };
};
