import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useClearEffect } from "hooks/useClearEffect";
import { useMemoizedFn } from "ahooks";

export type ETFPremDscWSData = {
  data: Record<string, ETFPremDsc>;
  event: WSEventName.ETF_PREM_DSC;
  type: string;
};
type ETFPremDsc = {
  mktPrice: number;
  dailyChg: number;
  premDsc: number;
  dailyVol?: number;
  volTraded: number;
  turnoverRate: number;
  time: number;
  ws: number;
};
type ETFPremDscWSOption = {
  onOpen?: () => void;
  onETFPremDsc?: (etfPremDsc: Record<string, ETFPremDsc>) => void;
};

export const useETFPremDscWSData = (option?: ETFPremDscWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [etfPremDsc, setETFPremDsc] = useState<ETFPremDsc>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (etfPremDscWSData: ETFPremDscWSData) => {
    option?.onETFPremDsc?.(etfPremDscWSData.data);
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.etfPremDsc) {
        memoEvents.etfPremDsc = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.ETF_PREM_DSC}}`);
      }
    });
  };
  msgEvent.etfPremDscEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    etfPremDsc,
  };
};
