import NavigateWrap from "components/layout/NavigateWrap";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NewsItem from "components/operation/research/HotNewsItem";
import { FilterParams } from "components/operation/research/Filter";
import { isBrowser } from "helper/tools";
import { getHotNews } from "http/research";
import { useTranslation } from "next-i18next";
import { Language, ThemeContext, localeType } from "store/ThemeStore";
import { useRouter } from "next/router";
import HotNewsDialog from "components/operation/research/HotNewsDialog";
import { UserContext } from "store/UserStore";
import { copyText, objectSort } from "helper/tools";
import { Avatar, Button, IconButton, Dialog, Slide } from "@mui/material";
import ShareDialog from "components/operation/ShareDialog";
import { QRCodeCanvas } from "qrcode.react";
import dayjs from "dayjs";
import useTelegramStore from "store/useTelegramStore";
import { getTelegramShareUrl } from "helper/config";
import Logo from "components/icons/logo/logo-full.svg";
import ArrowLeftIcon from "components/icons/arrow-left.svg";
import ExportIcon from "components/icons/export.svg";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { telegramHelper } from "helper/telegram";
import useElementExport from "hooks/useElementExport";
import { trackFeedListClick, trackFeedsExpose, trackFeedTagClick, trackNewsEnd, trackNewsStart } from "helper/track";

export type CategoryConfig = {
  isResearch: boolean;
  isNews: boolean;
  isInsights: boolean;
  isInstitution: boolean;
  isSoSoReports: boolean;
};

