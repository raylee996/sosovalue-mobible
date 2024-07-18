import React, { useEffect, useState } from "react";
import { useMount } from "ahooks";
import useDayjsLocale from "hooks/useDayjsLocale";
import { updateQuery } from "helper";
import Tabs from "./Tabs";
import USBTC from "./USBTC";
import HKETF from "./hk";
type Props = {
  page: number;
};
// 历史遗留，不可修改
export enum ETFTab {
  USBTCSpot = 1,
  HKBTCSpot,
  HKETHSpot,
}

const Index = ({ page }: Props) => {
  const [activeKey, setActiveKey] = useState<string>(); // 不设置默认值

  useDayjsLocale();

  const items = [
    {
      key: "USBTCSpot",
      label: "US BTC Spot",
      link: "/assets/etf/us-btc-spot",
      children: (
        <USBTC
          type={ETFTab.USBTCSpot}
          nameList={[
            "Etf_btc_Fund_flow",
            "Etf_btc_Total_Net_Assets_Value",
            "AHR999_Indicator_value",
          ]}
        />
      ),
    },
    {
      key: "HKBTCSpot",
      label: "HK BTC Spot",
      link: "/assets/etf/hk-btc-spot",
      children: (
        <HKETF
          type={ETFTab.HKBTCSpot}
          nameList={[
            "Etf_hk_btc_Fund_flow",
            "Etf_hk_btc_Cum_Fund_flow",
            "Etf_hk_btc_Total_Net_Assets_Value",
            "AHR999_Indicator_value",
          ]}
        />
      ),
    },
    {
      key: "HKETHSpot",
      label: "HK ETH Spot",
      link: "/assets/etf/hk-eth-spot",
      children: (
        <HKETF
          type={ETFTab.HKETHSpot}
          nameList={[
            "Etf_hk_eth_Fund_flow",
            "Etf_hk_eth_Cum_Fund_flow",
            "Etf_hk_eth_Total_Net_Assets_Value",
            "etf_eth_daily_amount",
          ]}
        />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  useEffect(() => {
    handleTabChange(items[page].key);
  }, [page]);

  return (
    <div className="p-4">
      <Tabs
        items={items}
        activeKey={activeKey}
        //onChange={handleTabChange} 点击改成链接
      />
    </div>
  );
};

export default Index;
