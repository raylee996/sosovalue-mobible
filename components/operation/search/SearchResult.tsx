import { findDefaultSymbolByCurrencyIds } from "http/home";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, ListItemButton, Tab, Tabs } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "store/UserStore";
import NewsItem from "./NewsItem";
import Collection from "components/operation/home/Collection";
import { useTranslation } from "next-i18next";
import CollectMenu from "../user/CollectMenu";
import ScaleLoader from "components/base/ScaleLoader";
import Link from "next/link";
import NoneSvg from "components/icons/none.svg";
import { createCurrencyDetailLink, Nature } from "helper/link";
import InterceptionToken from "../auth/InterceptionToken";
import { recoverExchangeName } from "helper/tools";
import { trackGlobalCoinClick, trackCollectAdd, trackGlobalFeedsClick } from "helper/track";

export enum Category {
  All = "All",
  Coins = "Coins",
  Pairs = "Pairs",
  News = "News",
  Institution = "Institution",
  Influencer = "Influencer",
  Research = "Research",
  Onchain = "Onchain",
}

type Props = {
  isSearching: boolean;
  searchResult: Common.SearchResult;
  category: Category;
  tabChange: (label: Category) => void;
  triggerSetHistory: () => void;
  hasResultMap: {
    hasCrypto: boolean;
    hasPairs: boolean;
    hasNews: boolean;
    hasResearch: boolean;
    hasInstitution: boolean;
    hasInsights: boolean;
    hasResult: boolean;
    hasOnchain: boolean;
  };
  keyword?:string
};

export const tabs = [
  { label: Category.All },
  { label: Category.Coins, category: "crypto" },
  { label: Category.Pairs, category: "pairs" },
  { label: Category.News, category: "news" },
  { label: Category.Institution, category: "institution" },
  { label: Category.Influencer, category: "insights" },
  { label: Category.Research, category: "research" },
  { label: Category.Onchain, category: "onChain" },
];

export const createCategory = (label: Category) =>
  label === Category.All
    ? tabs.slice(1).map((item) => item.category!)
    : [tabs.find((item) => item.label === label)!.category!];

