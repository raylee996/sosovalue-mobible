import React, { PropsWithChildren } from "react";
import { Button, type ButtonProps } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { cn } from "helper/cn";
import useNotistack from "hooks/useNotistack";
import type { DefaultTFuncReturn } from "i18next";
import { UserContext } from "store/UserStore";
import { transferAddress, transferMention } from "helper/tools";
import WalletIcon from "components/svg/thirdParty/WalletIcon";
import TwitterIcon from "components/svg/thirdParty/TwitterIcon";
import AppleIcon from "components/svg/thirdParty/AppleIcon";
import TelegramIcon from "components/svg/thirdParty/TelegramIcon";
import GoogleIcon from "components/svg/thirdParty/GoogleIcon";

type ThirdPartyNames = keyof Required<API.CurrentUser>["thirdInfo"];

interface Props extends PropsWithChildren<Omit<ButtonProps, "onClick">> {
  /** 第三方平台名称，做逻辑处理 */
  thirdPartyName: ThirdPartyNames;
  /** 第三方平台名称，UI渲染 */
  platform: DefaultTFuncReturn;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  customIcon?: React.ReactNode;
  hidden?: boolean;
}

type PlatformMapping<T = unknown> = Record<
  ThirdPartyNames,
  {
    username: string | undefined;
    icon: string | React.ReactElement;
  }
>;

/**
 * 第三方登录专用按钮，如：谷歌、推特、Telegram、钱包等
 */
const ThirdPartyLoginButton: React.FC<Props> = ({
  className,
  disabled,
  onClick,
  thirdPartyName,
  platform,
  children,
  customIcon,
  hidden = false,
  ...restButtonProps
}) => {
  const { warning } = useNotistack();
  const { t } = useTranslation("common");
  const { user } = React.useContext(UserContext);
  const username = user?.thirdInfo?.[thirdPartyName]?.username;

  const platformMapping: PlatformMapping = {
    google: {
      username: username,
      icon: <GoogleIcon />,
    },
    telegram: {
      username: transferMention(username),
      icon: <TelegramIcon />,
    },
    apple: {
      username: "usernameFormatted",
      icon: <AppleIcon />,
    },
    wallet: {
      username: transferAddress(username),
      icon: <WalletIcon />,
    },
    twitter: {
      username: transferMention(username),
      icon: <TwitterIcon />,
    },
  };
  const { username: usernameFormatted, icon } = platformMapping[thirdPartyName];
  const isLogin = !!user?.thirdInfo?.[thirdPartyName];

  const baseClasses = "text-primary-900-White text-sm flex-col justify-center h-full rounded-lg border border-solid border-primary-100-700 flex-1 whitespace-nowrap overflow-hidden normal-case font-normal px-5 py-3 shadow-[0px,1px,2px,0px,rgba(10,10,10,0.06)] bg-background-secondary-White-700";
  const disableHoverClasses =
    "hover:bg-transparent hover:border-primary-100-700 hover:text-primary-900-White cursor-default";
  const disableButtonClasses = cn(
    "opacity-[0.38] cursor-not-allowed",
    disableHoverClasses
  );
  const listButtonClasses = cn(baseClasses, {
    [disableHoverClasses]: isLogin,
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isLogin) return;
    if (disabled) return warning(t("Unsupported login method"));
    typeof onClick === "function" && onClick(e);
  };

  const _icon =
    typeof icon === "string" ? (
      <Image
        className={cn({ ["mb-2"]: !isLogin })}
        src={icon}
        width={24}
        height={24}
        alt=""
      />
    ) : (
      icon
    );

  return (
    hidden ? null : <Button
        className={cn(
          listButtonClasses,
          { [disableButtonClasses]: disabled },
          className
        )}
        disableRipple={disabled || isLogin}
        onClick={handleClick}
        {...restButtonProps}
      >
        <span className="relative flex items-center justify-center h-5">
          {customIcon || _icon}
          {isLogin && (
            <Image
              className="absolute -bottom-1 -right-1"
              src="/img/svg/Success.svg"
              width={16}
              height={16}
              alt=""
            />
          )}
        </span>
        <span className="mt-2">{platform}</span>
        {isLogin && (
          <span className="text-xs text-primary-900-White">
            {usernameFormatted}
          </span>
        )}
        {!isLogin && children}
      </Button>
  );
};

export default ThirdPartyLoginButton;
