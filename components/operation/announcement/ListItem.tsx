import React, { useEffect, useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "store/ThemeStore";
require("dayjs/locale/zh-cn");
require("dayjs/locale/zh-tw");
require("dayjs/locale/ja");
type Props = {
  posts: any;
};

const ListItem = ({ posts }: Props) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [more, setMore] = useState(false);
  const { selectContentOhter: selectContent } = useContext(ThemeContext);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["common"]);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    if (
      contentRef.current &&
      contentRef.current.clientHeight >= 10 * 18 &&
      posts
    ) {
      setExpanded(false);
      setMore(true);
    }
  }, [posts]);
  useEffect(() => {
    if (router.locale == "zh") {
      dayjs.locale("zh-cn");
    } else if (router.locale == "tc") {
      dayjs.locale("zh-tw");
    } else if (router.locale == "ja") {
      dayjs.locale("ja");
    } else {
      dayjs.locale("en");
    }
  }, [router.locale]);
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs text-[#ADADAD] text-center mb-0.5">
          {" "}
          {dayjs(posts.pushTime).format("MMM D,YYYY")}
        </div>
        <div
          className={`bg-[#141414] px-4 py-2 rounded-lg relative ${
            expanded && "pb-[32px]"
          }`}
        >
          <div className="text-lg text-[#FF4F20] font-bold mb-2">
            {selectContent(posts, "title")}
          </div>
          <div
            className={`text-[#FFF] announcement text-sm ${
              !expanded && "line-clamp-[10]"
            } `}
            ref={contentRef}
            dangerouslySetInnerHTML={{
              __html: selectContent(posts, "content"),
            }}
          ></div>
          {more && (
            <div
              className={`w-full rounded-lg ${
                expanded ? "h-[50px]" : "h-[150px]"
              } absolute left-0 bottom-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.00)_0%,rgba(20,20,20,1.00)_100%,rgba(20,20,20,1.00)_100%)]`}
            >
              <div
                className="absolute left-1/2 -ml-[41px] cursor-pointer bottom-0 w-[82px] h-[32px] py-5 text-center flex items-center text-sm text-[#FF4F20]"
                onClick={toggleExpand}
              >
                <Image
                  src="/img/svg/CaretDoubleDown.svg"
                  width={20}
                  height={20}
                  alt=""
                  className={`mr-1 ${expanded && "rotate-180"}`}
                />{" "}
                {expanded ? t("Less") : t("More")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ListItem;
