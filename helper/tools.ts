import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { FormatData } from "./dataTypeConfig";
import { UAParser } from "ua-parser-js";
import { INVITE_CODE_KEY } from "./constants";

dayjs.extend(duration);

export const isNullOrUndefined = (val: any) =>
  val === null || val === undefined;

export const initHelp = (target: Record<string, any>, keys: string[]) => {
  keys.forEach((key) => {
    if (isNullOrUndefined(target[key])) {
      target[key] = "";
    } else if (typeof target[key] !== "string") {
      target[key] = String(target[key]);
    }
  });
};

export const isBrowser = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const formatTimestamp = (
  timestamp: string | number,
  template: string = "YYYY-MM-DD HH:mm:ss"
) => dayjs(timestamp).format(template);

export const transferMoney = (value: number | string, decimal = 2) => {
  let symbol = "";
  if (
    value === "-" ||
    value === "NaN" ||
    value === "undefined" ||
    value === "null" ||
    value === ""
  )
    return "-";
  if (+value < 0) symbol = "-";
  if (!value) {
    return "0";
  }
  if (Math.abs(+value) / Math.pow(10, 18) >= 1) {
    return (
      symbol +
      (intlNumberFormat(
        +(Math.abs(+value) / Math.pow(10, 18)).toFixed(decimal),
        decimal
      ) +
        "E")
    );
  }
  if (Math.abs(+value) / Math.pow(10, 15) >= 1) {
    return (
      symbol +
      (intlNumberFormat(
        +(Math.abs(+value) / Math.pow(10, 15)).toFixed(decimal),
        decimal
      ) +
        "P")
    );
  }
  if (Math.abs(+value) / Math.pow(10, 12) >= 1) {
    return (
      symbol +
      (intlNumberFormat(
        +(Math.abs(+value) / Math.pow(10, 12)).toFixed(decimal),
        decimal
      ) +
        "T")
    );
  }
  if (Math.abs(+value) / Math.pow(10, 9) > 1) {
    return (
      symbol +
      (intlNumberFormat(
        +(Math.abs(+value) / Math.pow(10, 9)).toFixed(decimal),
        decimal
      ) +
        "B")
    );
  }

  if (Math.abs(+value) / Math.pow(10, 6) > 1) {
    return (
      symbol +
      (intlNumberFormat(
        +(Math.abs(+value) / Math.pow(10, 6)).toFixed(decimal),
        decimal
      ) +
        "M")
    );
  }

  if (Math.abs(+value) / Math.pow(10, 3) > 1) {
    return (
      symbol +
      (intlNumberFormat(
        +(Math.abs(+value) / Math.pow(10, 3)).toFixed(decimal),
        decimal
      ) +
        "K")
    );
  }

  if (Math.abs(+value) < 0.01) {
    return symbol + +Math.abs(+value);
  }
  return symbol + (+Math.abs(+value)).toFixed(decimal);
};

export const objectSort = (property: any, orderBy: string = "DESC") => {
  if (orderBy == "DESC") {
    return function (Obj1: any, Obj2: any) {
      return parseFloat(Obj2[property]) - parseFloat(Obj1[property]);
    };
  }
  if (orderBy == "ASC") {
    return function (Obj1: any, Obj2: any) {
      return parseFloat(Obj1[property]) - parseFloat(Obj2[property]);
    };
  }
};

export const getSymbolByCurrency = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    HKD: "HK$",
    CNY: "¥",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };
  return symbols[currency] || "";
};

/*
 * ping: 要处理的数
 * places: 要保留的有效小数位
 */
