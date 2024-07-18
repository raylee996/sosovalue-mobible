import { Button, Grow, ListItemButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import React, { useContext, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { copyText, isBrowser } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { useTranslation } from "next-i18next";
import ScaleLoader from "components/base/ScaleLoader";
import dayjs from "dayjs";
import useTelegramStore from "store/useTelegramStore";
import { uploadFile } from "helper/request";
import { telegramHelper } from "helper/telegram";
import { getTelegramShareUrl } from "helper/config";
import ShareIcon from "components/icons/Share.svg";
import LinkIcon from "components/icons/link.svg";
import TwitterIcon from "components/icons/tw-band.svg";
import TelegramIcon from "components/icons/tg-band.svg";
import LogoFull from "components/icons/logo/logo-full.svg";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/router";
import { UserContext } from "store/UserStore";
import { INVITE_CODE_KEY } from "helper/constants";
import { useHotPost } from "./useHotPost";
import HotPostMain from "components/operation/research/HotPostMain";
import Regex from "helper/regex";
import {ShareVia} from "helper/track";
type Props = {
  post?: Research.ClusterNews;
  onShareBtnClick?:(type:ShareVia,data:Research.ClusterNews)=>void
};

export const useShareHotPost = ({ post,onShareBtnClick}: Props) => {
  const { user } = useContext(UserContext);
  const { telegramBotInfo, isTelegram } = useTelegramStore();
  const router = useRouter();
  const { success } = useNotistack();
  const { t } = useTranslation("research");
  const { t: tCommon } = useTranslation("common");
  const [currentPost, setCurrentPost] = useState(post);
  const {
    post: { title, content, matchedCurrencies },
  } = useHotPost({ post: currentPost });
  const container = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [dataURL, setDataURL] = useState("");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isUploadingRef = useRef(false);
  const shareLink =
    isBrowser && currentPost
      ? `${window.location.origin}${
          router.locale === "en" ? "" : "/" + router.locale
        }/cluster/${currentPost.id}${
          user ? `?${INVITE_CODE_KEY}=${user.invitationCode}` : ""
        }`
      : "";
  const baseShareText = title || content.slice(0, 200);
  const mediaShareText = (encode = false) =>
    `${baseShareText}${
      encode ? "%0A%0A" : "\n\n"
    }${`Explore more key information on ${encode ? "%23" : "#"}SoSoValue:`}`;
  const hashtagsForTwitter = matchedCurrencies
    ?.map((item: any) => item?.name.toUpperCase())
    .join(",");
  const telegramDirectLink = `https://t.me${
    telegramBotInfo?.appName
  }?startapp=${telegramHelper.generateTgLink({ searchKey: 1, value: currentPost?.id, locale: router.locale, invitationCode: user?.invitationCode})}`;
  const telegramShareLink = getTelegramShareUrl(
    telegramDirectLink,
    baseShareText
  );
  const twitterShareLink = `https://twitter.com/intent/tweet?text=${mediaShareText(
    true
  )}&hashtags=${hashtagsForTwitter}&url=${shareLink}`;
  const telegramDirectShareText = `${mediaShareText()}${telegramDirectLink}`;
  const withoutLinkshareText = `${baseShareText}\n${
    router.locale === "en"
      ? "Explore more key information on SoSoValue"
      : router.locale === "ja"
      ? "SoSoValueの詳細情報を見る"
      : "查看原文"
  }`;
  const shareText = isTelegram
    ? telegramDirectShareText
    : `${withoutLinkshareText}:\n${shareLink}`;
  const copyShareLink = () => {
    currentPost&&onShareBtnClick?.("CopyLink",currentPost);
    copyText(shareText.replace(Regex.htmlTags, "") || "");
    success(t("copy success"));
    closeShareModal();
  };
  const savePoster = () => {
    if (isUploadingRef.current || !canvasRef.current) return;
    currentPost&&onShareBtnClick?.("Poster",currentPost);
    return canvasRef.current.toBlob(async (blob) => {
      if (isTelegram) {
        isUploadingRef.current = true;
        const formData = new FormData();
        const file = new File(
          [blob!],
          `sosovalue_${dayjs().format("YYYY_MM_DD_HH:mm:ss")}.png`,
          { type: "image/png" }
        );
        formData.append("file", file);
        const res = await uploadFile(formData);
        const imageURL = res?.data?.data?.url;
        if (imageURL) {
          telegramHelper.openTelegramLink(getTelegramShareUrl(imageURL));
        }
        isUploadingRef.current = false;
        closeShareModal();
        return;
      }

      const file = new File(
        [blob!],
        `sosovalue_${dayjs().format("YYYY_MM_DD_HH:mm:ss")}.png`,
        { type: "image/png" }
      );
      window.navigator.share({
        // title: document.title,
        // text: window.location.href,
        // url: window.location.href,
        files: [file],
      });
      closeShareModal();
    }, "image/png");
  };
  const openShareModal = (post?: Research.ClusterNews) => {
    if (post) {
      setCurrentPost(post);
    }
    setOpen(true);
  };
  const closeShareModal = () => setOpen(false);
  useEffect(() => {
    open && setLoading(true);
  }, [open]);
  useEffect(() => {
    post && setCurrentPost(post);
  }, [post]);
  const shareNode = (
    <>
      <div className="w-[522px] break-words fixed right-[10000px] bottom-[10000px]">
        <div ref={container}>
          <div className="relative pt-8 bg-hover-50-800">
            <div className="absolute top-0 left-0 w-full h-[400px] text-[0px] overflow-hidden">
              <img
                className="w-full h-auto"
                src="/img/feeds/share-bg.png"
                alt=""
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <LogoFull />
              <div className="text-base font-semibold text-primary-900-White mt-3">
                Your One-Stop Crypto Investment{" "}
                <span className="text-accent-600-600">Powerhouse</span>
              </div>
              <div className="mt-8 mx-4 p-6 bg-background-primary-White-900 rounded-xl border border-solid border-primary-100-700 shadow-[0px_1px_2px_0px_rgba(10,10,10,0.06)]">
                <HotPostMain post={currentPost} />
                <div className="mt-4">
                  <div className="py-4 border-0 border-t border-solid border-primary-100-700">
                    <div className="text-sm text-primary-900-White font-bold text-[15px] text-medium">
                      {tCommon("Scan QR Code to Explore more key information")}
                    </div>
                    <div className="text-sm text-secondary-500-300">
                      {tCommon(
                        "One-stop financial research platform for Crypto Investors"
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 bg-white rounded-md border border-solid border-white flex items-center justify-center">
                      <QRCodeCanvas
                        value={shareLink}
                        size={96}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen
        open={open}
        onClose={closeShareModal}
        TransitionComponent={Grow}
        TransitionProps={{
          unmountOnExit: true,
          onTransitionEnd() {
            if (open) {
              html2canvas(container.current!, { useCORS: true }).then(
                (canvas) => {
                  const dataURL = canvas.toDataURL("image/webp");
                  setDataURL(dataURL);
                  canvasRef.current = canvas;
                  setLoading(false);
                }
              );
            }
          },
        }}
        classes={{
          paper:
            "bg-none bg-hover-50-800 relative h-full overflow-y-scroll select-none",
        }}
      >
        <div className="rounded-xl pb-[260px] overflow-y-scroll">
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <ScaleLoader />
            </div>
          ) : (
            <div>
              {/* <div
                className=" text-white flex items-center justify-center"
                ref={longPressDiv}
              >
                <HandTap size={33} className="rotate-180" />
                <span className="text-xs">Long press to save</span>
              </div> */}
              <img src={dataURL} className="w-full z-50" />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 z-20 w-full shadow-[0px_-1px_4px_0px_rgba(10,10,10,0.12),0px_-1px_2px_0px_rgba(10,10,10,0.07)] border border-solid border-primary-100-700 bg-background-secondary-White-700 flex flex-col items-center pb-11 pt-2 rounded-t-2xl">
          <span className="text-base font-bold text-primary-900-White my-4">
            {tCommon("Share")}
          </span>
          <div className="flex items-center gap-x-1">
            <ListItemButton
              component="a"
              href={twitterShareLink}
              className="flex-col flex-1"
              onClick={()=>{closeShareModal();currentPost&&onShareBtnClick?.("Twitter",currentPost)}}
            >
              <span className="share-band-icon">
                <TwitterIcon />
              </span>
              <span className="text-sm text-primary-900-White font-semibold">
                {t("Twitter")}
              </span>
            </ListItemButton>
            <ListItemButton
              component="a"
              href={telegramShareLink}
              className="flex-col flex-1"
              onClick={()=>{closeShareModal();currentPost&&onShareBtnClick?.("Telegram",currentPost)}}
            >
              <span className="share-band-icon">
                <TelegramIcon />
              </span>
              <span className="text-sm text-primary-900-White font-semibold">
                {tCommon("Telegram")}
              </span>
            </ListItemButton>
            <ListItemButton className="flex-col flex-1" onClick={savePoster}>
              <span className="share-band-icon">
                <ShareIcon className=" scale-125" />
              </span>
              <span className="text-sm text-primary-900-White font-semibold whitespace-nowrap">
                {tCommon("Share Poster")}
              </span>
            </ListItemButton>
            <ListItemButton className="flex-col flex-1" onClick={copyShareLink}>
              <span className="share-band-icon">
                <LinkIcon />
              </span>
              <span className="text-sm text-primary-900-White font-semibold whitespace-nowrap">
                {tCommon("Copy link")}
              </span>
            </ListItemButton>
          </div>
          <Button
            onClick={closeShareModal}
            fullWidth
            className="normal-case text-sm text-primary-900-White mt-4"
          >
            {tCommon("Cancel")}
          </Button>
        </div>
      </Dialog>
    </>
  );
  return {
    shareNode,
    openShareModal,
    closeShareModal,
    copyShareLink,
  };
};
