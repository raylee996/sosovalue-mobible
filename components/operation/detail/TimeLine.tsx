import React from "react";
import { getDataChart } from "http/home";
import { useAsyncEffect } from "ahooks";
import { EChartsOption } from "echarts";
import dayjs from "dayjs";
import Chart from "components/base/Chart";
import { transferMoney } from "helper/tools";
import { decodeAndDecompressString } from "helper/pako";
import { useTranslation } from "next-i18next";
import { useThemeStore } from "store/useThemeStore";

const TimeLine = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const [legend, setLegend] = React.useState<API.legend[]>();
  const [options, setOptions] = React.useState<EChartsOption>({});
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation("home");
  useAsyncEffect(async () => {
    if (originalCurrencyDetail?.fullAllocation) {
      const rows = JSON.parse(
        decodeAndDecompressString(
          JSON.parse(originalCurrencyDetail.fullAllocation).data
        )
      );
      const dateXAxis: string[] = [];
      const data: any = {};
      const color = [
        "#0A84FF",
        "#63E6E2",
        "#24A148",
        "#DA1E28",
        "#ED8139",
        "#FB6E77",
        "#FF79C9",
        "#A471E3",
        "#74188B",
        "#41535B",
        "#D4D7D6",
      ];
      rows.forEach((item: any) => {
        dateXAxis.push(dayjs(item.timestamp).format("YYYY/MM/DD"));
        item.vestings.forEach((items: any) => {
          data[items.label] = data[items.label]
            ? [...data[items.label], items.amount]
            : [items.amount];
        });
      });

      const dataList = Object.entries(data);
      let val: number[] = [];
      const legend = dataList.map((item: any, index: number) => {
        val = [...item[1]];
        return {
          height: "8px",
          name: item[0],
          color: color[index],
          val: transferMoney(val[val.length - 1]),
        };
      });

      setLegend(legend);
      const today = dayjs(new Date()).format("YYYY/MM/DD");
      const option: any = {
        color: [
          "#0A84FF",
          "#63E6E2",
          "#24A148",
          "#DA1E28",
          "#ED8139",
          "#FB6E77",
          "#FF79C9",
          "#A471E3",
          "#74188B",
          "#41535B",
          "#D4D7D6",
        ],
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
              Paramsss += `<div style="white-space: normal"><i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${
                item.color
              }"></i><span style="display:inline-block;max-width:180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;vertical-align: top;">${
                item.seriesName
              }</span>: ${transferMoney(item.value)} <br/></div>`;
            });
            return Paramsss;
          },
        },

        grid: {
          left: "45px",
          top: "20px",
          bottom: "20px",
          right: "25px",
        },
        xAxis: {
          type: "category",
          data: dateXAxis,
          axisLabel: {
            formatter: function (value: any) {
              return dayjs(value).format("MM/YYYY");
            },
            showMaxLabel: true,
            fontFamily: "Lato",
            color: theme === "dark" ? "#A3A3A3" : "#525252",
            interval: Math.ceil(dateXAxis.length / 2),
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false, // 不显示坐标轴线
          },
        },
        yAxis: {
          type: "value",
          name: "",

          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "Lato",
            color: theme === "dark" ? "#A3A3A3" : "#525252",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return "0";
              }
            },
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#333333",
            },
          },
        },
        series: Object.entries(data).map((item) => {
          return {
            data: item[1],
            type: "line",
            showSymbol: false,
            smooth: true,
            name: item[0],
            stack: "Total",
            areaStyle: {
              color: "#3794FF",
              opacity: 0.15,
            },
            markLine: {
              silent: true,
              label: {
                show: true,
                formatter: "Today",
                color: "#BBBBBB",
              },
              lineStyle: {
                color: "#DA1E28",
              },
              symbol: "none",
              data: [
                {
                  name: "Today",
                  xAxis: today, // 获取今天的日期作为x轴值
                },
              ],
            },
            markArea: {
              itemStyle: {
                color: "rgba(0, 0, 0, 0.01)",
              },
              data: [
                [
                  {
                    name: "",
                    xAxis: today,
                  },
                  {
                    xAxis: dateXAxis[dateXAxis.length - 1],
                  },
                ],
              ],
            },
          };
        }),
      };
      setOptions(option);
    }
  }, [originalCurrencyDetail]);
  return (
    <div className="w-auto overflow-x-hidden p-4 m-4 rounded-lg border border-solid border-primary-100-700">
      <div className=" text-primary-900-White font-bold text-lg leading-8 mb-4">
        {t("Timeline")}
      </div>
      <div className="">
        <Chart option={options} classes="w-full h-[300px]" legend={legend} />
      </div>
    </div>
  );
};

export default TimeLine;
