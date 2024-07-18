import React from "react";
import * as echarts from "echarts";
import { getDataChart } from "http/home";
import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import Chart from "components/base/Charts";
import Image from "next/image";
import { numFormat } from "helper/tools";
import { useTranslation } from "next-i18next";
import { useThemeStore } from "store/useThemeStore";
const FundFlow = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const [options, setOptions] = React.useState<EChartsOption>({});
  const { t } = useTranslation("home");
  const [initText, setInitText] = React.useState<{
    commits: number;
    stars: number;
    fork: number;
    issues: number;
  }>();
  const [chartOption, setChartOption] = React.useState<EChartsOption>();
  const [chartSelect, setChartSelect] = React.useState("");
  const theme = useThemeStore((state) => state.theme);
  const getData = async () => {
    if (originalCurrencyDetail?.currencyId) {
      const chartParams: EChartsOption = {
        params: [
          {
            chartName: `github_code_submisson_status_${originalCurrencyDetail?.currencyId}`,
            name: "Github Commit",
            color: "#18B36B",
            series: {
              type: "line",
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
              lineStyle: {
                color: "#333333",
              },
            },
          },
        ],
        grid: {
          left: "35px",
          top: "20px",
          bottom: "20px",
          right: "35px",
        },
        hideLegend: true,
        showDataZoom: false,
      };
      setChartSelect(originalCurrencyDetail?.currencyId);
      setChartOption(chartParams);
      const data =
        originalCurrencyDetail && JSON.parse(originalCurrencyDetail.github);
      let init = {
        commits: data?.commits,
        fork: data?.fork,
        issues: data?.issues,
        stars: data?.stars,
      };
      setInitText(init);
      const rows = data?.commitsDay || "";
      let tList: number[] = [];
      let time: string[] = [];

      JSON.parse(rows).forEach((item: any) => {
        tList.push(item[1]);
        time.push(item[0]);
      });

      const option: EChartsOption = {
        color: ["#07A872"],
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
          show: true,
          type: "category",
          data: time,
          nameTextStyle: {
            color: "#A0A0A0",
            fontWeight: 400,
            fontSize: 10,
          },
          axisTick: {
            show: false,
          },
          axisLine: {},
          axisLabel: {
            showMaxLabel: true,
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
              fontFamily: "Lato",
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#333333",
              },
            },
          },
        ],

        grid: {
          left: "16px",
          top: "0px",
          bottom: "0px",
          right: "16px",
        },
        series: [
          {
            name: "Github Commit",
            type: "line",
            showSymbol: false,
            smooth: true,
            data: tList,
          },
        ],
      };
      setOptions(option);
    }
  };

  React.useEffect(() => {
    getData();
  }, [originalCurrencyDetail]);
  return (
    <div className="w-auto overflow-x-hidden p-4 m-4 rounded-lg border border-solid border-primary-100-700">
      <div className=" text-primary-900-White font-bold text-lg leading-8">
        {t("GitHub code submission status")}
      </div>
      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="flex text-xs text-secondary-500-300 col-span-1">
          <div className=" flex items-center">
            {/* <Image
              src="/img/svg/GitCommit.svg"
              alt=""
              width={20}
              height={20}
              className="mr-1"
            /> */}
            {t("Commit")}:
          </div>
          <div className=" text-success-600-500 text-xs">
            {(initText?.commits && numFormat(initText?.commits)) || "-"}
          </div>
        </div>
        <div className="flex text-xs text-secondary-500-300 col-span-1">
          <div className=" flex items-center">
            {/* <Image
              src="/img/svg/Star.svg"
              alt=""
              width={20}
              height={20}
              className="mr-1"
            /> */}
            {t("Star")}:
          </div>
          <div className="text-xs text-primary-900-white">
            {(initText?.stars && numFormat(initText?.stars)) || "-"}
          </div>
        </div>
        <div className="flex text-xs text-secondary-500-300 col-span-1">
          <div className=" flex items-center">
            {/* <Image
              src="/img/svg/GitFork.svg"
              alt=""
              width={20}
              height={20}
              className="mr-1"
            /> */}
            {t("Fork")}:
          </div>
          <div className="text-xs text-primary-900-white">
            {(initText?.fork && numFormat(initText?.fork)) || "-"}
          </div>
        </div>
        <div className="flex text-xs text-secondary-500-300 col-span-1">
          <div className=" flex items-center">
            {/* <Image
              src="/img/svg/XCircle.svg"
              alt=""
              width={20}
              height={20}
              className="mr-1"
            /> */}
            {t("Issue")}:
          </div>
          <div className="text-xs text-primary-900-white">
            {(initText?.issues && numFormat(initText?.issues)) || "-"}
          </div>
        </div>
      </div>
      <div className="h-[200px] mb-4">
        <Chart
          option={options}
          chartSelect={chartSelect}
          classes="w-full h-[180px]"
          chartOption={chartOption}
        />
      </div>

      {/* <div ref={chartDivRef} className='w-full h-[350px]'></div> */}
    </div>
  );
};

export default FundFlow;
