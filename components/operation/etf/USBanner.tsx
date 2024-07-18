import dayjs from "dayjs";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { transferMoney } from "helper/tools"
import BannerGroup from "components/base/BannerGroup";
import Slider from "./Slider";

interface Props {
  lastNetInflow: number
  netInflowTime: string
  totalNetInflow: number
  cumNetInflowTime: string
  totalVolume: number
  volumeTime: string
  totalNetAssets: number
  totalNetAssetsChange: number
  totalNavTime: string
}

const USBanner = (props: Props) => {
  const {
    netInflowTime,
    cumNetInflowTime,
    totalVolume,
    volumeTime,
    totalNavTime,
    lastNetInflow,
    totalNetInflow,
    totalNetAssets,
    totalNetAssetsChange,
  } = props
  const { t } = useTranslation(["etf"]);

  const _totalNetInflow = +lastNetInflow + +totalNetInflow

  const bannerList = [
    [
      {
        title: t("total NetInflow"),
        content: (
          <span className={`${totalNetInflow > 0 ? "text-success-600-500" : (totalNetInflow === 0 ? '' : "text-error-600-500")}`}>
            {totalNetInflow >= 0 ? `$${transferMoney(totalNetInflow)}` : `-$${transferMoney(Math.abs(totalNetInflow))}`}
          </span>
        ),
        description: `${t("As of")}${dayjs(netInflowTime).format("MMM D")}`,
      },
      {
        title: t("Cumulative Total Net Inflow"),
        content: (
          <span className={`${_totalNetInflow > 0 ? "text-success-600-500" : (_totalNetInflow === 0 ? '' : "text-error-600-500")}`}>
            {_totalNetInflow >= 0 ? `$${transferMoney(_totalNetInflow)}` : `-$${transferMoney(Math.abs(_totalNetInflow))}`}
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
            {totalNetAssets ? `$${transferMoney(totalNetAssets)}` : "0"}
            <span className="text-secondary-500-300 text-xs leading-none inline-flex items-center">
              <Image
                src={`/img/BTC.svg`}
                width={16}
                height={16}
                alt=""
                className="rounded-full mx-1"
              />
              {totalNetAssetsChange === 0 ? '0%' : `${(totalNetAssetsChange * 100).toFixed(2)}%`}
            </span>
          </div>
        ),
        description: `${t("As of")}${dayjs(totalNavTime).format("MMM D")}`,
      }
    ]
  ]

  return (
    <Slider>
      {bannerList.map((b, i) => <BannerGroup key={i} group={b} />)}
    </Slider>
  )
}

export default USBanner