export const handleDecimalParts = (ping: any, places: any) => {
  // 1. 判断整数部分是否为0
  const res = parseInt(ping);

  var residue = "";
  // 保留部分
  var handleRes: any[] = [];
  var finalRes = "";

  if (res == 0) {
    ping = ping + "";
    // 包含小数点
    if (ping.indexOf(".") != -1) {
      // 保留小数点后两位有效数字
      var pingArr = ping.split(".");
      // 取小数部分
      const decimalPart = pingArr[1];
      residue = getResidue(places, decimalPart, handleRes);

      // 判断是否需要四舍五入
      if (residue && +residue[0] >= 5) {
        var val1 = ["1"];
        var length = handleRes.length;
        for (var i = 0; i < length; i++) {
          val1.push("0");
        }
        let multiplier = +val1.join("");

        // 需要四舍五入
        let joinStr = handleRes.join("");
        if (ping >= 0) {
          joinStr = "0." + joinStr;
        } else {
          joinStr = "-0." + joinStr;
        }

        joinStr = +joinStr + "";

        // 进位+1
        let temp = +joinStr * multiplier + 1;
        if (+joinStr < 0.0001) {
          finalRes = (temp / multiplier).toFixed(8) + "";
        } else if (+joinStr < 0.001) {
          finalRes = (temp / multiplier).toFixed(7) + "";
        } else if (+joinStr < 0.01) {
          finalRes = (temp / multiplier).toFixed(6) + "";
        } else if (+joinStr < 0.1) {
          finalRes = (temp / multiplier).toFixed(5) + "";
        } else {
          finalRes = (temp / multiplier).toFixed(4) + "";
        }

        // 最终结果
        //finalRes = (temp / multiplier) + '';
      } else {
        var val1 = ["1"];
        var length = handleRes.length;
        //console.log(length)
        for (var i = 0; i < length; i++) {
          val1.push("0");
        }
        let multiplier = +val1.join("");

        // 需要四舍五入
        let joinStr = handleRes.join("");
        if (ping >= 0) {
          joinStr = "0." + joinStr;
        } else {
          joinStr = "-0." + joinStr;
        }
        joinStr = +joinStr + "";

        // 进位+1
        let temp = +joinStr * multiplier;
        if (+joinStr < 0.0001) {
          finalRes = (temp / multiplier).toFixed(8) + "";
        } else if (+joinStr < 0.001) {
          finalRes = (temp / multiplier).toFixed(7) + "";
        } else if (+joinStr < 0.01) {
          finalRes = (temp / multiplier).toFixed(6) + "";
        } else if (+joinStr < 0.1) {
          finalRes = (temp / multiplier).toFixed(5) + "";
        } else {
          finalRes = (temp / multiplier).toFixed(4) + "";
        }

        // 最终结果
        //finalRes = (temp / multiplier) + '';
      }
    }
  } else {
    finalRes = roundFun(Number(ping), places).toFixed(4) + "";
  }

  return finalRes;
};
//保留n位小数
function roundFun(value: any, n: any) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}
export const getFullNum = (num: number) => {
  //处理非数字
  if (isNaN(num)) {
    return num;
  }
  //处理不需要转换的数字
  var str = "" + num;
  if (!/e/i.test(str)) {
    return num;
  }
  return num.toFixed(18).replace(/\.?0+$/, "") + "";
};
/*对小数部分进行处理*/
export const getResidue = (places: any, decimalPart: any, handleRes: any) => {
  let residue = decimalPart;
  for (var i = 0; i < places; i++) {
    // 取出小数部分到第一个不是0的位置
    for (var j = 0; j < residue.length; j++) {
      if (residue[j] != 0) {
        residue = residue.substr(j);
        break;
      } else {
        handleRes.push(residue[j]);
      }
    }

    if (residue) {
      handleRes.push(residue[0]);
      residue = residue.substr(1);
    }
  }
  return residue;
};
export const intlNumberFormat = (
  num: number,
  minimumFractionDigits: number = 0
) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(num);
};
export const formatDecimal = (val?: string | number) => {
  if (val === undefined || val === null) {
    return "";
  }

  const isString = typeof val === "string";
  const valNum = isString ? Number(val) : val;
  let valStr = isString ? val : String(val);

  if (Number.isNaN(Number(valNum))) {
    return "";
  }
  if (valStr.includes("e")) {
    valStr = valNum.toFixed(18).replace(/\.?0+$/, "");
  }

  const [leftNum, rightNum] = valStr.split(".");
  if (valNum >= 10) {
    const remain = 7 - leftNum.length;
    if (remain > 0) {
      if (rightNum) {
        if (rightNum.length > remain) {
          return valNum.toFixed(remain).replace(/\.?0*$/, "");
        } else {
          return String(valNum);
        }
      }
      return String(valNum);
    } else {
      return Math.round(valNum);
    }
  } else if (valNum >= 1) {
    if (rightNum?.length > 5) {
      return valNum.toFixed(5).replace(/\.?0*$/, "");
    } else {
      return String(valNum);
    }
  } else if (valNum > 0) {
    let i = 0;
    while (rightNum[i] === "0") {
      i++;
    }
    if (i === 0) {
      return valNum.toFixed(5).replace(/\.?0*$/, "");
    } else if (i === 1 || i === 2) {
      return valNum
        .toFixed(5 > rightNum.length ? rightNum.length : 5)
        .replace(/\.?0*$/, "");
    } else {
      return valNum
        .toFixed(i + 4 > rightNum.length ? rightNum.length : i + 4)
        .replace(/\.?0*$/, "");
    }
  } else {
    return 0;
  }
};
// value为要进行保留小数位的数字，count为计数
// export const formatDecimal = (val: string, coin = "BTC") => {
//   if (val && typeof val == "string" && val.indexOf(".") != -1) {
//     if (
//       coin.toUpperCase() == "USDT" ||
//       coin.toUpperCase() == "USDC" ||
//       coin.toUpperCase() == "DAI" ||
//       coin.toUpperCase() == "BUSD" ||
//       coin.toUpperCase() == "TUSD" ||
//       coin.toUpperCase() == "USDP"
//     ) {
//       return (
//         val.slice(0, val.indexOf(".")) +
//         val.slice(val.indexOf("."), val.indexOf(".") + 5)
//       );
//     }
//     if (coin.toUpperCase() == "PAXG") {
//       return val.slice(0, val.indexOf("."));
//     }
//     if (+val == 0) {
//       return "0.0000";
//     }
//     if (Math.abs(+val.slice(0, val.indexOf("."))) >= 10) {
//       return intlNumberFormat(+(+val), 2);
//       //return intlNumberFormat(+(val.slice(0, val.indexOf('.')) + val.slice(val.indexOf('.'), val.indexOf('.') + 3)))
//     }
//     if (Math.abs(+val.slice(0, val.indexOf("."))) >= 2) {
//       return intlNumberFormat(+(+val), 3);
//       //return intlNumberFormat(+(val.slice(0, val.indexOf('.')) + val.slice(val.indexOf('.'), val.indexOf('.') + 4)))
//     }
//     if (Math.abs(+val.slice(0, val.indexOf("."))) >= 1) {
//       return intlNumberFormat(+(+val), 4);
//       //return val.slice(0, val.indexOf('.')) + val.slice(val.indexOf('.'), val.indexOf('.') + 5)
//     }
//     if (
//       Math.abs(+val.slice(val.indexOf("."))) < 0.0001 &&
//       Math.abs(+val.slice(val.indexOf("."))) > 0.00000001
//     ) {
//       return (
//         val.slice(0, val.indexOf(".")) +
//         val.slice(val.indexOf("."), val.indexOf(".") + 9)
//       ).replace(/(0+)$/g, "");
//     }
//     if (Math.abs(+val.slice(val.indexOf("."))) >= 0.0001) {
//       return handleDecimalParts(val, 4);
//       if (+handleDecimalParts(val, 4).length > 10) {
//         return Number((+handleDecimalParts(val, 4)).toFixed(8));
//       } else {
//         return handleDecimalParts(val, 4);
//       }
//     }
//     if (Math.abs(+val.slice(val.indexOf("."))) < 0.00000001) {
//       return intlNumberFormat(+(+val), 10);
//     }
//     return "-";
//   } else {
//     if (+val >= 10) {
//       return intlNumberFormat(+val, 2);
//     } else if (+val >= 2) {
//       return intlNumberFormat(+val, 3);
//     } else if (+val >= 1) {
//       return intlNumberFormat(+val, 4);
//     } else if (+val >= 0.0001) {
//       return handleDecimalParts(+val, 4);
//     } else {
//       return intlNumberFormat(+val, 10);
//     }
//   }
// };

