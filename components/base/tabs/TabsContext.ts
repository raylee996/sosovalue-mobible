import { createContext } from "react";
import { TabsProps } from "./type";

export const TabsContext = createContext<
    Pick<TabsProps, "variant" | "value"> & { index: number; count: number; label: React.ReactNode }
>({ index: 0, count: 0, label: null });
export const TabsProvider = TabsContext.Provider;
