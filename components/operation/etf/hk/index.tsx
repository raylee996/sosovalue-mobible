import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useRequest } from "ahooks";
import { getSymbolByCurrency, objectSort, transferMoney } from "helper/tools";
import ColSorter from "components/base/ColSorter";
import PctFade from "components/base/PctFade";
import Table, { Col } from "components/base/Table";
import { useHkTickerWSData } from "store/WSStore/useHkTickerWSData";

import Tabs from "../Tabs";
import { fetchInflow } from "../inflow/fetchInflow";
import InflowChart from "../inflow/InflowChart";
import News from "../news/News";
import { handleSort } from "../utils/handleSort";

import { getAllSymbol } from "./getAllSymbol";
import { getTabulate } from "./getTabulate";
import { fetchPrem } from "./fetchPrem";
import { getSocketPrice } from "./getSocketPrice";
import PremDscChart from "./PremDscChart";
import HKBanner from "./HKBanner";
import { ETFTab } from "..";
import ScaleLoader from "components/base/ScaleLoader";

const newsTab = [
  {
    title: "ETF News",
    categoryList: [1, 7],
  },
];

const loading = (
  <div className="flex items-center justify-center py-5">
    <ScaleLoader />
  </div>
);

type Info = Omit<Awaited<ReturnType<typeof getAllSymbol>>, "initData">;