// value为要进行保留小数位的数字，count为计数
export const formatDecimalKline = (val: string, coin = "BTC") => {
  if (val && typeof val == "string" && val.indexOf(".") != -1) {
    // if (
    //   coin.toUpperCase() == "USDT" ||
    //   coin.toUpperCase() == "USDC" ||
    //   coin.toUpperCase() == "DAI" ||
    //   coin.toUpperCase() == "BUSD" ||
    //   coin.toUpperCase() == "TUSD" ||
    //   coin.toUpperCase() == "USDP"
    // ) {
    //   return (
    //     val.slice(0, val.indexOf(".")) +
    //     val.slice(val.indexOf("."), val.indexOf(".") + 5)
    //   );
    // }
    // if (coin.toUpperCase() == "PAXG") {
    //   return val.slice(0, val.indexOf("."));
    // }
    if (+val == 0) {
      return "0.0000";
    }
    //console.log(val)
    if (Math.abs(+val.slice(0, val.indexOf("."))) >= 10) {
      return (+val).toFixed(2);
      //return intlNumberFormat(+(val.slice(0, val.indexOf('.')) + val.slice(val.indexOf('.'), val.indexOf('.') + 3)))
    }
    if (Math.abs(+val.slice(0, val.indexOf("."))) >= 2) {
      return (+val).toFixed(3);
      //return intlNumberFormat(+(val.slice(0, val.indexOf('.')) + val.slice(val.indexOf('.'), val.indexOf('.') + 4)))
    }
    if (Math.abs(+val.slice(0, val.indexOf("."))) >= 1) {
      return (+val).toFixed(4);
      //return val.slice(0, val.indexOf('.')) + val.slice(val.indexOf('.'), val.indexOf('.') + 5)
    }
    if (
      Math.abs(+val.slice(val.indexOf("."))) < 0.0001 &&
      Math.abs(+val.slice(val.indexOf("."))) > 0.00000001
    ) {
      return (
        val.slice(0, val.indexOf(".")) +
        val.slice(val.indexOf("."), val.indexOf(".") + 9)
      ).replace(/(0+)$/g, "");
    }
    if (Math.abs(+val.slice(val.indexOf("."))) >= 0.0001) {
      return handleDecimalParts(val, 4);
    }

    return "-";
  } else {
    return +val;
  }
};

