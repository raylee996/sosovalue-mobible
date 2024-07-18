import { cn } from "helper/cn";
import { useTCommon } from "hooks/useTranslation";
import { HTMLAttributes, MouseEvent, type ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode | string;
  label: ReactNode;
  account?: string;
  classes?: Common.ClassNameMap<"icon" | "label" | "connect">;
  isConnected?: boolean;
  secondaryIcon?: ReactNode;
  onConnect?: (e: MouseEvent<HTMLElement>) => void;
}

const ConnectAccountCard: React.FC<Props> = ({
  icon,
  classes,
  label,
  className,
  isConnected = false,
  account = "",
  onConnect,
  secondaryIcon = null,
  ...rest
}) => {
  const { t } = useTCommon()
  const handleConnect = (e: MouseEvent<HTMLElement>) => {
    if (isConnected) return;
    typeof onConnect === "function" && onConnect(e);
  };

  return (
    <div
      className={cn(
        "py-4 px-5 border-primary-100-700 border border-solid rounded-lg h-32 flex flex-col justify-between text-primary-900-White text-sm",
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between">
        <i className={cn("w-10 h-10 flex items-center justify-start", classes?.icon)}>{icon}</i>
        {secondaryIcon}
      </div>
      <div className="flex flex-col">
        <span className={classes?.label}>{label}</span>
        <span
          className={cn("text-secondary-500-300 whitespace-nowrap text-ellipsis overflow-hidden", { ['text-[#2563EB] cursor-pointer']: !isConnected }, classes?.connect)}
          onClick={handleConnect}
        >{ isConnected ? account : t("Connect") }</span>
      </div>
    </div>
  );
};

export default ConnectAccountCard;
