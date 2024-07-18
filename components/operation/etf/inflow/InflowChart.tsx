import {
  EChartsType,
  init,
  EChartsOption,
  LineSeriesOption,
  BarSeriesOption,
} from "echarts";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { cssVar, formatterTml, tooltipOptions } from "helper";
import { useThemeStore } from "store/useThemeStore";
import { FormatedETFData } from "helper/ugly";
import { useClickAway, useDebounceFn, useUpdateEffect, useSize } from "ahooks";
import Watermark from "components/operation/Watermark";
import Image from "next/image";
type Props = {
  formatedETFData: FormatedETFData;
};

const yAxisLabelFormatter = (value: number) => {
  if (value >= 1000000000000) {
    return value / 1000000000000 + "T";
  } else if (value >= 1000000000) {
    return value / 1000000000 + "B";
  } else if (value >= 1000000) {
    return value / 1000000 + "M";
  } else if (value >= 1000) {
    return value / 1000 + "K";
  } else if (value <= -1000000000000) {
    return value / 1000000000000 + "T";
  } else if (value <= -1000000000) {
    return value / 1000000000 + "B";
  } else if (value <= -1000000) {
    return value / 1000000 + "M";
  } else if (value <= -1000) {
    return value / 1000 + "K";
  } else {
    return "0";
  }
};

function InflowChart({ formatedETFData }: Props) {
  const mode = useThemeStore((state) => state.theme);
  const { t } = useTranslation(["etf", "common"]);
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const warpSize = useSize(chartDivRef);

  const [legend, setLegend] = useState<
    { name: string; value: number | string; color?: string }[]
  >([]);
  const setOption = () => {
    if (!chartRef.current) {
      chartRef.current = init(chartDivRef.current!);
    }
    const colors = [
      cssVar("--secondary-500-300"),
      "#6d28d9",
      `#BFB64D`,
      "#2563eb",
      "#db2777",
      "#ca8a04",
    ];
    const { master, slaves } = formatedETFData;
    const xAxisData = master.rowData.map((item) => item.formatedTime);
    const barSerie: BarSeriesOption = {
      name: master.name,
      type: "bar",
      data: master.echartsData,
      itemStyle: {
        borderRadius: 2,
        color: (params: any) =>
          params.value > 0
            ? cssVar("--success-600-500")
            : cssVar("--error-600-500"),
      },
    };
    const lineSeries: LineSeriesOption[] = slaves.map((item, index) => {
      return {
        name: item.name,
        type: "line",
        yAxisIndex: 1,
        showSymbol: false,
        color: ["BTC Price", "ETH Price"].includes(item.name)
          ? cssVar("--warning-600-500")
          : colors[index],
        data: item.echartsData,
      };
    });
    const series = [barSerie, ...lineSeries];

    setLegend(
      series.map((item) => ({
        name: item.name as string,
        value: (item.data![item.data!.length - 1] as any).labelValue,
        color: item.color as string | undefined,
      }))
    );
    const option: EChartsOption = {
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
              value: item.data.labelValue,
            })),
          });
        },
      },
      xAxis: [
        {
          type: "category",
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
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          position: "left",
          axisLabel: {
            show: true,
            color: cssVar("--secondary-500-300"),
            fontFamily: "Lato",
            formatter: yAxisLabelFormatter,
          },
          splitLine: {
            lineStyle: {
              color: cssVar("--hover-50-800"),
            },
          },
        },
        {
          type: "value",
          axisLabel: {
            show: true,
            color: cssVar("--secondary-500-300"),
            fontFamily: "JetBrains Mono",
            formatter: yAxisLabelFormatter,
          },
          splitLine: {
            show: false,
            lineStyle: {},
          },
        },
        {
          type: "value",
          axisLabel: {
            show: true,
            color: cssVar("--secondary-500-300"),
            fontFamily: "Lato",
            formatter: yAxisLabelFormatter,
          },
          splitLine: {
            show: false,
            lineStyle: {},
          },
        },
      ],
      series,
    };
    chartRef.current.setOption(option);
  };
  useEffect(() => {
    setOption();
  }, []);
  useEffect(() => {
    setOption();
  }, [mode, t]);
  const { run: resize } = useDebounceFn(
    () => {
      chartRef.current?.resize();
    },
    { wait: 300 }
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
      <div className="pt-4 pb-2">
        {legend.map((item, index) => {
          return (
            <div
              key={index}
              className="justify-start items-center inline-flex text-xs mr-2 last:mr-0"
            >
              {index === 0 ? (
                <div className="inline-flex items-center relative -left-[3px]">
                  <span className="inline-block w-3 h-3 rounded-full border-[2px] border-solid border-background-primary-White-900 bg-success-600-500" />
                  <span className="relative -left-1.5 -mr-2 inline-block w-3 h-3 rounded-full border-[2px] border-solid border-background-primary-White-900 bg-error-600-500" />
                </div>
              ) : (
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: `${item.color}` }}
                />
              )}
              <span className="ml-2 mr-1 text-secondary-500-300">
                {t(item.name)}
              </span>
              <span className="text-primary-900-White font-semibold">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-[300px]">
        <Watermark />
        <div className="w-[200px] h-[44px] absolute left-1/2 bottom-0 -translate-x-1/2 -translate-y-1/2">
          <Image src="/img/watermark.svg" width={200} height={44} alt="" />
        </div>
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

export default InflowChart;
