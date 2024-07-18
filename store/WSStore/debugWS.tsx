import { WSData, WSEventName } from ".";
import dayjs, { Dayjs } from "dayjs";
import { GweiWSData } from "./useGweiWSData";
import { GasWSData } from "./useGasWSData";

enum LogLevel {
  None = "none",
  Simple = "simple",
  Full = "full",
}

type LogConfig = {
  level?: LogLevel;
  transform?: (wsData: WSData) => any;
  customDataLog?: (wsData: WSData) => void;
};
const logLimit = 1000;
let logCount = 0;
const color = "#6b7280";
const labelStyle = `color: white; font-style: italic; font-weight: bold; background-color: ${color};padding: 2px; border-radius: 4px;box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(6, 182, 212, 0.5) 0px 10px 15px -3px, rgba(6, 182, 212, 0.5) 0px 4px 6px -4px`;
const valueStyle = `margin-left: 12px; margin-right: 24px; color: ${color};font-weight: bold;`;
const createLog = (config?: LogConfig) => {
  let prevTime: Dayjs;
  let num = 0;
  return (wsData: WSData) => {
    if (!config?.level || config.level === LogLevel.None) {
      return;
    }
    if (logCount++ > logLimit) {
      logCount = 0;
      console.clear();
    }
    const now = dayjs();
    const interval = prevTime ? `${now.diff(prevTime)}ms` : "---";
    prevTime = now;
    const logSimple = () => {
      console.log(
        `%cevent:%c${wsData.event} %cid:%c${++num} %ctime:%c${now.format(
          "HH:mm:ss"
        )} %cinterval:%c${interval}`,
        labelStyle,
        valueStyle,
        labelStyle,
        valueStyle,
        labelStyle,
        valueStyle,
        labelStyle,
        valueStyle
      );
    };
    if (config.level === LogLevel.Simple) {
      logSimple();
    }
    if (config.level === LogLevel.Full) {
      logSimple();
      if (config.customDataLog) {
        config.customDataLog(wsData);
      } else {
        console.log(
          "%cdata:",
          labelStyle,
          config.transform?.(wsData) || wsData
        );
      }
    }
  };
};
const logWS = createLog({
  level: LogLevel.None,
});
const logPriceWS = createLog({
  level: LogLevel.None,
});
const logKlineWS = createLog({
  level: LogLevel.None,
});
const logGweiWS = createLog({
  level: LogLevel.None,
  transform(wsData) {
    return JSON.parse((wsData as GweiWSData).data);
  },
});
const logGasWS = createLog({
  level: LogLevel.None,
  transform(wsData) {
    return (wsData as GasWSData).data;
  },
});
const logOpeninteresWS = createLog({
  level: LogLevel.None,
});
const logSectorWS = createLog({
  level: LogLevel.None,
});
const logMarketCapWS = createLog({
  level: LogLevel.None,
});
const logCurrencyVolume = createLog({
  level: LogLevel.None,
});

export const debugWS = (wsData: WSData) => {
  if (process.env.NODE_ENV === "development") {
    logWS(wsData);
    if (wsData.event === WSEventName.TICKER24) {
      logPriceWS(wsData);
    } else if (wsData.event === WSEventName.KLINE) {
      logKlineWS(wsData);
    } else if (wsData.event === WSEventName.GWEI) {
      logGweiWS(wsData);
    } else if (wsData.event === WSEventName.GAS) {
      logGasWS(wsData);
    } else if (wsData.event === WSEventName.OPENINTERES) {
      logOpeninteresWS(wsData);
    } else if (wsData.event === WSEventName.SECTOR) {
      logSectorWS(wsData);
    } else if (wsData.event === WSEventName.MARKETCAP) {
      logMarketCapWS(wsData);
    } else if (wsData.event === WSEventName.CURRENCY_VOLUME) {
      logCurrencyVolume(wsData);
    }
  }
};
