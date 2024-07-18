import React, { useContext, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ShareDialog, { type ShareDialogProps } from "../ShareDialog";
import { useTranslation } from "next-i18next";
import { usePost } from "hooks/operation/usePost";
import { Avatar, ListItemButton } from "@mui/material";
import useLoading from "hooks/useLoading";
import { getArticleDetail } from "http/home";
import { useControlled } from "hooks/useController";
import { isBrowser } from "helper/tools";
import { useRouter } from "next/router";
import { UserContext } from "store/UserStore";
import { INVITE_CODE_KEY } from "helper/constants";
import Image from "next/image";
import { getTelegramShareUrl } from "helper/config";
import useTelegramStore from "store/useTelegramStore";
import TwitterLogo from "components/icons/Twitter.svg";
import { telegramHelper } from "helper/telegram";

type Props = {
  selectedPost: Research.Post | string | undefined;
  shareDialogProps: ShareDialogProps;
  /**
   * - 外部没有传入，则重新请求 article
   * - 如果不需要重新请求，初始值起码先应该是一个 null 而不是 undefined
   */
  article?: Research.Post | null;
};

const ShareDialogNode: React.FC<Props> = ({
  shareDialogProps,
  selectedPost,
  article: articleProp,
}) => {
  const { t } = useTranslation("research");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { post } = usePost({
    post: typeof selectedPost === "string" ? null : selectedPost,
  });
  // const Loading = useLoading();
  const [article, setArticle] = useControlled({
    default: undefined,
    controlled: articleProp,
  });
  const { telegramBotInfo, isTelegram } = useTelegramStore();
  const {
    title,
    finalContent,
    Sector,
    MatchedCurrency,
    TranslateTip,
    releaseTimeFormated,
    matchedCurrencies,
    isResearch,
    raw,
  } = post;
  const getArticle = async () => {
    if (selectedPost) {
      // Loading.start();
      const res = await getArticleDetail(
        typeof selectedPost === "string" ? selectedPost : selectedPost.id
      );
      setArticle(res.data);
      // Loading.close();
    }
  };
  const shareLink =
    isBrowser && article
      ? `${window.location.origin}${
          router.locale === "en" ? "" : "/" + router.locale
        }/news/${article.id}${
          user ? `?${INVITE_CODE_KEY}=${user.invitationCode}` : ""
        }`
      : "";
  const baseShareText = title || finalContent.slice(0, 200);
  const shareText = `${baseShareText}\n${
    router.locale === "en"
      ? "Explore more key information on SoSoValue"
      : router.locale === "ja"
      ? "SoSoValueの詳細情報を見る"
      : "查看原文"
  }`;
  useEffect(() => {
    if (articleProp) return;
    getArticle();
  }, [selectedPost, articleProp]);
  const mediaShareText = (encode = false) =>
    `${baseShareText}${
      encode ? "%0A%0A" : "\n\n"
    }${`Explore more key information on ${encode ? "%23" : "#"}SoSoValue:`}`;
  const hashtagsForTwitter = matchedCurrencies
    .map((item) => item.name.toUpperCase())
    .join(",");
  const telegramDirectLink = `https://t.me${
    telegramBotInfo?.appName
  }?${telegramHelper.generateTgLink({ searchKey: 0, value: article?.id, locale: router.locale, invitationCode: user?.invitationCode })}`;
  const telegramArticleLink = getTelegramShareUrl(
    telegramDirectLink,
    baseShareText
  );
  const telegramDirectShareText = `${mediaShareText()}${telegramDirectLink}`;

  return (
    <ShareDialog
      shareText={
        isTelegram ? telegramDirectShareText : `${shareText}:\n${shareLink}`
      }
      externalShareButtons={[
        {
          name: t("Twitter"),
          shareText: shareText,
          shareLink: `https://twitter.com/intent/tweet?text=${mediaShareText(
            true
          )}&hashtags=${hashtagsForTwitter}&url=${shareLink}`,
          icon: <TwitterLogo className="text-primary-900-White" />,
        },
        {
          name: tCommon("Telegram"),
          shareText: shareText,
          shareLink: telegramArticleLink,
          icon: (
            <Image
              src="/img/svg/telegram-logo.svg"
              width={24}
              height={24}
              alt=""
            />
          ),
        },
      ]}
      {...shareDialogProps}
    >
      <div className="pt-36 bg-black relative px-6 pb-10">
        <img
          src="/img/share-post-bg.png"
          className="w-full h-auto absolute left-0 top-0"
          alt=""
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
                <Avatar
                  className="w-12 h-12 mr-3"
                  src={article?.authorAvatar}
                />
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
              <Sector className="mr-2" />
              <MatchedCurrency />
            </div>
            <img src="/img/watermark.png" className="w-[100px] h-auto" alt="" />
          </div>
          <div className="border-0 border-y border-solid border-[#333333] py-6 my-6 text-base text-[#D6D6D6]">
            <div className="text-[#ADADAD] text-xs mb-6 flex items-center">
              <TranslateTip />
            </div>
            <div
              className="limit-img  text-sm text-[#D6D6D6] font-['Inter'] post-detail"
              dangerouslySetInnerHTML={{
                __html: finalContent,
              }}
            ></div>
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
};

export default ShareDialogNode;
