import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { usePriceWSData } from "store/WSStore/usePriceWSData";
import { formatDecimal } from "helper/tools";
import { useRouter } from "next/router";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
import { collect, unCollect } from "http/user";

type Props = {
  marketsData: API.Quotation24H[];
};

const Exchange = ({ marketsData }: Props) => {
  const { price1d } = usePriceWSData();
  // const liveMarketsData = React.useMemo(() => {
  //     if (!price1d) {
  //         return marketsData
  //     } else {
  //         const price1dMap = price1d.reduce<Record<string, API.AbbrMarket>>((map, market) => (map[market.s] = market, map), {})
  //         return marketsData.map((market) => {
  //             if (price1dMap[market.s]) {
  //                 const { P, p, c } = price1dMap[market.s]
  //                 return { ...market, P, p, c }
  //             } else {
  //                 return market
  //             }
  //         })
  //     }
  // }, [marketsData, price1d])
  return (
    <div>
      <div className="text-[#E5E5E5] text-sm font-medium py-4 pl-3">
        Exchange
      </div>
      <div className="mb-0.5 text-[#BBBBBB]">
        <div className="flex items-center h-9 font-bold text-sm">
          <span className="overflow-hidden text-center basis-[10%]">#</span>
          <span className="overflow-hidden basis-[30%]">Exchange</span>
          <span className="overflow-hidden basis-[30%] whitespace-nowrap">
            24H Volume (%)
          </span>
          <span className="overflow-hidden basis-[30%]">Monthly Visits</span>
        </div>
        <List className="py-0">
          {[].map(({ s, c, p, P }, index) => (
            <ListItem className="p-0" key={index}>
              <ListItemButton
                className={`h-12 p-0 group hover:bg-[#292929] text-xs`}
              >
                <span className="text-center basis-[10%]">{index + 1}</span>
                <span className="basis-[30%]">{s}</span>
                <span className="basis-[30%]">{s}</span>
                <span className="basis-[30%]">{s}</span>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Exchange;
