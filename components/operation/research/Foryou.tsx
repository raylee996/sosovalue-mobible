import { useInfiniteScroll } from "ahooks";
import HotNews from "./HotNews";
import { getCuratedList, getRandomPostList } from "http/research";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import NewsItem from "components/operation/research/NewsItem";
import { Category, CategoryConfig } from "./FilterResearch";
import Link from "next/link";
import { usePost } from "hooks/operation/usePost";
import ResearchDialog from "components/operation/research/ResearchDialog";
import HotNewsDialog from "components/operation/research/HotNewsDialog";
import dynamic from "next/dynamic";
import ScaleLoader from "components/base/ScaleLoader";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";
import { InternetContext } from "store/InternetContext";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { trackFeedListClick, trackFeedsExpose, trackFeedsFilter, trackFeedTagClick, trackNewsEnd, trackNewsStart } from "helper/track";
import useElementExport from "hooks/useElementExport";

const NoSSRShareDialogNode = dynamic(
  () => import("components/operation/research/ShareDialogNode"),
  {
    ssr: false,
  }
);

type Props = {
  categoryConfig: CategoryConfig;
  categoryChange?: (category: Category) => void;
};

const Foryou = ({ categoryConfig, categoryChange }: Props) => {
  const router = useRouter();
  const { t } = useTranslation(localeType.RESEARCH);
  const listDivRef = useRef(null);
  const { createPost } = usePost();
  const [shareNewsOpen, setShareNewsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Research.Post>();
  const [hotPost, setHotPost] = useState<Research.ClusterNews>();
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const hotDialogOpen = !!hotPost;
  const selectPost = (post: Research.Post) => {
    trackNewsStart(post.id);
    setSelectedPost(post);
    setPostDialogOpen(true);
  };
  const closePostDialog = () => {
    selectedPost&&trackNewsEnd(selectedPost.id);
    setPostDialogOpen(false);
    setSelectedPost(undefined);
  };
  const closeHotDialog = () => {
    hotPost&&trackNewsEnd(hotPost.id);
    setHotPost(undefined);
  };
  const handleShareNewsClose = () => {
    setShareNewsOpen(false);
    setSelectedPost(undefined);
  };
  const {onRequestTimeout} = useContext(InternetContext);
  const {track,createExportData}=useElementExport(listDivRef,(list)=>{
      let ids=list.map(item=>{
        let arr=(item as string)?.split("-");
        let type=arr?.[2];
        return {id:arr?.[0],index:arr?.[1],type}
      });
      trackFeedsExpose("For You",ids,"");
  });
  const {
    data: posts,
    loading,
    noMore,
    reloadAsync,
  } = useInfiniteScroll<Required<API.ListResponse<Research.Post>>>(
    async (data) => {
      const pageNum = data ? Number(data.pageNum) + 1 : 1;
      const getCuratedsPromise = getCuratedList({
        pageNum,
        status: 0,
        pageSize: 10,
      }, 
      { onRequestTimeout });
      const promises: [
        ReturnType<typeof getCuratedList>,
        ReturnType<typeof getRandomPostList> | null
      ] = [getCuratedsPromise, null];
      if (pageNum === 1) {
        const endTime = dayjs();
        const getCRandomPostListPromise = getRandomPostList({
          userType: 1,
          weight: 0.7,
          categoryList: [1, 2],
          startTime: endTime.subtract(1, "day").valueOf(),
          endTime: endTime.valueOf(),
        }, 
        { onRequestTimeout });
        promises[1] = getCRandomPostListPromise;
      }
      const [curatedRes, randomRes] = await Promise.all(promises);
      const curatedList = (curatedRes.data.list
        ?.map((item) => item.informationDoVo)
        .filter((item) => !!item) || []) as Research.Post[];
      const list = randomRes
        ? createRandomPostList(curatedList, randomRes.data.list || [])
        : curatedList;
        trackFeedsFilter({
          pageSize:10,
          tabValue:0,
          showNum:data?.list?.length||0
        });
      if(pageNum===1){
        track();
      }
      return {
        ...curatedRes.data,
        list: extractAndSetCoverPicture(list),
        isNoMore: !list?.length,
      };
    },
    {
      target: listDivRef.current,
      threshold: 100,
      reloadDeps: [router.locale],
      isNoMore: (data: any) => {
        // return Number(data?.pageNum) >= Number(data?.totalPage);
        return data?.isNoMore;
      },
    }
  );
  const extractAndSetCoverPicture = (list: Research.Post[]) => {
    return list.map((item) => {
      if (!item.coverPicture) {
        const src = item.content?.match(/<img[^>]+src="([^">]+)"/)?.[1];
        if (src) {
          item.coverPicture = src;
        }
      }
      return item;
    });
  };
  const createRandomPostList = (
    curatedList: Research.Post[],
    randomList: Research.Post[]
  ) => {
    const list = randomList.concat(curatedList);

    const postList: Research.Post[] = [];
    while (list.length) {
      const index = Math.floor(Math.random() * list.length);
      const [post] = list.splice(index, 1);
      postList.push(post);
    }
    return postList;
  };
  useTgMobileRepairer(() => listDivRef.current!);
  return (
    <div className="flex-1 h-0 overflow-y-auto" ref={listDivRef}>
      <div className="flex justify-between items-center p-4">
        <span className="text-lg font-bold text-primary-900-White">
          {t("For You")}
        </span>
      </div>
      <HotNews createExportData={createExportData} selectPost={(news)=>{setHotPost(news);trackNewsStart(news.id)}} />
      <div className="pb-20">
        {!!(posts && posts.list.length) &&
          posts.list?.map((news, index) => {
            const post = createPost(news);
            const {
              title,
              seoTitle,
              seoMeta,
              content,
              FinalContent,
              Sector,
              MatchedCurrency,
              translateTip,
              TranslateTip,
              releaseTimeFormated,
              timeAgoFormated,
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
            const { weight, id, author, sourceDescription, coverPicture } =
              raw!;
            return (
              <div {...createExportData(`${news.id}-${index}`)}
                key={news.id + index}
                onClick={() =>{selectPost(news);trackFeedListClick(index,news.id,"For You",false)}}
                className={`border border-solid border-primary-100-700 mx-4 ${
                  index === 0 ? "rounded-t-xl" : "border-t-0"
                } ${index === posts.list.length - 1 ? "rounded-b-xl" : ""}`}
              >
                <div className={`py-4 px-5 text-xs font-light`}>
                  {/* <Link href={link} className="no-underline" target="_blank"> */}
                  <div>
                    {title && (
                      <div
                        className={`text-primary-900-White text-base font-bold line-clamp-3 mb-2`}
                        dangerouslySetInnerHTML={{
                          __html: title || "",
                        }}
                      ></div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="w-full flex justify-between items-center">
                        <div className="mr-6 py-0.5 text-sm text-neutral-fg-2-rest font-medium">
                          {news.author && (
                            <div className="whitespace-nowrap truncate flex items-center">
                              <AuthorAvatar className="w-4 h-4 mr-2" />
                              {isInsight ? "@" : ""}
                              <span className="line-clamp-1 whitespace-normal">
                                {author}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-primary-900-White text-sm w-full select-text mb-2 limit-img research-news-list-clamp-4`}
                      dangerouslySetInnerHTML={{
                        __html: `${translateTip || ""}  ${content}`,
                      }}
                    ></div>
                  </div>
                  {/* </Link> */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Sector />
                      <MatchedCurrency onItemClick={(e,d)=>{trackFeedTagClick(index,news.id,d.name||d.fullName||"")}} />
                    </div>
                    <div className="text-xs text-[#8F8F8F] whitespace-nowrap py-0.5 flex items-center space-x-4">
                      <span>{timeAgoFormated}</span>
                      {/* <SharedButton onClick={handleShare} /> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {(!noMore || loading) && (
          <div className="flex items-center justify-center py-5">
            <ScaleLoader />
          </div>
        )}
      </div>
      <ResearchDialog
        selectedPost={selectedPost}
        open={postDialogOpen}
        onClose={closePostDialog}
      />
      <HotNewsDialog
        selectedPost={hotPost}
        open={hotDialogOpen}
        onClose={closeHotDialog}
        categoryChange={categoryChange}
      />
      <NoSSRShareDialogNode
        selectedPost={selectedPost}
        shareDialogProps={{
          open: shareNewsOpen,
          onClose: handleShareNewsClose,
        }}
      />
    </div>
  );
};

export default Foryou;
