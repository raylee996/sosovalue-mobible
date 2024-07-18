import React, { useContext } from "react";
import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import Chart from "components/base/Charts";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Export from "components/icons/export.svg";
import { useThemeStore } from "store/useThemeStore";
const FundFlow = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const [options, setOptions] = React.useState<EChartsOption>({});

  const { t } = useTranslation("home");
  const [linkUrl, setLinkUrl] = React.useState<string>();
  const [chartOption, setChartOption] = React.useState<EChartsOption>();
  const [chartSelect, setChartSelect] = React.useState("");
  const theme = useThemeStore((state) => state.theme);
  const getData = async () => {
    if (originalCurrencyDetail?.currencyId) {
      const chartParams: EChartsOption = {
        params: [
          {
            chartName: `google_trend_${originalCurrencyDetail?.currencyId}`,
            name: "Reletive Search Score",
            color: "#FF4F20",
            series: {
              type: "line",
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255, 79, 32, 0.16)", // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 79, 32, 0)", // 0% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
                //opacity: 0.15,
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisLabel: {
              show: true,
              color: theme === "dark" ? "#A3A3A3" : "#525252",
              fontFamily: "Lato",
            },
            splitLine: {
              show: false,
            },
          },
        ],
        grid: {
          left: "55px",
          top: "20px",
          bottom: "20px",
          right: "45px",
        },
        hideLegend: true,
        showDataZoom: false,
      };
      setChartSelect(originalCurrencyDetail?.currencyId);
      setChartOption(chartParams);
    }
    const googleTrends =
      originalCurrencyDetail && JSON.parse(originalCurrencyDetail.googleTrends);
    const data =
      originalCurrencyDetail &&
      JSON.parse(originalCurrencyDetail.googleTrends).data;
    let time: string[] = [];
    let value: number[] = [];
    data?.forEach((item: any, index: number) => {
      time.push(dayjs(item.time * 1000).format("MM/DD"));
      value.push(item.value[0]);
    });
    setLinkUrl(googleTrends.url);

    const option: EChartsOption = {
      color: ["#2174FF", "#747474", "#FFFFFF"],
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1E1E1E",
        borderColor: "#1E1E1E",
        padding: 4,
        textStyle: {
          color: "#A5A7AB",
          fontSize: 10,
        },
        axisPointer: {
          type: "line",
        },
        formatter: function (params: any) {
          let Paramsss = `<div>${params[0].axisValue}</div>`;
          params.map((item: any) => {
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
          });
          return Paramsss;
        },
      },

      xAxis: {
        type: "category",
        data: time,
        nameTextStyle: {
          color: "#A0A0A0",
          fontWeight: 400,
          fontSize: 10,
        },
        axisLine: {
          lineStyle: {
            color: "#343434", // 坐标轴线的颜色
            width: 1, // 坐标轴线的宽度
            type: "solid", // 坐标轴线的类型（实线、虚线等）
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          showMaxLabel: true,
          color: "#8F8F8F",
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      grid: {
        left: "55px",
        top: "20px",
        bottom: "20px",
        right: "25px",
      },
      series: [
        {
          name: "Reletive Search Score",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: value,
          areaStyle: {
            color: "#4DBFBC",
            opacity: 0.15,
          },
        },
      ],
    };

    setOptions(option);
  };
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-auto overflow-x-hidden p-4 m-4 rounded-lg border border-solid border-primary-100-700">
      <div className={`flex items-center justify-items-start `}>
        <div className=" text-primary-900-White font-bold text-lg leading-8">
          {t("Google Search Trends")}
        </div>

        {linkUrl && (
          <Link
            href={linkUrl}
            target="_blank"
            className={`cursor-pointer flex items-center`}
          >
            <Export className="text-primary-800-50 ml-2" />
          </Link>
        )}
      </div>
      <Chart
        option={options}
        chartSelect={chartSelect}
        classes="w-full h-[180px]"
        chartOption={chartOption}
      />
    </div>
  );
};

export default FundFlow;
