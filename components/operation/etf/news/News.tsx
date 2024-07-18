/* eslint-disable react/display-name */
import React, { RefObject, useContext, useState } from "react";
import Link from "next/link";
import { getArticleList, findDefaultSymbolByCurrencyIds } from "http/home";
import { formatDate, formatDateResearch, transferMoney } from "helper/tools";
import ScaleLoader from "components/base/ScaleLoader";
import ButtonBase from "@mui/material/ButtonBase";
import Image from "next/image";
import { useInViewport, useGetState } from "ahooks";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import ArrowIcon from "components/svg/Arrow";
import { ThemeContext } from "store/ThemeStore";
import { createCurrencyDetailLink } from "helper/link";
import TimeLine from "./TimeLine";
import Tabs from "../Tabs";
import FilterResearch, {
  Category,
} from "components/operation/research/FilterResearch";
import { useTranslation } from "next-i18next";
import { EtfExportScrollStore } from "store/EtfExportScrollStore";
import useElementExport from "hooks/useElementExport";
import { trackFeedsExpose } from "helper/track";

type Props = {
  tab: Array<{ categoryList: number[]; title: string }>;
  coinList?: any;
  icon?: string;
  height?: string;
  name?: string;
  showTopic: boolean;
  status?: boolean;
  fullName?: string;
};
const initPagation = { pageNum: 1, pageSize: 10 };
type Pagation = {
  pageNum: number;
  pageSize: number;
};

