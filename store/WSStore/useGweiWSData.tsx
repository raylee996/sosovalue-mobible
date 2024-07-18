import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useMemoizedFn } from "ahooks";
import { useClearEffect } from "hooks/useClearEffect";
import { jsonParse } from "helper/tools";

export type GweiWSData = {
  data: string;
  event: WSEventName.GWEI;
};
type Gwei = {
  FastGasPrice: string;
  LastBlock: string;
  ProposeGasPrice: string;
  SafeGasPrice: string;
  gasUsedRatio: string;
  suggestBaseFee: string;
};
type gwei = {
  suggestedMaxFeePerGas: string;
};
type GweiData = {
  message: string;
  result: Gwei;
  status: string;
  low: gwei;
};
type GweiWSOption = {
  onOpen?: () => void;
  onGwei?: (gwei: string) => void;
};

export const useGweiWSData = (option?: GweiWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [gwei, setGwei] = useState<string>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (gweiWSData: GweiWSData) => {
    const gweiData = jsonParse(gweiWSData.data) as GweiData;
    if (gweiData?.low?.suggestedMaxFeePerGas) {
      setGwei(gweiData.low.suggestedMaxFeePerGas);
      option?.onGwei?.(gweiData.low.suggestedMaxFeePerGas);
    }
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.gwei) {
        memoEvents.gwei = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.GWEI}}`);
      }
    });
  };
  msgEvent.gweiEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    gwei,
  };
};
