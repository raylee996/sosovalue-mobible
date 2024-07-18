import React, { useEffect, useContext, useRef, useState, Key } from "react";
import BannerLeft from "components/operation/etf/BannerLeft";
import BannerRight from "components/operation/etf/BannerRight";
import Tooltip from "@mui/material/Tooltip";
import { getList, getFindLastList } from "http/etf";
import { getHistory } from "http/etf";
import { transferMoney } from "helper/tools";
import { objectSort } from "helper/tools";
import { useTranslation } from "next-i18next";
import BgFadeAnimate from "components/base/BgFadeAnimate";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
require("dayjs/locale/zh-cn");
require("dayjs/locale/zh-tw");
require("dayjs/locale/ja");

const Index = () => {
  const [list, setList] = useState<ETF.ETFData[]>([]);
  const [listUpdateMap, setListUpdateMap] = useState<
    Record<string, Record<string, { value?: string; time: string }>>
  >({});
  const [totalNetInflow, setTotalNetInflow] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation(["etf", "common"]);
  const [initData, setInitData] = React.useState<API.etfList[]>([]);
  const [totalNetAssets, setTotalNetAssets] = React.useState(0);
  const [totalNetAssetsChange, setTotalNetAssetsChange] = React.useState(0);
  const [netInflowTime, setNetInflowTime] = React.useState("");
  const [premDscTime, setPremDscTime] = React.useState("");
  const [totalNavTime, setTotalNavTime] = React.useState("");
  const [volumeTime, setVolumeTime] = React.useState("");
  const [cumNetInflowTime, setCumNetInflowTime] = React.useState("");
  const [lastNetInflow, setLastNetInflow] = React.useState<number>(0);
  const [currentSort, setCurrentSort] = useState("DESC");
  const [currentSortKey, setCurrentSortKey] = useState("totalNav");
  /**
   *
   * @param {string} key 排序字段
   * @param {string} desc 排序方式
   * @returns {string} 返回格式化后的日期
   * @des 根据传入的排序字段和排序方式，返回排序后的新数组
   */
  const handleClick = (key: string) => {
    const changeData = [...initData];
    const nonData: any = [];
    const sortData: any = [];
    let sort = "";
    if (currentSort === "DESC") {
      sort = "ASC";
    } else if (currentSort === "ASC") {
      sort = "";
    } else if (currentSort === "") {
      sort = "DESC";
    }
    if (currentSortKey !== key) sort = "DESC";
    changeData.map((item: any) => {
      if (item[key] == null || item[key] == "-") {
        nonData.push(item);
      }

      if (item[key] != null) {
        sortData.push(item);
      }
    });

    let noneData = nonData.filter(
      (item: any) => item[key] == "-" || item[key] == "NaN" || item[key] == null
    );
    let initdata = sortData.filter(
      (item: any) => item[key] != "-" && item[key] != "NaN" && item[key] != null
    );
    if (sort === "") {
      initdata.sort(objectSort("totalNav", "DESC"));
    } else {
      initdata.sort(objectSort(key, sort));
    }

    const dataReasult = initdata.concat(noneData);

    const arr1 = dataReasult?.map((item: any, index: number) => {
      return {
        ...item,
        id: index + 1,
      };
    });
    setInitData(arr1);
    if (sort === "") {
      setCurrentSort("DESC");
      setCurrentSortKey("totalNav");
    } else {
      setCurrentSort(sort);
      setCurrentSortKey(key);
    }
  };
  const isValidValue = (value: any) => {
    return value !== null && value !== "-" && value !== "NaN";
  };
  const getUpdateValue = (data: ETF.ETFData, key: keyof ETF.ETFData) => {
    return listUpdateMap[data.id][key]
      ? listUpdateMap[data.id][key].value
      : data[key];
  };
  const getAllSymbol = async () => {
    const listRequest = getList({
      isListing: 1,
      status: 1,
      orderItems: [{ asc: true, column: "sort" }],
    });
    const lastListRequest = getFindLastList({});
    const [listRes, lastListRes] = await Promise.all([
      listRequest,
      lastListRequest,
    ]);
    console.log(listRes.data, lastListRes.data);
    const updateMap: Record<
      string,
      Record<string, { value?: string; time: string }>
    > = {};
    const keyToKey = (key: keyof ETF.ETFLastData) => {
      if (key === "volumeTradedMap") {
        return "volume";
      }
      return key.replace("Map", "");
    };
    const list = listRes.data.map((item) => {
      const newItem = { ...item };
      lastListRes.data.forEach((record) => {
        Object.keys(record).forEach((key) => {
          const realKey = keyToKey(key as keyof ETF.ETFLastData);
          const timeMap = record[key as keyof ETF.ETFLastData];
          const time = Object.keys(timeMap)[0];
          const idValueMap = timeMap[time];
          for (const id in idValueMap) {
            if (id === item.id) {
              if (!updateMap[id]) {
                updateMap[id] = {};
              }
              if (!updateMap[id][realKey]) {
                updateMap[id][realKey] = {
                  time,
                  value: idValueMap[id],
                };
              }
            }
          }
        });
      });
      return newItem;
    });
    list.sort((a, b) => {
      if (!isValidValue(a)) {
        return 1;
      } else if (!isValidValue(b)) {
        return -1;
      } else {
        return Number(b.totalNav) - Number(a.totalNav);
      }
    });
    let totalVolume = 0;
    let totalNetInflow = 0;
    let totalNetAssets = 0;
    let totalNetAssetsChange = 0;
    list.forEach((item) => {
      totalVolume += updateMap[item.id]
        ? Number(updateMap[item.id]?.volume)
        : item.volume;
      totalNetInflow += Number(
        updateMap[item.id]?.netInflow
          ? updateMap[item.id]?.netInflow.value
          : item.netInflow
      );
      totalNetAssets += Number(
        updateMap[item.id].totalNav
          ? updateMap[item.id].totalNav.value
          : item.totalNav
      );
    });
    const getTime = (key: keyof ETF.ETFLastData) =>
      Object.keys(lastListRes.data[0][key])[0];

    setNetInflowTime(getTime("netInflowMap"));
    setPremDscTime(getTime("premDscMap"));
    setTotalNavTime(getTime("totalNavMap"));
    setVolumeTime(getTime("volumeTradedMap"));
    setCumNetInflowTime(getTime("cumNetInflowMap"));

    setTotalVolume(totalVolume);
    setTotalNetInflow(totalNetInflow);
    setList(list);
    setListUpdateMap(updateMap);
  };

  useEffect(() => {
    getAllSymbol();
  }, []);
  const renderTotalNav = (item: ETF.ETFData) => {
    const totalNavUpdateVal = getUpdateValue(item, "totalNav");
    return (
      <div className="text-[#ADADAD] text-sm">
        ${transferMoney(Number(totalNavUpdateVal))}
      </div>
    );
  };
  const renderNetInflow = (item: ETF.ETFData) => {
    const netInflowUpdateVal = getUpdateValue(item, "netInflow");
    const netInflowUpdateNum = Number(netInflowUpdateVal);
    if (!netInflowUpdateVal) {
      return <span className=" italic pr-[1px]">Not updated</span>;
    } else if (netInflowUpdateNum > 0) {
      return (
        <span className=" text-rise">
          {"$" + transferMoney(netInflowUpdateNum, 0)}
        </span>
      );
    } else if (netInflowUpdateNum < 0) {
      return (
        <span className=" text-fall">
          {"-$" + transferMoney(Math.abs(netInflowUpdateNum), 0)}
        </span>
      );
    } else {
      return <span>{"$" + transferMoney(netInflowUpdateNum, 0)}</span>;
    }
  };
  const renderPremDsc = (item: ETF.ETFData) => {
    const premDscUpdateVal = getUpdateValue(item, "premDsc");
    const premDscUpdateNum = Number(premDscUpdateVal) * 100;
    if (premDscUpdateNum > 0) {
      return (
        <span className="text-[#65C466]">
          <BgFadeAnimate value={premDscUpdateNum}>
            +{premDscUpdateNum.toFixed(2)}%
          </BgFadeAnimate>
        </span>
      );
    } else if (premDscUpdateNum < 0) {
      return (
        <span className="text-[#65C466]">
          <BgFadeAnimate value={premDscUpdateNum}>
            +{premDscUpdateNum.toFixed(2)}%
          </BgFadeAnimate>
        </span>
      );
    } else if (premDscUpdateNum === 0) {
      return <span className="ml-2.5">0.00%</span>;
    } else if (premDscUpdateVal === "-") {
      return <span className="ml-2.5 text-right block">-</span>;
    }
  };
  return (
    <>
      <div className="px-4 py-3 flex">
        <div className="flex-1">
          <BannerLeft
            netInflowTime={netInflowTime}
            totalVolume={totalVolume}
            volumeTime={volumeTime}
            totalNetInflow={totalNetInflow}
          />
        </div>
        <div className="flex-1 border-0 border-l-[1px] border-solid border-[#404040] ml-1 pl-3">
          <BannerRight
            lastNetInflow={lastNetInflow}
            totalNetInflow={totalNetInflow}
            cumNetInflowTime={cumNetInflowTime}
            totalNavTime={totalNavTime}
            totalNetAssets={totalNetAssets}
            totalNetAssetsChange={totalNetAssetsChange}
          />
        </div>
      </div>

      <div className="h-[1px] bg-[#fff]/[0.2] m-0 scale-y-50"></div>

      <div className="pl-2 pt-2 pb-1 flex items-center pr-2 justify-between">
        <div className="text-xs flex-1 flex items-center">
          <div
            className="w-5 text-[#ADADAD] text-xs"
            onClick={() => handleClick("totalNav")}
          >
            #
          </div>
          <div className="flex-1 flex items-center">
            <div
              className="text-[#ADADAD] text-xs"
              onClick={() => handleClick("totalNav")}
            >
              {t("NetAssets")}
            </div>
            <div
              className="ml-1 cursor-pointer"
              onClick={() => handleClick("totalNav")}
            >
              <Image
                src={`${
                  currentSortKey === "totalNav" && currentSort === "ASC"
                    ? "/img/svg/home/circle_active.svg"
                    : "/img/svg/home/circle.svg"
                }`}
                width={7}
                height={4}
                alt=""
                className={`${
                  currentSortKey === "totalNav" && currentSort === "ASC"
                    ? "block rotate-180"
                    : "block"
                }`}
              />
              <Image
                src={`${
                  currentSortKey === "totalNav" && currentSort === "DESC"
                    ? "/img/svg/home/circle_active.svg"
                    : "/img/svg/home/circle.svg"
                }`}
                width={7}
                height={4}
                alt=""
                className={`${
                  currentSortKey === "totalNav" && currentSort === "DESC"
                    ? "block mt-1"
                    : "block mt-1 rotate-180"
                }`}
              />
            </div>
          </div>
          <div
            className="text-xs text-[#8F8F8F] w-[94px] ml-1"
            onClick={() => handleClick("netInflow")}
          >
            <div className="flex items-center">
              <div className="mr-1">
                <Image
                  src={`${
                    currentSortKey === "netInflow" && currentSort === "ASC"
                      ? "/img/svg/home/circle_active.svg"
                      : "/img/svg/home/circle.svg"
                  }`}
                  width={7}
                  height={4}
                  alt=""
                  className={`${
                    currentSortKey === "netInflow" && currentSort === "ASC"
                      ? "block rotate-180"
                      : "block"
                  }`}
                />
                <Image
                  src={`${
                    currentSortKey === "netInflow" && currentSort === "DESC"
                      ? "/img/svg/home/circle_active.svg"
                      : "/img/svg/home/circle.svg"
                  }`}
                  width={7}
                  height={4}
                  alt=""
                  className={`${
                    currentSortKey === "netInflow" && currentSort === "DESC"
                      ? "block mt-1"
                      : "block mt-1 rotate-180"
                  }`}
                />
              </div>
              <div className="text-xs text-[#ADADAD]">
                <p className="p-0 m-0">{t("NetInflow")}</p>
                <p className="p-0 m-0">
                  {netInflowTime
                    ? t("As of") +
                      netInflowTime.slice(5, 7) +
                      "/" +
                      netInflowTime.slice(8, 10)
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="text-xs text-[#8F8F8F] w-[94px] ml-1 mr-2">
            <div
              className="text-xs text-[#8F8F8F] flex justify-end items-center"
              onClick={() => handleClick("premDsc")}
            >
              <div className="mr-1">
                <Image
                  src={`${
                    currentSortKey === "premDsc" && currentSort === "ASC"
                      ? "/img/svg/home/circle_active.svg"
                      : "/img/svg/home/circle.svg"
                  }`}
                  width={7}
                  height={4}
                  alt=""
                  className={`${
                    currentSortKey === "premDsc" && currentSort === "ASC"
                      ? "block rotate-180"
                      : "block"
                  }`}
                />
                <Image
                  src={`${
                    currentSortKey === "premDsc" && currentSort === "DESC"
                      ? "/img/svg/home/circle_active.svg"
                      : "/img/svg/home/circle.svg"
                  }`}
                  width={7}
                  height={4}
                  alt=""
                  className={`${
                    currentSortKey === "premDsc" && currentSort === "DESC"
                      ? "block mt-1"
                      : "block mt-1 rotate-180"
                  }`}
                />
              </div>
              <div className="text-xs text-[#ADADAD]">
                <p className="p-0 m-0 ml-2"> {t("Prem./Dsc.")}</p>
                <p className="p-0 m-0">
                  {premDscTime
                    ? t("As of") +
                      premDscTime.slice(5, 7) +
                      "/" +
                      premDscTime.slice(8, 10)
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-[140px] overflow-y-auto" ref={listRef}>
        {list?.map((item, index) => {
          return (
            <div
              key={index}
              className="py-2 px-2 flex item-center justify-between"
            >
              <Link
                href={`/bigChart/Etf_${item?.exchangeName}_${item?.ticker}?title=${item?.inst}(${item?.ticker})&&ticker=${item.ticker}`}
                className="w-full flex  item-center justify-between no-underline"
              >
                <div className="text-xs text-[#8F8F8F] flex items-center w-full">
                  <div className="text-[#ADADAD] flex items-center w-full">
                    <div className="w-[20px]">{index + 1}</div>
                    <div className="flex-1 flex">
                      <div>
                        <div className="text-base font-bold text-[#FFF] truncate">
                          {item.ticker}
                        </div>
                        {renderTotalNav(item)}
                      </div>
                    </div>
                    <div className="w-[94px] ml-1 text-[15px] text-[#F4F4F4] font-bold  text-right">
                      {renderNetInflow(item)}
                    </div>
                    <div className="text-[15px] text-[#F4F4F4] font-bold w-[94px] ml-1 mr-2 text-right truncate">
                      {renderPremDsc(item)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Index;
