import dayjs from "dayjs";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { formatDate, transferMoney } from "helper/tools"
import BannerGroup from "components/base/BannerGroup";
import Slider from "../Slider";
import { ETFTab } from "..";

interface Props {
  type: ETFTab // hkBTC hkETH
  netInflow: number
  netInflowTime: string
  cumNetInflow: number
  cumNetInflowTime: string
  totalVolume: number
  volumeTime: string
  netAssets: number
  netAssetsChange: number
  totalNavTime: string
  top?: any
}

const HKBanner = (props: Props) => {
  const {
    type,
    netInflow,
    netInflowTime,
    cumNetInflow,
    cumNetInflowTime,
    totalVolume,
    volumeTime,
    netAssets,
    netAssetsChange,
    totalNavTime,
    top,
  } = props
  const { t } = useTranslation(["etf"]);

  const bannerList = [
    [
      {
        title: type === ETFTab.HKBTCSpot ? t("Daily Total BTC Inflow") : t("Daily Total ETH Inflow"),
        content: (
          <span className={`${netInflow > 0 ? "text-success-600-500" : (netInflow === 0 ? '' : "text-error-600-500")}`}>
            {netInflow === 0 ? '0.00' : transferMoney(netInflow)}
          </span>
        ),
        description: `${t("As of")}${dayjs(netInflowTime).format("MMM D")}`,
      },
      {
        title: type === ETFTab.HKBTCSpot ? t("Total BTC in HK ETF") : t("Total ETH in HK ETF"),
        content: (
          <span className={`${cumNetInflow > 0 ? "text-success-600-500" : (cumNetInflow === 0 ? '' : 'text-error-600-500')}`}>
            {cumNetInflow === 0 ? '0.00' : transferMoney(cumNetInflow)}
          </span>
        ),
        description: `${t("As of")}${dayjs(cumNetInflowTime).format("MMM D")}`,
      }
    ],
    [
      {
        title: t("total volume Traded"),
        content: totalVolume ? `$${transferMoney(totalVolume)}` : '0',
        description: `${t("As of")}${dayjs(volumeTime).format("MMM D")}`,
      },
      {
        title: t("total Net Assets"),
        content: (
          <div className="flex items-center">
            {netAssets ? `$${transferMoney(netAssets)}` : "0"}
            <span className="text-secondary-500-300 text-xs leading-none inline-flex items-center">
              <Image
                src={`/img/btc-imgs/${type === ETFTab.HKBTCSpot ? 'Bitcoin' : 'Ethereum'}.png`}
                width={16}
                height={16}
                alt=""
                className="rounded-full mx-1"
              />
              {netAssetsChange === 0 ? '0%' : `${(netAssetsChange * 100).toFixed(2)}%`}
            </span>
          </div>
        ),
        description: `${t("As of")}${dayjs(totalNavTime).format("MMM D")}`,
      },
    ],
    [
      {
        title: t("Intraday Peak Prem./Dsc."),
        content: (
          <div className="flex items-center">
            <span className={`mr-1 ${top?.premDsc ? "text-success-600-500" : "text-error-600-500"}`}>
              {top && (+top.premDsc).toFixed(2)}%{" "}
            </span>
            {/* 币种类型未知 */}
            <span className="text-secondary-500-300 text-xs leading-none inline-flex items-center">
              {top && t(top?.inst)} {top?.fiatMoney}
            </span>
          </div>
        ),
        description: `${t("Last update")}: ${top && formatDate(top?.timestamp)}`,
      },
    ]
  ]

  return (
    <Slider>
      {bannerList.map((b, i) => <BannerGroup key={i} group={b} />)}
    </Slider>
  )
}

export default HKBanner
