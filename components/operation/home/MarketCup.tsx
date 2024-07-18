import { useEffect, useState } from "react";
import { transferMoney } from "helper/tools";
import { useTranslation } from "next-i18next";
import { useAutoAnimate } from "@formkit/auto-animate/react";
type Props = {
    cryptoTotalList: any;
};

// const MarketCap = ({ cryptoTotalList }: Props) => {
//   const { t } = useTranslation(["common"]);
//   const [show, setShow] = useState(false);
//   const [parentRef] = useAutoAnimate((el, action) => {
//     let keyframes: Keyframe[] = [];
//     // supply a different set of keyframes for each action
//     if (action === "add") {
//       keyframes = [
//         { transform: "translateY(-20px)", opacity: 0 },
//         { transform: "translateY(0)", opacity: 1 },
//       ];
//     }
//     // keyframes can have as many "steps" as you prefer
//     // and you can use the 'offset' key to tune the timing
//     if (action === "remove") {
//       keyframes = [
//         { transform: "translateY(0)", opacity: 1 },
//         { transform: "translateY(20px)", opacity: 0 },
//       ];
//     }
//     return new KeyframeEffect(el, keyframes, {
//       duration: 300,
//       easing: "ease-in-out",
//     });
//   });
//   useEffect(() => {
//     const timer = setInterval(() => setShow((show) => !show), 2000);
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);
//   return (
//     <div className="h-full">
//       <div className="relative group h-full">
//         <div className="w-full h-full bg-block-color shadow-area rounded-lg text-white cursor-pointer">
//           <div
//             className="w-full h-full relative overflow-hidden"
//             ref={parentRef}
//           >
//             {/* {show ? (
//               <div
//                 key={0}
//                 className="w-full h-full flex flex-col justify-center bg-block-color shadow-area rounded-lg text-white cursor-pointer"
//               >
//                 <div className="text-xs bg-block-color text-[#C2C2C2]">
//                   {t("SoSo 100 MarketCap")}
//                 </div>
//                 <div className="mt-1 bg-block-color text-sm font-bold text-[#F4F4F4] flex flex-wrap items-center">
//                   <span className="mr-2">
//                     ${transferMoney(cryptoTotalList?.soSoMarketCap)}
//                   </span>
//                   {cryptoTotalList?.soSoChange > 0 && (
//                     <span className="font-normal text-xs text-rise">
//                       +{(+cryptoTotalList?.soSoChange).toFixed(2)}%
//                     </span>
//                   )}
//                   {cryptoTotalList?.soSoChange === 0 && (
//                     <span className="font-normal text-xs ">0.00%</span>
//                   )}
//                   {cryptoTotalList?.soSoChange < 0 && (
//                     <span className="font-normal text-xs text-fall">
//                       {(+cryptoTotalList?.soSoChange).toFixed(2)}%
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : ( */}
//             <div
//               key={1}
//               className="w-full h-full flex flex-col justify-center bg-block-color shadow-area rounded-lg text-white cursor-pointer"
//             >
//               <div className="text-xs bg-block-color text-[#C2C2C2]">
//                 {t("Total MarketCap")}
//               </div>
//               <div className="mt-1 bg-block-color text-sm font-bold text-[#F4F4F4] flex flex-wrap items-center">
//                 <span className="mr-2">
//                   ${transferMoney(cryptoTotalList?.marketCap)}
//                   {/* $2484B */}
//                 </span>
//                 {cryptoTotalList?.marketCapChange > 0 && (
//                   <span className="font-normal text-xs text-rise">
//                     +{(+cryptoTotalList?.marketCapChange).toFixed(2)}%
//                   </span>
//                 )}
//                 {cryptoTotalList?.marketCapChange === 0 && (
//                   <span className="font-normal text-xs ">0.00%</span>
//                 )}
//                 {cryptoTotalList?.marketCapChange < 0 && (
//                   <span className="font-normal text-xs text-fall">
//                     {(+cryptoTotalList?.marketCapChange).toFixed(2)}%
//                   </span>
//                 )}
//                 {/* <span className="font-normal text-xs text-fall">-1.6%</span> */}
//               </div>
//             </div>
//             {/* )}
//             <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] z-10 flex flex-col gap-y-[2px]">
//               <span
//                 className={`h-[2px] w-[2px] rounded-full transition-[background] ease-in-out duration-300 ${
//                   show ? "bg-[#F4F4F4]" : "bg-[#525252]"
//                 }`}
//               ></span>
//               <span
//                 className={`h-[2px] w-[2px] rounded-full transition-[background] ease-in-out duration-300 ${
//                   !show ? "bg-[#F4F4F4]" : "bg-[#525252]"
//                 }`}
//               ></span>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketCap;

const MarketCap = ({ cryptoTotalList }: Props) => {
    const { t } = useTranslation(["common"]);
    const [show, setShow] = useState(false);
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
        const timer = setInterval(() => setShow((show) => !show), 2000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div className="w-full relative overflow-hidden" ref={parentRef}>
            <div className="w-full h-full flex items-center cursor-pointer">
                <div className="text-xs text-secondary-500-300 whitespace-nowrap">
                    {t("Total MarketCap")}:
                    {/* {t("Total M. Cap")}: */}
                </div>
                <div className="text-xs ml-1 flex items-center">
                    <span>${transferMoney(cryptoTotalList?.marketCap)}</span>
                    {cryptoTotalList?.marketCapChange > 0 && (
                        <span className="font-normal text-xs ml-1 text-success-600-500">
                            +{(+cryptoTotalList?.marketCapChange).toFixed(2)}%
                        </span>
                    )}
                    {cryptoTotalList?.marketCapChange === 0 && (
                        <span className="font-normal ml-1 text-xs ">0.00%</span>
                    )}
                    {cryptoTotalList?.marketCapChange < 0 && (
                        <span className="font-normal ml-1 text-xs text-error-600-500">
                            {(+cryptoTotalList?.marketCapChange).toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketCap;
