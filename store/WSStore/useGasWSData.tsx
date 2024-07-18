import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useMemoizedFn } from "ahooks";
import { useClearEffect } from "hooks/useClearEffect";

export type GasWSData = {
  data: GasData;
  event: WSEventName.GAS;
};

type GasData = {
  medianFee: string;
};

type GasWSOption = {
  onOpen?: () => void;
  onGas?: (gas: string) => void;
};

export const useGasWSData = (option?: GasWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [gas, setGas] = useState<string>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (gasWSData: GasWSData) => {
    const gasData = JSON.parse(JSON.stringify(gasWSData.data)) as GasData;
    if (gasData?.medianFee) {
      setGas(gasData.medianFee);
      option?.onGas?.(gasData.medianFee);
    }
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.gas) {
        memoEvents.gas = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.GAS}}`);
      }
    });
  };
  msgEvent.gasEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    gas,
  };
};
