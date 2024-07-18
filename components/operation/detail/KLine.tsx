import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  init,
  Chart,
  dispose,
  TooltipShowType,
  CandleTooltipCustomCallbackData,
  CandleStyle,
  TooltipData,
  Nullable,
  LineType,
  CandleType,
  getSupportedFigures,
  registerFigure,
  getFigureClass,
  FormatDateType,
  TooltipShowRule,
} from "klinecharts";
import { getKlineData } from "http/kline";
import Button from "@mui/material/Button";
import Image from "next/image";
import {
  KLineData,
  useKlineWSData,
  KlinePeriod,
} from "store/WSStore/useKlineWSData";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import { formatDecimalKline, formatDecimal } from "helper/tools";
import { useThemeStore } from "store/useThemeStore";

type PeriodOption = {
  value: KlinePeriod;
  label?: string;
};

type history = {
  close: number;
  low: number;
  open: number;
  high: number;
  volume: number;
  timestamp: number;
};
const periods: PeriodOption[] = [
  {
    value: KlinePeriod.OneMinute,
  },
  {
    value: KlinePeriod.FiveMinute,
  },
  {
    value: KlinePeriod.FifteenMinute,
  },
  {
    value: KlinePeriod.OneHour,
  },
  {
    value: KlinePeriod.FourHour,
  },
  {
    value: KlinePeriod.OneDay,
  },
  {
    value: KlinePeriod.OneWeek,
  },
  {
    value: KlinePeriod.OneMonth,
    label: "1M",
  },
];

// const indicators = ['MA', 'EMA', 'SMA', 'BBI', 'VOL', 'MACD', 'BOLL', 'KDJ', 'RSI', 'BIAS', 'BRAR', 'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV', 'SAR', 'AO', 'ROC', 'PVT', 'AVP']

const overlapIndicators = ["MA", "EMA", "BOLL", "SAR"];
const underIndicators = [
  "MACD",
  "KDJ",
  "RSI",
  "OBV",
  "TRIX",
  "DMA",
  "VR",
  "DMI",
  "EMV",
  "WR",
  "MTM",
  "CCI",
];

type Props = {
  showPeriods?: boolean;
  showIndicator?: boolean;
  showIndicators?: boolean;
  defaultPeriod?: KlinePeriod;
  symbol?: {
    icon?: string;
    symbolId: string;
    exchangeId: string;
    wsName: string;
    baseAsset?: string;
    quoteAsset?: string;
    exchangeName?: string;
  };
};

