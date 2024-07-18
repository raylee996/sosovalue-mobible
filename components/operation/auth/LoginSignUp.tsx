import Link from "next/link";
import React, { useContext, useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { UserContext } from "store/UserStore";
import useDimensionDict from "hooks/operation/useDimensionDict";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";
import useTelegramStore from "store/useTelegramStore";
import { telegramHelper } from "helper/telegram";
import Tabs from "components/base/tabs";
import ThirdLoginButtonGroup from "../thirdparty/login/ThirdpartyLoginButtonGroup";
import AuthModalLayout from "components/layout/AuthModalLayout";
import TelegramIcon from "components/icons/Telegram.svg";

import { Button } from "@mui/material";
import { thirdPartyLogin } from "http/user";
import { useRouter } from "next/router";

const LoginSignUp = () => {
  const { advertisementConfig } = useDimensionDict({ withAll: false });
  const { loginSeccess, authModal, googleLogin, twitterLoginRedirect } =
    useContext(UserContext);
  const { isTelegram } = useTelegramStore();
  const [unRegisterEmail, setUnRegisterEmail] = useState("");
  const [parent] = useAutoAnimate();
  const [gurandfather] = useAutoAnimate();
  const { t } = useTranslation([localeType.COMMON, localeType.CENTER]);
  const { telegramUser } = useTelegramStore();
  const router = useRouter();
  const linkHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTelegram) {
      e.preventDefault();
      telegramHelper.openBrowser(e.currentTarget.href);
    }
  };
  // 选择登录或注册
  const handleAuthSelect = (value: "login" | "register") => {
    const actions = {
      login: authModal?.openLoginTab,
      register: authModal?.openSignUpTab,
    };
    actions[value]?.();
  };
  const handleTelegramSignUp = async () => {
      telegramHelper.getTelegramUserData().then(async telegramUser => {
        if (!telegramUser?.id) return;

        const res = await thirdPartyLogin({
          authDate: telegramUser.auth_date,
          firstName: telegramUser.first_name,
          oauthToken: telegramUser.hash,
          photoUrl: telegramUser.photo_url,
          thirdpartyId: telegramUser.id + '',
          thirdpartyName: "telegram",
          username: telegramUser.username,
          lastName: telegramUser.last_name,
        });

        if (res.code === 0) {
          loginSeccess(res.data.token);
          router.replace("/exp");
        }
      })
  }

  return (
    <div ref={gurandfather}>
      <div>
        <Tabs
          variant="underline"
          size="sm"
          onChange={handleAuthSelect}
          value={authModal?.loginTabIndex}
        >
          <Tabs.Item value="login">{t("Log In")}</Tabs.Item>
          <Tabs.Item value="register">{t("Sign Up")}</Tabs.Item>
        </Tabs>
      </div>
      <AuthModalLayout ref={parent}>
        {authModal?.showSignUpTab ? (
          <SignUp unRegisterEmail={unRegisterEmail} />
        ) : (
          <Login setUnRegisterEmail={(email) => setUnRegisterEmail(email)} />
        )}
        <div className="text-content text-sm flex items-center justify-between w-full my-8">
          <i className="flex-1 h-[1px] bg-primary-100-700"></i>
          <span className="mx-4">{t("or")}</span>
          <i className="flex-1 h-[1px] bg-primary-100-700"></i>
        </div>
        <div className="">
          {
            isTelegram ? <Button onClick={handleTelegramSignUp} fullWidth className="bg-background-secondary-White-700 normal-case text-primary-900-White text-sm h-10 rounded-e-lg border border-solid border-primary-100-700 rounded-lg space-x-1">
            <TelegramIcon /><span>Continue with Telegram</span></Button> : <ThirdLoginButtonGroup />
          }
        </div>
        <div className="mt-8 text-xs text-content text-center text-secondary-500-300">
          {t("By signing up,you agree to our")}{" "}
          <Link
            className="underline"
            href="https://alpha.sosovalue.xyz/blog/terms-of-service"
            target="_blank"
            onClick={linkHandler}
          >
            {t("Terms")}
          </Link>{" "}
          {t("and")}{" "}
          <Link
            className="underline"
            href="https://alpha.sosovalue.xyz/blog/privacy-policy"
            target="_blank"
            onClick={linkHandler}
          >
            {t("Privacy Policy")}
          </Link>
        </div>
      </AuthModalLayout>
    </div>
  );
};

export default LoginSignUp;
