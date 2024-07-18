import {
  Button,
  ButtonBase,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getNewsCluster } from "http/research";
import { formatDate, formatDecimal, transferMoney } from "helper/tools";
import { Trash } from "@phosphor-icons/react";
import { getTopGainers } from "http/search";
import HotNewsDialog from "components/operation/research/HotNewsDialog";
import { ThemeContext } from "store/ThemeStore";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ArrowRight from "components/icons/arrow-right.svg";
import { createCurrencyDetailLink } from "helper/link";
import Link from "next/link";
import CollectMenu from "../user/CollectMenu";
import useTgMobileRepairer from "hooks/useTgMobileRepairer";
import { trackGlobalCoinClick, trackCollectAdd, trackGlobalFeedsClick } from "helper/track";

export type MatchedCurrency = {
  id: number;
  count: number;
  fullName: string;
  iconUrl: string;
  name: string;
};

export type News = Omit<
  Research.ClusterNews,
  "entityList" | "matchedCurrencies"
> & {
  entityList: string[];
  matchedCurrencies: MatchedCurrency[];
};

type Props = {
  history: string[];
  onKeywordChange: (keyword: string) => void;
  removeHistory: (value?: string) => void;
  onHotClick?: () => void;
};

const Recommend = ({
  history,
  onKeywordChange,
  removeHistory,
  onHotClick,
}: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [news, setNews] = useState<Array<News>>([]);
  const [topGainers, setTopGainers] = useState<Array<Market.TopGainer>>([]);
  const [selectedPost, setSelectedPost] = useState<Research.ClusterNews>();
  const { selectContent } = useContext(ThemeContext);
  const postDialogOpen = !!selectedPost;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { resetTgRepair } = useTgMobileRepairer(() => scrollRef.current!);
  const closePostDialog = () => {
    setSelectedPost(undefined);
    resetTgRepair();
  };
  const toDetail = ({ currencyFullName }: Market.TopGainer) => {
    router.push(createCurrencyDetailLink({ fullName: currencyFullName }));
  };

  useEffect(() => {
    getNewsCluster({ pageNum: 1, pageSize: 5, status: 0 }).then((res) => {
      const list =
        res.data.list?.map((item) => ({
          ...item,
          entityList: JSON.parse(item.entityList) as string[],
          matchedCurrencies: JSON.parse(
            item.matchedCurrencies
          ) as MatchedCurrency[],
        })) || [];
      setNews(list);
    });
    getTopGainers({ pageNum: 1, pageSize: 5 }).then((res) => {
      setTopGainers(res.data.list || []);
    });
  }, []);
  return (
    <div className="pt-4 h-full flex flex-col items-stretch">
      {!!history.length && (
        <div className="px-4 border-0 border-b border-solid border-[#3D3D3D]">
          <div className="flex items-center justify-between">
            <span className="text-primary text-sm font-bold">
              {t("History")}
            </span>
            <IconButton
              className="text-[#ADADAD]"
              onClick={() => removeHistory()}
            >
              <Trash size={20} />
            </IconButton>
          </div>
          <div className="mt-3 flex items-center gap-x-1 pb-4 w-full overflow-hidden">
            {history.map((value) => (
              <Button
                key={value}
                variant="outlined"
                onClick={() => onKeywordChange(value)}
                endIcon={
                  <Image
                    src="/img/svg/X.svg"
                    width={12}
                    height={12}
                    alt=""
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistory(value);
                    }}
                  />
                }
                className="normal-case text-xs text-[#ADADAD] rounded-full border-[#3D3D3D] h-5 min-w-0 px-2 shrink-0"
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="px-4 pb-4 w-full overflow-hidden">
          <div className="text-base font-bold text-primary-900-White pb-1 leading-7">
            {t("Top Gainers")}
          </div>
          <Table
            className="min-w-0"
            sx={{
              "& .MuiTableCell-head": {
                border: "none",
                background: "none",
                paddingTop: 1,
                paddingBottom: 1,
              },
              "& .MuiTableCell-body": {
                border: "none",
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <TableHead className="border-0 border-t border-b border-solid border-primary-100-700">
              <TableRow>
                <TableCell className="text-xs text-secondary-500-300 px-0">
                  {" "}
                </TableCell>
                <TableCell className="text-xs text-secondary-500-300 px-0">
                  #
                </TableCell>
                <TableCell className="text-xs text-secondary-500-300">
                  {t("Market Cap")}
                </TableCell>
                <TableCell
                  className="text-xs text-secondary-500-300"
                  align="right"
                >
                  {t("Price")}
                </TableCell>
                <TableCell
                  className="text-xs text-secondary-500-300"
                  align="right"
                >
                  24h %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topGainers.map((item, i) => {
                const {
                  iconUrl,
                  baseAsset,
                  symbolAmt,
                  change24hPercent,
                  marketCap,
                  currencyId,
                  symbolId
                } = item;

                return (
                  <TableRow key={i} onClick={() => {toDetail(item);trackGlobalCoinClick({currencyId,symbolId},"","All",i)}}>
                    <TableCell className="w-8 text-sm text-secondary-500-300 px-0">
                      <CollectMenu onCollectSuccess={(sid,bid)=>trackCollectAdd("Global",sid,i,bid)} currencyId={currencyId} />
                    </TableCell>
                    <TableCell className="text-sm text-secondary-500-300 px-0">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={iconUrl || "/img/svg/CoinVertical.svg"}
                          width={32}
                          height={32}
                          alt=""
                        />
                        <div className="ml-2 flex flex-col">
                          <span className="text-sm font-semibold text-primary-900-White">
                            {baseAsset}
                          </span>
                          <span className="text-xs text-secondary-500-300">
                            ${transferMoney(+marketCap)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-primary-900-White text-sm"
                      align="right"
                    >
                      ${formatDecimal(symbolAmt)}
                    </TableCell>
                    <TableCell
                      className={`text-sm ${change24hPercent > 0
                          ? "text-success-600-500"
                          : "text-error-600-500 "
                        }`}
                      align="right"
                    >
                      {change24hPercent < 0 && "-"}
                      {change24hPercent.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mx-4 py-4 px-6 rounded-xl border border-solid border-[rgba(255,79,32,0.12)] bg-[linear-gradient(180deg,rgba(255,79,32,0.10)_0%,rgba(255,79,32,0.00)_100%)]">
          <div className="text-base font-bold text-primary-900-White flex items-center justify-between">
            {t("Trending")}
            <ButtonBase
              onClick={onHotClick}
              className="flex items-center text-accent-600 no-underline"
            >
              {t("More")} <ArrowRight className="ml-2" />
            </ButtonBase>
          </div>
          <div className="mt-1">
            {news.map((item, index) => (
              <div
                key={index}
                onClick={() =>{setSelectedPost(item as any);trackGlobalFeedsClick(item.id,"","All",index)}}
                className="mt-4"
              >
                <div className="flex">
                  <span
                    className={`text-xs font-bold text-accent-600 leading-5`}
                  >
                    {index + 1}
                  </span>
                  <div className="text-sm font-semibold text-primary-900-White ml-3">
                    {selectContent(item, "title", "hot")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HotNewsDialog
        selectedPost={selectedPost}
        open={postDialogOpen}
        onClose={closePostDialog}
      />
    </div>
  );
};

export default Recommend;
