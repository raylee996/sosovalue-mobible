import React, { useContext, useEffect, useState } from "react";
import Trending from "components/operation/news/Trending";
import { getArticleDetail, getArticleDetailBySlug } from "http/home";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { copyText, formatDate, isBrowser, transferMoney } from "helper/tools";
import { Avatar, Button, IconButton } from "@mui/material";
import useNotistack from "hooks/useNotistack";
import { ThemeContext } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { INVITE_CODE_KEY, categoryConfig } from "helper/constants";
import ShareDialog from "components/operation/ShareDialog";
import { QRCodeCanvas } from "qrcode.react";
import { House } from "@phosphor-icons/react";
import { UserContext } from "store/UserStore";
import { usePost } from "hooks/operation/usePost";
import { useNetwork } from "hooks/useNetwork";
import Loading from "components/operation/OptLoading";
import Head from "next/head";

const Detail = () => {
  const router = useRouter();
  const { success } = useNotistack();
  const [article, setArticle] = React.useState<Research.Post>();
  const { post } = usePost({ post: article });
  const {
    title,
    seoTitle,
    seoMeta,
    finalContent,
    FinalContent,
    Sector,
    MatchedCurrency,
    TranslateTip,
    releaseTimeFormated,
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
  const getArticle = async () => {
    const id = router.query.id as string;
    let res = { data: {} };
    if (!isNaN(+id)) {
      res = await getArticleDetail(id);
    } else {
      res = await getArticleDetailBySlug(id);
    }
    setArticle((res as any).data);
    setLoad(false);
  };
  const { user } = useContext(UserContext);
  const { t } = useTranslation("research");
  const { t: tCommon } = useTranslation("common");

  const networkState = useNetwork();
  const [load, setLoad] = useState(true);
  const [loadType, setLoadType] = useState(0);
  // const goToTrade = async (id: string) => {
  //   const { data } = await findDefaultSymbolByCurrencyIds([id]);
  //   router.push(
  //     `/trade/${data[0].baseAsset}-${
  //       data[0].quoteAsset
  //     }-${data[0].exchangeName.toUpperCase()}`
  //   );
  // };
  const copyLink = () => {
    copyText(`${window.location.origin}/news/${article?.id}`);
    success(t("copy success"));
  };
  const back = () => {
    router.replace("/");
  };

  useEffect(() => {
    if (!networkState.online) {
      setLoad(true);
      setLoadType(3);
    }
  }, [networkState]);

  React.useEffect(() => {
    router.query.id && getArticle();
  }, [router.query.id]);
  const renderTwitter = () => {
    return (
      <div>
        <div className="flex items-center h-20 border-0">
          <Avatar className="w-12 h-12" src={article?.authorAvatar} />
          <div className="ml-3">
            <div className="flex items-center">
              <span className="text-title text-base font-bold mr-2">
                {article?.author}
              </span>
              <Image
                src="/img/svg/twitter_icon.svg"
                width={12}
                height={12}
                alt=""
              />
            </div>
            <span className="text-xs text-content">{article?.platName} </span>
          </div>
        </div>
        <div className="h-[1px] bg-[#333333] -mx-4"></div>
        <TranslateTip />
        <FinalContent className="mt-4 text-[#d6d6d6]" />
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center">
            <Sector />
            <MatchedCurrency />
          </div>
          <span className="text-content text-xs">
            {article && formatDate(article.realiseTime)}
          </span>
        </div>
        <div className="text-center my-8">
          {sourceLink && (
            <Link href={sourceLink} target="_blank">
              <Button
                className="normal-case text-sm font-bold text-primary h-[34px]"
                variant="outlined"
              >
                {t("Read on")} Twitter
              </Button>
            </Link>
          )}
        </div>
        <div className="h-[1px] bg-[#333333] -mx-4"></div>
      </div>
    );
  };
  const shareLink =
    isBrowser && article
      ? `${window.location.origin}${
          router.locale === "en" ? "" : "/" + router.locale
        }/news/${article.id}${
          user ? `?${INVITE_CODE_KEY}=${user.invitationCode}` : ""
        }`
      : "";
  const shareText = `${title || finalContent.slice(0, 200)}\n${
    router.locale === "en"
      ? "Explore more key information on SoSoValue"
      : router.locale === "ja"
      ? "SoSoValueの詳細情報を見る"
      : "查看原文"
  }:\n${shareLink}`;
  const [shareOpen, setShareOpen] = useState(false);
  const shareDialogNode = (
    <ShareDialog
      open={shareOpen}
      onClose={() => setShareOpen(false)}
      shareText={shareText}
    >
      <div className="pt-36 bg-black relative px-6 pb-10">
        <img
          src="/img/share-post-bg.png"
          className="w-full h-auto absolute left-0 top-0"
        />
        <div className="bg-[#0A0A0A] p-6 border border-solid border-[#474747] rounded-lg relative z-10">
          {isResearch ? (
            <div>
              <div className="text-white text-2xl font-medium">{title}</div>
              <div className="my-4">
                <span className="text-[#ADADAD] text-xs mr-6">
                  {raw?.author}
                </span>
                <span className="text-[#ADADAD] text-xs">
                  {releaseTimeFormated}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AuthorAvatar />
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white">
                    {article?.author}
                  </span>
                  <span className="text-xs text-[#ADADAD] mt-1">
                    {article?.sourceDescription}
                  </span>
                </div>
              </div>
              <span className="text-[#ADADAD] text-xs">
                {releaseTimeFormated}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Sector />
              <MatchedCurrency />
            </div>
            <img src="/img/watermark.png" className="w-[100px] h-auto" />
          </div>
          <div className="border-0 border-y border-solid border-[#333333] py-6 my-6 text-base text-[#D6D6D6]">
            <TranslateTip />
            <FinalContent className="text-[#d6d6d6]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-between">
              <div className="text-[#D6D6D6] text-[15px] text-medium">
                {tCommon("Scan QR Code to Explore more key information")}
              </div>
              <div className="text-[#ADADAD] text-xs">
                {tCommon(
                  "One-stop financial research platform for Crypto Investors"
                )}
              </div>
            </div>
            <div className="p-1 bg-white flex items-center ml-4 rounded-md">
              {article && (
                <QRCodeCanvas
                  value={shareLink}
                  size={72}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                  imageSettings={{
                    src: "/img/192x192.png",
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ShareDialog>
  );
  useEffect(() => {
    if (article?.authorAvatar) {
      fetch(article.authorAvatar, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
    }
  }, [article]);
  return (
    <div className="h-full bg-block-color w-full overflow-hidden flex flex-col items-stretch">
      {shareDialogNode}
      {load && <Loading type={loadType} />}
      <div className="relative h-12 flex items-center justify-center">
        <IconButton
          onClick={back}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-sub-title normal-case bg-[#242424]"
        >
          <House size={24} />
        </IconButton>
        <Link href="/">
          <Image src="/img/full-logo.png" width={190} height={32} alt="" />
        </Link>
        <IconButton
          onClick={() => setShareOpen(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-sub-title normal-case bg-[#242424]"
        >
          <Image
            src="/img/svg/ShareNetwork.svg"
            width={24}
            height={24}
            alt=""
          />
        </IconButton>
      </div>
      <div className="px-4 pt-4 flex-1 h-0 overflow-y-auto overflow-x-hidden">
        {isTwitter ? (
          renderTwitter()
        ) : (
          <div>
            <div className="mx-auto max-w-[1032px] text-title text-[22px] mb-4 font-medium">
              {title}
            </div>
            <div className="flex">
              <div className="mr-6 py-0.5 text-xs text-[#8F8F8F] whitespace-nowrap max-w-[120px] inline-block truncate">
                {article?.platName ? article?.platName : article?.source}
              </div>
              <div className="text-xs text-[#8F8F8F] py-0.5 mr-6 whitespace-nowrap">
                {article?.contentNum ? transferMoney(+article?.contentNum) : 0}{" "}
                {t("Words")}
              </div>
              <div className="text-xs text-[#8F8F8F] py-0.5 whitespace-nowrap">
                {releaseTimeFormated}
              </div>
            </div>
            <div className="flex items-center my-4">
              {/* {article?.isAuth == 1 && (
                <div className="mr-2 rounded-3xl text-xs cursor-pointer font-bold px-2 py-0.5 text-[#FF2700] bg-[#FF4500]/[.2] ">
                  <Image
                    src="/img/svg/logo.svg"
                    className="align-top mr-1"
                    alt=""
                    width={16}
                    height={16}
                  />
                  {t("SoSo Report")}
                </div>
              )} */}
              <Sector className="mr-2" />
              <MatchedCurrency />
            </div>
            <div
              className="text-title text-sm border-0 border-t border-b pb-8 border-solid border-[#242424]"
              id="news-detail"
            >
              {!isAuth && (
                <div>
                  <div className=" relative overflow-hidden">
                    <TranslateTip />
                    <FinalContent className="h-full  text-ellipsis mb-7 pr-2" />
                  </div>
                  {sourceLink && (
                    <Link
                      href={sourceLink}
                      target="_blank"
                      className="no-underline inline-block relative left-1/2 -translate-x-1/2 mt-2"
                    >
                      <div className="inline-block px-2 h-[34px] leading-[34px] text-sm text-[#FF4F20] text-center border border-solid border-[##FF4F20] rounded">
                        {t("Read on")} {raw?.author}
                      </div>
                    </Link>
                  )}
                </div>
              )}
              {article && (
                <>
                  {isAuth && (
                    <>
                      <TranslateTip />
                      <FinalContent className="pr-2" />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <div className="p-4">
          <Trending />
        </div>
      </div>
    </div>
  );
};

export default Detail;

// export async function getStaticProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["common", "home", "research"])),
//       // Will be passed to the page component as props
//     },
//   };
// }
// export const getStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking", // false or "blocking"
//   };
// };
