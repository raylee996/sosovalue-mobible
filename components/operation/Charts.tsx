import React, { PropsWithChildren, useContext, useEffect } from "react";
import * as echarts from "echarts";
import Introduce from "./Introduce";
import { EChartsOption } from "echarts";
import { useSize } from 'ahooks'
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useClickAway, useDebounceFn } from "ahooks";
import { getChartDatas, getFindOne } from "http/home";
import dayjs from "dayjs";
import Loading from "components/operation/Loading";
import { intlNumberFormat, transferMoney } from "helper/tools";
import { useRouter } from "next/router";
import { Info } from "@phosphor-icons/react";
import { useTranslation } from "next-i18next";
import Tooltip from "@mui/material/Tooltip";
import Watermark from "components/operation/Watermark";
type Props = PropsWithChildren<{
  chartSelect?: string;
  params?: any;
  legend?: any;
  chartOption?: any;
  chartData: any;
  introduce?: {
    title: string;
    whatisDescription: string;
    whatisFormula: string;
    whatisMeaning: string;
  };
  classes?: string;
  introHeight?: string;
  option?: EChartsOption | {};
  handleChange?: (val: string) => void;
  handleClickTab?: (val: string) => void;
}>;

const Chart = ({
  introduce,
  option,
  classes,
  params,
  chartOption,
  introHeight,
  chartData,
  chartSelect,
  handleChange,
  handleClickTab,
  ...props
}: Props) => {
  const router = useRouter();
  const chartDivRef = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef<any>(null);
  const [active, setActive] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tab, seTab] = React.useState<string>("btc");
  const [optionParams, setOptionParams] = React.useState<any>();
  const [legend, setLegend] = React.useState<API.legend[]>();
  const [intro, setIntro] = React.useState<any>();
  const { t } = useTranslation(["etf"]);

  const warpSize = useSize(chartDivRef)

  const tabList = [
    { name: "Bitcoin ETF", value: "btc" },
    // { name: "Ethereum ETF", value: "eth" },
  ];
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
  const getOptionParams = async () => {
    if (chartOption) {
      let nameList: string[] = [];
      const myOption = chartOption;
      if (tab) {
        if (tab === "btc") {
          myOption.params.forEach((item: any) => {
            if (item.chartName === "Etf_eth_Fund_flow") {
              item.chartName = "Etf_btc_Fund_flow";
            }
            if (item.chartName === "Etf_eth_Total_Net_Assets_Value") {
              item.chartName = "Etf_btc_Total_Net_Assets_Value";
            }
          });
        }
        if (tab === "eth") {
          myOption.params.forEach((item: any) => {
            if (item.chartName === "Etf_btc_Fund_flow") {
              item.chartName = "Etf_eth_Fund_flow";
            }
            if (item.chartName === "Etf_btc_Total_Net_Assets_Value") {
              item.chartName = "Etf_eth_Total_Net_Assets_Value";
            }
          });
        }
      }

      myOption.params.map((item: any) => {
        if (item.chartName != "" && item.type != "non")
          nameList.push(item.chartName);
      });
      //let { data } = await getChartDatas({ nameList });
      let price: any = [];
      JSON.parse(chartData[myOption.params[0].chartName]).map((item: any) => {
        JSON.parse(chartData["AHR999_Indicator_value"]).map((items: any) => {
          if (item[0] === items[0]) {
            price.push(items);
          }
        });
      });
      let data = {
        ...chartData,
        AHR999_Indicator_value: JSON.stringify(price),
      };
      if (data) {
        if (params) {
          const res = await getFindOne(params);
          const otherData =
            res.data.otherData && JSON.parse(res.data.otherData);
          let init = {
            title: res.data.data,
            whatisDescription: otherData.description,
            whatisFormula: otherData.formula,
            whatisMeaning: otherData.meaning,
          };

          setIntro(init);

          const legend = myOption.params.map((item: any, index: number) => {
            return {
              height: item.height ? item.height : "2px",
              radius: item.radius ? item.radius : "0",
              name: item.name,
              color: item.color ? item.color : color[index],
              val:
                item.chartName && data[item.chartName]
                  ? (myOption.transferMoney && item.name !== 'BTC Price')
                    ? transferMoney(
                        JSON.parse(data[item.chartName])[
                          JSON.parse(data[item.chartName]).length - 1
                        ][1]
                      )
                    : intlNumberFormat(
                        JSON.parse(data[item.chartName])[
                          JSON.parse(data[item.chartName]).length - 1
                        ][1],
                        2
                      )
                  : item.static,
            };
          });
          setLegend(legend);

          //覆盖y轴线颜色
          chartOption.yAxis &&
            Array.isArray(chartOption.yAxis) &&
            chartOption.yAxis.forEach((item: any) => {
              if (item?.splitLine?.lineStyle) {
                item.splitLine.lineStyle.color = "#343434";
              }
            });
        }

        const option: EChartsOption = {
          color: chartOption.params.map((item: any) => item.color),
          tooltip: {
            trigger: "axis",
            backgroundColor: "#242424",
            borderColor: "#242424",
            // padding: 2, // 外边框
            textStyle: {
              color: "#A5A7AB",
              fontSize: 10,
              // fontSize: 14,
              // lineHeight: 8, // 设置 Tooltip 文本的行间距
            },
            extraCssText: "min-width: 180px; z-index: 0;", // 使用 extraCssText 设置最小宽度
            axisPointer: {
              type: "line",
            },
            formatter: function (params: any) {
              let Paramsss = `<div>${params[0].axisValue}</div>`;
              params.map((item: any) => {
                if (item.seriesName === "BTC Price") {
                  Paramsss += `<div style="display: flex; align-items: center;"><i style="margin-right:4px;display:inline-block;width:8px;height:8px;border-radius:50%;font-size:14px;background:${
                    item.color
                  }"></i><span>${t(item.seriesName)}: ${intlNumberFormat(
                    item.data.label,
                    2
                  )}</span></div>`;
                } else {
                  Paramsss += `<div style="display: flex; align-items: center;"><i style="margin-right:4px;display:inline-block;width:8px;height:8px;border-radius:50%;font-size:14px;background:${
                    item.color
                  }"></i><span>${t(item.seriesName)}: ${
                    myOption.transferMoney
                      ? item.value != "-"
                        ? transferMoney(item.value)
                        : "Not updated"
                      : item.value != "-"
                      ? intlNumberFormat(item.value, 2)
                      : "Not updated"
                  }</span></div>`;
                }
              });
              return Paramsss;
            },
          },

          xAxis: {
            type: "category",
            data: data[nameList[0]]
              ? JSON.parse(data[nameList[0]]).map((item: any) => {
                  return dayjs(item[0]).format("YYYY/MM/DD");
                })
              : JSON.parse(data[nameList[1]]).map((item: any) => {
                  return dayjs(item[0]).format("YYYY/MM/DD");
                }),

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
            axisLabel: {
              //showMaxLabel:true,
              color: "#8F8F8F",
              showMinLabel: true,
              showMaxLabel: true,
              interval:
                data[nameList[0]] &&
                Math.ceil(JSON.parse(data[nameList[0]]).length / 3),
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          yAxis: myOption.yAxis
            ? myOption.yAxis
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
          visualMap: myOption.visualMap && myOption.visualMap,
          grid: myOption.grid,
          series: myOption.params.map((item: any, index: number) => {
            if (item.chartName === "AHR999_Indicator_value") {
              return {
                ...item.series,
                name: item.name,
                showSymbol: false,
                lineStyle: {
                  width: 2,
                },
                data:
                  data &&
                  JSON.parse(
                    data[
                      item.chartName
                        ? item.chartName
                        : myOption.params[0].chartName
                    ]
                  ).map((item: any) => {
                    return {
                      value: myOption.params[index].chartName
                        ? (item[1] *
                            JSON.parse(
                              data["Etf_btc_Total_Net_Assets_Value"]
                            )[0][1]) /
                          JSON.parse(data["AHR999_Indicator_value"])[0][1]
                        : myOption.params[index].static,
                      label: item[1],
                    };
                  }),
              };
            } else {
              return {
                ...item.series,
                name: item.name,
                showSymbol: false,
                lineStyle: {
                  width: 2,
                },
                data:
                  data &&
                  data[
                    item.chartName
                      ? item.chartName
                      : myOption.params[0].chartName
                  ] &&
                  JSON.parse(
                    data[
                      item.chartName
                        ? item.chartName
                        : myOption.params[0].chartName
                    ]
                  ).map((item: any) => {
                    return {
                      value: myOption.params[index].chartName
                        ? item[1]
                        : myOption.params[index].static,
                      label: item[1],
                    };
                  }),
              };
            }
          }),
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
  useEffect(() => {
    if (chartData) {
      getOptionParams();
    }
  }, [t, chartData]);
  useEffect(() => {
    getInitData();
  }, [optionParams]);
  const { run: resize } = useDebounceFn(
    () => {
      chart.current.resize();
    },
    { wait: 300, leading: true }
  );
  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  
  useClickAway(() => {
    if (chart.current) {
      chart.current.dispatchAction({
        type: 'restore'
      })
    }
  }, chartDivRef);

  return (
    <div className="w-full h-full relative">
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
            <div className="text-neutral-fg-2-rest flex items-center pl-3">
              <Button
                onClick={handleClick}
                className="bg-neutral-bg-3-rest h-[24px]  text-sm text-neutral-fg-2-rest"
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
                    "w-16 mt-2 rounded-lg bg-neutral-bg-3-rest shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]",
                  list: "py-0",
                }}
              >
                <MenuItem
                  className="font-bold text-sm text-neutral-fg-3-rest"
                  onClick={() => change("BTC")}
                >
                  BTC
                </MenuItem>
                <MenuItem
                  className="font-bold text-sm text-neutral-fg-3-rest"
                  onClick={() => change("ETH")}
                >
                  ETH
                </MenuItem>
              </Menu>
            </div>
          )}

          {/* <div className="text-neutral-fg-1-rest py-3 flex items-center text-sm leading-6 ml-3">
            <h3 className="m-0 text-sm font-bold mr-1">
              {t("Total Bitcoin Spot ETF Fund Flow")}
            </h3>
            <Tooltip
              classes={{
                tooltip:
                  "bg-neutral-bg-1-rest border border-solid border-neutral-stroke-1-rest text-neutral-fg-2-rest",
              }}
              title={
                <React.Fragment>
                  {t("Total Crypto Spot ETF Fund Flow Tip1")}
                  <br />
                  <br />
                  {t("Total Crypto Spot ETF Fund Flow Tip2")}
                  <br />
                  <br />
                  {t("Total Crypto Spot ETF Fund Flow Tip3")}
                </React.Fragment>
              }
              className="text-justify"
            >
              <Image
                src="/img/svg/Info.svg"
                width={16}
                height={16}
                alt=""
                className="cursor-pointer"
              />
            </Tooltip>
          </div> */}
        </div>

        {/* {(intro?.whatisDescription ||
          intro?.whatisMeaning ||
          intro?.whatisFormula) && (
          <div
            className={`cursor-pointer p-3 ${intro?.title ? "" : "hidden"}`}
            onClick={() => setActive(true)}
          >
            <Info
              className="align-bottom text-neutral-fg-1-rest"
              size={24}
              weight="bold"
            />
          </div>
        )} */}
      </div>

      {legend && !active && (
        <div className="px-4 pt-3">
          {legend.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="inline-flex shrink items-center leading-6 h-6 px-1 mr-1 rounded-sm bg-[#242424]"
              >
                <div
                  className={`text-xs text-neutral-fg-2-rest truncate flex text-[#adadad] items-center ${
                    legend.length > 3 && "max-w-[100px]"
                  }`}
                  title={item.name}
                >
                  {item.name === "Fund flow" ? (
                    <span className=" mr-2">
                      <div className="bg-[#30D158] h-1 w-2"></div>
                      <div className="bg-[#FF453A] h-1 w-2"></div>
                    </span>
                  ) : (
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
                  )}
                  {t(item.name)}
                </div>
                <div className="pl-1 text-sm text-neutral-fg-1-rest text-[#d6d6d6] font-bold">
                  {item.val}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Watermark />
      <div className={`${active ? "hidden" : ""} mt-1 w-full`}>
        <div
          ref={chartDivRef}
          className={`${classes}`}
          style={{
            width: warpSize && warpSize.width ? `${warpSize.width}px` : '100%'
          }}
        />
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
