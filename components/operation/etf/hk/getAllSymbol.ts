import dayjs from "dayjs";
import { objectSort, transferMoney } from "helper/tools";
import { getHistory } from "http/etf";
import { getFindHkLastList, getHkList } from "http/hketf";

interface Props {
  type: number
}

const fetchSymbol = async ({ type }: Props) => {
  const [{ data }, { data: lastData }, { data: historyData }] = await Promise.all([
    getHkList({
      isListing: 1,
      status: 1,
      type,
      orderItems: [{ asc: true, column: "sort" }],
    }),
    getFindHkLastList({ type, isListing: 1, status: 1 }),
    getHistory({
      orderItems: [{ asc: false, column: "data_date" }],
      pageNum: 1,
      type,
      pageSize: 1000,
    }),
  ]);
  return { data, lastData, historyData }
}

const pickTimeInfo = (lastData: Record<string, any>) => {
  const pick = (k: string) => (lastData && lastData[k]) ? Object.keys(lastData[k])[0] : ''
  return {
    newShareTime: pick('newSharesMap'),
    totalShareTime: pick('totalSharesMap'),
    netInflowTime: pick('netInflowMap'),
    cumNetInflowTime: pick('cumNetInflowMap'),
    totalNavTime: pick('totalNavMap'),
    volumeTime: pick('volumeTradedMap'),
    premDscTime: pick('premDscMap'),
  }
}

