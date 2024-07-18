import { useContext, useEffect, useState } from "react";
import { WSContext, WSEventName } from ".";
import { useClearEffect } from "hooks/useClearEffect";
import { useMemoizedFn } from "ahooks";

export type SectorWSData = {
  data: Sector[];
  event: WSEventName.SECTOR;
};
type Sector = {
  full_name: string;
  marketcap_sector: number;
  percentage: number;
  rate: number;
  sector_id: string;
  name: string;
};
type SectorWSOption = {
  onOpen?: () => void;
  onSector?: (sector: Sector[]) => void;
};

export const useSectorWSData = (option?: SectorWSOption) => {
  const { memoEvents, msgEvent, send, onOpen } = useContext(WSContext);
  const [sector, setSector] = useState<Sector[]>();
  const onOpenHandle = useMemoizedFn(() => option?.onOpen?.());
  const messageHandle = (sectorWSData: SectorWSData) => {
    setSector(sectorWSData.data);
    option?.onSector?.(sectorWSData.data);
  };
  const subscribe = () => {
    return onOpen(() => {
      if (!memoEvents.sector) {
        memoEvents.sector = true;
        send(`{"method":"SUBSCRIBE","event":${WSEventName.SECTOR}}`);
      }
    });
  };
  msgEvent.sectorEvent.useSubscription(messageHandle);
  useClearEffect(() => onOpen(onOpenHandle), []);
  useEffect(() => subscribe(), []);
  return {
    subscribe,
    sector,
  };
};
