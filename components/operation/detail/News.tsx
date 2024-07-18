/* eslint-disable react/display-name */
import React from "react";
import Link from "next/link";
import { getArticleList } from "http/home";
import { formatDate } from "helper/tools";
import ScaleLoader from "components/base/ScaleLoader";
import Image from "next/image";
import { useInViewport, useGetState } from "ahooks";
import { Button } from "@mui/material";
import ArrowIcon from "components/svg/Arrow";

type Props = {
  tab: { categoryList: number[]; title: string };
  coinList?: any;
  icon?: string;
  height?: string;
  name?: string;
  fullName?: string;
};
const initPagation = { pageNum: 1, pageSize: 10 };
type Pagation = {
  pageNum: number;
  pageSize: number;
};
const News = ({ tab, icon, coinList, height, name, fullName }: Props) => {
  const [articleList, setArticleList] = React.useState<API.Article[]>([]);
  const newsTab = tab;
  const iconUrl = icon;
  const [total, setTotal] = React.useState<number>(1);
  const [news, setNews] = React.useState<any>(newsTab.categoryList);
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
        pageSize: 10,
        userType: 1,
        ...params,
      };
    } else {
      return {
        categoryList: news,
        pageNum: 1,
        pageSize: 10,
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
    if (name) {
      getArticle(createParams());
    }
  }, [news, name]);

  return (
    <div className="h-full flex flex-col items-stretch bg-[linear-gradient(180deg,#0D0D0D_0%,#212121_100%)]">
      <div className="flex items-center justify-between p-3 h-[45px]">
        <div
          className={`cursor-pointer  text-sm text-center flex justify-center mr-4 items-center text-title`}
        >
          {newsTab.title}
        </div>
        <Link href="/news">
          <Button
            className="normal-case text-content"
            endIcon={
              <ArrowIcon
                className="text-content text-base -rotate-90"
                viewBox="0 0 13 12"
              />
            }
          >
            View More
          </Button>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto bg-block-color">
        {!!articleList.length ? (
          <div>
            {articleList.map((item: any) => (
              <div key={item.id} className="mx-3">
                <div className="text-[#BBBBBB] text-xs font-light">
                  <div className="text-[#CCCCCC] font-medium">
                    {item.category != 4 && item.category != 7 && (
                      <Link
                        href={item.sourceLink}
                        target="_blank"
                        className="no-underline text-[#BBBBBB] hover:text-[#FF4F20] "
                      >
                        {" "}
                        <div className="line-clamp-2 text-[13px]  overflow-hidden">
                          {item.title}
                        </div>{" "}
                      </Link>
                    )}
                    {item.category != 4 &&
                      item.category != 1 &&
                      item.category != 7 && (
                        <div
                          className={`text-[#8D8D8D] w-full select-text my-2 line-clamp-4`}
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        ></div>
                      )}
                    {(item.category == 4 || item.category == 7) && (
                      <Link
                        href={item.sourceLink}
                        target="_blank"
                        className="no-underline text-[#BBBBBB] hover:text-[#FF4F20]"
                      >
                        {" "}
                        <div
                          className={`w-full select-text mb-2 line-clamp-2`}
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        ></div>
                      </Link>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex">
                      <div className="text-xs text-[#8D8D8D]">
                        {formatDate(item.realiseTime)}{" "}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="ml-4">
                        {(item.category === 3 ||
                          item.category === 8 ||
                          item.category === 2) && (
                          <Link
                            href={item.sourceLink}
                            target="_blank"
                            className="underline-offset-1 text-[#8F8F8F]"
                          >
                            <div>
                              {item.category == 4 ? "@" : ""}
                              {item.platName ? item.platName : item.source}
                              <Image
                                src="/img/svg/ArrowSquareOut.svg"
                                className="align-top"
                                alt=""
                                width={16}
                                height={16}
                              />
                            </div>
                          </Link>
                        )}
                        {item.category !== 3 &&
                          item.category !== 8 &&
                          item.category !== 2 && (
                            <Link
                              href={item.sourceLink}
                              target="_blank"
                              className="underline-offset-1 text-[#8F8F8F]"
                            >
                              <div>
                                {item.category == 4 ? "@" : ""}
                                {item.source ? item.source : "Source"}
                                <Image
                                  src="/img/svg/ArrowSquareOut.svg"
                                  className="align-top"
                                  alt=""
                                  width={16}
                                  height={16}
                                />
                              </div>
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-[#343434] my-2"></div>
              </div>
            ))}
            {showLoading && (
              <div
                className="flex justify-center items-center text-primary"
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
              Oops, no more content available.{" "}
            </div>
            <div className="text-sm text-[#C2C2C2] text-center mt-4">
              If you have any high-quality sources, feel free to Feedback and
              grab mystery gift boxes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
