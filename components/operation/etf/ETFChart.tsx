import React, { useContext } from "react";
import * as echarts from "echarts";
import { getFindOne } from "http/home";
import { useAsyncEffect } from "ahooks";
import { EChartsOption } from "echarts";
import { useRouter } from "next/router";
import Chart from "../Charts";
import { useTranslation } from "next-i18next";
import { Tab } from "./ETFIndex";

type Props = {
  chartData: any;
  tab: Tab;
};

// 🤢 废弃 另见: components/operation/etf/inflow/InflowChart.tsx
const ETFChart = ({ chartData, tab }: Props) => {
  const router = useRouter();
  const [initText, setInitText] = React.useState<{
    whatisDescription: string;
    whatisFormula: string;
    whatisMeaning: string;
  }>();
  const [title, setTitle] = React.useState<string>("");
  const [option, setOption] = React.useState<string>("");
  const [legend, setLegend] = React.useState<API.legend[]>();
  const { t } = useTranslation(["home", "etf"]);
  const chartOption: EChartsOption = {
    params: [
      {
        chartName: tab.nameList[0],
        name: "Fund flow",
        color: `#30D158`,
        height: "8px",
        series: {
          type: "bar",
          itemStyle: {
            normal: {
              color: function (params: any) {
                if (params.value > 0) {
                  return "#30D158";
                } else {
                  return "#FF453A";
                }
              },
            },
          },
        },
      },
      {
        chartName: tab.nameList[1],
        name: "Total Net Assets Value",
        color: "#E5E5E5",
        series: {
          type: "line",
          yAxisIndex: 1,
        },
      },
      {
        chartName: tab.nameList[2],
        name: "BTC Price",
        color: `#BFB64D`,
        series: {
          type: "line",
          yAxisIndex: 1,
        },
      },
    ],
    grid: {
      left: 64,
      top: 24,
      bottom: 48,
      right: 48,
    },
    yAxis: [
      {
        type: "value",
        name: "",
        position: "left",
        axisLabel: {
          show: true,
          fontSize: 12,
          fontFamily: "JetBrains Mono",
          formatter: function (value: number, index: number) {
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
          },
        },
        splitLine: {
          lineStyle: {
            color: "#343434",
          },
        },
      },
      {
        type: "value",
        name: "",
        // min: 1,
        // logBase: 1000,
        axisLabel: {
          show: true,
          fontSize: 12,
          fontFamily: "JetBrains Mono",
          formatter: function (value: number, index: number) {
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
          },
        },

        splitLine: {
          lineStyle: {},
          show: false,
        },
      },
      {
        type: "value",
        name: "",
        // min: 1,
        // logBase: 1000,
        axisLabel: {
          show: true,
          fontSize: 12,
          fontFamily: "JetBrains Mono",
          formatter: function (value: number, index: number) {
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
          },
        },

        splitLine: {
          lineStyle: {},
          show: false,
        },
      },
    ],
    showDataZoom: true,
    transferMoney: true,
  };
  const [introduce, setIntroduce] = React.useState<API.initText>();
  const params = {
    nameKey: "Total_Crypto_Market_Cap",
    classifyId: 4,
  };
  const handleClickTab = (val: any) => {
    console.log(val);
  };
  const getInitData = async () => {
    const { data } = await getFindOne(params);
    const otherData = data.otherData && JSON.parse(data.otherData);

    let init = {
      title: t("Total Bitcoin Spot ETF Fund Flow"),
      whatisDescription: otherData.description,
      whatisFormula: otherData.formula,
      whatisMeaning: t("Total Crypto Tip"),
    };
    setTitle(data.data);
    setInitText(init);
    setIntroduce(init);
  };
  React.useEffect(() => {
    getInitData();
  }, [router.locale]);

  return (
    <div className="w-full h-full bg-[#050505] rounded-lg">
      <Chart
        params={params}
        classes="h-[430px]"
        introduce={introduce}
        legend={legend}
        chartOption={chartOption}
        chartData={chartData}
        handleClickTab={handleClickTab}
      />
    </div>
  );
};

export default ETFChart;
