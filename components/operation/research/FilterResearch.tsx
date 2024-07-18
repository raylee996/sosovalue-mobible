import Button from "@mui/material/Button";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import useDimensionDict from "hooks/operation/useDimensionDict";
import TimeLineNewsItem from "components/operation/research/TimeLineNewsItem";
import NewsItem from "components/operation/research/NewsItem";
import { useInfiniteScroll } from "ahooks";
import Filter, { FilterParams } from "components/operation/research/Filter";
import {
  createBrowserQuery,
  filterEmptyValue,
  isInStandaloneMode,
} from "helper/tools";
import { getArticleList } from "http/home";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";
import { useNetwork } from "hooks/useNetwork";
import { useRouter } from "next/router";
import { FadeLoader } from "react-spinners";
import ScaleLoader from "components/base/ScaleLoader";
import usePullRefresh from "hooks/usePullRefresh";
import useNotistack from "hooks/useNotistack";
import FixSafariVHDIV from "components/base/FixSafariVHDIV";
import { useNavigateEvent } from "store/DirtyStore";
import ResearchDialog from "components/operation/research/ResearchDialog";
import HotNewsDialog from "components/operation/research/HotNewsDialog";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import FilterIcon from "components/icons/download/filter.svg";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineDotIcon from "components/icons/timeLineDot.svg";
import Menu from "components/icons/menu.svg";
import Stack from "components/icons/stack.svg";
import { useSharePost } from "hooks/operation/useSharePost";
import { InternetContext } from "store/InternetContext";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { trackFeedListClick, trackFeedsExpose, trackFeedsFilter, trackFeedTagClick, trackNewsEnd, trackNewsListShare, trackNewsStart } from "helper/track";
import useElementExport from "hooks/useElementExport";

export type CategoryConfig = {
  isResearch: boolean;
  isNews: boolean;
  isInsights: boolean;
  isInstitution: boolean;
  isOnchain?: boolean;
  isTech?: boolean;
  isProjectUpdate?: boolean;
};

export enum Category {
  Foryou,
  Research,
  News,
  Institution,
  Insights,
  SoSoReports,
  Onchain,
  Tech,
  ProjectUpdate,
}

export enum ResearchLayout {
  Block,
  Table,
}

const NoSSRShareDialogNode = dynamic(
  () => import("components/operation/research/ShareDialogNode"),
  {
    ssr: false,
  }
);

type Params = FilterParams & {
  userType: number;
};

const defaultParams: Params = {
  sourcePlatIdList: [],
  userType: 1,
  weight: 0.1,
};

type Props = {
  category: Category;
  categoryConfig: CategoryConfig;
};

