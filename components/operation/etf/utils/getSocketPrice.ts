// FIXME: 复制过来的，不要格式化
export const getSocketPrice = (prevData: any, wsData: any) => {
  const daydata = [...(prevData || [])];

  daydata.map((item: any, index) => {
    let itemIndex = index;
    daydata[itemIndex] = { ...daydata[itemIndex] };

    let symbolKey = item && item?.exchangeName + "@" + item?.ticker;

    if (wsData.data[symbolKey]) {
      if (wsData.data[symbolKey]["mp"])
        daydata[itemIndex].mktPrice = wsData.data[symbolKey]["mp"];
      if (wsData.data[symbolKey]["dc"])
        daydata[itemIndex].dailyChange = wsData.data[symbolKey]["dc"] * 100;
      if (wsData.data[symbolKey]["dv"])
        daydata[itemIndex].dailyVol = wsData.data[symbolKey]["dv"];
    }

    if (wsData.data.open === 0 || wsData.data.open === 1) {
      daydata[itemIndex].status = wsData.data["open"];
    }
  });
  return daydata
};