const Index = (props: { type: ETFTab; nameList: string[] }) => {
  const { type, nameList } = props;
  const router = useRouter();
  const { t } = useTranslation(["etf"]);
  const [activeChart, setActiveChart] = useState("netInflow");
  const [top, setTop] = useState<API.hkEtfList>();
  const [info, setInfo] = useState<Info>();
  const [tabulate, setTabulate] = useState<ReturnType<typeof getTabulate>>();
  const { priceData, subscribe } = useHkTickerWSData();

  const { data: premRes, loading: premLoading } = useRequest(() =>
    fetchPrem(type, router.locale!)
  );
  const { data: inflowData, loading: inflowLoading } = useRequest(() =>
    fetchInflow(type, nameList)
  );
  const [initData, setInitData] = useState<API.hkEtfList[]>([]);

  const [tabulateList, setTabulateList] = useState<API.hkEtfList[]>([]);
  const [tabulateSort, setTabulateSort] = useState({
    key: "totalNav",
    order: "DESC",
  });

  const [marketList, setMarketList] = useState<API.hkEtfList[]>([]);
  const [marketSort, setMarketSort] = useState({
    key: "turnover",
    order: "DESC",
  });

  useEffect(() => {
    getAllSymbol({ type }).then(({ initData, ...rest }) => {
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

  // top 更新
  useEffect(() => {
    const topData = JSON.parse(JSON.stringify(initData));
    topData.sort(objectSort("premDsc", "DESC"));
    setTop(topData[0]);
  }, [initData]);

  // 统计表格更新
  useEffect(() => {
    const tabulateRes = getTabulate(JSON.parse(JSON.stringify(initData)));
    setTabulate(tabulateRes);
    const tabulateListDraft = tabulateRes.filterData;
    tabulateListDraft.sort(objectSort(tabulateSort.key, tabulateSort.order));
    setTabulateList(tabulateListDraft);
  }, [initData, tabulateSort]);

  // 统计表格排序
  const handleTabulateSort = (key: string) => {
    const { sortKey, sort } = handleSort(key, {
      initData: tabulateList,
      currentSort: tabulateSort.order,
      currentSortKey: tabulateSort.key,
      defaultSortKey: "totalNav",
    });
    setTabulateSort({ key: sortKey, order: sort });
  };

  // market 更新
  useEffect(() => {
    const marketListDraft = JSON.parse(JSON.stringify(initData));
    marketListDraft.sort(objectSort(marketSort.key, marketSort.order));
    setMarketList(marketListDraft);
  }, [initData, marketSort]);

  // market 排序
  const handleMarketSort = (key: string) => {
    const { sortKey, sort } = handleSort(key, {
      initData: marketList,
      currentSort: marketSort.order,
      currentSortKey: marketSort.key,
      defaultSortKey: "turnover",
    });
    setMarketSort({ key: sortKey, order: sort });
  };

  if (!info || !tabulate) {
    return loading;
  }

  const {
    netInflowTime,
    cumNetInflowTime,
    volumeTime,
    totalNavTime,
    premDscTime,
  } = info;

  const { netInflow, cumNetInflow, totalVolume, netAssets, netAssetsChange } =
    tabulate;

  const getTimeInfo = (timeStr: String) => {
    return (
      timeStr && `${t("As of")}${timeStr.slice(5, 7)}/${timeStr.slice(8, 10)}`
    );
  };

  const handleRowClick = (
    { exchangeName, ticker, inst }: any,
    prefix: string
  ) => {
    const coin = type === ETFTab.HKBTCSpot ? "btc" : "eth";
    const params: Record<string, string> = {
      title: `${inst}(${ticker})`,
      type: prefix,
      coin: coin.toUpperCase(),
      ticker,
    };
    const query = new URLSearchParams(params).toString();
    const currency =
      prefix === "1"
        ? `Etf_hk_${coin}_${exchangeName}_${ticker}`
        : `Etf_tabulate_hk_${coin}_${exchangeName}`;
    router.push(`/bigChart/${currency}?${query}`);
  };

  const tabulateCols: Col[] = [
    {
      dataIndex: "totalNav",
      title: (
        <>
          {`${t("Inst.")}/${t("NetAssets")}`}
          <ColSorter
            sort={tabulateSort.key === "totalNav" && tabulateSort.order}
          />
        </>
      ),
      render: (totalNav, item, index) => {
        return (
          <div className="my-2.5">
            <div className="text-sm font-bold leading-5">{item.inst}</div>
            {!totalNav && totalNav != 0 ? (
              <span className="text-secondary-500-300 text-xs font-normal leading-4 italic">
                Not updated
              </span>
            ) : (
              <span className="text-secondary-500-300 text-xs font-normal leading-4">
                {"$" + transferMoney(+totalNav)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "netInflow",
      title: (
        <>
          <div className="inline-flex flex-col items-start">
            <span>
              {type === ETFTab.HKBTCSpot ? t("1DBTCInflow") : t("1DETHInflow")}
            </span>
            <span className="font-normal leading-4">
              {getTimeInfo(netInflowTime)}
            </span>
          </div>
          <ColSorter
            sort={tabulateSort.key === "netInflow" && tabulateSort.order}
          />
        </>
      ),
      render: (netInflow, record, index) => {
        return (
          <div className="text-right text-sm">
            {!netInflow && netInflow != 0 ? (
              <span className="italic">Not updated</span>
            ) : (
              <span
                className={`${
                  +netInflow > 0
                    ? "text-success-600-500"
                    : +netInflow < 0
                    ? "text-error-600-500"
                    : ""
                }`}
              >
                {transferMoney(+netInflow)}
              </span>
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
          <ColSorter
            sort={tabulateSort.key === "premDsc" && tabulateSort.order}
          />
        </>
      ),
      render: (premDsc, record, index) => {
        return (
          <div className="text-right text-sm">
            {!premDsc && premDsc != 0 ? (
              <span className="italic">Not updated</span>
            ) : (
              <PctFade pct={premDsc} />
            )}
          </div>
        );
      },
    },
  ];

  const marketCol: Col[] = [
    {
      dataIndex: "turnover",
      title: (
        <>
          {`${t("Inst.")}/${t("VolTraded")}`}
          <ColSorter sort={marketSort.key === "turnover" && marketSort.order} />
        </>
      ),
      render: (turnover, item, index) => {
        return (
          <div className="my-2.5">
            <div className="text-sm font-bold leading-5">
              {item.inst}({item.fiatMoney})
            </div>
            {!turnover && turnover != 0 ? (
              <span className="text-secondary-500-300 text-xs font-normal leading-4 italic">
                Not updated
              </span>
            ) : (
              <span className="text-secondary-500-300 text-xs font-normal leading-4">
                {"$" + transferMoney(+turnover)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "lastPrice",
      title: (
        <>
          {t("Mktprice")}
          <ColSorter
            sort={marketSort.key === "lastPrice" && marketSort.order}
          />
        </>
      ),
      render: (lastPrice, item, index) => {
        return (
          <div className="text-right text-sm leading-5">
            {!lastPrice && lastPrice != 0 ? (
              <span className="italic">Not updated</span>
            ) : (
              <span className="font-bold">
                {getSymbolByCurrency(item.fiatMoney) +
                  transferMoney(+lastPrice)}
              </span>
            )}
            <div className="text-xs font-normal leading-4">
              {!item.dailyChg && item.dailyChg != 0 ? (
                <span className="italic">Not updated</span>
              ) : (
                <PctFade pct={item.dailyChg} multiples={100} />
              )}
            </div>
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
          <ColSorter sort={marketSort.key === "premDsc" && marketSort.order} />
        </>
      ),
      render: (premDsc, record, index) => {
        return (
          <div className="text-right text-sm">
            {!premDsc && premDsc != 0 ? (
              <span className="italic">Not updated</span>
            ) : (
              <PctFade pct={premDsc} />
            )}
          </div>
        );
      },
    },
  ];

  const chartItems = [
    {
      key: "netInflow",
      label: t("Net Inflow"),
      children: (
        <>
          {inflowData ? (
            <InflowChart formatedETFData={inflowData} />
          ) : (
            inflowLoading && loading
          )}
        </>
      ),
    },
    {
      key: "prem",
      label: t("Prem./Dsc."),
      children: (
        <>{premRes ? <PremDscChart {...premRes} /> : premLoading && loading}</>
      ),
    },
  ];

  return (
    <div className="pt-4">
      <HKBanner
        type={type}
        netInflow={netInflow}
        netInflowTime={netInflowTime}
        cumNetInflow={cumNetInflow}
        cumNetInflowTime={cumNetInflowTime}
        totalVolume={totalVolume}
        volumeTime={volumeTime}
        netAssets={netAssets}
        netAssetsChange={netAssetsChange}
        totalNavTime={totalNavTime}
        top={top}
      />

      <div className="mt-4 p-4 rounded-xl shadow border-primary-100-700 border border-solid">
        <div className="h-9">
          <div className="text-base font-bold leading-7 whitespace-nowrap">
            {type === ETFTab.HKBTCSpot
              ? t("Total HK BTC Spot ETF BTC Inflow")
              : t("Total HK ETH Spot ETF ETH Inflow")}
          </div>
        </div>
        <Tabs
          activeKey={activeChart}
          onChange={(key) => setActiveChart(key)}
          items={chartItems}
        />
      </div>

      <div className="my-4 h-8 flex justify-between items-center gap-4">
        <div className="text-base font-bold leading-7 whitespace-nowrap">
          {t("Tabulate Statistics")}
        </div>
      </div>

      <Table
        rowKey="inst"
        columns={tabulateCols}
        dataSource={tabulateList}
        thRender={(col, i) => (
          <div
            className={`text-secondary-500-300 text-xs font-bold leading-5 h-11 flex justify-start items-center gap-1 ${
              !i ? "float-left" : "float-right"
            }`}
            onClick={() => handleTabulateSort(col.dataIndex)}
          >
            {col.title}
          </div>
        )}
        onRowClick={(row) => handleRowClick(row, "2")}
      />

      <div className="my-4 h-8 flex justify-between items-center gap-4">
        <div className="text-base font-bold leading-7 whitespace-nowrap">
          {t("Market Data")}
        </div>
      </div>

      <Table
        rowKey="id"
        columns={marketCol}
        dataSource={marketList}
        thRender={(col, i) => (
          <div
            className={`text-secondary-500-300 text-xs font-bold leading-5 h-11 flex justify-start items-center gap-1 ${
              !i ? "float-left" : "float-right"
            }`}
            onClick={() => handleMarketSort(col.dataIndex)}
          >
            {col.title}
          </div>
        )}
        onRowClick={(row) => handleRowClick(row, "1")}
      />

      <News tab={newsTab} showTopic={false} />
    </div>
  );
};

export default Index;