export const transferAddress = (address?: string) =>
  address ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;
export const transferMention = (name?: string) => (name ? `@${name}` : name);

export const transferNames = (name?: string, val1?: number, val2?: number) =>
  name && name.startsWith("0x")
    ? `${name.slice(0, val1)}...${name.slice(val2)}`
    : name;

export const isPc = () =>
  typeof document !== "undefined" && document.body.clientWidth > 1024;

const returnS = (num: number) => (num > 1 ? "s" : "");
/**
 *
 * @param {string} date 日期
 * @returns {string} 返回格式化后的日期
 * @des 根据传入的日期时间格式化，今天的返回时分，今年的返回月和日，往年的返回年月
 */

export const formatDate = (timestamp: string | Dayjs) => {
  const now = dayjs();
  const time = typeof timestamp === "string" ? dayjs(+timestamp) : timestamp;
  const diff = dayjs.duration(now.diff(time));
  if (diff.asHours() < 1) {
    const minutes = Math.trunc(diff.asMinutes());
    if (minutes > 0) {
      return `${minutes} min${returnS(minutes)} ago`;
    } else {
      let s = Math.trunc(diff.asSeconds());
      return s > 0 ? `${s}s ago` : "now";
    }
  } else if (diff.asHours() < 24) {
    const hours = Math.trunc(diff.asHours());
    return `${hours} hour${returnS(hours)} ago`;
  } else if (diff.asDays() < 30) {
    const days = Math.trunc(diff.asDays());
    return `${days} day${returnS(days)} ago`;
  } else {
    return time.format("MMM D, YYYY");
  }
};