const KLine = ({
  symbol,
  defaultPeriod,
  showPeriods,
  showIndicator,
  showIndicators,
}: Props) => {
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useThemeStore();
  const chartRef = useRef<Chart | null>(null);
  const [overlapIndicator, setOverlapIndicator] = useState<string>();
  const [underIndicator, setUnderIndicator] = useState<string>();
  const defaultPeriodValue = periods.find(
    (period) => period.value === defaultPeriod
  );
  const [period, setPeriod] = useState(defaultPeriodValue || periods[4]);
  const klineDataParams = useMemo(() => {
    if (symbol) {
      const { exchangeName, wsName } = symbol;
      return `${exchangeName}@${wsName}@${period.value}`;
    }
  }, [symbol, period]);
  useKlineWSData({
    params: symbol && {
      exchangeName: symbol.exchangeName!,
      wsName: symbol.wsName,
      period: period.value,
    },
    onKlineData(klineData) {
      const { c, o, h, l, v, ws } = klineData;
      chartRef.current?.updateData({
        timestamp: ws,
        high: +formatDecimalKline(h + ""),
        open: +formatDecimalKline(o + ""),
        low: +formatDecimalKline(l + ""),
        close: +formatDecimalKline(c + ""),
        volume: v,
      });
    },
  });
  const onPeriodChange = (period: PeriodOption) => {
    setPeriod(period);
    initData({ period: period.value });
  };
  const onOverlapIndicatorChange = (newOverlapIndicator: string) => {
    if (overlapIndicator) {
      chartRef.current?.removeIndicator("candle_pane", overlapIndicator);
    }
    if (newOverlapIndicator !== overlapIndicator) {
      chartRef.current?.createIndicator(newOverlapIndicator, true, {
        id: "candle_pane",
      });
      setOverlapIndicator(newOverlapIndicator);
    } else {
      setOverlapIndicator(undefined);
    }
  };
  const onUnderIndicatorChange = (newUnderIndicator: string) => {
    if (underIndicator) {
      chartRef.current?.removeIndicator(
        `under_indicator_${underIndicator}`,
        underIndicator
      );
    }
    if (newUnderIndicator !== underIndicator) {
      chartRef.current?.createIndicator(newUnderIndicator, true, {
        id: `under_indicator_${newUnderIndicator}`,
      });
      setUnderIndicator(newUnderIndicator);
    } else {
      setUnderIndicator(undefined);
    }
  };
  const calcPricePrecision = (close: number) => {
    const numString = String(formatDecimal(close + ""));
    const [leftNum, rightNum] = numString.split(".");
    const leftCount = leftNum.length;
    const rightCount = rightNum?.length || 0;

    return rightCount;
    // if (leftCount >= 2) {
    //     return 2
    // } else if (Number(leftNum) > 0) {
    //     return 4
    // } else if (leftCount >= 1) {
    //     return 4
    // } else if (rightNum && parseInt(rightNum.slice(0, 4)) > 1) {
    //     return 4
    // } else {
    //     return 8
    // }
  };
  const initData = (newParams?: {
    period?: string;
    minTime?: number;
    direct?: number;
  }) => {
    getData(newParams).then((data) => {
      chartRef.current!.applyNewData(data, !!data.length);
      chartRef.current!.setBarSpace(data.length < 50 ? 30 : 6);
      chartRef.current!.setPriceVolumePrecision(
        calcPricePrecision(data[data.length - 1].close),
        2
      );
      //chartRef.current!.setPriceVolumePrecision(calcPricePrecision(data[data.length-1].close), 2)
    });
    chartRef.current!.loadMore((timestamp: Nullable<number>) => {
      if (timestamp) {
        getData({ ...newParams, minTime: timestamp, direct: -1 }).then(
          (data) => {
            chartRef.current?.applyMoreData(data, !!data.length);
          }
        );
      }
    });
  };
  const getData = async (newParams?: {
    period?: string;
    minTime?: number;
    direct?: number;
  }) => {
    if (!symbol) {
      return [];
    }
    const { symbolId, exchangeId } = symbol;
    const params = {
      exchangeId,
      // exchangeId: '1667048073731874822',
      symbolId,
      // symbolId: '1685954618722557956',
      limit: 500,
      period: period.value,
      ...newParams,
    };
    const res = await getKlineData(params);
    const historyData = res.data.map(
      ([timestamp, high, open, low, close, volume]) => {
        return {
          timestamp: +timestamp,
          high: +formatDecimalKline(high),
          open: +formatDecimalKline(open),
          low: +formatDecimalKline(low),
          close: +formatDecimalKline(close),
          volume: +volume,
        };
      }
    );

    return historyData;
  };
  const initChart = () => {
    chartRef.current = init(chartDivRef.current!, {
      styles: {
        grid: {
          horizontal: {
            show: true,
            size: 1,
            color: theme === "dark" ? "#171717" : "#F5F5F5",
            style: LineType.Solid,
          },
          vertical: {
            show: true,
            size: 1,
            color: theme === "dark" ? "#171717" : "#F5F5F5",
            style: LineType.Solid,
          },
        },
        candle: {
          bar: {
            upColor: "#30D158",
            downColor: "#FF453A",
            upBorderColor: "#30D158",
            downBorderColor: "#FF453A",
            upWickColor: "#30D158",
            downWickColor: "#FF453A",
          },
          // type: CandleType.Area,
          tooltip: {
            showRule: TooltipShowRule.None,
            custom(
              { current, prev }: CandleTooltipCustomCallbackData,
              styles: CandleStyle
            ): TooltipData[] {
              const isRise = current.close > current.open;
              return [
                // { title: "", value: { text: "{time}", color: "white" } },
                {
                  title: "O",
                  value: {
                    text: "{open}",
                    color: isRise ? "#65C466" : "#EB4E3D",
                  },
                },
                {
                  title: "H",
                  value: {
                    text: "{high}",
                    color: isRise ? "#65C466" : "#EB4E3D",
                  },
                },
                {
                  title: "L",
                  value: {
                    text: "{low}",
                    color: isRise ? "#65C466" : "#EB4E3D",
                  },
                },
                {
                  title: "C",
                  value: {
                    text: "{close}",
                    color: isRise ? "#65C466" : "#EB4E3D",
                  },
                },
                {
                  title: "V",
                  value: {
                    text: "{volume}",
                    color: isRise ? "#65C466" : "#EB4E3D",
                  },
                },
              ];
            },
            // text: {
            //     size: 16,
            //     family: 'var(--font-jetbrains)',
            //     weight: 'normal',
            //     color: 'white',
            //     // marginLeft: 10,
            //     // marginTop: 8,
            //     // marginRight: 6,
            //     // marginBottom: 0
            // },
          },
          priceMark: {
            last: {
              upColor: "#30D158",
              downColor: "#FF453A",
            },
          },
        },
        separator: {
          size: 1,
          color: theme === "dark" ? "#262626" : "#E5E5E5",
          fill: true,
          //activeBackgroundColor: "#000",
        },
        xAxis: {
          tickLine: {
            color: theme === "dark" ? "#171717" : "#F5F5F5",
          },
          axisLine: {
            color: theme === "dark" ? "#262626" : "#E5E5E5",
          },
        },
        yAxis: {
          tickLine: {
            color: theme === "dark" ? "#171717" : "#F5F5F5",
          },
          axisLine: {
            color: theme === "dark" ? "#171717" : "#F5F5F5",
          },
        },
        indicator: {
          bars: [
            {
              upColor: "#30D158",
              downColor: "#FF453A",
            },
          ],
        },
      },
    })!;
    showIndicator && chartRef.current.createIndicator("VOL");
    // chartRef.current.createIndicator('EMA', true, {id: 'candle_pane'})
  };
  React.useEffect(() => {
    if (!chartRef.current && symbol?.symbolId) {
      initChart();
    }
    if (symbol) {
      initData();
    }
  }, [symbol?.symbolId]);
  return (
    <div className="h-full flex flex-col items-stretch text-xs">
      <div className="px-2 mt-4">
        {showPeriods &&
          periods.map(({ label, value }, index) => (
            <Button
              key={index}
              onClick={() => onPeriodChange({ label, value })}
              className={`${
                period.value === value
                  ? "text-accent-600"
                  : "text-primary-900-White"
              } text-base font-medium normal-case min-w-0`}
            >
              {label || value}
            </Button>
          ))}
      </div>
      <div className="flex-1 h-0 flex flex-col items-stretch">
        <div ref={chartDivRef} className="flex-1 h-0 relative">
          <Image
            className="absolute left-4 bottom-36"
            src="/img/watermark.svg"
            width={100}
            height={22}
            alt=""
          />
        </div>
        {showIndicators && (
          <div className="flex items-center w-full mt-2 overflow-x-auto hide-scrollbar">
            {overlapIndicators.map((indicator, index) => (
              <Button
                key={index}
                onClick={() => onOverlapIndicatorChange(indicator)}
                className={`${
                  overlapIndicator === indicator
                    ? "text-accent-600"
                    : "text-primary-900-White"
                } text-xs normal-case min-w-0 shrink-0`}
              >
                {indicator}
              </Button>
            ))}
            <Divider
              className=" border-primary-900-White mx-2 shrink-0"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            {underIndicators.map((indicator, index) => (
              <Button
                key={index}
                onClick={() => onUnderIndicatorChange(indicator)}
                className={`${
                  underIndicator === indicator
                    ? "text-accent-600"
                    : "text-primary-900-White"
                } text-xs normal-case min-w-0 shrink-0`}
              >
                {indicator}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KLine;
