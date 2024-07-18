import { formatDecimal } from "helper/tools";
import { getCurrency } from "http/detail";
import { getCurrencyById, getPairMarketList } from "http/mobile";
import { useState, useEffect, useMemo } from "react";
import { KlinePeriod, useKlineWSData } from "store/WSStore/useKlineWSData";
import { usePriceWSData } from "store/WSStore/usePriceWSData";

export function useLiveValue(initValue?: any, liveValue?: any): number {
  const [value, setValue] = useState<number>(initValue || 0);
  useEffect(() => {
    if (liveValue !== undefined && liveValue !== null) {
      setValue(Number(liveValue));
    }
  }, [liveValue]);
  useEffect(() => {
    if (initValue !== undefined && initValue !== null && initValue !== "-") {
      setValue(Number(initValue));
    }
  }, [initValue]);
  return value;
}

export const usePrice = (
  initPrice?: string | number,
  livePrice?: string | number
) => {
  const [price, setPrice] = useState(initPrice || "");
  useEffect(() => {
    if (livePrice !== undefined && livePrice !== null) {
      setPrice(livePrice);
    }
  }, [livePrice]);
  useEffect(() => {
    if (initPrice !== undefined && initPrice !== null) {
      setPrice(initPrice);
    }
  }, [initPrice]);
  return price;
};
export const useChange = (
  initChange?: string | number,
  liveChange?: string | number
) => {
  const [price, setPrice] = useState(initChange || "");
  useEffect(() => {
    if (liveChange !== undefined && liveChange !== null) {
      setPrice(liveChange);
    }
  }, [liveChange]);
  useEffect(() => {
    if (initChange !== undefined && initChange !== null) {
      setPrice(initChange);
    }
  }, [initChange]);
  return price;
};

export const usePriceAndChange = (symbol?: {
  id: string;
  exchangeName: string;
  wsName: string;
}) => {
  const { klineData, subscribe1m } = useKlineWSData(
    symbol && {
      params: {
        exchangeName: symbol.exchangeName,
        wsName: symbol.wsName,
        period: KlinePeriod.OneMinute,
      },
    }
  );
  const [pairMarket, setPairMarket] = useState<any>();
  const price = useLiveValue(pairMarket?.price, klineData?.U);
  const change = useLiveValue(pairMarket?.change24Percent, klineData?.P);
  const roi1mo = useLiveValue(pairMarket?.roi1mo, klineData?.m);
  const roi1y = useLiveValue(pairMarket?.roi1y, klineData?.y);
  const changeConfig = useMemo(() => {
    const isRise = Number(change) > 0;
    return {
      price,
      priceStr: price ? `$${formatDecimal(String(price))}` : "0.0",
      change,
      isRise,
      str: `${isRise ? "+" : ""}${Number(change).toFixed(2)}%`,
    };
  }, [change, price]);
  const roiConfig = useMemo(() => {
    const localeRoi1y = Number(roi1y);
    const localeRoi1mo = Number(roi1mo);
    const isRoi1yRise = localeRoi1y > 0;
    const isRoi1moRise = localeRoi1mo > 0;
    return {
      roi1y: localeRoi1y,
      isRoi1yRise,
      roi1yStr: localeRoi1y
        ? `${isRoi1yRise ? "+" : ""}${localeRoi1y.toFixed(2)}%`
        : "-",
      roi1mo: localeRoi1mo,
      isRoi1moRise,
      roi1moStr: `${isRoi1moRise ? "+" : ""}${localeRoi1mo.toFixed(2)}%`,
    };
  }, [roi1mo, roi1y]);
  useEffect(() => {
    if (symbol?.id) {
      getCurrencyById(symbol.id).then((res) => {
        setPairMarket({
          price: res.data.currencyDataDoVO.symbolHandicap.uprice,
          change24Percent:
            res.data.currencyDataDoVO.symbolHandicap.change24hPercent,
          roi1mo: res.data.currencyDataDoVO.mroi,
          roi1y: res.data.currencyDataDoVO.yroi,
        });
      });
    }
  }, [symbol?.id]);
  return {
    roi1mo,
    roi1y,
    price,
    change,
    market: pairMarket,
    changeConfig,
    roiConfig,
  };
};
