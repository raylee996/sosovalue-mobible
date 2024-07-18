import { INVITE_CODE_KEY, categoryConfig } from "helper/constants";
import { findDefaultSymbolByCurrencyIds } from "http/home";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { Avatar } from "@mui/material";
import { formatDate, isBrowser, replaceImgCros } from "helper/tools";
import { Nature, createCurrencyDetailLink } from "helper/link";
import Link from "next/link";
import GPTIcon from "components/icons/gpt.svg";
import { UserContext } from "store/UserStore";
import useTelegramStore from "store/useTelegramStore";
import { getTelegramShareUrl } from "helper/config";

enum Language {
  EN = "en",
  ZH = "zh",
  TC = "tc",
  JA = "ja",
}

type Option = {
  post?: Research.Post | null;
};

export const postKeyMap = {
  [Language.EN]: {
    title: "transferTitle",
    content: "transferContent",
    originalContent: "transferOriginalContent",
    seoTitle: "transferSeoTitle",
    seoMeta: "transferSeoMeta",
  },
  [Language.ZH]: {
    title: "transferTitle",
    content: "transferContent",
    originalContent: "transferOriginalContent",
    seoTitle: "transferSeoTitle",
    seoMeta: "transferSeoMeta",
  },
  [Language.TC]: {
    title: "transferTitle",
    content: "transferContent",
    originalContent: "transferOriginalContent",
    seoTitle: "transferSeoTitle",
    seoMeta: "transferSeoMeta",
  },
  [Language.JA]: {
    title: "transferTitle",
    content: "transferContent",
    originalContent: "transferOriginalContent",
    seoTitle: "transferSeoTitle",
    seoMeta: "transferSeoMeta",
  },
} as const;

const sourceImgMap: Record<string, string> = {
  173: "/img/svg/twitter_icon.svg",
  174: "/img/svg/substack_icon.svg",
  175: "/img/svg/mirror_icon.svg",
  176: "/img/svg/medium_icon.svg",
  177: "/img/svg/cryptoMedia_icon.svg",
};

const createTranslateTip = (
  isGenerateWay: boolean,
  isAiGeneration: boolean,
  isTranslated: boolean,
  locale: string
) => {
  // // generateWay	新闻生成方式,0-自动采集,1-后台发布 人工发布不需要展示这个字段
  if (isGenerateWay) return null;
  if (isAiGeneration) {
    if (isTranslated) {
      return {
        [Language.EN]: "Powered by ChatGPT",
        [Language.ZH]: "由AI总结并翻译",
        [Language.TC]: "由AI總結並翻譯",
        [Language.JA]: "AIによる要約と翻訳",
      }[locale];
    } else {
      return {
        [Language.EN]: "Powered by ChatGPT",
        [Language.JA]: "ChatGPTによって提供されています",
      }[locale];
    }
  } else {
    if (isTranslated) {
      return {
        [Language.ZH]: "由AI翻译",
        [Language.TC]: "由AI翻譯",
        [Language.JA]: "AIによる翻訳",
      }[locale];
    }
  }
};

