import { useEffect, useRef, useState } from "react";
import NavigateWrap from "components/layout/NavigateWrap";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@mui/material";

import { useTranslation } from "next-i18next";
import CustomTip from "components/base/CustomTip";
import Header from "components/header";
import ETF from "components/operation/etf/index";
import { localeType } from "store/ThemeStore";

import Loading, { LoadingType } from "components/operation/OptLoading";

import { useNetwork } from "hooks/useNetwork";
import SEO from "components/operation/SEO";

import FixSafariVHDIV from "components/base/FixSafariVHDIV";
import { useRouter } from "next/router";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { trackMarketTabSwitch } from "helper/track";
import { EtfExportScrollStore } from "store/EtfExportScrollStore";

const USBTCSpot = () => {
  const { t } = useTranslation([localeType.HOME, localeType.COMMON]); // 有坑 🕳️
  const { t: tCommon } = useTranslation([localeType.COMMON]);
  const router = useRouter();
  const tabs: { title: string; tip?: string; link?: string }[] = [
    {
      title: "Market",
      link: "/",
    },
    {
      title: "ETF",
      link: "/assets/etf/us-btc-spot",
    },
    {
      title: "Index",
      tip: t("see to pc") as string,
    },
    {
      title: "DEX Pool",
      tip: t("see to pc") as string,
    },
    // {
    //   title: "NFT",
    // },
    {
      title: "RWA",
    },
    {
      title: "Fundraising",
    },
  ];

  const [currentTab, setCurrentTab] = useState<number>(1);
  const networkState = useNetwork();
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<LoadingType>(0);

  const handleTabToggle = (index: number,title?:string) => {
    title&&trackMarketTabSwitch(title);
    if (index < 2) {
      setCurrentTab(index);
      router.push(tabs[index].link || "/");
    }
  };

  useEffect(() => {
    if (!networkState.online) {
      setLoadingType(3);
      setLoading(true);
    }
  }, [networkState]);
  const scrollRef = useRef<HTMLDivElement>(null);
  useTgMobileRepairer(() => scrollRef.current!);

  return (
    <NavigateWrap>
      <SEO
        config={{
          title:
            "SoSoValue | Free Platform for Cryptocurrency Prices, ETFs and Market News",
          description:
            "Welcome to SoSoValue - free cryptocurrency trading data platform. Dive into real-time prices, ETFs inflow and trends within Web 3.0 by SoSoValue crypto dashboard and data charts.",
        }}
      />
      {loading && <Loading type={loadingType} />}
      <FixSafariVHDIV>
        <div className="h-full w-full overflow-x-hidden overflow-y-auto" ref={scrollRef}>
          <Header />
          <div className="w-full overflow-x-auto hide-scrollbar whitespace-nowrap border-0 border-b border-solid border-primary-100-700">
            {tabs.map((item, index) => (
              <CustomTip
                key={index}
                disabled={index < 2}
                title={item?.tip || tCommon("Coming soon")}
              >
                <Button
                  variant="text"
                  className={`normal-case text-sm h-full mx-4 min-w-0 px-0 py-3 rounded-none ${
                    currentTab === index
                      ? "border-0 border-b-2 border-solid border-accent-600 !text-accent-600"
                      : ""
                  } ${
                    index < 2 && currentTab !== index
                      ? " text-primary-900-White"
                      : " text-placeholder-400-300"
                  } `}
                  onClick={() => handleTabToggle(index,item.title)}
                >
                  {t(item.title)}
                </Button>
              </CustomTip>
            ))}
          </div>
          <div>
            
            <EtfExportScrollStore.Provider value={scrollRef} >
              <ETF page={1} />
            </EtfExportScrollStore.Provider>
            <div className="h-[55px]" />
          </div>
        </div>
      </FixSafariVHDIV>
    </NavigateWrap>
  );
};

export default USBTCSpot;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "home", "etf"])),
      // Will be passed to the page component as props
    },
  };
}
