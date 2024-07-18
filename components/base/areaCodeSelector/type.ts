import type { HTMLAttributes, PropsWithChildren } from "react";
import { Language } from "store/ThemeStore";

export interface SelectorItemData {
  areaCode: string;
  countryCode: string;
  countryName: Record<Language, string>;
}

export interface AreaCodeSelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: SelectorItemData) => void;
  /** 是否有右侧边框 */
  hasRightBorder?: boolean;
}

export type SelectorItemProps = PropsWithChildren<{
  data: SelectorItemData;
  selected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>>;

export interface SelectorPanelProps {
  value?: string;
  onChange?: (value: SelectorItemData) => void;
}
