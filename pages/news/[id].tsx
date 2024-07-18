import React, { useContext, useEffect, useRef, useState } from "react";
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
import PostDetail from "components/operation/research/PostDetail";
import { GetServerSidePropsContext } from "next";
import ArrowLeftIcon from "components/icons/arrow-left.svg";
import ShareIcon from "components/icons/Share.svg";
import LinkIcon from "components/icons/link.svg";
import LogoFull from "components/icons/logo/logo-full.svg";
import { useSharePost } from "hooks/operation/useSharePost";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import useTelegramStore from "store/useTelegramStore";
import { trackFeedsExpose, trackNewsDetailShare, trackNewsEnd, trackNewsStart } from "helper/track";
import useElementExport from "hooks/useElementExport";

const Detail = ({ data }: { data: Research.Post }) => {
  const { shareNode, openShareModal, copyShareLink } = useSharePost({
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
    trackFeedsExpose("NewsDetail",ids,"");
  });
  useEffect(() => {
    trackNewsStart(data.id);
    track();
    return () => {trackNewsEnd(data.id)};
}, [data.id]);
const { isTelegram } = useTelegramStore();
useTgMobileRepairer(() => scroll.current!);
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
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden" ref={scroll}>
      <div className="relative flex items-center justify-center h-12 border-0 border-b border-solid border-primary-100-700">
        <IconButton
          onClick={() => handleBack()}
          className="text-primary-800-50 absolute left-4 top-1/2 -translate-y-1/2"
        >
          <ArrowLeftIcon className="scale-110"/>
        </IconButton>
        <span className="text-base font-bold text-primary-900-White">
        {t("Article")}
      </span>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <IconButton
            className="text-primary-800-50 mr-3"
            onClick={() => openShareModal()}
          >
            <ShareIcon/>
          </IconButton>
          <IconButton className="text-primary-800-50" onClick={copyShareLink}>
            <LinkIcon/>
          </IconButton>
        </div>
      </div>
      <div className="p-6">
        <PostDetail post={data}/>
        <div className="mt-8">
          <Trending createExportData={createExportData}/>
        </div>
      </div>
      {shareNode}
    </div>

  );
};

export default Detail;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  let res = { data: {} };

  if (!isNaN(+(context.params?.id as string))) {
    res = await getArticleDetail(context.params?.id as string, {
      headers: { "Accept-Language": context.locale as string },
    });
  } else {
    res = await getArticleDetailBySlug(context.params?.id as string, {
      headers: { "Accept-Language": context.locale as string },
    });
  }

  const { data } = res || {};

  // Pass data to the page via props
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, [
        "common",
        "home",
        "research",
      ])),
      data,
    },
  };
}
