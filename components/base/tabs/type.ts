import { PropsWithChildren } from "react";

export type TabsProps<Value = unknown> = PropsWithChildren<{
    /**
     * @default 'md''
     */
    size?: 'sm' | 'md' | 'xs';
    /**
     * @default 'underline''
     */
    variant?: "underline" | "contained";
    value?: Value;
    defaultValue?: Value;
    onChange?: (value: Value) => void;
    className?: string;
    /**
     * @default true
     */
    showIndicator?: boolean;
    classes?: Common.ClassNameMap<"itemsRoot">
}>;

export type TabItemProps<Value = unknown> = PropsWithChildren<{
    value?: Value;
    selected?: boolean;
    render?: (selected: boolean, value: React.ReactNode) => JSX.Element;
} & React.HTMLAttributes<HTMLElement>>