export const usePost = (option?: Option) => {
  const router = useRouter();
  const locale = router.locale as Language;
  const isEN = locale === Language.EN;
  const isZH = locale === Language.ZH;
  const isTC = locale === Language.TC;

  const createPost = (post?: Research.Post | null) => {
    const isNews = post && categoryConfig.news.includes(post.category);
    const isResearch = post && categoryConfig.research.includes(post.category);
    const isInsititution =
      post && categoryConfig.insititution.includes(post.category);
    const isInsight = post && categoryConfig.insight.includes(post.category);
    const isTwitter = post?.sourcePlatId === "173";
    // 是否soso reports认证,0否，1是
    const isAuth = post?.isAuth === 1;
    // generateWay	新闻生成方式,0-自动采集,1-后台发布
    const isGenerateWay = post?.generateWay === 1;
    const isAiGeneration = post?.isAiGeneration === 1;
    // 原有逻辑 0 没翻译 1 翻译，现有逻辑更新
    const isTranslated = (post?.transferStatus || 0) >= 1;
    const isOriginalEN = post?.originalLanguage === 1;
    const isOriginalZH = post?.originalLanguage === 2;
    const authorAvatar =
      post?.authorAvatar && post.authorAvatar != "false"
        ? post.authorAvatar
        : "";
    const AuthorAvatar = ({ className }: { className?: string }) => {
      return authorAvatar ? (
        <Avatar
          className={`w-12 h-12 ${className}`}
          src={
            authorAvatar && authorAvatar != "false"
              ? authorAvatar
              : "/img/none.jpeg"
          }
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "/img/none.jpeg";
          }}
        />
      ) : null;
    };

    const SourcePlatImg = () => {
      return post?.sourcePlatId ? (
        <Image
          alt=""
          className="p-0 m-0"
          src={sourceImgMap[post.sourcePlatId]}
          width={12}
          height={12}
        />
      ) : null;
    };
    const translateTip = createTranslateTip(
      isGenerateWay,
      isAiGeneration,
      isTranslated,
      router.locale as string
    );
    const TranslateTip = ({ className }: { className?: string }) => {
      return translateTip ? (
        <div
          className={`py-4 flex items-center text-xs text-[#ADADAD] ${className}`}
        >
          <GPTIcon />
          <span>{translateTip}</span>
        </div>
      ) : null;
    };
    const transferTitle = post?.[postKeyMap[locale].title];
    const transferContent = post?.[postKeyMap[locale].content];
    const transferOriginalContent = post?.[postKeyMap[locale].originalContent];
    const transferSeoTitle = post?.[postKeyMap[locale].seoTitle];
    const transferSeoMeta = post?.[postKeyMap[locale].seoMeta];
    // 无需判断
    // const isTranslate =
    //   isTranslated && ((isOriginalEN && !isEN) || (isOriginalZH && !isZH));
    // 不需要翻译判断 直接读取title 然后读取transferTxx
    const title = post?.title || transferTitle;
    const content = replaceImgCros(post?.content || transferContent || "");

    const originalContent = post?.originalContent || transferOriginalContent;
    const seoTitle = post?.seoTitle || transferSeoTitle;
    const seoMeta = post?.seoMeta || transferSeoMeta;
    const time = new Date().getTime();
    const finalContent = replaceImgCros(
      ((isAuth ? originalContent : content) || "").replace(/[\n]/g, "<br/>")
    );
    const FinalContent = ({ className }: { className?: string }) => {
      return (
        <div
          className={`!font-inter post-detail text-primary-900-White text-sm break-all ${className}`}
          dangerouslySetInnerHTML={{
            __html: finalContent.startsWith("<p>")
              ? finalContent
              : `<p>${finalContent}</p>`,
          }}
        ></div>
      );
    };
    const releaseTime = post?.realiseTime ? dayjs(+post.realiseTime) : null;
    const releaseTimeFormated = releaseTime?.format("MMM D,YYYY");
    const timeAgoFormated = post?.realiseTime
      ? formatDate(post.realiseTime)
      : "";
    const sourceLink = post?.sourceLink || "";
    const sector = post?.sector;

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
    const matchedCurrencies = post?.matchedCurrencies || [];
    const MatchedCurrency = ({ className,onItemClick}: { className?: string,onItemClick?:(e:React.MouseEvent<HTMLElement>,data:any)=>void }) => {
      return (
        <>
          {matchedCurrencies.slice(0, 3).map((item, index) => (
            <Link
              onClick={(e) =>{e.stopPropagation();onItemClick?.(e,item)}}
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
      isNews,
      isResearch,
      isInsight,
      isInsititution,
      isAuth,
      title,
      content,
      originalContent,
      seoTitle,
      seoMeta,
      finalContent,
      FinalContent,
      isAiGeneration,
      isTranslated,
      isOriginalEN,
      isOriginalZH,
      isTwitter,
      translateTip,
      TranslateTip,
      sector,
      Sector,
      matchedCurrencies,
      MatchedCurrency,
      releaseTime,
      releaseTimeFormated,
      timeAgoFormated,
      sourceLink,
      authorAvatar,
      AuthorAvatar,
      SourcePlatImg,
    };
  };
  const post = useMemo(
    () => createPost(option?.post),
    [option?.post, router.locale]
  );

  return {
    post,
    createPost,
  };
};