export const formatDateResearch = (timestamp: string) => {
  const date = dayjs(+timestamp);
  const today = dayjs();
  const day = date.format("YYYY-MM-DD");
  const year = date.format("YYYY");
  const nowDay = today.format("YYYY-MM-DD");
  const nowYear = today.format("YYYY");
  if (year == nowYear) {
    return date.format("MMM D");
  }
  return date.format("MMM D, YYYY");
};

export const numFormat = (num: string | number) => {
  if (Number.isNaN(num) || num === undefined || num === null) {
    return "";
  }
  if (String(num).includes("e")) {
    return Number(num)
      .toFixed(18)
      .replace(/\.?0+$/, "");
  }
  return Math.abs(+num) > 1
    ? intlNumberFormat(+Number(num).toFixed(2), 2)
    : Number(num).toFixed(2);
};

export const checkDetailData = (jsonStr?: string) => {
  if (jsonStr) {
    const data = JSON.parse(jsonStr) as {
      data: string | any[];
      update_time: number;
    };
    const list =
      typeof data.data === "string"
        ? (JSON.parse(data.data) as any[])
        : data.data;
    return list && list.length;
  }
  return false;
};
export const parseDetailData = <T>(defaultVal: T, str?: string) => {
  if (str) {
    const wrapData = JSON.parse(str) as {
      data: T | string;
      update_time: number;
    };
    if (wrapData.data) {
      if (typeof wrapData.data === "string") {
        return JSON.parse(wrapData.data) as T;
      } else {
        return wrapData.data;
      }
    }
  }
  return defaultVal;
};

const uselessTime = dayjs();

export const pearsonCorrelationCoefficient = (
  data1: FormatData[],
  data2: FormatData[]
) => {
  if (data1.length !== data2.length) {
    throw new Error("数据长度不匹配");
  }
  const n = data1.length;
  let sum1: number = 0;
  let sum2: number = 0;
  let sumProduct: number = 0;
  let sumSquare1: number = 0;
  let sumSquare2: number = 0;
  data1.forEach(({ value: value1 }, index) => {
    const value2 = data2[index].value;
    sum1 += value1;
    sum2 += value2;
    sumProduct = sumProduct + value1 * value2;
    sumSquare1 = sumSquare1 + value1 * value1;
    sumSquare2 = sumSquare2 + value2 * value2;
  });
  const mean1 = sum1 / n;
  const mean2 = sum2 / n;

  const covariance = sumProduct / n - mean1 * mean2;
  const stdDev1 = Math.sqrt(sumSquare1 / n - mean1 * mean1);
  const stdDev2 = Math.sqrt(sumSquare2 / n - mean2 * mean2);

  return covariance / (stdDev1 * stdDev2);
};

export const extractDomain = (link: string) => {
  return link
    .replace(/https?:\/\//g, "")
    .split("/")[0]
    .split(".")
    .slice(-2)
    .join(".");
};

export const urlFilter = (url: string) => {
  return url.includes("http")
    ? url.slice(url.indexOf("http"))
    : `http://${url}`;
};

export const copyText = (text: string) => {
  return navigator.clipboard.writeText(text);
};

export const createInviteLink = (inviteCode?: string) => {
  return `${window.location.origin}${window.location.pathname}${
    inviteCode ? `?${INVITE_CODE_KEY}=${inviteCode}` : ""
  }`;
};

export const filterEmptyValue = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj).reduce((res, key) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      res[key as keyof T] = obj[key];
    }
    return res;
  }, {} as T);
};
interface IbrowserReg {
  [Chrome: string]: RegExp;
  IE: RegExp;
  Firefox: RegExp;
  Opera: RegExp;
  Safari: RegExp;
  "360": RegExp;
  QQBrowswe: RegExp;
}

