const singleSelectFormatData = (data: API.ChartType, currTitleMenu: string) => {
  if (data.switchCharts && data.switchCharts.length > 0) {
    const index =
      data.switchCharts?.indexOf(currTitleMenu) == -1
        ? 0
        : data.switchCharts?.indexOf(currTitleMenu);
    const arr = data.data[index];
    return [arr.data];
  } else {
    return data.data?.map((items: any) => {
      return items.data;
    });
  }
};
const singleSelectLegend = (data: API.ChartType, currTitleMenu: string) => {
  return [data.charValue[0]];
};

function findLongestArray(twoDimArray: number[][]): number[] {
  if (twoDimArray.length === 0) {
    return [];
  }
  const longestArray = twoDimArray.reduce((prev, current) => {
    return current.length > prev.length ? current : prev;
  }, twoDimArray[0]);

  return longestArray;
}
// 用第一根线的数据补数据方法
const supplementaryData = (data: API.ChartType, currTitleMenu: string) => {
  let list: any = [];
  data.data.forEach((items: any) => {
    list.push(items.data);
  });
  const newData: any[] = [];
  list.forEach((item: any) => {
    const diff = list[0].length - item.length;
    const temp = [];
    for (let index = 0; index < diff; index++) {
      temp.push([list[0][index][0], ""]);
    }
    item = [...temp, ...item];
    newData.push(item);
  });
  return newData;
};
const supplementaryData2 = (data: API.ChartType, currTitleMenu: string) => {
  let list: any = [];
  data.data.forEach((items: any) => {
    list.push(items.data);
  });
  const myList: any = findLongestArray(list);
  const newData: any[] = [];
  list.forEach((item: any) => {
    const diff = myList.length - item.length;
    const temp = [];
    for (let index = 0; index < diff; index++) {
      temp.push([myList[index][0], ""]);
    }
    item = [...temp, ...item];
    newData.push(item);
  });
  return newData;
};
const funcMap: { [key: string]: any } = {
  Fee_Charts: {
    formatData: supplementaryData2,
  },
  Total_TVL: {
    formatData: supplementaryData,
  },
  TVLDifferentChain: {
    formatData: supplementaryData,
  },
  Stables_Charts: {
    formatData: supplementaryData,
  },
  Volume_Charts: {
    formatData: supplementaryData,
  },
  Stablecoin_Total_Market_Cap: {
    formatData: supplementaryData,
    legend: (data: API.ChartType) => {
      const legend: string[] = [];
      data.data.map((item) => {
        legend.push(item.intro);
      });
      return legend;
    },
  },
  Total_Crypto_Spot_ETF_Fund_Flow: {
    formatData: (
      data: API.ChartType,
      currTitleMenu: string = "Bitcoin ETF"
    ) => {
      if (currTitleMenu === "Bitcoin ETF") {
        return [data.data[0].data, data.data[1].data];
      }
      if (currTitleMenu === "Ethereum ETF") {
        if (data.data[2]) {
          return [data.data[2].data, data.data[3].data];
        } else {
          return [[], []];
        }
      }
    },
  },
  Futures_Open_Interest: {
    formatData: (data: API.ChartType, currTitleMenu: string) => {
      if (data.switchCharts && data.switchCharts.length > 0) {
        const index =
          data.switchCharts?.indexOf(currTitleMenu) == -1
            ? 0
            : data.switchCharts?.indexOf(currTitleMenu);
        const arr = data.data[index];
        return [arr.data, data.data[data.data.length - 1].data];
      }
    },
    legend: (data: API.ChartType, currTitleMenu: string) => {
      if (data.switchCharts && data.switchCharts?.length > 0) {
        const index =
          data.switchCharts?.indexOf(currTitleMenu) == -1
            ? 0
            : data.switchCharts?.indexOf(currTitleMenu);
        let special: string[] = ["Price"];
        return [data.charValue[index], ...special];
      }
    },
    series: (data: API.ChartType, currTitleMenu: string) => {
      return {
        names: [currTitleMenu, "Price"],
        types: ["bar", "line"],
      };
    },
  },
  Funding_Rate: {
    formatData: (data: API.ChartType, currTitleMenu: string) => {
      if (data.switchCharts && data.switchCharts.length > 0) {
        const index =
          data.switchCharts?.indexOf(currTitleMenu) == -1
            ? 0
            : data.switchCharts?.indexOf(currTitleMenu);
        const arr = data.data[index];
        return [arr.data, data.data[data.data.length - 1].data];
      }
    },
    legend: (data: API.ChartType, currTitleMenu: string) => {
      if (data.switchCharts && data.switchCharts?.length > 0) {
        const index =
          data.switchCharts?.indexOf(currTitleMenu) == -1
            ? 0
            : data.switchCharts?.indexOf(currTitleMenu);
        let special: string[] = ["Price"];
        return [data.charValue[index], ...special];
      }
    },
    series: (data: API.ChartType, currTitleMenu: string) => {
      return {
        names: [currTitleMenu, "Price"],
        types: ["bar", "line"],
      };
    },
  },
  Active_Address_on_Chains: {
    formatData: singleSelectFormatData,
    legend: singleSelectLegend,
  },
  Transactions_on_Chains: {
    formatData: singleSelectFormatData,
    legend: singleSelectLegend,
  },
  AHR_999_Indicator: {
    formatData: (data: API.ChartType, currTitleMenu: string) => {
      let list: any = [];
      data.data.forEach((items: any) => {
        list.push(items.data);
      });
      list = [...list, [], []];
      list[0].map((item: any, index: number) => {
        list[2].push([item[0], "1.2"]);
        list[3].push([item[0], ".45"]);
      });
      return list;
    },
  },
};
const defaultFuncMap: {
  formatData: Function;
  legend: Function;
  series: Function;
} = {
  formatData: (data: API.ChartType, currTitleMenu: string) =>
    data.data?.map((item) => item.data),
  legend: (data: API.ChartType) => data.charValue,
  series: (data: API.ChartType) => {
    return {
      names: data.charValue,
      types: data.viewType,
    };
  },
};
const handleChartData = (
  data: API.ChartType
): { formatData: Function; legend: Function; series: Function } => {
  if (data.innerKey && funcMap.hasOwnProperty(data.innerKey)) {
    return { ...defaultFuncMap, ...funcMap[data.innerKey] };
  } else {
    return defaultFuncMap;
  }
};
export default handleChartData;
