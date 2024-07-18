import { useNetwork } from "hooks/useNetwork";
import React, { useRef, useState } from "react";
import NoInternetIcon from "components/icons/NoInternet.svg";
import WeakInternetIcon from "components/icons/WeakInternet.svg";
import RestoreInternetIcon from "components/icons/RestoreInternet.svg";
import { useUpdateEffect } from "ahooks";
import useWeakNetworkState from "hooks/useWeakNetworkState";

export enum NetworkStatus {
  OFFLINE = "OFFLINE",
  GOOD = "GOOD",
  SLOW = "SLOW",
}

const FADEOUT_TIME = 4000;

const CLASSES_MAP = {
  [NetworkStatus.OFFLINE]: "bg-[rgba(218,46,33,0.15)] text-error-600-500",
  [NetworkStatus.GOOD]: " bg-success-600-500 text-white",
  [NetworkStatus.SLOW]: "bg-[rgba(255,179,0,0.15)] text-warning-600-500",
};

const TEXT_MAP = {
  [NetworkStatus.OFFLINE]: "No Internet Connection.",
  [NetworkStatus.GOOD]: "Internet Connection Restored.",
  [NetworkStatus.SLOW]: "Weak Internet Connection.",
};

const ICON_MAP = {
  [NetworkStatus.OFFLINE]: NoInternetIcon,
  [NetworkStatus.GOOD]: RestoreInternetIcon,
  [NetworkStatus.SLOW]: WeakInternetIcon,
};

export default function NetworkTips() {
  const [visible, setVisible] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);

  const autoResetVisibleTimer = useRef<NodeJS.Timeout | null>(null);

  const { online } = useNetwork();

  const { weakNetworkState } = useWeakNetworkState();

  useUpdateEffect(() => {
    if (autoResetVisibleTimer.current) {
      clearTimeout(autoResetVisibleTimer.current);
    }
    // 无网 => online变成false
    if (!online) {
      setNetworkStatus(NetworkStatus.OFFLINE);
      setVisible(true);
    } else if (online && !weakNetworkState) {
      // 从弱网状态/无网状态恢复为正常网络 => online为true且weakNetworkState为false
      // 延迟1s设置以避免从无网到弱网weakNetworkState来不及切换状态
      const timer = setTimeout(() => {
        setNetworkStatus(NetworkStatus.GOOD);
        setVisible(true);
        // 4秒后自动消失
        autoResetVisibleTimer.current = setTimeout(() => {
          setVisible(false);
        }, FADEOUT_TIME);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    } else if (online && weakNetworkState) {
      // 弱网 => weakNetworkState变成true且online为true
      setNetworkStatus(NetworkStatus.SLOW);
      setVisible(true);
    }
  }, [online, weakNetworkState]);

  const Icon = networkStatus ? ICON_MAP[networkStatus] : null;

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`flex items-start justify-center text-xs text-center font-bold leading-4 px-4 py-1 ${
        networkStatus ? CLASSES_MAP[networkStatus] : ""
      }`}
      onClick={() => {
        setVisible(false);
      }}
    >
      {Icon && <Icon className="mr-1.5" />}
      {networkStatus ? TEXT_MAP[networkStatus] : ""}
    </div>
  );
}
