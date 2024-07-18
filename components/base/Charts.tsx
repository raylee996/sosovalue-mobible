import React, { PropsWithChildren } from "react";
import * as echarts from "echarts";
import Introduce from "components/operation/Introduce";
import { EChartsOption } from "echarts";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useDebounceFn } from "ahooks";
import { getChartDatas } from "http/home";
import dayjs from "dayjs";
import Loading from "components/operation/Loading";
import { intlNumberFormat, transferMoney } from "helper/tools";
import { useThemeStore } from "store/useThemeStore";
type Props = PropsWithChildren<{
  chartSelect?: string;
  tab?: string;
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
  option: EChartsOption | {};
  handleChange?: (val: string) => void;
  handleClickTab?: (val: string) => void;
}>;

const Chart = ({
  introduce,
  option,
  classes,
  tab,
  chartOption,
  introHeight,
  chartSelect,
  tabList,
  handleChange,
  handleClickTab,
  ...props
}: Props) => {
  const chartDivRef = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef<any>(null);
  const [active, setActive] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const [optionParams, setOptionParams] = React.useState<any>();
  const [legend, setLegend] = React.useState<API.legend[]>();
  const [time, setTime] = React.useState<string>("MAX");
  const color = [
    "#E5E5E5",
    "#4D67BF",
    "#D9575E",
    "#57D98D",
    "#57D98D",
    "#BFB64D",
    "#BF8F4D",
    "#BF694D",
    "#BF4D61",
    "#BF4DBB",
    "#7C4DBF",
  ];
  const [loading, setLoading] = React.useState<boolean>(true);
  const changeData = (val: number[] | string[]) => {
    if (time === "30D" && val.length > 30) {
      return val.slice(val.length - 30, val.length);
    } else if (time === "90D" && val.length > 90) {
      return val.slice(val.length - 90, val.length);
    } else {
      return val;
    }
  };
  const getOptionParams = async () => {
    if (chartOption) {
      let nameList: string[] = [];
      chartOption.params.map((item: any) => {
        if (item.chartName != "" && item.type != "non")
          nameList.push(item.chartName);
      });

      let { data } = await getChartDatas({ nameList });
      if (data) {
        const legend = chartOption.params.map((item: any, index: number) => {
          if (item.type == "non") {
            return {
              height: item.height ? item.height : "2px",
              name: item.name,
              radius: item.radius ? item.radius : "0",
              color: item.color ? item.color : color[index],
              val: (
                1 -
                JSON.parse(data[nameList[0]])[
                  JSON.parse(data[nameList[0]]).length - 1
                ][1]
              ).toFixed(2),
              time: dayjs(
                JSON.parse(data[nameList[0]])[
                  JSON.parse(data[nameList[0]]).length - 1
                ][0]
              ).format("MMM D"),
            };
          }

          return {
            height: item.height ? item.height : "2px",
            radius: item.radius ? item.radius : "0",
            name: item.name,
            color: item.color ? item.color : color[index],
            val: item.chartName
              ? chartOption.transferMoney
                ? transferMoney(
                    JSON.parse(data[item.chartName])[
                      JSON.parse(data[item.chartName]).length - 1
                    ][1]
                  )
                : intlNumberFormat(
                    JSON.parse(data[item.chartName])[
                      JSON.parse(data[item.chartName]).length - 1
                    ][1]
                  )
              : item.static,
            time: dayjs(
              JSON.parse(data[nameList[0]])[
                JSON.parse(data[nameList[0]]).length - 1
              ][0]
            ).format("MMM D"),
          };
        });
        setLegend(legend);
        const option: EChartsOption = {
          color: chartOption.params.map((item: any) => item.color),
          tooltip: {
            trigger: "axis",
            backgroundColor: "#1E1E1E",
            borderColor: "#1E1E1E",
            padding: 1,
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
                Paramsss += `<i style="margin-right:4px;font-family:Lato;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${
                  item.color
                }"></i>${item.seriesName}: ${
                  chartOption.transferMoney
                    ? transferMoney(item.value)
                    : intlNumberFormat(item.value)
                } <br/>`;
              });
              return Paramsss;
            },
          },

          xAxis: {
            type: "category",
            data: changeData(JSON.parse(data[nameList[0]])).map((item: any) => {
              return dayjs(item[0]).format("YYYY/MM/DD");
            }),

            nameTextStyle: {
              color: "#A0A0A0",
              fontWeight: 400,
              fontSize: 10,
            },
            axisLine: {
              lineStyle: {
                color: theme === "dark" ? "#262626" : "#E5E5E5", // 坐标轴线的颜色
                width: 1, // 坐标轴线的宽度
                type: "solid", // 坐标轴线的类型（实线、虚线等）
              },
            },
            axisLabel: {
              //showMaxLabel:true,
              color: theme === "dark" ? "#A3A3A3" : "#525252",
              showMinLabel: true,
              showMaxLabel: true,
              interval: Math.ceil(JSON.parse(data[nameList[0]]).length / 2),
              fontFamily: "Lato",
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
                  fontFamily: "Lato",
                },
                splitLine: {
                  show: false,
                },
              },
          graphic: chartOption.graphic
            ? chartOption.graphic
            : {
                type: "image",
                left: "center",
                top: "center",
                z: 10,
                //rotation: Math.PI / 4,
                style: {
                  image: "/img/watermark.svg",
                  x: 0,
                  y: 0,
                  width: 200,
                  height: 44,
                  opacity: 1,
                },
              },
          visualMap: chartOption.visualMap && chartOption.visualMap,
          grid: chartOption.grid,
          series: chartOption.params.map((item: any, index: number) => {
            if (item.type == "non") {
              return {
                ...item.series,
                name: item.name,
                showSymbol: false,
                smooth: true,
                lineStyle: {
                  width: 1,
                },
                data: changeData(
                  JSON.parse(data[chartOption.params[0].chartName])
                ).map((item: any) => {
                  return 1 - item[1];
                }),
              };
            } else {
              return {
                ...item.series,
                name: item.name,
                showSymbol: false,
                smooth: true,
                lineStyle: {
                  width: 1,
                },
                data:
                  data &&
                  changeData(
                    JSON.parse(
                      data[
                        item.chartName
                          ? item.chartName
                          : chartOption.params[0].chartName
                      ]
                    )
                  ).map((item: any) => {
                    return chartOption.params[index].chartName
                      ? item[1]
                      : chartOption.params[index].static;
                  }),
              };
            }
          }),
          /*
                series: [
                  {
                    name: 'BTC Price',
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    lineStyle:{
                      width:1
                    },
                    yAxisIndex: 1,
                    data: dList
                  },
                  {
                    name: 'AHR999',
                    type: 'line',
                    showSymbol: false,
                    lineStyle:{
                      width:1
                    },
                    smooth:true,
                    data: tList
                  },
                  {
                    name: 'Fixed investment zome',
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    lineStyle:{
                      width:1
                    },
                    data: fixList
                  },
                  {
                    name: 'Buy at the bottom',
                    type: 'line',
                    showSymbol: false,
                    smooth:true,
                    lineStyle:{
                      width:1
                    },
                    data: buyList
                  },
                ],
                */
          dataZoom: chartOption.showDataZoom && [
            {
              type: "inside",
              zoomLock: true,
              start: 0,
              end: 100,
            },
            {
              type: "slider",
              height: 24,
              backgroundColor: "rgba(174, 174, 174, 0.10)",
              dataBackground: {
                lineStyle: {
                  color: "#404040",
                },
                areaStyle: {
                  color: "#292929",
                },
              },
              selectedDataBackground: {
                lineStyle: {
                  color: "#2174FF",
                },
                areaStyle: {
                  color: "#2174FF",
                },
              },
              fillerColor: "rgba(33, 116, 255, .15)",
              borderColor: "transparent",
              handleSize: "100%",
              handleStyle: {
                color: "rgba(41, 41, 41, 1)",
                borderColor: "rgba(64, 64, 64, 1)",
                borderWidth: 2,
                borderJoin: "miter",
                borderMiterLimit: 10,
              },
              moveHandleSize: 0,
              showDetail: false,
            },
          ],
        };
        setLoading(false);
        setOptionParams(option);
      }
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
    if (handleChange) {
      handleClose();
      handleChange(val);
    }
  };
  const clickTab = (val: string) => {
    if (handleClickTab) {
      handleClickTab(val);
    }
  };
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
    getOptionParams();
  }, []);
  React.useEffect(() => {
    getOptionParams();
  }, [chartSelect, time]);
  React.useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className="w-full relative">
      {loading && (
        <div className="w-full h-full absolute">
          <Loading />
        </div>
      )}
      <div
        className={`flex items-center justify-between ${
          active ? "p-3 pl-0 mb-1 hidden" : ""
        }`}
      >
        <div className="flex items-center">
          {handleChange && (
            <div className="text-[#E5E5E5] flex items-center pl-3">
              <Button
                onClick={handleClick}
                className="bg-[#333333] h-[24px]  text-sm text-[#E5E5E5]"
                endIcon={
                  <Image
                    src="/img/svg/CaretDown.svg"
                    width={12}
                    height={12}
                    alt=""
                  />
                }
              >
                {chartSelect}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                classes={{
                  paper:
                    "w-16 mt-2 rounded-lg bg-[#333333] shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]",
                  list: "py-0",
                }}
              >
                <MenuItem
                  className="font-bold text-sm text-[#C6C6C6]"
                  onClick={() => change("BTC")}
                >
                  BTC
                </MenuItem>
                <MenuItem
                  className="font-bold text-sm text-[#C6C6C6]"
                  onClick={() => change("ETH")}
                >
                  ETH
                </MenuItem>
              </Menu>
            </div>
          )}

          <div className="text-[#F4F4F4] text-sm leading-6 ml-3">
            <span>{introduce?.title}</span>
          </div>
        </div>

        {(introduce?.whatisDescription ||
          introduce?.whatisMeaning ||
          introduce?.whatisFormula) && (
          <div
            className={`cursor-pointer p-3 ${introduce?.title ? "" : "hidden"}`}
            onClick={() => setActive(true)}
          >
            <Image
              src="/img/svg/Icon.svg"
              alt=""
              width={24}
              height={24}
              className="align-bottom"
            />
          </div>
        )}
      </div>
      {tabList && (
        <div className="mx-3 flex mb-3">
          {tabList.map((item: string, index: number) => {
            return (
              <div
                key={index}
                className={`${
                  tab == item ? "text-[#FF4F20] font-bold" : "text-[#8D8D8D]"
                } text-sm bg-[#282828] px-2 cursor-pointer`}
                onClick={() => clickTab(item)}
              >
                Daily
              </div>
            );
          })}
        </div>
      )}
      <div className="flex mt-2">
        <div className="ml-2 flex items-center bg-hover-50-900 border border-solid rounded-xl border-primary-100-700">
          <div
            onClick={() => setTime("30D")}
            className={`text-xs cursor-pointer text-primary-900-White h-6 leading-6 px-2 rounded-xl ${
              time === "30D" && "bg-background-secondary-White-700"
            }`}
          >
            30D
          </div>
          <div
            onClick={() => setTime("90D")}
            className={`text-xs cursor-pointer text-primary-900-White h-6 rounded-xl leading-6 px-2 ${
              time === "90D" && "bg-background-secondary-White-700"
            }`}
          >
            90D
          </div>
          <div
            onClick={() => setTime("MAX")}
            className={`text-xs cursor-pointer text-primary-900-White h-6 rounded-xl leading-6 px-2 ${
              time === "MAX" && "bg-background-secondary-White-700"
            }`}
          >
            MAX
          </div>
        </div>
      </div>

      {legend && !active && !chartOption.hideLegend && (
        <div className="flex flex-wrap">
          {legend.map((item: any, index: number) => {
            if (legend.length > 4) {
              return (
                <div
                  key={index}
                  className="flex ml-1 mb-1 px-0.5 bg-[#303031] rounded-sm"
                  style={{
                    borderLeft: `${index == 0 ? "0" : "1px solid #343434"}`,
                  }}
                >
                  <div className="text-xs text-[#BBBBBB]">
                    <i
                      style={{
                        background: `${item.color}`,
                        height: `${item.height}`,
                        borderRadius: `${
                          item?.radius ? `${item.radius}` : "0"
                        }`,
                      }}
                      className="w-2 inline-block mr-1.5 ml-0.5"
                    ></i>
                    {item.name} {item.val}
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="flex-1 pl-3"
                  style={{
                    borderLeft: `${index == 0 ? "0" : "1px solid #343434"}`,
                  }}
                >
                  <div
                    className={`text-xs text-[#BBBBBB] truncate ${
                      legend.length > 3 && "max-w-[100px]"
                    }`}
                    title={item.name}
                  >
                    <i
                      style={{
                        background: `${item.color}`,
                        height: `${item.height}`,
                        borderRadius: `${
                          item?.radius ? `${item.radius}` : "0"
                        }`,
                      }}
                      className="w-2 inline-block align-middle mr-1.5 ml-0.5"
                    ></i>
                    {item.name}
                  </div>
                  <div className="pl-4 text-sm text-[#fff] font-bold">
                    {item.val}
                  </div>
                  <div className="pl-4 text-sm text-[#8D8D8D]">{item.time}</div>
                </div>
              );
            }
          })}
        </div>
      )}

      <div className={`${active ? "hidden" : ""} mt-1`}>
        <div ref={chartDivRef} className={`${classes}`}></div>
      </div>

      <Introduce
        initText={introduce}
        changeActive={changeActive}
        active={active}
        introHeight={introHeight}
      />
    </div>
  );
};

export default Chart;
