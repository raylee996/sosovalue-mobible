import React, { useEffect, useRef, useContext } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { useInfiniteScroll } from "ahooks";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import ButtonBase from "@mui/material/ButtonBase";

import { batchRead, pushNatification } from "http/home";
import { UserContext } from "store/UserStore";
import { ThemeContext } from "store/ThemeStore";
import useDayjsLocale from "hooks/useDayjsLocale";
import ArrowLeft from 'components/icons/arrow-left.svg'
import EllipseSvg from 'components/icons/message/ellipse.svg'
import ScaleLoader from "components/base/ScaleLoader";
import DetailsModal from 'components/operation/announcement/DetailsModal'

const unread = false

interface Props {
  onBack?: () => void
}

const Index = (props: Props) => {
  const { onBack } = props
  const router = useRouter();
  const userStore = useContext(UserContext);
  const listRef = useRef<HTMLDivElement | null>(null);
  const userId = userStore.user?.id
  const { selectContentOhter: selectContent } = useContext(ThemeContext);
  const { t } = useTranslation(["common"]);

  useDayjsLocale()

  const { data: posts, loading } = useInfiniteScroll<
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

  const handleClick = (item: API.Article) => {
    NiceModal.show(DetailsModal, { item })
  }

  const back = () => {
    if (onBack) {
      onBack()
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  useEffect(() => {
    if (userId) {
      batchRead({ isRead: 1, receiverId: userId });
    }
  }, [userId]);

  return (
    <>
      <header className='header-base text-center relative'>
        <ButtonBase onClick={back} className='svg-icon-base text-primary-800-50 absolute left-4 top-2'>
          <ArrowLeft />
        </ButtonBase>
        <span className='h-9 inline-flex items-center'>{t("Announcements")}</span>
      </header>
      <div ref={listRef} className="px-4 py-5 flex-col justify-start items-start gap-1 flex">
        {!!posts?.list.length && posts.list.map((item, index) => (
          <ButtonBase key={index} onClick={() => handleClick(item)} component="div" className="w-full px-4 py-2 rounded-lg flex-col items-start">
            {unread && <EllipseSvg className="text-dropdown-White-800 absolute right-4 top-2" />}
            <span className="text-secondary-500-300 text-sm font-medium leading-tight">
              {dayjs(item.pushTime).format("MMM D,YYYY")}
            </span>
            <div className="text-base font-bold leading-normal">
              {selectContent(item, "title")}
            </div>
          </ButtonBase>
        ))}
        {loading && <ScaleLoader />}
      </div>
    </>
  )
}

export default Index

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "center"])),
      // Will be passed to the page component as props
    },
  };
}