// FIXME: 复制过来的，不要格式化，重构优先级 1
export const getAllSymbol = async ({ type }: { type: number }) => {
  const { data, lastData: lastDataRes, historyData } = await fetchSymbol({ type })
  const lastData = lastDataRes[0]

  let totalNetInflow = 0;
  let totalNetInflowInCash = 0;
  let totalNetInflowInKind = 0;
  // let totalVolume = 0;
  let totalNetAssets = 0;
  let totalCumNetInflow = 0;
  let cumNetInflowInCash = 0;
  let cumNetInflowInKind = 0;
  let totalNetAssetsChange = 0;
  let totalValueTraded = 0;
  // let { data } = await getList({
  //   isListing: 1,
  //   status: 1,
  //   orderItems: [{ asc: true, column: "sort" }],
  // });
  const nonData: any = [];
  const sortData: any = [];
  data.map((item: any) => {
    if (item["totalNav"] == null || item["totalNav"] == "-") {
      nonData.push(item);
    }
    if (item["totalNav"] != null) {
      sortData.push(item);
    }
  });
  let noneData = nonData.filter(
    (item: any) =>
      item["totalNav"] == "-" ||
      item["totalNav"] == "NaN" ||
      item["totalNav"] == null
  );
  let initData = sortData.filter(
    (item: any) =>
      item["totalNav"] != "-" &&
      item["totalNav"] != "NaN" &&
      item["totalNav"] != null
  );

  initData.sort(objectSort("totalNav", "DESC"));
  const dataReasult = initData ? initData.concat(noneData) : noneData;
  // const res = await getFindLastList({});
  // if (lastData) {
  //   lastData.newSharesMap &&
  //     setNewShareTime(Object.keys(lastData.newSharesMap)[0]);
  //   lastData.totalSharesMap &&
  //     setTotalShareTime(Object.keys(lastData.totalSharesMap)[0]);
  //   lastData.netInflowMap &&
  //     setNetInflowTime(Object.keys(lastData.netInflowMap)[0]);
  //   lastData.cumNetInflowMap &&
  //     setCumNetInflowTime(Object.keys(lastData.cumNetInflowMap)[0]);
  //   lastData.totalNavMap &&
  //     setTotalNavTime(Object.keys(lastData.totalNavMap)[0]);
  //   lastData.volumeTradedMap &&
  //     setVolumeTime(Object.keys(lastData.volumeTradedMap)[0]);
  // }
  const middleRet = pickTimeInfo(lastData)

  let newSharesMap =
    lastData && lastData.newSharesMap[Object.keys(lastData.newSharesMap)[0]];
  let totalSharesMap =
    lastData &&
    lastData.totalSharesMap[Object.keys(lastData.totalSharesMap)[0]];
  let cumNetInflowMap =
    lastData &&
    lastData.cumNetInflowMap[Object.keys(lastData?.cumNetInflowMap)[0]];
  let netInflowMap =
    lastData && lastData.netInflowMap[Object.keys(lastData.netInflowMap)[0]];
  // let premDscMap =
  //   lastData && lastData.premDscMap[Object.keys(lastData.premDscMap)[0]];
  // let premDscMapLast =
  //   lastData &&
  //   lastData[1].premDscMap[Object.keys(lastData[1].premDscMap)[0]];
  let totalNavMap =
    lastData && lastData.totalNavMap[Object.keys(lastData.totalNavMap)[0]];
  let netAssetsChangeMap =
    lastData &&
    lastData.netAssetsChangeMap[Object.keys(lastData.netAssetsChangeMap)[0]];
  // let totalNavMapLast =
  //   lastData &&
  //   lastData[1].totalNavMap[Object.keys(lastData[1].totalNavMap)[0]];
  let volumeTradedMap =
    lastData &&
    lastData.volumeTradedMap[Object.keys(lastData.volumeTradedMap)[0]];
  // let volumeTradedMapLast =
  //   lastData &&
  //   lastData[1].volumeTradedMap[Object.keys(lastData[1].volumeTradedMap)[0]];

  // let cumNetInflowMapLast =
  //   lastData &&
  //   lastData[1].cumNetInflowMap[Object.keys(lastData[1].cumNetInflowMap)[0]];

  // let netAssetsChangeMapLast =
  //   lastData &&
  //   lastData[1].netAssetsChangeMap[
  //     Object.keys(lastData[1].netAssetsChangeMap)[0]
  //   ];

  dataReasult.map((item: any, index: number) => {
    dataReasult[index]["newShares"] =
      newSharesMap && newSharesMap[dataReasult[index]["id"]];
    dataReasult[index]["totalShares"] =
      totalSharesMap && totalSharesMap[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflow"] =
      cumNetInflowMap && cumNetInflowMap[dataReasult[index]["id"]];
    dataReasult[index]["netInflow"] =
      netInflowMap && netInflowMap[dataReasult[index]["id"]];
    dataReasult[index]["totalNav"] =
      totalNavMap && totalNavMap[dataReasult[index]["id"]];
    dataReasult[index]["netAssetsChange"] =
      netAssetsChangeMap && netAssetsChangeMap[dataReasult[index]["id"]];
    // dataReasult[index]["premDsc"] =
    //   premDscMap && premDscMap[dataReasult[index]["id"]];
    // dataReasult[index]["premDscLast"] =
    //   premDscMapLast && premDscMapLast[dataReasult[index]["id"]];

    // dataReasult[index]["totalNavLast"] =
    //   totalNavMapLast && totalNavMapLast[dataReasult[index]["id"]];
    dataReasult[index]["valueTraded"] =
      volumeTradedMap && volumeTradedMap[dataReasult[index]["id"]];
    // dataReasult[index]["volumeLast"] =
    //   volumeTradedMapLast && volumeTradedMapLast[dataReasult[index]["id"]];

    // dataReasult[index]["cumNetInflowLast"] =
    //   cumNetInflowMapLast && cumNetInflowMapLast[dataReasult[index]["id"]];

    // dataReasult[index]["netAssetsChangeLast"] =
    //   netAssetsChangeMapLast &&
    //   netAssetsChangeMapLast[dataReasult[index]["id"]];
    // if (cumNetInflowMap && cumNetInflowMap[dataReasult[index]["id"]]) {
    //   totalCumNetInflow =
    //     totalCumNetInflow + +cumNetInflowMap[dataReasult[index]["id"]];
    // }

    // if (netAssetsChangeMap[dataReasult[index]["id"]]) {
    //   totalNetAssetsChange =
    //     totalNetAssetsChange + +netAssetsChangeMap[dataReasult[index]["id"]];
    // }

    // if (
    //   netAssetsChangeMap &&
    //   netAssetsChangeMapLast &&
    //   netAssetsChangeMap[dataReasult[index]["id"]] &&
    //   netAssetsChangeMapLast[dataReasult[index]["id"]]
    // ) {
    if (volumeTradedMap[dataReasult[index]["id"]]) {
      totalValueTraded = totalValueTraded + +volumeTradedMap[dataReasult[index]["id"]];
    }
    if (netAssetsChangeMap?.[dataReasult[index]["id"]]) {
      totalNetAssetsChange = totalNetAssetsChange + +netAssetsChangeMap[dataReasult[index]["id"]];
    }
    // }
  });

  // const result = await getHistory({
  //   orderItems: [{ asc: false, column: "data_date" }],
  //   pageNum: 1,
  //   pageSize: 1000,
  // });
  let csvdata: any = [];
  let lastDayNum = 0;
  historyData.list.map((item: API.historyList) => {
    if (
      lastDayNum === 0 &&
      dayjs(item.dataDate).unix() <
        dayjs(Object.keys(lastData?.cumNetInflowMap)[0]).unix()
    ) {
      lastDayNum = item.cumNetInflow;
    }

    csvdata.push({
      dataDate: dayjs(item.dataDate).format("MMM D,YYYY"),
      cumNetInflow: item.cumNetInflow
        ? transferMoney(item.cumNetInflow)
        : "Not updated",
      cumNetInflowInCash: item.cumNetInflowInCash
        ? transferMoney(item.cumNetInflowInCash)
        : "Not updated",
      cumNetInflowInKind: item.cumNetInflowInKind
        ? transferMoney(item.cumNetInflowInKind)
        : "Not updated",
      totalNetAssets: item.totalNetAssets
        ? transferMoney(item.totalNetAssets)
        : "Not updated",
      totalNetInflow: item.totalNetInflow
        ? transferMoney(item.totalNetInflow)
        : "Not updated",
      totalNetInflowInCash: item.totalNetInflowInCash
        ? transferMoney(item.totalNetInflowInCash)
        : "Not updated",
      totalNetInflowInKind: item.totalNetInflowInKind
        ? transferMoney(item.totalNetInflowInKind)
        : "Not updated",
      totalVolume: item.totalVolume
        ? transferMoney(item.totalVolume)
        : "Not updated",
    });
  });

  const init = dataReasult.map((item: any, index: number) => {
    //let totalNav = item.totalNav ? +item.totalNav : +item.totalNavLast;
    //if (item.netInflow) totalNetInflow = totalNetInflow + +item.netInflow;

    // if (item.volume) totalVolume = totalVolume + +item.volume;
    // totalNetAssets = +totalNetAssets + +totalNav;

    return {
      id: index + 1,
      ticker: item.ticker,
      etfCoinType: item.etfCoinType,
      inst: item.inst,
      fiatMoney: item.fiatMoney,
      exchangeName: item.exchangeName,
      premDsc: item.premDsc ? item.premDsc * 100 + "" : item.premDsc,
      lastPrice: item?.lastPrice,
      turnover: item?.turnover,
      valueTraded: 0,
      volume: item.volume,
      //volumeLast: item.volumeLast,
      dailyChg: item.dailyChg,
      dailyVol: item.dailyVol,
      turnoverRate: item.turnoverRate,
      fee: item.fee * 100,
      status: item.isOpen,
      newShares: item.newShares,
      totalShares: item.totalShares,
      cumNetInflow: item.cumNetInflow,
      netInflow: item.netInflow,
      totalNav: item.totalNav,
      netAssetsChange: item.netAssetsChange,
      timestamp: item.timestamp,
      totalTurnoverRate: 0,
      // premDscLast: item.premDscLast
      //   ? item.premDscLast * 100 + ""
      //   : item.premDscLast,

      // totalNavLast: item.totalNavLast,
      // listingDate: item?.listingDate,

      // cumNetInflowLast: item.cumNetInflowLast,

      // netAssetsChangeLast: item.netAssetsChangeLast,
    };
  });

  //let list = [...data.list];
  const lastRet = {
    lastNetInflow: lastDayNum,
    totalNetAssetsChange: totalNetAssetsChange,
    totalNetInflow: totalNetInflow,
    totalNetInflowInCash: totalNetInflowInCash,
    totalNetInflowInKind: totalNetInflowInKind,
    // totalVolume: totalVolume,
    totalValueTraded: totalValueTraded,
    totalNetAssets: totalNetAssets,
    totalCumNetInflow: totalCumNetInflow,
    cumNetInflowInCash: cumNetInflowInCash,
    cumNetInflowInKind: cumNetInflowInKind,
    initData: init,
    // loading: false,
    csvdata: csvdata,
    initdata: historyData.list,
  }

  return { ...middleRet, ...lastRet }
};
