import React, { PropsWithChildren, useContext } from "react";
// import * as echarts from "echarts";
import { EChartsOption, init } from "echarts";
import Introduce from "components/operation/Introduce";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Radio from "@mui/material/Radio";
import Menu from "@mui/material/Menu";
import { useDebounceFn, useMemoizedFn } from "ahooks";
import { getChartDatas, getFindOne } from "http/home";
import dayjs, { Dayjs } from "dayjs";
import Loading from "components/operation/Loading";
import { intlNumberFormat, transferMoney } from "helper/tools";
// import { ColorModeContext } from "store/ThemeStore";
import { useRouter } from "next/router";
import { useGetState } from "ahooks";
import {
  Calendar,
  CornersOut,
  DownloadSimple,
  Info,
} from "@phosphor-icons/react";
import { useTranslation } from "next-i18next";
import DateRangePicker from "components/base/DateRangePicker";
import { cssVar, formatterTml, tooltipOptions } from "helper";
import { error } from "helper/alert";
// import options from "../dashboard/options";
// import handleChartData from "../dashboard/handleData";
import Checkbox from "@mui/material/Checkbox";
import Watermark from "components/operation/Watermark";
import { useTResearch } from "hooks/useTranslation";
import { getSeriesText, need100, seriesType } from "./utils/seriesCfg";
import handleChartData from "./handleData";

import CheckedRadio from "components/base/CheckedRadio";
import DateSvg from "components/icons/date.svg";
import RadioSvg from "components/icons/radio.svg";
import Tabs from "./Tabs";

type Props = PropsWithChildren<{
  chartSelect?: string;
  params?: any;
  coin?: string;
  data: API.ChartType;
  tabList?: string[];
  legend?: any;
  chartOption?: any;
  introduce?: {
    title: string;
    whatisDescription: string;
    whatisFormula: string;
    whatisMeaning: string;
  };
  classes?: string;
  introHeight?: string;
  option: any;
  defaultSeries: string[];
  handleChange?: (val: string) => void;
  handleClickTab?: (val: string) => void;
}>;

