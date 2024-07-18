import { useContext, useEffect, useRef, useState, useMemo } from "react";
import NavigateWrap from "components/layout/NavigateWrap";
import Link from "next/link";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Language from "components/operation/home/Language";
import { Button, IconButton, Tooltip } from "@mui/material";
import { UserContext } from "store/UserStore";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { updateQuery } from "helper";
import CustomTip from "components/base/CustomTip";
import Header from "components/header";
// import SwiperBanner from "components/operation/home/SwiperBanner";
import Index from "components/operation/home/HomeIndex";
// import ETF from "components/operation/etf/ETFIndex"; // 废弃
import ETF from "components/operation/etf/index";
import { localeType } from "store/ThemeStore";
import ClientRenderCheck from "components/base/ClientCheck";
import {
  categoriesList,
  getFindListToCurrency,
  getInitGasData,
} from "http/home";
import Loading, { LoadingType } from "components/operation/OptLoading";
import {
  findBasePage,
  findPage,
  market,
  findDefaultSymbolByCurrencyIds,
  getCryptoTotal,
  getDataChart,
} from "http/home";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useNetwork } from "hooks/useNetwork";
import SEO from "components/operation/SEO";
import { useAsyncEffect, useSize } from "ahooks";
import useTelegramStore from "store/useTelegramStore";
import { isBrowser, objectSort } from "helper/tools";
import FixSafariVHDIV from "components/base/FixSafariVHDIV";
type Props = {
  initData: any;
  cryptoTotal: any;
  dataChart: API.ChartDataWrap;
  gasData: any;
  findList: API.findListToCurrency[];
};
const Home = ({
  initData,
  cryptoTotal,
  dataChart,
  gasData,
  findList,
}: Props) => {
  const { t } = useTranslation([localeType.HOME, localeType.COMMON]); // 有坑 🕳️
  const { t: tCommon } = useTranslation([localeType.COMMON]);
  const tabs: { title: string; tip?: string }[] = [
    {
      title: "Market",
    },
    {
      title: "ETF",
    },
    {
      title: "Index",
      tip: t("see to pc") as string,
    },
    {
      title: "DEX Pool",
      tip: t("see to pc") as string,
    },
    // {
    //   title: "NFT",
    // },
    // {
    //   title: "Inscriptions", //关老师说删除
    // },
    {
      title: "Stocks",
    },
  ];
  const [data, setData] = useState(initData);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [scrollToTop, setScrollToTop] = useState(false);
  const router = useRouter();
  const { user, authModal } = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [isShow, setIsShow] = useState(false);
  const networkState = useNetwork();
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<LoadingType>(0);
  const { isTelegram } = useTelegramStore();
  const toFeedback = () => {
    if (user) {
      router.push("/feedback");
    } else {
      authModal?.openLoginModal();
    }
  };
  const toAnnouncement = () => {
    router.push("/announcement");
  };
  const cryptoTotalData = useMemo(() => {
    const cryptoTotalResult = { ...cryptoTotal };
    return cryptoTotalResult;
  }, [cryptoTotal]);
  const dataChartData = useMemo(() => {
    const dataChartResult = dataChart.responseData
      ? (+JSON.parse(dataChart.responseData)?.low
          ?.suggestedMaxFeePerGas).toFixed(2)
      : "";
    return dataChartResult;
  }, [dataChart]);

  const btcGasData = useMemo(() => {
    const { data } = JSON.parse(gasData);
    return data?.medianFee || 0;
  }, [gasData]);
  const changeScrollTo = (val: boolean) => {
    setScrollToTop(val);
  };

  const handleTabToggle = (index: number) => {
    if (index < 2) {
      setCurrentTab(index);
      setVisited((prev) => [...prev, index]);
      updateQuery({ category: tabs[index].title });
    }
  };

  useEffect(() => {
    if (!networkState.online) {
      setLoadingType(3);
      setLoading(true);
    }
  }, [networkState]);

  useEffect(() => {
    let params = new URL(location.href).searchParams;
    let category = params.get("category");
    const defaultIndex = tabs.findIndex((x) => x.title === category);
    if (defaultIndex > 0) {
      handleTabToggle(defaultIndex);
    }

    if (sessionStorage.getItem("isFirst")) {
      return;
    }
    // setIsShow(true);
    sessionStorage.setItem("isFirst", "1");
  }, []);
  useAsyncEffect(async () => {
    const initData = await getInitData();
    setData(processInitData(initData));
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const size = useSize(isBrowser ? document.body : null);
  return (
    <NavigateWrap>
      <SEO
        config={{
          title:
            "SoSoValue | Free Platform for Cryptocurrency Prices, ETFs and Market News",
          description:
            "Welcome to SoSoValue - free cryptocurrency trading data platform. Dive into real-time prices, ETFs inflow and trends within Web 3.0 by SoSoValue crypto dashboard and data charts.",
        }}
      />
      {loading && <Loading type={loadingType} />}
      <FixSafariVHDIV>
        <div
          ref={scrollRef}
          className="h-full w-full overflow-x-hidden overflow-y-auto"
        >
          <Header />
          <div className="w-full overflow-x-auto hide-scrollbar whitespace-nowrap border-0 border-b border-solid border-primary-100-700">
            {tabs.map((item, index) => (
              <CustomTip
                key={index}
                disabled={index < 2}
                title={item?.tip || tCommon("Coming soon")}
              >
                <Button
                  variant="text"
                  className={`normal-case text-sm h-full mx-4 min-w-0 px-0 py-3 rounded-none ${
                    currentTab === index
                      ? "border-0 border-b-2 border-solid border-accent-600 !text-accent-600"
                      : ""
                  } ${
                    index < 2 && currentTab !== index
                      ? " text-primary-900-White"
                      : " text-placeholder-400-300"
                  } `}
                  onClick={() => handleTabToggle(index)}
                >
                  {t(item.title)}
                </Button>
              </CustomTip>
            ))}
          </div>
          {currentTab === 0 && (
            <Index
              scrollRef={scrollRef}
              findList={findList}
              initData={data}
              cryptoTotalData={cryptoTotalData}
              dataChartData={dataChartData}
              btcGasData={btcGasData}
              scrollToTop={scrollToTop}
              changeScrollTo={changeScrollTo}
            />
          )}
          {/* {visited.includes(1) && (
            <div className={`${currentTab !== 1 ? "hidden" : ""}`}>
              <ETF page={0} />
              <div className="h-[55px]" />
            </div>
          )} */}
        </div>
      </FixSafariVHDIV>
    </NavigateWrap>
  );
};

export default Home;

const getInitData = async () => {
  const baseReq = findBasePage({
    status: 1,
    pageNum: 1,
    pageSize: 10000,
    orderItems: [{ asc: true, column: "sort" }],
  });
  const marketReq = market({});
  const [baseRes, marketRes] = await Promise.all([baseReq, marketReq]);
  const baseCoinIdList = baseRes.data.list.map((item) => item.id);
  const currencyDataReq = findPage({
    pageNum: 1,
    pageSize: 10000,
    currencyIdList: baseCoinIdList,
  });
  const defaultSymbolReq = findDefaultSymbolByCurrencyIds(baseCoinIdList);
  const [currencyDataRes, defaultSymbolRes] = await Promise.all([
    currencyDataReq,
    defaultSymbolReq,
  ]);
  return {
    baseData: baseRes.data,
    currencyData: currencyDataRes.data,
    marketData: marketRes.data,
    defaultSymbol: defaultSymbolRes.data,
  };
};

const processInitData = ({
  baseData,
  currencyData,
  defaultSymbol,
  marketData,
}: Awaited<ReturnType<typeof getInitData>>) => {
  const currencyMap = currencyData.list.reduce<
    Record<string, API.currencyDataList>
  >((map, item) => ((map[item.currencyId] = item), map), {});
  const defaultSymbolMap = defaultSymbol.reduce<
    Record<string, API.bookmarkList>
  >((map, item) => ((map[item.currencyId] = item), map), {});
  const marketMap = marketData.reduce<Record<string, Market.PairMarketHistory>>(
    (map, item) => ((map[item.id] = item), map),
    {}
  );
  const list: any[] = [];
  baseData.list.forEach((item, index) => {
    const currencyItem = currencyMap[item.id];
    const defaultSymbolItem = defaultSymbolMap[item.id];
    if (defaultSymbolItem && currencyItem) {
      const marketItem = marketMap[defaultSymbolItem.id];

      if (marketItem) {
        list.push({
          id: index + 1,
          coin: item.name.toUpperCase(),
          fullName: item.fullName,
          coinImg: item.iconUrl ? item.iconUrl : "/img/svg/CoinVertical.svg",
          price: marketItem?.price + "",
          changePercent: marketItem?.change24Percent,
          marketCap: currencyItem.marketCap,
          currentSupply:
            Number(currencyItem.currentSupply) != 0
              ? currencyItem.currentSupply
              : currencyItem.marketCap / +marketItem?.price,
          wsName: marketItem.wsName,
          exchangeId: marketItem.exchangeId,
          coinId: item.id,
          baseAsset: defaultSymbolItem.baseAsset,
          quoteAsset: defaultSymbolItem.quoteAsset,
          exchangeName: defaultSymbolItem.exchangeName,
          symbolId: defaultSymbolItem.id,
          nature: defaultSymbolItem.nature,
        });
      }
    }
  });
  return list;
};

export async function getStaticProps({ locale }: { locale: string }) {
  const [
    initData,
    { data: cryptoTotal },
    { data: dataChart },
    { data: gasData },
    findListToCurrency,
    categoriesData,
  ] = await Promise.all([
    getInitData(),
    getCryptoTotal(),
    getDataChart("1666032986125463578"),
    getInitGasData({}),
    getFindListToCurrency({ status: 1 }),
    categoriesList({ status: 1 }),
  ]);
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
  return {
    props: {
      initData: processInitData(initData).slice(0, 30),
      cryptoTotal,
      dataChart,
      gasData,
      findList,
      ...(await serverSideTranslations(locale, ["common", "home", "etf"])),
      // Will be passed to the page component as props
    },
    revalidate: 500, // In seconds
  };
}
