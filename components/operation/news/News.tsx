/* eslint-disable react/display-name */
import React, { useContext } from "react";
import Link from "next/link";
import {
  getArticleList,
  getCurrentCoin,
  findDefaultSymbolByCurrencyIds,
} from "http/home";
import ScaleLoader from "components/base/ScaleLoader";
import dayjs from "dayjs";
import Image from "next/image";
import { useInViewport, useUpdateEffect, useGetState } from "ahooks";
import { useRouter } from "next/router";
import { transferMoney } from "helper/tools";
import { formatDate, formatDateResearch } from "helper/tools";
import { ThemeContext } from "store/ThemeStore";
import { useTranslation } from "next-i18next";

type Props = {
  tab: Array<{ categoryList?: number[]; title: string; isAuth?: number }>;
  coinList?: any;
  currentCategoryList?: any;
  icon?: string;
  height?: string;
  name?: string;
  search: any;
  sourceListNum: number;
  dateRange?: any;
  source: string[];
  credibility?: string;
  status?: boolean;
  fullName?: string;
  sector: any;
  startTime?: number;
  endTime?: number;
  selectToken?: API.SearchCrypto;
  sectorChange: (val: any) => any;
};
const initPagation = { pageNum: 1, pageSize: 10 };
type Pagation = {
  pageNum: number;
  pageSize: number;
};
const sourceImg: any = {
  173: "/img/svg/twitter_icon.svg",
  174: "/img/svg/substack_icon.svg",
  175: "/img/svg/mirror_icon.svg",
  176: "/img/svg/medium_icon.svg",
  177: "/img/svg/cryptoMedia_icon.svg",
};

