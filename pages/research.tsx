import Button from "@mui/material/Button";
import NavigateWrap from "components/layout/NavigateWrap";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";
import { getIsShowNotiBanner, setIsShowNotiBanner } from "helper/storage";
import { UserContext } from "store/UserStore";
import { IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Warning from "components/icons/warning.svg";
import dayjs from "dayjs";
import usePwaStore from "store/usePwaStore";
import SEO from "components/operation/SEO";
import useOneSignalStore from "store/useOneSignalStore";
import { useShallow } from "zustand/react/shallow";
import Header from "components/header";

import Foryou from "components/operation/research/Foryou";
import FilterResearch, {
  Category,
} from "components/operation/research/FilterResearch";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useIsomorphicLayoutEffect, useUpdateEffect } from "ahooks";
import { createBrowserQuery } from "helper/tools";
import useRequestError from "hooks/useRequestError";
import NetworkTips from "components/layout/NetworkTips";
import Retry from "components/layout/Retry";
import { InternetContext } from "store/InternetContext";
import { trackFeedsTabSwitchCategory } from "helper/track";

export enum ResearchLayout {
  Block,
  Table,
}

const Research = () => {
  const { userModal } = useContext(UserContext);
  const { isSubscription } = useOneSignalStore(
    useShallow((state) => ({
      isSubscription: state.isSubscription,
    }))
  );
  const { isInStandalone } = usePwaStore(({ isInStandalone }) => ({
    isInStandalone,
  }));
  const [showNotiBanner, setShowNotiBanner] = useState(false);
  const query = createBrowserQuery<{ category: string }>();
  const [category, setCategory] = useState(
    (Number(query.category) as Category) || Category.Foryou
  );
  const [search, setSearch] = useState("");
  const { t } = useTranslation(localeType.RESEARCH);
  const tabList = [
    {
      title: t("For You"),
      id: Category.Foryou,
      key:"For You"
    },
    {
      title: (
        <span suppressHydrationWarning className="flex items-center">
          {t("News")}
          <span
            suppressHydrationWarning
            className={`ml-2 px-2 h-6 font-normal  text-xs border border-solid rounded-lg flex items-center justify-center  ${
              category == Category.News
                ? " text-white bg-accent-600 border-accent-600 "
                : "text-[#404040]  bg-[#FAFAFA]  border-[#E5E5E5]"
            }`}
          >
            <span>24h</span>
          </span>
        </span>
      ),
      id: Category.News,
      key:"News"
    },
    {
      title: t("Institution"),
      id: Category.Institution,
      key:"Institution"
    },
    {
      title: t("Insights"),
      id: Category.Insights,
      key:"Insights"
    },
    {
      title: t("Research"),
      id: Category.Research,
      key:"Research"
    },
    {
      title: t("Onchain"),
      id: Category.Onchain,
      key:"Onchain"
    },
  ];
  const categoryConfig = useMemo(
    () => ({
      isForyou: category === Category.Foryou,
      isResearch: category === Category.Research,
      isNews: category === Category.News,
      isInstitution: category === Category.Institution,
      isInsights: category === Category.Insights,
      isSoSoReports: category === Category.SoSoReports,
      isOnchain: category === Category.Onchain,
      isTech: category === Category.Tech,
      isProjectUpdate: category === Category.ProjectUpdate,
    }),
    [category]
  );
  const categoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setCategory(newValue);
  };
  const closeNotiBanner = () => {
    setShowNotiBanner(false);
    setIsShowNotiBanner({ value: false, time: dayjs().valueOf() });
  };
  useEffect(() => {
    // if (isInStandaloneMode() && typeof getIsAllowNotify() !== "boolean") {
    //   userModal?.notifyPermission.open();
    // }
    const isShowNotiBanner = getIsShowNotiBanner();
    if (
      !isShowNotiBanner ||
      dayjs().subtract(3, "day").isAfter(dayjs(isShowNotiBanner.time))
    ) {
      setShowNotiBanner(true);
    }
  }, []);
  
  const {
    online,
    onRequestTimeout,
    requestTimeoutFlag,
    manualRetryFlag,
    setManualRetryFlag,
  } = useRequestError();

  const retryHandler = () => {
    onRequestTimeout(false, true);
  }

  return (
    <NavigateWrap isFullH={!online || requestTimeoutFlag || !manualRetryFlag}>
      <SEO
        config={{
          title:
            "Crypto Market Topics, Research and Hot News for You | SoSoValue Feeds",
          description:
            "SoSoValue Feeds helps you sort out and analyze 24/7 real-time news on the cryptocurrency market. Track hot cryptocurrency topics and institution & influencer trends. Waiting for your feedback",
        }}
      />
      <div
        className="flex flex-col items-stretch overflow-hidden fixed top-0 left-0 right-0 bottom-0"
        suppressHydrationWarning
      >
        <NetworkTips />
        <Header />
        {showNotiBanner && !isSubscription && isInStandalone && (
          <div className="flex items-center justify-between px-4 py-3 bg-hover-50-700">
            <div className="flex items-center">
              <Warning className=" text-primary-800-50" />
              <div className="flex flex-col ml-4">
                <span className="text-base font-bold text-primary-900-White">
                  {t("Never miss out!")}
                </span>
                <span className="text-xs text-primary-900-White">
                  {t("Allow notifications")}
                </span>
              </div>
            </div>
            <div>
              <Button
                onClick={() => userModal?.notifyPermission.open()}
                className="text-xs bg-primary text-white font-bold normal-case h-8 mr-2"
              >
                {t("Open Push")}
              </Button>
              <IconButton
                className="text-primary-900-White"
                onClick={closeNotiBanner}
              >
                <CloseRoundedIcon />
              </IconButton>
            </div>
          </div>
        )}

        <div className="px-4 border-0 border-b border-solid border-primary-100-700">
          <Tabs
            suppressHydrationWarning
            value={category}
            onChange={categoryChange}
            classes={{
              scroller: "!overflow-x-auto hide-scrollbar",
            }}
            className="h-12"
          >
            {tabList.map(({ title, id,key}) => (
              <Tab
                key={id}
                suppressHydrationWarning
                onClick={()=>trackFeedsTabSwitchCategory(key,id)}
                label={title}
                value={id}
                classes={{ selected: "!text-accent-600" }}
                className="text-sm text-primary-900-White font-semibold px-4 min-w-0 normal-case"
              />
            ))}
          </Tabs>
        </div>
        <Retry
          requestTimeoutFlag={requestTimeoutFlag}
          retryHandler={retryHandler}
          manualRetryFlag={manualRetryFlag}
          setManualRetryFlag={setManualRetryFlag}
        >
          <InternetContext.Provider
            value={{
              onRequestTimeout,
            }}
          >
            {categoryConfig.isForyou ? (
              <Foryou
                categoryConfig={categoryConfig}
                categoryChange={(category: number) => setCategory(category)}
              />
            ) : (
              <FilterResearch
                category={category}
                categoryConfig={categoryConfig}
              />
            )}
          </InternetContext.Provider>
        </Retry>
      </div>
    </NavigateWrap>
  );
};

export default Research;

export async function getStaticProps({
  locale,
  params,
  ...rest
}: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "research",
      ])),
      // Will be passed to the page component as props
    },
  };
}
