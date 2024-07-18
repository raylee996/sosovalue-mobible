import React, { useEffect, useRef, useMemo, useContext } from "react";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ListItem from "components/operation/announcement/ListItem";
import { useInfiniteScroll } from "ahooks";
import { batchRead, pushNatification } from "http/home";
import { Button, Dialog, IconButton, Tab, Tabs } from "@mui/material";
import ArrowIcon from "components/svg/Arrow";
import { useRouter } from "next/router";
import { UserContext } from "store/UserStore";
const Center = () => {
  const router = useRouter();
  const userStore = useContext(UserContext);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { data: posts } = useInfiniteScroll<
    Required<API.ListResponse<API.Article>>
  >(
    async (data) => {
      const res = await pushNatification({
        pageNum: data ? Number(data.pageNum) + 1 : 1,
        pageSize: 20,
        category: 2,
        pushStatus: 1,
        pushType: 2,
      });
      return { ...res.data, list: res.data.list || [] };
    },
    {
      target: listRef.current,
      reloadDeps: [],
      isNoMore: (data) => {
        return Number(data?.pageNum) >= Number(data?.totalPage);
      },
    }
  );
  const back = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };
  const putBatchRead = async () => {
    if (userStore.user) {
      const res = await batchRead({
        isRead: 1,
        receiverId: userStore.user.id,
      });
    }
  };
  useEffect(() => {
    putBatchRead();
  }, []);
  return (
    <div className="h-screen w-full flex flex-col items-stretch">
      <div className="bg-neutral-bg-3-rest rounded-lg flex-1 h-0 flex flex-col items-stretch overflow-x-hidden">
        <div className="p-3 flex items-center justify-between border-0 border-b border-solid border-[#6A6A6A]/[.16]">
          <div className="text-lg text-[#FFF] font-bold flex items-center">
            <IconButton className="text-[#F5F5F5]" onClick={back}>
              <ArrowIcon viewBox="0 0 12 12" className="w-6 h-6 rotate-90" />
            </IconButton>
            <Image
              src="/img/svg/sosovalue.svg"
              alt=""
              width={32}
              height={32}
              className="cursor-pointer mr-3"
            />
            SoSoValue
          </div>
        </div>
        <div
          className="flex w-full flex-1 h-0 py-3 overflow-y-scroll mb-8"
          ref={listRef}
        >
          <div className=" mx-5 h-full flex flex-col items-stretch w-full">
            {!!posts?.list.length &&
              posts?.list.map((item, index) => {
                return (
                  <>
                    <ListItem key={index} posts={item || []} />
                  </>
                );
              })}
            {/* {posts?.list.map((item, index) => {
              return (
                <ListItem
                  time={item.realiseTime}
                  title={item.title}
                  content={item.content}
                />
              );
              return (
                <div className="mb-6">
                  <div className="text-xs text-[#ADADAD] text-center mb-0.5">
                    {item.time}
                  </div>
                  <div className="bg-neutral-bg-2-rest px-4 py-2 rounded-lg">
                    <div className="text-xl text-brand-fg-1-rest font-bold mb-2">
                      {item.title}
                    </div>
                    <div
                      className="text-neutral-fg-2-rest text-sm line-clamp-[10]"
                      dangerouslySetInnerHTML={{
                        __html: item.content,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Center;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "center"])),
      // Will be passed to the page component as props
    },
  };
}
