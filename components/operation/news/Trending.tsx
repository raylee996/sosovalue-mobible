import React, { PropsWithChildren, useEffect, useContext } from "react";
import { getBannerList, getInformationList } from "http/index";
import Link from "next/link";
import { getHotNews } from "http/research";
import { ListItemButton } from "@mui/material";
import { ThemeContext } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const Trending = ({ onClose,createExportData}: { onClose?: () => void,createExportData?:(data:any)=>({[key:string]:string}) }) => {
  const { selectContent } = useContext(ThemeContext);
  const router = useRouter();
  const { t } = useTranslation(["common"]);
  const [hotNews, setHotNews] = React.useState<Research.ClusterNews[]>();
  const getHot = async () => {
    const { data } = await getHotNews({ pageNum: 0, pageSize: 10, status: 0 });
    setHotNews(data?.list);
  };
  const toClusterNewsDetail = (id: string) => {
    router.push(`/cluster/${id}`);
    onClose?.();
  };
  React.useEffect(() => {
    getHot();
  }, [router.locale]);
  return (
    <div className="flex flex-col items-stretch">
      <div className=" text-accent-600 text-base font-bold">
        <i className="w-0.5 h-3 bg-accent-600 inline-block mr-2"></i>
        {t("Trending")}
      </div>

      <div className="pb-[60px]">
        {hotNews?.map((item, index) => {
          return (
            <div
              {...createExportData?.(`${item.id}-${index}-Trading`)}
              className="py-2"
              onClick={() => toClusterNewsDetail(item.id)}
              key={item.id}
            >
              <div className="flex items-baseline py-2 group">
                <span
                  className={`mr-4 text-primary-900-White text-base font-extrabold`}
                >
                  {index + 1}
                </span>
                <p
                  className={`text-primary-900-White text-base font-medium leading-normal m-0 line-clamp-4 cursor-pointer`}
                >
                  {/* {item?.information?.title || item?.information?.content} */}
                  {selectContent(item, "title", "hot") ||
                    selectContent(item, "content", "hot")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trending;
