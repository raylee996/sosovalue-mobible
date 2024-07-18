import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { IconButton, Button } from "@mui/material";
import ArrowIcon from "components/svg/Arrow";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
//import "swiper/css/effect-fade";
import { transferMoney } from "helper/tools";
type Data = API.Banner & {
  information: API.Information;
};

const Banner = ({ banner }: { banner: Data[] }) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const innerSwiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <div className="text-primary text-xl font-bold mb-3">
        SoSo Report - See the Unseen
      </div>
      <div className="relative group">
        <IconButton
          onClick={() => swiperRef.current!.slidePrev()}
          className="text-sub-title absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-[#1F1F1F] border border-solid border-[#404040] transition duration-500 opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100"
        >
          <ArrowIcon className="text-[29px] rotate-90" viewBox="0 0 13 12" />
        </IconButton>
        <Swiper
          // allowTouchMove={false}
          spaceBetween={16}
          slidesPerView="auto"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          <SwiperSlide className="w-[450px] h-[270px] bg-block-color shadow-area rounded-lg text-white cursor-pointer">
            <div className="w-full h-full relative">
              <Swiper
                className="w-full h-full"
                // allowTouchMove={false}
                slidesPerView="auto"
                modules={[Autoplay, EffectFade]}
                effect="fade"
                loop
                autoplay
                onSwiper={(swiper) => (innerSwiperRef.current = swiper)}
                onActiveIndexChange={(swiper) =>
                  setActiveIndex(swiper.realIndex)
                }
              >
                <SwiperSlide
                  key={0}
                  className="w-full h-full bg-block-color shadow-area rounded-lg text-white cursor-pointer"
                >
                  <Link href="/" target="_blank">
                    <Image src="/img/temp/temp1.png" fill alt="" />
                  </Link>
                </SwiperSlide>
                <SwiperSlide
                  key={1}
                  className="w-full h-full bg-block-color shadow-area rounded-lg text-white cursor-pointer"
                >
                  <Link href="/" target="_blank">
                    <Image src="/img/temp/temp2.png" fill alt="" />
                  </Link>
                </SwiperSlide>
              </Swiper>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-[2px] z-10">
                <span
                  className={`h-1 rounded-[100px] transition-[width,background] ease-in-out duration-300 ${
                    activeIndex === 0 ? "bg-primary w-6" : "bg-[#333333] w-4"
                  }`}
                ></span>
                <span
                  className={`h-1 rounded-[100px] transition-[width,background] ease-in-out duration-300 ${
                    activeIndex === 1 ? "bg-primary w-6" : "bg-[#333333] w-4"
                  }`}
                ></span>
              </div>
            </div>
          </SwiperSlide>
          {banner.map(({ id, information }) => {
            return (
              <SwiperSlide
                key={id}
                className="w-[250px] h-[270px] group/item p-3 box-border flex flex-col justify-between items-stretch border border-solid border-[#404040] bg-block-color shadow-area rounded-lg text-white cursor-pointer"
              >
                <Link href={`/news/${id}`}>
                  <div className="text-base font-bold text-sub-title line-clamp-3 group-hover/item:text-primary">
                    {information.title || information.content}
                  </div>
                  <div className="mt-6">
                    {information.isAuth === 1 && (
                      <Button
                        startIcon={
                          <Image
                            src="/img/svg/SoSponge.svg"
                            width={16}
                            height={16}
                            alt=""
                          />
                        }
                        className="h-5 mr-3 rounded-full text-primary font-bold text-xs normal-case bg-[rgba(255,39,0,0.20)]"
                      >
                        SoSo Report
                      </Button>
                    )}
                    {information.sector && (
                      <Button className="text-xs text-content font-bold normal-case h-5 rounded-full px-2 min-w-0 bg-[rgba(52,52,52,0.80)]">
                        {information.sector}
                      </Button>
                    )}
                  </div>
                  <div className="mt-2">
                    {information.matchedCurrencies.map(({ id, name }) => (
                      <Button
                        key={id}
                        className="text-xs mr-1 text-content normal-case h-5 border border-solid border-[#404040] rounded-full px-2 min-w-0"
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </Link>
                <div className="text-content text-xs">
                  {dayjs(+information.realiseTime).format("MMM DD, YYYY")} ·{" "}
                  {transferMoney(information.contentNum)} Words ·{" "}
                  {information.author}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <IconButton
          onClick={() => swiperRef.current!.slideNext()}
          className="text-sub-title absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-[#1F1F1F] border border-solid border-[#404040] transition duration-500 opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100"
        >
          <ArrowIcon className="text-[29px] -rotate-90" viewBox="0 0 13 12" />
        </IconButton>
      </div>
    </div>
  );
};

export default Banner;
