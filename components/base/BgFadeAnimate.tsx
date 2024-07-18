import React from "react";
import { useUpdateEffect } from "ahooks";

const BgFadeAnimate = ({
  value,
  children,
}: React.PropsWithChildren<{ value: string | number }>) => {
  const arrowRef = React.useRef<HTMLSpanElement | null>(null);
  useUpdateEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.style.animation = `1.5s ease-in bg-fade-${
        +value > 0 ? "down" : "up"
      }`;
    }
  }, [value]);
  React.useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.onanimationend = () => {
        if (arrowRef.current) {
          arrowRef.current.style.animation = "none";
        }
      };
    }
  }, []);
  return (
    <span className="rounded-sm  py-0.5" ref={arrowRef}>
      {children}
    </span>
  );
};

export default BgFadeAnimate;