const Research = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { selectContent } = useContext(ThemeContext);
  const [selectedPost, setSelectedPost] = useState<Research.ClusterNews>();
  const postDialogOpen = !!selectedPost;
  const closePostDialog = () => {
    selectedPost&&trackNewsEnd(selectedPost.id);
    setSelectedPost(undefined);
  };
  const { t } = useTranslation(localeType.RESEARCH);
  const { t: tCommon } = useTranslation("common");
  const { telegramBotInfo, isTelegram } = useTelegramStore();
  const { user } = useContext(UserContext);
  const [hotNews, setHotNews] = useState<any>();
  const {track,createExportData}=useElementExport(listRef,(list)=>{
    let ids=list.map(item=>{
      let arr=(item as string)?.split("-");
      let type=arr?.[2];
      return {id:arr?.[0],index:arr?.[1],type}
    });
    trackFeedsExpose("Hot",ids,"");
});
  const getHot = async () => {
    const { data } = await getHotNews({ pageNum: 0, pageSize: 10, status: 0 });
    let list: any = [];
    data?.list &&
      data?.list.forEach((item: any) => {
        let contentInformationSourceList = item.contentInformationSourceList;
        contentInformationSourceList.sort(objectSort("weight"));
        list.push({ ...item, contentInformationSourceList });
      });
    track();
    setHotNews(list);
  };
  useEffect(() => {
    getHot();
  }, []);
  const [shareOpen, setShareOpen] = useState(false);
  const pwaLink = isBrowser
    ? `${window.location.origin}/${router.locale}/hot`
    : "";
  const shareLink = isTelegram
    ? `https://t.me${telegramBotInfo?.appName}?startapp=${telegramHelper.generateTgLink({ searchKey: 2, locale: router.locale, invitationCode: user?.invitationCode})}`
    : pwaLink;
  const getLineBreak = (encode = false) =>
    encode ? encodeURIComponent("\n\n") : "\n\n";
  const baseShareText = (encode = false, limit = 10) => {
    const hotNewsLimit = hotNews?.slice(0, limit);
    const lineBreak = getLineBreak(encode);
    const listStr = hotNewsLimit
      ?.map(
        (item: any, index: number) =>
          `${index + 1}/ ${selectContent(item, "title", "hot")}`
      )
      .join(lineBreak);
    if (router.locale === "en") {
      return `🔥SoSoValue Daily Crypto Hot News｜${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak}`;
    } else if (router.locale === "zh") {
      return `🔥SoSoValue 每日Crypto热点新闻｜${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak}`;
    } else if (router.locale === "tc") {
      return `🔥SoSoValue 每日Crypto熱門新聞｜${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak}`;
    } else if (router.locale === "ja") {
      return `🔥 SoSoValue 毎日暗号通貨のホットニュース | ${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak}`;
    }
  };

  const telegramDirectLink = `https://t.me${
    telegramBotInfo?.appName
  }?startapp=${telegramHelper.generateTgLink({ searchKey: 2, locale: router.locale, invitationCode: user?.invitationCode})}`;
  const shareText = (encode = false) => {
    if (!isBrowser) {
      return "";
    }
    const lineBreak = getLineBreak(encode);
    const listStr = hotNews
      ?.map(
        (item: any, index: number) =>
          `${index + 1}/ ${selectContent(item, "title", "hot")}`
      )
      .join(lineBreak);
    const shareLink = isTelegram
      ? telegramDirectLink
      : `${window.location.origin}/${router.locale}/hot`;
    if (router.locale === "en") {
      return `🔥SoSoValue Daily Crypto Hot News | ${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak} ${shareLink}`;
    } else if (router.locale === "zh") {
      return `🔥SoSoValue 每日Crypto热点新闻｜${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak} ${shareLink}`;
    } else if (router.locale === "tc") {
      return `🔥SoSoValue 每日Crypto熱門新聞｜${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak} ${shareLink}`;
    } else if (router.locale === "ja") {
      return `🔥 SoSoValue 毎日暗号通貨のホットニュース｜${dayjs().format(
        "MMM DD, YYYY"
      )}${lineBreak}${listStr}${lineBreak} ${shareLink}`;
    }
  };

  const mediaShareText = (encode = false, limit = 10) =>
    `${baseShareText(encode, limit)}${
      encode ? "" : "\n\n"
    }${`Explore more key information on ${encode ? "%23" : "#"}SoSoValue:`}`;
  const telegramShareLink = getTelegramShareUrl(
    telegramDirectLink,
    baseShareText()
  );
  const telegramDirectShareText = `${mediaShareText()}${shareLink}`;
  const hotNewsMain = (
    <div className="bg-background-primary-White-900">
      <div className="relative">
        <Image
          src="/img/feeds/bg.png"
          width={780}
          height={360}
          className="w-full h-auto"
          alt=""
        />
        <div className="absolute pt-11 left-0 top-0 w-full h-full flex items-center justify-center flex-col">
          <span className="text-4xl font-extrabold italic text-accent-600-600">
            24H HOT NEWS
          </span>
          <Logo className="mt-2 mb-8" />
          <span className="text-xs text-placeholder-400-300">
            Powered by ChatGPT
          </span>
        </div>
      </div>
      {hotNews
        ? hotNews.map((item: any, index: number) => (
            <div key={item.id} {...createExportData(`${item.id}-${index}`)}>
              <NewsItem
                news={item}
                index={index}
                selectPost={(post)=>{setSelectedPost(post);trackNewsStart(post.id)}}
                onLinkClick={()=>trackFeedListClick(index,item.id,"",false,"Hot")}
                matchedItemClick={(e,d)=>{trackFeedTagClick(index,item.id,d.name||d.fullName||"")}}
              />
            </div>
          ))
        : null}
    </div>
  );
  const shareDialogNode = (
    <ShareDialog
      open={shareOpen}
      onClose={() => setShareOpen(false)}
      shareText={isTelegram ? telegramDirectShareText : shareText()}
      className="w-full"
      twitterShareLink={`https://twitter.com/intent/tweet?text=${mediaShareText(
        true,
        5
      )}&url=${shareLink}`}
      telegramShareLink={telegramShareLink}
    >
      <div className="bg-background-primary-White-900">
        {hotNewsMain}
        <div className="flex items-center justify-between pl-7 pr-5 mt-8">
          <div className="flex flex-col justify-between">
            <div className=" text-primary-900-White text-[15px] text-medium">
              {tCommon("Scan QR Code to Explore more key information")}
            </div>
            <div className="text-primary-900-White text-xs">
              {tCommon(
                "One-stop financial research platform for Crypto Investors"
              )}
            </div>
          </div>
          <div className="p-1 bg-white flex items-center ml-4 rounded-md">
            <QRCodeCanvas
              value={shareLink}
              size={72}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
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
    </ShareDialog>
  );
  useTgMobileRepairer(() => listRef.current!);
  return (
    <NavigateWrap lessNavigateHeight>
      {shareDialogNode}
      <div className="h-full flex flex-col items-stretch overflow-x-hidden overflow-y-auto relative" ref={listRef}>
        <div className="h-12 px-4 flex items-center justify-between absolute left-0 top-0 z-10 w-full">
          <Link href="/research">
            <IconButton className="text-primary-800-50">
              <ArrowLeftIcon className="scale-125" />
            </IconButton>
          </Link>
          <IconButton onClick={() => setShareOpen(true)}>
            <ExportIcon className="text-primary-800-50" />
          </IconButton>
        </div>
        {/* <div className="flex-1 h-0 pb-24 overflow-y-auto" ref={listRef}> */}
        <div className="pb-24">
          {hotNewsMain}
        </div>
      </div>
      <HotNewsDialog
        selectedPost={selectedPost}
        open={postDialogOpen}
        onClose={closePostDialog}
      />
    </NavigateWrap>
  );
};

export default Research;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "research"])),
      // Will be passed to the page component as props
    },
  };
}
