import React from "react";
import dayjs from "dayjs";
import {
  extractDomain,
  fixedNum,
  numFormat,
  splitNum,
  transferMoney,
  urlFilter,
} from "helper/tools";
import { useTranslation } from "next-i18next";
import { Button, Divider } from "@mui/material";
import WhitePaper from "components/icons/whitepaper.svg";
import Website from "components/icons/website.svg";
import { InfoMenu } from "components/operation/currency/CurrencyDetail";
import Link from "next/link";
type Props = {
  currencySymbolInfo?: API.CurrencySymbolInfo;
  price: string | number;
  change: string | number;
  info: any;
};
const format = (time?: string) =>
  time ? dayjs(+time).format("YYYY-MM-DD") : "";
const Statistic = ({ currencySymbolInfo, price, change, info }: Props) => {
  const { t } = useTranslation("portfolio");
  const { t: tHome } = useTranslation("home");
  const generalData = React.useMemo(() => {
    const sort = currencySymbolInfo?.sort;
    const currentPrice = Number(price);
    const currencyDataDoVO = currencySymbolInfo?.currencyDataDoVO;
    const volume = currencyDataDoVO?.volume || 0;
    const currentSupply = Number(currencyDataDoVO?.currentSupply || 0);
    const maxSupply = Number(currencyDataDoVO?.maxSupply);
    const totalSupply = Number(currencyDataDoVO?.totalSupply) || currentSupply;
    return {
      volume,
      turnoverRate:
        currentPrice && currentSupply
          ? (Number(volume) / (currentPrice * currentSupply)) * 100
          : 0,
      downFromATH: currentPrice
        ? (-(Number(currencyDataDoVO?.allTimeHigh) - currentPrice) /
            Number(currencyDataDoVO?.allTimeHigh)) *
          100
        : 0,
      upFromLow: currentPrice
        ? ((currentPrice - Number(currencyDataDoVO?.cycleLow)) /
            Number(currencyDataDoVO?.cycleLow)) *
          100
        : 0,
      marketCap: currentPrice ? currentPrice * currentSupply : 0,
      totalSupply,
      fdv: currentPrice ? currentPrice * (maxSupply || totalSupply) : 0,
      maxSupply,
      sort,
    };
  }, [currencySymbolInfo, price]);
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 py-2 px-1 rounded-lg border items-center border-solid border-primary-100-700 bg-background-primary-White-900">
        <div className="flex-1">
          <div className="text-xs text-secondary-500-300 text-center mb-0.5">
            {t("Volume")}
          </div>
          <div className="text-sm text-primary-900-White font-semibold flex items-center justify-center">
            ${transferMoney(generalData?.volume)}
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="h-6 self-center" />
        <div className="flex-1">
          <div className="text-xs text-secondary-500-300 text-center mb-0.5">
            {t("Market cap")}
            {/* <span className="mr-2 bg-[#1A1A1A] px-1 rounded-sm">
              #{generalData.sort}
            </span> */}
          </div>
          <div className="text-sm text-primary-900-White font-semibold flex items-center justify-center">
            ${transferMoney(generalData?.marketCap)}
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="h-6 self-center" />
        <div className="flex-1">
          <div className="text-xs text-secondary-500-300 text-center mb-0.5">
            {t("FDV")}
          </div>
          <div className="text-sm text-primary-900-White font-semibold flex items-center justify-center">
            ${transferMoney(generalData?.fdv)}
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="h-6 self-center" />
        <div className="flex-1">
          <div className="text-xs text-secondary-500-300 text-center mb-0.5">
            {t("Turnover rate")}
          </div>
          <div className="text-sm text-primary-900-White font-semibold flex items-center justify-center">
            {numFormat(generalData?.turnoverRate.toFixed(2))}%
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("Circulating supply")}
          </div>
          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            {currencySymbolInfo &&
              transferMoney(
                +currencySymbolInfo?.currencyDataDoVO?.currentSupply
              )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("Total supply")}
          </div>
          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            {transferMoney(generalData.totalSupply)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("Max supply")}
          </div>
          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            {generalData.maxSupply ? transferMoney(generalData.maxSupply) : "∞"}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("All time high")}
          </div>
          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            $
            {splitNum(
              fixedNum(currencySymbolInfo?.currencyDataDoVO?.allTimeHigh || 0)
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("All Time High Date")}
          </div>
          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            {/* {dayjs(
              currencySymbolInfo &&
                +currencySymbolInfo?.currencyDataDoVO?.athDate
            ).format("MMM DD, YYYY")} */}
            {dayjs(
              currencySymbolInfo &&
                +currencySymbolInfo?.currencyDataDoVO?.athDate
            ).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("Down from all time high")}
          </div>
          <div
            className={`text-sm font-medium leading-6 flex items-center ${
              generalData?.downFromATH > 0
                ? "text-success-600-500"
                : "text-error-600-500"
            }`}
          >
            {/* <ArrowDropDownIcon className={`text-lg ${generalData.downFromATH > 0 ? 'text-rise rotate-180' : 'text-fall'}`} /> */}
            {numFormat(generalData.downFromATH)}%
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">{t("Cycle low")}</div>
          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            $
            {splitNum(
              fixedNum(currencySymbolInfo?.currencyDataDoVO?.cycleLow || 0)
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("Cycle low date")}
          </div>

          <div className="text-sm font-medium text-primary-900-White leading-6 flex items-center">
            {/* {dayjs(
              currencySymbolInfo &&
                +currencySymbolInfo?.currencyDataDoVO?.cycleLowDate
            ).format("MMM DD, YYYY")} */}
            {dayjs(
              currencySymbolInfo &&
                +currencySymbolInfo?.currencyDataDoVO?.cycleLowDate
            ).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-500-300">
            {t("Up from cycle low")}
          </div>
          <div
            className={`text-sm font-medium leading-6 flex items-center ${
              generalData?.upFromLow > 0
                ? "text-success-600-500"
                : "text-error-600-500"
            }`}
          >
            {/* <ArrowDropDownIcon className={`text-lg ${generalData.upFromLow > 0 ? 'text-rise rotate-180' : 'text-fall'}`} /> */}
            {generalData?.upFromLow > 0 ? "+" : ""}
            {numFormat(generalData.upFromLow)}%
          </div>
        </div>
      </div>
      {/* info */}
      <div className="text-primary-900-white text-lg font-bold leading-8 mb-4">
        {tHome("Info")}
      </div>
      {info.white_paper_link && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-secondary-500-300 text-sm leading-6">
            {tHome("White paper")}
          </div>
          <Link href={urlFilter(info.white_paper_link)} target="_blank">
            <Button
              startIcon={<WhitePaper className=" text-primary-800-50 mr-1" />}
              className="text-sm py-1 rounded-lg px-2 text-primary-900-White normal-case bg-secondary-50-800 m-0"
            >
              {tHome("White paper")}
            </Button>
          </Link>
        </div>
      )}
      {info.website && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-secondary-500-300 text-sm leading-6">
            {tHome("Website")}
          </div>

          {/* {info.website.map((link: any, index: number) => (
            <Link key={index} href={urlFilter(link)} target="_blank">
              <Button
                startIcon={<Website className=" text-primary-800-50" />}
                className="text-sm py-1 rounded-lg px-2 text-primary-900-White normal-case bg-secondary-50-800 m-0"
              >
                {extractDomain(link)}
              </Button>
            </Link>
          ))} */}
          <div className="">
            <InfoMenu
              icon={<Website className=" text-primary-800-50" />}
              options={info.website.map((link: any, index: number) => ({
                label: extractDomain(link),
                value: urlFilter(link),
              }))}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="text-secondary-500-300 text-sm leading-6">
          {tHome("Wallets")}
        </div>
        <div className="">
          <InfoMenu
            options={info.wallets.map(
              ({ walletName, walletUrl }: any, index: number) => ({
                label: extractDomain(walletName),
                value: urlFilter(walletUrl),
              })
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-secondary-500-300 text-sm leading-6">
          {tHome("Explorers")}
        </div>
        <div className="">
          <InfoMenu
            options={info.explorers.map((link: any, index: number) => ({
              label: extractDomain(link),
              value: urlFilter(link),
            }))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-secondary-500-300 text-sm leading-6">
          {tHome("Community")}
        </div>
        <div className="">
          <InfoMenu
            options={info.community.map(
              ({ name, link }: any, index: number) => ({
                label: name,
                value: urlFilter(link),
              })
            )}
          />
        </div>
      </div>
      {info.source_code && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-secondary-500-300 text-sm leading-6">
            {tHome("Source code")}
          </div>

          <div className="">
            <InfoMenu
              options={info.source_code.map((link: any, index: number) => ({
                label: extractDomain(link),
                value: urlFilter(link),
              }))}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="text-secondary-500-300 text-sm leading-6">
          {tHome("Sector")}
        </div>
        <div className="text-primary-900-White leading-6 px-2 py-1 rounded-lg bg-secondary-50-800 w-auto inline-block text-sm">
          {info.category?.map(({ name }: any) => name).join(",")}
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-secondary-500-300 text-sm leading-6">
          {tHome("First issue time")}
        </div>
        <div className="text-primary-900-White leading-6 text-sm">
          {info.first_issue_time &&
            dayjs(+info?.first_issue_time).format("MMM DD, YYYY")}
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-secondary-500-300 text-sm leading-6">
          {tHome("Genesis block time")}
        </div>
        <div className="text-primary-900-White leading-6 text-sm">
          {info.genesis_block_time &&
            dayjs(+info?.genesis_block_time).format("MMM DD, YYYY")}
        </div>
      </div>
    </div>
  );
};

export default Statistic;
