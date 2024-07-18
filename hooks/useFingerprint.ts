import { parseUA } from "helper/tools";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

/** 
 * 生成用户设备指纹，用于判定用户设备是否为新设备
 * - 新设备定义：通过 ip地址、操作系统 和 浏览器，三者共同组成设备指纹。如果其中之一发生变化，即认为是新设备
 * @see https://nkhxy47v6o.larksuite.com/docx/R9dndQZDfom2YIxV1ijubocxsNe
 */
const useFingerprint = () => {
  const getFingerprint = () => {
    const ua = new UAParser();
    const { os, browser: { name, version } } = ua.getResult();
    const ans = {
      os: `${os.name}-${os.version}`,
      browser: { name, version },
    }
    return Buffer.from(JSON.stringify(ans)).toString("base64");
  }

  return { getFingerprint };
}

export default useFingerprint;
