
export const getSocketPrice = (prevData: any, priceData: any) => {
  let wsData = priceData;
  //let statusData = openStatusData
  if (wsData) {
    const daydata = JSON.parse(JSON.stringify(prevData));

    const newData = daydata?.map((item: any, index: number) => {
      const newItem = { ...daydata[index] };

      let symbolKey = item && item?.inst + "@" + item?.ticker;

      if (wsData.data[symbolKey]) {
        if (wsData.data[symbolKey]["dailyChg"])
          newItem.dailyChg = wsData.data[symbolKey]["dailyChg"];
        if (wsData.data[symbolKey]["dailyVol"])
          newItem.dailyVol = wsData.data[symbolKey]["dailyVol"];
        if (wsData.data[symbolKey]["mktPrice"])
          newItem.lastPrice = wsData.data[symbolKey]["mktPrice"];
        if (wsData.data[symbolKey]["premDsc"])
          newItem.premDsc = wsData.data[symbolKey]["premDsc"];
        // if (wsData.data[symbolKey]["time"])
        //   newItem.time = wsData.data[symbolKey]["time"];
        if (wsData.data[symbolKey]["turnoverRate"])
          newItem.turnoverRate = wsData.data[symbolKey]["turnoverRate"];
        if (wsData.data[symbolKey]["turnover"])
          newItem.turnover = wsData.data[symbolKey]["volTraded"];
      }

      if (
        wsData.data.open === 0 ||
        wsData.data.open === "0" ||
        wsData.data.open === 1 ||
        wsData.data.open === "1"
      ) {
        newItem.status = wsData.data["open"];
      }
      return newItem;
    });

    return newData
  }
  return prevData
};
