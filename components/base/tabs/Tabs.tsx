import React, { useEffect, useMemo, useRef, useState } from "react";
import { useControlled } from "hooks/useController";
import { TabsProvider } from "./TabsContext";
import type { TabItemProps, TabsProps } from "./type";
import { cn } from "helper/cn";
import Indicator from "./Indicator";

const Tabs = <T extends string | number>({
  value: valueProp,
  size = "md",
  variant = "underline",
  onChange,
  children,
  defaultValue,
  className,
  showIndicator = true,
  classes,
}: TabsProps<T>) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [defaultValueState, setDefaultValueState] = useState(defaultValue);
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValueState,
  });

  const childrenNodes = React.Children.map(children, (child, index) => {
    const tabItem = child as
      | React.FunctionComponentElement<TabItemProps<T>>
      | undefined;
    const displayName = tabItem?.type?.displayName;
    if (displayName !== "TabItem" || !React.isValidElement(tabItem))
      return null;

    const tabItemValue = tabItem.props.value ?? index;
    return React.cloneElement(tabItem, {
      key: `tab-item-${tabItemValue}`,
      onClick: () => handleTabItemClick(tabItemValue),
      selected: tabItemValue === value,
    });
  });

  useEffect(() => {
    if (!childrenNodes?.length || typeof defaultValueState !== "undefined")
      return;
    const defaultValue = (valueProp ??
      childrenNodes?.[0].props.value ??
      0) as T;

    setDefaultValueState((childrenNodes?.[0].props.value ?? 0) as T);
    setValue(defaultValue);
  }, [childrenNodes]);

  const currentIndex = Math.max(
    childrenNodes?.findIndex((predicate) => predicate.props.value === value) ??
      0,
    0
  );
  const mdClasses = "h-16 text-base";
  const smClasses = "h-12 text-sm";
  const xsClasses = "h-9 text-sm";
  const underlineClasses = "border-b border-solid border-x-0 border-t-0";
  const containedClasses = "bg-background-secondary-White-700 rounded-lg";
  const handleTabItemClick = (value: any) => {
    onChange?.(value);
    setValue(value);
  };

  return (
    <TabsProvider
      value={{
        value,
        variant,
        index: currentIndex,
        count: childrenNodes?.length || 0,
        label: childrenNodes?.[currentIndex]?.props.children,
      }}
    >
      <div
        ref={rootRef}
        className={cn(
          "w-full text-primary-900-White border-primary-100-700 relative",
          {
            [mdClasses]: size === "md",
            [smClasses]: size === "sm",
            [xsClasses]: size === "xs",
            [underlineClasses]: variant === "underline",
            [containedClasses]: variant === "contained",
          },
          className
        )}
      >
        <div className={cn("flex items-center h-inherit", classes?.itemsRoot)}>
          {childrenNodes}
        </div>
        {showIndicator && (
          <Indicator>
            {childrenNodes?.[currentIndex]?.props.children || null}
          </Indicator>
        )}
      </div>
    </TabsProvider>
  );
};

Tabs.displayName = "Tabs";
export default Tabs;
