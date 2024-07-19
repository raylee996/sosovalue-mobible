import { Button, ButtonBase, IconButton } from "@mui/material";
import {
  useContext,
  useEffect,
  useMemo, useRef,
  useState,
} from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NavigateWrap from "components/layout/NavigateWrap";
import ArrowDown from "components/icons/arrow-down-fill.svg";
import AddList from "components/icons/add-list.svg";
import AddIcon from "components/icons/add.svg";
import Ellipsis from "components/icons/ellipsis.svg";
import { bookmarkList, sortBackPackSymbol } from "http/user";
import { market } from "http/home";
import {
  DndContext,
  DragEndEvent,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import Link from "next/link";
import { copyText, formatDecimal, recoverExchangeName, transferMoney } from "helper/tools";
import BgFadeAnimate from "components/base/BgFadeAnimate";
import NoneSvg from "components/icons/none.svg";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { KLineData, useKlineWSData } from "store/WSStore/useKlineWSData";
import { Nature, createCurrencyDetailLink } from "helper/link";
import Header from "components/header";
import ToggleModal from "components/operation/portfolio/ToggleModal";
import NiceModal from "@ebay/nice-modal-react";
import MyListModal from "components/operation/portfolio/MyListModal";
import AddAssetModal from "components/operation/portfolio/AddAssetModal";
import MoreModal from "components/operation/portfolio/MoreModal";
import { UserContext } from "store/UserStore";
import ScaleLoader from "components/base/ScaleLoader";
import useUserStore from "store/useUserStore";
import Retry from "components/layout/Retry";
import useRequestError from "hooks/useRequestError";
import NetworkTips from "components/layout/NetworkTips";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { getToken, getUserCollectedPairsCache, setUserCollectedPairsCache } from "helper/storage";
import ArrowIcon from 'components/icons/arrow-down.svg'
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { useRouter } from "next/router";

type ListItemProps = {
  isDisableDrag: boolean;
  item: Pair;
  pairs: Pair[];
  onCurPairChange: (
    pair: Pair,
    pairs: Pair[],
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

const ListItem = ({
  item,
  onCurPairChange,
  pairs,
  isDisableDrag,
}: ListItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: "grab",
    ...(isDragging
      ? {
        position: "relative",
        zIndex: 9999,
        background: "#525252",
      }
      : {}),
  };
  const isValid = item.status === 1;
  const market = useMemo(() => {
    const price = Number(item.market?.U || item.history?.price);
    const change = Number(item.market?.p || item.history?.change24);
    const changePercent = Number(
      item.market?.P || item.history?.change24Percent
    );
    return {
      price,
      priceStr: price ? `$${formatDecimal(String(price))}` : "-",
      change,
      changeStr: formatDecimal(String(change)),
      changePercent,
      changePercentStr: changePercent ? changePercent.toFixed(2) + "%" : "-",
      marketCap: item.market?.mv || item.history?.marketcap
    };
  }, [item]);
  return (
    <Link
      href={
        item.nature === Nature.DEX
          ? "/"
          : createCurrencyDetailLink({
            nature: item.nature as Nature,
            exchangeName: item.exchangeName,
            baseAsset: item.baseAsset,
            quoteAsset: item.quoteAsset,
          })
      }
      key={item.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex ${isDisableDrag && ""
        } touch-manipulation active:!cursor-grabbing px-3 py-2 items-center mb-1 rounded no-underline`}
    >
      <div className="flex items-center basis-[30%]">
        {/* <div className="w-3 mr-0.5">
          <Image src="/img/svg/Dots.svg" alt="" width={12} height={12} />
        </div> */}
        <div
          className={`flex items-center ${isDragging && "pointer-events-none"
            }  ${!isValid && "opacity-20"} no-underline`}
        >
          <div className="w-8 h-8 mr-2 flex items-center">
            <Image
              className=" select-none"
              src={
                item.baseCurrencyIcon
                  ? item.baseCurrencyIcon
                  : "/img/svg/Group.svg"
              }
              alt=""
              width={24}
              height={24}
            />
          </div>
          <div>
            <div className="text-sm text-primary-900-White font-semibold select-none flex items-center">
              {item.baseAsset}
              <span className=" text-xs text-secondary-500-300">
                /{item.quoteAsset}
              </span>
            </div>
            <div className="text-xs text-secondary-500-300 select-none">
              {recoverExchangeName(item.exchangeName)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center basis-[30%] justify-end text-sm text-primary-900-White font-lato">
        ${transferMoney(Number(market.marketCap))}
      </div>
      <div className="flex items-center basis-[40%] justify-end">
        <div className={!isValid ? "opacity-20" : ""}>
          <div className="text-sm text-primary-900-White text-right font-bold select-none">
            {market.priceStr}
          </div>
          {market.changePercent == 0 && (
            <div className="text-xs text-primary-900-White text-right select-none">
              {market.changePercentStr}
            </div>
          )}
          {market.changePercent > 0 && (
            <div className="text-xs text-success-600-500 text-right select-none">
              <BgFadeAnimate value={market.changePercent}>
                +{market.changePercentStr}
              </BgFadeAnimate>
            </div>
          )}
          {market.changePercent < 0 && (
            <div className="text-xs text-error-600-500 text-right select-none">
              <BgFadeAnimate value={market.changePercent}>
                {market.changePercentStr}
              </BgFadeAnimate>
            </div>
          )}
        </div>
        <IconButton
          className="ml-[2px] w-9 h-9 flex items-center relative text-white rotate-90"
          onClick={(e) => onCurPairChange(item, pairs, e)}
        >
          <Ellipsis className="text-primary-800-50" />
        </IconButton>
      </div>
    </Link>
  );
};

type Pair = Market.TradingPair & {
  history?: Market.PairMarketHistory;
  market?: KLineData;
};

enum Sort {
  None,
  MarketCapAsc,
  MarketCapDesc,
  ChangePercentAsc,
  ChangePercentDesc,
}

const Portfolio = () => {
  const { user, authModal } = useContext(UserContext);
  const { t } = useTranslation('portfolio');
  const { t: tCommon } = useTranslation('common');
  const [listParent] = useAutoAnimate();
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const { collectCoins, bookmarks, getBookmarks, curBackpackId, changeBkId } = useUserStore();
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [originalPairs, setOriginalPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(true);

  const { subscribe1m } = useKlineWSData({
    onKlineDataMap1m(klineData1mMap) {
      let hasOnePush = false;
      const newPairs = pairs.map((pair) => {
        const market = klineData1mMap[`${pair?.exchangeName}@${pair?.wsName}`];
        if (market) {
          hasOnePush = true;
          return { ...pair, market };
        }
        return pair;
      });
      if (hasOnePush) {
        setPairs(newPairs);
      }
    },
  });


  const [sortCode, setSortCode] = useState<Sort>(Sort.None);
  const isDisableDrag = sortCode !== Sort.None;

  const {
    online,
    manualRetryFlag,
    setManualRetryFlag,
    onRequestTimeout,
    requestTimeoutFlag,
  } = useRequestError();

  const getCollectList = async () => {
    onRequestTimeout(false, true);
    const bookmarkRes = await bookmarkList({ userBackpackId: curBackpackId }, {onRequestTimeout});
    // const bookmarkRes = collectCoins.filter(pair => pair.userBackpackId === curBackpackId);
    const ids = bookmarkRes.data.map((item) => item.id).filter((id) => !!id);
    let pairs: any[] = []; 
    if (ids.length) {
      const historyRes = await market({ ids }, {onRequestTimeout});
      pairs = bookmarkRes.data.map((pair) => {
        const history = historyRes.data.find((market) => pair.id === market.id)!;
        return { ...pair, history };
      });
    }
    setPairsAndSave(pairs);
    setOriginalPairs(pairs);
    subscribePrice(pairs);
  }
  const onCurPairChange = (
    pair: Pair,
    pairs: Pair[],
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    NiceModal.show(MoreModal, { pair, curBackpackId, pairs }).then(async () => {
      getCollectList()
    });
  };

  const getBookmarkList = async () => {
    let pairs: any[] = [];
    // 动态加载
    // setPairs([]);
    setLoading(true);
    try {
      await getCollectList()
    } finally {
      setLoading(false);
    }
  };

  const subscribePrice = (pairs: Market.TradingPair[]) => {
    subscribe1m(pairs);
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active?.id !== over?.id) {
      const activeIndex = pairs.findIndex((i: any) => i.id === active?.id);
      const overIndex = pairs.findIndex((i: any) => i.id === over?.id);
      const newPairs = arrayMove(pairs, activeIndex, overIndex);
      setPairsAndSave(newPairs);
      sortBackPackSymbol(
        newPairs.map((i: any) => i.id),
        curBackpackId
      );
    }
  };
  const sortMarketCap = () => {
    if (sortCode === Sort.MarketCapAsc) {
      sortPairs(Sort.MarketCapDesc);
    } else if (sortCode === Sort.MarketCapDesc) {
      sortPairs(Sort.None);
    } else {
      sortPairs(Sort.MarketCapAsc);
    }
  }
  const sortChangePercent = () => {
    if (sortCode === Sort.ChangePercentAsc) {
      sortPairs(Sort.ChangePercentDesc);
    } else if (sortCode === Sort.ChangePercentDesc) {
      sortPairs(Sort.None);
    } else {
      sortPairs(Sort.ChangePercentAsc);
    }
  }
  const sortPairs = (newSortCode: Sort) => {
    setSortCode(newSortCode);
    if (newSortCode === Sort.None) {
      const newPairs = originalPairs.map(
        (item) => pairs.find((pair) => pair.id === item.id)!
      );
      return setPairsAndSave(newPairs);
    }
    const hasValueArr: Pair[] = []
    const noValueArr: Pair[] = [];
    pairs.forEach((item: any) => {
      if (
        newSortCode === Sort.MarketCapAsc ||
        newSortCode === Sort.MarketCapDesc
      ) {
        if (item.market?.mv || item.history?.marketcap) {
          hasValueArr.push(item);
        } else {
          noValueArr.push(item);
        }
      } else if (
        newSortCode === Sort.ChangePercentAsc ||
        newSortCode === Sort.ChangePercentDesc
      ) {
        if (item.market?.P || item.history?.change24Percent) {
          hasValueArr.push(item);
        } else {
          noValueArr.push(item);
        }
      }
    })
    const newPairs = hasValueArr.sort((prev, next) => {
      const prevChange =
        Number(prev.market?.P) || Number(prev.history?.change24Percent);
      const nextChange =
        Number(next.market?.P) || Number(next.history?.change24Percent);
      const prevMarketCap = Number(prev.market?.mv) || Number(prev.history?.marketcap);
      const nextMarketCap = Number(next.market?.mv) || Number(next.history?.marketcap);
      if (newSortCode === Sort.MarketCapAsc) {
        return nextMarketCap - prevMarketCap;
      } else if (newSortCode === Sort.MarketCapDesc) {
        return prevMarketCap  - nextMarketCap;
      } else if (newSortCode === Sort.ChangePercentAsc) {
        return nextChange - prevChange;
      } else {
        return prevChange - nextChange;
      }
    });
    setPairsAndSave(newPairs.concat(noValueArr));
  };

  const curBackpack = useMemo(() => {
    return bookmarks?.find((item: API.Backpack) => item.id === curBackpackId);
  }, [bookmarks, curBackpackId]);

  const handleDrawerOpen = () => {
    if (bookmarks.length > 1) {
      NiceModal.show(ToggleModal, { curBackpackId }).then((id) => {
        changeBkId(id as string);
      });
    }
  };

  const handleMyList = () => {
    NiceModal.show(MyListModal, { curBackpackId }).then(() => {
      getBookmarks();
    });
  };

  // 暂时保留
  // const handleAddAsset = () => {
  //   NiceModal.show(AddAssetModal, { curBackpackId }).then(() => {
  //     getBookmarkList(curBackpackId);
  //   });
  // };
  const setPairsAndSave = (pairs: Pair[]) => {
    setPairs(pairs)
    setUserCollectedPairsCache(pairs)
  }
  useEffect(() => {
    if (curBackpackId) {
      getBookmarkList();
    }
  }, [curBackpackId])

   useUpdateEffect(() => {
    getBookmarkList();
  }, [collectCoins, bookmarks])

  const router = useRouter();

  useEffect(() => {
    if (!user && !getToken() && online && !requestTimeoutFlag && manualRetryFlag) {
      // setLoading(false);
      alert(1)
      authModal?.openSignupModal(() => () => {
        router.back();
      });
    }
  }, [user, online, requestTimeoutFlag, manualRetryFlag]);
  useEffect(() => {
    if (user) {
      const pairs = getUserCollectedPairsCache()
      if (pairs) {
        setPairs(pairs)
        setLoading(false)
      }
    }
  }, [user]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useTgMobileRepairer(() => scrollRef.current!);

  const retryHandler = () => {
    getBookmarkList();
  }

  return (
    <NavigateWrap className="h-screen">
      {/* {menu} */}
      <div
        className="pb-[82px] h-full flex flex-col items-stretch overflow-y-auto"
        ref={scrollRef}
      >
        <NetworkTips />
        <Header />
        <div className="flex items-center justify-between py-3 px-5 shrink-0">
          <ButtonBase
            className="flex items-center text-lg font-bold leading-8"
            onClick={handleDrawerOpen}
          >
            {curBackpack?.name === "default"
              ? tCommon("default")
              : curBackpack?.name}
            {bookmarks.length > 1 ? (
              <ArrowDown
                width={18}
                hright={18}
                className=" text-primary-800-50 ml-2"
              />
            ) : null}
          </ButtonBase>
          <div className="flex items-center">
            <ButtonBase onClick={handleMyList}>
              <AddList className="text-primary-800-50" />
            </ButtonBase>
            {/* <ButtonBase onClick={handleAddAsset}>
              <AddIcon className="text-primary-800-50 ml-2" />
            </ButtonBase> */}
          </div>
        </div>

        <div className={`flex-1`}>
          <Retry
            requestTimeoutFlag={requestTimeoutFlag}
            retryHandler={retryHandler}
            manualRetryFlag={manualRetryFlag}
            setManualRetryFlag={setManualRetryFlag}
          >
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center pt-24">
                <ScaleLoader />
              </div>
            ) : user ? (
              !!pairs?.filter?.((i: any) => i?.nature === Nature.CEX)
                ?.length ? (
                <>
                  <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={onDragEnd}
                  >
                    <div className="px-5 flex items-center h-8 border-0 border-y border-solid border-primary-100-700">
                      <span className="basis-[30%] text-xs text-secondary-500-300 font-bold font-lato">
                        {t("Pair")}
                      </span>
                      <span className="basis-[30%] flex items-center justify-end h-full">
                        <Button
                          onClick={sortMarketCap}
                          className="normal-case text-xs text-secondary-500-300 font-bold font-lato h-full px-0 relative -right-2"
                        >
                          {t("Market Cap")}
                          <i className="flex items-center flex-col justify-center">
                            <ArrowIcon
                              className={`rotate-180 scale-50 ${sortCode === Sort.MarketCapDesc && "text-accent-600-600"}`}
                            />
                            <ArrowIcon
                              className={`scale-50 -mt-3 ${sortCode === Sort.MarketCapAsc && "text-accent-600-600"}`}
                            />
                          </i>
                        </Button>
                      </span>
                      <span className="basis-[40%] flex items-center justify-end h-full pr-8">
                        <Button
                          onClick={sortChangePercent}
                          className="normal-case text-xs text-secondary-500-300 font-bold font-lato h-full px-0"
                        >
                          24H%
                          <i className="flex items-center flex-col justify-center">
                            <ArrowIcon
                              className={`rotate-180 scale-50 ${sortCode === Sort.ChangePercentDesc && "text-accent-600-600"}`}
                            />
                            <ArrowIcon
                              className={`scale-50 -mt-3 ${sortCode === Sort.ChangePercentAsc && "text-accent-600-600"}`}
                            />
                          </i>
                        </Button>
                      </span>
                    </div>
                    <SortableContext
                      // rowKey array
                      items={pairs.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        className="h-full overflow-y-auto px-2"
                        ref={listParent}
                      >
                        {pairs.map((item, index) =>
                          item.nature === Nature.CEX ? (
                            <ListItem
                              isDisableDrag={isDisableDrag}
                              key={item.id}
                              item={item}
                              pairs={pairs}
                              onCurPairChange={onCurPairChange}
                            />
                          ) : null
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center pt-24">
                  <NoneSvg className="text-primary-800-50" />
                  <div className="text-sm text-primary-900-White mt-4 mb-6">
                    {t("Empty Collection List")}
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center pt-24">
                <Button
                  className=" normal-case"
                  variant="contained"
                  onClick={() => authModal?.openSignupModal()}
                >
                  {t("Log In")}
                </Button>
              </div>
            )}
          </Retry>
        </div>
      </div>
    </NavigateWrap>
  );
};

export default Portfolio;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "portfolio"])),
      // Will be passed to the page component as props
    },
  };
}
