import React, { useContext, useState } from "react";
import Trending from "components/operation/news/Trending";
import {
  getHotArticleDetail,
  getNewArticleList,
  findDefaultSymbolByCurrencyIds,
} from "http/home";
import { useRouter } from "next/router";
import ArrowIcon from "components/svg/Arrow";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { copyText, formatDate, isBrowser, transferMoney } from "helper/tools";
import {
  Avatar,
  Button,
  IconButton,
  Dialog,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import useNotistack from "hooks/useNotistack";
import { ThemeContext } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { TransitionProps } from "@mui/material/transitions";
import useLoading from "hooks/useLoading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShareDialog from "../ShareDialog";
import { QRCodeCanvas } from "qrcode.react";
import { INVITE_CODE_KEY } from "helper/constants";
import { UserContext } from "store/UserStore";
import { createCurrencyDetailLink } from "helper/link";
import useTelegramStore from "store/useTelegramStore";
import { getTelegramShareUrl } from "helper/config";

const sourceImg: any = {
  173: "/img/svg/twitter_icon.svg",
  174: "/img/svg/substack_icon.svg",
  175: "/img/svg/mirror_icon.svg",
  176: "/img/svg/medium_icon.svg",
  177: "/img/svg/cryptoMedia_icon.svg",
};
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

type Props = {
  selectedPost?: Research.Post;
  selectPost: (post: Research.Post) => void;
  open: boolean;
  onClose: () => void;
};

const ResearchDialog = ({ onClose, open, selectedPost, selectPost }: Props) => {
  const { success } = useNotistack();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [article, setArticle] = React.useState<any>();
  const [news, setNews] = React.useState<any>();
  const isTwitter = article?.sourcePlatId === "173";
  const getArticle = async () => {
    if (selectedPost) {
      Loading.start();
      const res = await getHotArticleDetail(selectedPost.id);
      setArticle(res.data);
      let newsList: any[] = [];
      JSON.parse(res.data.entityList) &&
        JSON.parse(res.data.entityList).forEach(async (item: any) => {
          let res = await getNewArticleList({
            pageNum: 1,
            pageSize: 3,
            categoryList: ["3", "4"],
            userType: 1,
            search: item,
          });
          if (res.data.list) {
            newsList = [
              ...newsList,
              {
                name: item,
                list: res.data.list.slice(0, 3),
              },
            ];
            setNews(newsList);
          }
        });
      Loading.close();
    }
  };
  const { selectContent } = useContext(ThemeContext);
  const { t } = useTranslation("research");
  const { t: tCommon } = useTranslation("common");
  const Loading = useLoading();
  const { telegramBotInfo, isTelegram } = useTelegramStore();
  const goToTrade = async (id: string) => {
    const { data } = await findDefaultSymbolByCurrencyIds([id]);
    router.push(
      `/trade/${data[0].baseAsset}-${
        data[0].quoteAsset
      }-${data[0].exchangeName.toUpperCase()}`
    );
  };
  const copyLink = () => {
    copyText(`${window.location.origin}/news/${article?.id}`);
    success(t("copy success"));
  };
  const close = () => {
    onClose();
    setArticle(undefined);
  };
  React.useEffect(() => {
    getArticle();
  }, [selectedPost]);
  const escapeNode = article && (
    <>
      <div className="my-4 flex items-center text-xs text-[#ADADAD]">
        {t("Powered scene 11") && (
          <Image
            src="/img/svg/logo.svg"
            className="m-0 mr-2"
            alt=""
            width={16}
            height={16}
          />
        )}
        {t("Powered scene 11")}
      </div>
    </>
  );
  const sector = article?.sector &&
    article.sector != "Others" &&
    article.sector != "null" && (
      <div className="mr-2 rounded-3xl text-xs cursor-pointer font-bold px-1 py-0.5 text-[#C2C2C2] bg-[#343434]/[.8] whitespace-nowrap">
        #{article?.sector}
      </div>
    );
  const matchedCurrenciesData =
    article?.matchedCurrencies && JSON.parse(article.matchedCurrencies);
  const matchedCurrencies = matchedCurrenciesData
    ?.slice(0, 3)
    .map((item: any, index: number) => (
      <Link
        href={createCurrencyDetailLink({ fullName: item.fullName })}
        onClick={(e) => e.stopPropagation()}
        className="mr-2 rounded-3xl text-xs px-2 py-0 h-5 flex items-center cursor-pointer text-[#C2C2C2] border border-solid border-[#404040] no-underline"
        key={index}
      >
        {item.name.toUpperCase()}
      </Link>
    ));
  const [shareOpen, setShareOpen] = useState(false);
  const shareLink =
    isBrowser && article
      ? `${window.location.origin}${
          router.locale === "en" ? "" : "/" + router.locale
        }/cluster/${article.id}${
          user ? `?${INVITE_CODE_KEY}=${user.invitationCode}` : ""
        }`
      : "";
  const baseShareText =
    selectContent(article, "title", "hot") ||
    selectContent(article, "content", "hot").slice(0, 200);
  const telegramShareLink = `https://t.me${
    telegramBotInfo?.appName
  }?startapp=1-${article?.id}-${user?.invitationCode || ""}`;

  const shareText = `${baseShareText}\n${
    router.locale === "en"
      ? "Explore more key information on SoSoValue"
      : router.locale === "ja"
      ? "SoSoValueの詳細情報を見る"
      : "查看原文"
  }:\n${isTelegram ? telegramShareLink : shareLink}`;

  const mediaShareText = (encode = false) =>
    `${baseShareText}${
      encode ? "%0A%0A" : "\n\n"
    }${`Explore more key information on ${encode ? "%23" : "#"}SoSoValue:`}`;
  const hashtagsForTwitter = matchedCurrenciesData
    ?.map((item: any) => item?.name.toUpperCase())
    .join(",");
  const telegramDirectLink = `https://t.me${
    telegramBotInfo?.appName
  }?startapp=1-${article?.id}-${user?.invitationCode || ""}`;
  const telegramArticleLink = getTelegramShareUrl(
    telegramDirectLink,
    baseShareText
  );
  const telegramDirectShareText = `${mediaShareText()}${telegramDirectLink}`;

  const shareDialogNode = (
    <ShareDialog
      open={shareOpen}
      onClose={() => setShareOpen(false)}
      shareText={isTelegram ? telegramDirectShareText : shareText}
      externalShareButtons={[
        {
          name: t("Twitter"),
          shareText: shareText,
          shareLink: `https://twitter.com/intent/tweet?text=${mediaShareText(
            true
          )}&hashtags=${hashtagsForTwitter}&url=${shareLink}`,
          icon: (
            <Image
              src="/img/svg/twitter-new.svg"
              width={24}
              height={24}
              alt=""
            />
          ),
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
    >
      <div className="pt-36 bg-black relative px-6 pb-10">
        <img
          src="/img/share-post-bg.png"
          className="w-full h-auto absolute left-0 top-0"
        />
        <div className="bg-[#0A0A0A] p-6 border border-solid border-[#474747] rounded-lg relative z-10">
          <div>
            <div className="text-white text-2xl font-medium">
              {selectContent(article, "title", "hot")}
            </div>
            <div className="my-4">
              {article?.author && (
                <span className="text-[#ADADAD] text-xs mr-6">
                  {article.author}
                </span>
              )}
              <span className="text-[#ADADAD] text-xs">
                {dayjs(+article?.createTime).format("MMM DD,YYYY")}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                {sector}
                {matchedCurrencies}
              </div>
              <img src="/img/watermark.png" className="w-[100px] h-auto" />
            </div>
          </div>
          <div className="border-0 border-y border-solid border-[#333333] py-6 my-6 text-base text-[#D6D6D6]">
            <div className="text-[#ADADAD] text-xs mb-6 flex items-center">
              <img src="/img/gpt.png" className="w-4 h-4" alt="" />
              <span className="ml-2">{tCommon("Translated by ChatGPT")}</span>
            </div>
            <div
              className=" text-sm text-[#D6D6D6] font-['Inter'] post-detail"
              dangerouslySetInnerHTML={{
                __html: selectContent(article, "content", "hot"),
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
  return (
    <Dialog
      open={open}
      onClose={close}
      TransitionComponent={Transition}
      fullScreen
    >
      <Loading.Component className="bg-[#0A0A0A]">
        <div className="h-full bg-[#0A0A0A] w-full overflow-hidden flex flex-col items-stretch">
          {shareDialogNode}
          <div className="relative h-12 flex items-center justify-center">
            <IconButton
              onClick={close}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-sub-title normal-case"
            >
              <Image src="/img/svg/Close.svg" width={24} height={24} alt="" />
            </IconButton>
            <Link href="/">
              <Image src="/img/full-logo.png" width={190} height={32} alt="" />
            </Link>
            <IconButton
              onClick={() => setShareOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-sub-title normal-case"
            >
              <Image
                src="/img/svg/ShareNetwork.svg"
                width={24}
                height={24}
                alt=""
              />
            </IconButton>
          </div>
          <div className="pt-4 flex-1 h-0 overflow-y-auto overflow-x-hidden">
            <div className="px-4">
              <div className="mx-auto max-w-[1032px] text-title text-[22px] mb-4 font-medium">
                {selectContent(article, "title", "hot")}
              </div>
              {escapeNode}
              <div className="flex">
                <div className="mr-6 py-0.5 text-xs text-[#8F8F8F] whitespace-nowrap max-w-[120px] inline-block truncate">
                  {article?.platName ? article?.platName : article?.source}
                </div>
                {/* <div className="text-xs text-[#8F8F8F] py-0.5 mr-6 whitespace-nowrap">
                  {article?.contentNum
                    ? transferMoney(+article?.contentNum)
                    : 0}{" "}
                  {t("Words")}
                </div> */}
                <div className="text-xs text-[#8F8F8F] py-0.5 whitespace-nowrap">
                  {article && dayjs(+article?.createTime).format("MMM D,YYYY")}
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-2 my-4">
                {sector}
                {matchedCurrencies}
              </div>
              <div
                className="text-title text-sm border-0 border-t border-b pt-4 pb-8 border-solid border-[#242424]"
                id="news-detail"
              >
                {article && (
                  <>
                    <div
                      className="pr-2 leading-normal text-sm text-[#D6D6D6] font-['Inter'] post-detail"
                      dangerouslySetInnerHTML={{
                        __html: article?.content
                          ? selectContent(article, "content", "hot")
                          : "",
                      }}
                    ></div>
                  </>
                )}
              </div>
            </div>
            <div className="p-4">
              <Accordion className="mb-3">
                <AccordionSummary
                  classes={{ content: "my-0 h-full" }}
                  className="bg-[#1A1A1A] h-12 min-h-[48px] px-0 my-0"
                  expandIcon={<ExpandMoreIcon className="text-white" />}
                >
                  <div className="flex items-center px-4 h-full justify-between border-0 border-l border-solid border-[#D6D6D6]">
                    <div className="text-xs text-[#FFF] font-bold">
                      {t("Source")}
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="bg-[#1A1A1A]">
                  <div className="mb-4 px-3">
                    {article?.informationDoVos?.map(
                      (item: any, index: number) => {
                        return (
                          <div
                            key={item.id}
                            className="text-sm text-[#ADADAD] leading-[24px] my-1"
                          >
                            {item.author}:
                            <Link href={`/news/${item.id}`}>
                              {selectContent(
                                article.informationDoVos[index],
                                "title"
                              )}
                            </Link>
                          </div>
                        );
                      }
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
              {news && (
                <div className="pb-[2s0px]">
                  <div className="text-base text-[#fff] font-bold mb-2">
                    {t("Related Insights")}
                  </div>
                  {news.map((item: any, index: number) => {
                    return (
                      <div key={item.name}>
                        {item?.list.length > 0 && (
                          <div className="flex items-center px-4 mb-3  h-[48px] bg-[#1A1A1A] justify-between border-0 border-l border-solid border-[#D6D6D6]">
                            <div className="text-xs text-[#FFF] font-bold">
                              #{item.name}
                            </div>
                            <Link
                              href={`/research?categoryList=Insights`}
                              target="_blank"
                            >
                              <Button
                                className="normal-case text-xs bg-transparent font-normal align-[2px] text-[#D6D6D6] p-0"
                                endIcon={
                                  <Image
                                    alt=""
                                    className="p-0 m-0"
                                    src="/img/svg/ArrowSquareOut.svg"
                                    width={12}
                                    height={12}
                                  />
                                }
                              >
                                {t("View More")}
                              </Button>
                            </Link>
                          </div>
                        )}

                        {item?.list &&
                          item?.list.map((items: any, index: number) => {
                            return (
                              <Link href={`/news/${items.id}`} key={index}>
                                <div
                                  className={`text-[#D6D6D6] border-0   border-solid border-[#F00] py-2 px-3 text-xs font-light`}
                                >
                                  <div className="text-[#FFF] text-sm">
                                    <div className="flex items-center font-bold mb-3">
                                      {
                                        <img
                                          onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = "/img/none.jpeg";
                                          }}
                                          src={`${
                                            items.authorAvatar &&
                                            items.authorAvatar != "false"
                                              ? items.authorAvatar
                                              : "/img/none.jpeg"
                                          }`}
                                          className="align-top mr-2 rounded-full"
                                          alt=""
                                          width={20}
                                          height={20}
                                        />
                                      }
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: items.author,
                                        }}
                                      ></div>
                                      {items.sourceDescription && (
                                        <span className="text-[#D6D6D6] text-xs ml-2 font-normal">
                                          {items.sourceDescription}
                                        </span>
                                      )}
                                      <span className="p-0.5 ml-2 w-4 h-4 flex items-center rounded-full">
                                        {items.sourcePlatId && (
                                          <Image
                                            alt=""
                                            className="p-0 m-0"
                                            src={sourceImg[items.sourcePlatId]}
                                            width={12}
                                            height={12}
                                          />
                                        )}
                                      </span>
                                    </div>
                                    {items.title && (
                                      <div
                                        className={`${
                                          items.weight >= 0.5
                                            ? "line-clamp-3"
                                            : "line-clamp-2"
                                        } overflow-hidden font-bold text-base leading-[24px]`}
                                        dangerouslySetInnerHTML={{
                                          __html: selectContent(items, "title"),
                                        }}
                                      >
                                        {/* {selectContent(posts?.list[index], "title")} */}
                                      </div>
                                    )}
                                    <div
                                      className={` text-sm text-[#D6D6D6] font-['Inter'] w-full select-text my-3 post-detail ${
                                        items.weight >= 0.5
                                          ? "line-clamp-4"
                                          : "line-clamp-2"
                                      } ${
                                        items.sourcePlatId !== "173"
                                          ? " leading-[24px] "
                                          : "line-clamp-[10] leading-[24px]"
                                      }`}
                                      dangerouslySetInnerHTML={{
                                        __html: selectContent(
                                          items,
                                          "content"
                                        )?.replace(/[\n]/g, "<br/>"),
                                      }}
                                    ></div>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <div className="flex">
                                      {items.sector &&
                                        items.sector != "Others" &&
                                        items.sector != "null" && (
                                          <div className="mr-3 rounded-3xl text-xs cursor-pointer flex items-center font-bold px-2 py-0.5 text-[#D6D6D6] bg-[#333333]">
                                            #{items.sector}
                                          </div>
                                        )}
                                      {items.matchedCurrencies &&
                                        items.matchedCurrencies
                                          .slice(0, 3)
                                          .map((i: any, index: number) => (
                                            <Link
                                              href={createCurrencyDetailLink({
                                                fullName: i.fullName,
                                              })}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              className="mr-2 rounded-3xl text-xs px-2 py-0 h-5 flex items-center cursor-pointer text-[#C2C2C2] border border-solid border-[#404040] no-underline"
                                              key={index}
                                            >
                                              {item.name.toUpperCase()}
                                            </Link>
                                          ))}
                                    </div>
                                    <div className="flex">
                                      <div className="text-xs text-[#ADADAD] py-0.5">
                                        {formatDate(items.realiseTime)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="h-px bg-[#3D3D3D] my-3"></div>
                              </Link>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4">
              <Trending onClose={onClose} />
            </div>
          </div>
        </div>
      </Loading.Component>
    </Dialog>
  );
};

export default ResearchDialog;
