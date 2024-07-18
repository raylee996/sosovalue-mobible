// FIXME: 复制过来的，不要格式化
import {
  EChartsType,
  init,
  EChartsOption,
  color,
  LineSeriesOption,
} from "echarts";
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { useTranslation } from "next-i18next";
import dayjs from "dayjs";
import { useSize } from "ahooks";
import { cssVar, formatterTml, tooltipOptions } from "helper";
import Watermark from "components/operation/Watermark";
import { useETFPremDscWSData } from "store/WSStore/useETFPremDscWSData";
import { useThemeStore } from "store/useThemeStore";
import { useClickAway, useDebounceFn, useUpdateEffect } from "ahooks";
import MinusSvg from "components/icons/minus.svg";
import Tabs from "../Tabs";

type Props = {
  chartData24h: any;
  chartData1d: any;
};

enum Period {
  H24 = "24h",
  D7 = "7d",
  D30 = "30d",
  D90 = "90d",
  Y1 = "1y",
  Max = "Max",
}
const formatChartData = (data: any) => {
  const keyList = JSON.parse(data.charKey) as string[];
  const labelList = JSON.parse(data.charValue) as string[];
  const dataList = data.indicatorDataList.map((item: any) =>
    JSON.parse(item.data)
  ) as [number, number][][];
  return dataList.map((item, index) => {
    return {
      name: labelList[index],
      keyValue: keyList[index],
      data: item.map(([timestamp, value]) => ({
        value,
        timestamp: Number(timestamp),
      })),
    };
  });
};

type FormatChartData = ReturnType<typeof formatChartData>;

const createChartDataByPeriod = (
  period: Period,
  chartData: FormatChartData
) => {
  if (period === Period.Max) {
    return chartData;
  } else {
    let time: number;
    if (period === Period.D7) {
      time = dayjs().subtract(7, "day").valueOf();
    } else if (period === Period.D30) {
      time = dayjs().subtract(30, "day").valueOf();
    } else if (period === Period.D90) {
      time = dayjs().subtract(90, "day").valueOf();
    } else if (period === Period.Y1) {
      time = dayjs().subtract(1, "year").valueOf();
    }
    return chartData.map((item) => {
      return {
        name: item.name,
        keyValue: item.keyValue,
        data: item.data.filter((item) => item.timestamp > time),
      };
    });
  }
};

type Legend = { name: string; value: string; color: string; key: string };

