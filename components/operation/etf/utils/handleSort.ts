import { objectSort } from "helper/tools";

interface Option {
  initData: any[]
  currentSort: string
  currentSortKey: string
  defaultSortKey: string
}

// FIXME: 复制过来的，不要格式化，后面重构
export const handleSort = (key: string, option: Option) => {
  const { initData, currentSort, currentSortKey, defaultSortKey } = option
  const changeData = [...initData];
  const nonData: any = [];
  const sortData: any = [];
  let sort = "";
  if (currentSort === "DESC") {
    sort = "ASC";
  } else if (currentSort === "ASC") {
    sort = "";
  } else if (currentSort === "") {
    sort = "DESC";
  }
  if (currentSortKey !== key) sort = "DESC";
  changeData.map((item: any) => {
    if (item[key] == null || item[key] == "-") {
      nonData.push(item);
    }

    if (item[key] != null) {
      sortData.push(item);
    }
  });

  let noneData = nonData.filter(
    (item: any) => item[key] == "-" || item[key] == "NaN" || item[key] == null
  );
  let initdata = sortData.filter(
    (item: any) => item[key] != "-" && item[key] != "NaN" && item[key] != null
  );
  if (sort === "") {
    initdata.sort(objectSort(defaultSortKey, "DESC"));
  } else {
    initdata.sort(objectSort(key, sort));
  }

  const dataReasult = initdata.concat(noneData);

  const arr1 = dataReasult?.map((item: any, index: number) => {
    return {
      ...item,
      id: index + 1,
    };
  });
  // TDW: 重构一点
  return {
    sort: sort || 'DESC',
    sortKey: sort ? key : defaultSortKey,
    sortRes: arr1,
  }
};
