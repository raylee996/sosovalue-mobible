import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useClearEffect } from "hooks/useClearEffect";
import { useMemoizedFn } from "ahooks";

export type OpeninteresWSData = {
  data: OpeninteresData;
  event: WSEventName.OPENINTERES;
};
type OpeninteresData = Record<string, OpeninteresItem>;
type OpeninteresItem = {
  liquidationInfo: {
    amount: number;
    longVolUsd: number;
    number: number;
    shortVolUsd: number;
    symbol: string;
    symbolLogo: string;
    totalVolUsd: number;
  };
  openInterest: {
    longAccount: number;
    longShortRatio: number;
    openInterest: number;
    shortAccount: number;
    sumOpenInterest: number;
    sumOpenInterestValue: number;
    symbol: string;
    time: number;
  };
  takerBuySellVolume: string;
};
type OpeninteresWSOption = {
  onOpen?: () => void;
  onOpeninteres?: (openinteres: OpeninteresData) => void;
};

export const useOpeninteresWSData = (option?: OpeninteresWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [openinteres, setOpeninteres] = useState<OpeninteresData>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (openinteresWSData: OpeninteresWSData) => {
    setOpeninteres(openinteresWSData.data);
    option?.onOpeninteres?.(openinteresWSData.data);
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.openinteres) {
        memoEvents.openinteres = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.OPENINTERES}}`);
      }
    });
  };
  msgEvent.openinteresEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    openinteres,
  };
};
