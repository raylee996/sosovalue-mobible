import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getHotNews } from "http/research";
import { useRouter } from "next/router";
import { transferMoney, objectSort } from "helper/tools";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "store/ThemeStore";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { InternetContext } from "store/InternetContext";
import { trackFeedListClick } from "helper/track";

type Props = {
  selectPost: (post: Research.ClusterNews) => void;
  createExportData?:(data:any)=>({[key:string]:string})
};
const NewsItem = ({ selectPost,createExportData}: Props) => {
  const router = useRouter();
  const [hotNews, setHotNews] = React.useState<any>();
  const { t } = useTranslation("research");
  const { selectContent } = useContext(ThemeContext);
  const {onRequestTimeout} = useContext(InternetContext);
  const getHot = async () => {
    const { data } = await getHotNews(
      { pageNum: 1, pageSize: 10, status: 0 },
      { onRequestTimeout }
    );
    let list: any = [];
    data?.list &&
      data?.list.forEach((item: any) => {
        let contentInformationSourceList = item.contentInformationSourceList;
        contentInformationSourceList.sort(objectSort("weight"));
        list.push({ ...item, contentInformationSourceList });
      });

    setHotNews(list);
  };
  const select = (news: any) => {
    selectPost(news);
  };
  React.useEffect(() => {
    getHot();
  }, [router.locale]);
  return (
    <div className="px-4 mb-6">
      <div className="rounded-lg border border-solid border-[rgba(255,79,32,0.20)]">
        <div className="rounded-lg relative bg-gradient-to-b from-[rgba(255,79,32,0.10)] to-[rgba(255,79,32,0.00)] dark:from-[rgba(255,79,32,0.10)] dark:to-[rgba(255,79,32,0.00)] px-6 py-4">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center">
              <div className="text-base text-primary-900-White font-bold ml-2">
                {t("Hot News")}
              </div>
            </div>
            <Link href="/hot" className="no-underline">
              <div className="text-xs text-secondary-500-300 flex cursor-pointer items-center">
                {t("View More")}
                <KeyboardArrowRightRoundedIcon />
              </div>
            </Link>
          </div>
          <div className="pt-4">
            {hotNews &&
              hotNews.slice(0, 3).map((item: any, index: number) => (
                <div 
                  key={"hottopic"+item.id+index}
                  className={`${
                    index != 0 && "mt-3"
                  } pl-9 relative text-sm font-semibold text-[#D6D6D6]`}
                  onClick={() => {
                    select(item);
                    trackFeedListClick(index,item.id,"For You",false,"Hot");
                  }}
                  {...createExportData?.(`${item.id}-${index}-hot`)}
                >
                  <div className="absolute left-3 top-0 text-accent-600">
                    {index + 1}
                  </div>
                  <div
                    className="text-primary-900-White line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: item.title || item.content,
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
