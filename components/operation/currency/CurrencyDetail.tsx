import { usePriceAndChange } from "hooks/operation/useCoinNum";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import KLine from "components/operation/detail/KLine";
import {
  Button,
  ButtonBase,
  Dialog,
  IconButton,
  Menu,
  Tab,
  Tabs,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { copyText, capitalizeFirstLetter, recoverExchangeName } from "helper/tools";
import { getArticleList } from "http/home";
import dayjs from "dayjs";
import ArrowLeft from "components/icons/arrow-left.svg";
import InfoTooltip from "./InfoTooltip";
import { extractDomain, transferAddress, urlFilter } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { UserContext } from "store/UserStore";
import { useEventListener, useInfiniteScroll } from "ahooks";
import NewsItem from "components/operation/detail/NewsItem";
import ScaleLoader from "components/base/ScaleLoader";
import Statistic from "components/operation/detail/Statistic";
import {
  getCoinByExchangePairs,
  getCoinByFullName,
  getCurrencyDataDOVOById,
  getCurrencyDetail,
} from "http/detail";
import { checkDetailData } from "helper/tools";
import Team from "components/operation/detail/Team";
import Link from "next/link";
import CopyIcon from "components/icons/copy.svg";
import Github from "components/operation/detail/DetailBlock/Github";
import Google from "components/operation/detail/DetailBlock/Google";
import Twitter from "components/operation/detail/DetailBlock/Twitter";
import TokenomicsIntro from "components/operation/detail/DetailBlock/TokenomicsIntro";
import TokenModel from "components/operation/detail/DetailBlock/TokenModel";
import Finance from "components/operation/detail/DetailBlock/Finance";
import Investors from "components/operation/detail/Investors";
import TimeLine from "components/operation/detail/TimeLine";
import TokenUnlock from "components/operation/detail/TokenUnlock";
import TokenAllocation from "components/operation/detail/TokenAllocation";
import ResearchDialog from "components/operation/research/ResearchDialog";
import CollectMenu from "components/operation/user/CollectMenu";
import dynamic from "next/dynamic";
import { Nature } from "helper/link";
import WhitePaper from "components/icons/whitepaper.svg";
import Website from "components/icons/website.svg";
import ArrowDown from "components/icons/arrow-down-fill.svg";
import NiceModal from "@ebay/nice-modal-react";
import SearchModal from "components/operation/search/index";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { trackCoinDetailView, trackCollectAdd, trackFeedListClick, trackFeedsExpose, trackNewsEnd, trackNewsStart } from "helper/track";
import useElementExport from "hooks/useElementExport";

export enum PageType {
  Coin,
  Cex,
  Dex,
}

enum Category {
  Research,
  News,
  Insitution,
  Insights,
  SoSoReports,
}
export type Info = {
  community?: string;
  chain?: string;
  explorers?: string;
  first_issue_time?: string;
  genesis_block_time?: string;
  source_code?: string;
  update_time: string;
  website?: string;
  white_paper_link?: string;
  contracts: string;
  wallets: string;
  category?: { name: string; fullName: string }[];
};
const NoSSRShareDialogNode = dynamic(
  () => import("components/operation/research/ShareDialogNode"),
  {
    ssr: false,
  }
);
const categoryList = [
  {
    title: "News",
    id: Category.News,
  },
  {
    title: "Institution",
    id: Category.Insitution,
  },
  {
    title: "Insights",
    id: Category.Insights,
  },
  {
    title: "Research",
    id: Category.Research,
  },
  // {
  //   title: "SoSo Report",
  //   id: Category.SoSoReports,
  // },
];

export const InfoMenu = ({
  options,
  isLink = true,
  icon,
}: {
  options: { label: string; value: string }[];
  isLink?: boolean;
  icon?: ReactNode;
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex items-center justify-start gap-3">
      {options?.length ? (
        <Link
          href={options?.[0]?.value || ""}
          target="_blank"
          className="no-underline "
        >
          <Button className="text-sm py-1 rounded-lg px-2 text-primary-900-White normal-case bg-secondary-50-800 m-0 flex items-center gap-3">
            {icon} {options?.[0]?.label}
          </Button>
        </Link>
      ) : null}
      {options?.length > 1 ? (
        <>
          <ButtonBase
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="w-6 h-6 p-1.5 rounded-lg bg-hover-50-800 flex items-center justify-center"
          >
            <ArrowDown
              width={16}
              height={16}
              className={`text-primary-900-White shrink-0 ${open && "rotate-180"
                }`}
            />
          </ButtonBase>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            classes={{
              paper:
                "px-1 py-3 bg-dropdown-White-800 rounded-xl border border-solid border-primary-100-700",
            }}
          >
            {options.map(({ label, value }, index) => (
              <Link
                href={value || ""}
                key={index}
                target="_blank"
                className={`${!isLink && "pointer-events-none"
                  } text-sm py-2 rounded-lg px-4 text-primary-900-White normal-case m-0 no-underline flex items-center leading-6`}
              >
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </Menu>
        </>
      ) : null}
    </div>
  );
};

const CurrencyDetail = ({ pageType }: { pageType: PageType }) => {
  const isCoin = pageType === PageType.Coin;
  const isCex = pageType === PageType.Cex;
  const router = useRouter();
  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const [showPrice, setShowPrice] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Research.Post>();
  const [category, setCategory] = useState(-1);
  const [currencyInfo, setCurrencyInfo] = useState<any>();
  const [symbol, setSymbol] = useState<any>();
  const [originalCurrencyDetail, setOriginalCurrencyDetailInfo] =
    useState<API.OriginalCurrencyDetail>();
  const [shareNewsOpen, setShareNewsOpen] = useState(false);
  const categoryConfig = useMemo(
    () => ({
      isResearch: category === Category.Research,
      isNews: category === Category.News,
      isInstitution: category === Category.Insitution,
      isInsights: category === Category.Insights,
      isSoSoReports: category === Category.SoSoReports,
    }),
    [category]
  );
  const categoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setCategory(newValue);
  };
  useEventListener(
    "scroll",
    () => {
      if (
        scrollDivRef.current &&
        scrollDivRef.current.scrollTop > 156 &&
        !showPrice
      ) {
        setShowPrice(true);
      } else if (
        scrollDivRef.current &&
        scrollDivRef.current.scrollTop < 156 &&
        showPrice
      ) {
        setShowPrice(false);
      }
    },
    { target: scrollDivRef }
  );
  const createCategoryList = (category: Category) => {
    if (category === Category.Research) {
      return [2, 8];
    } else if (category === Category.Insights) {
      return [4];
    } else if (category === Category.News) {
      return [1, 7, 10];
    } else if (category === Category.Insitution) {
      return [3];
    }
  };
  const {
    data: posts,
    loading,
    noMore,
    reloadAsync,
  } = useInfiniteScroll<
    Required<API.ListResponse<Research.Post>> & {
      lastSortValues?: number[];
      currentField?: string;
    }
  >(
    async (data) => {
      if (currencyInfo) {
        const res = await getArticleList({
          pageSize: 10,
          coinId: currencyInfo?.id,
          lastSortValues: data?.lastSortValues,
          currentField: data?.currentField,
          ...(category !== -1
            ? { categoryList: createCategoryList(category) }
            : {}),
        });
        return { ...res.data, list: res.data.list || [] };
      }
      return {
        list: [],
        total: 0,
        totalPage: 0,
        pageNum: 1,
        pageSize: 10,
      };
    },
    {
      target: scrollDivRef.current,
      threshold: 100,
      reloadDeps: [category, router.query.fullName, router.query.symbol],
      isNoMore: (data) => {
        return Number(data?.pageNum) >= Number(data?.totalPage);
      },
    }
  );
  const { user, authModal } = useContext(UserContext);
  const { t } = useTranslation(["home", "portfolio"]);
  const { success } = useNotistack();
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const postDialogOpen = !!selectedPost;
  const closePostDialog = () => {
    selectedPost?.id&&trackNewsEnd(selectedPost.id);
    setSelectedPost(undefined);
  };

  const { price, roi1mo, roi1y, changeConfig, roiConfig, change } =
    usePriceAndChange(symbol);
  let hideUnlock = true;
  let hideTrend =
    !originalCurrencyDetail?.googleTrends &&
    !originalCurrencyDetail?.github &&
    !originalCurrencyDetail?.twitterData;
  let hideToken = true;
  if (originalCurrencyDetail?.tokenConfig == 1) {
    hideToken =
      !originalCurrencyDetail?.tokenomicsIntro &&
      !originalCurrencyDetail?.tokenModel;
    hideUnlock = true;
  } else {
    hideToken = true;
    hideUnlock =
      !originalCurrencyDetail?.fullAllocation &&
      !originalCurrencyDetail?.tokenUnlocks &&
      !originalCurrencyDetail?.allocation;
  }
  const hasRounds = checkDetailData(originalCurrencyDetail?.rounds);
  const hasInvestors = checkDetailData(originalCurrencyDetail?.investors);
  const hideInvestor = !hasRounds && !hasInvestors;
  const tabs = [
    {
      title: "Market",
    },
    {
      title: "Overview",
    },
    {
      title: "Trend",
      hide: hideTrend,
    },
    {
      title: "Token Economics",
      hide: hideUnlock,
    },
    {
      title: "Investor & Finance",
      hide: hideInvestor,
    },
    {
      title: "Token Economics",
      hide: hideToken,
    },
  ];
  const intro = useMemo(() => {
    return originalCurrencyDetail?.introduction
      ? originalCurrencyDetail?.introduction.replace(
        /<a[^>]*>(.*?)<\/a>/g,
        "$1"
      )
      : "";
  }, [originalCurrencyDetail?.introduction]);
  const info = useMemo(() => {
    const infoObj = (
      originalCurrencyDetail?.info
        ? JSON.parse(originalCurrencyDetail.info)
        : {}
    ) as Info;
    const explorers = (
      infoObj.explorers ? JSON.parse(infoObj.explorers) : []
    ) as string[];
    const website = (
      infoObj.website ? infoObj.website.split(",") : []
    ) as string[];
    const source_code = (
      infoObj.source_code ? infoObj.source_code.split(",") : []
    ) as string[];
    const communityMap = (
      infoObj.community ? JSON.parse(infoObj.community) : {}
    ) as Record<string, string>;
    const community = Object.keys(communityMap).map((name) => ({
      name,
      link: communityMap[name],
    }));
    const wallets = (infoObj.wallets ? JSON.parse(infoObj.wallets) : []) as {
      walletName: string;
      walletUrl: string;
    }[];
    const contracts = (
      infoObj.contracts ? JSON.parse(infoObj.contracts) : []
    ) as {
      contractPlatform: string;
      contractAddress: string;
      contractExplorerUrl: string;
    }[];

    return {
      ...infoObj,
      explorers,
      community,
      contracts,
      wallets,
      website,
      source_code,
    };
  }, [originalCurrencyDetail]);
  const symbolOption = useMemo(() => {
    return (
      currencyInfo && {
        ...currencyInfo?.symbolDoVO,
        icon: currencyInfo?.iconUrl,
        symbolId: currencyInfo?.symbolDoVO.id,
      }
    );
  }, [currencyInfo]);
  const closeDiscoverOnPC = () => {
    setDiscoverOpen(false);
  };
  const copyLink = (val: string) => {
    copyText(val);
    success(t("copy success"));
  };
  const back = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };
  const handleShareNewsOpen = (post: Research.Post) => {
    setSelectedPost(post);
    setShareNewsOpen(true);
  };
  const handleShareNewsClose = () => {
    setShareNewsOpen(false);
    setSelectedPost(undefined);
  };
  useEffect(() => {
    if (router.query.fullName) {
      getCoinByFullName((router.query.fullName as string).toLowerCase()).then(
        (result) => {
          getCurrencyDataDOVOById(result.data.symbolDoVO.id).then((res) => {
            setCurrencyInfo({
              ...result.data,
              currencyDataDoVO: res.data.currencyDataDoVO,
            });
          });
          setSymbol(result.data.symbolDoVO);
          getCurrencyDetail(result.data.id).then((res) => {
            setOriginalCurrencyDetailInfo(res.data);
          });
        }
      );
    }
  }, [router.query.fullName]);
  useEffect(() => {
    const { exchange, symbol } = router.query;
    if (exchange && symbol) {
      const [baseAsset, quoteAsset] = (symbol as string).split("-");
      getCoinByExchangePairs(
        (exchange as string).toUpperCase(),
        `${baseAsset}${quoteAsset === "ZUSD" ? "USD" : quoteAsset}`
      ).then((result) => {
        const { currencyDoVO, ...rest } = result.data;
        const symbolDoVO = { symbolId: result.data.id, ...rest };
        getCurrencyDataDOVOById(symbolDoVO.id).then((res) => {
          setCurrencyInfo({
            ...currencyDoVO,
            currencyDataDoVO: res.data.currencyDataDoVO,
            symbolDoVO,
          });
        });
        setSymbol(symbolDoVO);
        getCurrencyDetail(currencyDoVO.id).then((res) => {
          setOriginalCurrencyDetailInfo(res.data);
        });
      });
    }
  }, [router.query.symbol]);
  const discoverOnPC = (
    <Dialog
      classes={{
        paper:
          "bg-[#1F1F1F] mx-8 p-6 flex flex-col justify-center items-center relative",
      }}
      onClose={closeDiscoverOnPC}
      open={discoverOpen}
    >
      <div>
        <div className="text-xl font-bold text-title">
          {t("platform on a PC", { ns: "portfolio" })}
        </div>
        <Button
          className="text-title text-sm border-[#333333] rounded-lg mt-8 normal-case"
          endIcon={
            <Image
              src="/img/svg/CopySimple-white.svg"
              width={24}
              height={24}
              alt=""
            />
          }
          fullWidth
          variant="outlined"
        >
          sosovalue.xyz
        </Button>
      </div>
    </Dialog>
  );
  const renderItem = (title: string, node?: React.ReactNode) => {
    return (
      <div className={`flex flex-col gap-2 justify-between items-start`}>
        <div className="text-sm text-primary-900-white font-semibold">
          {title}
        </div>
        <div className="text-sm px-2 py-1 rounded-lg bg-secondary-50-800 text-primary-900-white truncate ">
          {node}
        </div>
      </div>
    );
  };

  const handleSearch = (coin: string) => {
    currencyInfo?.symbolDoVO &&
      NiceModal.show(SearchModal, { coin, type: "Pairs" });
  };
  useTgMobileRepairer(() => scrollDivRef.current!);

  useEffect(() => {
      currencyInfo &&
          trackCoinDetailView(
              true,
              currencyInfo?.id,
              currencyInfo?.symbolDoVO?.symbolId
          );
      return () =>
          currencyInfo &&
          trackCoinDetailView(
              false,
              currencyInfo?.id,
              currencyInfo?.symbolDoVO?.symbolId||currencyInfo?.symbolDoVO?.id
          );
  }, [currencyInfo]);
  const {track,createExportData}=useElementExport(scrollDivRef,(list)=>{
    let ids=list.map(item=>{
      let arr=(item as string)?.split("-");
      let type=arr?.[2];
      return {id:arr?.[0],index:arr?.[1],type}
    });
    trackFeedsExpose("CoinDetail",ids,"");
  });
  useEffect(()=>{
    track();
  },[category]);
  return (
    <div className="h-full overflow-hidden flex flex-col items-stretch  bg-background-primary-White-900">
      {discoverOnPC}
      <div className="flex items-center h-12 px-2">
        <div className="flex items-center w-full">
          <IconButton onClick={back} className="w-auto">
            <ArrowLeft className="w-6 h-6 text-primary-800-50" />
          </IconButton>
          {currencyInfo &&
            (isCex ? (
              <ButtonBase
                onClick={() =>
                  handleSearch(
                    currencyInfo?.symbolDoVO?.baseAsset +
                    "/" +
                    currencyInfo?.symbolDoVO?.quoteAsset
                  )
                }
                className="flex items-center flex-grow gap-x-4 flex-1 justify-center"
              >
                <Image
                  src={currencyInfo?.iconUrl || "/img/svg/CoinVertical.svg"}
                  // className="mr-4"
                  width={24}
                  height={24}
                  alt=""
                />
                <span className="text-primary-900-white text-base font-bold flex items-center">
                  {currencyInfo?.symbolDoVO?.baseAsset}
                  <span className="text-sm text-secondary-500-300 leading-5 font-semibold">
                    /{currencyInfo?.symbolDoVO?.quoteAsset}
                  </span>
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 border border-solid border-primary-100-700 text-white-white text-xs ${currencyInfo?.symbolDoVO?.nature === Nature.CEX
                      ? "bg-info"
                      : "bg-accent-600"
                    }`}
                >
                  {currencyInfo?.symbolDoVO?.nature}
                </span>

                <ArrowDown
                  width={14}
                  height={14}
                  className=" text-primary-800-50"
                />
              </ButtonBase>
            ) : (
              <ButtonBase
                onClick={() =>
                  handleSearch(
                    currencyInfo?.symbolDoVO?.baseAsset.toUpperCase()
                  )
                }
                className="flex items-center flex-grow gap-x-4 flex-1 justify-center"
              >
                <Image
                  src={currencyInfo?.iconUrl || "/img/svg/CoinVertical.svg"}
                  // className="mr-4"
                  width={24}
                  height={24}
                  alt=""
                />
                <span className="text-primary-900-white text-base font-bold flex items-center">
                  <span className="max-w-[100px] truncate">
                    {currencyInfo?.fullName}
                  </span>
                  <span className="text-sm text-secondary-500-300 leading-5 font-semibold ml-2">
                    {currencyInfo?.name.toUpperCase()}
                  </span>
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 border border-solid border-primary-100-700 text-primary-900-White text-xs`}
                >
                  Coin
                </span>

                <ArrowDown
                  width={14}
                  height={14}
                  className=" text-primary-800-50"
                />
              </ButtonBase>
            ))}
          <div className="w-8 h-8 flex items-center justify-center ">
            {isCex ? <CollectMenu symbolId={currencyInfo?.symbolDoVO.id} onCollectSuccess={(sid,bid)=>trackCollectAdd("Detail",sid,0,bid)} />
               : <CollectMenu currencyId={currencyInfo?.symbolDoVO.currencyId} onCollectSuccess={(sid,bid)=>trackCollectAdd("Detail",sid,0,bid)} />}
            {/* <IconButton onClick={openCollection} className="text-[#F5F5F5]">
            <AddIcon viewBox="0 0 16 16" width={24} height={24} />
          </IconButton> */}
          </div>
        </div>
      </div>
      <div className="w-full h-12 px-4 overflow-x-auto hide-scrollbar whitespace-nowrap border-0 border-y border-solid border-primary-100-700 -pb-[1px]">
        {tabs.map(
          (item, index) =>
            !item.hide && (
              <Button
                key={index}
                variant="text"
                className={`normal-case px-4 font-semibold text-sm h-full min-w-0 rounded-none ${currentTab === index
                    ? "border-0 border-b-2 border-solid border-accent-600 text-accent-600"
                    : " text-primary-900-White"
                  }`}
                onClick={() => {
                  setCurrentTab(index);
                  //index !== currentTab && setDiscoverOpen(true)
                }}
              >
                {t(item.title)}
              </Button>
            )
        )}
      </div>
      <div></div>
      {currentTab === 0 && (
        <div
          className="flex-1 h-0 overflow-y-auto overflow-x-hidden w-full"
          ref={scrollDivRef}
        >
          {!isCex && (
            <div className="text-sm text-secondary-500-300 leading-5 mt-4 mx-4">
              {currencyInfo?.fullName}
            </div>
          )}

          <div className={`flex mx-4 ${isCex && "mt-4"} flex-col`}>
            <div className="">
              <div className="flex items-center">
                <span
                  className={`text-3xl font-bold text-primary-900-white leading-10 mr-2`}
                >
                  {changeConfig.priceStr}
                </span>
                <span
                  className={`text-base leading-10 ${changeConfig.isRise
                      ? "text-success-600-500"
                      : "text-error-600-500"
                    }`}
                >
                  {changeConfig.str}
                </span>
              </div>
            </div>
            <div className={`flex text-sm gap-3`}>
              <div className="text-right">
                <span className=" text-secondary-500-300 mr-1">
                  {t("1M ROI")}:
                </span>
                <span
                  className={`${roiConfig.isRoi1moRise
                      ? " text-success-600-500"
                      : " text-error-600-500"
                    }`}
                >
                  {roiConfig.roi1moStr}
                </span>
              </div>
              <div className="text-right">
                <span className="text-secondary-500-300 mr-1">
                  {t("1Y ROI")}:
                </span>
                <span
                  className={`${roiConfig.isRoi1yRise
                      ? "text-success-600-500"
                      : "text-error-600-500"
                    }`}
                >
                  <span>{roiConfig.roi1yStr}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-primary-900-white text-sm font-medium leading-6 flex items-center">
                {currencyInfo?.symbolDoVO?.baseAsset}
                <span className="text-sm text-secondary-500-300 leading-5 font-semibold">
                  /{currencyInfo?.symbolDoVO?.quoteAsset}
                </span>
              </div>
              {isCex ? (
                <div className="px-2 py-1 rounded-lg bg-secondary-50-800 text-xs text-primary-900-white leading-4">
                  {recoverExchangeName(currencyInfo?.symbolDoVO?.exchangeName || "")}
                </div>
              ) : (
                <InfoTooltip currencyInfo={currencyInfo} />
              )}
            </div>
            {/* <div className="flex gap-2 flex-col">
              <div className="flex items-center justify-start gap-2">
                <span className="text-primary-900-white text-base font-bold mr-3 flex items-center">
                  {currencyInfo?.symbolDoVO?.baseAsset}
                  <span className="text-sm text-secondary-500-300 leading-5 font-semibold">
                    /{currencyInfo?.symbolDoVO?.quoteAsset}
                  </span>
                </span>
                <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-secondary-50-800">
                  <img
                    src={
                      currencyInfo?.symbolDoVO?.exchangeIcon ||
                      "/img/svg/CoinVertical.svg"
                    }
                    className="w-4 h-4 mr-1.5 rounded-[50%]"
                    alt=""
                  />
                 
                  <span className="text-primary-900-white text-xs font-medium ml-1">
                    {currencyInfo?.symbolDoVO?.exchangeName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-4xl font-medium text-primary-900-white`}>
                  {changeConfig.priceStr}
                </span>
                <div className="mt-1">
                  <span
                    className={`text-base py-1 px-1.5 ${
                      changeConfig.isRise
                        ? "text-success-600-500"
                        : "text-error-600-500"
                    }`}
                  >
                    {changeConfig.str}
                  </span>
                  <span className="text-content text-xs ml-2">{t("24H")}</span>
                </div>
              </div>
            </div>
            <ButtonBase className=" opacity-50 px-4 py-2 rounded-lg bg-brand-accent-600-600 text-sm text-white-white font-medium">
              Swap
            </ButtonBase> */}
            {/* <div className="flex flex-col items-end text-xs">
              <span className="mb-1">
                <span
                  className={`font-bold ${
                    roiConfig.isRoi1moRise ? "text-rise" : "text-fall"
                  }`}
                >
                  {roiConfig.roi1moStr}
                </span>
                <span className="text-content ml-2">{t("1M ROI")}</span>
              </span>
              <span
                className={`font-bold ${
                  roiConfig.isRoi1yRise ? "text-rise" : "text-fall"
                }`}
              >
                <span>{roiConfig.roi1yStr}</span>
                <span className="text-content ml-2">{t("1Y ROI")}</span>
              </span>
            </div> */}
          </div>
          <div className="h-[450px]">
            <KLine
              symbol={symbolOption}
              showIndicators
              showIndicator
              showPeriods
            />
          </div>
          <div className="px-4 border-0 border-b border-solid border-primary-100-700">
            <Tabs
              value={category}
              onChange={categoryChange}
              classes={{
                scroller: "!overflow-x-auto hide-scrollbar",
                flexContainer: "gap-6",
              }}
            >
              <Tab
                label={t("Statistic")}
                value={-1}
                classes={{ selected: "!text-accent-600 !font-semibold" }}
                className="text-sm text-primary-900-White px-0 min-w-0 normal-case font-semibold leading-6"
              />
              {categoryList.map(({ title, id }) => (
                <Tab
                  key={id}
                  label={t(title)}
                  value={id}
                  classes={{ selected: "!text-accent-600 !font-semibold" }}
                  className="text-sm text-primary-900-White px-0 min-w-0 normal-case font-semibold leading-6"
                />
              ))}
            </Tabs>
          </div>
          {category === -1 ? (
            <Statistic
              currencySymbolInfo={currencyInfo}
              price={price}
              change={change}
              info={info}
            />
          ) : (
            <div className="py-4">
              {!!posts?.list.length
                ? posts?.list.map((item,index) => (
                  <div key={item.id} {...createExportData(`${item.id}-${index}`)}>
                    <NewsItem
                    news={item}
                    categoryConfig={categoryConfig}
                    onLinkClick={()=>trackFeedListClick(index,item.id,Category[category],false,"CoinDetail")}
                    selectPost={(post)=>{trackNewsStart(post.id);setSelectedPost(post)}}
                    onShare={handleShareNewsOpen}
                    />
                  </div>
                ))
                : null}
              {!noMore && !loading && (
                <div className="flex items-center justify-center py-5">
                  <ScaleLoader />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {currentTab === 1 && (
        <div
          className="flex-1 h-0 overflow-y-auto overflow-x-hidden w-full p-4"
          ref={scrollDivRef}
        >
          <div className="text-primary-900-white text-xl leading-8 font-bold mb-4">
            {currencyInfo?.fullName} {t("Basic")}
          </div>

          <div className="p-4 border border-solid border-primary-100-700 rounded-xl bg-background-primary-White-900">
            <div className="text-lg text-primary-900-White font-bold">
              {t("Info")}
            </div>
            <div className="grid grid-cols-2 mt-4 gap-y-4 gap-x-6">
              <div className="">
                {renderItem(
                  t("White paper"),
                  info.white_paper_link && (
                    <Link
                      href={urlFilter(info.white_paper_link) || ""}
                      target="_blank"
                    >
                      <Button
                        startIcon={
                          <WhitePaper className=" text-primary-800-50" />
                        }
                        className="text-sm py-1 rounded-lg px-2 text-primary-900-White normal-case bg-secondary-50-800 m-0"
                      >
                        {t("White paper")}
                      </Button>
                    </Link>
                  )
                )}
              </div>
              <div>
                {info.website &&
                  renderItem(
                    t("Website"),
                    <div className="flex flex-wrap relative z-10">
                      {info.website.map((link, index) => (
                        <Link
                          key={index}
                          href={urlFilter(link) || ""}
                          target="_blank"
                        >
                          <Button
                            startIcon={
                              <Website className=" text-primary-800-50" />
                            }
                            className="text-sm py-1 rounded-lg px-2 text-primary-900-White normal-case bg-secondary-50-800 m-0"
                          >
                            {extractDomain(link)}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
              <div className="">
                <div className="text-sm text-primary-900-white font-semibold">
                  {t("Wallets")}
                </div>
                <div className="mt-2">
                  <InfoMenu
                    options={info.wallets.map(
                      ({ walletName, walletUrl }, index) => ({
                        label: extractDomain(walletName),
                        value: urlFilter(walletUrl),
                      })
                    )}
                  />
                </div>
              </div>
              <div className="">
                <div className="text-sm text-primary-900-white font-semibold">
                  {t("Explorers")}
                </div>
                <div className="mt-2">
                  <InfoMenu
                    options={info.explorers.map((link, index) => ({
                      label: extractDomain(link),
                      value: urlFilter(link),
                    }))}
                  />
                </div>
              </div>
              <div className="">
                <div className="text-sm text-primary-900-white font-semibold">
                  {t("Community")}
                </div>
                <div className="mt-2">
                  <InfoMenu
                    options={info.community.map(({ name, link }, index) => ({
                      label: name,
                      value: urlFilter(link),
                    }))}
                  />
                </div>
              </div>
              <div>
                {info.source_code &&
                  renderItem(
                    t("Source code"),
                    <div className="flex flex-wrap items-center relative z-10">
                      {info.source_code.map((link, index) => (
                        <Link
                          key={index}
                          href={urlFilter(link) || ""}
                          target="_blank"
                        >
                          <Button className="text-sm py-1 rounded-lg px-2 text-primary-900-White normal-case bg-secondary-50-800 m-0">
                            {extractDomain(link)}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
              <div className="">
                <div className="text-sm text-primary-900-white font-semibold">
                  {t("Sector")}
                </div>
                <div className="mt-2 text-primary-900-White leading-6 px-2 py-1 rounded-lg bg-secondary-50-800 w-auto inline-block">
                  {info.category?.map(({ name }) => name).join(",")}
                </div>
              </div>
              <div className="">
                <div className="text-sm text-primary-900-white font-semibold">
                  {t("First issue time")}
                </div>
                <div className="mt-2 text-primary-900-White leading-6">
                  {info.first_issue_time &&
                    dayjs(+info?.first_issue_time).format("MMM DD, YYYY")}
                </div>
              </div>
              <div className="">
                <div className="text-sm text-primary-900-white font-semibold">
                  {t("Genesis block time")}
                </div>
                <div className="mt-2 text-primary-900-White leading-6">
                  {info.genesis_block_time &&
                    dayjs(+info?.genesis_block_time).format("MMM DD, YYYY")}
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 p-4 border border-solid border-primary-100-700 bg-background-primary-White-900 rounded-xl">
            {originalCurrencyDetail?.individuals &&
              originalCurrencyDetail.organizations && (
                <Team originalCurrencyDetail={originalCurrencyDetail} />
              )}
          </div>
          <div className="my-4 p-4 border border-solid border-primary-100-700 rounded-xl bg-background-primary-White-900">
            <div className="text-lg text-primary-900-White font-bold">
              {t("Intro")}
            </div>
            <div className="relative">
              {!showAll && (
                <div
                  id="intro"
                  className={`my-3 text-sm text-secondary-500-300 leading-[20px]`}
                  dangerouslySetInnerHTML={{
                    __html: intro,
                  }}
                ></div>
              )}
              {showAll && (
                <div
                  className={`my-3 text-sm text-secondary-500-300 leading-[20px]`}
                  dangerouslySetInnerHTML={{
                    __html: intro,
                  }}
                ></div>
              )}
              {/* <div
                id="intro"
                className={`my-3 text-[13px] text-[#FFF] leading-[20px] ${
                  !showAll ? "max-h-[170px]" : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html: originalCurrencyDetail?.introduction || "",
                }}
              ></div> */}
              {/* {!showAll && originalCurrencyDetail?.introduction && (
                <span className="absolute right-0 bottom-0 z-10 text-[13px] text-[#FFF] bg-[#0D0D0D]">
                  ...
                </span>
              )} */}
            </div>

            <div
              className="flex items-center justify-start underline font-medium text-sm text-primary-900-White cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {!showAll ? t("View All") : t("Hide")}
              {/* <Image
                src="/img/svg/CareUp.svg"
                width={12}
                height={12}
                alt=""
                className={`${!showAll && "rotate-180"}`}
              /> */}
            </div>
          </div>
          {!!info.contracts?.length && (
            <div className="my-4 p-4 border border-solid border-primary-100-700 bg-background-primary-White-900 rounded-xl">
              <div className="text-lg text-primary-900-White font-bold">
                {t("On-Chain Links")}
              </div>
              {/* <div className="my-1 px-3 py-4 bg-[#1F1F1F] rounded-t-lg">
              <div className="text-sm text-[#FFF] mb-3 font-bold">
                {t("Chain")}
              </div>
              <div className="text-xs text-[#D6D6D6] mt-1">
                {info.chain?.toString()}
              </div>
            </div> */}

              <div className="">
                <div className="text-sm font-semibold leading-6 my-4">
                  {t("Contracts")}
                </div>
                {info.contracts.map(
                  (
                    { contractAddress, contractExplorerUrl, contractPlatform },
                    index
                  ) => (
                    <div
                      key={index}
                      className="p-2 mb-2 flex items-center"
                      onClick={() => copyLink(contractAddress)}
                    >
                      <span className="truncate text-sm leading-6">
                        {contractPlatform}:{transferAddress(contractAddress)}
                      </span>
                      <CopyIcon className=" text-primary-800-50 ml-2" />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {currentTab === 2 && (
        <div className="flex-1 h-0 overflow-y-auto overflow-x-hidden w-full">
          <div className="text-primary-900-white text-xl leading-8 font-bold p-4 pb-0">
            {currencyInfo?.fullName} {t("Trend")}
          </div>
          {originalCurrencyDetail?.googleTrends && (
            <div className="">
              <Google originalCurrencyDetail={originalCurrencyDetail} />
            </div>
          )}
          {originalCurrencyDetail?.github && (
            <div className="">
              <Github originalCurrencyDetail={originalCurrencyDetail} />
            </div>
          )}
          {originalCurrencyDetail?.twitterData && (
            <div className="">
              <Twitter originalCurrencyDetail={originalCurrencyDetail} />
            </div>
          )}
        </div>
      )}
      {currentTab === 3 && (
        <div className="flex-1 h-0 overflow-y-auto overflow-x-hidden w-full">
          <div className="text-primary-900-white text-xl leading-8 font-bold p-4 pb-0">
            {currencyInfo?.fullName} {t("Unlock & Allocation")}
          </div>
          {originalCurrencyDetail?.tokenUnlocks && (
            <div className=" h-[450px]">
              <TokenUnlock originalCurrencyDetail={originalCurrencyDetail} />
            </div>
          )}
          {originalCurrencyDetail?.allocation && (
            <div className=" h-[520px]">
              <TokenAllocation
                originalCurrencyDetail={originalCurrencyDetail}
              />
            </div>
          )}
          {originalCurrencyDetail?.fullAllocation && (
            <div className="">
              <TimeLine originalCurrencyDetail={originalCurrencyDetail} />
            </div>
          )}
        </div>
      )}
      {currentTab === 4 && (
        <div className="flex-1 h-0 overflow-y-auto overflow-x-hidden w-full p-4">
          {hasRounds && (
            <div className="pb-4">
              <Finance
                originalCurrencyDetail={originalCurrencyDetail}
                fullName={currencyInfo?.fullName}
              />
            </div>
          )}
          {hasInvestors && (
            <Investors originalCurrencyDetail={originalCurrencyDetail} />
          )}
        </div>
      )}
      {currentTab === 5 && (
        <div className="flex-1 h-0 overflow-y-auto overflow-x-hidden w-full p-4">
          {originalCurrencyDetail?.tokenomicsIntro && (
            <div className="">
              <TokenomicsIntro
                originalCurrencyDetail={originalCurrencyDetail}
              />
            </div>
          )}
          {originalCurrencyDetail?.tokenModel && (
            <div className="w-full h-[450px] mt-4">
              <TokenModel originalCurrencyDetail={originalCurrencyDetail} />
            </div>
          )}
        </div>
      )}
      <ResearchDialog
        selectedPost={selectedPost}
        open={postDialogOpen}
        onClose={closePostDialog}
      />
      <NoSSRShareDialogNode
        selectedPost={selectedPost}
        shareDialogProps={{
          open: shareNewsOpen,
          onClose: handleShareNewsClose,
        }}
      />
    </div>
  );
};

export default CurrencyDetail;
