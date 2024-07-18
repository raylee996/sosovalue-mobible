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
import SharedButton from "./ShareButton";
import { CategoryConfig } from "./FilterResearch";

type Props = {
  news: Research.Post;
  isFirst?: boolean;
  isLast?: boolean;
  isResearchBlock?: boolean;
  isResearchTable?: boolean;
  categoryConfig: CategoryConfig;
  selectPost: (post: Research.Post) => void;
  onShare?: (post: Research.Post) => void;
  changeSector?: (sector: string) => void;
  matchedItemClick?:(e:React.MouseEvent<HTMLElement>,data:any)=>void;
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
  isFirst,
  isLast,
  isResearchBlock,
  isResearchTable,
  news,
  categoryConfig,
  changeSector,
  selectPost,
  onShare,
  matchedItemClick,
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
    selectPost(news);
    onLinkClick?.();
  };
  const handleShare = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    typeof onShare === "function" && onShare(news);
  };

  const renderResearch = () => {
    return isResearchBlock ? (
      <div
        key={news.id}
        className="w-full border border-solid border-primary-100-700 mx-4 mb-6 rounded-xl overflow-hidden"
      >
        <div className="h-[128px] overflow-hidden">
          <img
            src={coverPicture || "/img/default.jpeg"}
            className="w-full h-full block bg-cover bg-center object-cover bg-no-repeat"
            width={500}
            height={200}
            alt=""
          />
        </div>
        <div className="p-5">
          <div
            className={`text-primary-900-White font-bold text-base line-clamp-2 overflow-hidden mb-3`}
            dangerouslySetInnerHTML={{
              __html: title || "",
            }}
          ></div>
          <div
            className={`text-primary-900-White text-sm w-full select-text limit-img line-clamp-4 mb-6`}
            dangerouslySetInnerHTML={{
              __html: `${translateTip || ""}  ${content}`,
            }}
          ></div>
          <div className="flex flex-wrap items-center gap-y-2">
            <Sector className="mr-2" />
            <MatchedCurrency onItemClick={matchedItemClick} />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="w-full flex justify-between items-center">
              <div className="mr-6 py-0.5 text-sm text-primary-900-White font-semibold">
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
              <div className="flex items-center space-x-4">
                {/* <div className="text-xs text-[#8F8F8F] whitespace-nowrap py-0.5">
                  {transferMoney(+news.contentNum)} {t("Words")}
                </div>
                <span>{timeAgoFormated}</span>
                </div> */}
                <SharedButton
                  className="text-secondary-500-300 text-xs"
                  onClick={handleShare}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : isResearchTable ? (
      <div
        key={news.id}
        className={`w-full border border-solid border-primary-100-700 mx-4 ${
          isFirst ? "rounded-t-xl" : "border-t-0"
        } ${isLast ? "rounded-b-xl" : ""}`}
      >
        <div className={`p-4 text-xs font-light`}>
          <div
            className={`text-primary-900-White font-bold text-base line-clamp-2 overflow-hidden`}
            dangerouslySetInnerHTML={{
              __html: title || "",
            }}
          ></div>
          <div className="mr-6 my-2 text-sm text-neutral-fg-2-rest font-medium">
            {news.author && (
              <div className="whitespace-nowrap truncate flex items-center">
                <AuthorAvatar className="w-4 h-4 mr-2" />
                {isInsight ? "@" : ""}
                <span className="line-clamp-1 whitespace-normal">{author}</span>
              </div>
            )}
          </div>
          <div
            className={`text-primary-900-White text-sm w-full select-text mb-3 limit-img line-clamp-4`}
            dangerouslySetInnerHTML={{
              __html: `${translateTip || ""}  ${content}`,
            }}
          ></div>
          <img
            src={coverPicture || "/img/default.jpeg"}
            className="block rounded-lg"
            width={146}
            height={100}
            alt=""
          />

          <div className="flex justify-between items-center mt-2">
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-y-2">
                <Sector className="mr-2" />
                <MatchedCurrency onItemClick={matchedItemClick} />
              </div>
              <div className="flex items-center space-x-4">
                {/* <div className="text-xs text-[#8F8F8F] whitespace-nowrap py-0.5">
                  {transferMoney(+news.contentNum)} {t("Words")}
                </div>
                <span>{timeAgoFormated}</span>
                </div> */}
                <SharedButton onClick={handleShare} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };
  const renderNews = () => {
    return (
      <div
        key={news.id}
        className={`border border-solid border-primary-100-700 mx-4 ${
          isFirst ? "rounded-t-xl" : "border-t-0"
        } ${isLast ? "rounded-b-xl" : ""}`}
      >
        <div className={`py-4 px-5 text-xs font-light`}>
          {/* <Link href={link} className="no-underline" target="_blank"> */}
          <div>
            <div
              className={`text-primary-900-White text-base font-bold truncate mb-2`}
              dangerouslySetInnerHTML={{
                __html: title || "",
              }}
            ></div>
            <div className="flex justify-between items-center mt-2">
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
            </div>
            <div
              className={`text-primary-900-White text-sm w-full select-text mb-2 limit-img research-news-list-clamp-4`}
              dangerouslySetInnerHTML={{
                __html: `${translateTip || ""}  ${content}`,
              }}
            ></div>
          </div>
          {/* </Link> */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Sector />
              <MatchedCurrency onItemClick={matchedItemClick} />
            </div>
            <div className="text-xs text-[#8F8F8F] whitespace-nowrap py-0.5 flex items-center space-x-4">
              <span>{timeAgoFormated}</span>
              <SharedButton onClick={handleShare} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderInstitution = () => {
    const isTwitter = news.sourcePlatId === "173";
    return (
      <div
        key={news.id}
        className={`w-full border border-solid border-primary-100-700 mx-4 ${
          isFirst ? "rounded-t-xl" : "border-t-0"
        } ${isLast ? "rounded-b-xl" : ""}`}
      >
        <div className={`p-4 text-xs font-light`}>
          {/* <Link href={link} className="no-underline" target="_blank"> */}
          <div className="text-[#F4F4F4] text-sm">
            <div className="mb-3 flex items-center text-xs text-primary-900-White font-semibold">
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
            </div>
            {isTwitter ? (
              <div
                className={`text-primary-900-White text-sm w-full select-text mb-2 line-clamp-3 limit-img break-all`}
                dangerouslySetInnerHTML={{
                  __html: `${translateTip || ""}  ${content}`,
                }}
              ></div>
            ) : (
              <>
                <div
                  className={` text-primary-900-White text-base font-bold overflow-hidden mb-2`}
                  dangerouslySetInnerHTML={{
                    __html: title || "",
                  }}
                ></div>
                <div
                  className={` text-primary-900-White text-sm w-full select-text mb-2 line-clamp-4`}
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                ></div>
              </>
            )}
          </div>
          {/* </Link> */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Sector className="mr-2" />
              <MatchedCurrency onItemClick={matchedItemClick} />
            </div>
            <div className="text-xs text-[#8F8F8F] whitespace-nowrap py-0.5 flex items-center space-x-4">
              <span>{timeAgoFormated}</span>
              <SharedButton onClick={handleShare} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderChildren = () => {
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
  };
  return (
    <ListItemButton className="p-0" onClick={() => select()}>
      {renderChildren()}
    </ListItemButton>
  );
};

export default NewsItem;
