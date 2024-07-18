import { useIsomorphicLayoutEffect, useMemoizedFn } from "ahooks";
import { ReactNode, RefObject } from "react";
import { createRoot } from "react-dom/client";

type Props = {
  threshold?: number;
  pullRef: RefObject<HTMLElement>;
  indicator: ReactNode;
  onTrigger: () => Promise<any>;
};

const usePullRefresh = ({
  threshold = 128,
  pullRef,
  indicator,
  onTrigger,
}: Props) => {
  const refresh = useMemoizedFn(onTrigger);
  useIsomorphicLayoutEffect(() => {
    const pullEl = pullRef.current;
    if (!pullEl) return;

    const indicatorParent = document.createElement("div");
    indicatorParent.style.position = "relative";
    const indicatorTransitionEL = document.createElement("div");

    indicatorTransitionEL.style.position = "absolute";
    indicatorTransitionEL.style.left = "0";
    indicatorTransitionEL.style.top = "0";
    indicatorTransitionEL.style.width = "100%";
    indicatorTransitionEL.style.height = "0";
    indicatorTransitionEL.style.overflow = "hidden";

    const indicatorTransitionRoot = createRoot(indicatorTransitionEL);
    indicatorTransitionRoot.render(indicator);
    pullEl.parentNode?.insertBefore(indicatorParent, pullEl);
    indicatorParent.appendChild(indicatorTransitionEL);

    pullEl.addEventListener("touchstart", handleTouchStart);

    function handleTouchStart(startEvent: TouchEvent) {
      const pullEl = pullRef.current;
      if (!pullEl) return;
      if (pullEl.scrollTop > 0) return;

      const initialY = startEvent.touches[0].clientY;

      pullEl.addEventListener("touchmove", handleTouchMove);
      pullEl.addEventListener("touchend", handleTouchEnd);

      function handleTouchMove(moveEvent: TouchEvent) {
        const pullEl = pullRef.current;
        if (!pullEl) return;

        const currentY = moveEvent.touches[0].clientY;

        const dy = currentY - initialY;
        if (dy < 0) return;
        const translateY = appr(dy);
        indicatorTransitionEL.style.height = `${translateY}px`;
        pullEl.style.transform = `translateY(${translateY}px)`;
      }
      const k = 0.4;
      function appr(x: number) {
        return threshold * (1 - Math.exp((-k * x) / threshold));
      }
      function handleTouchEnd(endEvent: TouchEvent) {
        const pullEl = pullRef.current;
        if (!pullEl) return;
        const y = endEvent.changedTouches[0].clientY;
        const dy = y - initialY;
        const resetDom = () => {
          pullEl.style.transform = "translateY(0)";
          pullEl.style.transition = "transform 0.2s ease-in-out";
          indicatorTransitionEL.style.height = `0`;
          indicatorTransitionEL.style.transition = "height 0.2s ease-in-out";
        };
        if (dy > threshold) {
          refresh().then(() => resetDom());
        } else {
          resetDom();
        }

        pullEl.addEventListener("transitionend", onTransitionEnd);
        pullEl.removeEventListener("touchmove", handleTouchMove);
        pullEl.removeEventListener("touchend", handleTouchEnd);
      }
      function onTransitionEnd(endEvent: TransitionEvent) {
        const pullEl = pullRef.current;
        if (!pullEl) return;
        indicatorTransitionEL.style.transition = "";
        pullEl.style.transition = "";
        pullEl.removeEventListener("transitionend", onTransitionEnd);
      }
    }

    return () => {
      // indicatorTransitionRoot.unmount()
      pullEl.parentNode?.removeChild(indicatorParent);
      pullEl.removeEventListener("touchstart", handleTouchStart);
    };
  }, [pullRef.current]);
};

export default usePullRefresh;
