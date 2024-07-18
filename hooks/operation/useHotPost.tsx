import dayjs from "dayjs";
import { createCurrencyDetailLink } from "helper/link";
import { replaceImgCros } from "helper/tools";
import { getNewArticleList } from "http/home";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "store/ThemeStore";

export const useHotPost = ({
  post,
  needRelatedInsights,
}: {
  post?: Research.ClusterNews;
  needRelatedInsights?: boolean;
}) => {
  const { selectContent } = useContext(ThemeContext);
  const { t } = useTranslation("research");
  const [relatedInsights, setRelatedInsights] = useState<
    { sector: string; newsList: Research.Post[] }[]
  >([]);
  const createPost = (post?: Research.ClusterNews) => {
    const title = selectContent(post, "title", "hot");
    const content = replaceImgCros(selectContent(post, "content", "hot"));
    const formatedTime = dayjs(Number(post?.createTime)).format("MMM D,YYYY");
    const translateTip = t("Powered scene 11");
    const matchedCurrencies = (
      post?.matchedCurrencies ? JSON.parse(post.matchedCurrencies) : []
    ) as Research.HotNewsMatchedCurrency[];
    const Sector = ({ className }: { className?: string }) =>
      post?.sector && post.sector !== "Others" && post.sector !== "null" ? (
        <>
          <span
            className={`rounded-3xl text-xs cursor-pointer font-bold px-0 mr-2 py-0 h-5  flex items-center text-secondary-500-300 whitespace-nowrap ${className}`}
          >
            #{post.sector}{" "}
            {!!matchedCurrencies.length && (
              <i className="inline-block h-1 w-1 rounded-full bg-secondary-500-300 ml-2" />
            )}
          </span>
        </>
      ) : null;
    const MatchedCurrency = ({ className }: { className?: string }) => {
      return (
        <>
          {matchedCurrencies.slice(0, 3).map((item, index) => (
            <Link
              onClick={(e) => e.stopPropagation()}
              href={createCurrencyDetailLink({ fullName: item.fullName })}
              key={index}
              className={`rounded-3xl text-xs px-1 py-0 h-5 flex items-center cursor-pointer text-accent-600 no-underline ${className}`}
            >
              {item.name.toUpperCase()}
            </Link>
          ))}
        </>
      );
    };
    return {
      raw: post,
      title,
      content,
      formatedTime,
      translateTip,
      matchedCurrencies,
      Sector,
      MatchedCurrency,
    };
  };
  const formatedPost = useMemo(() => createPost(post), [post]);
  useEffect(() => {
    if (needRelatedInsights && post?.entityList) {
      const entityList = JSON.parse(post.entityList) as string[];
      Promise.all(
        entityList.map((sector) =>
          getNewArticleList({
            pageNum: 1,
            pageSize: 3,
            categoryList: ["3", "4"],
            userType: 1,
            search: sector,
          })
        )
      ).then((resList) => {
        const relatedInsights = resList
          .map((res, index) => {
            return {
              sector: entityList[index],
              newsList: res.data.list.slice(0, 3),
            };
          })
          .filter((item) => !!item.newsList.length);
        setRelatedInsights(relatedInsights);
      });
    }
  }, [post, needRelatedInsights]);
  return {
    post: formatedPost,
    createPost,
    relatedInsights,
  };
};
