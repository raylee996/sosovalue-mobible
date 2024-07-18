import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { setThemeVars } from "helper";
import { cn } from "helper/cn";
import { Theme } from "store/useThemeStore";
import Navigate from "./Navigate";

interface Props extends PropsWithChildren {
  /**
   * 当前组件的高度是否需要减去导航栏的高度
   * @default false
   */
  lessNavigateHeight?: boolean;
  className?: string;
  theme?: Theme;
  /**
   * 当前组件的高度是否需要撑满
   * @default false
   */
  isFullH?: boolean;
}

const NavigateWrap = ({
  children,
  lessNavigateHeight = false,
  className,
  theme,
  isFullH = false,
}: Props) => {
  const [navVisiable, setNavVisiable] = useState(!theme); // 避免初始化为 dark 时由白变黑
  const navigateRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // 根据高度判断底部距离
    if (!navigateRef.current || !lessNavigateHeight) return;
    (
      navigateRef.current.parentNode as HTMLDivElement
    ).style.height = `calc(100% - ${navigateRef.current.clientHeight}px)`;
  }, [navigateRef.current]);

  useEffect(() => {
    setThemeVars(navigateRef, theme);
    setNavVisiable(true);
  }, [theme]);

  return (
    <div
      className={cn(
        "relative bg-background-primary-White-900",
        { "overflow-y-auto": lessNavigateHeight },
        { "h-full": isFullH },
        className
      )}
    >
      {children}
      <div
        className={cn("fixed bottom-0 left-0 w-full z-10", {
          "opacity-0": !navVisiable,
        })}
        ref={navigateRef}
      >
        <Navigate />
      </div>
    </div>
  );
};

export default NavigateWrap;