const News = ({
  tab,
  icon,
  status,
  coinList,
  showTopic = false,
  height,
  name,
  fullName,
}: Props) => {
  const router = useRouter();
  const [articleList, setArticleList] = React.useState<API.Article[]>([]);
  const newsTab = tab;
  const iconUrl = icon;
  const [total, setTotal] = React.useState<number>(1);
  // const [showNews, setShowNews] = React.useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("news-0");
  const [news, setNews] = React.useState<any>(newsTab[0].categoryList);
  const [title, setTitle] = React.useState<string>(newsTab[0].title);
  const loadingWrap = React.useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(loadingWrap);
  const showLoading = total > articleList.length;
  const [pagation, setPagation, getPagation] =
    useGetState<Pagation>(initPagation);
  const { t } = useTranslation(["etf"]);
  const { selectContent } = useContext(ThemeContext);

  const createParams = (params?: Partial<API.ListParams>) => {
    if (name && fullName) {
      return {
        categoryList: news,
        //coinId: name + "," + fullName,
        pageNum: 1,
        pageSize: 100,
        userType: 1,
        weight: 0.1,
        sector: "ETF",
        ...params,
      };
    } else {
      return {
        categoryList: news,
        weight: 0.1,
        pageNum: 1,
        pageSize: 100,
        userType: 1,
        sector: "ETF",
        ...params,
      };
    }
  };
  const getUrl = (coin: any) => {
    if (coinList) {
      return (
        coinList[coin] &&
        `/trade/${coinList[coin].baseAsset}-${
          coinList[coin].quoteAsset
        }-${coinList[coin].exchangeName.toUpperCase()}`
      );
    }
  };
  const getArticle = async (params: any) => {
    const res = await getArticleList(params);
    setArticleList([
      ...(params.pageNum === 1 ? [] : articleList),
      ...(res.data.list || []),
    ]);
    setTotal(+res.data.total);
  };
  const changeNews = (categoryList: number[] | [], title: string) => {
    //setArticleList([])
    setPagation(initPagation);
    setNews(categoryList);
    setTitle(title);
    if (categoryList == news) {
      getArticle(createParams({ categoryList: categoryList, pageNum: 1 }));
    }
  };
  const goToTrade = async (id: string) => {
    const { data } = await findDefaultSymbolByCurrencyIds([id]);
    router.push(
      `/trade/${data[0].baseAsset}-${
        data[0].quoteAsset
      }-${data[0].exchangeName.toUpperCase()}`
    );
  };
  React.useEffect(() => {
    if (inViewport && articleList.length) {
      const oldPagation = getPagation();
      const newPagation = {
        ...oldPagation,
        pageNum: oldPagation.pageNum + 1,
        categoryList: news,
      };
      setPagation(newPagation);
      getArticle(createParams(newPagation));
    }
  }, [inViewport]);
  React.useEffect(() => {
    getArticle(createParams());
  }, [news, name, router.locale]);

  const tabItems = [
    ...newsTab.map((x, i) => ({ key: `news-${i}`, label: x.title })),
    { key: "spot-etf", label: t("Spot ETF Schedule") },
  ];
  const scroll=useContext(EtfExportScrollStore);
  const {createExportData}=useElementExport(scroll as RefObject<HTMLElement>,(list)=>{
    let ids=list.map(item=>{
      let arr=(item as string)?.split("-");
      let type=arr?.[2];
      return {id:arr?.[0],index:arr?.[1],type}
    });
    trackFeedsExpose("ETF",ids,"");
  });
  return (
    <div className="h-full flex flex-col mt-4">
      {/* <div className="my-4 py-2">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
        />
      </div> */}
      <div
        className={`p-4 rounded-xl border border-solid border-primary-100-700 flex-col items-start gap-4 flex ${
          activeTab === "news-0" ? "" : "hidden"
        }`}
      >
        <div className="w-full h-9 justify-between flex items-center">
          <div className="text-base font-bold leading-7">
            {tabItems.find((x) => x.key === "news-0")?.label}
          </div>
          <Link
            href={`/research?category=${Category.News}&sector=ETF`}
            className="no-underline"
          >
            <ButtonBase className="px-3 py-1 bg-dropdown-White-800 text-sm leading-6 rounded-lg shadow border border-solid border-primary-100-700">
              {t("View More")}
            </ButtonBase>
          </Link>
        </div>
        {articleList.map((item: any, index: number) => (
          <div
            key={index}
            {...createExportData(`${item.id}-${index}`)}
            className="flex-col justify-start items-start gap-1 flex"
          >
            <div className="text-secondary-500-300 text-xs font-semibold leading-4 justify-start items-center gap-2 flex">
              {item.sector &&
                item.sector != "Others" &&
                item.sector != "null" && <div>#{item.sector}</div>}
              <div className="w-1 h-1 bg-secondary-500-300 rounded-full" />
              {item.author && (
                <div
                  className={`${
                    item.category !== 4 &&
                    item.category !== 2 &&
                    item.category !== 8 &&
                    item.sourcePlatId == "173" &&
                    item.isOfficial == 1
                      ? "text-success-600-500"
                      : ""
                  }`}
                >
                  {item.category !== 4 &&
                    item.category !== 2 &&
                    item.category !== 8 &&
                    item.sourcePlatId == "173" &&
                    item.isOfficial == 1 && (
                      <Image
                        src="/img/svg/Megaphone.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="mr-1 align-top"
                      />
                    )}
                  {item.author}
                </div>
              )}
              <div className="w-1 h-1 bg-secondary-500-300 rounded-full" />
              <div className="inline-flex gap-2">
                {item.matchedCurrencies &&
                  item.matchedCurrencies.map((i: any, index: number) => {
                    if (index < 3) {
                      return (
                        <Link
                          key={index}
                          href={createCurrencyDetailLink({
                            fullName: i.fullName,
                          })}
                          className="text-accent-600 font-normal no-underline"
                        >
                          {i.name.toUpperCase()}
                        </Link>
                      );
                    }
                  })}
              </div>
            </div>
            <Link
              href={`/news/${item.id}`}
              // target="_blank"
              className="text-primary-900-White text-sm font-semibold leading-5 no-underline line-clamp-1"
            >
              {selectContent(item, "title") ||
                selectContent(item, "content") ||
                selectContent(item, "originalContent") ||
                item.originalContent2}
            </Link>
            <div className="text-secondary-500-300 leading-4 text-xs inline-flex justify-start gap-2">
              {(item.category === 2 || item.category === 8) && (
                <div>{formatDateResearch(item.realiseTime)}</div>
              )}
              {(item.category === 1 ||
                item.category === 3 ||
                item.category === 7 ||
                item.category === 4) && (
                <div>{formatDate(item.realiseTime)}</div>
              )}
              {item.category !== 4 &&
                item.category !== 1 &&
                item.category !== 3 &&
                item.category !== 7 && (
                  <div className="hidden">
                    {transferMoney(item.contentNum)} Words
                  </div>
                )}
            </div>
          </div>
        ))}
        {showLoading && (
          <div
            className="flex justify-center items-center min-h-[100px]"
            ref={loadingWrap}
          >
            <ScaleLoader />
          </div>
        )}
      </div>
      <div
        className={`p-4 rounded-xl border border-solid border-primary-100-700 flex-col items-start gap-4 flex ${
          activeTab === "spot-etf" ? "" : "hidden"
        }`}
      >
        <div className="w-full h-9 justify-between flex items-center">
          <div className="text-base font-bold leading-7">
            {tabItems.find((x) => x.key === "spot-etf")?.label}
          </div>
        </div>
        <TimeLine />
      </div>
    </div>
  );
};

export default News;