const FilterResearch = ({ category, categoryConfig}: Props) => {
  const { openShareModal, shareNode } = useSharePost({
    onShareBtnClick(type, data) {
       trackNewsListShare(data.id,type);
    },
  });
  const router = useRouter();
  const { t } = useTranslation(localeType.RESEARCH);
  const networkState = useNetwork();
  const { success } = useNotistack();
  const listRef = useRef<HTMLDivElement | null>(null);
  const query = createBrowserQuery<{ sector: string }>();
  const [sector, setSector] = useState<string>(query.sector || "");
  const [filterOpen, setFilterOpen] = useState(false);
  const { sourceConfig, sectorConfig } = useDimensionDict({ withAll: false });
  const [filterParams, setFilterParams] = useState(defaultParams);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Research.Post>();
  const [hotPost, setHotPost] = useState<Research.ClusterNews>();
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  const [shareNewsOpen, setShareNewsOpen] = useState(false);
  const [researchLayout, setResearchLayout] = useState(ResearchLayout.Block);
  const isResearchBlock = researchLayout === ResearchLayout.Block;
  const isResearchTable = researchLayout === ResearchLayout.Table;
  // const postDialogOpen = !!selectedPost;
  const hotDialogOpen = !!hotPost;
  const openPostDialog = (post: Research.Post) => {
    trackNewsStart(post.id);
    setPostDialogOpen(true);
    setSelectedPost(post);
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

  usePullRefresh({
    threshold: 160,
    pullRef: listRef,
    indicator: (
      <div className="h-full flex justify-center items-center text-primary-900-White text-sm bg-dropdown-White-800">
        <FadeLoader
          className="!top-5 !left-5 mr-1"
          color="var(--primary-900-White)"
          width={3}
          height={6}
          radius={2}
          margin={-10}
        />
        {t("Refresh...")}
      </div>
    ),
    onTrigger() {
      return reloadAsync().then(() => success(t("refresh success")));
    },
  });
  const createCategoryList = (category: Category) => {
    if (category === Category.Research) {
      return [2];
    } else if (category === Category.Insights) {
      return [4];
    } else if (category === Category.News) {
      return [1, 7];
    } else if (category === Category.Institution) {
      return [3];
    } else if (category === Category.Onchain) {
      return [10];
    } else if (category === Category.Tech) {
      return [11];
    } else if (category === Category.ProjectUpdate) {
      return [12];
    }
  };
  const depParams = useMemo(() => {
    const categoryList = createCategoryList(category);
    return filterEmptyValue({ categoryList, sector, ...filterParams });
  }, [category, sector, filterParams]);
  const applyFilterParams = (params: FilterParams) => {
    const newValue = { ...filterParams, ...params };
    checkFilterChange(newValue);
    setFilterParams(newValue);
  };
  const checkFilterChange = (params: FilterParams) => {
    const isFilterChange = !!(
      params.keyword ||
      params.search ||
      params.weight !== 0.1 ||
      params.startTime ||
      params.endTime ||
      params.isOfficial ||
      params.sourcePlatIdList?.length
    );
    setIsFilterActive(isFilterChange);
  };
  const changeSector = (sector: string) => {
    setSector(sector);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useNavigateEvent({
    async onClickResearch() {
      await reloadAsync();
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
  });
  const {onRequestTimeout} = useContext(InternetContext);
  const {track,createExportData}=useElementExport(listRef,(list)=>{
    let ids=list.map(item=>{
      let arr=(item as string)?.split("-");
      return {id:arr?.[0],index:arr?.[1]}
    });
    trackFeedsExpose(Category[category],ids,JSON.stringify({...depParams,pageSize:10}));
});
  const {
    data: posts,
    loading,
    noMore,
    reloadAsync,
  } = useInfiniteScroll<
    Required<API.ListResponse<Research.Post>> & {
      lastSortValues?: number[];
      currentField?: string;
    }
  >(
    async (data) => {
      const params={
        pageSize: 10,
        ...depParams,
        lastSortValues: data?.lastSortValues,
        currentField: data?.currentField,
      }
      const res = await getArticleList(params, { onRequestTimeout });
      trackFeedsFilter({
        ...params,
        tabValue:category,
        showNum:data?.list?.length||0,
        sector_index:sectorConfig?.findIndex(item=>item?.label==depParams?.sector)+1,
      });
      if(!data?.lastSortValues?.length){
        track();
      }
      return {
        ...res.data,
        list: res.data.list || [],
        isNoMore: !res.data?.list?.length,
      };
    },
    {
      target: listRef.current,
      threshold: 100,
      reloadDeps: [depParams, router.locale],
      isNoMore: (data: any) => {
        // return Number(data?.pageNum) >= Number(data?.totalPage);
        return data?.isNoMore;
      },
    }
  );
  const handleShareNewsOpen = (post: Research.Post) => {
    openShareModal(post);
  };
  const handleShareNewsClose = () => {
    setShareNewsOpen(false);
    setSelectedPost(undefined);
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [depParams]);
  const isAll = sector === "";
  useTgMobileRepairer(() => listRef.current!);
  return (
    <>
      {shareNode}
      <div className="flex-1 h-0">
        <div className="h-full flex flex-col items-stretch overflow-hidden">
          <div className="flex justify-between items-center p-4">
            <span className="text-lg font-bold text-primary-900-White">
              {dayjs().format("MMMM DD dddd")}
            </span>
            <div className="flex items-center gap-x-3">
              {categoryConfig.isResearch && (
                <div className="rounded-lg border border-solid border-primary-100-700 bg-hover-50-900">
                  <IconButton
                    onClick={() => setResearchLayout(ResearchLayout.Block)}
                    className={`rounded-lg ${
                      isResearchBlock ? "bg-background-secondary-White-700" : ""
                    }`}
                  >
                    <Menu className=" text-primary-800-50" />
                  </IconButton>
                  <IconButton
                    onClick={() => setResearchLayout(ResearchLayout.Table)}
                    className={`rounded-lg ${
                      isResearchTable ? "bg-background-secondary-White-700" : ""
                    }`}
                  >
                    <Stack className=" text-primary-800-50" />
                  </IconButton>
                </div>
              )}
              <IconButton
                onClick={() => setFilterOpen(true)}
                className="p-0 w-8 h-8 bg-background-secondary-White-700 rounded-lg border border-solid border-primary-100-700 text-primary-800-50"
              >
                <FilterIcon />
              </IconButton>
              <Filter
                categoryConfig={categoryConfig}
                applyFilterParams={applyFilterParams}
                onClose={() => setFilterOpen(false)}
                open={filterOpen}
                sourceConfig={
                  sourceConfig as { value: string; label: string }[]
                }
              />
            </div>
          </div>
          <div className="px-4">
            <div className="overflow-x-auto h-6 flex items-center overflow-y-hidden">
              <div className="whitespace-nowrap">
                {sectorConfig.length > 0 && (
                  <Button
                    suppressHydrationWarning
                    onClick={() => setSector("")}
                    className={`normal-case text-xs min-w-0 font-normal mr-1 px-2 py-1 rounded-lg ${
                      isAll
                        ? "text-white bg-accent-600"
                        : "text-primary-900-White"
                    }`}
                  >
                    {t("All")}
                  </Button>
                )}
                {sectorConfig.map((item) => (
                  <Button
                    key={item.label}
                    suppressHydrationWarning
                    onClick={() => setSector(item.label as string)}
                    className={`normal-case text-xs min-w-0 px-2 py-1 rounded-lg font-normal mr-1 ${
                      sector === item.label
                        ? "text-white bg-accent-600"
                        : "text-primary-900-White"
                    }`}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 pt-4 h-0 pb-20 overflow-y-auto" ref={listRef}>
            {!!posts?.list.length
              ? posts.list.map((item, index) =>
                  category === Category.News ? (
                    <Timeline className="m-0 p-0" key={item.id} {...createExportData(`${item.id}-${index}`)}>
                      <TimelineItem
                        className="px-3"
                        classes={{ missingOppositeContent: "before:hidden" }}
                      >
                        {!filterParams.search && (
                          <TimelineSeparator className="mr-2">
                            <TimelineDot className="p-0 mb-2 mt-5 border border-solid border-accent-back shadow-none">
                              <TimelineDotIcon />
                            </TimelineDot>

                            <TimelineConnector className="bg-primary-100-700 -mb-2" />
                          </TimelineSeparator>
                        )}
                        <TimelineContent
                          className={`p-0 flex-1 w-0 ${
                            filterParams.search && " mb-2"
                          }`}
                        >
                          <TimeLineNewsItem
                            matchedItemClick={(e,d)=>{trackFeedTagClick(index,item.id,d.name||d.fullName||"")}}
                            key={item.id}
                            news={item}
                            categoryConfig={categoryConfig}
                            changeSector={changeSector}
                            selectPost={(post)=>{trackFeedListClick(index,item.id, Category[category]as string,Boolean(depParams?.isOfficial));openPostDialog(post)}}
                            onShare={handleShareNewsOpen}
                          />
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  ) : (
                    <div key={item.id} {...createExportData(`${item.id}-${index}`)}>
                      <NewsItem
                        matchedItemClick={(e,d)=>{trackFeedTagClick(index,item.id,d.name||d.fullName||"")}}
                        isFirst={index === 0}
                        isLast={index === posts.list.length - 1}
                        isResearchBlock={isResearchBlock}
                        isResearchTable={isResearchTable}
                        news={item}
                        categoryConfig={categoryConfig}
                        changeSector={changeSector}
                        selectPost={(post)=>{trackFeedListClick(index,item.id, Category[category] as string,Boolean(depParams?.isOfficial));openPostDialog(post)}}
                        onShare={handleShareNewsOpen}
                      />
                    </div>
                  )
                )
              : null}
            {(!noMore || loading) && (
              <div className="flex items-center justify-center py-5">
                <ScaleLoader />
              </div>
            )}
            {!posts?.list?.length && !loading && (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="text-primary-900-White text-sm font-bold">
                  {t("No Results")}
                </span>
                <div className="text-secondary-500-300 text-sm mt-4">
                  {t("Please try to reduce the filtering conditions.")}
                </div>
              </div>
            )}
          </div>
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
        />
        <NoSSRShareDialogNode
          selectedPost={selectedPost}
          shareDialogProps={{
            open: shareNewsOpen,
            onClose: handleShareNewsClose,
          }}
        />
      </div>
    </>
  );
};

export default FilterResearch;
