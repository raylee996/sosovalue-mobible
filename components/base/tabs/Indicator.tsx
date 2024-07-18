import React, { type PropsWithChildren, useContext } from "react";
import { TabsContext } from "./TabsContext";
import { cn } from "helper/cn";

const Indicator: React.FC<PropsWithChildren> = ({ children }) => {
    const { index, count, variant } = useContext(TabsContext);
    const widthPercent = 100 / count;
    const translateX = index * 100;
    const underlineClasses = "h-[3px] bg-primary";
    const containedClasses = "bg-background-primary-White-900 inset-[2px] rounded-md !w-[calc(50%-2px)] not-italic";

    return (
        <i
            className={cn("absolute bottom-[-2px] ease-in-out duration-150 flex items-center justify-center shadow-md", {
                [underlineClasses]: variant === "underline",
                [containedClasses]: variant === "contained",
            })}
            style={{
                width: `${widthPercent}%`,
                transform: `translateX(${translateX}%)`,
            }}
        >{variant === 'contained' ? children : null}</i>
    );
};

export default Indicator;
