import Link from "next/link";
import Image from "next/image";
import { formatDate, transferMoney } from "helper/tools";
import { findDefaultSymbolByCurrencyIds } from "http/home";
import { useRouter } from "next/router";
import { SyntheticEvent, useContext, useMemo } from "react";
import { ThemeContext } from "store/ThemeStore";
import { useTranslation } from "next-i18next";

import useNotistack from "hooks/useNotistack";
import { UserContext } from "store/UserStore";
import { ListItemButton } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { createCurrencyDetailLink } from "helper/link";

type Props = {
  news: Research.ClusterNews;
  index: number;
  selectPost: (post: Research.ClusterNews) => void;
  formatTime?: (time: Dayjs) => string;
  matchedItemClick?:(e:React.MouseEvent<HTMLElement>,data:any)=>void;
  onLinkClick?:()=>void;
};

const NewsItem = ({ news, index, selectPost, formatTime,matchedItemClick,
  onLinkClick}: Props) => {
  const { success } = useNotistack();
  const { selectContent } = useContext(ThemeContext);
  const { user, authModal } = useContext(UserContext);
  const { t } = useTranslation("common");
  const matchedCurrencies =
    typeof news.matchedCurrencies === "string" &&
    JSON.parse(news.matchedCurrencies)
      .slice(0, 3)
      .map((i: any, index: number) => (
        <Link
          href={createCurrencyDetailLink({ fullName: i.fullName })}
          onClick={(e) => {e.stopPropagation();matchedItemClick?.(e,i)}}
          className="text-xs text-accent-600-600 mr-2 py-0 h-5 flex items-center cursor-pointer no-underline"
          key={index}
        >
          {i.name.toUpperCase()}
        </Link>
      ));

  const renderNews = () => {
    return (
      <div key={news.id} className="w-full overflow-hidden bg-background-primary-White-900">
        <div className={`text-secondary-500-300 px-3 py-4 text-xs font-light`}>
          {/* <Link href={link} className="no-underline" target="_blank"> */}
          <div className="text-[#F4F4F4] text-sm px-5 relative">
            <div className="absolute left-0 top-0 text-accent-600-600 text-base font-bold">
              {index + 1}
            </div>
            <div
              className={`line-clamp-3 text-primary-900-White text-base font-bold overflow-hidden mb-2`}
              dangerouslySetInnerHTML={{
                __html: selectContent(news, "title", "hot"),
              }}
            ></div>
            <div
              className={`text-sm text-primary-900-White w-full select-text mb-2 line-clamp-3`}
              dangerouslySetInnerHTML={{
                __html: selectContent(news, "content", "hot") || "",
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center">
              {
                news.sector && <div className="text-xs cursor-pointer py-0 h-5 flex items-center text-secondary-500-300 whitespace-nowrap">
                #{news.sector}
              </div>
              }
              {!!matchedCurrencies.length && (
                <i className="inline-block h-1 w-1 rounded-full bg-secondary-500-300 mx-2" />
              )}
              {matchedCurrencies}
            </div>
            <span className="text-secondary-500-300 text-xs">
              {formatTime
                ? formatTime(dayjs(+news.createTime))
                : formatDate(news.createTime)}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const select = () => {
    onLinkClick?.();
    selectPost(news);
  };
  return (
    <ListItemButton className="p-0" onClick={() => select()}>
      {renderNews()}
    </ListItemButton>
  );
};

export default NewsItem;
