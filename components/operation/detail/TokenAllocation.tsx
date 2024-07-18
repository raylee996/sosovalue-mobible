import React from "react";
import * as echarts from "echarts";
import { useTranslation } from "next-i18next";
import { useThemeStore } from "store/useThemeStore";
const TokenAllocation = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const chartDiv = React.useRef<HTMLDivElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation("home");
  React.useEffect(() => {
    if (originalCurrencyDetail?.allocation) {
      const allocationData = JSON.parse(originalCurrencyDetail.allocation) as {
        data: string[][];
        updateTime: number;
      };
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}%",
        },
        legend: {
          top: "50%",
          left: "center",
          textStyle: {
            color: theme === "dark" ? "#A3A3A3" : "#525252",
            width: 370,
            overflow: "truncate",
          },
          itemWidth: 12,
          itemHeight: 12,
          formatter(n: string) {
            const [name, value, percent] = allocationData.data.find(
              ([name]) => name === n
            )!;
            return `${name}: ${value} (${percent})`;
          },
        },
        series: [
          {
            type: "pie",
            center: ["50%", "25%"],
            radius: ["40%", "60%"],
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              scale: false,
              label: {
                formatter: "{b|{b}}\n\n{c|{d}%}",
                width: 140,
                overflow: "break",
                rich: {
                  b: {
                    color: "#fff",
                    fontSize: 12,
                    lineHeight: 20,
                  },
                  c: {
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
            data: allocationData.data
              .map((arr) => ({ value: parseFloat(arr[2]), name: arr[0] }))
              .sort((a, b) => a.value - b.value),
          },
        ],
      };
      const chart = echarts.init(chartDiv.current!, "black");
      chart.setOption(option);
    }
  }, [originalCurrencyDetail]);
  return (
    <div className="w-auto overflow-hidden p-4 m-4 rounded-lg border border-solid border-primary-100-700 h-full flex flex-col items-stretch">
      <div className=" text-primary-900-White font-bold text-lg leading-8 mb-4">
        {t("Token allocation")}
      </div>
      <div ref={chartDiv} className="flex-1 h-0"></div>
    </div>
  );
};

export default TokenAllocation;
