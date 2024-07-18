import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getChartDatas } from "http/home";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useIsomorphicLayoutEffect } from "ahooks";
// import BigChart from "components/operation/etf/BigChart";
// import { ButtonBase, IconButton } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import ArrowLeft from "components/icons/arrow-left.svg";
// import AddIcon from "components/svg/AddIcon";
// import ArrowIcon from "components/svg/Arrow";
import SEO from "components/operation/SEO";
import ChartDetail from "components/operation/etf/ChartDetail";

const Exchange = () => {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const lang = router.locale as string;
  const [data, setData] = useState<any>();
  const [defaultSeries, setDefaultSeries] = useState<string[]>([]);
  const [coin, setCoin] = useState<string>();
  const names = [
    "PremDsc",
    "1DNetInflow",
    "CumNetInflow",
    "NetAssets",
    "NetAssetsChange",
    "MktPrice",
    "VolTraded",
    // "DailyVol",
  ];

  const mktNames = [
    "premDsc",
    "mktPrice",
    "volume",
    "dailyVol",
    "turnoverRate",
  ];

  const tabulateNames = [
    "premDsc",
    "oneDNewShares",
    "totalShares",
    "netInflow",
    "cumNetInflow",
    "totalNav",
    "volume",
    "turnoverRate",
  ];

  const getInitData = async (nameList: string[], type?: number) => {
    const { data } = await getChartDatas({
      nameList: nameList,
    });
    const sortedNames: any = {};
    nameList.forEach((name) => {
      if (data[name] !== undefined) {
        sortedNames[name] = data[name];
      }
    });

    const dataArr = [];
    for (const key in sortedNames) {
      dataArr.push({
        data: JSON.parse(sortedNames[key]),
        name: key,
      });
    }
    const tempData = {
      charValue:
        type === 1
          ? [router.query.coin === "BTC" ? "BTCPrice" : "ETHPrice", ...mktNames]
          : type === 2
          ? [
              router.query.coin === "BTC" ? "BTCPrice" : "ETHPrice",
              ...tabulateNames,
            ]
          : ["BTCPrice", ...names],
      data: dataArr,
      title: router.query.title,
      meaning: "null",
      innerKey: router.query.currency,
      period: "1d",
      switchCharts: [],
      chartPeriods: ["7d", "30d", "Max"],
    };

    setData(tempData as API.ChartType);
  };

  const back = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/?category=ETF");
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (router.query.currency && router.query.title) {
      const type = Number(router.query.type);
      const coin = String(router.query.coin);
      const query = router.query.currency;
      const nameList = (
        type === 1 ? mktNames : type === 2 ? tabulateNames : names
      ).map((i) => query + "_" + i);
      const nameLists = type
        ? [
            coin === "ETH" ? "etf_eth_daily_amount" : "AHR999_Indicator_value",
            ...nameList,
          ]
        : [
            coin === "ETH" ? "etf_eth_daily_amount" : "AHR999_Indicator_value",
            ...nameList,
          ];
      setCoin(coin || "BTC");
      setDefaultSeries(
        [1, 2].includes(type)
          ? ["BTCPrice", "ETHPrice", "premDsc"]
          : ["BTCPrice", "1DNetInflow"]
      );
      getInitData(nameLists, type);
    }
  }, [router.query]);
  const option = {
    params: [
      {
        name: "Fund flow",
        color: `white`,
        height: "8px",
        series: {
          type: "bar",
        },
      },
      {
        chartName: "Etf_btc_Total_Net_Assets_Value",
        name: "Total Net Assets Value",
        series: {
          type: "line",
        },
      },
    ],
    grid: {
      left: "80px",
      top: "20px",
      bottom: "45px",
      right: "45px",
    },
    yAxis: [
      {
        type: "value",
        name: "",
        position: "left",
        axisLabel: {
          show: true,
          fontSize: 12,
          fontFamily: "JetBrains Mono",
          formatter: function (value: number, index: number) {
            if (value >= 1000000000000) {
              return value / 1000000000000 + "T";
            } else if (value >= 1000000000) {
              return value / 1000000000 + "B";
            } else if (value >= 1000000) {
              return value / 1000000 + "M";
            } else if (value >= 1000) {
              return value / 1000 + "K";
            } else if (value <= -1000000000000) {
              return value / 1000000000000 + "T";
            } else if (value <= -1000000000) {
              return value / 1000000000 + "B";
            } else if (value <= -1000000) {
              return value / 1000000 + "M";
            } else if (value <= -1000) {
              return value / 1000 + "K";
            } else {
              return value;
            }
          },
        },
        splitLine: {
          lineStyle: {},
        },
      },
    ],
    showDataZoom: true,
    transferMoney: true,
  };
  const seoConfig = useMemo(() => {
    const configMap: Record<string, { title: string; description: string }> = {
      Etf_CBOE_FBTC: {
        title:
          "SoSoValue ETF Fidelity(FBTC) Chart | Free Bitcoin ETF Data and Market News Platform	",
        description: `Here's SoSoValue ETF Fidelity(FBTC) Chart. dive into the data and changes of ETF Fidelity(FBTC) NetIfFlow, NetAssets, market price and value traded.`,
      },
      Etf_CBOE_HODL: {
        title:
          "SoSoValue ETF VanEck(HODL) Chart | Free Bitcoin ETF Data and Market News Platform	",
        description: `Here's SoSoValue ETF VanEck(HODL) Chart. dive into the data and changes of ETF VanEck(HODL) NetIfFlow, NetAssets, market price and value traded.`,
      },
      Etf_NASDAQ_IBIT: {
        title:
          "SoSoValue ETF BlackRock (IBIT) Chart | Free Bitcoin ETF Data and Market News Platform	",
        description: `Here's SoSoValue ETF BlackRock (IBIT) Chart. dive into the data and changes of ETF BlackRock (IBIT) NetIfFlow, NetAssets, market price and value traded.`,
      },
      Etf_NYSE_GBTC: {
        title:
          "SoSoValue ETF GrayscaleInvestments(GBTC) Chart | Free Bitcoin ETF Data and Market News Platform	",
        description: `Here's SoSoValue ETF GrayscaleInvestments(GBTC) Chart. dive into the data and changes of ETF GrayscaleInvestments(GBTC) NetIfFlow, NetAssets, market price and value traded.`,
      },
    };
    return (
      configMap[router.query.currency as string] || {
        title:
          "Free Bitcoin ETF Inflow Data and Value Traded | SoSoValue ETF Dashboard	",
        description:
          "Here's SoSoValue free dashboard for Bitcoin ETF data. Dive to the daily net inflow, trading volume, and net assets of Fidelity, BlackRock, and other ETFs. Newest ETF analysis for you.",
      }
    );
  }, [router.query.currency]);

  return (
    <div className="h-full overflow-auto bg-background-primary-White-900">
      <SEO config={seoConfig} />
      <header className="header-base text-center relative">
        <ButtonBase
          onClick={back}
          className="svg-icon-base text-primary-800-50 absolute left-4 top-2"
        >
          <ArrowLeft />
        </ButtonBase>
        <span className="h-9 inline-flex items-center text-base font-bold">
          {router.query.ticker}
          {router.query.title}
        </span>
      </header>
      {data && (
        <ChartDetail
          coin={coin}
          data={data}
          option={option}
          defaultSeries={defaultSeries}
        />
      )}
    </div>
  );
};

export default Exchange;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "dashboard",
        "home",
        "indicators",
        "etf",
      ])),
      // Will be passed to the page component as props
    },
  };
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // false or "blocking"
  };
};
