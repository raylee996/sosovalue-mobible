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
  return (
    <div
      className="py-4 px-5 text-xs font-light w-full overflow-hidden"
      onClick={() => select()}
    >
      {/* <Link href={link} className="no-underline" target="_blank"> */}
      <div className="w-full">
        <div
          className={`text-primary-900-White text-base font-bold line-clamp-3 mb-2 w-full`}
          dangerouslySetInnerHTML={{
            __html: title || "",
          }}
        ></div>
        <div className="flex justify-between items-center mt-2">
          <div className="w-full flex justify-between items-center">
            <div className="mr-6 py-0.5 text-sm text-neutral-fg-2-rest font-medium flex items-center">
              {news.author && (
                <div className="whitespace-nowrap truncate flex items-center">
                  <AuthorAvatar className="w-4 h-4 mr-2" />
                  {isInsight ? "@" : ""}
                  <span className="line-clamp-1 whitespace-normal">
                    {author}
                  </span>
                </div>
              )}
              <span className="ml-2">{timeAgoFormated}</span>
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
          <MatchedCurrency onItemClick={matchedItemClick}/>
        </div>
        <div className="text-xs text-secondary-500-300 whitespace-nowrap py-0.5 flex items-center space-x-4">
          <SharedButton onClick={handleShare} />
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
