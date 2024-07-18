import React, { PropsWithChildren, useContext } from "react";
import * as echarts from "echarts";
import Introduce from "components/operation/Introduce";
import { EChartsOption } from "echarts";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useDebounceFn } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import Loading from "components/operation/Loading";
import { intlNumberFormat, transferMoney } from "helper/tools";
import { useRouter } from "next/router";
import {
  Calendar,
  CornersOut,
  DownloadSimple,
  Info,
} from "@phosphor-icons/react";
import { useTranslation } from "next-i18next";
import DateRangePicker from "components/base/DateRangePicker";
import { error } from "helper/alert";
import handleChartData from "./handleData";
import Checkbox from "@mui/material/Checkbox";
import Watermark from "components/operation/Watermark";
type Props = PropsWithChildren<{
  chartSelect?: string;
  params?: any;
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
  handleChange?: (val: string) => void;
  handleClickTab?: (val: string) => void;
}>;

// 🤢 废弃 另见: components/operation/etf/ChartDetail.tsx
const ChartDetail = ({
  data,
  introduce,
  option,
  classes,
  params,
  chartOption,
  introHeight,
  chartSelect,
  tabList,
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
  const [legend, setLegend] = React.useState<API.legend[]>();
  const [currTitleMenu, setCurrTitleMenu] = React.useState<string>("");
  const [grayLegend, setGrayLegend] = React.useState<boolean[]>([
    false,
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [intro, setIntro] = React.useState<any>();
  // const [filterData, setFilterData] = React.useState<any>();
  const [tab, setTab] = React.useState<string>("Max");
  const mode = "dark";
  const { t } = useTranslation(["dashboard", "etf"]);
  const color = [
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
  ];
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dateRange, setDateRange] = React.useState<Dayjs[]>([]);
  const [lastDay, setLastDay] = React.useState();
  const need100 = ["PremDsc", "NetAssetsChange"];
  const getOptionParams = async () => {
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

      let filterData = handleChartData(data).formatData(data, currTitleMenu);
      const lastDay = filterData[0][filterData[0].length - 1][0];
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
              4
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
          if (item?.splitLine?.lineStyle) {
            item.splitLine.lineStyle.color = `${
              mode === "dark" ? "#343434" : "#E0E0E0"
            }`;
          }
        });
      const option: EChartsOption = {
        color: color,
        legend: {
          show: false,
          selected: {
            PremDsc: grayLegend[0],
            "1DNetInflow": grayLegend[1],
            CumNetInflow: grayLegend[2],
            NetAssets: grayLegend[3],
            NetAssetsChange: grayLegend[4],
            MktPrice: grayLegend[5],
            VolTraded: grayLegend[6],
          },
        },
        // toolbox: {
        //   show: true,
        //   top: "0px",
        //   right: "40px",
        //   feature: {
        //     magicType: { type: ["line", "bar"] },
        //     saveAsImage: {},
        //   },
        // },
        tooltip: {
          trigger: "axis",
          backgroundColor: `${mode === "dark" ? "#1E1E1E" : "#FFFFFF"}`,
          borderColor: `${mode === "dark" ? "#1E1E1E" : "#FFFFFF"}`,
          padding: 1,
          textStyle: {
            color: `${mode === "dark" ? "#A5A7AB" : "#242424"}`,
            fontSize: 10,
          },
          axisPointer: {
            type: "line",
          },
          formatter: function (params: any) {
            let Paramsss = `<div>${params[0].axisValue}</div>`;
            params.map((item: any, index: number) => {
              Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${
                item.color
              }"></i>${t(item.seriesName, { ns: "etf" })}: ${
                chartOption.transferMoney
                  ? item.value
                    ? need100.includes(item.seriesName)
                      ? transferMoney(item.value * 100) + "%"
                      : transferMoney(item.value)
                    : "Not updated"
                  : intlNumberFormat(item.value, 2)
              } <br/>`;
            });
            return Paramsss;
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
          nameTextStyle: {
            color: "#A0A0A0",
            fontWeight: 400,
            fontSize: 10,
          },
          axisLine: {
            lineStyle: {
              color: `${mode === "dark" ? "#343434" : "#E0E0E0"}`, // 坐标轴线的颜色
              width: 1, // 坐标轴线的宽度
              type: "solid", // 坐标轴线的类型（实线、虚线等）
            },
          },
          axisLabel: {
            //showMaxLabel:true,
            color: "#8F8F8F",
            showMinLabel: true,
            showMaxLabel: true,
            fontFamily: "JetBrains Mono",
            interval: ["30d", "90d", "1y"].includes(tab)
              ? Math.ceil(filterData && filterData[0].length / 7)
              : tab === "7d" || (filterData && filterData[0].length < 10)
              ? "auto"
              : Math.ceil(filterData && filterData[0].length / 3),
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
        // graphic: chartOption.graphic
        //   ? chartOption.graphic
        //   : {
        //       type: "image",
        //       left: "center",
        //       top: "center",
        //       z: -1,
        //       //rotation: Math.PI / 4,
        //       style: {
        //         image: "/img/watermark.svg",
        //         x: 0,
        //         y: 0,
        //         width: 200,
        //         height: 44,
        //         opacity: 1,
        //       },
        //     },
        visualMap: chartOption.visualMap && chartOption.visualMap,
        // chartOption.params
        series:
          filterData &&
          filterData.length &&
          filterData.map((item: any, index: number) => {
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
              let typeList = [
                "line",
                "bar",
                "bar",
                "line",
                "line",
                "line",
                "bar",
              ];
              return {
                ...chartOption?.params?.[index]?.series,
                name: nameList[index],
                type: typeList ? typeList[index] : "line",
                showSymbol: false,
                // smooth: true,
                lineStyle: {
                  width: 2,
                },
                data:
                  filterData[index].length &&
                  filterData[index]?.map((item: any) => {
                    return item[1];
                  }),
              };
            }
          }),
        // dataZoom: [
        //   {
        //     type: "inside",
        //     zoomLock: true,
        //     start: 0,
        //     end: 100,
        //   },
        //   {
        //     type: "slider",
        //     height: 36,
        //     backgroundColor: "rgba(174, 174, 174, 0.10)",
        //     dataBackground: {
        //       lineStyle: {
        //         color: "#404040",
        //       },
        //       areaStyle: {
        //         color: "#292929",
        //       },
        //     },
        //     selectedDataBackground: {
        //       lineStyle: {
        //         color: "#2174FF",
        //       },
        //       areaStyle: {
        //         color: "#2174FF",
        //       },
        //     },
        //     fillerColor: "rgba(33, 116, 255, .15)",
        //     borderColor: "transparent",
        //     handleSize: "100%",
        //     handleStyle: {
        //       color: `${mode === "dark" ? "rgba(41, 41, 41, 1)" : "#FFFFFF"}`,
        //       borderColor: `${
        //         mode === "dark" ? "rgba(64, 64, 64, 1)" : "#EBEBEB"
        //       }`,
        //       borderWidth: 2,
        //       borderJoin: "miter",
        //       borderMiterLimit: 10,
        //     },
        //     moveHandleSize: 0,
        //     showDetail: false,
        //   },
        // ],
        grid: {
          left: "60px",
          top: "20px",
          bottom: "70px",
          right: "40px",
        },
      };
      setLoading(false);
      setOptionParams(option);
    }
  };
  const getInitData = async () => {
    if (
      echarts &&
      echarts.getInstanceByDom(chartDivRef.current!) == undefined
    ) {
      chart.current = echarts.init(chartDivRef.current!, "black");
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
  const gotoDetail = () => {
    router.push(`/dashboard/${data.innerKey}`);
  };
  const clickLegend = (item: any, index: number) => {
    currentLegend === item.name
      ? setCurrentLegend("")
      : setCurrentLegend(item.name);
    legend?.map((o) => {
      chart.current.dispatchAction({
        type: "legendUnSelect",
        name: o.name,
      });
    });

    chart.current.dispatchAction({
      type: "legendSelect",
      name: item.name,
    });
    const temp = [false, false, false, false, false, false, false];
    temp[index] = true;
    setGrayLegend(temp);
  };
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
      getOptionParams();
      data.switchCharts && setCurrTitleMenu(data.switchCharts[0]);
    }
  }, [data]);
  React.useEffect(() => {
    getOptionParams();
  }, [router.locale, mode, currTitleMenu, tab, dateRange]);
  React.useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className="w-full h-full overflow-x-hidden overflow-y-auto relative border border-solid border-neutral-stroke-3-rest rounded-lg mt-3">
      {loading && (
        <div className="w-full h-full absolute">
          <Loading />
        </div>
      )}
      <div
        className={`flex relative items-center justify-between bg-neutral-bg-3-rest rounded-t-lg z-10  ${
          active ? "p-3 pl-0 mb-1 hidden" : ""
        }`}
      >
        {/* <div className="flex items-center">
          {data.switchCharts && data.switchCharts.length > 0 && (
            <div className="text-neutral-fg-2-rest flex items-center pl-3">
              <Button
                onClick={handleClick}
                className="bg-[#242424] h-[24px] border border-solid border-neutral-stroke-2-rest  text-sm text-neutral-fg-2-rest"
                endIcon={
                  <Image
                    src="/img/svg/CaretDown.svg"
                    width={12}
                    height={12}
                    alt=""
                  />
                }
              >
                {currTitleMenu}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                classes={{
                  paper:
                    " mt-2 rounded-lg bg-[#242424] shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]",
                  list: "py-0",
                }}
              >
                {data.switchCharts &&
                  data.switchCharts.map((item) => (
                    <MenuItem
                      key={item}
                      className="font-bold text-sm text-neutral-fg-2-rest"
                      onClick={() => change(item)}
                    >
                      {item}
                    </MenuItem>
                  ))}
              </Menu>
            </div>
          )}
        </div> */}
        {/* 时间范围 */}
        {!active && (
          <div>
            <div className="flex justify-between items-center my-4 w-screen">
              {data?.chartPeriods && data?.chartPeriods?.length > 0 && (
                <div className="mx-3 flex rounded overflow-hidden">
                  {data?.chartPeriods.map((item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          tab == item
                            ? "text-[#FF4F20] font-bold"
                            : "text-[#adadad]"
                        } text-sm  h-7 bg-[#242424] px-2 cursor-pointer flex items-center`}
                        onClick={() => clickTab(item)}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              )}
              {
                <div className="">
                  <Button
                    onClick={(e) => setAnchorDate(e.currentTarget)}
                    variant="contained"
                    startIcon={
                      <Calendar size={20} />
                      // <Image
                      //   src="/img/svg/Calendarwhite.svg"
                      //   width={20}
                      //   height={20}
                      //   alt=""
                      // />
                    }
                    className={`h-7 normal-case text-[#adadad] bg-[#242424] text-sm font-semibold rounded mx-4 ${
                      mode === "dark" ? "" : "shadow-none"
                    }`}
                  >
                    {t("Time range")}
                  </Button>
                </div>
              }
            </div>
            <div className="ml-2">{dateRangeNode}</div>
          </div>
        )}
      </div>

      <Watermark />
      <div ref={chartDivRef} className="w-full h-[440px]"></div>
      {/* legend区 */}
      {legend && !active && !chartOption?.hideLegend && (
        <div className="flex flex-wrap gap-2 px-3 pt-3 relative -top-[40px] mb-10">
          {legend.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`flex w-full h-[48px] items-center justify-between rounded-sm px-8 py-1 cursor-pointer ${
                  grayLegend[index] ? "bg-[#1A1A1A]" : "bg-[#292929]"
                }`}
                onClick={() => clickLegend(item, index)}
              >
                <div
                  className={`text-xs truncate flex items-center ${
                    grayLegend[index] ? "text-white" : "text-[#adadad]"
                  }`}
                  title={item.name}
                >
                  <Checkbox
                    checked={grayLegend[index]}
                    size="small"
                    sx={{
                      color: `${item.color}`,
                      padding: 0,
                      paddingRight: "4px",
                      "&.Mui-checked": {
                        color: `${item.color}`,
                      },
                    }}
                  />
                  {t(item.name, { ns: "etf" })}
                  <div className="ml-1 text-[#adadad]">
                    {"(" + item.time + ") :"}
                  </div>
                </div>
                <div className="pl-4 text-sm text-white font-bold">
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
          })}
        </div>
      )}

      {/* <Introduce initText={intro} changeActive={changeActive} active={active} />
       */}

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
