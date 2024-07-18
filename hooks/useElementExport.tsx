import { useDebounceFn, useMemoizedFn, useUpdateEffect } from "ahooks";
import { isBrowser } from "helper/tools";
import { RefObject, useEffect, useId, useMemo, useState } from "react";
function isElementInViewport(el: HTMLElement, viewRect: DOMRect) {
  let rect = el?.getBoundingClientRect();
  if (!rect) {
    return false;
  }
  let halfWidth = (rect.width ?? 0) / 2;
  let halfHeight = (rect.height ?? 0) / 2;
  return (
    halfWidth &&
    halfHeight &&
    rect.top >= Math.max(viewRect.top,0) - halfHeight &&
    rect.left >= Math.max(viewRect.left,0) - halfWidth &&
    rect.bottom - halfHeight <= Math.min(window.innerHeight,viewRect.bottom) &&
    rect.right - halfWidth <=Math.min(window.innerWidth,viewRect.right)
  );
}
const useElementExport = function <T>(
  scroll: RefObject<HTMLElement>,
  onExport?: (data: T[]) => void,
): {
  createExportData: (data: T) => { [key: string]: string };
  track: () => void;
} {
  const id = useId();
  const dataKey = useMemo(
    () =>
      "data-" +
      parseInt(Math.random() * 1000000 + "").toString(16) +
      id.replace(/[^a-zA-Z\d]/g, "").toLowerCase(),
    [id],
  );
  const { run } = useDebounceFn(
    () => {
      if (typeof onExport != "function") {
        return false;
      }
      setTimeout(() => {
        let viewRect = scroll.current?.getBoundingClientRect();
        let { innerHeight, innerWidth } = window;
        let data: T[] = [];
        if (viewRect) {
          if (
            viewRect.top > -viewRect.height &&
            viewRect.top < innerHeight &&
            viewRect.left > -viewRect.width &&
            viewRect.left < innerWidth
          ) {
            const els = document.querySelectorAll(`[${dataKey}]`);
            Array.from(els).forEach((el) => {
              if (isElementInViewport(el as HTMLElement, viewRect!)) {
                let attr = el.getAttribute(dataKey);
                if (attr) {
                  data.push(JSON.parse(attr));
                }
              }
            });
          }
        }
        data.length && onExport?.(data);
      }, 30);
    },
    { wait: 300 },
  );
  useEffect(() => {
    scroll.current?.addEventListener("scroll", run);
    return () => scroll.current?.removeEventListener("scroll", run);
  }, [scroll?.current]);
  const createExportData = useMemoizedFn((data: T) => {
    return {
      [dataKey]: JSON.stringify(data),
    };
  });
  const tryQueryEle = () => {
    return new Promise((resolve) => {
      if (!isBrowser || !scroll?.current) {
        return resolve(false);
      }
      let i = 0,
        t = setInterval(() => {
          i++;
          if (document.querySelector(`[${dataKey}]`)) {
            clearInterval(t);
            return resolve(true);
          }
          if (i >= 5) {
            resolve(false);
            clearInterval(t);
          }
        }, 1000);
    });
  };
  return {
    createExportData,
    track: () => {
      tryQueryEle().then((status) => status && run());
    },
  };
};
export default useElementExport;