const News = ({
  tab,
  icon,
  source,
  startTime,
  sectorChange,
  sourceListNum,
  endTime,
  dateRange,
  status,
  selectToken,
  sector,
  currentCategoryList,
  search,
  name,
  credibility,
}: Props) => {
  const router = useRouter();
  const [articleList, setArticleList] = React.useState<API.Article[]>([]);
  const newsTab = tab;
  const iconUrl = icon;
  const [total, setTotal] = React.useState<number>(1);
  const [news, setNews] = React.useState<any>(newsTab[0].categoryList);
  const loadingWrap = React.useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(loadingWrap);
  const showLoading = total > articleList.length;
  const [pagation, setPagation, getPagation] =
    useGetState<Pagation>(initPagation);
  const [none, setNone] = React.useState<boolean>(false);
  const { selectContent } = useContext(ThemeContext);
  const { t } = useTranslation("research");
  const createParams = (params?: Partial<API.ListParams>) => {
    let credibilityParams = null;
    // if(credibility == 'Important'){
    //   credibilityParams = { weight: 0.5 }
    // }else if(credibility == 'Official') {
    //   credibilityParams = { isOfficial: 1 }
    // }else{
    //   credibilityParams = { weight: 0.1 }
    // }
    let timeRange = null;
    if (dateRange.startTime && dateRange.endTime)
      timeRange = {
        startTime: dateRange.startTime,
        endTime: dateRange.endTime,
      };
    if (currentCategoryList?.isAuth) {
      return {
        isAuth: currentCategoryList?.isAuth,
        sector: sector?.label || "",
        pageNum: 1,
        pageSize: 10,
        userType: 1,
        weight: credibility == "Important" ? 0.5 : 0.1,
        isOfficial: credibility == "Official" ? 1 : "",
        keyword: selectToken?.fullName || "",
        search: search || "",
        sourcePlatIdList: source.length == sourceListNum ? [] : source,
        ...timeRange,
        //...credibilityParams,
        ...params,
      };
    } else {
      return {
        categoryList: currentCategoryList?.categoryList
          ? currentCategoryList?.categoryList
          : news,
        pageNum: 1,
        sector: sector?.label || "",
        pageSize: 10,
        userType: 1,
        keyword: selectToken?.fullName || "",
        search: search || "",
        weight: credibility == "Important" ? 0.5 : 0.1,
        isOfficial: credibility == "Official" ? 1 : "",
        ...timeRange,
        sourcePlatIdList: source.length == sourceListNum ? [] : source,
        //...credibilityParams,
        ...params,
      };
    }
  };
  const getArticle = async (params: any) => {
    const res = await getArticleList(params);
    setArticleList([
      ...(params.pageNum === 1 ? [] : articleList),
      ...(res.data.list || []),
    ]);
    if (res.data.list?.length === 0) setNone(true);
    setTotal(+res.data.total);
  };
  const changeNews = (categoryList: any) => {
    setNone(false);
    setArticleList([]);
    setPagation(initPagation);
    setNews(categoryList?.categoryList);
    if (categoryList?.categoryList == news) {
      getArticle(createParams({ categoryList: news, pageNum: 1 }));
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
  const changeSector = (value: string) => {
    if (value !== sector?.label) sectorChange({ value: value, label: value });
  };
  React.useEffect(() => {
    if (inViewport && !!articleList.length) {
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
    changeNews(currentCategoryList);
  }, [currentCategoryList, sector]);
  React.useEffect(() => {
    getArticle(createParams());
  }, [
    news,
    name,
    status,
    selectToken,
    search,
    credibility,
    source,
    startTime,
    endTime,
    dateRange,
  ]);
  return (
    <div className="py-3 h-full flex flex-col items-stretch">
      <div className="flex-1 h-0 overflow-y-auto">
        {articleList.map((item: any, index: number) => (
          <div key={item.id}>
            {/* <Link href={`${item.sourcePlatId == '173' ? `${item.sourceLink}` : `/news/${item.id}`}`} className='no-underline' target='_blank'>   */}
            <div
              className={`text-[#BBBBBB] border-0 ${
                item.weight >= 0.5 ? "border-l-2" : ""
              }  border-solid border-[#F00] hover:bg-[#2B2B2B] py-2 px-3 text-xs font-light`}
            >
              {/* <div className='text-primary-900-White text-sm'>
                  {item.category != 4 && <Link href={item.sourceLink} target="_blank" className='no-underline font-bold text-primary-900-White'> <div className='line-clamp-2 overflow-hidden'>{item.title}</div> </Link>}  
                  {(item.category != 4 && item.category != 1) &&  <div className={`text-secondary-500-300 text-xs w-full select-text my-3 line-clamp-4`} dangerouslySetInnerHTML={{__html:item.content}}></div>}
                  {item.category == 4 &&  <Link href={item.sourceLink} target="_blank" className='no-underline text-xs text-secondary-500-300'> <div className={`w-full select-text my-3 line-clamp-2`} dangerouslySetInnerHTML={{__html:item.content}}></div></Link>} 
                </div> */}
              <Link
                href={`${
                  item.sourcePlatId == "174" ||
                  item.sourcePlatId == "175" ||
                  item.sourcePlatId == "176"
                    ? `/news/${item.id}`
                    : `${item.sourceLink}`
                }`}
                className="no-underline"
                target="_blank"
              >
                <div className="text-primary-900-White text-sm">
                  {currentCategoryList?.title == "Insights" && (
                    <div className="mb-3 flex items-center font-bold">
                      {
                        <img
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = "/img/none.jpeg";
                          }}
                          src={`${
                            item?.authorAvatar && item?.authorAvatar != "false"
                              ? item?.authorAvatar
                              : "/img/none.jpeg"
                          }`}
                          className="align-top mr-2 rounded-full"
                          alt=""
                          width={20}
                          height={20}
                        />
                      }
                      {item.platName ? item.platName : item.source}
                      <span className=" bg-[#1DA1F2]/[.3] ml-2 p-0 w-4 h-4 flex items-center rounded-full">
                        {item.sourcePlatId && (
                          <Image
                            alt=""
                            className="p-0 m-0"
                            src={sourceImg[item.sourcePlatId]}
                            width={12}
                            height={12}
                          />
                        )}
                      </span>
                    </div>
                  )}
                  {
                    <div
                      className={`${
                        item.weight >= 0.5 &&
                        (currentCategoryList?.title === "News" ||
                          currentCategoryList?.title === "Insights")
                          ? "line-clamp-3"
                          : "line-clamp-2"
                      } overflow-hidden mb-3 ${
                        currentCategoryList?.title === "Research" ||
                        currentCategoryList?.title === "SoSo Reports"
                          ? "font-bold"
                          : ""
                      }`}
                    >
                      {currentCategoryList?.title === "News" ||
                      currentCategoryList?.title === "Insights"
                        ? selectContent(item, "title")
                        : selectContent(item, "title") ||
                          selectContent(item, "content") ||
                          selectContent(item, "originalContent") +
                            item.originalContent2}
                    </div>
                  }
                  {
                    (currentCategoryList?.title == "News" ||
                      currentCategoryList?.title == "Insights") && (
                      <div
                        className={`text-secondary-500-300 text-xs w-full select-text mb-3 ${
                          item.weight >= 0.5 ? "line-clamp-4" : "line-clamp-2"
                        }`}
                      >
                        {selectContent(item, "content")}
                        {selectContent(item, "originalContent")}
                        {item.originalContent2}
                      </div>
                    )

                    // <div className={`text-secondary-500-300 text-xs w-full select-text mb-3 ${item.weight > 0.5 ? 'line-clamp-4' : 'line-clamp-2'}`} dangerouslySetInnerHTML={{__html:item.content || (item.originalContent + item.originalContent2)}}></div>
                  }
                </div>
              </Link>
              <div className="flex justify-between items-center">
                <div className="flex">
                  {item.sector &&
                    item.sector != "Others" &&
                    item.sector != "null" && (
                      <div
                        className="mr-3 rounded-3xl text-xs cursor-pointer font-bold px-2 py-0.5 text-secondary-500-300 bg-[#343434]/[.8]"
                        onClick={() => changeSector(item.sector)}
                      >
                        #{item.sector}
                      </div>
                    )}
                  {item.matchedCurrencies &&
                    item.matchedCurrencies.map((i: any, index: number) => {
                      if (index < 3) {
                        return (
                          <div
                            className="mr-2 rounded-3xl text-xs px-2 py-0.5  cursor-pointer text-secondary-500-300 border border-solid border-[#404040]"
                            key={index}
                            onClick={() => goToTrade(i.id)}
                          >
                            {i.name.toUpperCase()}
                          </div>
                        );
                      }
                    })}
                </div>
                <div className="flex">
                  {/* <div className='mr-6 py-0.5'>
                      {
                        (item.category === 3 || item.category === 8 || item.category === 2) && <Link href={item.sourceLink} target="_blank" className='no-underline underline-offset-1'><div><Image src='/img/none.jpeg' className='align-top mr-2' alt="" width={16} height={16}/>{item.category == 4 ? '@' : ''}{ item.platName ? item.platName :item.source}</div></Link>
                      }
                      {
                        (item.category !== 3 && item.category !== 8 && item.category !== 2)  && <Link href={item.sourceLink} target="_blank" className='no-underline underline-offset-1 text-xs text-[#8F8F8F]'><div><Image src='/img/none.jpeg' className='align-top mr-2' alt="" width={16} height={16}/>{item.category == 4 ? '@' : ''}{ item.source ? item.source :'Source'}</div></Link>
                      }
                    </div> */}
                  <Link
                    href={`${
                      item.sourcePlatId == "174" ||
                      item.sourcePlatId == "175" ||
                      item.sourcePlatId == "176"
                        ? `/news/${item.id}`
                        : `${item.sourceLink}`
                    }`}
                    className="no-underline flex"
                    target="_blank"
                  >
                    {/* <Link href={`${item.sourcePlatId == '173' ? `${item.sourceLink}` : `/news/${item.id}`}`} className='no-underline flex' target='_blank'>   */}

                    <div className="mr-6 py-0.5 text-sm text-neutral-fg-2-rest font-medium">
                      {currentCategoryList?.title !== "Insights" &&
                        item.author && (
                          <div>
                            {
                              <img
                                onError={(e: any) => {
                                  e.target.onerror = null;
                                  e.target.src = "/img/none.jpeg";
                                }}
                                src={`${
                                  item?.authorAvatar &&
                                  item?.authorAvatar != "false"
                                    ? item?.authorAvatar
                                    : "/img/none.jpeg"
                                }`}
                                className="align-top mr-2 rounded-full"
                                alt=""
                                width={16}
                                height={16}
                              />
                            }
                            {item.category == 4 ? "@" : ""}
                            {item.author}
                          </div>
                        )}
                    </div>

                    {/* <div className='text-xs text-[#8F8F8F] py-0.5 mr-6'>1 Collected</div> */}
                    {currentCategoryList?.title !== "Insights" &&
                      currentCategoryList?.title !== "News" && (
                        <div className="text-xs text-[#8F8F8F] py-0.5 mr-6">
                          {transferMoney(item.contentNum)} Words
                        </div>
                      )}
                    {(currentCategoryList?.title === "Insights" ||
                      currentCategoryList?.title === "News") && (
                      <div className="text-xs text-[#8F8F8F] py-0.5">
                        {formatDate(item.realiseTime)}
                      </div>
                    )}
                    {(currentCategoryList?.title === "Research" ||
                      currentCategoryList?.title === "SoSo Reports") && (
                      <div className="text-xs text-[#8F8F8F] py-0.5">
                        {formatDateResearch(item.realiseTime)}
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#343434] my-3"></div>
          </div>
        ))}
        {showLoading && (
          <div
            className="flex justify-center items-center text-primary min-h-[100px]"
            ref={loadingWrap}
          >
            <ScaleLoader />
          </div>
        )}
        {articleList.length == 0 && !!none && (
          <div className="h-full flex flex-col items-center justify-center relative">
            {currentCategoryList?.title === "SoSo Reports" && (
              <div className="bg-[url('/img/bg_sosoreport.png')] absolute left-0 top-0 bg-cover w-full h-[88px] justify-between flex items-center px-8">
                <div className="text-xl font-bold text-primary-900-White">
                  {t("SoSoValue CRYPTO")} <br /> {t("RESEARCHER")}{" "}
                  <span className="text-[#FF4F20]">{t("SCHOLARSHIP")}</span>{" "}
                </div>
                <div className="text-sm text-primary-900-White">
                  <span className="mr-[23px]">{t("News-Date")}</span>{" "}
                  <Link
                    href="https://sosovalue.xyz/scholarship"
                    className="no-underline px-3 py-2 bg-[#FF4F20] rounded text-sm font-bold"
                    target="_blank"
                  >
                    {t("Apply Now")}
                  </Link>
                </div>
              </div>
            )}
            {currentCategoryList?.title === "SoSo Reports" ? (
              <div className="pt-[88px] text-center">
                <div className="text-primary-900-White text-base font-bold ">
                  {t("SoSo Reports")}
                </div>
                <div className="text-sm text-secondary-500-300 text-center mt-4">
                  {t("Coming soon, stay tuned!")}
                </div>
              </div>
            ) : (
              <>
                <Image
                  src="/img/svg/FolderSimpleDashed.svg"
                  width={32}
                  height={32}
                  alt=""
                />
                <div className="text-primary-900-White text-base font-bold mt-4">
                  {t("No Results")}
                </div>
                <div className="text-sm text-secondary-500-300 text-center mt-4">
                  {t("Please try to reduce the filtering conditions.")}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
