import Button from "@mui/material/Button";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Category from "components/operation/home/Category";
import Collection from "components/operation/home/Collection";
// import Paper from "@mui/material/Paper";
// import TableList from "components/operation/home/TableList";
import { useNavigateEvent } from "store/DirtyStore";
import MarketCup from "components/operation/home/MarketCup";
import {
  transferMoney,
  formatDecimal,
  objectSort,
  replace0,
} from "helper/tools";
import { getFindListToCurrency, categoriesList } from "http/home";
import BgFadeAnimate from "components/base/BgFadeAnimate";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";

import { useGweiWSData } from "store/WSStore/useGweiWSData";
import { useSectorWSData } from "store/WSStore/useSectorWSData";
import { useMarketCapWSData } from "store/WSStore/useMarketCapWSData";
import { useGetState } from "ahooks";
import { useKlineWSData } from "store/WSStore/useKlineWSData";
import Link from "next/link";
import CollectMenu from "../user/CollectMenu";
import useWindowHeight from "hooks/useWindowHeight";
import { Virtuoso } from "react-virtuoso";

type Props = {
  initData: API.MarketCap[];
  cryptoTotalData: any;
  dataChartData: string;
  scrollToTop: boolean;
  changeScrollTo: (val: boolean) => void;
  children: React.ReactNode;
};

// const TopContent1 = React.memo(
//   ({
//     children,
//     cryptoTotalList,
//     gas,
//     all,
//     changeTab,
//     setCategaryOpen,
//     currentCategray,
//     categaryOpen,
//     findList,
//     changeCategray,
//     handleClick,
//     currentSortKey,
//     currentSort,
//     socketSuccess,
//   }: any) => {
//     const { t } = useTranslation([localeType.HOME, localeType.COMMON]);
//     return (
//       <div className="relative">
//         {children}

//         <div className="px-4 py-3 flex items-center">
//           <div className="w-2/5 h-full">
//             <MarketCup cryptoTotalList={cryptoTotalList} />
//           </div>
//           <div className="flex items-center w-3/5">
//             <div className="border-0 flex-1 border-l-[1px] border-solid border-[#404040] ml-2 pl-3">
//               <div className="text-xs text-[#C2C2C2] leading-5">
//                 {t("24H Vol", { ns: localeType.COMMON })}
//               </div>
//               <div className="mt-[4px] text-sm text-[#F4F4F4] font-bold">
//                 ${transferMoney(cryptoTotalList?.volume)}
//               </div>
//             </div>
//             <div className="border-0 flex-1 border-l-[1px] border-solid border-[#404040] ml-1 pl-3">
//               <Image src="/img/GasPump.svg" alt="" width={16} height={16} />
//               <div className="text-sm text-[#F4F4F4] font-bold">
//                 {gas} {t("Gwei", { ns: localeType.COMMON })}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="h-[1px] bg-[#fff]/[0.2] m-0 scale-y-50"></div>
//         <div className="px-4 py-3 flex items-center justify-between">
//           <div
//             className={`text-sm flex items-center ${
//               all === "100" ? "text-[#F4F4F4]" : "text-[#8F8F8F]"
//             }`}
//             onClick={() => changeTab("100")}
//           >
//             {t("SoSo Watchlist 100")}
//           </div>
//           <div
//             className={`text-sm flex items-center ${
//               all === "all" ? "text-[#F4F4F4]" : "text-[#8F8F8F]"
//             }`}
//             onClick={() => changeTab("all")}
//           >
//             {t("All coin")}
//           </div>
//           <Button
//             onClick={() => setCategaryOpen(true)}
//             className={`text-[#C2C2C2] text-xs bg-[#6A6A6A]/[.16] px-2 py-1 rounded-[23px] flex items-center capitalize ${
//               currentCategray && currentCategray != "All"
//                 ? "bg-[#FF4F20] text-[#fff]"
//                 : ""
//             }`}
//           >
//             {currentCategray ? currentCategray : t("Category")}
//             <Image
//               className="ml-[10px]"
//               src={
//                 currentCategray
//                   ? "/img/svg/home/category_active.svg"
//                   : "/img/svg/home/category.svg"
//               }
//               width={20}
//               height={20}
//               alt=""
//             />
//           </Button>
//           <Category
//             onClose={() => setCategaryOpen(false)}
//             open={categaryOpen}
//             findList={findList}
//             currentCategray={currentCategray}
//             changeCategray={changeCategray}
//           />
//         </div>

