import React, { useEffect, useRef } from "react";
import { getHotArticleDetail } from "http/home";
import { IconButton } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import ArrowLeftIcon from "components/icons/arrow-left.svg";
import ShareIcon from "components/icons/Share.svg";
import LinkIcon from "components/icons/link.svg";
import HotPostDetail from "components/operation/research/HotPostDetail";
import { useShareHotPost } from "hooks/operation/useShareHotPost";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import useTelegramStore from "store/useTelegramStore";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { trackFeedsExpose, trackNewsDetailShare, trackNewsEnd, trackNewsStart } from "helper/track";
import useElementExport from "hooks/useElementExport";
const Detail = ({ data }: { data: Research.ClusterNews }) => {
  const { shareNode, openShareModal, copyShareLink } = useShareHotPost({
    post: data,
    onShareBtnClick(type, data) {
      data?.id&&trackNewsDetailShare(data.id,type);
    },
  });
  const router = useRouter();
  const { t } = useTranslation("home");
  const scroll=useRef<HTMLDivElement>(null);
  const {createExportData,track}=useElementExport(scroll,(list)=>{
    let ids=list.map(item=>{
      let arr=(item as string)?.split("-");
      let type=arr?.[2];
      return {id:arr?.[0],index:arr?.[1],type}
    });
    trackFeedsExpose("ClusterDetail",ids,"");
  });
  useEffect(() => {
      track();
      trackNewsStart(data.id);
      return () =>{trackNewsEnd(data.id)};
  }, [data.id]);
  const { isTelegram } = useTelegramStore();
  const handleBack = () => {
    // tg阅读原文打开场景
  if (isTelegram) {
    if (history.length <=2) {
      return router.push("/")
    }
  } else {
    if(history.length <= 1) {
      router.push("/")
    } else {
      router.back();
    }
  }
  }
  useTgMobileRepairer(() => scroll.current!);
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden" ref={scroll}>
      <div className="relative flex items-center justify-center h-12 border-0 border-b border-solid border-primary-100-700">
        <IconButton
          onClick={() => handleBack()}
          className="text-primary-800-50 absolute left-4 top-1/2 -translate-y-1/2"
        >
          <ArrowLeftIcon className="scale-110" />
        </IconButton>
        <span className="text-base font-bold text-primary-900-White">
          {t("Article")}
        </span>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <IconButton
            className="text-primary-800-50 mr-3"
            onClick={() => openShareModal()}
          >
            <ShareIcon />
          </IconButton>
          <IconButton className="text-primary-800-50" onClick={copyShareLink}>
            <LinkIcon />
          </IconButton>
        </div>
      </div>
      <div className="p-6">
        <HotPostDetail createExportData={createExportData} post={data} />
      </div>
      {shareNode}
    </div>
  );
};

export default Detail;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  const res = await getHotArticleDetail(context.params?.id as string, {
    headers: { "Accept-Language": context.locale as string },
  });

  // Pass data to the page via props
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, [
        "common",
        "home",
        "research",
      ])),
      data: res.data,
    },
  };
}
