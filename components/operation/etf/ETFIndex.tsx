import React, { useEffect, useContext, useRef, useState } from "react";
import BannerLeft from "components/operation/etf/BannerLeft";
import BannerRight from "components/operation/etf/BannerRight";
import { getList, getFindLastList } from "http/etf";
import { getHistory } from "http/etf";
import { transferMoney } from "helper/tools";
import { objectSort } from "helper/tools";
import { useTranslation } from "next-i18next";
import BgFadeAnimate from "components/base/BgFadeAnimate";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
// import ETFChart from "./ETFChart";
import { getChartDatas } from "http/home";
require("dayjs/locale/zh-cn");
require("dayjs/locale/zh-tw");
require("dayjs/locale/ja");

enum ETFTab {
  USBTCSpot = 1,
  HKBTCSpot,
  HKETFSpot,
}

export type Tab = {
  type: number;
  name: string;
  value: ETFTab;
  nameList: string[];
};

const tabs: Tab[] = [
  {
    type: 1,
    name: "US BTC Spot",
    value: ETFTab.USBTCSpot,
    nameList: [
      "Etf_btc_Fund_flow",
      "Etf_btc_Total_Net_Assets_Value",
      "AHR999_Indicator_value",
    ],
  },
  {
    type: 2,
    name: "HK BTC Spot",
    value: ETFTab.HKBTCSpot,
    nameList: [
      "Etf_hk_btc_Fund_flow",
      "Etf_btc_Total_Net_Assets_Value",
      "AHR999_Indicator_value",
    ],
  },
  {
    type: 3,
    name: "HK ETF Spot",
    value: ETFTab.HKETFSpot,
    nameList: [
      "Etf_hk_eth_Fund_flow",
      "Etf_btc_Total_Net_Assets_Value",
      "AHR999_Indicator_value",
    ],
  },
];

