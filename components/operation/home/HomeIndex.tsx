import Button from "@mui/material/Button";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo, RefObject, useContext } from "react";
import Category from "components/operation/home/Category";
import Collection from "components/operation/home/Collection";
import Paper from "@mui/material/Paper";
import TableList from "components/operation/home/TableList";
import { useNavigateEvent } from "store/DirtyStore";
import MarketCup from "components/operation/home/MarketCup";
import {
  transferMoney,
  formatDecimal,
  objectSort,
  isBrowser,
  copyText,
} from "helper/tools";
import { getFindListToCurrency, categoriesList } from "http/home";
import BgFadeAnimate from "components/base/BgFadeAnimate";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";

import { useGweiWSData } from "store/WSStore/useGweiWSData";
import { useSectorWSData } from "store/WSStore/useSectorWSData";
import { useMarketCapWSData } from "store/WSStore/useMarketCapWSData";
import {
  useDebounce,
  useDebounceFn,
  useGetState,
  useMemoizedFn,
  useScroll,
  useUpdateEffect,
} from "ahooks";
import { useKlineWSData } from "store/WSStore/useKlineWSData";
import { useDomOffsetTop } from "hooks/useDomOffsetTop";
import { useGasWSData } from "store/WSStore/useGasWSData";
import { useWSState } from "store/WSStore";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

import { getHotNews } from "http/research";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import { useRouter } from "next/router";
import Link from "next/link";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import useNotistack from "hooks/useNotistack";
import { getPcWebsite } from "helper/config";
import { InternetContext } from "store/InternetContext";
import { trackCoinListFilter, trackFeedsExpose } from "helper/track";
const HeadArrowUpDown = ({
  isUp,
  isDown,
}: {
  isUp: boolean;
  isDown: boolean;
}) => {
  return (
    <div className="flex flex-col text-secondary-500-300 text-sm">
      <KeyboardArrowUp
        className={`text-[16px] -my-[4px] -mx-[3px] ${isUp ? "text-accent-600" : ""
          }`}
      />
      <KeyboardArrowDown
        className={`text-[16px] -my-[4px] -mx-[3px] ${isDown ? "text-accent-600" : ""
          }`}
      />
    </div>
  );
};

type Props = {
  initData: API.MarketCap[];
  cryptoTotalData: any;
  dataChartData: string;
  scrollToTop: boolean;
  btcGasData: string;
  changeScrollTo: (val: boolean) => void;
  findList: API.findListToCurrency[];
  scrollRef?: RefObject<HTMLElement>;
};

