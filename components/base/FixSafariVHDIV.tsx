import { PropsWithChildren, useRef } from "react";
import { useIsomorphicLayoutEffect } from "ahooks";
import useTelegramStore from "store/useTelegramStore";
import { cn } from "helper/cn";

const FixSafariVHDIV = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { isTelegram } = useTelegramStore();

  const handleChildScroll = (event: Event) => {
    const childDOM = event.target as HTMLElement;
    if (childDOM.scrollTop > 0) {
      childDOM.style.overscrollBehavior = "contain";
    } else {
      childDOM.style.overscrollBehavior = "auto";
    }
  }

  useIsomorphicLayoutEffect(() => {
    const childElement = divRef.current!.firstElementChild as HTMLElement;
    const setHeight = () =>
      (divRef.current!.style.height =
        (document.body.clientHeight || window.innerHeight) + "px");
    setHeight();

    // isTelegram && window.addEventListener("resize", setHeight);
    // isTelegram && childElement.addEventListener("scroll", handleChildScroll);
    //
    // return () => {
    //   isTelegram && window.removeEventListener("resize", setHeight);
    //   isTelegram && childElement.removeEventListener("scroll", handleChildScroll)
    // };
  }, []);

  return (
    <div className={cn("h-full", { "!h-[var(--tg-viewport-height)]": isTelegram }, className)} ref={divRef}>
      {children}
    </div>
  );
};

export default FixSafariVHDIV;