interface IDeviceReg {
  [iPhone: string]: RegExp;
  Android: RegExp;
  iPad: RegExp;
  Windows: RegExp;
  Mac: RegExp;
}

let browserReg: IbrowserReg = {
  Chrome: /Chrome/,
  IE: /MSIE/,
  Firefox: /Firefox/,
  Opera: /Presto/,
  Safari: /Version\/([\d.]+).*Safari/,
  "360": /360SE/,
  QQBrowswe: /QQ/,
};

let deviceReg: IDeviceReg = {
  iPhone: /iPhone/,
  iPad: /iPad/,
  Android: /Android/,
  Windows: /Windows/,
  Mac: /Macintosh/,
};

export const userAgentObj = () => {
  //let userAgentStr:string = navigator.userAgent
  const parser = new UAParser();

  const userAgentObj = {
    browserName: parser.getBrowser().name || "", // 浏览器名称
    browserVersion: parser.getBrowser().version || "", // 浏览器版本
    osName: parser.getResult().os?.name || "", // 操作系统名称
    osVersion: parser.getResult().os?.version || "", // 操作系统版本
    deviceName: parser.getDevice().vendor || "", // 设备名称
    deviceType: parser.getResult()?.device?.model || "Unknown Device", // 社备类型
  };
  // for(let key in browserReg) {
  //   if(browserReg[key].test(userAgentStr)) {
  //     userAgentObj.browserName = key
  //     if(key === 'Chrome') {
  //       userAgentObj.browserVersion = userAgentStr.split('Chrome/')[1].split(' ')[0]
  //     } else if(key === 'IE') {
  //       userAgentObj.browserVersion = userAgentStr.split('MSIE ')[1].split(' ')[1]
  //     } else if(key === 'Firefox') {
  //       userAgentObj.browserVersion = userAgentStr.split('Firefox/')[1]
  //     } else if(key === 'Opera') {
  //       userAgentObj.browserVersion = userAgentStr.split('Version/')[1]
  //     } else if(key === 'Safari') {
  //       userAgentObj.browserVersion = userAgentStr.split('Version/')[1].split(' ')[0]
  //     } else if(key === '360') {
  //       userAgentObj.browserVersion = ''
  //     } else if(key === 'QQBrowswe') {
  //       userAgentObj.browserVersion = userAgentStr.split('Version/')[1].split(' ')[0]
  //     }
  //   }
  // }

  // for(let key in deviceReg){
  //   if(deviceReg[key].test(userAgentStr)){
  //     userAgentObj.osName = key
  //     if(key === 'Windows'){
  //       userAgentObj.osVersion = userAgentStr.split('Windows NT ')[1].split(';')[0]
  //     } else if(key === 'Mac') {
  //       userAgentObj.osVersion = userAgentStr.split('Mac OS X ')[1].split(')')[0]
  //     } else if(key === 'iPhone') {
  //       userAgentObj.osVersion = userAgentStr.split('iPhone OS ')[1].split(' ')[0]
  //     } else if(key === 'iPad') {
  //       userAgentObj.osVersion = userAgentStr.split('iPad; CPU OS ')[1].split(' ')[0]
  //     } else if(key === 'Android') {
  //       userAgentObj.osVersion = userAgentStr.split('Android ')[1].split(';')[0]
  //       userAgentObj.deviceName = userAgentStr.split('(Linux; Android ')[1].split('; ')[1].split(' Build')[0]
  //     }
  //   }
  // }

  return userAgentObj;
};

export const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone ||
  document.referrer.includes("android-app://");

// .
export const isPwa = () =>
  typeof window !== "undefined" && isInStandaloneMode();

