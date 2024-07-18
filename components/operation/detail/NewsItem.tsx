import Link from "next/link";
import Image from "next/image";
import { formatDate, transferMoney } from "helper/tools";
import { findDefaultSymbolByCurrencyIds } from "http/home";
import { useRouter } from "next/router";
import { SyntheticEvent, useContext, useMemo } from "react";
import { ThemeContext } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { UserContext } from "store/UserStore";
import { ListItemButton } from "@mui/material";
import { usePost } from "hooks/operation/usePost";
import SharedButton from "components/operation/research/ShareButton";
import { CategoryConfig } from "../research/FilterResearch";

type Props = {
  news: Research.Post;
  categoryConfig: CategoryConfig;
  selectPost: (post: Research.Post) => void;
  onShare?: (post: Research.Post) => void;
  changeSector?: (sector: string) => void;
  onLinkClick?:()=>void;
};

const sourceImg: any = {
  173: "/img/svg/twitter_icon.svg",
  174: "/img/svg/substack_icon.svg",
  175: "/img/svg/mirror_icon.svg",
  176: "/img/svg/medium_icon.svg",
  177: "/img/svg/cryptoMedia_icon.svg",
};

const NewsItem = ({
  news,
  categoryConfig,
  changeSector,
  selectPost,
  onShare,
  onLinkClick
}: Props) => {
  const router = useRouter();
  const { post } = usePost({ post: news });
  const {
    title,
    seoTitle,
    seoMeta,
    content,
    FinalContent,
    Sector,
    MatchedCurrency,
    translateTip,
    TranslateTip,
    releaseTimeFormated,
    timeAgoFormated,
    isResearch,
    isNews,
    isInsight,
    isAuth,
    isTwitter,
    isAiGeneration,
    sourceLink,
    AuthorAvatar,
    SourcePlatImg,
    raw,
  } = post;
  const { weight, id, author, sourceDescription, coverPicture } = raw!;
  const { t } = useTranslation("common");
  const select = () => {
    onLinkClick?.();
    selectPost(news);
  };
  const handleShare = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    typeof onShare === "function" && onShare(news);
  };

  const renderResearch = () => {
    return (
      <div key={news.id} className="w-full overflow-hidden">
        <div className={`px-4 text-xs font-light mb-4`}>
          <div className="flex items-center">
            <div className="flex justify-between items-center">
              <div className="w-full flex justify-between items-center">
                <Sector />
                <div className="mr-2 text-xs text-neutral-fg-2-rest font-medium">
                  {news.author && (
                    <div className="whitespace-nowrap truncate flex items-center">
                      <span className="line-clamp-1 whitespace-normal">
                        {author}
                      </span>
                      <i className="inline-block h-1 w-1 rounded-full bg-secondary-500-300 ml-2" />
                    </div>
                  )}
                </div>
                <MatchedCurrency />
              </div>
            </div>
          </div>
          <div
            className={`text-primary-900-White text-sm font-semibold line-clamp-3 my-1`}
            dangerouslySetInnerHTML={{
              __html: title || "",
            }}
          ></div>
          {/* <div
            className={`text-[#C2C2C2] text-xs w-full select-text mb-3 limit-img ${
              news.weight >= 0.5 ? "line-clamp-4" : "line-clamp-2"
            }`}
            dangerouslySetInnerHTML={{
              __html: `${translateTip || ""}  ${content}`,
            }}
          ></div> */}
          {/* <div className="flex flex-wrap items-center gap-y-2">
            <Sector className="mr-2" />
            <MatchedCurrency />
          </div> */}
          <div className="flex justify-between items-center">
            <div className="w-full flex justify-between items-center">
              {/* <div className="mr-6 py-0.5 text-sm text-neutral-fg-2-rest font-medium">
                {news.author && (
                  <div className="whitespace-nowrap truncate flex items-center">
                    <AuthorAvatar className="w-4 h-4 mr-2" />
                    {isInsight ? "@" : ""}
                    <span className="line-clamp-1 whitespace-normal">
                      {author}
                    </span>
                  </div>
                )}
              </div> */}
              <div className="flex items-center space-x-4">
                {/* <div className="text-xs text-[#8F8F8F] whitespace-nowrap py-0.5">
                  {transferMoney(+news.contentNum)} {t("Words")}
                </div>
                <span>{timeAgoFormated}</span>
                </div> */}
                <div className="text-sm text-secondary-500-300 whitespace-nowrap flex items-center space-x-4">
                  <span>{timeAgoFormated}</span>
                </div>
                {/* <SharedButton onClick={handleShare} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderNews = () => {
    return (
      <div key={news.id} className="w-full overflow-hidden">
        <div className={`px-4 text-xs font-light mb-4`}>
          {/* <Link href={link} className="no-underline" target="_blank"> */}
          <div className="flex items-center">
            <div className="flex justify-between items-center">
              <div className="w-full flex justify-between items-center">
                <Sector />
                <div className="mr-2 text-xs text-neutral-fg-2-rest font-medium">
                  {news.author && (
                    <div className="whitespace-nowrap truncate flex items-center">
                      <span className="line-clamp-1 whitespace-normal">
                        {author}
                      </span>
                      <i className="inline-block h-1 w-1 rounded-full bg-secondary-500-300 ml-2" />
                    </div>
                  )}
                </div>
                <MatchedCurrency />
              </div>
            </div>
          </div>
          <div>
            <div
              className={`text-primary-900-White text-sm font-semibold line-clamp-3 my-1`}
              dangerouslySetInnerHTML={{
                __html: title || "",
              }}
            ></div>
            {/* <div className="flex justify-between items-center mt-2">
              <div className="w-full flex justify-between items-center">
                <div className="mr-6 py-0.5 text-sm text-neutral-fg-2-rest font-medium">
                  {news.author && (
                    <div className="whitespace-nowrap truncate flex items-center">
                      <AuthorAvatar className="w-4 h-4 mr-2" />
                      {isInsight ? "@" : ""}
                      <span className="line-clamp-1 whitespace-normal">
                        {author}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
            {/* <div
              className={`text-primary-900-White text-sm w-full select-text mb-2 limit-img research-news-list-clamp-4`}
              dangerouslySetInnerHTML={{
                __html: `${translateTip || ""}  ${content}`,
              }}
            ></div> */}
          </div>
          {/* </Link> */}
          <div className="flex justify-between items-center">
            {/* <div className="flex items-center">
              <Sector />
              <MatchedCurrency />
            </div> */}
            <div className="text-sm text-secondary-500-300 whitespace-nowrap flex items-center space-x-4">
              <span>{timeAgoFormated}</span>
              {/* <SharedButton onClick={handleShare} /> */}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderInstitution = () => {
    const isTwitter = news.sourcePlatId === "173";
    return (
      <div key={news.id} className="w-full overflow-hidden">
        <div className={`px-4 text-xs font-light mb-4`}>
          {/* <Link href={link} className="no-underline" target="_blank"> */}
          <div className="flex items-center">
            <div className="flex justify-between items-center">
              <div className="w-full flex justify-between items-center">
                <Sector />
                <div className="mr-2 text-xs text-neutral-fg-2-rest font-medium">
                  {news.author && (
                    <div className="whitespace-nowrap truncate flex items-center">
                      <span className="line-clamp-1 whitespace-normal">
                        {author}
                      </span>
                      <i className="inline-block h-1 w-1 rounded-full bg-secondary-500-300 ml-2" />
                    </div>
                  )}
                </div>
                <MatchedCurrency />
              </div>
            </div>
          </div>
          <div className="text-[#F4F4F4] text-sm">
            {/* <div className="mb-3 flex items-center text-xs text-primary-900-White font-semibold">
              <AuthorAvatar className="w-5 h-5 mr-2" />
              {news.platName ? news.platName : news.source}
              {news.sourceDescription && (
                <span className="text-content text-xs flex items-center font-normal ml-2 line-clamp-2">
                  {news.sourceDescription}
                </span>
              )}
              <span className="bg-[#1DA1F2]/[.3] ml-2 p-0 w-4 h-4 flex items-center rounded-full">
                <SourcePlatImg />
              </span>
            </div> */}
            {isTwitter ? (
              <div
                className={`text-primary-900-White text-sm font-semibold line-clamp-3 my-1`}
                dangerouslySetInnerHTML={{
                  __html: `${translateTip || ""}  ${content}`,
                }}
              ></div>
            ) : (
              <>
                <div
                  className={`text-primary-900-White text-sm font-semibold line-clamp-3 my-1`}
                  dangerouslySetInnerHTML={{
                    __html: title || "",
                  }}
                ></div>
                <div
                  className={`text-primary-900-White text-sm font-semibold line-clamp-3 my-1`}
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                ></div>
              </>
            )}
          </div>
          {/* </Link> */}
          <div className="flex justify-between items-center">
            {/* <div className="flex items-center">
              <Sector className="mr-2" />
              <MatchedCurrency />
            </div> */}
            <div className="text-sm text-secondary-500-300 whitespace-nowrap flex items-center space-x-4">
              <span>{timeAgoFormated}</span>
              {/* <SharedButton onClick={handleShare} /> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const item = useMemo(() => {
    if (categoryConfig.isResearch) {
      return renderResearch();
    } else if (categoryConfig.isNews) {
      return renderNews();
    } else if (categoryConfig.isInstitution) {
      return renderInstitution();
    } else if (categoryConfig.isInsights) {
      return renderInstitution();
    } else if (categoryConfig.isOnchain) {
      return renderInstitution();
    } else if (categoryConfig.isTech) {
      return renderInstitution();
    } else if (categoryConfig.isProjectUpdate) {
      return renderInstitution();
    }
    return null;
  }, [news, categoryConfig, router.locale]);
  return (
    <ListItemButton className="p-0" onClick={() => select()}>
      {item}
    </ListItemButton>
  );
};

export default NewsItem;
