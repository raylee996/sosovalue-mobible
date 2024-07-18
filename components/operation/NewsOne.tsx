/* eslint-disable react/display-name */
import React, { useContext } from "react";
import Link from "next/link";
import { getArticleList, findDefaultSymbolByCurrencyIds } from "http/home";
import { formatDate, formatDateResearch } from "helper/tools";
import ScaleLoader from "components/base/ScaleLoader";
import Image from "next/image";
import { useInViewport, useGetState } from "ahooks";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import ArrowIcon from "components/svg/Arrow";
import { transferMoney } from "helper/tools";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "store/ThemeStore";

type Props = {
  tab: Array<{ categoryList: number[]; title: string }>;
  coinList?: any;
  icon?: string;
  height?: string;
  name?: string;
  status?: boolean;
  fullName?: string;
};
const initPagation = { pageNum: 1, pageSize: 30 };
type Pagation = {
  pageNum: number;
  pageSize: number;
};
const newsTab = [
  {
    title: "News",
    category: 3,
  },
  {
    title: "Research",
    category: 2,
  },
  {
    title: "Tweets",
    category: 4,
  },
];
const News = ({
  tab,
  icon,
  status,
  coinList,
  height,
  name,
  fullName,
}: Props) => {
  const router = useRouter();
  const { selectContent } = useContext(ThemeContext);
  const { t } = useTranslation("portfolio");

  const [articleList, setArticleList] = React.useState<API.Article[]>([]);
  const newsTab = tab;
  const iconUrl = icon;
  const [total, setTotal] = React.useState<number>(1);
  const [news, setNews] = React.useState<any>(newsTab[0].categoryList);
  const [title, setTitle] = React.useState<string>(newsTab[0].title);
  const loadingWrap = React.useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(loadingWrap);
  const showLoading = total > articleList.length;
  const [pagation, setPagation, getPagation] =
    useGetState<Pagation>(initPagation);
  const createParams = (params?: Partial<API.ListParams>) => {
    if (name && fullName) {
      return {
        categoryList: news,
        keyword: name + "," + fullName,
        pageNum: 1,
        pageSize: 30,
        userType: 1,
        ...params,
      };
    } else {
      return {
        categoryList: news,
        pageNum: 1,
        pageSize: 30,
        userType: 1,
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
    // setArticleList([])
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
        category: news,
      };
      setPagation(newPagation);
      getArticle(createParams(newPagation));
    }
  }, [inViewport]);

  React.useEffect(() => {
    if (status) {
      getArticle(createParams());
    }
  }, [news, name, status]);
  return (
    <div className="py-3 h-full flex flex-col items-stretch">
      <div className="flex mb-2 justify-between px-3 border-0 border-b border-solid border-[#242424]">
        <div className="flex justify-center items-center mb-3">
          {iconUrl && (
            <div className="flex">
              {" "}
              <Image
                src={iconUrl}
                alt=""
                width={16}
                height={16}
                className="mr-2"
              />
            </div>
          )}
          {newsTab.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer  text-sm text-center flex justify-center mr-4 items-center ${
                title === item.title
                  ? "text-[#F4F4F4] font-bold"
                  : "text-[#8D8D8D]"
              }`}
              onClick={() => changeNews(item.categoryList, item.title)}
            >
              {item.title}
            </div>
          ))}
        </div>
        <Link href={`/news?categoryList=${title}`}>
          <Button
            className="normal-case text-xs font-normal align-[2px] text-content p-0"
            endIcon={
              <ArrowIcon
                className="text-content text-base -rotate-90"
                viewBox="0 0 13 12"
              />
            }
          >
            {t("View More")}
          </Button>
        </Link>
      </div>
      {!!articleList.length ? (
        <div className="flex-1 h-0 overflow-y-auto">
          {articleList.map((item: any) => (
            <div key={item.id} className="mx-3">
              <div className="text-[#BBBBBB] text-xs font-light">
                <div className="text-[#CCCCCC] font-medium">
                  <Link
                    href={`${
                      item.sourcePlatId == "174" ||
                      item.sourcePlatId == "175" ||
                      item.sourcePlatId == "176"
                        ? `/news/${item.id}`
                        : `${item.sourceLink}`
                    }`}
                    className="no-underline text-[#BBBBBB] hover:text-[#FF4F20]"
                    target="_blank"
                  >
                    {/* <Link href={`${item.sourcePlatId == '173' ? `${item.sourceLink}` : `/news/${item.id}`}`} target="_blank" className='no-underline text-[#BBBBBB] hover:text-[#FF4F20] '>  */}
                    <div className="line-clamp-2 text-[13px] text-[#C2C2C2] font-medium overflow-hidden">
                      {selectContent(item, "title") ||
                        selectContent(item, "content") ||
                        selectContent(item, "originalContent") ||
                        item.originalContent2}
                    </div>
                  </Link>
                  {/* { item.category != 4 && <Link href={item.sourceLink} target="_blank" className='no-underline text-[#BBBBBB] hover:text-[#FF4F20] '> <div className='line-clamp-2 text-[13px]  overflow-hidden'>{item.title}</div> </Link>}  
                  {(item.category != 4 && item.category != 1) &&  <div className={`text-[#8D8D8D] w-full select-text my-2 line-clamp-4`} dangerouslySetInnerHTML={{__html:item.content}}></div>}
                  {item.category == 4 &&  <Link href={item.sourceLink} target="_blank" className='no-underline text-[#BBBBBB] hover:text-[#FF4F20] '> <div className={`w-full select-text my-2 line-clamp-2`} dangerouslySetInnerHTML={{__html:item.content}}></div></Link>}  */}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex">
                    {item.sector &&
                      item.sector != "Others" &&
                      item.sector != "null" && (
                        <div className="mr-2 rounded-3xl text-xs cursor-pointer font-bold px-2 text-[#C2C2C2] bg-[#343434]/[.8]">
                          #{item.sector}
                        </div>
                      )}
                    {item.matchedCurrencies &&
                      item.matchedCurrencies.map((i: any, index: number) => {
                        if (index < 3) {
                          return (
                            // <Link href={`/trade/${i.symbolDoVO?.baseAsset}-${i.symbolDoVO?.quoteAsset}-${i.symbolDoVO?.exchangeName.toUpperCase()}`} key={index} className='text-inherit underline-offset-1 text-[#8D8D8D]'> <div className='mr-2 text-xs underline underline-offset-1 text-[#4589FF]'>{i.name.toUpperCase()}</div></Link>
                            <div
                              className="mr-2 text-xs cursor-pointer text-[#4589FF]"
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
                    {(item.category === 2 || item.category === 8) && (
                      <div className="text-xs text-[#8D8D8D]">
                        {formatDateResearch(item.realiseTime)}
                      </div>
                    )}
                    {(item.category === 1 ||
                      item.category === 3 ||
                      item.category === 7 ||
                      item.category === 4) && (
                      <div className="text-xs text-[#8D8D8D]">
                        {formatDate(item.realiseTime)}
                      </div>
                    )}

                    {item.author && (
                      <div
                        className={`ml-4 text-xs max-w-[150px] truncate ${
                          item.category !== 4 &&
                          item.category !== 2 &&
                          item.category !== 8 &&
                          item.sourcePlatId == "173" &&
                          item.isOfficial == 1
                            ? "text-[#57D98D]"
                            : "text-[#8F8F8F]"
                        }  font-light`}
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
                    {item.category !== 4 &&
                      item.category !== 1 &&
                      item.category !== 3 &&
                      item.category !== 7 && (
                        <div className="text-xs text-[#8D8D8D] ml-4 hidden 2xl:inline">
                          {transferMoney(item.contentNum)} {t("Words")}
                        </div>
                      )}
                    {/* <div className='ml-4'>
                      <Link href={item.sourceLink} target="_blank" className='underline-offset-1 text-[#8F8F8F]'><div>{item.category == 4 ? '@' : ''}{ item.source ? item.source :'Source'}<Image src='/img/svg/ArrowSquareOut.svg' className='align-top' alt="" width={16} height={16}/></div></Link>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="h-px bg-[#343434] my-2"></div>
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
        </div>
      ) : (
        <div className="h-full px-6 flex flex-col items-center justify-center">
          <Image
            src="/img/svg/FolderSimpleDashed.svg"
            width={32}
            height={32}
            alt=""
          />
          <div className="text-[#F4F4F4] text-base font-bold mt-4">
            {t("Oops, no more content available.")}{" "}
          </div>
          <div className="text-sm text-[#C2C2C2] text-center mt-4">
            {t("NewsOne-Tip")}
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
