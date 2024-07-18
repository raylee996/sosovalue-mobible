import React, { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import ScaleLoader from "components/base/ScaleLoader";
import { useTranslation } from "next-i18next";
import { transferMoney } from "helper/tools";

import Table, { Col } from "components/base/Table";
import ColSorter from "components/base/ColSorter";
import PctFade from "components/base/PctFade";
import { useTickerWSData } from "store/WSStore/useTickerWSData";

import { getSocketPrice } from "./utils/getSocketPrice";
import { getAllSymbol } from "./utils/getAllSymbol";
import { handleSort } from "./utils/handleSort";

import { fetchInflow } from "./inflow/fetchInflow";
import InflowChart from "./inflow/InflowChart";
import News from "./news/News";

import USBanner from "./USBanner";
import { ETFTab } from ".";

const loading = (
  <div className="flex items-center justify-center py-5">
    <ScaleLoader />
  </div>
);

const newsTab = [
  {
    title: "ETF News",
    categoryList: [1, 7],
  },
];

interface Props {
  type: ETFTab;
  nameList: string[];
}

type Info = Omit<Awaited<ReturnType<typeof getAllSymbol>>, "initData">;

const Index = (props: Props) => {
  const { type, nameList } = props;
  const router = useRouter();
  const { t } = useTranslation(["etf", "common"]);
  const [initData, setInitData] = useState<API.etfList[]>([]);
  const [currentSort, setCurrentSort] = useState("DESC");
  const [currentSortKey, setCurrentSortKey] = useState("totalNav");
  const [info, setInfo] = useState<Info>();
  const { priceData, subscribe } = useTickerWSData();

  const { data: inflowData, loading: inflowLoading } = useRequest(() =>
    fetchInflow(type, nameList)
  );

  useEffect(() => {
    getAllSymbol().then(({ initData, ...rest }) => {
      setInitData(initData);
      setInfo(rest);
      subscribe([]); // WS
    });
  }, []);

  useEffect(() => {
    if (priceData) {
      setInitData((prev) => getSocketPrice(prev, priceData));
    }
  }, [priceData]);

  const handleColSort = (key: string) => {
    const res = handleSort(key, {
      initData,
      currentSort,
      currentSortKey,
      defaultSortKey: "totalNav",
    });
    setCurrentSort(res.sort);
    setCurrentSortKey(res.sortKey);
    setInitData(res.sortRes);
  };

  const getTimeInfo = (timeStr: String) => {
    return (
      timeStr && `${t("As of")}${timeStr.slice(5, 7)}/${timeStr.slice(8, 10)}`
    );
  };

  if (!info) {
    return (
      <div className="flex items-center justify-center py-5">
        <ScaleLoader />
      </div>
    );
  }

  const {
    netInflowTime,
    totalVolume,
    volumeTime,
    totalNetInflow,
    lastNetInflow,
    cumNetInflowTime,
    totalNavTime,
    totalNetAssets,
    totalNetAssetsChange,
    premDscTime,
  } = info;

  const marketCols: Col[] = [
    {
      dataIndex: "totalNav",
      title: (
        <>
          {t("NetAssets")}
          <ColSorter sort={currentSortKey === "totalNav" && currentSort} />
        </>
      ),
      render: (totalNav, item, index) => {
        return (
          <div className="my-2.5">
            <div className="text-sm font-bold leading-5">{item.ticker}</div>
            {!item.totalNav && (
              <div className="text-secondary-500-300 text-xs font-normal leading-4">
                {"$" + transferMoney(+item.totalNavLast)}
              </div>
            )}
            {item.totalNav && (
              <div className="text-secondary-500-300 text-xs font-normal leading-4">
                ${transferMoney(+item.totalNav)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "mktPrice",
      title: (
        <>
          {t("Price")}
          <ColSorter sort={currentSortKey === "mktPrice" && currentSort} />
        </>
      ),
      render: (totalNav, item, index) => {
        return (
          <div className="text-right">
            <div className="text-sm leading-5">
              {!item.mktPrice && item.mktPrice != 0 ? (
                <span className="italic">Not updated</span>
              ) : (
                <span className="font-bold">
                  {"$" + transferMoney(+item.mktPrice)}
                </span>
              )}
            </div>
            <div className="text-xs font-normal leading-4">
              <PctFade pct={item.dailyChange} />
            </div>
          </div>
        );
      },
    },
    {
      dataIndex: "netInflow",
      title: (
        <>
          <div className="inline-flex flex-col items-start">
            <span>{t("NetInflow")}</span>
            <span className="font-normal leading-4">
              {getTimeInfo(netInflowTime)}
            </span>
          </div>
          <ColSorter sort={currentSortKey === "netInflow" && currentSort} />
        </>
      ),
      render: (totalNav, item, index) => {
        return (
          <div className="text-right text-sm">
            {Boolean(!item.netInflow && +item.netInflow !== 0) && (
              <span className="italic">Not updated</span>
            )}
            {+item.netInflow > 0 && (
              <span className="text-success-600-500">
                {"$" + transferMoney(Math.abs(+item.netInflow), 2)}
              </span>
            )}
            {+item.netInflow < 0 && (
              <span className="text-error-600-500">
                {"-$" + transferMoney(Math.abs(+item.netInflow), 2)}
              </span>
            )}
            {+item.netInflow === 0 && (
              <span>{"$" + transferMoney(Math.abs(+item.netInflow), 2)}</span>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "premDsc",
      title: (
        <>
          <div className="inline-flex flex-col items-start">
            <span>{t("Prem./Dsc.")}</span>
            <span className="font-normal leading-4">
              {getTimeInfo(premDscTime)}
            </span>
          </div>
          <ColSorter sort={currentSortKey === "premDsc" && currentSort} />
        </>
      ),
      render: (totalNav, item, index) => {
        return (
          <div className="text-right text-sm">
            {Boolean(!item.premDsc && +item.premDsc !== 0) ? (
              <span className="italic">
                {(+item.premDscLast).toFixed(2) + "%"}
              </span>
            ) : (
              <PctFade pct={item.premDsc} />
            )}
          </div>
        );
      },
    },
  ];

  const handleRowClick = ({ exchangeName, ticker, inst }: any) => {
    router.push(
      `/bigChart/Etf_${exchangeName}_${ticker}?title=${inst}(${ticker})&&ticker=${ticker}`
    );
  };

  return (
    <div className="pt-4">
      <USBanner
        netInflowTime={netInflowTime}
        totalVolume={totalVolume}
        volumeTime={volumeTime}
        totalNetInflow={totalNetInflow}
        lastNetInflow={lastNetInflow}
        cumNetInflowTime={cumNetInflowTime}
        totalNavTime={totalNavTime}
        totalNetAssets={totalNetAssets}
        totalNetAssetsChange={totalNetAssetsChange}
      />
      <div className="mt-4 p-4 rounded-xl shadow border-primary-100-700 border border-solid">
        <div className="text-base font-bold leading-7">
          {t("Total Bitcoin Spot ETF Fund Flow")}
        </div>
        {inflowData ? (
          <InflowChart formatedETFData={inflowData} />
        ) : (
          inflowLoading && loading
        )}
      </div>
      <div className="my-4 h-8 flex justify-between items-center gap-4">
        <div className="text-base font-bold leading-7 whitespace-nowrap">
          {t("Market Data")}
        </div>
        {/* <Tabs
          activeKey="a"
          items={[
            { key: 'a', label: 'Net Assets' },
            { key: 'b', label: 'Top Gainers' },
          ]}
        /> */}
      </div>
      <Table
        rowKey="inst"
        columns={marketCols}
        dataSource={initData}
        thRender={(col, i) => (
          <div
            className={`text-secondary-500-300 text-xs font-bold leading-5 h-11 flex justify-start items-center gap-1 ${
              !i ? "float-left" : "float-right"
            }`}
            onClick={() => handleColSort(col.dataIndex)}
          >
            {col.title}
          </div>
        )}
        onRowClick={(row) => handleRowClick(row)}
      />
      <News tab={newsTab} showTopic={false} />
    </div>
  );
};

export default Index;
