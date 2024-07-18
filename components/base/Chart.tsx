import React, { PropsWithChildren } from "react";
import * as echarts from "echarts";
import Introduce from "components/operation/Introduce";
import { EChartsOption } from "echarts";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useDebounceFn } from "ahooks";
type Props = PropsWithChildren<{
  chartSelect?: string;
  tab?: string;
  tabList?: string[];
  legend?: any;
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
  legend,
  tab,
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
  const [title, seTitle] = React.useState<string>("");

  const getInitData = async () => {
    if (
      echarts &&
      echarts.getInstanceByDom(chartDivRef.current!) == undefined
    ) {
      chart.current = echarts.init(chartDivRef.current!, "black");
    }
    if (chartDivRef.current) {
      chart.current.setOption(option);
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
  }, [option]);
  const { run: resize } = useDebounceFn(
    () => {
      chart.current.resize();
    },
    { wait: 300 }
  );
  React.useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className="w-full h-full relative">
      <div
        className={`flex items-center justify-between ${
          active ? "p-3 pl-0 mb-1 hidden" : ""
        }`}
      >
        <div className="flex items-center">
          {handleChange && (
            <div className="text-secondary-500-300 flex items-center pl-3">
              <Button
                onClick={handleClick}
                className=" h-[24px]  text-sm text-secondary-500-300"
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
                    "w-16 mt-2 rounded-lg  shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]",
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

      {legend && !active && (
        <div className="flex flex-wrap">
          {legend.map((item: any, index: number) => {
            if (legend.length > 4) {
              return (
                <div key={index} className="flex ml-1 mb-1 px-0.5">
                  <div className="text-xs text-secondary-500-300">
                    <i
                      style={{
                        background: `${item.color}`,
                        height: `${item.height}`,
                        borderRadius: `${
                          item?.radius ? `${item.radius}` : "100%"
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
                <div key={index} className="flex pl-3 mb-1 px-0.5">
                  <div
                    className={`text-xs text-secondary-500-300 truncate `}
                    title={item.name}
                  >
                    <i
                      style={{
                        background: `${item.color}`,
                        height: `${item.height}`,
                        borderRadius: `${
                          item?.radius ? `${item.radius}` : "100%"
                        }`,
                      }}
                      className="w-2 inline-block align-middle mr-1.5 ml-0.5"
                    ></i>
                    {item.name} {item.val}
                  </div>
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