export const parseUA = () => {
  const parser = new UAParser();
  const browser = parser.getBrowser();
  const device = parser.getDevice();
  const os = parser.getOS();

  return {
    isIos: os.name === "iOS",
    isAndroid: os.name === "Android",
    isSafari: browser.name?.includes("Safari"),
    isFirefox: browser.name?.includes("Firefox"),
    isChrome: browser.name?.includes("Chrome"),
    isEdg: browser.name?.includes("Edge"),
    isMobile: device.type === "mobile",
    isTablet: device.type === "tablet",
    isPc: device.type !== "mobile" && device.type !== "tablet",
    isTelegram: parseUA.telegram.isTelegram,
  };
};

// parseUA.telegram、parseUA.setIsTelegram 专门用于处理 telegram 的识别逻辑，用法与 parseUA 一致
parseUA.telegram = { _setted: false, isTelegram: false };
parseUA.setIsTelegram = (_isTelegram: boolean) => {
  if (parseUA.telegram._setted) return;
  parseUA.telegram.isTelegram = parseUA().isTelegram || _isTelegram;
  parseUA.telegram._setted = true;
};

export const createBrowserQuery = <T extends {}>() => {
  if (isBrowser) {
    const searchStr = window.location.search.split("?")[1];
    const searchList = searchStr?.split("&") || [];
    return searchList.reduce<Record<string, string>>((map, item) => {
      const [key, value] = item.split("=");
      map[key] = value;
      return map;
    }, {}) as Partial<T>;
  }
  return {} as Partial<T>;
};

export const getOffsetPageTop = (el: HTMLElement | null) => {
  let offsetTop = 0;
  while (el) {
    offsetTop += el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }
  return offsetTop;
};

export const numToString = (num: number | string) => {
  let numStr = String(num).replace(/[^\d\-e.]/g, ""),
    unit = numStr[0] === "-" ? "-" : "";
  if (unit) {
    numStr = numStr.slice(1);
  }
  if (!numStr) {
    return "0";
  }
  let numSplitByEArr = numStr.split("e"),
    expen = parseInt(numSplitByEArr[1] || "0") || 0,
    numSplitByDotArr = (numSplitByEArr[0] || "0").split("."),
    intNum = numSplitByDotArr[0],
    floatNum = numSplitByDotArr[1] || "0";
  if (expen > 0) {
    let pdDecimal = floatNum.padEnd(expen, "0");
    intNum = intNum + pdDecimal.slice(0, expen);
    floatNum = pdDecimal.slice(expen);
  }
  if (expen < 0) {
    let pdInt = intNum.padStart(-expen, "0");
    floatNum = pdInt.slice(expen) + floatNum;
    let pLen = pdInt.length;
    if (pLen > Math.abs(expen)) {
      intNum = pdInt.slice(0, pLen + expen);
    } else {
      intNum = "0";
    }
  }
  return unit + (Number(floatNum || 0) > 0 ? intNum + "." + floatNum : intNum);
};

export const capitalizeFirstLetter = (str: string) => {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const splitNum = (num: string | number, split: string = ",") => {
  let numToStr = numToString(num);
  let unit = numToStr[0] === "-" ? "-" : "";
  let arr = numToStr.replace(/^-/, "").split(".");
  if (arr.length) {
    let intStrArr = arr[0].split("");
    let len = intStrArr.length;
    let splitStr = "";
    for (let i = 0; i < len; i++) {
      if (i > 0 && i % 3 === 0) {
        splitStr = split + splitStr;
      }
      splitStr = intStrArr[len - 1 - i] + splitStr;
    }
    arr[0] = splitStr;
  }
  return unit + arr.join(".");
};

export const jsonParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error(`json parse error: ${str}`);
    console.error(error);
    return {};
  }
};

