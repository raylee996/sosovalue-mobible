import { useEffect } from "react";

export const useClearEffect = (effect: () => () => void, deps: any[]) => {
  useEffect(() => {
    const clear = effect();
    return () => {
      clear?.();
    };
  }, deps);
};
