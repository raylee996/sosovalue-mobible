import { Button, Radio } from "@mui/material";
import { useInfiniteScroll } from "ahooks";
import { formatDate, formatDateResearch } from "helper/tools";
import { findDefaultSymbolByCurrencyIds, getArticleList } from "http/home";
import { useContext, useMemo, useRef, useState } from "react";
import ArrowIcon from "components/svg/Arrow";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ScaleLoader from "components/base/ScaleLoader";
import { transferMoney } from "helper/tools";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "store/ThemeStore";

export enum Category {
  HighLight = 1,
  Research = "2,8",
  News = "1,3,7",
  Insight = "4",
  Announcement = "7",
}

const categoryConfig = [
  {
    category: Category.HighLight,
    label: "HighLight",
  },
  {
    category: Category.Research,
    label: "Research",
  },
  {
    category: Category.News,
    label: "News",
  },
  {
    category: Category.Insight,
    label: "Insights",
  },
  {
    category: Category.Announcement,
    label: "Announcement",
  },
];

type Props = {
  category: Category | Category[];
  keyword?: string;
  isLoad?: boolean;
};

const PostList = ({ category, keyword, isLoad = true }: Props) => {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isOfficial, setIsOfficial] = useState(false);
  const { t } = useTranslation("home");
  const { selectContent } = useContext(ThemeContext);
  const categoryList = useMemo(() => {
    const list = category;

    return categoryConfig.filter((item) => item.category === list);
    //return list.map(category => categoryConfig.find(item => item.category === category)!)
  }, [category]);
  const { data: posts, loading } = useInfiniteScroll<
    Required<API.ListResponse<API.Article>>
  >(
    async (data) => {
      if (isLoad) {
        const category = categoryList[0].category as string;
        const list = category.split(",");
        const res = await getArticleList({
          pageNum: data ? Number(data.pageNum) + 1 : 1,
          pageSize: 20,
          categoryList: isOfficial ? ["7"] : list,
          keyword,
          isOfficial: isOfficial ? 1 : undefined,
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
      target: listRef.current,
      reloadDeps: [category, keyword, isLoad, isOfficial],
      isNoMore: (data) => {
        return Number(data?.pageNum) >= Number(data?.totalPage);
      },
    }
  );
  const tabChange = () => {
    listRef.current?.scrollTo({ top: 0 });
    setIsOfficial(!isOfficial);
  };
  const toTrade = async (id: string) => {
    const { data } = await findDefaultSymbolByCurrencyIds([id]);
    const { baseAsset, quoteAsset, exchangeName } = data[0];
    router.push(
      `/trade/${baseAsset}-${quoteAsset}-${exchangeName.toUpperCase()}`
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-stretch">
      <div className="h-[42px] flex items-center justify-between px-1">
        <div>
          {categoryList.map(({ category, label }) => (
            <Button
              key={category}
              className="text-title text-sm font-bold normal-case"
            >
              {t(label)}
            </Button>
          ))}
          {category === Category.News && (
            <label className="text-content text-xs cursor-pointer">
              <Radio
                onClick={() => tabChange()}
                checked={isOfficial}
                className="text-content"
                sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
              />
              {t("From Official")}
            </label>
          )}
        </div>
        <Link href={`/news?categoryList=${categoryList[0].label}`}>
          <Button
            className="normal-case text-content"
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
      <div ref={listRef} className="flex-1 h-0 px-3 overflow-y-auto">
        {!!posts?.list.length ? (
          posts?.list.map(
            (
              {
                id,
                title,
                content,
                realiseTime,
                sector,
                sourceLink,
                author,
                contentNum,
                sourcePlatId,
                isOfficial,
                matchedCurrencies,
                originalContent2,
                originalContent,
              },
              index
            ) => {
              const isTwitter = sourcePlatId === "173";
              const isSpec =
                category === Category.News && isTwitter && isOfficial === 1;
              return (
                <Link
                  key={id}
                  href={`${isTwitter ? `${sourceLink}` : `/news/${id}`}`}
                  target="_blank"
                  className="no-underline group"
                >
                  <div className="py-2 border-0 border-b border-solid border-[#242424]">
                    <div className="line-clamp-2 text-sub-title text-[13px] font-medium mb-2 group-hover:text-primary">
                      {selectContent(posts?.list[index], "title") ||
                        selectContent(posts?.list[index], "content") ||
                        selectContent(posts?.list[index], "originalContent") ||
                        originalContent2}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {sector && sector !== "Others" && sector !== "null" && (
                          <Button className="text-xs text-content font-bold normal-case h-5 rounded-full px-2 min-w-0 bg-[rgba(52,52,52,0.80)]">
                            #{sector}
                          </Button>
                        )}
                        <div className="whitespace-nowrap ml-1">
                          {matchedCurrencies
                            ?.slice(0, 3)
                            .map(({ id, name }, index: number) => (
                              <Button
                                className="text-xs text-[#226DFF] min-w-0 px-1"
                                key={index}
                                onClick={() => toTrade(id)}
                              >
                                {name.toUpperCase()}
                              </Button>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-content">
                        {category === Category.News ||
                        category === Category.Insight
                          ? formatDate(realiseTime)
                          : formatDateResearch(realiseTime)}{" "}
                        <span className="mx-2"></span>
                        {isSpec && (
                          <Image
                            src="/img/svg/Megaphone.svg"
                            alt=""
                            width={16}
                            height={16}
                            className="mr-1 align-top"
                          />
                        )}
                        <span
                          className={
                            isSpec
                              ? "text-[#57D98D] max-w-[150px] truncate"
                              : "max-w-[150px] truncate"
                          }
                        >
                          {author}
                        </span>
                        {category === Category.Research && (
                          <>
                            <span className="mx-2"></span>
                            <span className="hidden 2xl:inline">
                              {transferMoney(+contentNum)} {t("words")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          )
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
              {t("no more tip")}
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full flex items-center justify-center float-left">
            <ScaleLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
