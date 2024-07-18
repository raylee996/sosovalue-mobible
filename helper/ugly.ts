import dayjs from "dayjs";
import { intlNumberFormat, transferMoney } from "./tools";

type RowData = [number, any];
type ChartDataConfig = {
  name: string;
  data: RowData[];
};
export type MasterSlaveData = {
  master: ChartDataConfig;
  slaves: ChartDataConfig[];
};
type FormatedData = {
  time: number;
  formatedTime: string;
  value: string;
};
type EchartsData = { value: number; labelValue: string };
type ChartData = {
  name: string;
  rowData: FormatedData[];
  echartsData: EchartsData[];
};
export type FormatedETFData = {
  master: ChartData;
  slaves: ChartData[];
};

const getLabelValue = (name: string, value: string) => {
  return name === "BTC Price"
    ? intlNumberFormat(Number(value), 2)
    : value != "-"
    ? transferMoney(value)
    : "Not updated";
};

export const transformETFData = ({
  master,
  slaves,
}: MasterSlaveData): FormatedETFData => {
  const slavesDataMap = slaves.map((slave) =>
    slave.data.reduce((acc, [time, value]) => {
      acc[time] = value;
      return acc;
    }, {} as Record<number, any>)
  );
  const masterEchartsData: EchartsData[] = [];
  const slaveList: ChartData[] = slaves.map((slave) => ({
    name: slave.name,
    rowData: [],
    echartsData: [],
  }));
  const masterData = master.data.map(([time, value]) => {
    masterEchartsData.push({
      value,
      labelValue: getLabelValue(master.name, value),
    });
    slaveList.forEach((slave, index) => {
      const value = slavesDataMap[index][time] || "";
      slave.rowData.push({
        time,
        formatedTime: dayjs(time).format("YYYY/MM/DD"),
        value,
      });
    });
    return {
      time,
      formatedTime: dayjs(time).format("YYYY/MM/DD"),
      value,
    };
  });
  const finalSlaves = slaveList.map((item, index) => {
    if (index === 0) {
      item.echartsData = item.rowData.map(({ value }) => ({
        value: Number(value),
        labelValue: getLabelValue(item.name, value),
      }));
    } else {
      item.echartsData = item.rowData.map(({ value }) => ({
        value:
          (Number(value) * Number(slaveList[0].rowData[0].value)) /
          Number(item.rowData[0].value),
        labelValue: getLabelValue(item.name, value),
      }));
    }
    return item;
  });
  return {
    master: {
      name: master.name,
      rowData: masterData,
      echartsData: masterEchartsData,
    },
    slaves: finalSlaves,
  };
};
