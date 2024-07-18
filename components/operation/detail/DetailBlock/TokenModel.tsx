import React from "react";
import * as echarts from "echarts";
import { useTranslation } from "next-i18next";
const TokenModel = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const chartDiv = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation("home");
  React.useEffect(() => {
    if (originalCurrencyDetail?.tokenModel) {
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}%",
        },
        legend: {
          orient: "vertical",
          type: "scroll",
          top: "80%",
          left: "center",
          textStyle: {
            color: "#BBBBBB",
            overflow: "break",
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
                formatter: "{b|{b}}\n{c|{d}%}",
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
            data: JSON.parse(originalCurrencyDetail.tokenModel).map(
              (item: any) => ({ value: item.percentage, name: item.holder })
            ),
          },
        ],
      };
      const chart = echarts.init(chartDiv.current!, "black");
      if (chartDiv.current) {
        chart.setOption(option);
      }
    }
  }, [originalCurrencyDetail]);
  return (
    <div className="h-full flex flex-col items-stretch overflow-hidden border border-solid border-primary-100-700 rounded-xl p-4">
      <div className="flex items-center">
        <div className="text-primary-900-white font-bold text-lg leading-8">
          <span>{t("Token Allocation")}</span>
        </div>
      </div>
      <div className="flex-1 h-0 px-4">
        <div className="h-full">
          <div className="h-full" ref={chartDiv}></div>
        </div>
      </div>
    </div>
  );
};

export default TokenModel;