const Index = ({
  initData,
  cryptoTotalData,
  dataChartData,
  btcGasData,
  scrollToTop,
  changeScrollTo,
  findList: initFindList,
  scrollRef,
}: Props) => {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [data, setData, getData] = useGetState<API.MarketCap[]>(
    // initData.slice(0, 100)
    initData.slice(0)
  );
  const [soSoData, setSoSoData] = useGetState<API.MarketCap[]>(
    initData.slice(0, 100)
  );
  const [allData, setAllData] = useState<API.MarketCap[]>(initData);
  const [findList, setFindList] =
    useState<API.findListToCurrency[]>(initFindList);
  const [currentCategray, setCurrentCategray] = useState("Sector");
  const [all, setAll] = useState<string>("100");
  const [collectParams, setCollectParams] = useState<any>();
  const [gas, setGas] = useState<string>(dataChartData);
  const [btcGas, setBtcGas] = useState<string>(btcGasData);
  const [cryptoTotalList, serCryptoTotal] = useState<any>(cryptoTotalData);
  const [categaryOpen, setCategaryOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);

  const {onRequestTimeout} = useContext(InternetContext);

  const { gwei: gweiData } = useGweiWSData();
  const { gas: gasData } = useGasWSData();
  const { marketCap } = useMarketCapWSData();
  const { sector } = useSectorWSData();
  const [currentSort, setCurrentSort] = useState("DESC");
  const [currentSortKey, setCurrentSortKey] = useState("marketCap");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const wsOpen = useWSState();
  const open = Boolean(anchorEl);
  const { t } = useTranslation([localeType.HOME, localeType.COMMON]);
  const { t: tEtf } = useTranslation("etf");
  const { t: tCommon } = useTranslation(localeType.COMMON);
  const { subscribe1m, klineDataMap1m } = useKlineWSData({
    onKlineDataMap1m(klineDataMap1m) {
      getSocketPrice(klineDataMap1m);
    },
  });
  const scroll = useScroll(
    isBrowser ? (scrollRef?.current ? scrollRef.current : document.body) : null
  );

  const { ref: tableHeadRef, calcOffsetTop } =
    useDomOffsetTop<HTMLDivElement>();
  const isFixedHead = (scroll?.top || 0) > (calcOffsetTop() || 0);
  const getFindList = async () => {
    if (!findList?.length) {
      const findListToCurrency = await getFindListToCurrency({ status: 1 }, {onRequestTimeout});
      const categoriesData = await categoriesList({ status: 1 }, {onRequestTimeout});
      let list: API.findListToCurrency[] = [];
      findListToCurrency.data.forEach((item) => {
        categoriesData.data.forEach((items) => {
          if (item.fullName == items.fullName) {
            list.push({
              ...items,
              ...item,
              percentage: items.percentage,
              rate: items.rate,
            });
          }
        });
      });
      list.sort(objectSort("percentage", "DESC"));
      setFindList(list);
    }
  };

  /**
   *
   * @param {string} key 排序字段
   * @param {string} desc 排序方式
   * @returns {string} 返回格式化后的日期
   * @des 根据传入的排序字段和排序方式，返回排序后的新数组
   */
  const handleClick = (key: string, sort: "DESC" | "ASC" | "" = "") => {
    const changeData = [...data];
    const nonData: any = [];
    const sortData: any = [];
    if (!sort) {
      if (currentSort === "DESC") {
        sort = "ASC";
      } else if (currentSort === "ASC") {
        sort = "";
      } else if (currentSort === "") {
        sort = "DESC";
      }
      if (currentSortKey !== key) sort = "DESC";
    }
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
    trackCoinListFilter({
      coin_type:currentCategray,
      order_by:sort||"DESC",
      sort_key:key||"marketCap",
      search_keyword:""
  });
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
    if (value === "Sector") {
      setData([...allData]);
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
    trackCoinListFilter({
        coin_type:value,
        order_by:"DESC",
        sort_key:"marketCap",
        search_keyword:""
    });
  };
  const { run: debounceGetSocketPrice } = useDebounceFn(
    (priceData: any) => {
      let wsData = priceData;
      if (wsData) {
        const daydata = getData();
        const newData = daydata?.map((item: any, index) => {
          const newItem = { ...daydata[index] };
          const symbolKey = item && item?.exchangeName + "@" + item?.wsName;
          if (wsData[symbolKey]) {
            if (wsData[symbolKey]["U"]) newItem.price = wsData[symbolKey]["U"];
            if (wsData[symbolKey]["P"])
              newItem.changePercent = wsData[symbolKey]["P"];
            if (wsData[symbolKey]["c"])
              newItem.marketCap = wsData[symbolKey]["mv"];
          }
          return newItem;
        });

        setData(newData);
      }
    },
    { wait: 100 }
  );
  const getSocketPrice = useMemoizedFn(debounceGetSocketPrice);
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
      setData(allData.slice(0));
    }
  };
  useEffect(() => {
    subscribe1m<API.MarketCap>(initData, ({ exchangeName, wsName }) => ({
      exchangeName: exchangeName!,
      wsName: wsName!,
    }));
  }, []);
  useUpdateEffect(() => {
    setData(initData);
    // setData(initData.slice(0, 100));
    setSoSoData(initData.slice(0, 100));
    setAllData(initData);
    getFindList();
  }, [initData]);
  useNavigateEvent({
    onClickHome() {
      clickToTop();
      // changeScrollTo(true);
      //listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
  });
  const [hotNews, setHotNews] = useState([]);
  const getHot = async () => {
    const { data } = await getHotNews({
      pageNum: 0,
      pageSize: 2,
      status: 0,
    }, {onRequestTimeout});
    let list: any = [],exportList:{id:string,index:string}[]=[];
    data?.list &&
      data?.list.forEach((item: any,index) => {
        let contentInformationSourceList = item.contentInformationSourceList;
        contentInformationSourceList.sort(objectSort("weight"));
        list.push({ ...item, contentInformationSourceList });
        exportList.push({id:item.id,index:""+index});
      });
    setHotNews(list);
    exportList.length&&trackFeedsExpose("Market",exportList,"");
  };
  useEffect(() => {
    getHot();
  }, [router.locale]);
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

  useEffect(() => {
    gasData && setBtcGas(gasData);
  }, [gasData]);
  const clickToTop = useMemoizedFn(() => {
    if (scrollRef?.current?.scrollTop && scrollRef.current.scrollTop > 200) {
      scrollRef?.current?.scrollTo({ top: 100 });
    }
    scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
  });
  const selectVal = useMemo(() => {
    let val = currentSortKey + "_" + currentSort;
    if (["changePercent_DESC", "changePercent_ASC"].includes(val)) {
      return val;
    }
    return "";
  }, [currentSortKey, currentSort]);
  const changeSelect = useMemoizedFn((e: any) => {
    let [key, sort] = e.target.value?.split("_");
    if (key && sort) {
      handleClick(key, sort);
    }
  });
  const { success } = useNotistack();
  const copyPcIndexLink = () => {
    copyText(`${getPcWebsite()}/assets/cryptoIndex`);
    success("success");
  };
  return (
    <>
      <div className="p-4 relative">
        <div className="border-primary-100-700 border-[1px] border-solid rounded-lg bg-dropdown-White-800 relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="h-[80px]"
            slidesPerView="auto"
            direction="vertical"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              el: "#HomeSwiper",
              clickable: true,
              type: "bullets",
              bulletActiveClass: "bg-primary-900-White",
              bulletClass: "bg-primary-100-700 block w-2 h-2 rounded-lg",
            }}
            loop
          >
            <SwiperSlide>
              <div className="px-2 py-4 flex gap-4 flex-col box-border">
                <div className="flex items-center gap-2">
                  <div className="flex-[4] flex">
                    <MarketCup cryptoTotalList={cryptoTotalList} />
                  </div>
                  <div className="flex-[3] flex items-center">
                    <div className="text-xs text-secondary-500-300 whitespace-nowrap">
                      {t("24H Vol", {
                        ns: localeType.COMMON,
                      })}
                      :
                    </div>
                    <div className="text-xs ml-1 flex items-center">
                      ${transferMoney(cryptoTotalList?.volume)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-[4] flex">
                    <div className="text-xs text-secondary-500-300 whitespace-nowrap">
                      {t("ETH Gas")}:
                    </div>
                    <div className="text-xs ml-1 flex items-center">
                      <span>{gas}</span>
                      <span>
                        {t("Gwei", {
                          ns: localeType.COMMON,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex-[3] flex">
                    <div className="text-xs text-secondary-500-300 whitespace-nowrap">
                      {t("BTC Gas")}:
                    </div>
                    <div className="text-xs ml-1 flex items-center">
                      <span>{btcGas}</span>
                      <span>
                        {t("sat/vB", {
                          ns: localeType.COMMON,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            {hotNews?.length && (
              <SwiperSlide>
                <div className="pl-4 pr-6 py-4 flex gap-4 flex-col box-border">
                  {hotNews?.map((item: any, index: number) => {
                    return (
                      <Link
                        href={`/cluster/${item.id}`}
                        key={index + "new"}
                        className="flex no-underline flex-1 items-center gap-3 text-xs text-primary-900-White"
                      >
                        <div className="flex-shrink-0 text-secondary-500-300">
                          {index + 1}
                        </div>
                        <div className="flex-1 truncate">
                          {item?.title || " "}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </SwiperSlide>
            )}
            <SwiperSlide>
              <Link href="/brain-battle" className="pl-2 pr-5 py-3 h-full flex gap-4 flex-col box-border no-underline">
                {/* <div className="h-full w-full rounded-lg bg-hover-50-700 px-3 flex items-center box-border gap-2"> */}
                <div className="h-full w-full rounded-lg px-2 flex items-center box-border gap-2">
                  <div className="flex-1 flex-shrink-0 flex flex-col box-border overflow-hidden">
                    {/* <div className="text-xs truncate text-primary-900-White font-semibold">
                      {tCommon("SSI Indices Public Review")}
                    </div>
                    <div className="truncate text-secondary-500-300 text-[10px] pt-1">
                      {tCommon("Copy and browse it on PC to access!")}
                    </div> */}
                    <div className="text-lg font-bold line-clamp-2">
                      🧠⚡️<span className="text-lg font-bold bg-[linear-gradient(95deg,#FF4F20_0%,#FF8438_100%)] bg-clip-text text-[transparent]">LIVE: {
                        {
                          en: "Crypto Research Brain Battle Registration",
                          zh: "加密研究员 Brain Battle 大赛报名中",
                          tc: "加密研究員 Brain Battle 比賽報名中",
                          ja: "暗号通貨研究への Brain Battle 登録受付中",
                        }[router.locale as string]
                      }</span>
                    </div>
                  </div>
                  <div
                    // onClick={copyPcIndexLink}
                    className="flex-shrink-0 min-w-[68px] px-2 h-[24px] bg-brand-accent-600-600 rounded-lg whitespace-nowrap
                                    text-white-white text-xs flex items-center justify-center cursor-pointer"
                  >
                    {/* <span>{tCommon("Copy Link")}</span> */}
                    <span>{{
                      en: "Join Now",
                      zh: "立即参加",
                      tc: "立即參加",
                      ja: "今すぐ参加",
                    }[router.locale as string]}</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            {/* <SwiperSlide>
              <div className="pl-4 pr-8 py-3 h-full flex gap-4 flex-col box-border">
                <div className="h-full w-full rounded-lg bg-hover-50-700 px-2 flex items-center box-border gap-2">
                  <Image
                    width={28}
                    height={28}
                    src={"/img/home_ad_icon.png"}
                    alt=""
                  ></Image>
                  <div className="flex-1 flex-shrink-0 flex flex-col box-border overflow-hidden">
                    <div className="truncate text-sm text-primary-900-White">
                      Join DexCheck Pad
                    </div>
                    <div className="truncate text-secondary-500-300 text-xs">
                      Invest Early in Top Crypto Projects
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 w-[30px] h-[20px] border-[1px] border-solid border-[#BFDBFE] bg-[#EFF6FF] rounded-lg
                                    text-[#1D4ED8] text-xs flex items-center justify-center"
                  >
                    <span>Ad</span>
                  </div>
                </div>
              </div>
            </SwiperSlide> */}
          </Swiper>
          <div className="absolute right-[6px] top-0 bottom-0 flex-col flex items-center justify-center z-10">
            <div
              id="HomeSwiper"
              className="flex-col flex items-center justify-center gap-2"
            ></div>
          </div>
        </div>
      </div>
      {/* box-shadow: 0px 4px 8px 0px rgba(10, 10, 10, 0.10), 0px 2px 4px 0px rgba(10, 10, 10, 0.08); */}
      <div className="px-4 flex  gap-2 items-stretch">
        <Button
          onClick={() => setCategaryOpen(true)}
          className="text-sm shadow-[0_1px_2px_0_rgba(10,10,10,0.06)] flex items-center capitalize rounded-lg min-w-[90px]
                        text-primary-900-White border-primary-100-700 bg-background-secondary-White-700
                      border-[1px] border-solid h-8"
        >
          <span className="mr-2">
            {currentCategray === "Sector"
              ? t("Sector")
              : currentCategray || t("Category")}
          </span>
          {categaryOpen && <KeyboardArrowUp className="text-xl" />}
          {!categaryOpen && <KeyboardArrowDown className="text-xl" />}
        </Button>
        <div className="h-8 flex-1 p-[1px] gap-1 box-border  rounded-lg flex items-center  justify-between border-[1px] border-solid border-primary-100-700">
          <div
            className={`rounded-md h-full flex-[2] text-center text-sm px-3   items-center justify-center flex
                    ${currentSortKey === "marketCap"
                ? "text-accent-600 bg-background-secondary-White-700 shadow-[0_4px_8px_0_rgba(10,10,10,0.1),0_2px_4px_0_rgba(10,10,10,0.08)]"
                : "text-primary-900-White"
              }`}
            onClick={() => handleClick("marketCap")}
          >
            <span>{t("Market Cap")}</span>
          </div>
          <div
            className={`rounded-md flex-[3]  h-full  text-xs text-center py-[4px]
              ${currentSortKey === "changePercent"
                ? "text-accent-600 bg-background-secondary-White-700 shadow-[0_4px_8px_0_rgba(10,10,10,0.1),0_2px_4px_0_rgba(10,10,10,0.08)]"
                : "text-primary-900-White"
              }`}
          >
            <Select
              className="w-full p-0"
              onChange={changeSelect}
              variant="standard"
              displayEmpty
              input={
                <OutlinedInput
                  fullWidth
                  className="p-0 w-full"
                  classes={{
                    input: `h-full py-0 !bg-[transparent] text-sm px-4 
                            ${"changePercent" == currentSortKey
                        ? "text-accent-600"
                        : "text-primary-900-white"
                      }`,
                    notchedOutline: `border-0`,
                  }}
                />
              }
              renderValue={(val) =>
                "changePercent_ASC" == val
                  ? tEtf("Top Loser")
                  : tEtf("Top Gainer")
              }
              value={selectVal}
              MenuProps={{
                classes: {
                  root: "mt-3",
                  paper: "rounded-lg",
                  list: "p-0",
                },
                sx: {
                  ".Mui-selected": {
                    color: "var(--accent-600)",
                  },
                },
              }}
            >
              <MenuItem
                className="text-sm justify-center bg-[transparent] px-3 py-0"
                value="changePercent_DESC"
              >
                {tEtf("Top Gainer")}
              </MenuItem>
              <MenuItem
                className="text-sm justify-center bg-[transparent] px-3 py-0"
                value="changePercent_ASC"
              >
                {tEtf("Top Loser")}
              </MenuItem>
            </Select>
          </div>
          {/* <div
              onClick={() => changeTab("all")}
              className={`rounded-lg text-primary-900-White text-xs px-3 py-[6px] border-primary-100-700 
                              border-[1px] border-solid ${
                                all === "all"
                                  ? "bg-accent-600"
                                  : "bg-background-secondary-White-700"
                              } `}
            >
              {t("All coin")}
            </div>
            <div onClick={() => changeTab("100")}
            className={`rounded-lg flex items-center justify-center text-primary-900-White 
                          text-xs px-3 py-[6px] border-primary-100-700
                          border-[1px] border-solid ${
                            all === "100"
                              ? "bg-accent-600"
                              : "bg-background-secondary-White-700"
                          } `}
            >
              <span>{t("SoSo Watchlist 100")}</span>
            </div> */}
        </div>
      </div>
      <div className="px-4 flex items-center justify-between">
        <Category
          onClose={() => setCategaryOpen(false)}
          open={categaryOpen}
          findList={findList}
          currentCategray={currentCategray}
          changeCategray={changeCategray}
        />
      </div>
      <div className="pt-4 px-4">
        <div
          ref={tableHeadRef}
          className="border-t-primary-100-700 border-0 border-t-[1px] border-solid min-h-[41px]"
        >
          <div
            className={`${isFixedHead
              ? "fixed left-0 top-0 w-full z-10 px-4 bg-background-primary-White-900"
              : ""
              }`}
          >
            <div
              className="flex items-center text-secondary-500-300 text-xs py-3 font-bold
                            border-b-primary-100-700 border-0 border-b-[1px] border-solid
                        "
            >
              <div className="w-[20px] h-1"></div>
              <div className="w-[40px] text-center">#</div>
              <div
                className="flex-1 text-center flex"
                onClick={() => handleClick("marketCap")}
              >
                <div className="mr-1 whitespace-nowrap">{t("Market Cap1")}</div>
                <HeadArrowUpDown
                  isUp={
                    currentSortKey === "marketCap" &&
                    currentSort === "ASC" &&
                    wsOpen
                  }
                  isDown={
                    currentSortKey === "marketCap" &&
                    currentSort === "DESC" &&
                    wsOpen
                  }
                />
              </div>
              <div
                className="flex-1 text-center flex justify-end"
                onClick={() => handleClick("price")}
              >
                <div className="mr-1">{t("Price")}</div>
                <HeadArrowUpDown
                  isUp={
                    currentSortKey === "price" &&
                    currentSort === "ASC" &&
                    wsOpen
                  }
                  isDown={
                    currentSortKey === "price" &&
                    currentSort === "DESC" &&
                    wsOpen
                  }
                />
              </div>
              <div
                className="w-[80px] text-center flex justify-end"
                onClick={() => handleClick("changePercent")}
              >
                <div className="mr-1">24h %</div>
                <HeadArrowUpDown
                  isUp={
                    currentSortKey === "changePercent" &&
                    currentSort === "ASC" &&
                    wsOpen
                  }
                  isDown={
                    currentSortKey === "changePercent" &&
                    currentSort === "DESC" &&
                    wsOpen
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pb-[140px]">
          {data && data?.length > 0 && (
            <TableList
              isSocket={wsOpen}
              rows={data}
              scrollToTop={scrollToTop}
              changeScrollTo={changeScrollTo}
              scrollRef={scrollRef}
            />
          )}
          {isFixedHead && (
            <div
              onClick={clickToTop}
              className="fixed bottom-[130px] w-11 h-11 rounded-[50%] bg-primary-900-White flex items-center 
                        z-10 justify-center right-4"
            >
              <KeyboardArrowUp className="text-background-primary-White-900 text-2xl" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
