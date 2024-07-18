import { useEffect, useState } from "react";
import { transferMoney } from "helper/tools";
import { useTranslation } from "next-i18next";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Image from "next/image";
require("dayjs/locale/zh-cn");
require("dayjs/locale/zh-tw");
require("dayjs/locale/ja");
type Props = {
  lastNetInflow: number;
  cumNetInflowTime: string;
  totalNetInflow: number;
  totalNavTime: string;
  totalNetAssets: number;

  totalNetAssetsChange: number;
};

const MarketCap = ({
  cumNetInflowTime,
  totalNetInflow,
  lastNetInflow,
  totalNavTime,
  totalNetAssets,

  totalNetAssetsChange,
}: Props) => {
  const { t } = useTranslation(["etf"]);
  const [show, setShow] = useState(true);
  const router = useRouter();
  const [parentRef] = useAutoAnimate((el, action) => {
    let keyframes: Keyframe[] = [];
    // supply a different set of keyframes for each action
    if (action === "add") {
      keyframes = [
        { transform: "translateY(-20px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ];
    }
    // keyframes can have as many "steps" as you prefer
    // and you can use the 'offset' key to tune the timing
    if (action === "remove") {
      keyframes = [
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(20px)", opacity: 0 },
      ];
    }
    return new KeyframeEffect(el, keyframes, {
      duration: 300,
      easing: "ease-in-out",
    });
  });
  useEffect(() => {
    const timer = setInterval(() => setShow((show) => !show), 8000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (router.locale == "zh") {
      dayjs.locale("zh-cn");
    } else if (router.locale == "tc") {
      dayjs.locale("zh-tw");
    } else if (router.locale == "ja") {
      dayjs.locale("ja");
    } else {
      dayjs.locale("en");
    }
  }, [router.locale]);
  return (
    <div className="h-full">
      <div className="relative group h-full">
        <div className="w-full h-full bg-block-color shadow-area rounded-lg text-white cursor-pointer">
          <div
            className="w-full h-full relative overflow-hidden"
            ref={parentRef}
          >
            {show ? (
              <div
                key={0}
                className="w-full h-full flex flex-col justify-center bg-block-color shadow-area rounded-lg text-white cursor-pointer"
              >
                <div className="text-xs bg-block-color text-[#D6D6D6]">
                  {t("Cumulative Total Net Inflow")}
                </div>
                <div className="mt-1 bg-block-color text-sm font-bold text-[#fff] flex flex-wrap items-center">
                  <span
                    className={`mr-2 ${
                      +lastNetInflow + +totalNetInflow >= 0
                        ? "text-rise"
                        : "text-fall"
                    }`}
                  >
                    {+lastNetInflow + +totalNetInflow >= 0
                      ? "$" + transferMoney(+lastNetInflow + +totalNetInflow)
                      : "-$" +
                        transferMoney(
                          Math.abs(+lastNetInflow + +totalNetInflow)
                        )}
                  </span>
                </div>
                <div className="text-xs text-[#ADADAD]">
                  {t("As of")}
                  {dayjs(cumNetInflowTime).format("MMM D")}
                </div>
              </div>
            ) : (
              <div
                key={1}
                className="w-full h-full flex flex-col justify-center bg-block-color shadow-area rounded-lg text-white cursor-pointer"
              >
                <div className="text-xs bg-block-color text-[#D6D6D6]">
                  {t("total Net Assets")}
                </div>
                <div className="mt-1 bg-block-color text-sm font-bold text-[#fff] flex flex-wrap items-center">
                  <span className={`mr-2 `}>
                    {totalNetAssets ? "$" + transferMoney(totalNetAssets) : ""}
                  </span>
                  <Image
                    src="/img/BTC.svg"
                    width={16}
                    height={16}
                    alt=""
                    className=" rounded-full mx-1"
                  />
                  {totalNetAssetsChange > 0 && (
                    <span>{(totalNetAssetsChange * 100).toFixed(2)}%</span>
                  )}
                  {totalNetAssetsChange < 0 && (
                    <span>{(totalNetAssetsChange * 100).toFixed(2)}%</span>
                  )}
                  {totalNetAssetsChange === 0 && <span>0%</span>}
                </div>
                <div className="text-xs text-[#ADADAD]">
                  {t("As of")}
                  {dayjs(totalNavTime).format("MMM D")}
                </div>
              </div>
            )}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] z-10 flex flex-col gap-y-[2px]">
              <span
                className={`h-[2px] w-[2px] rounded-full transition-[background] ease-in-out duration-300 ${
                  show ? "bg-[#F4F4F4]" : "bg-[#525252]"
                }`}
              ></span>
              <span
                className={`h-[2px] w-[2px] rounded-full transition-[background] ease-in-out duration-300 ${
                  !show ? "bg-[#F4F4F4]" : "bg-[#525252]"
                }`}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCap;
