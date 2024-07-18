import React, { useContext } from "react";
import { cn } from "helper/cn";
import type { TabItemProps } from "./type";
import { TabsContext } from "./TabsContext";

const TabItem: React.FC<TabItemProps> = ({
  children,
  className,
  selected = false,
  value,
  render,
  ...rest
}) => {
  const { variant } = useContext(TabsContext);
  const selectedClasses = cn("cursor-default", {
    "text-primary": variant === "underline",
  });
  const renderCustomElement = () => {
    const _element = render?.(selected, value as React.ReactNode) as React.ReactHTMLElement<HTMLElement>;
    if (!React.isValidElement(_element)) return null;
    return React.cloneElement(_element, { ...rest });
  }
  
  return typeof render === "function" ? (
    renderCustomElement()
  ) : (
    <div
      className={cn(
        "flex flex-1 justify-center h-inherit items-center transition-colors cursor-pointer text-secondary-500-300",
        className,
        { [selectedClasses]: selected }
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

TabItem.displayName = "TabItem";
export default TabItem;