function PremDscChart({ chartData24h, chartData1d }: Props) {
  const mode = useThemeStore((state) => state.theme);
  const { t } = useTranslation(["etf"]);
  const formatedChartData24hRef = useRef<FormatChartData>();
  const formatedChartData1dRef = useRef<FormatChartData>();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [period, setPeriod] = useState<Period>(periods[0]);
  const [legend, setLegend] = useState<Legend[]>([]);
  const [legendMap, setLegendMap] = useState<Record<string, boolean>>({});
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const warpSize = useSize(chartDivRef);

  useETFPremDscWSData({
    onETFPremDsc(etfPremDsc) {
      const chartData =
        period === Period.H24
          ? formatedChartData24hRef.current
          : formatedChartData1dRef.current;
      let isNeedReRender = false;
      chartData!.forEach((item) => {
        const { keyValue } = item;
        if (etfPremDsc[keyValue]) {
          isNeedReRender = true;
          const { premDsc, ws } = etfPremDsc[keyValue];
          const last = item.data.slice(-1)[0];
          if (!last) {
            item.data.push({ value: premDsc, timestamp: ws });
          } else {
            if (ws > last.timestamp) {
              const gap =
                period === Period.H24 ? 5 * 60 * 1000 : 24 * 60 * 60 * 1000;
              console.log(
                ws,
                dayjs(ws).format("HH:mm:ss"),
                last.timestamp,
                dayjs(last.timestamp).format("HH:mm:ss"),
                ws - last.timestamp,
                gap
              );
              if (ws - last.timestamp >= gap) {
                item.data.push({ value: premDsc, timestamp: ws });
              } else {
                last.value = premDsc;
                last.timestamp = ws;
              }
            }
          }
        }
      });
      if (isNeedReRender) {
        renderChart();
      }
    },
  });
  const onPeriodChange = (period: Period) => {
    setPeriod(period);
    if (period === Period.H24) {
      formatedChartData24hRef.current = formatChartData(chartData24h);
    } else {
      formatedChartData1dRef.current = createChartDataByPeriod(
        period,
        formatChartData(chartData1d)
      );
    }
    renderChart(period);
  };
  const toogleLegend = (legend: Legend) => {
    const isSelect = !legendMap[legend.name];
    setLegendMap({ ...legendMap, [legend.name]: isSelect });
    chartRef.current!.dispatchAction({
      type: isSelect ? "legendUnSelect" : "legendSelect",
      name: legend.name,
    });
  };
  const renderChart = (curPeriod?: Period) => {
    if (!chartRef.current) {
      chartRef.current = init(chartDivRef.current!);
    }
    const colors = [
      "#4D67BF",
      "#4D8FBF",
      "#4DBFBC",
      "#4DBF60",
      "#BFB64D",
      "#BF8F4D",
      "#BF694D",
      "#BF4D61",
      "#BF4DBB",
      "#7C4DBF",
      "#7C67BF",
      "#7C8FBF",
      "#7CBFBC",
      "#7CBF60",
      "#BF9B4D",
      "#BF7F4D",
      "#BF694D",
      "#BF4D7D",
      "#BF4DAB",
      "#8A4DBF",
    ];
    const finalPeriod = curPeriod || period;
    const chartData =
      finalPeriod === Period.H24
        ? formatedChartData24hRef.current!
        : formatedChartData1dRef.current!;
    const legend = chartData.map((item, index) => {
      return {
        key: item.keyValue,
        name: item.name,
        value: `${(item.data.slice(-1)[0]?.value * 100).toFixed(2)}%`,
        color: colors[index],
      };
    });
    setLegend(legend);
    const series: LineSeriesOption[] = chartData.map((item, index) => {
      return {
        name: item.name,
        type: "line",
        data: item.data.map((item) => item.value),
        showSymbol: false,
        smooth: true,
        color: colors[index],
      };
    });
    const dataLengthList = chartData.map((item) => item.data.length);
    const maxLength = Math.max(...dataLengthList);
    const maxLengthIndex = dataLengthList.findIndex(
      (item) => item === maxLength
    );
    const xAxisData = chartData[maxLengthIndex].data.map((item) =>
      dayjs(item.timestamp).format(
        finalPeriod === Period.H24 ? "HH:mm" : "YYYY-MM-DD"
      )
    );
    const option: EChartsOption = {
      animation: false,
      legend: {
        show: false,
      },
      grid: {
        left: 0,
        right: 0,
        top: 8,
        bottom: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
        },
        ...tooltipOptions,
        formatter: function (x: any) {
          const params: any[] = x;
          return formatterTml({
            title: params[0].axisValue,
            list: params.map((item) => ({
              color: item.color,
              name: t(item.seriesName),
              value: `${(item.value * 100).toFixed(2)}%`,
            })),
          });
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          margin: 16,
          color: cssVar("--secondary-500-300"),
          fontFamily: "Lato",
          showMinLabel: true,
          showMaxLabel: true,
          alignMaxLabel: "right",
        },
        axisLine: {
          lineStyle: {
            color: cssVar("--primary-100-700"),
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: cssVar("--secondary-500-300"),
          fontFamily: "Lato",
          formatter: function (value: number) {
            return `${(value * 100).toFixed(2)}%`;
          },
        },
        splitLine: {
          lineStyle: {
            color: cssVar("--hover-50-800"),
          },
        },
      },
      series,
    };
    chartRef.current!.setOption(option);
  };
  useEffect(() => {
    if (chartData24h) {
      const periods = JSON.parse(chartData24h.chartPeriods) as Period[];
      setPeriods(periods);
      setPeriod(periods[0]);
      formatedChartData24hRef.current = formatChartData(chartData24h);
      formatedChartData1dRef.current = formatChartData(chartData1d);
      renderChart(periods[0]);
    }
  }, [chartData24h]);
  useUpdateEffect(() => {
    if (formatedChartData24hRef.current) {
      renderChart();
    }
  }, [mode]);

  const { run: resize } = useDebounceFn(
    () => {
      chartRef.current?.resize();
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useClickAway(() => {
    if (chartRef.current) {
      // chartRef.current.dispatchAction({})
    }
  }, chartDivRef);

  return (
    <>
      <div className="mt-2">
        <Tabs
          activeKey={period}
          items={periods.map((x) => ({ key: x, label: x }))}
          onChange={(key: Period) => onPeriodChange(key)}
        />
        <div className="pt-4 pb-2">
          {legend.map((item) => (
            <ButtonBase
              key={item.key}
              onClick={() => toogleLegend(item)}
              className={`px-2 py-1 text-xs bg-background-primary-White-900 text-primary-900-White rounded-lg border border-solid border-primary-100-700 justify-start items-center gap-1 inline-flex mr-2 mb-2 last:mr-0 ${
                legendMap[item.name] ? "opacity-50" : ""
              }`}
            >
              <MinusSvg className="text-base" style={{ color: item.color }} />
              {item.name} {item.value}
            </ButtonBase>
          ))}
        </div>
      </div>
      <div className="h-[240px] relative">
        <Watermark />
        <div
          ref={chartDivRef}
          className="h-full"
          style={{
            width: warpSize && warpSize.width ? `${warpSize.width}px` : "100%",
          }}
        />
      </div>
    </>
  );
}

export default PremDscChart;