//         {/* 表头 # Market Cap*/}
//         <div className="pl-4 flex items-center pr-8 justify-between table_Head sticky top-0 z-20">
//           <div className={`text-xs flex items-center`}>
//             <div
//               className="w-6 text-[#8F8F8F]"
//               onClick={() => handleClick("marketCap")}
//             >
//               #
//             </div>
//             <div
//               className="text-[#8F8F8F]"
//               onClick={() => handleClick("marketCap")}
//             >
//               {t("Market Cap")}
//             </div>
//             <div
//               className="ml-1 cursor-pointer"
//               onClick={() => handleClick("marketCap")}
//             >
//               <Image
//                 src={`${
//                   currentSortKey === "marketCap" && currentSort === "ASC"
//                     ? "/img/svg/home/circle_active.svg"
//                     : "/img/svg/home/circle.svg"
//                 }`}
//                 width={7}
//                 height={4}
//                 alt=""
//                 className={`${
//                   currentSortKey === "marketCap" && currentSort === "ASC"
//                     ? "block rotate-180"
//                     : "block"
//                 }`}
//               />
//               <Image
//                 src={`${
//                   currentSortKey === "marketCap" &&
//                   currentSort === "DESC" &&
//                   socketSuccess
//                     ? "/img/svg/home/circle_active.svg"
//                     : "/img/svg/home/circle.svg"
//                 }`}
//                 width={7}
//                 height={4}
//                 alt=""
//                 className={`${
//                   currentSortKey === "marketCap" &&
//                   currentSort === "DESC" &&
//                   socketSuccess
//                     ? "block mt-1"
//                     : "block mt-1 rotate-180"
//                 }`}
//               />
//             </div>
//           </div>
//           {/* price */}
//           <div
//             className={`text-xs text-[#8F8F8F] flex mr-6 items-center`}
//             onClick={() => handleClick("price")}
//           >
//             <div className="mr-1">
//               <Image
//                 src={`${
//                   currentSortKey === "price" && currentSort === "ASC"
//                     ? "/img/svg/home/circle_active.svg"
//                     : "/img/svg/home/circle.svg"
//                 }`}
//                 width={7}
//                 height={4}
//                 alt=""
//                 className={`${
//                   currentSortKey === "price" && currentSort === "ASC"
//                     ? "block rotate-180"
//                     : "block"
//                 }`}
//               />
//               <Image
//                 src={`${
//                   currentSortKey === "price" && currentSort === "DESC"
//                     ? "/img/svg/home/circle_active.svg"
//                     : "/img/svg/home/circle.svg"
//                 }`}
//                 width={7}
//                 height={4}
//                 alt=""
//                 className={`${
//                   currentSortKey === "price" && currentSort === "DESC"
//                     ? "block mt-1"
//                     : "block mt-1 rotate-180"
//                 }`}
//               />
//             </div>
//             <div>{t("Price")}</div>
//           </div>
//           {/* 24H */}
//           <div
//             className={`text-xs text-[#8F8F8F] flex items-center mr-4`}
//             onClick={() => handleClick("changePercent")}
//           >
//             {/* <div>{t("Price")}</div> */}
//             <div className="mr-1">
//               <Image
//                 src={`${
//                   currentSortKey === "changePercent" && currentSort === "ASC"
//                     ? "/img/svg/home/circle_active.svg"
//                     : "/img/svg/home/circle.svg"
//                 }`}
//                 width={7}
//                 height={4}
//                 alt=""
//                 className={`${
//                   currentSortKey === "changePercent" && currentSort === "ASC"
//                     ? "block rotate-180"
//                     : "block"
//                 }`}
//               />
//               <Image
//                 src={`${
//                   currentSortKey === "changePercent" && currentSort === "DESC"
//                     ? "/img/svg/home/circle_active.svg"
//                     : "/img/svg/home/circle.svg"
//                 }`}
//                 width={7}
//                 height={4}
//                 alt=""
//                 className={`${
//                   currentSortKey === "changePercent" && currentSort === "DESC"
//                     ? "block mt-1"
//                     : "block mt-1 rotate-180"
//                 }`}
//               />
//             </div>
//             <div>24h %</div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// 虚拟列表
const RowContent = (_index: number, item: any, isSocket: boolean) => {
  return (
    <div key={`tr_${item.coin}`}>
      <div
        key={item.coin + _index}
        className="py-2 px-4 flex item-center justify-between"
      >
        <Link
          href={`/trade/${item?.baseAsset}-${
            item?.quoteAsset
          }-${item?.exchangeName?.toUpperCase()}`}
          className="w-full flex  item-center justify-between no-underline"
        >
          <div className="text-xs text-[#8F8F8F] flex items-center">
            <div className="text-[#F4F4F4] flex items-center">
              <div className={`min-w-[24px] ${!isSocket && "text-[#5C5C5C]"}`}>
                {_index}
              </div>
              <Image
                src={item.coinImg}
                width={32}
                height={32}
                alt=""
                className="rounded-full"
              />
              <div className="ml-3">
                <div
                  className={`text-base font-bold ${
                    !isSocket ? "text-[#5C5C5C]" : "text-[#F2F2F2]"
                  }  max-w-[55px] truncate`}
                >
                  {item.coin}
                </div>
                <div
                  className={`${
                    !isSocket ? "text-[#5C5C5C]" : "text-[#8F8F8F]"
                  }`}
                >
                  ${transferMoney(+item.marketCap)}
                </div>
              </div>
            </div>
          </div>
          <div className="text-[15px] text-[#F4F4F4] font-bold flex items-center">
            <div className={`${!isSocket && "text-[#5C5C5C]"}`}>
              ${replace0(formatDecimal(item.price))}
            </div>
            <div className="font-medium ml-2 min-w-[64px] text-right">
              {+item.changePercent > 0 && (
                <span
                  className={`${
                    !isSocket ? "text-[#5C5C5C]" : "text-[#65C466]"
                  }`}
                >
                  <BgFadeAnimate value={item.changePercent}>
                    +{(+item.changePercent).toFixed(2)}%
                  </BgFadeAnimate>
                </span>
              )}
              {+item.changePercent < 0 && (
                <span
                  className={`${
                    !isSocket ? "text-[#5C5C5C]" : "text-[#EB4E3D]"
                  }`}
                >
                  <BgFadeAnimate value={item.changePercent}>
                    {(+item.changePercent).toFixed(2)}%
                  </BgFadeAnimate>
                </span>
              )}
              {+item.changePercent === 0 && (
                <span
                  className={`ml-2.5 ${
                    !isSocket ? "text-[#5C5C5C]" : "text-[#8F8F8F]"
                  }`}
                >
                  0.00%
                </span>
              )}
              {item.changePercent === "-" && (
                <span
                  className={`ml-2.5 text-right block ${
                    !isSocket ? "text-[#5C5C5C]" : "text-[#8F8F8F]"
                  }`}
                >
                  -
                </span>
              )}
            </div>
            <CollectMenu
              symbolId={item.symbolId}
              className={`ml-2 ${
                !isSocket ? "text-[#5C5C5C]" : "text-[#adadad]"
              }`}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

const Index = ({
  initData,
  cryptoTotalData,
  dataChartData,
  scrollToTop,
  changeScrollTo,
  children,
}: Props) => {
  const windowHeight = useWindowHeight();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [data, setData, getData] = useGetState<API.MarketCap[]>([]);
  const [soSoData, setSoSoData] = useGetState<API.MarketCap[]>([]);
  const [allData, setAllData] = useState<API.MarketCap[]>([]);
  const [findList, setFindList] = useState<API.findListToCurrency[]>([]);
  const [currentCategray, setCurrentCategray] = useState("All");
  const [all, setAll] = useState<string>("100");
  const [collectParams, setCollectParams] = useState<any>();
  const [gas, setGas] = useState<string>(dataChartData);
  const [cryptoTotalList, serCryptoTotal] = useState<any>(cryptoTotalData);
  const [categaryOpen, setCategaryOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);

  const { gwei: gweiData } = useGweiWSData();
  const { marketCap } = useMarketCapWSData();
  const { sector } = useSectorWSData();
  const [currentSort, setCurrentSort] = useState("DESC");
  const [currentSortKey, setCurrentSortKey] = useState("marketCap");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [socketSuccess, setSocketSuccess] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const { t } = useTranslation([localeType.HOME, localeType.COMMON]);
  const { subscribe1m, klineDataMap1m } = useKlineWSData({
    onKlineDataMap1m(klineDataMap1m) {
      getSocketPrice(klineDataMap1m);
    },
  });

  const getFindList = async () => {
    const findListToCurrency = await getFindListToCurrency({ status: 1 });
    const categoriesData = await categoriesList({ status: 1 });
    let findList: API.findListToCurrency[] = [];
    findListToCurrency.data.forEach((item) => {
      categoriesData.data.forEach((items) => {
        if (item.fullName == items.fullName) {
          findList.push({
            ...items,
            ...item,
            percentage: items.percentage,
            rate: items.rate,
          });
        }
      });
    });
    findList.sort(objectSort("percentage", "DESC"));
    setFindList(findList);
  };

  /**
   *
   * @param {string} key 排序字段
   * @param {string} desc 排序方式
   * @returns {string} 返回格式化后的日期
   * @des 根据传入的排序字段和排序方式，返回排序后的新数组
   */
  const handleClick = (key: string) => {
    const changeData = [...data];
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

    let noneData = sortData.filter(
      (item: any) => item[key] == "-" || item[key] == "NaN" || item[key] == null
    );
    let initData = sortData.filter(
      (item: any) => item[key] != "-" && item[key] != "NaN" && item[key] != null
    );
    if (sort === "") {
      initData.sort(objectSort("marketCap", "DESC"));
    } else {
      initData.sort(objectSort(key, sort));
    }
    const dataReasult = initData.concat(noneData);
    const arr1 = dataReasult?.map((item: any, index: number) => {
      return {
        ...item,
        id: index + 1,
      };
    });
    setData(arr1);
    if (sort === "") {
      setCurrentSort("DESC");
      setCurrentSortKey("marketCap");
    } else {
      setCurrentSort(sort);
      setCurrentSortKey(key);
    }
  };
  /**
   *
   * @param {object} current 选中的板块列表
   * @returns {string} 返回新的行情数组
   * @des 根据传入的板块列表，返回新的行情列表
   */

  const changeCategray = (value: string) => {
    setCurrentCategray(value);
    setCurrentSort("DESC");
    setCurrentSortKey("marketCap");
    setAll("");
    if (value === "All") {
      setData(soSoData);
    } else {
      let coinList: string[] = [];
      const dataList = [...allData];
      findList.map((item) => {
        if (item.fullName === value) {
          item?.currencyDoVOS?.forEach((items) => {
            coinList.push(items.name.toUpperCase());
          });
        }
      });
      const arr = dataList.filter((item) => coinList.indexOf(item.coin) != -1);
      arr.sort(objectSort("marketCap", "DESC"));
      const arr1 = arr.map((item, index) => {
        return {
          ...item,
          id: index + 1,
        };
      });
      setData(arr1);
      setCurrentSort("DESC");
      setCurrentSortKey("marketCap");
    }
  };

  const getSocketPrice = (priceData: any) => {
    setSocketSuccess(true);
    let wsData = priceData;
    if (wsData) {
      const daydata = getData();
      daydata?.map((item: any, index) => {
        let itemIndex = index;
        daydata[itemIndex] = { ...daydata[itemIndex] };
        let symbolKey = item && item?.exchangeName + "@" + item?.wsName;
        if (wsData[symbolKey]) {
          if (wsData[symbolKey]["U"])
            daydata[itemIndex].price = wsData[symbolKey]["U"];
          if (wsData[symbolKey]["P"])
            daydata[itemIndex].changePercent = wsData[symbolKey]["P"];
          if (wsData[symbolKey]["c"])
            daydata[itemIndex].marketCap = wsData[symbolKey]["mv"];
        }
      });

      setData(daydata);
    }
  };

  const getSector = (sector: Array<any>) => {
    const arrList = findList?.map((item) => {
      const arr =
        sector &&
        sector.find(
          (i) => i?.full_name.toUpperCase() == item?.name.toUpperCase()
        );
      return {
        ...item,
        ...arr,
      };
    });
    setFindList(arrList);
  };
  //处理Gwei推送
  const getSocketGwei = (socketData: any) => {
    setGas(socketData);
  };
  const changeTab = (val: string) => {
    setAll(val);
    changeScrollTo(true);
    setCurrentCategray("All");
    setCurrentSort("DESC");
    setCurrentSortKey("marketCap");
    if (val === "100") {
      setData(allData.slice(0, 100));
    } else {
      setData(allData);
    }
  };

  useEffect(() => {
    subscribe1m<API.MarketCap>(initData, ({ exchangeName, wsName }) => ({
      exchangeName: exchangeName!,
      wsName: wsName!,
    }));
  }, []);
  useEffect(() => {
    setData(initData.slice(0, 100));
    setSoSoData(initData.slice(0, 100));
    setAllData(initData);
    getFindList();
  }, []);
  useNavigateEvent({
    onClickHome() {
      changeScrollTo(true);
      //listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  useEffect(() => {
    // 接受到socket数据， 进行业务逻辑处理

    if (sector) {
      getSector(sector);
    }
    if (gweiData) {
      getSocketGwei((+gweiData).toFixed(2));
    }
    if (marketCap) {
      serCryptoTotal({
        ...cryptoTotalList,
        soSoMarketCap: marketCap?.marketcap,
        soSoChange: marketCap?.rate,
      });
    }
  }, [gweiData, sector, marketCap]);

  const HeaderTop = () => (
    <>
      {children}

      <div className="px-4 py-3 flex items-center">
        <div className="w-2/5 h-full">
          <MarketCup cryptoTotalList={cryptoTotalList} />
        </div>
        <div className="flex items-center w-3/5">
          <div className="border-0 flex-1 border-l-[1px] border-solid border-[#404040] ml-2 pl-3">
            <div className="text-xs text-[#C2C2C2] leading-5">
              {t("24H Vol", { ns: localeType.COMMON })}
            </div>
            <div className="mt-[4px] text-sm text-[#F4F4F4] font-bold">
              ${transferMoney(cryptoTotalList?.volume)}
            </div>
          </div>
          <div className="border-0 flex-1 border-l-[1px] border-solid border-[#404040] ml-1 pl-3">
            <Image src="/img/GasPump.svg" alt="" width={16} height={16} />
            <div className="text-sm text-[#F4F4F4] font-bold">
              {gas} {t("Gwei", { ns: localeType.COMMON })}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#fff]/[0.2] m-0 scale-y-50"></div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div
          className={`text-sm flex items-center ${
            all === "100" ? "text-[#F4F4F4]" : "text-[#8F8F8F]"
          }`}
          onClick={() => changeTab("100")}
        >
          {t("SoSo Watchlist 100")}
        </div>
        <div
          className={`text-sm flex items-center ${
            all === "all" ? "text-[#F4F4F4]" : "text-[#8F8F8F]"
          }`}
          onClick={() => changeTab("all")}
        >
          {t("All coin")}
        </div>
        <Button
          onClick={() => setCategaryOpen(true)}
          className={`text-[#C2C2C2] text-xs bg-[#6A6A6A]/[.16] px-2 py-1 rounded-[23px] flex items-center capitalize ${
            currentCategray && currentCategray != "All"
              ? "bg-[#FF4F20] text-[#fff]"
              : ""
          }`}
        >
          {currentCategray ? currentCategray : t("Category")}
          <Image
            className="ml-[10px]"
            src={
              currentCategray
                ? "/img/svg/home/category_active.svg"
                : "/img/svg/home/category.svg"
            }
            width={20}
            height={20}
            alt=""
          />
        </Button>
        <Category
          onClose={() => setCategaryOpen(false)}
          open={categaryOpen}
          findList={findList}
          currentCategray={currentCategray}
          changeCategray={changeCategray}
        />
      </div>

      {/* 表头 # Market Cap*/}
      <div className="pl-4 flex items-center pr-8 justify-between table_Head sticky top-0 z-20">
        <div className={`text-xs flex items-center`}>
          <div
            className="w-6 text-[#8F8F8F]"
            onClick={() => handleClick("marketCap")}
          >
            #
          </div>
          <div
            className="text-[#8F8F8F]"
            onClick={() => handleClick("marketCap")}
          >
            {t("Market Cap")}
          </div>
          <div
            className="ml-1 cursor-pointer"
            onClick={() => handleClick("marketCap")}
          >
            <Image
              src={`${
                currentSortKey === "marketCap" && currentSort === "ASC"
                  ? "/img/svg/home/circle_active.svg"
                  : "/img/svg/home/circle.svg"
              }`}
              width={7}
              height={4}
              alt=""
              className={`${
                currentSortKey === "marketCap" && currentSort === "ASC"
                  ? "block rotate-180"
                  : "block"
              }`}
            />
            <Image
              src={`${
                currentSortKey === "marketCap" &&
                currentSort === "DESC" &&
                socketSuccess
                  ? "/img/svg/home/circle_active.svg"
                  : "/img/svg/home/circle.svg"
              }`}
              width={7}
              height={4}
              alt=""
              className={`${
                currentSortKey === "marketCap" &&
                currentSort === "DESC" &&
                socketSuccess
                  ? "block mt-1"
                  : "block mt-1 rotate-180"
              }`}
            />
          </div>
        </div>
        {/* price */}
        <div
          className={`text-xs text-[#8F8F8F] flex mr-6 items-center`}
          onClick={() => handleClick("price")}
        >
          <div className="mr-1">
            <Image
              src={`${
                currentSortKey === "price" && currentSort === "ASC"
                  ? "/img/svg/home/circle_active.svg"
                  : "/img/svg/home/circle.svg"
              }`}
              width={7}
              height={4}
              alt=""
              className={`${
                currentSortKey === "price" && currentSort === "ASC"
                  ? "block rotate-180"
                  : "block"
              }`}
            />
            <Image
              src={`${
                currentSortKey === "price" && currentSort === "DESC"
                  ? "/img/svg/home/circle_active.svg"
                  : "/img/svg/home/circle.svg"
              }`}
              width={7}
              height={4}
              alt=""
              className={`${
                currentSortKey === "price" && currentSort === "DESC"
                  ? "block mt-1"
                  : "block mt-1 rotate-180"
              }`}
            />
          </div>
          <div>{t("Price")}</div>
        </div>
        {/* 24H */}
        <div
          className={`text-xs text-[#8F8F8F] flex items-center mr-4`}
          onClick={() => handleClick("changePercent")}
        >
          {/* <div>{t("Price")}</div> */}
          <div className="mr-1">
            <Image
              src={`${
                currentSortKey === "changePercent" && currentSort === "ASC"
                  ? "/img/svg/home/circle_active.svg"
                  : "/img/svg/home/circle.svg"
              }`}
              width={7}
              height={4}
              alt=""
              className={`${
                currentSortKey === "changePercent" && currentSort === "ASC"
                  ? "block rotate-180"
                  : "block"
              }`}
            />
            <Image
              src={`${
                currentSortKey === "changePercent" && currentSort === "DESC"
                  ? "/img/svg/home/circle_active.svg"
                  : "/img/svg/home/circle.svg"
              }`}
              width={7}
              height={4}
              alt=""
              className={`${
                currentSortKey === "changePercent" && currentSort === "DESC"
                  ? "block mt-1"
                  : "block mt-1 rotate-180"
              }`}
            />
          </div>
          <div>24h %</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Virtuoso
        style={{
          height: windowHeight - 140 + "px",
          width: "100%",
          // paddingBottom: "140px",
        }} // 根据需要调整尺寸
        data={["Top", ...data]}
        // groupCounts={[0, data.length]}
        itemContent={(index, item) => {
          if (index === 0) {
            return HeaderTop();
          }
          return RowContent(index, item, socketSuccess);
        }}
        // components={{
        //   Header: Header,
        // }}
      ></Virtuoso>
      <Collection
        onClose={() => setCollectOpen(false)}
        open={collectOpen}
        findList={findList}
        collectParams={collectParams}
        currentCategray={currentCategray}
      />
    </>
  );
};

export default Index;
