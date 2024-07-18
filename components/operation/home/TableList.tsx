/* eslint-disable react/display-name */
import React, { ComponentPropsWithoutRef, RefObject, forwardRef, useEffect, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  TableVirtuoso,
  TableComponents,
  TableVirtuosoHandle,
} from "react-virtuoso";
import Link from "next/link";
import Image from "next/image";
import CollectMenu from "../user/CollectMenu";
import BgFadeAnimate from "components/base/BgFadeAnimate";
import {
  formatDecimal,
  isBrowser,
  replace0,
  transferMoney,
} from "helper/tools";
import { Nature, createCurrencyDetailLink } from "helper/link";
import Star from "components/icons/star.svg";
import { useMediaQuery } from "@mui/material";
import { trackCoinListClick, trackCollectAdd } from "helper/track";
interface ColumnData {
  dataKey?: string;
  label?: string;
  scrollToTop?: boolean;
  numeric?: any;
  width?: number;

  changeCoin?: (data: any) => void;
  handleScroll?: () => void;

  renderCell?: (value: any, index: number, row: any) => React.ReactNode;
}
export type Props<T = any, U = any> = {
  rows: API.MarketCap[] | undefined;
  columns?: ColumnData[];
  currentSort?: string;
  orderBy?: string;
  scrollToTop?: boolean;
  isSocket: boolean;
  changeCoin?: (key: string, orderBy: string) => void;
  changeOrderBy?: (val: string) => void;
  handleScroll?: () => void;
  changeCurrentSort?: (val: string) => void;
  changeScrollTo: (val: boolean) => void;
  scrollRef?: RefObject<HTMLElement>;
};

const VirtuosoTableComponents: TableComponents<API.MarketCap> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer {...props} ref={ref} />
  )),
  Table: (props: any) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: forwardRef((props: ComponentPropsWithoutRef<'thead'>, ref) => (
    <TableHead ref={ref} {...props} />
  )),
  TableRow: ({ item: _item, ...props }) => (
    // <TableRow {...props} key={_item.id} classes={{ root: "table-tr" }} />
    <TableRow {...props} key={_item.id} />
  ),
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const TableList = ({
  rows,
  columns,
  currentSort,
  orderBy,
  scrollToTop,
  isSocket,
  changeScrollTo,
  scrollRef
}: Props) => {
  const virtuoso = useRef<TableVirtuosoHandle>(null);


  const matches = useMediaQuery("(min-width:390px)")

  useEffect(() => {
    if (scrollToTop) {
      virtuoso?.current?.scrollToIndex(0);
      changeScrollTo(false);
    }
  }, [scrollToTop]);
  const rowContent = (_index: number, item: any) => {
    return (
      <td className="bg-background-primary-White-900" key={`tr_${item.coin}_${_index}`}>
        <div className="py-2 flex items-center justify-between">
          <div className="w-[20px] min-h-1 flex items-center justify-center">
            <CollectMenu
              onCollectSuccess={(sid,bid)=>trackCollectAdd("Home",sid,_index,bid)}
              currencyId={item.coinId}
              className={`${!isSocket ? "text-[#5C5C5C]" : "text-[#adadad]"}`}
            />
          </div>
          <Link
            onClick={()=>trackCoinListClick("Home",item.symbolId,_index,item.coinId)}
            href={createCurrencyDetailLink({
              fullName: item.fullName,
            })}
            className="flex-1 flex text-sm  items-center justify-between no-underline text-primary-900-white"
          >
            <div className={`w-[40px] text-center text-xs`}>
              <span
                className={`${!isSocket ? "text-[#5C5C5C]" : "text-secondary-500-300"
                  }`}
              >
                {_index + 1}
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <Image
                src={item.coinImg}
                width={matches ? 20 : 28}
                height={matches ? 20 : 28}
                alt=""
                className="rounded-full"
              />
              <div className="ml-0.5 flex flex-col xs:flex-row xs:items-center xs:gap-1">
                <div
                  className={`text-sm ${item.coin?.length > 6 ? "xs:text-xs" : "text-sm"} font-bold ${!isSocket ? "text-[#5C5C5C]" : ""
                    }  max-w-[200px] truncate`}
                >
                  {item.coin}
                </div>
                <div
                  className={`text-xs ${!isSocket ? "text-[#5C5C5C]" : "text-secondary-500-300"
                    }`}
                >
                  ${transferMoney(+item.marketCap)}
                </div>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className={`font-semibold ${item.coin?.length > 6 ? "xs:text-xs" : "text-sm"} whitespace-nowrap ${!isSocket ? "text-[#5C5C5C]" : ""}`}>
                <span>$</span>
                <span key={`price_${item.coin}_${_index}`}>{replace0(formatDecimal(item.price))}</span>
              </div>
            </div>
            <div className="font-medium min-w-[60px] max-w-[80px] text-right">
              {+item.changePercent > 0 && (
                <span
                  className={`${!isSocket ? "text-[#5C5C5C]" : "text-success-600-500"
                    }`}
                >
                  <BgFadeAnimate value={item.changePercent}>
                    +{(+item.changePercent).toFixed(2)}%
                  </BgFadeAnimate>
                </span>
              )}
              {+item.changePercent < 0 && (
                <span
                  className={`${!isSocket ? "text-[#5C5C5C]" : "text-error-600-500"
                    }`}
                >
                  <BgFadeAnimate value={item.changePercent}>
                    {(+item.changePercent).toFixed(2)}%
                  </BgFadeAnimate>
                </span>
              )}
              {+item.changePercent === 0 && (
                <span
                  className={`ml-2.5 ${!isSocket ? "text-[#5C5C5C]" : "text-primary-900-White"
                    }`}
                >
                  0.00%
                </span>
              )}
              {item.changePercent === "-" && (
                <span
                  className={`ml-2.5 text-right block ${!isSocket ? "text-[#5C5C5C]" : "text-primary-900-White"
                    }`}
                >
                  -
                </span>
              )}
            </div>
          </Link>
        </div>
      </td>
    );
  };

  return (
    <TableVirtuoso
      initialItemCount={30}
      useWindowScroll
      customScrollParent={isBrowser && scrollRef?.current ? scrollRef?.current : undefined}
      data={rows}
      ref={virtuoso}
      id="table_report"
      components={VirtuosoTableComponents}
      itemContent={rowContent}
      className="rounded-none bg-none bg-transparent overflow-x-auto shadow-none"
    />
  );
};

export default TableList;
