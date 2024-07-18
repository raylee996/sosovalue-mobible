import { getOffsetPageTop } from "helper/tools";
import { useEffect, useRef, useState } from "react";

export const useDomOffsetTop = <T extends HTMLElement>() => {
  const domRef = useRef<T>(null);
  const [offsetTop, setOffsetTop] = useState<number>();
  const offsetTopRef = useRef<number>();
  const calcOffsetTop = () => {
    if (domRef.current) {
      offsetTopRef.current = getOffsetPageTop(domRef.current);
      return offsetTopRef.current;
    }
  };
  const reCalcOffsetTop = () => {
    setOffsetTop(calcOffsetTop());
  };
  useEffect(() => {
    calcOffsetTop();
  }, []);
  return {
    ref: domRef,
    offsetTop,
    offsetTopRef,
    calcOffsetTop,
    reCalcOffsetTop,
  };
};
