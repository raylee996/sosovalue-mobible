import React, { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { getArticleDetail } from "http/home";
import { useRouter } from "next/router";
import { copyText } from "helper/tools";
import { IconButton, Dialog, Slide } from "@mui/material";
import useNotistack from "hooks/useNotistack";
import { ThemeContext } from "store/ThemeStore";
import { TransitionProps } from "@mui/material/transitions";
import useLoading from "hooks/useLoading";
import { UserContext } from "store/UserStore";
import { usePost } from "hooks/operation/usePost";
import { useControlled } from "hooks/useController";
import ShareDialogNode from "./ShareDialogNode";
import ShareIcon from "components/icons/Share.svg";
import LinkIcon from "components/icons/link.svg";
import CloseIcon from "components/icons/close.svg";
import PostDetail from "./PostDetail";
import { useTranslation } from "next-i18next";
import { useSharePost } from "hooks/operation/useSharePost";
import Trending from "../news/Trending";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { cn } from "helper/cn";
import useTelegramStore from "store/useTelegramStore";
import { trackFeedsExpose, trackNewsDetailShare } from "helper/track";
import useElementExport from "hooks/useElementExport";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

type Props = {
  selectedPost?: Research.Post | string;
  open: boolean;
  onClose: () => void;
};

const ResearchDialog = ({ onClose, open, selectedPost }: Props) => {
  const [article, setArticle] = React.useState<Research.Post>();
  const { shareNode, openShareModal, copyShareLink } = useSharePost({
    post: article,
    onShareBtnClick(type, data) {
      data?.id&&trackNewsDetailShare(data.id,type);
    },
  });
  const { isTelegram } = useTelegramStore();
   const {t}=useTranslation("home");
  const Loading = useLoading();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { resetTgRepair } = useTgMobileRepairer(() => scrollRef.current!);
  const close = () => {
    onClose();
    resetTgRepair();
    setArticle(undefined);
  };
  const {createExportData,track}=useElementExport(scrollRef,(list)=>{
    let ids=list.map(item=>{
      let arr=(item as string)?.split("-");
      let type=arr?.[2];
      return {id:arr?.[0],index:arr?.[1],type}
    });
    trackFeedsExpose("NewsDetail",ids,"");
  });
  useEffect(() => {
    if (selectedPost) {
      // Loading.start();
      getArticleDetail(
        typeof selectedPost === "string" ? selectedPost : selectedPost.id
      ).then((res) => {
        setArticle(res.data);
        track();
        Loading.close();
      });
    }
  }, [selectedPost]);
  useEffect(() => {
    if (article?.authorAvatar) {
      fetch(article.authorAvatar, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
    }
  }, [article]);
  return (
    <Dialog
      open={open}
      onClose={close}
      TransitionComponent={Transition}
      fullScreen
      scroll="paper"
      classes={{
        paper: "bg-none",
      }}
    >
      {shareNode}
      <Loading.Component>
        <div className={cn("h-full overflow-y-auto", { "overscroll-contain": isTelegram })} ref={scrollRef}>
          <div
            className="relative flex items-center justify-center h-12 border-0 border-b border-solid border-primary-100-700">
            <IconButton
              onClick={close}
              className="text-primary-800-50 absolute left-4 top-1/2 -translate-y-1/2"
            >
              <CloseIcon/>
            </IconButton>
            <span className="text-base font-bold text-primary-900-White">
            {t("Article")}
          </span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <IconButton
                className="text-primary-800-50 mr-3"
                onClick={() => openShareModal(article)}
              >
                <ShareIcon className="text-primary-800-50"/>
              </IconButton>
              <IconButton
                className="text-primary-800-50"
                onClick={copyShareLink}
              >
                <LinkIcon className="text-primary-800-50"/>
              </IconButton>
            </div>
          </div>
          <div className="p-6">
            <PostDetail post={article}/>
            <div className="mt-8">
              <Trending createExportData={createExportData}/>
            </div>
          </div>
        </div>
      </Loading.Component>
    </Dialog>
  );
};

export default ResearchDialog;
