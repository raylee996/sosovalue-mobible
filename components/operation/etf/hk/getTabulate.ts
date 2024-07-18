import { objectSort } from "helper/tools";

// FIXME: 复制过来的，不要格式化
export const getTabulate = (draft: any) => {
  // let sortData =
  //   dataList.length > 0
  //     ? JSON.parse(JSON.stringify(dataList))
  //     : JSON.parse(JSON.stringify(initData));
  const sortData = draft

  let filterDataList: any = sortData.filter(
    (item: any) => item.fiatMoney === "HKD"
  );

  let filterData = JSON.parse(JSON.stringify(filterDataList));
  // setDataList(sortData);

  filterData.map((item: any, index: number) => {
    // filterData[index].newShares = 0;
    // filterData[index].totalShares = 0;
    // filterData[index].netInflow = 0;
    filterData[index].volume = 0;
    // filterData[index].totalNav = 0;
    // filterData[index].netAssetsChange = 0;
    filterData[index].turnoverRate = 0;
    filterData[index].turnover = 0;
    //filterData[index].totalNav = 0;
    // filterData[index].cumNetInflow = 0;
    sortData.map((items: any) => {
      if (items.inst === item.inst) {
        if (items["premDsc"] && items.ticker === item.ticker)
          filterData[index].premDsc = items["premDsc"];

        if (items["totalNav"] && items.fiatMoney === "USD") {
          filterData[index].totalNav = items["totalNav"];
        }

        // if (items.fiatMoney === "HKD") {
        //   if (items["newShares"])
        //     filterData[index].newShares =
        //       +filterData[index].newShares + +items["newShares"];

        //   if (items["totalShares"])
        //     filterData[index].totalShares =
        //       +filterData[index].totalShares + +items["totalShares"];
        //   if (items["netInflow"])
        //     filterData[index].netInflow =
        //       +filterData[index].netInflow + +items["netInflow"];
        //   if (items["netAssetsChange"])
        //     filterData[index].netAssetsChange =
        //       +filterData[index].totalNav + +items["netAssetsChange"];
        //   if (items["totalNav"])
        //     filterData[index].totalNav =
        //       +filterData[index].totalNav + +items["totalNav"];
        //   if (items["cumNetInflow"])
        //     filterData[index].cumNetInflow =
        //       +filterData[index].cumNetInflow + +items["cumNetInflow"];
        // }

        if (items["volume"])
          filterData[index].volume =
            +filterData[index].volume + +items["volume"];
        // if (items["totalNav"])
        //   filterData[index].totalNav =
        //     +filterData[index].totalNav + +items["totalNav"];
        if (items["turnoverRate"])
          filterData[index].turnoverRate =
            +filterData[index].turnoverRate +
            +items["volume"] / +items["totalShares"];
        if (items["turnover"])
          filterData[index].turnover =
            +filterData[index].turnover + +items["turnover"];
      }
    });
  });
  // let totalNewShares = 0;
  // let totalShares = 0;
  let cumNetInflow = 0;
  let netInflow = 0;
  let totalVolume = 0;
  let netAssets = 0;
  let netAssetsChange = 0;
  filterData.map((item: any) => {
    // if (item["newShares"]) totalNewShares += +item["newShares"];
    // if (item["totalShares"]) totalShares += +item["totalShares"];
    if (item["cumNetInflow"]) cumNetInflow += +item["cumNetInflow"];
    if (item["netInflow"]) netInflow += +item["netInflow"];
    if (item["turnover"]) totalVolume += +item["turnover"];
    if (item["totalNav"]) netAssets += +item["totalNav"];
    if (item["netAssetsChange"]) netAssetsChange += +item["netAssetsChange"];
  });
  filterData.sort(objectSort("totalNav", "DESC"));

  // setData(filterData);
  // tabulateRef.current!.style.height = filterData.length * 32 + 40 + "px";
  // setTabulate();
  return {
    cumNetInflow,
    netInflow,
    totalVolume,
    netAssets,
    netAssetsChange,
    //top: topData[0],
    filterData,
  }
};