export const replace0 = (value: string | number) => {
  return String(value).replace(/\.0{3,}/, ".0…0");
};
export const fixedNum = (num: string | number) => {
  let numStr = numToString(num);
  let numSplit = numStr.split(".");
  if (numSplit.length <= 1) {
    return numStr;
  }
  let float = "";
  if (Math.abs(Number(numSplit[0])) == 0) {
    float = numSplit[1]
      .replace(/(0{0,}(?:[1-9]{0,4}))(\d{0,})$/, "$1")
      .replace(/0+$/, "");
    // numSplit[1]=numSplit[1].replace(/([1-9]+)$/,(res:any)=>{
    //   return String(res).substring(0,float);
    // });
  } else {
    float = numSplit[1].substring(0, 4).replace(/0+$/, "");
  }
  if (float) {
    numSplit[1] = float;
    return numSplit.join(".");
  } else {
    return numSplit[0];
  }
};

export const deleteLocale = (path: string) => {
  return path.replace(/^\/zh|\/tc|\/ja\b/, "");
};
/** 获取用户设备信息 */
export function getUserDevice() {
  const parser = new UAParser();
  const { browser, os } = parser.getResult();
  return {
    browser: {
      name: browser.name!,
      version: browser.version!,
    },
    os: {
      name: os.name!,
      version: os.version!,
    },
  };
}

export const replaceImgCros = (str: string = "") => {
  let time = new Date().getTime();
  return String(str || "").replace(
    /<img\s+([^>]*\s)?src=["']([^"].*?)["']/gi,
    (match, group1, src) => {
      if ((!src)||(/\?t=\d+/).test(src)) {
        return match;
      }
      let newSrc = src + "?t=" + time;
      let error=`onerror="if(this.getAttribute('data-o')){this.setAttribute('src',this.getAttribute('data-o'));this.removeAttribute('data-o');this.removeAttribute('crossOrigin');}"`
      return `<img ${group1 || ""} src="${newSrc}" data-o="${src}" ${error} crossOrigin="anonymous" `;
    }
  );
};

type ExchangeNameMap={
  [key:string]:string;
}
const exchangeNameMap: ExchangeNameMap = {
  "okex": "OKX",
  "binance": "BINANCE",
  "coingecko": "COINGECKO",
  "coinmarketcap": "COINMARKETCAP",
  "kucoin": "KUCOIN",
  "coinbase": "COINBASE",
  "kraken": "KRAKEN",
  "gate": "GATE",
  "mexc": "MEXC",
  "uniswap v2(Ethereum)": "UNISWAP V2(ETHEREUM)",
  "uniswap v3(Ethereum)": "UNISWAP V3(ETHEREUM)",
  "bybit": "BYBIT",
  "raydium(Solana)": "RAYDIUM(SOLANA)",
  "orca(Solana)": "ORCA(SOLANA)",
  "uniswap v2(Base)": "UNISWAP V2(BASE)",
  "uniswap v3(Base)": "UNISWAP V3(BASE)",
  "bitget": "BITGET"
};
export const recoverExchangeName = (exchangeName: string): string => {
    if (exchangeName && exchangeNameMap[exchangeName]) {
        return exchangeNameMap[exchangeName];
    }
    return exchangeName;
};

type LanguageConfig = {
  zh?: string;
  en?: string;
  ja?: string;
  tc?: string;
};

export function getCurrentLanguageText(config: LanguageConfig): string {
  // 获取当前的 URL 路径
  const path = window.location.pathname;

  // 定义语言环境的映射
  const languageMap: { [key: string]: keyof LanguageConfig } = {
    'zh': 'zh',
    'en': 'en',
    'ja': 'ja',
    'tc': 'tc'
  };

  // 根据 URL 路径识别语言环境
  let currentLang: keyof LanguageConfig = 'en'; // 默认语言为英文
  for (const key in languageMap) {
    if (path.includes(`/${key}/`)) {
      currentLang = languageMap[key];
      break;
    }
  }

  // 返回对应的语言文本
  return config[currentLang] || '';
}
export const  withResolvers=<T>()=>{
  let resolve = (val: T|PromiseLike<T>) => {},
      reject = (reason?:any) => {},
      promise = new Promise<T>((rs, rj) => {
          resolve = rs;
          reject = rj;
      });
  return { reject, resolve, promise };
}