const Index = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation(["etf", "common"]);
  const [initData, setInitData] = React.useState<API.etfList[]>([]);
  const [showTopic, setShowTopic] = React.useState<boolean>(false);
  const [totalNetInflow, setTotalNetInflow] = React.useState(0);
  const [totalVolume, setTotalVolume] = React.useState(0);
  const [totalNetAssets, setTotalNetAssets] = React.useState(0);
  const [totalCumNetInflow, setTotalCumNetInflow] = React.useState(0);
  const [totalNetAssetsChange, setTotalNetAssetsChange] = React.useState(0);
  const [netInflowTime, setNetInflowTime] = React.useState("");
  const [premDscTime, setPremDscTime] = React.useState("");
  const [totalNavTime, setTotalNavTime] = React.useState("");
  const [volumeTime, setVolumeTime] = React.useState("");
  const [cumNetInflowTime, setCumNetInflowTime] = React.useState("");
  const [netAssetsChangeTime, setNetAssetsChangeTime] = React.useState("");
  const [updateTime, setUpdateTime] = React.useState("");
  const [initdata, setinitdata] = React.useState<API.historyList[]>([]);
  const [csvdata, setcsvdata] = React.useState<API.historyList[]>([]);
  const [lastNetInflow, setLastNetInflow] = React.useState<number>(0);
  const [currentSort, setCurrentSort] = useState("DESC");
  const [currentSortKey, setCurrentSortKey] = useState("totalNav");
  const [tabVal, setTabVal] = useState(tabs[0]);
  const [chartData, setChartData] = useState();
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
  const getAllSymbol = async (tab: Tab) => {
    const [data, res, result] = await Promise.all([
      getList({
        type: tab.type,
        isListing: 1,
        status: 1,
        orderItems: [{ asc: true, column: "sort" }],
      }).then((res) => res.data),
      getFindLastList({ type: tab.type }),
      getHistory({
        type: tab.type,
        orderItems: [{ asc: false, column: "data_date" }],
        pageNum: 1,
        pageSize: 1000,
      }),
    ]);
    let totalNetInflow = 0;
    let totalVolume = 0;
    let totalNetAssets = 0;
    let totalCumNetInflow = 0;
    let totalNetAssetsChange = 0;
    const nonData: any = [];
    const sortData: any = [];
    data.map((item: any) => {
      if (item["totalNav"] == null || item["totalNav"] == "-") {
        nonData.push(item);
      }
      if (item["totalNav"] != null) {
        sortData.push(item);
      }
    });
    let noneData = nonData.filter(
      (item: any) =>
        item["totalNav"] == "-" ||
        item["totalNav"] == "NaN" ||
        item["totalNav"] == null
    );
    let initData = sortData.filter(
      (item: any) =>
        item["totalNav"] != "-" &&
        item["totalNav"] != "NaN" &&
        item["totalNav"] != null
    );

    initData.sort(objectSort("totalNav", "DESC"));
    const dataReasult = initData ? initData.concat(noneData) : noneData;
    setNetInflowTime(Object.keys(res.data[0].netInflowMap)[0]);
    setPremDscTime(Object.keys(res.data[0].premDscMap)[0]);
    setTotalNavTime(Object.keys(res.data[0].totalNavMap)[0]);
    setVolumeTime(Object.keys(res.data[0].volumeTradedMap)[0]);
    setCumNetInflowTime(Object.keys(res.data[0].cumNetInflowMap)[0]);
    setNetAssetsChangeTime(Object.keys(res.data[0].netAssetsChangeMap)[0]);
    let netInflowMap =
      res.data[0].netInflowMap[Object.keys(res.data[0].netInflowMap)[0]];
    let netInflowMapLast =
      res.data[1].netInflowMap[Object.keys(res.data[1].netInflowMap)[0]];
    let premDscMap =
      res.data[0].premDscMap[Object.keys(res.data[0].premDscMap)[0]];
    let premDscMapLast =
      res.data[1].premDscMap[Object.keys(res.data[1].premDscMap)[0]];
    let totalNavMap =
      res.data[0].totalNavMap[Object.keys(res.data[0].totalNavMap)[0]];
    let totalNavMapLast =
      res.data[1].totalNavMap[Object.keys(res.data[1].totalNavMap)[0]];
    let volumeTradedMap =
      res.data[0].volumeTradedMap[Object.keys(res.data[0].volumeTradedMap)[0]];
    let volumeTradedMapLast =
      res.data[1].volumeTradedMap[Object.keys(res.data[1].volumeTradedMap)[0]];
    let cumNetInflowMap =
      res.data[0].cumNetInflowMap[Object.keys(res.data[0].cumNetInflowMap)[0]];
    let cumNetInflowMapLast =
      res.data[1].cumNetInflowMap[Object.keys(res.data[1].cumNetInflowMap)[0]];
    let netAssetsChangeMap =
      res.data[0].netAssetsChangeMap[
        Object.keys(res.data[0].netAssetsChangeMap)[0]
      ] || {};
    let netAssetsChangeMapLast =
      res.data[1].netAssetsChangeMap[
        Object.keys(res.data[1].netAssetsChangeMap)[0]
      ] || {};
    dataReasult.map((item: any, index: number) => {
      dataReasult[index]["netInflow"] = netInflowMap[dataReasult[index]["id"]];
      dataReasult[index]["premDsc"] = premDscMap[dataReasult[index]["id"]];
      premDscMapLast &&
        (dataReasult[index]["premDscLast"] =
          premDscMapLast[dataReasult[index]["id"]]);
      dataReasult[index]["totalNav"] = totalNavMap[dataReasult[index]["id"]];
      totalNavMapLast &&
        (dataReasult[index]["totalNavLast"] =
          totalNavMapLast[dataReasult[index]["id"]]);
      dataReasult[index]["volume"] = volumeTradedMap[dataReasult[index]["id"]];
      volumeTradedMapLast &&
        (dataReasult[index]["volumeLast"] =
          volumeTradedMapLast[dataReasult[index]["id"]]);
      cumNetInflowMap &&
        (dataReasult[index]["cumNetInflow"] =
          cumNetInflowMap[dataReasult[index]["id"]]);
      cumNetInflowMapLast &&
        (dataReasult[index]["cumNetInflowLast"] =
          cumNetInflowMapLast[dataReasult[index]["id"]]);
      dataReasult[index]["netAssetsChange"] =
        netAssetsChangeMap[dataReasult[index]["id"]];
      netAssetsChangeMapLast &&
        (dataReasult[index]["netAssetsChangeLast"] =
          netAssetsChangeMapLast[dataReasult[index]["id"]]);
      if (cumNetInflowMap && cumNetInflowMap[dataReasult[index]["id"]]) {
        totalCumNetInflow =
          totalCumNetInflow + +cumNetInflowMap[dataReasult[index]["id"]];
      }
      totalNetAssetsChange =
        totalNetAssetsChange +
        (+netAssetsChangeMap[dataReasult[index]["id"]]
          ? +netAssetsChangeMap[dataReasult[index]["id"]]
          : +netAssetsChangeMapLast[dataReasult[index]["id"]]);
    });
    let csvdata: any = [];
    let lastDayNum = 0;
    result.data.list.map((item: API.historyList) => {
      if (
        lastDayNum === 0 &&
        dayjs(item.dataDate).unix() <
          dayjs(Object.keys(res.data[0].cumNetInflowMap)[0]).unix()
      ) {
        lastDayNum = item.cumNetInflow;
      }
      csvdata.push({
        dataDate: dayjs(item.dataDate).format("MMM D,YYYY"),
        cumNetInflow: item.cumNetInflow
          ? transferMoney(item.cumNetInflow)
          : "Not updated",
        totalNetAssets: item.totalNetAssets
          ? transferMoney(item.totalNetAssets)
          : "Not updated",
        totalNetInflow: item.totalNetInflow
          ? transferMoney(item.totalNetInflow)
          : "Not updated",
        totalVolume: item.totalVolume
          ? transferMoney(item.totalVolume)
          : "Not updated",
      });
    });
    const init = dataReasult.map((item: any, index: number) => {
      let totalNav = item.totalNav ? +item.totalNav : +item.totalNavLast;
      if (item.netInflow) totalNetInflow = totalNetInflow + +item.netInflow;
      if (item.volume) totalVolume = totalVolume + +item.volume;
      totalNetAssets = +totalNetAssets + +totalNav;

      return {
        id: index + 1,
        ticker: item.ticker,
        exchangeName: item.exchangeName,
        inst: item.inst,
        mktPrice: item?.mktPrice,
        dailyChange: item?.dailyChange * 100,
        volume: item.volume,
        volumeLast: item.volumeLast,
        dailyVol: item.dailyVol,
        premDsc: item.premDsc * 100,
        premDscLast: item.premDscLast * 100,
        netInflow: item.netInflow,
        totalNav: item.totalNav,
        totalNavLast: item.totalNavLast,
        listingDate: item?.listingDate,
        cumNetInflow: item.cumNetInflow,
        cumNetInflowLast: item.cumNetInflowLast,
        netAssetsChange: item.netAssetsChange,
        netAssetsChangeLast: item.netAssetsChangeLast,
        status: item.isOpen,
        fee: item.fee * 100,
      };
    });
    //let list = [...data.list];
    setLastNetInflow(lastDayNum);
    setTotalNetAssetsChange(totalNetAssetsChange);
    setTotalNetInflow(totalNetInflow);
    setTotalVolume(totalVolume);
    setTotalNetAssets(totalNetAssets);
    setTotalCumNetInflow(totalCumNetInflow);
    setInitData(init);
    setcsvdata(csvdata);
    setinitdata(result.data.list);
  };
  const onTabChange = (tab: Tab) => {
    setTabVal(tab);
    getAllSymbol(tab);
    getChartData(tab);
  };
  const getChartData = (tab: Tab) => {
    getChartDatas({
      nameList: tab.nameList,
    }).then((res) => {
      setChartData(res.data);
    });
  };
  useEffect(() => {
    getAllSymbol(tabVal);
    // getChartData(tabVal);
  }, []);

  return (
    <>
      {/* <div className="h-10 flex items-stretch border-0 border-b border-solid border-[#333333]">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            className={`normal-case mx-2 text-sm font-bold ${
              tabVal.value === tab.value ? "text-primary" : "text-[#ADADAD]"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab.name}
          </Button>
        ))}
      </div> */}
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
        {/* <div className="flex items-center">
          <div
            className="text-xs text-[#8F8F8F] flex items-center w-[94px]"
            onClick={() => handleClick("netInflow")}
          >
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
          <div
            className="text-xs text-[#8F8F8F] min-w-[130px] flex justify-end items-center"
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
              <p className="p-0 m-0"> {t("Prem./Dsc.")}</p>
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
        </div> */}
      </div>
      <div className="pb-[140px] ">
        <div ref={listRef}>
          {initData?.map((item, index) => {
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
                          {!item.totalNav && (
                            <div className="text-[#ADADAD] text-sm flex items-center">
                              {"$" + transferMoney(+item.totalNavLast)}
                            </div>
                          )}
                          {item.totalNav && (
                            <div className="text-[#ADADAD] text-sm">
                              ${transferMoney(+item.totalNav)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-[94px] ml-1 text-[15px] text-[#F4F4F4] font-bold  text-right">
                        {!item.netInflow && +item.netInflow !== 0 && (
                          <span className=" italic pr-[1px]">Not updated</span>
                        )}
                        {+item.netInflow > 0 && (
                          <span className=" text-rise">
                            {"$" + transferMoney(Math.abs(+item.netInflow), 0)}
                          </span>
                        )}
                        {+item.netInflow < 0 && (
                          <span className=" text-fall">
                            {"-$" + transferMoney(Math.abs(+item.netInflow), 0)}
                          </span>
                        )}
                        {+item.netInflow === 0 && (
                          <span>
                            {"$" + transferMoney(Math.abs(+item.netInflow), 0)}
                          </span>
                        )}
                      </div>
                      <div className="text-[15px] text-[#F4F4F4] font-bold w-[94px] ml-1 mr-2 text-right truncate">
                        {!item.premDsc && +item.premDsc !== 0 && (
                          <div className=" italic pr-[1px] flex items-center justify-end">
                            <span className="max-w-[100px] inline-block truncate">
                              {(+item.premDscLast).toFixed(2) + "%"}
                            </span>
                          </div>
                        )}
                        {+item.premDsc > 0 && (
                          <span className="text-[#65C466]">
                            <BgFadeAnimate value={item.premDsc}>
                              +{(+item.premDsc).toFixed(2)}%
                            </BgFadeAnimate>
                          </span>
                        )}
                        {+item.premDsc < 0 && (
                          <span className="text-[#EB4E3D]">
                            <BgFadeAnimate value={item.premDsc}>
                              {(+item.premDsc).toFixed(2)}%
                            </BgFadeAnimate>
                          </span>
                        )}
                        {+item.premDsc === 0 && (
                          <span className="ml-2.5">0.00% </span>
                        )}
                        {item.premDsc === "-" && (
                          <span className="ml-2.5 text-right block">-</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="text-[15px] text-[#F4F4F4] font-bold flex items-center truncate">
                  <div>
                    {!item.netInflow && (
                      <span className=" italic pr-[1px]">Not updated</span>
                    )}
                    {+item.netInflow > 0 && (
                      <span className=" text-rise">
                        {"$" + transferMoney(Math.abs(+item.netInflow), 0)}
                      </span>
                    )}
                    {+item.netInflow < 0 && (
                      <span className=" text-fall">
                        {"-$" + transferMoney(Math.abs(+item.netInflow), 0)}
                      </span>
                    )}
                    {+item.netInflow === 0 && (
                      <span>
                        {"$" + transferMoney(Math.abs(+item.netInflow), 0)}
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-sm ml-2 min-w-[123px] text-right truncate">
                    {!item.premDsc && (
                      <div className=" italic pr-[1px] flex items-center justify-end">
                        <span className="max-w-[100px] inline-block truncate">
                          {(+item.premDscLast).toFixed(2) + "%"}
                        </span>
                      </div>
                    )}
                    {+item.premDsc > 0 && (
                      <span className="text-[#65C466]">
                        <BgFadeAnimate value={item.premDsc}>
                          +{(+item.premDsc).toFixed(2)}%
                        </BgFadeAnimate>
                      </span>
                    )}
                    {+item.premDsc < 0 && (
                      <span className="text-[#EB4E3D]">
                        <BgFadeAnimate value={item.premDsc}>
                          {(+item.premDsc).toFixed(2)}%
                        </BgFadeAnimate>
                      </span>
                    )}
                    {+item.premDsc === 0 && (
                      <span className="ml-2.5">0.00%</span>
                    )}
                    {item.premDsc === "-" && (
                      <span className="ml-2.5 text-right block">-</span>
                    )}
                  </div>
                </div> */}
                </Link>
              </div>
            );
          })}
        </div>
        {/* <ETFChart chartData={chartData} tab={tabVal} /> */}
      </div>
    </>
  );
};

export default Index;
