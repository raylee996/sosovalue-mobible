import React, { ReactNode, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Email from "components/icons/Email.svg";
import Phone from "components/icons/Phone.svg";
import Wallet from "components/icons/Wallet.svg";
import Google from "components/icons/Google.svg";
import Apple from "components/icons/Apple.svg";
import Twitter from "components/icons/Twitter.svg";
import Telegram from "components/icons/Telegram.svg";
import Checked from "components/icons/checked.svg";
import ArrowRight from "components/icons/arrow-right.svg";
import Gift from "components/icons/gift.svg";
import { ButtonBase, ClickAwayListener, Switch, Tooltip } from "@mui/material";
import ArrowLeft from "components/icons/arrow-left.svg";
import { UserContext } from "store/UserStore";
import Profile from "components/operation/personalCenter/Profile";
import useAuthMethodStore from "store/useAuthMethodStore";
import TelegramLoginButton from "components/telegram/TelegramLoginButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTCenter } from "hooks/useTranslation";
import { useAccountBind } from "hooks/operation/useAccountBind";
import { AuthMethodTab } from "hooks/operation/useAuthModal";
import useNotistack from "hooks/useNotistack";
import { useShallow } from "zustand/react/shallow";
import useOneSignalStore from "store/useOneSignalStore";
import { cn } from "helper/cn";
import useTelegramStore from "store/useTelegramStore";
import useDomainSuffix from "hooks/useDomainSuffix";
import { useRouter } from "next/router";

interface ThirdLoginCardItemProps {
  icon: any;
  key:
    | "twitter"
    | "google"
    | "telegram"
    | "apple"
    | "wallet"
    | "email"
    | "phone";
  name: string;
  checked: boolean;
  content: ReactNode;
  children?: ReactNode;
  toConnect?: () => void;
  /** @default false */
  hidden?: boolean;
}

const ThirdPartyLoginCard: React.FC<{
  account: ThirdLoginCardItemProps;
  onChangeBind?: () => void;
}> = ({ account, onChangeBind }) => {
  const { t } = useTCenter();
  return (
    <div key={account.name} className="flex gap-3 justify-between w-full">
      <div className="flex w-10 h-10 items-center justify-center rounded-xl border border-solid border-primary-100-700 relative">
        <account.icon className="w-5 h-5 shrink-0 text-secondary-700-100" />
        {account.content && (
          <Checked className="absolute -left-1 -top-1 w-4 h-4" />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className=" text-primary-900-White text-sm font-medium leading-6">
          {account.name}
        </div>
        <div className="flex text-secondary-500-300 text-xs space-x-1">
          <span className="text-ellipsis overflow-hidden whitespace-nowrap">{account.content || t("Not Conected")}</span>
          {((account.key === "email" && account.content) ||
            (account.key === "phone" && account.content)) && (
            <span className="text-[#2563EB]" onClick={onChangeBind}>
              {t("Change")}
            </span>
          )}
        </div>
      </div>
      {account.content ? (
        <div className="w-auto px-4 py-2 text-sm font-medium text-secondary-500-300">
          {t("Connected")}
        </div>
      ) : (
        <ButtonBase
          onClick={account?.toConnect}
          className="w-auto px-4 py-2 rounded-lg border border-solid text-primary-900-White border-primary-100-700 bg-background-secondary-White-700 text-sm font-medium"
        >
          {t("Connect")}
          {account.children || null}
        </ButtonBase>
      )}
    </div>
  );
};

const PersonalCenter = () => {
  const { t } = useTCenter();
  const router = useRouter();
  const { setAuthScene } = useAuthMethodStore();
  const { toConnect } = useAccountBind();
  const { error } = useNotistack();
  const {
    user,
    taskData,
    googleLogin,
    twitterLoginRedirect,
    verifyCode,
    authModal,
    appleLogin,
  } = React.useContext(UserContext);
  const [open, setOpen] = useState(false);
  const { isTelegram } = useTelegramStore();
  const domainSuffix = useDomainSuffix();

  const { openOrCloseSubscription, isSubscription } = useOneSignalStore(
    useShallow((state) => ({
      openOrCloseSubscription: state.openOrCloseSubscription,
      isSubscription: state.isSubscription,
    }))
  );

  const handleTooltipClose = () => {
    setOpen(false);
  };
  const accountMap: ThirdLoginCardItemProps[] = [
    {
      icon: Email,
      key: "email",
      name: t("Email"),
      checked: false,
      content: user?.email,
      toConnect: () => toConnect(AuthMethodTab.Email),
    },
    {
      icon: Phone,
      key: "phone",
      name: t("Phone Number"),
      checked: true,
      content: user?.phone,
      toConnect: () => toConnect(AuthMethodTab.Phone),
    },
    {
      icon: Google,
      key: "google",
      name: t("Google"),
      checked: true,
      content: user?.thirdInfo?.google?.username,
      toConnect: googleLogin,
      hidden: isTelegram,
    },
    {
      icon: Apple,
      key: "apple",
      name: t("Apple"),
      checked: false,
      content: user?.thirdInfo?.apple?.username,
      toConnect: appleLogin,
      hidden: isTelegram || domainSuffix !== "com",
    },
    {
      icon: Telegram,
      key: "telegram",
      name: t("Telegram"),
      checked: false,
      content: user?.thirdInfo?.telegram?.username,
      children: <TelegramLoginButton />,
      hidden: domainSuffix !== "com"
    },
    {
      icon: Twitter,
      key: "twitter",
      name: t("Twitter"),
      checked: false,
      content: user?.thirdInfo?.twitter?.username,
      toConnect: twitterLoginRedirect,
      hidden: isTelegram,
    },
    {
      icon: Wallet,
      key: "wallet",
      name: t("Wallet"),
      checked: false,
      content: user?.thirdInfo?.wallet?.username,
      hidden: isTelegram,
    },
  ];

  const toSetPassword = async () => {
    setAuthScene("changePassword");
    if (user?.email && user?.phone) {
      authModal?.openAuthMethodSelector();
    } else if (user?.phone) {
      verifyCode
        ?.sendChangePhonePwd({ phone: user.phone })
        .then(() => authModal?.openVerifyCode());
    } else if (user?.email) {
      verifyCode
        ?.sendChangeEmailPwd({ email: user.email })
        .then(() => authModal?.openVerifyCode());
    }
  };
  const openDeactivateAccount = () => {
    setAuthScene("deactivateAccount");
    authModal?.openDeactivateAccount();
  };
  const handleChangeBind = (type: ThirdLoginCardItemProps["key"]) => {
    if (type !== "email" && type !== "phone") return;
    if (type === "phone") {
      verifyCode
        ?.sendBeforeChangeBindPhoneCode({ phone: user!.phone })
        .then(() => authModal?.openVerifyCode())
        .catch((err) => {
          err.msg && error(err.msg);
        });
    } else {
      verifyCode
        ?.sendBeforeChangeBindEmailCode({ email: user!.email })
        .then(() => authModal?.openVerifyCode())
        .catch((err) => {
          err.msg && error(err.msg);
        });
    }
  };

  return (
    <>
      <ButtonBase
        onClick={() => router.back()}
        className="h-[50px] flex items-center justify-center relative border-0 border-solid border-b border-primary-100-700 w-full"
      >
        <ArrowLeft className="absolute left-4 text-lg text-primary-800-50" />
        <div className="text-primary-900-white text-base font-bold">
          {t("Personal Center")}
        </div>
      </ButtonBase>

      <div className="p-4 w-full bg-dropdown-White-800">
        <Profile />
        <div className=" text-primary-900-White text-lg font-bold mt-8 mb-5 leading-8">
          {t("Account Information")}
        </div>
        <div className="px-5 py-4 flex flex-col items-start self-stretch gap-4 rounded-xl border border-solid border-primary-100-700">
          {accountMap.map((account) => {
            if (account.hidden) return null;
            return account.key === "wallet" ? (
              <ConnectButton.Custom key={account.key}>
                {({ openConnectModal }) => {
                  return (
                    <ThirdPartyLoginCard
                      key={account.name}
                      account={{ ...account, toConnect: openConnectModal }}
                    />
                  );
                }}
              </ConnectButton.Custom>
            ) : (
              <ThirdPartyLoginCard
                key={account.key}
                account={account}
                onChangeBind={() => handleChangeBind(account.key)}
              />
            );
          })}
        </div>
        <ButtonBase
          className="mt-5 text-placeholder-400-300 text-xs underline"
          onClick={openDeactivateAccount}
        >
          {t("Deactivate Account")}
        </ButtonBase>
        {(!!user?.email || !!user?.phone) && (
          <React.Fragment>
            <div className=" text-primary-900-White text-lg font-bold mt-8 mb-5 leading-8">
              {t("Security")}
            </div>
            <div className="px-5 py-4 flex flex-col items-start self-stretch gap-4 rounded-xl border border-solid border-primary-100-700">
              {!!user?.email && (
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <div className=" text-primary-900-White text-sm font-medium leading-6 mb-1">
                      {t("Email address verification (2FA)")}
                    </div>
                    <div className=" text-secondary-500-300 text-xs">
                      {t("Update your email for continued security.")}
                    </div>
                  </div>
                  <div className="w-auto text-sm font-medium text-success-600-500">
                    {t("Status on")}
                  </div>
                </div>
              )}
              {!!user?.phone && (
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <div className=" text-primary-900-White text-sm font-medium leading-6 mb-1">
                      {t("Phone Number verification (2FA)")}
                    </div>
                    <div className=" text-secondary-500-300 text-xs">
                      {t("Update your phone number for continued security.")}
                    </div>
                  </div>
                  <div className="w-auto text-sm font-medium text-success-600-500">
                    {t("Status on")}
                  </div>
                </div>
              )}
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <div className=" text-primary-900-White text-sm font-medium leading-6 mb-1">
                    {t("Password")}
                  </div>
                  <div className=" text-secondary-500-300 text-xs">
                    {t(
                      "Set a strong password for secure login and account protection."
                    )}
                  </div>
                </div>
                <ButtonBase
                  className="w-auto px-4 py-2 rounded-lg bg-background-secondary-White-700 border border-solid border-primary-100-700 text-primary-900-White text-sm font-medium"
                  onClick={toSetPassword}
                >
                  {t("Set Password")}
                </ButtonBase>
              </div>
            </div>
          </React.Fragment>
        )}
        <div className="no-underline w-full flex flex-col my-8 py-3">
          <div
            className="flex w-full justify-between items-center text-primary-900-White text-lg font-bold leading-8"
            onClick={() => openOrCloseSubscription(!isSubscription)}
          >
            <div className="text-primary-900-White text-lg font-bold leading-8">
              {t("Notifications")}
            </div>
            <Switch
              checked={isSubscription}
              className="w-9 h-5 p-0"
              classes={{
                track: "rounded-full opacity-100 bg-primary-100-700",
                thumb: "w-4 h-4 text-white flex-shrink-0",
                switchBase: "p-[2px] transition-all",
                checked: "translate-x-0 pl-5 bg-accent-600 w-full rounded-full ",
              }}
            />
            {/* <Switch
              checked={isSubscription}
              className="w-9 h-5 p-0 flex items-center"
              classes={{
                track: cn("rounded-full", {
                  "bg-primary opacity-100": isSubscription,
                }),
                thumb: "w-4 h-4 text-white",
                switchBase: "p-0 top-0.5 ml-[2px]",
                checked: "translate-x-[22px] -ml-1",
              }}
              sx={{
                "& .Mui-checked+.MuiSwitch-track": {
                  backgroundColor: "#FF4F20 !important",
                },
              }}
            /> */}
          </div>
          <div className="text-secondary-500-300 text-xs">
            {t("Receive Timely Notifications from SoSoValue")}
          </div>
        </div>
        <div className="text-primary-900-White text-lg font-bold leading-8">
          {t("Owned")}
        </div>
        <div className="text-secondary-500-300 text-xs">{t("Owned tip")}</div>
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            arrow
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            placement="top-end"
            classes={{
              tooltip:
                "p-2 bg-tooltip-800 rounded-xl border border-solid border-primary-100-700 shadow",
              arrow: "text-tooltip-800",
            }}
            className="text-justify"
            title={
              <div className="flex items-center text-base flex-col gap-4 text-white-white">
                <div>{t("gift tip1")}</div>
                <div>
                  {t("gift tip2")}{" "}
                  <span className="font-bold">{t("SoSo Exp")}</span>
                  {t("gift tip3")}
                </div>
                <div>{t("gift tip4")}</div>
              </div>
            }
          >
            <ButtonBase
              onClick={() => setOpen(true)}
              className="flex p-3 justify-center items-center gap-2 rounded-xl border border-solid border-primary-100-700 text-secondary-500-300 mt-4"
            >
              <Gift className="w-6 h-6" />
              {taskData?.sumGiftNum || 0}
            </ButtonBase>
          </Tooltip>
        </ClickAwayListener>
      </div>
    </>
  );
};

export default PersonalCenter;
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "center"])),
      // Will be passed to the page component as props
    },
  };
}
