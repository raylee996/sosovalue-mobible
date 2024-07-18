import React from "react";
import * as echarts from "echarts";
import { useTranslation } from "next-i18next";
import { useThemeStore } from "store/useThemeStore";
const colors = ["#2174FF", "#41535B", "#07A872"];

const TokenUnlock = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const chartDiv = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation("home");
  const theme = useThemeStore((state) => state.theme);
  React.useEffect(() => {
    if (originalCurrencyDetail?.tokenUnlocks) {
      const tokenUnlockData = JSON.parse(
        originalCurrencyDetail.tokenUnlocks
      ) as { data: string[][]; updateTime: number };
      const hasValue = tokenUnlockData.data.some((arr) => parseFloat(arr[2]));
      const option = {
        tooltip: {
          show: hasValue,
          trigger: "item",
          formatter: "{b}: {c}%",
        },
        legend: {
          orient: "vertical",
          top: "80%",
          left: "center",
          textStyle: {
            color: theme === "dark" ? "#A3A3A3" : "#525252",
          },
          itemWidth: 12,
          itemHeight: 12,
          formatter(n: string) {
            const [name, value, percent] = tokenUnlockData.data.find(
              ([name]) => name === n
            )!;
            return `${name}: ${value} ${
              parseFloat(percent) ? `(${percent})` : ""
            }`;
          },
        },
        series: [
          {
            type: "pie",
            center: ["50%", "40%"],
            radius: ["40%", "60%"],
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              scale: false,
              label: {
                formatter: "{a|{b}}\n{b|{d}%}",
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: 12,
                    lineHeight: 20,
                  },
                  b: {
                    color: "#fff",
                    fontSize: 28,
                  },
                },
                show: true,
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: tokenUnlockData.data.map((arr, index) => ({
              value: parseFloat(arr[2]) || parseFloat(arr[1]) || 0,
              name: arr[0],
              itemStyle: { color: colors[index] },
            })),
          },
        ],
      };
      const chart = echarts.init(chartDiv.current!, "black");
      chart.setOption(option);
    }
  }, [originalCurrencyDetail]);
  return (
    <div className="w-auto overflow-hidden p-4 m-4 rounded-lg border border-solid border-primary-100-700 h-full flex flex-col items-stretch">
      <div className=" text-primary-900-White font-bold text-lg leading-8">
        {t("Token unlock")}
      </div>
      <div ref={chartDiv} className="flex-1 h-0"></div>
    </div>
  );
};

export default TokenUnlock;
