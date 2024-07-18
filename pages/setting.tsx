import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { UserContext } from "store/UserStore";
import TextField from "@mui/material/TextField";
import {
  updateUsernameV3,
  checkEmailIsRegister,
  logindResetPwd,
  checkOriginalPassword,
  thirdPartyLogin,
} from "http/user";
import useNotistack from "hooks/useNotistack";
import { useRouter } from "next/router";
import Link from "next/link";
import ChangePassword from "components/operation/user/ChangePwd";
import { useGoogleLogin } from "@react-oauth/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  removeAddress,
  getIsAllowNotify,
  setIsAllowNotify,
  getToken,
} from "helper/storage";
import { getLink } from "helper/config";
import {
  Grow,
  IconButton,
  ListItemButton,
  OutlinedInput,
  Switch,
} from "@mui/material";
import { transferAddress, transferMention } from "helper/tools";
import Username from "components/operation/auth/Username";
import useUsername from "hooks/operation/useUsername";
import Password from "components/operation/auth/Password";
import Email from "components/operation/auth/Email";
import usePassword from "hooks/operation/usePassword";
import useEmail from "hooks/operation/useEmail";
import ArrowIcon from "components/svg/Arrow";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import useOneSignalStore from "store/useOneSignalStore";
import { useShallow } from "zustand/react/shallow";
import useTelegramStore from "store/useTelegramStore";
import ThirdLoginButtonGroup from "components/operation/thirdparty/login/ThirdpartyLoginButtonGroup";

