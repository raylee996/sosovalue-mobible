import ThirdPartyLoginButton from "./ThirdPartyLoginButton";
import TelegramLoginButton from "components/telegram/TelegramLoginButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserContext } from "store/UserStore";
import { useContext, useState } from "react";
import { cn } from "helper/cn";
import { useTCommon } from "hooks/useTranslation";
import { useAccount } from "wagmi";
import useDomainSuffix from "hooks/useDomainSuffix";
//import Image from "next/image";

interface Props {
  className?: string;
  classes?: Common.ClassNameMap<"button">;
  extraElements?: React.ReactNode[];
}
/**
 * 第三方登录按钮组
 */
const ThirdLoginButtonGroup: React.FC<Props> = ({
  classes,
  className,
  extraElements,
}) => {
  const { t } = useTCommon();
  const { googleLogin, twitterLoginRedirect, signWalletMessage, appleLogin } =
    useContext(UserContext);
  const { address } = useAccount();
  const domainSuffix = useDomainSuffix();
  return (
    <div className={cn("grid grid-cols-3 grid-flow-row gap-3", className)}>
      <ThirdPartyLoginButton
        thirdPartyName="google"
        platform={t("Google")}
        onClick={googleLogin}
        className={classes?.button}
      />
      <ThirdPartyLoginButton
        thirdPartyName="apple"
        platform={t("Apple")}
        onClick={appleLogin}
        className={classes?.button}
        hidden={domainSuffix !== "com"}
      />

      <ThirdPartyLoginButton
        thirdPartyName="telegram"
        platform={t("Telegram")}
        className={classes?.button}
        hidden={domainSuffix !== "com"}
      >
        <TelegramLoginButton />
      </ThirdPartyLoginButton>
      <ThirdPartyLoginButton
        thirdPartyName="twitter"
        platform={t("Twitter")}
        onClick={twitterLoginRedirect}
        className={`${classes?.button}`}
      />
      {extraElements}
      {address ? (
        <ThirdPartyLoginButton
          thirdPartyName="wallet"
          platform={t("Wallet")}
          onClick={() => signWalletMessage()}
          className={classes?.button}
        />
      ) : (
        <ConnectButton.Custom>
          {({ openConnectModal }) => {
            return (
              <ThirdPartyLoginButton
                thirdPartyName="wallet"
                platform={t("Wallet")}
                onClick={openConnectModal}
                className={classes?.button}
              />
            );
          }}
        </ConnectButton.Custom>
      )}
      {/* 推特不可用 */}
      {/* {
        !authModal?.showSignUpTab && (
          <div className="relative z-1">
            <ThirdPartyLoginButton
              thirdPartyName="twitter"
              platform={t("Twitter")}
              //onClick={twitterLoginRedirect}
              onClick={() => setShowLabel(!showLabel)}
              className={`${classes?.button} text-placeholder-400-300 w-full`}
            />
            {
              showLabel && <div className="z-10 w-[294px] px-3 py-2 absolute left-1/2 -ml-[150px] -top-[74px] text-xs text-white-white bg-tooltip-800 rounded-lg">
              {t("twitter tips")}
              <Image src="/img/svg/tippy.svg" alt="" width="24" height="8" className="absolute left-1/2 -ml-3 -bottom-[7px]" />
            </div>
            }
          </div>
        )
      } */}
    </div>
  );
};

export default ThirdLoginButtonGroup;
