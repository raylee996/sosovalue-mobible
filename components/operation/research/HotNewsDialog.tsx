import React, { useEffect, useRef } from "react";
import { getHotArticleDetail } from "http/home";
import { IconButton, Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import useLoading from "hooks/useLoading";
import ShareIcon from "components/icons/Share.svg";
import LinkIcon from "components/icons/link.svg";
import CloseIcon from "components/icons/close.svg";
import { useShareHotPost } from "hooks/operation/useShareHotPost";
import HotPostDetail from "./HotPostDetail";
import { useTranslation } from "next-i18next";
import { Category } from "./FilterResearch";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
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
  selectedPost?: Research.ClusterNews;
  open: boolean;
  onClose: () => void;
  categoryChange?: (category: Category) => void;
};

const HotNewsDialog = ({
  onClose,
  open,
  selectedPost,
  categoryChange,
}: Props) => {
  const [article, setArticle] = React.useState<Research.ClusterNews>();
  const { shareNode, openShareModal, copyShareLink } = useShareHotPost({
    post: article,
    onShareBtnClick(type, data) {
      data?.id&&trackNewsDetailShare(data.id,type);
    },
  });
  const Loading = useLoading();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { resetTgRepair } = useTgMobileRepairer(() => scrollRef.current!);
  const close = () => {
    onClose();
    setArticle(undefined);
    resetTgRepair();
  };
  const changeCategory = (category: Category) => {
    onClose();
    categoryChange && categoryChange(category);
  };
  const scroll=useRef<HTMLDivElement>(null);
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
      Loading.start();
      getHotArticleDetail(selectedPost.id).then((res) => {
        setArticle(res.data);
        Loading.close();
      });
    }
  }, [selectedPost]);
  const { t } = useTranslation("home");
  return (
    <Dialog
      open={open}
      onClose={close}
      TransitionComponent={Transition}
      fullScreen
      scroll="paper"
      classes={{ paper: "bg-none" }}
    >
      {shareNode}
      <Loading.Component>
        <div className="h-screen overflow-y-auto" ref={scrollRef}>
          <div className="relative flex items-center justify-center h-12 border-0 border-b border-solid border-primary-100-700">
            <IconButton
              onClick={close}
              className="text-primary-800-50 absolute left-4 top-1/2 -translate-y-1/2"
            >
              <CloseIcon />
            </IconButton>
            <span className="text-base font-bold text-primary-900-White">
              {t("Article")}
            </span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <IconButton
                className="text-primary-800-50 mr-3"
                onClick={() => openShareModal(article)}
              >
                <ShareIcon />
              </IconButton>
              <IconButton
                className="text-primary-800-50"
                onClick={copyShareLink}
              >
                <LinkIcon />
              </IconButton>
            </div>
          </div>
          <div className="p-6">
            <HotPostDetail createExportData={createExportData} post={article} changeCategory={changeCategory} />
          </div>
        </div>
      </Loading.Component>
    </Dialog>
  );
};

export default HotNewsDialog;
