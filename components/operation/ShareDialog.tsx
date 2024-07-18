import {
  Button,
  Grow,
  ListItemButton,
  type ListItemButtonProps,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LinkSimple, DownloadSimple } from "@phosphor-icons/react";
import html2canvas from "html2canvas";
import { copyText } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { useTranslation } from "next-i18next";
import { Images } from "@phosphor-icons/react";
import ScaleLoader from "components/base/ScaleLoader";
import dayjs from "dayjs";
import { cn } from "helper/cn";
import useTelegramStore from "store/useTelegramStore";
import { uploadFile } from "helper/request";
import { telegramHelper } from "helper/telegram";
import { getTelegramShareUrl } from "helper/config";
import DownloadIcon from "components/icons/download.svg";
import LinkIcon from "components/icons/link.svg";
import TwitterIcon from "components/icons/tw-band.svg";
import TelegramIcon from "components/icons/tg-band.svg";
import Regex from "helper/regex";
import { trackNewsDetailShare } from "helper/track";

export type ShareDialogProps = PropsWithChildren<{
  className?: string;
  shareText?: string;
  twitterShareLink?: string;
  telegramShareLink?: string;
  /** 自定义配置额外的分享按钮 */
  externalShareButtons?: Array<{
    name: string;
    icon: React.ReactNode;
    shareLink?: string;
    shareText?: string;

    onClick?: ListItemButtonProps["onClick"];
  }>;
  open: boolean;
  onClose: () => void;
}>;

const ShareDialog = ({
  open,
  onClose,
  children,
  shareText,
  twitterShareLink,
  telegramShareLink,
  className,
}: ShareDialogProps) => {
  const { success } = useNotistack();
  const { t } = useTranslation("research");
  const { t: tCommon } = useTranslation("common");
  const container = useRef<HTMLDivElement | null>(null);
  const [dataURL, setDataURL] = useState("");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isTelegram } = useTelegramStore();
  const isUploadingRef = useRef(false);
  const copyShareLink = () => {
    copyText(shareText?.replace(Regex.htmlTags, "") || "");
    success(t("copy success"));
    closeShareDialog();
    trackNewsDetailShare("","CopyLink");
  };
  const closeShareDialog = () => {
    onClose();
  };
  const savePoster = () => {
    if (isUploadingRef.current || !canvasRef.current) return;
    trackNewsDetailShare("","Poster");
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
        closeShareDialog();
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
      closeShareDialog();
    }, "image/png");
  };
  useEffect(() => {
    open && setLoading(true);
  }, [open]);
  return (
    <>
      <div
        className={cn(
          "w-[522px] break-words fixed right-[10000px] bottom-[10000px]",
          className
        )}
      >
        <div ref={container}>{children}</div>
      </div>
      <Dialog
        fullScreen
        open={open}
        onClose={closeShareDialog}
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
            "bg-none bg-hover-50-800 text-primary-900-White relative h-full overflow-y-scroll select-none",
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
              onClick={()=>{trackNewsDetailShare("","Twitter");closeShareDialog()}}
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
              onClick={()=>{trackNewsDetailShare("","Telegram");closeShareDialog()}}
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
                <DownloadIcon className=" scale-125" />
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
            onClick={closeShareDialog}
            fullWidth
            className="normal-case text-sm text-primary-900-White mt-4"
          >
            {tCommon("Cancel")}
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default ShareDialog;
