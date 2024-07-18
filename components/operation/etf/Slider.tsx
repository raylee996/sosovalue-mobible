import { ReactNode, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";

interface Props {
  children: ReactNode;
}

const Index = (props: Props) => {
  const { children } = props;
  const dotRef = useRef<HTMLDivElement>(null);
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className="border-primary-100-700 border-[1px] border-solid rounded-lg bg-dropdown-White-800 relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        className="h-[92px]"
        slidesPerView="auto"
        direction="vertical"
        loop
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{
          el: dotRef.current,
          clickable: true,
          type: "bullets",
          bulletActiveClass: "bg-primary-900-White",
          bulletClass: "bg-primary-100-700 block w-1.5 h-1.5 rounded-full",
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>{item}</SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute right-3 top-0 bottom-0 flex-col flex items-center justify-center z-10">
        <div
          ref={dotRef}
          className="flex-col flex items-center justify-center gap-2"
        />
      </div>
    </div>
  );
};

export default Index;