const SearchResult = ({
  isSearching,
  searchResult,
  category,
  hasResultMap,
  tabChange,
  triggerSetHistory,
  keyword
}: Props) => {
  const { t } = useTranslation();
  const isAll = category === Category.All;
  const isCoins = category === Category.Coins;
  const isPairs = category === Category.Pairs;
  const isNews = category === Category.News;
  const isInstitution = category === Category.Institution;
  const isInfluencer = category === Category.Influencer;
  const isResearch = category === Category.Research;
  const isOnchain = category === Category.Onchain;

  const [collectParams, setCollectParams] = useState<any>();
  const [collectOpen, setCollectOpen] = useState(false);
  const renderMoreButton = (onClick: () => void) => {
    return (
      category === Category.All && (
        <Button
          className="normal-case text-accent-600 text-sm mt-3 mb-4 -ml-2"
          // endIcon={<CaretDoubleDown size={16} />}
          onClick={onClick}
        >
          {t("More")}
        </Button>
      )
    );
  };
  const renderCryptoesList = (cryptoes: Common.SearchCrypto[]) => {
    return cryptoes.map((item,index) => {
      const { fullName, name, iconUrl, id, sort } = item;
      return (
        <Link
          key={id}
          onClick={()=>trackGlobalCoinClick({currencyId:id,symbolId:(item as any)?.symbolId||""},keyword||"",category,index)}
          href={createCurrencyDetailLink({ fullName })}
          className="no-underline"
        >
          <ListItemButton className="p-0 pl-2 flex items-center justify-between h-14">
            <span className="flex items-center">
              <Image
                src={iconUrl || "/img/svg/CoinVertical.svg"}
                width={24}
                height={24}
                alt=""
              />
              <div className="flex ml-2 items-center">
                <span className="text-sm font-semibold text-primary-900-White">
                  {name}
                </span>
                <span className="ml-1 text-xs text-primary-900-White py-0.5 px-2 rounded-lg border border-solid border-primary-100-700">
                  {fullName}
                </span>
              </div>
            </span>
            <div className="flex items-center">
              {/* <span className="text-sm text-[#D6D6D6] px-[10px] py-1 rounded mr-2">
                #{sort}
              </span> */}
              <CollectMenu currencyId={id} onCollectSuccess={(sid,bid)=>trackCollectAdd("Global",sid,index,bid)} />

              {/* <IconButton
              className="text-white"
              onClick={(e) => {
                e.stopPropagation();
                collectCoin(item);
              }}
            >
              <Star size={20} className="w-5 h-5" />
            </IconButton> */}
            </div>
          </ListItemButton>
        </Link>
      );
    });
  };
  const renderPairsList = (pairs: Common.SearchPair[]) => {
    return pairs.map((item,index) => {
      const { baseCurrencyIcon, symbol, exchangeName, id, nature,currencyId} = item;
      const [baseAsset, quoteAsset] = symbol
        .split("/")
        .map((s) => s.toLowerCase());
      return nature === Nature.CEX ? (
        <Link 
          onClick={()=>trackGlobalCoinClick({currencyId:id,symbolId:(item as any)?.symbolId||""},keyword||"",category,index)}
          key={id}
          className="no-underline"
          href={createCurrencyDetailLink({
            nature: nature as Nature,
            exchangeName,
            baseAsset,
            quoteAsset,
          })}
        >
          <ListItemButton className="p-0 pl-2 flex items-center justify-between h-14">
            <span className="flex items-center">
              <Image
                src={baseCurrencyIcon || "/img/svg/CoinVertical.svg"}
                width={24}
                height={24}
                alt=""
              />
              <div className="flex flex-col ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-primary-900-White">
                    {symbol}
                  </span>
                  {item.exchangeRate ? (
                    <span className="ml-1 text-xs text-secondary-500-300 leading-5">
                      {+item.exchangeRate / 10000 + "%"}
                    </span>
                  ) : null}
                  {nature ? (
                    <span
                      className={`ml-1 rounded-lg px-2 py-0.5 text-xs text-white ${
                        nature === Nature.CEX ? " bg-info" : " bg-accent-600"
                      }`}
                    >
                      {nature}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-secondary-500-300 leading-5 flex items-center">
                  {nature === Nature.CEX ? (
                    <img
                      src={item.exchangeIcon || "/img/svg/CoinVertical.svg"}
                      className="w-4 h-4 mr-1.5 rounded-[50%]"
                      alt=""
                    />
                  ) : (
                    <img
                      src={item.networkIcon || "/img/svg/CoinVertical.svg"}
                      className="w-4 h-4 mr-1.5 rounded-[50%]"
                      alt=""
                    />
                  )}
                  {recoverExchangeName(exchangeName)}
                </div>
              </div>
              {/* <span className="text-xs text-neutral-fg-4-rest">
              {exchangeRate ? +exchangeRate / 10000 + "%" : ""}
            </span> */}
            </span>
            <CollectMenu symbolId={id} onCollectSuccess={(sid,bid)=>trackCollectAdd("Global",sid,index,bid)} />
            {/* <IconButton
            className="text-white"
            onClick={(e) => {
              e.stopPropagation();
              collectPair(item);
            }}
          >
            <Star size={20} className="w-5 h-5" />
          </IconButton> */}
          </ListItemButton>
        </Link>
      ) : null;
    });
  };
  const renderCryptoes = () => {
    return hasResultMap.hasCrypto ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("Coins")}
        </div>
        <div>{renderCryptoesList(searchResult.crypto!.list!)}</div>
        {renderMoreButton(() => tabChange(Category.Coins))}
      </div>
    ) : (
      isCoins && emptyNode
    );
  };
  const renderPairs = () => {
    return hasResultMap.hasPairs ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("Pairs")}
        </div>
        <div>{renderPairsList(searchResult.pairs!.list!)}</div>
        {renderMoreButton(() => tabChange(Category.Pairs))}
      </div>
    ) : (
      isPairs && emptyNode
    );
  };
  const renderResearch = () => {
    return hasResultMap.hasResearch ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("Research")}
        </div>
        {searchResult.research!.list!.map((item,index) => (
          <NewsItem
            key={item.id}
            news={item}
            onLinkClick={() =>{trackGlobalFeedsClick(item.id,keyword||"",category,index)}}
            triggerSetHistory={triggerSetHistory}
          />
        ))}
        {renderMoreButton(() => tabChange(Category.Research))}
      </div>
    ) : (
      isResearch && emptyNode
    );
  };
  const renderNews = () => {
    return hasResultMap.hasNews ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("News")}
        </div>
        {searchResult.news!.list!.map((item,index) => (
          <NewsItem
            key={item.id}
            news={item}
            onLinkClick={() =>{trackGlobalFeedsClick(item.id,keyword||"",category,index)}}
            triggerSetHistory={triggerSetHistory}
          />
        ))}
        {renderMoreButton(() => tabChange(Category.News))}
      </div>
    ) : (
      isNews && emptyNode
    );
  };
  const renderInstitution = () => {
    return hasResultMap.hasInstitution ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("Institution")}
        </div>
        {searchResult.institution!.list!.map((item,index) => (
          <NewsItem
            key={item.id}
            news={item}
            onLinkClick={() =>{trackGlobalFeedsClick(item.id,keyword||"",category,index)}}
            triggerSetHistory={triggerSetHistory}
          />
        ))}
        {renderMoreButton(() => tabChange(Category.Institution))}
      </div>
    ) : (
      isInstitution && emptyNode
    );
  };
  const renderInsights = () => {
    return hasResultMap.hasInsights ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("Influencer")}
        </div>
        {searchResult.insights!.list!.map((item) => (
          <NewsItem
            key={item.id}
            news={item}
            triggerSetHistory={triggerSetHistory}
          />
        ))}
        {renderMoreButton(() => tabChange(Category.Influencer))}
      </div>
    ) : (
      isInfluencer && emptyNode
    );
  };
  const renderOnchain = () => {
    return hasResultMap.hasOnchain ? (
      <div
        className={`px-4 border-0 border-b border-solid border-primary-100-700`}
      >
        <div className="text-base font-bold text-primary-900-White pt-4 pb-3">
          {t("Onchain")}
        </div>
        {searchResult.onChain!.list!.map((item) => (
          <NewsItem
            key={item.id}
            news={item}
            triggerSetHistory={triggerSetHistory}
          />
        ))}
        {renderMoreButton(() => tabChange(Category.Onchain))}
      </div>
    ) : (
      isOnchain && emptyNode
    );
  };

  const renderAll = () => {
    return hasResultMap.hasResult ? (
      <div>
        {renderCryptoes()}
        {renderPairs()}
        {renderNews()}
        {renderInstitution()}
        {renderInsights()}
        {renderResearch()}
        {renderOnchain()}
      </div>
    ) : (
      isAll && emptyNode
    );
  };
  const renderChildren = () => {
    if (isSearching) {
      return (
        <div className="h-full flex flex-col items-center justify-center relative">
          <ScaleLoader />
        </div>
      );
    }
    if (category === Category.All) {
      return renderAll();
    } else if (category === Category.Coins) {
      return renderCryptoes();
    } else if (category === Category.Pairs) {
      return renderPairs();
    } else if (category === Category.Research) {
      return renderResearch();
    } else if (category === Category.News) {
      return renderNews();
    } else if (category === Category.Institution) {
      return renderInstitution();
    } else if (category === Category.Influencer) {
      return renderInsights();
    } else if (category === Category.Onchain) {
      return renderOnchain();
    }
  };
  const emptyNode = (
    <div className="h-full flex flex-col items-center justify-center relative">
      <NoneSvg className="text-primary-800-50" />
      <div className="text-primary-900-white text-base font-bold mt-4">
        {t("No Relevant Result")}
      </div>
      <div className="text-sm text-primary-900-white text-center mt-4">
        {t("Search Tips1")}
      </div>
      {/* <div className="text-sm text-primary-900-white text-center mt-4">
        {t("Search Tips11")}
      </div> */}
      <div className="text-sm text-primary-900-white text-center mt-4 flex items-center">
        {t("Search Tips12")}
        <InterceptionToken>
          <Link href="/feedback">
            <Button className="px-0 min-w-0 normal-case text-accent-600 pl-1">
              {t("Send feedback")}
            </Button>
          </Link>
        </InterceptionToken>
      </div>
    </div>
  );
  return (
    <div className="h-full flex flex-col items-stretch">
      {/* <div className="border-0 border-b border-solid border-[#3D3D3D] px-4">
        <Tabs
          value={category}
          variant="scrollable"
          scrollButtons={false}
          onChange={(e, value: Category) => tabChange(value)}
        >
          {tabs.map(({ label }) => (
            <Tab
              key={label}
              label={t(label)}
              value={label}
              classes={{ selected: "text-primary" }}
              className="normal-case min-w-0 text-sm text-[#D6D6D6]"
            />
          ))}
        </Tabs>
      </div> */}
      <div className="flex-1 h-0 overflow-y-auto pb-16">{renderChildren()}</div>
      <Collection
        onClose={() => setCollectOpen(false)}
        open={collectOpen}
        collectParams={collectParams}
      />
    </div>
  );
};

export default SearchResult;