const ChartDetail = ({
  data,
  coin,
  introduce,
  option,
  classes,
  params,
  chartOption,
  introHeight,
  chartSelect,
  tabList,
  defaultSeries,
  handleChange,
  handleClickTab,
  ...props
}: Props) => {
  const router = useRouter();
  const chartDivRef = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef<any>(null);
  const [active, setActive] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorDate, setAnchorDate] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [currentLegend, setCurrentLegend] = React.useState<string>("");
  const [currLastDay, setCurrLastDay] = React.useState<number>(0);
  const [optionParams, setOptionParams] = React.useState<any>();
  const [initOptionParams, setInitOptionParams] = React.useState<any>();
  const [legend, setLegend] = React.useState<API.legend[]>();
  const [currTitleMenu, setCurrTitleMenu] = React.useState<string>("");
  const { t: tResearch } = useTResearch();
  const [grayLegend, setGrayLegend, getGrayLegend] = useGetState<boolean[]>(
    data.charValue.map((k) => defaultSeries.includes(k))
  );
  const [intro, setIntro] = React.useState<any>();
  // const [filterData, setFilterData] = React.useState<any>();
  const [tab, setTab] = React.useState<string>("Max");
  const mode = "dark";
  // const { mode } = useContext(ColorModeContext);
  const { t } = useTranslation(["dashboard", "etf"]);
  const color = [
    coin === "BTC" ? "#F7931A" : "#627EEA",
    "#4D8FBF",
    "#4DBFBC",
    "#4DBF60",
    "#BF4D61",
    "#BF8F4D",
    "#BF694D",
    "#BF4D61",
    "#BF4DBB",
    "#7C4DBF",
  ];

  const [loading, setLoading] = React.useState<boolean>(true);
  const [dateRange, setDateRange] = React.useState<Dayjs[]>([]);
  // const need100 = ["premDsc", "turnoverRate"];
  const getIndex = (data: any) => {
    const index = data.findIndex((item: any) => item[1] != 0);

    return index;
  };
  const getOptionParams = async (grayLegend: boolean[]) => {
    const currentIndex = grayLegend.findLastIndex((item: any) => item === true);

    const chartOption = option;
    if (chartOption) {
      let nameList: string[] = [];
      chartOption.params &&
        chartOption.params.map((item: any) => {
          if (item.chartName != "" && item.type != "non")
            nameList.push(item.chartName);
        });
      let init = {
        title: data?.title,
        whatisDescription: data?.description,
        whatisFormula: data?.formula,
        whatisMeaning: data?.meaning,
      };

      setIntro(init);
      // 过滤头部  筛选数据

      let filterList = handleChartData(data).formatData(data, currTitleMenu);

      let price: any[] = [];
      filterList[1] &&
        filterList[1].map((item: any) => {
          filterList[0] &&
            filterList[0].map((items: any) => {
              if (items[0] === item[0]) price.push(items);
            });
        });

      let filterData = [price, ...filterList.slice(1, filterList.length)];

      const lastDay = filterData[1][filterData[1].length - 1][0];
      setCurrLastDay(lastDay / 1000);
      // 处理时间范围
      const getTimestamp = (tab: string): number => {
        if (tab === "Max") {
          return 0;
        }
        const timeToDay: any = {
          "7d": 7,
          "30d": 30,
          "90d": 90,
          "1y": 365,
          Max: "Max",
        };
        const oneAgo = new Date(lastDay - timeToDay[tab] * 24 * 60 * 60 * 1000);
        return Math.floor(oneAgo.getTime());
      };

      if (tab !== "Max" || dateRange.length) {
        const odata = filterData;
        const data: any = [];
        if (tab !== "Max") {
          odata.forEach((item: any) => {
            data.push(
              item.filter(
                (item: [number, string]) => item[0] > getTimestamp(tab)
              )
            );
          });
        }
        if (dateRange.length === 2 && tab === "Max") {
          odata.forEach((item: any) => {
            const arr = item.filter(
              (item: [number, string]) =>
                item[0] > dateRange[0].unix() * 1000 - 46400000 &&
                item[0] < dateRange[1].unix() * 1000 + 46400000
            );
            data.push(arr);
          });
        }
        if (data[0].length >= 2) {
          filterData = data;
        }
      }

      // 处理legend
      let tempLegend = handleChartData(data).legend(data, currTitleMenu);

      const legend = tempLegend.map((item: any, index: number) => {
        return {
          height:
            chartOption.params && chartOption.params[index]?.height
              ? chartOption.params[index].height
              : "2px",
          radius: "0",
          name: item,
          color: color[index],
          val:
            filterData &&
            transferMoney(
              filterData[index]?.[filterData[index]?.length - 1]?.[1],
              2
            ),
          time:
            filterData &&
            dayjs(
              filterData[index]?.[filterData[index].length - 1]?.[0]
            ).format("MMM D"),
        };
      });

      setLegend(legend);
      //覆盖y轴线颜色
      chartOption.yAxis &&
        Array.isArray(chartOption.yAxis) &&
        chartOption.yAxis.forEach((item: any) => {
          if (item?.axisLabel) {
            Object.assign(item.axisLabel, {
              color: cssVar("--secondary-500-300"),
              fontFamily: "Lato",
            });
          }
          if (item?.splitLine?.lineStyle) {
            Object.assign(item.splitLine.lineStyle, {
              color: cssVar("--hover-50-800"),
            });
          }
        });

      const noZero = getIndex(filterData[currentIndex]);

      const option: EChartsOption = {
        color: color,
        legend: {
          show: false,
          selected: data.charValue.reduce(
            (acc, curr, currIndex) => ({
              ...acc,
              [curr]: grayLegend[currIndex],
            }),
            {}
          ),
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          ...tooltipOptions,
          formatter: (x: any) => {
            const params: any[] = x;
            return formatterTml({
              title: params[0].axisValue,
              list: params.map((item: any) => ({
                color: item.color,
                name: t(getSeriesText(item.seriesName, coin!), { ns: "etf" }),
                value:
                  item.seriesName !== "BTCPrice" &&
                  item.seriesName !== "ETHPrice"
                    ? chartOption.transferMoney
                      ? item.data.label
                        ? need100.includes(item.seriesName)
                          ? transferMoney(item.data.label * 100) + "%"
                          : transferMoney(item.data.label)
                        : "Not updated"
                      : intlNumberFormat(item.data.label, 2)
                    : intlNumberFormat(item.data.label, 2),
              })),
            });
          },
        },
        xAxis: {
          type: "category",
          data:
            filterData &&
            filterData[0].length &&
            filterData[0]?.map((item: any) => {
              if (
                ["7d", "30d", "90d", "1y"].includes(tab) ||
                filterData[0].length < 50
              ) {
                return dayjs(item[0]).format("MM/DD");
              } else {
                return dayjs(item[0]).format("YYYY/MM/DD");
              }
            }),
          axisLabel: {
            margin: 16,
            color: cssVar("--secondary-500-300"),
            fontFamily: "Lato",
            showMaxLabel: true,
            alignMaxLabel: "right",
            interval: ["30d", "90d", "1y"].includes(tab)
              ? Math.ceil(filterData && filterData[1].length / 7)
              : tab === "7d" || (filterData && filterData[1].length < 10)
              ? "auto"
              : Math.ceil(filterData && filterData[1].length / 3),
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
        yAxis: chartOption.yAxis
          ? chartOption.yAxis
          : {
              type: "value",
              name: "",
              axisLabel: {
                show: true,
              },
              splitLine: {
                show: false,
              },
            },
        visualMap: chartOption.visualMap && chartOption.visualMap,
        series: (filterData || []).map((item: any, index: number) => {
          if (item.type == "non") {
            return {
              ...chartOption?.params?.[index]?.series,
              name: data.charValue[index],
              showSymbol: false,
              smooth: true,
              lineStyle: {
                width: 1,
              },
              data: item[1],
            };
          } else {
            const { names, types } = handleChartData(data).series(
              data,
              currTitleMenu
            );

            let nameList = names;
            let typeList = data.charValue.map((name) => seriesType[name]);
            if (
              nameList[index] === "BTCPrice" ||
              nameList[index] === "ETHPrice"
            ) {
              return {
                ...chartOption?.params?.[index]?.series,
                color: coin === "BTC" ? "#F7931A" : "#627EEA",
                name: nameList[index],
                type: typeList ? typeList[index] : "line",
                showSymbol: false,
                // smooth: true,
                lineStyle: {
                  width: 2,
                },

                data:
                  filterData[index].length &&
                  filterData[index]?.map((item: any, dataIndex: number) => {
                    return {
                      value:
                        dataIndex >= noZero && filterData[currentIndex][noZero]
                          ? (+item[1] * +filterData[currentIndex][noZero][1]) /
                            +filterData[0][noZero][1]
                          : 0,
                      label: item[1],
                    };
                  }),
              };
            } else {
              return {
                ...chartOption?.params?.[index]?.series,
                name: nameList[index],
                type: typeList ? typeList[index] : "line",
                showSymbol: false,
                color: color[index],
                // smooth: true,
                lineStyle: {
                  width: 2,
                },

                data:
                  filterData[index].length &&
                  filterData[index]?.map((item: any, dataIndex: number) => {
                    return {
                      value: item[1],
                      label: item[1],
                    };
                  }),
              };
            }
          }
        }),
        grid: {
          left: 16,
          right: 16,
          top: 20,
          bottom: 20,
          containLabel: true,
        },
      };
      setLoading(false);
      setOptionParams(option);
    }
  };
  const getInitData = async () => {
    // if (
    //   echarts &&
    //   chartDivRef.current! &&
    //   echarts.getInstanceByDom(chartDivRef.current!) == undefined
    // ) {
    //   chart.current = echarts.init(chartDivRef.current!, "black");
    // }
    if (!chart.current) {
      chart.current = init(chartDivRef.current!);
    }
    if (chartDivRef.current && optionParams) {
      chart.current.clear();
      chart.current.setOption(optionParams);
    }
  };

  const changeActive = (val: any) => {
    setActive(val);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const change = (val: string) => {
    handleClose();
    setCurrTitleMenu(val);
  };
  const clickTab = (val: string) => {
    setTab(val);
    setDateRange([]);
  };

  const { run: runLegend } = useDebounceFn(
    (item: any, index: number) => {
      currentLegend === item.name
        ? setCurrentLegend("")
        : setCurrentLegend(item.name);
      legend?.map((o) => {
        chart.current.dispatchAction({
          type: "legendUnSelect",
          name: o.name,
        });
      });

      legend?.map((o) => {
        chart.current.dispatchAction({
          type: "legendSelect",
          name: item.name,
        });
      });

      legend?.map((o) => {
        chart.current.dispatchAction({
          type: "legendSelect",
          name: coin === "BTC" ? "BTCPrice" : "ETHPrice",
        });
      });
      const temp = data.charValue.map((_, index) => index === 0);
      temp[index] = true;
      setGrayLegend(temp);

      getOptionParams(temp);
    },
    { wait: 300 }
  );
  const clickLegend = useMemoizedFn(runLegend);
  const dateRangeChange = (dateRange: Dayjs[]) => {
    const [startDate, endDate] = dateRange;
    if (
      startDate.unix() > dayjs(new Date()).unix() ||
      startDate.unix() > currLastDay
    ) {
      error(t("No Data"));
      return;
    }
    setTab("Max");
    setDateRange(dateRange);
  };
  const dateRangeNode = React.useMemo(() => {
    if (dateRange.length) {
      const [startDate, endDate] = dateRange;
      const str =
        startDate.format("MMMM DD, YYYY") +
        " - " +
        endDate.format("MMMM DD, YYYY");
      return (
        <Button
          onClick={() => setDateRange([])}
          className="text-[#FF4F20] text-[13px] capitalize"
          endIcon={
            <Image src="/img/svg/X-red.svg" width={20} height={20} alt="" />
          }
        >
          {str}
        </Button>
      );
    }
  }, [dateRange]);
  React.useEffect(() => {
    getInitData();
  }, [optionParams]);
  const { run: resize } = useDebounceFn(
    () => {
      chart.current.resize();
    },
    { wait: 300 }
  );

  React.useEffect(() => {
    if (data) {
      getOptionParams(getGrayLegend());
      data.switchCharts && setCurrTitleMenu(data.switchCharts[0]);
    }
  }, [data]);
  React.useEffect(() => {
    getOptionParams(getGrayLegend());
  }, [router.locale, mode, currTitleMenu, tab, dateRange]);

  React.useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="p-4">
      {loading && (
        <div className="w-full h-full absolute">
          <Loading />
        </div>
      )}
      {!active && (
        <div className="flex justify-between items-center gap-3">
          <Tabs
            activeKey={tab}
            onChange={(key) => clickTab(key)}
            items={(data?.chartPeriods || []).map((item) => ({
              key: item,
              label: t(item),
            }))}
          />
          <ButtonBase
            className="svg-icon-base svg-icon-outline-base"
            onClick={(e) => setAnchorDate(e.currentTarget)}
          >
            <DateSvg />
          </ButtonBase>
          {/* <div className="ml-2">{dateRangeNode}</div> */}
        </div>
      )}
      {data.data.length > 1 ? (
        <div className="relative">
          <Watermark />
          <div
            ref={chartDivRef}
            className="w-full h-[368px] mt-4 rounded-xl border border-solid border-primary-100-700"
          />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center relative">
          <Image
            src="/img/svg/FolderSimpleDashed.svg"
            width={32}
            height={32}
            alt=""
          />
          <div className="text-[#fff] text-base font-bold mt-4">
            {tResearch("No Results")}
          </div>
        </div>
      )}

      {/* legend区 */}
      {legend &&
        !active &&
        !chartOption?.hideLegend &&
        data.data.length > 1 && (
          <div className="mt-4 flex flex-col justify-start items-start gap-3">
            {legend.map((item: any, index: number) => {
              if (item.name != "BTCPrice" && item.name != "ETHPrice") {
                return (
                  <div
                    key={index}
                    className="px-3 py-1 rounded-lg border border-solid border-primary-100-700 w-full flex justify-between items-center"
                    onClick={() => clickLegend(item, index)}
                  >
                    <div className="text-sm leading-6 inline-flex justify-start items-center gap-1">
                      <Radio
                        size="small"
                        checked={grayLegend[index]}
                        icon={<RadioSvg style={{ color: item.color }} />}
                        checkedIcon={
                          <CheckedRadio
                            style={{ backgroundColor: item.color }}
                          />
                        }
                        sx={{
                          padding: "4px",
                          ".MuiSvgIcon-root": {
                            fontSize: "15px",
                          },
                        }}
                      />
                      {t(getSeriesText(item.name, coin!), { ns: "etf" })}
                      <span className="text-secondary-500-300 text-xs leading-5">{`${item.time}:`}</span>
                    </div>
                    <div className="text-sm font-semibold leading-6">
                      {item.val !== "-"
                        ? need100.includes(item.name) && item.val
                          ? (Number(item.val) * 100).toFixed(2) + "%"
                          : Number(item.val)
                          ? Number(item.val).toFixed(2)
                          : item.val
                        : "Not updated"}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

      {/* <Introduce initText={intro} changeActive={changeActive} active={active} /> */}

      <DateRangePicker
        anchorEl={anchorDate}
        value={dateRange}
        onChange={dateRangeChange}
        onClose={() => setAnchorDate(null)}
      />
    </div>
  );
};

export default ChartDetail;
