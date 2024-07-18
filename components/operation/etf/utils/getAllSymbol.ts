import dayjs from 'dayjs'
import { getList, getFindLastList } from 'http/etf'
import { getHistory } from 'http/etf'
import { transferMoney } from 'helper/tools'
import { objectSort } from 'helper/tools'

export const getAllSymbol = async () => {
  const [data, { data: lastData }, { data: historyData }] = await Promise.all([
    getList({
      type: 1,
      isListing: 1,
      status: 1,
      orderItems: [{ asc: true, column: "sort" }],
    }).then((res) => res.data),
    getFindLastList({ type: 1 }),
    getHistory({
      type: 1,
      orderItems: [{ asc: false, column: "data_date" }],
      pageNum: 1,
      pageSize: 1000,
    }),
  ]);
  // --------FIXME: 复制过来的，不要格式化---------
  let totalNetInflow = 0;
  let totalNetInflowInCash = 0;
  let totalNetInflowInKind = 0;
  let totalVolume = 0;
  let totalNetAssets = 0;
  let totalCumNetInflow = 0;
  let cumNetInflowInCash = 0;
  let cumNetInflowInKind = 0;
  let totalNetAssetsChange = 0;
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
  // TDW: 重构一点
  const retMiddle = {
    netInflowTime: Object.keys(lastData[0].netInflowMap)[0],
    premDscTime: Object.keys(lastData[0].premDscMap)[0],
    totalNavTime: Object.keys(lastData[0].totalNavMap)[0],
    volumeTime: Object.keys(lastData[0].volumeTradedMap)[0],
    cumNetInflowTime: Object.keys(lastData[0].cumNetInflowMap)[0],
    netAssetsChangeTime: Object.keys(lastData[0].netAssetsChangeMap)[0],
  }
  let netInflowMap =
    lastData[0] &&
    lastData[0].netInflowMap[Object.keys(lastData[0].netInflowMap)[0]];
  let netInflowInCashMap =
    lastData[0] &&
    lastData[0].netInflowInCashMap &&
    lastData[0].netInflowInCashMap[
      Object.keys(lastData[0].netInflowInCashMap)[0]
    ];

  let netInflowInKindMap =
    lastData[0] &&
    lastData[0].netInflowInKindMap[
      Object.keys(lastData[0].netInflowInKindMap)[0]
    ];
  // let netInflowMapLast =
  //   lastData[1].netInflowMap[Object.keys(lastData[1].netInflowMap)[0]];
  let premDscMap =
    lastData[0] &&
    lastData[0].premDscMap[Object.keys(lastData[0].premDscMap)[0]];
  let premDscMapLast =
    lastData[0] &&
    lastData[1].premDscMap[Object.keys(lastData[1].premDscMap)[0]];
  let totalNavMap =
    lastData[0] &&
    lastData[0].totalNavMap[Object.keys(lastData[0].totalNavMap)[0]];
  let totalNavMapLast =
    lastData[0] &&
    lastData[1].totalNavMap[Object.keys(lastData[1].totalNavMap)[0]];
  let volumeTradedMap =
    lastData[0] &&
    lastData[0].volumeTradedMap[Object.keys(lastData[0].volumeTradedMap)[0]];
  let volumeTradedMapLast =
    lastData[0] &&
    lastData[1].volumeTradedMap[Object.keys(lastData[1].volumeTradedMap)[0]];
  let cumNetInflowMap =
    lastData[0] &&
    lastData[0].cumNetInflowMap[Object.keys(lastData[0].cumNetInflowMap)[0]];
  let cumNetInflowMapLast =
    lastData[0] &&
    lastData[1].cumNetInflowMap[Object.keys(lastData[1].cumNetInflowMap)[0]];

  let cumNetInflowInCashMap =
    lastData[0] &&
    lastData[0].cumNetInflowInCashMap[
      Object.keys(lastData[0].cumNetInflowInCashMap)[0]
    ];
  let cumNetInflowInCashMapLast =
    lastData[0] &&
    lastData[1].cumNetInflowInCashMap[
      Object.keys(lastData[1].cumNetInflowInCashMap)[0]
    ];
  let cumNetInflowInKindMap =
    lastData[0] &&
    lastData[0].cumNetInflowInKindMap[
      Object.keys(lastData[0].cumNetInflowInKindMap)[0]
    ];
  let cumNetInflowInKindMapLast =
    lastData[0] &&
    lastData[1].cumNetInflowInKindMap[
      Object.keys(lastData[1].cumNetInflowInKindMap)[0]
    ];

  let netAssetsChangeMap =
    lastData[0] &&
    lastData[0].netAssetsChangeMap[
      Object.keys(lastData[0].netAssetsChangeMap)[0]
    ];
  let netAssetsChangeMapLast =
    lastData[0] &&
    lastData[1].netAssetsChangeMap[
      Object.keys(lastData[1].netAssetsChangeMap)[0]
    ];

  dataReasult.map((item: any, index: number) => {
    dataReasult[index]["netInflow"] =
      netInflowMap && netInflowMap[dataReasult[index]["id"]];
    dataReasult[index]["netInflowInCash"] =
      netInflowInCashMap && netInflowInCashMap[dataReasult[index]["id"]];
    dataReasult[index]["netInflowInKind"] =
      netInflowInKindMap && netInflowInKindMap[dataReasult[index]["id"]];
    dataReasult[index]["premDsc"] =
      premDscMap && premDscMap[dataReasult[index]["id"]];
    dataReasult[index]["premDscLast"] =
      premDscMapLast && premDscMapLast[dataReasult[index]["id"]];
    dataReasult[index]["totalNav"] =
      totalNavMap && totalNavMap[dataReasult[index]["id"]];
    dataReasult[index]["totalNavLast"] =
      totalNavMapLast && totalNavMapLast[dataReasult[index]["id"]];
    dataReasult[index]["volume"] =
      volumeTradedMap && volumeTradedMap[dataReasult[index]["id"]];
    dataReasult[index]["volumeLast"] =
      volumeTradedMapLast && volumeTradedMapLast[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflow"] =
      cumNetInflowMap && cumNetInflowMap[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflowLast"] =
      cumNetInflowMapLast && cumNetInflowMapLast[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflowInCash"] =
      cumNetInflowInCashMap &&
      cumNetInflowInCashMap[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflowInCashLast"] =
      cumNetInflowInCashMapLast &&
      cumNetInflowInCashMapLast[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflowInKind"] =
      cumNetInflowInKindMap &&
      cumNetInflowInKindMap[dataReasult[index]["id"]];
    dataReasult[index]["cumNetInflowInKindLast"] =
      cumNetInflowInKindMapLast &&
      cumNetInflowInKindMapLast[dataReasult[index]["id"]];
    dataReasult[index]["netAssetsChange"] =
      netAssetsChangeMap && netAssetsChangeMap[dataReasult[index]["id"]];
    dataReasult[index]["netAssetsChangeLast"] =
      netAssetsChangeMapLast &&
      netAssetsChangeMapLast[dataReasult[index]["id"]];
    if (cumNetInflowMap && cumNetInflowMap[dataReasult[index]["id"]]) {
      totalCumNetInflow =
        totalCumNetInflow + +cumNetInflowMap[dataReasult[index]["id"]];
    }

    if (
      cumNetInflowInCashMap &&
      cumNetInflowInCashMap[dataReasult[index]["id"]]
    ) {
      cumNetInflowInCash =
        cumNetInflowInCash + +cumNetInflowInCashMap[dataReasult[index]["id"]];
    }
    if (
      cumNetInflowInKindMap &&
      cumNetInflowInKindMap[dataReasult[index]["id"]]
    ) {
      cumNetInflowInKind =
        cumNetInflowInKind + +cumNetInflowInKindMap[dataReasult[index]["id"]];
    }
    // if (netAssetsChangeMap[dataReasult[index]["id"]]) {
    //   totalNetAssetsChange =
    //     totalNetAssetsChange + +netAssetsChangeMap[dataReasult[index]["id"]];
    // }

    if (
      (netAssetsChangeMap && netAssetsChangeMap[dataReasult[index]["id"]]) ||
      (netAssetsChangeMapLast &&
        netAssetsChangeMapLast[dataReasult[index]["id"]])
    ) {
      totalNetAssetsChange =
        totalNetAssetsChange +
        (+netAssetsChangeMap[dataReasult[index]["id"]]
          ? +netAssetsChangeMap[dataReasult[index]["id"]]
          : +netAssetsChangeMapLast[dataReasult[index]["id"]]);
    }
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
        dayjs(Object.keys(lastData[0].cumNetInflowMap)[0]).unix()
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
    let totalNav = item.totalNav ? +item.totalNav : +item.totalNavLast;
    if (item.netInflow) totalNetInflow = totalNetInflow + +item.netInflow;
    if (item.netInflowInCash)
      totalNetInflowInCash = totalNetInflowInCash + +item.netInflowInCash;
    if (item.netInflowInKind)
      totalNetInflowInKind = totalNetInflowInKind + +item.netInflowInKind;
    if (item.volume) totalVolume = totalVolume + +item.volume;

    totalNetAssets = +totalNetAssets + +totalNav;

    return {
      id: index + 1,
      ticker: item.ticker,
      exchangeName: item.exchangeName,
      inst: item.inst,
      mktPrice: item?.mktPrice,
      dailyChange: item?.dailyChange * 100,
      volume: item.volume,
      volumeLast: item.volumeLast,
      dailyVol: item.dailyVol,
      premDsc: item.premDsc ? item.premDsc * 100 + "" : item.premDsc,
      premDscLast: item.premDscLast
        ? item.premDscLast * 100 + ""
        : item.premDscLast,
      netInflow: item.netInflow,
      netInflowInCash: item.netInflowInCash,
      netInflowInKind: item.netInflowInKind,
      totalNav: item.totalNav,
      totalNavLast: item.totalNavLast,
      listingDate: item?.listingDate,
      cumNetInflow: item.cumNetInflow,
      cumNetInflowLast: item.cumNetInflowLast,
      cumNetInflowInCash: item.cumNetInflowInCash,
      cumNetInflowInCashLast: item.cumNetInflowInCashLast,
      cumNetInflowInKind: item.cumNetInflowInKind,
      cumNetInflowInKindLast: item.cumNetInflowInKindLast,
      netAssetsChange: item.netAssetsChange,
      netAssetsChangeLast: item.netAssetsChangeLast,
      status: item.isOpen,
      fee: item.fee * 100,
    };
  });
  // TDW: 重构一点
  const retLast = {
    lastNetInflow: lastDayNum,
    totalNetAssetsChange: totalNetAssetsChange,
    totalNetInflow: totalNetInflow,
    totalVolume: totalVolume,
    totalNetAssets: totalNetAssets,
    totalCumNetInflow: totalCumNetInflow,
    initData: init,
    csvdata: csvdata,
    initdata: historyData.list,
  }
  return { ...retMiddle, ...retLast }
};