const tab = [
  { img: "/img/svg/User.svg", title: "Profile" },
  { img: "/img/svg/LinkSimple.svg", title: "Linked account" },
  { img: "/img/svg/Password.svg", title: "Security" },
];
const Center = () => {
  const router = useRouter();
  const { success } = useNotistack();
  const {
    user,
    getUserInfo,
    googleLogin,
    twitterLoginRedirect,
    verifyCode,
    authModal,
    loginSeccess,
  } = React.useContext(UserContext);
  const { isTelegram } = useTelegramStore();
  const { openOrCloseSubscription, isSubscription } = useOneSignalStore(
    useShallow((state) => ({
      openOrCloseSubscription: state.openOrCloseSubscription,
      isSubscription: state.isSubscription,
    }))
  );
  const [activeTab, setActiveTab] = React.useState("Profile");
  const { t } = useTranslation([localeType.CENTER, localeType.COMMON]);
  const username = useUsername({ validate: true, validateIsRegister: true });
  const email = useEmail({
    validate: true,
    async asyncValidate(value: string) {
      return checkEmailIsRegister(value).then((res) => ({
        result: res.success,
        msg: t("This email is already registered with SoSoValue.") as string,
      }));
    },
  });
  const bindPassword = usePassword({ validate: true });
  const { telegramUser } = useTelegramStore();
  const resetOriginalPwd = usePassword({
    validate: false,
    async asyncValidate(value: string) {
      return checkOriginalPassword(btoa(value)).then((res) => ({
        result: res.data,
        msg: t("Incorrect password"),
      }));
    },
  });
  const resetNewPwd = usePassword({ validate: true });
  const resetRePwd = usePassword({
    validate: false,
    syncValidate(value: string) {
      return {
        result: value === resetNewPwd.value,
        msg: t("The passwords do not match."),
      };
    },
  });
  const toVerify = () => {
    verifyCode
      ?.sendBindEmailCode({
        email: email.value,
      })
      .then(() => authModal?.openVerifyCode());
  };
  const toResetVerify = async () => {
    await logindResetPwd({
      originalPassword: btoa(resetOriginalPwd.value),
      password: btoa(resetNewPwd.value),
      rePassword: btoa(resetRePwd.value),
    });
    setOpenUpdatePwd(false);
    success(t("success"));
    resetOriginalPwd.reset();
    resetNewPwd.reset();
    resetRePwd.reset();
  };
  const [openChangeUsername, setOpenChangeUsername] = React.useState(false);
  const [openBindEmail, setOpenBindEmail] = React.useState(false);
  const [openUpdatePwd, setOpenUpdatePwd] = React.useState(false);
  const clickChangeUsername = () => {
    setOpenChangeUsername(true);
    username.setValue(user!.username);
  };
  const changeUsername = () => {
    updateUsernameV3({ username: username.value }).then((res) => {
      success("success");
      getUserInfo();
      setOpenChangeUsername(false);
    });
  };
  const goBack = () => {
    router.back();
  };

  React.useEffect(() => {
    if (!getToken()) {
      router.push("/");
    }
  }, []);

  return (
    <div className="w-full px-4 py-3 h-full flex flex-col items-stretch overflow-y-scroll">
      <div className="flex items-center h-12 relative border-0 border-b border-solid border-[#242424]">
        <IconButton onClick={goBack} className="text-2xl text-white">
          <ArrowIcon className="rotate-90" viewBox="0 0 12 12" />
        </IconButton>
        <span className="text-lg text-white font-black">
          {t("Settings", { ns: localeType.COMMON })}
        </span>
      </div>
      <div>
        <div
          className={`relative flex py-4 text-base text-[#F4F4F4] font-bold`}
        >
          {t("Profile")}
          <span
            className={`absolute ${
              activeTab == "Profile" ? "animate-fade" : ""
            }`}
          ></span>
        </div>
        <div>
          <div>
            {openChangeUsername ? (
              <div className="flex">
                <Username {...username} />
                <Button
                  onClick={() => setOpenChangeUsername(false)}
                  variant="outlined"
                  className="ml-3 mt-5 h-[34px] normal-case border-[#404040] text-sub-title text-sm font-semibold"
                >
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={changeUsername}
                  disabled={!username.statusInfo.isValid}
                  variant="contained"
                  className="ml-3 mt-5 h-[34px] normal-case border-[#404040] text-title text-sm font-semibold"
                >
                  {t("Save")}
                </Button>
              </div>
            ) : (
              <div>
                <div className="text-xs text-sub-title mb-1">
                  {t("Username")}
                </div>
                <div className="flex items-center overflow-hidden">
                  <OutlinedInput
                    value={user?.username}
                    readOnly
                    className={`h-[34px] text-content text-sm flex-1 ${
                      user?.usernameChangeCount === 0 ? "mr-3" : ""
                    }`}
                    classes={{
                      input: "cursor-auto",
                      notchedOutline: `border border-[#404040]`,
                    }}
                  />
                  {user?.usernameChangeCount === 0 && (
                    <Button
                      onClick={clickChangeUsername}
                      variant="outlined"
                      className="h-[34px] normal-case border-[#404040] text-sub-title text-sm font-semibold"
                    >
                      {t("Change")}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {user?.usernameChangeCount === 0 && (
              <div className="text-content text-sm mt-1">
                {t("username tip")}
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="text-xs text-sub-title mb-1">{t("Email")}</div>
            <div className="flex items-center overflow-hidden">
              <OutlinedInput
                value={user?.email}
                readOnly
                className="h-[34px] text-content text-sm flex-1"
                classes={{
                  input: "cursor-auto",
                  notchedOutline: `border border-[#404040]`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full mt-8">
        {!isTelegram && <ThirdLoginButtonGroup />}
      </div>
      <div className="mt-8">
        <div className={`py-4 text-base text-[#F4F4F4] font-bold relative`}>
          {t("Enhance Security")}
          <span
            className={`absolute ${
              activeTab == "Security" ? "animate-fade" : ""
            }`}
          ></span>
        </div>
        <div className="mb-4 text-xs text-[#C2C2C2]">
          {t("Enhance Security tip")}
        </div>
        <div>
          {user?.email ? (
            openUpdatePwd ? (
              <div>
                <Password
                  {...resetOriginalPwd}
                  className="mb-5"
                  label={
                    <div className="text-xs text-[#C2C2C2] font-bold mb-2 mt-4">
                      {t("Original password")}
                    </div>
                  }
                />
                {resetOriginalPwd.statusInfo.isValid && (
                  <Grow in={resetOriginalPwd.statusInfo.isValid}>
                    <div>
                      <Password
                        {...resetNewPwd}
                        className="mb-5"
                        label={
                          <div className="text-xs text-[#C2C2C2] font-bold mb-2 mt-4">
                            {t("New password")}
                          </div>
                        }
                      />
                    </div>
                  </Grow>
                )}
                {resetOriginalPwd.statusInfo.isValid && (
                  <Grow in={resetOriginalPwd.statusInfo.isValid}>
                    <div>
                      <Password
                        {...resetRePwd}
                        className="mb-5"
                        label={
                          <div className="text-xs text-[#C2C2C2] font-bold mb-2 mt-4">
                            {t("Re password")}
                          </div>
                        }
                      />
                    </div>
                  </Grow>
                )}
                <Button
                  fullWidth
                  disabled={
                    !resetOriginalPwd.statusInfo.isValid ||
                    !resetNewPwd.statusInfo.isValid ||
                    !resetRePwd.statusInfo.isValid
                  }
                  onClick={toResetVerify}
                  variant="contained"
                  className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-full"
                >
                  {t("Reset")}
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={() => setOpenUpdatePwd(true)}
                  variant="outlined"
                  className="h-[34px] normal-case border-[#404040] text-sub-title text-sm font-semibold"
                >
                  {t("Update password")}
                </Button>
              </div>
            )
          ) : openBindEmail ? (
            <div>
              <Email {...email} className="mb-4" />
              <Password {...bindPassword} className="mb-4" />
              <Button
                fullWidth
                disabled={
                  !email.statusInfo.isValid || !bindPassword.statusInfo.isValid
                }
                onClick={toVerify}
                variant="contained"
                className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-full"
              >
                {t("Verify")}
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-xs text-[#C2C2C2] w-[400px]">
                {t("Linking an email enhances")}
              </div>
              <Button
                onClick={() => setOpenBindEmail(true)}
                variant="outlined"
                className="h-[34px] normal-case border-[#404040] text-sub-title text-sm font-semibold"
              >
                {t("Link email")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <div
          className="flex items-center justify-between"
          onClick={() => openOrCloseSubscription(!isSubscription)}
        >
          <div className={`py-4 text-base text-[#F4F4F4] font-bold relative`}>
            Notifications
          </div>
          <Switch
            checked={isSubscription}
            className="w-[51px] h-[31px] p-0 flex items-center"
            classes={{
              track: "rounded-full bg-[#787880]",
              thumb: "w-[27px] h-[27px] text-white",
              switchBase: "p-0 top-0.5",
              checked: "translate-x-[22px]",
            }}
            sx={{
              "& .Mui-checked+.MuiSwitch-track": {
                backgroundColor: "#FF4F20 !important",
              },
            }}
          />
        </div>
        <div className="mb-4 text-xs text-[#C2C2C2]">
          Receive Timely Notifications from SoSoValue
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end mb-8 text-xs text-[#525252]">
        {t("send email tip")}
      </div>
    </div>
  );
};

export default Center;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "center"])),
      // Will be passed to the page component as props
    },
  };
}
