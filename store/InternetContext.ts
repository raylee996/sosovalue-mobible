import { createContext } from "react";

export const InternetContext = createContext<{
  onRequestTimeout?: (flag?: boolean, isReset?: boolean) => void;
}>({});
