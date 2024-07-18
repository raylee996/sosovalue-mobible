import { ReactNode, useState } from "react";
import { useRafInterval } from "ahooks";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  children: ReactNode
  delay?: number // 间隔 默认 8
  distance?: number // 位移距离 20
  dots?: boolean // 是否显示指示器
}

const Carousel = (props: Props) => {
  const {
    children,
    delay = 8,
    distance = 20,
    dots = true,
  } = props
  const [count, setCount] = useState(0);
  const list = Array.isArray(children) ? children : [children]

  useRafInterval(() => {
    setCount((prev) => prev + 1);
  }, list.length > 1 ? delay * 1000 : undefined);

  const [aniRef] = useAutoAnimate((el, action) => {
    let keyframes: Keyframe[] = [];
    if (action === "add") {
      keyframes = [
        { transform: `translateY(-${distance}px)`, opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ];
    }
    if (action === "remove") {
      keyframes = [
        { transform: "translateY(0)", opacity: 1 },
        { transform: `translateY(${distance}px)`, opacity: 0 },
      ];
    }
    return new KeyframeEffect(el, keyframes, {
      duration: 300,
      easing: "ease-in-out",
    });
  });

  return (
    <div ref={aniRef} className="w-full h-full relative overflow-hidden">
      {list.map((item, index) => {
        if (count % list.length === index) {
          return (
            <div key={index}>{item}</div>
          )
        }
        return null
      })}
      {dots && (
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] z-10 flex flex-col gap-y-[2px]">
          {list.map((item, index) => (
            <span
              key={index}
              className={`h-[2px] w-[2px] rounded-full transition-[background] ease-in-out duration-300 ${count % list.length === index ? 'bg-[#F4F4F4]' : 'bg-[#525252]'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
