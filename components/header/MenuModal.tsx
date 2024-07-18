import { useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useRequest } from "ahooks";

import NiceModal, { useModal, muiDialogV5 } from "@ebay/nice-modal-react";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import { getUserExp } from "http/user";

import useTelegramStore from "store/useTelegramStore";
import { useThemeStore } from "store/useThemeStore";
import { telegramHelper } from "helper/telegram";

import Toggle from "components/toggle";
import MessageIcon from "components/icons/message";
import LogoIcon from "components/icons/logo";
import CloseSvg from "components/icons/close.svg";
import DarkSvg from "components/icons/theme-dark.svg";
import LangSvg from "components/icons/lang.svg";
import ArrowRight from "components/icons/arrow-right.svg";
import ExpBand from "components/icons/exp-band.svg";
import HelpSvg from "components/icons/help.svg";
import Feedback from "components/icons/feed-back.svg";
import ExitSvg from "components/icons/exit.svg";
import TgBand from "components/icons/tg-band.svg";
import TwBand from "components/icons/tw-band.svg";
import UserCircleSvg from "components/icons/user-circle.svg";

import { Language, ThemeContext } from "store/ThemeStore";
import { getLang as getStorageLang } from "helper/storage";
import { trackChangeLanguage } from "helper/track";
import AnnModal from "./AnnModal";
import LangModal from "./LangModal";
import { UserContext } from "store/UserStore";
import InterceptionToken from "components/operation/auth/InterceptionToken";

const languageMap = [
  { key: Language.EN, name: "English", tag: "EN" },
  { key: Language.ZH, name: "简体中文", tag: "ZH" },
  { key: Language.TC, name: "繁体中文", tag: "TC" },
  { key: Language.JA, name: "日本語", tag: "JA" },
];

const userPhoto = (
  <span className="inline-flex justify-center items-center w-10 h-10 bg-shadow-100-700 text-secondary-700-100 rounded-full">
    <UserCircleSvg />
  </span>
);

interface Props {
  unread: boolean;
}

const MenuModal = NiceModal.create((props: Props) => {
  const { unread } = props;
  const { t } = useTranslation(["common"]);
  const { isTelegram, telegramBotInfo } = useTelegramStore();
  const { user, authModal } = useContext(UserContext);
  const modal = useModal();
  const { locale, push } = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { changeLang } = useContext(ThemeContext);
  const { logout } = useContext(UserContext);

  useEffect(() => {
    getStorageLang();
  }, []);

  const { data: expRes } = useRequest(getUserExp, {
    cacheKey: "getUserExp",
    refreshDeps: [modal.visible],
    ready: Boolean(modal.visible && user),
  });

  const linkHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTelegram) {
      e.preventDefault();
      telegramHelper.openBrowser(e.currentTarget.href);
    }
  };

  const langTag = useMemo(() => {
    return languageMap.find((x) => x.key === locale)?.tag || "";
  }, [locale]);

  const handlePersonalClick = () => {
    modal.hide();
    push("/personalCenter");
  };

  const handleAnnClick = () => {
    NiceModal.show(AnnModal);
  };

  const handleFeedbackClick = () => {
    modal.hide();
    push("/feedback");
  };

  const handleLangClick = () => {
    NiceModal.show(LangModal, { options: languageMap, value: locale }).then(
      (val) => {
        trackChangeLanguage(val as string);
        changeLang(val);
      }
    );
  };

  const handleLogin = () => {
    authModal?.openSignupModal();
  };

  const handleLogout = () => {
    logout();
    modal.hide();
  };

  return (
    <Dialog fullScreen {...muiDialogV5(modal)}>
      <header className="header-base text-center relative">
        <LogoIcon full />
        <ButtonBase
          onClick={() => modal.hide()}
          className="svg-icon-base text-primary-800-50 absolute right-4 top-2"
        >
          <CloseSvg />
        </ButtonBase>
      </header>
      <div className="bg-dropdown-White-800 h-full p-3 flex-col justify-start items-start gap-2 flex">
        {user ? (
          <>
            <ButtonBase
              onClick={handlePersonalClick}
              className="text-sm w-full px-4 py-2.5 justify-start items-center gap-2 flex rounded-xl"
            >
              {user.photo ? (
                <Avatar alt="Personal" src={user.photo} />
              ) : (
                userPhoto
              )}
              <span className="font-semibold">{t("Personal Center")}</span>
            </ButtonBase>
            <ButtonBase className="text-sm w-full h-10 px-4 py-2 justify-start items-center gap-2 flex rounded-xl">
              <ExpBand />
              {expRes && expRes.data && `${expRes.data.currentExp} ${t("Exp")}`}
            </ButtonBase>
          </>
        ) : (
          <ButtonBase
            onClick={handleLogin}
            className="text-sm w-full px-4 py-2.5 justify-start items-center gap-2 flex rounded-xl"
          >
            {userPhoto}
            <span className="text-accent-600 font-semibold">{`${t(
              "Log In"
            )} / ${t("Sign Up")}`}</span>
          </ButtonBase>
        )}
        <ButtonBase
          onClick={handleAnnClick}
          className="text-sm w-full h-10 px-4 py-2 justify-start items-center gap-2 flex rounded-xl"
        >
          <MessageIcon unread={unread} ellipsePosClsx="-top-1 -right-1" />{" "}
          {t("Announcements")}
        </ButtonBase>
        <ButtonBase
          onClick={handleLangClick}
          className="text-sm w-full h-10 px-4 py-2 justify-between items-center gap-2 flex rounded-xl"
        >
          <span className="inline-flex items-center gap-2 ">
            <LangSvg /> {t("Language")}
          </span>
          <span className="inline-flex items-center gap-2 ">
            {langTag} <ArrowRight />
          </span>
        </ButtonBase>
        <ButtonBase
          href="https://sosovalue.gitbook.io/helpdocument/"
          target="_blank"
          className="text-sm w-full h-10 px-4 py-2 justify-start items-center gap-2 flex rounded-xl"
        >
          <HelpSvg /> {t("Help")}
        </ButtonBase>
        <InterceptionToken>
          <ButtonBase
            onClick={handleFeedbackClick}
            className="text-sm w-full h-10 px-4 py-2 justify-start items-center gap-2 flex rounded-xl"
          >
            <Feedback />
            {t("Feedback")}
          </ButtonBase>
        </InterceptionToken>
        <div className="text-sm w-full h-10 px-4 py-2 justify-between items-center flex">
          <span className="inline-flex items-center gap-2 ">
            <DarkSvg /> {t("Dark Modal")}
          </span>
          <Toggle
            checked={theme === "dark"}
            onChange={(evt) => {
              toggleTheme(evt.target.checked ? "dark" : "light");
            }}
          />
        </div>
        {Boolean(user) && (
          <ButtonBase
            className="text-sm w-full h-10 px-4 py-2 text-error-600-500 justify-start items-center gap-2 flex rounded-xl"
            onClick={() => handleLogout()}
          >
            <ExitSvg /> {t("Log Out")}
          </ButtonBase>
        )}
      </div>
      <footer className="bg-dropdown-White-800 border-primary-100-700 border-0 border-t border-solid px-5 py-1.5">
        <p className="text-xs text-secondary-500-300 m-0 py-2 flex justify-center items-center gap-2">
          <ButtonBase
            onClick={linkHandler}
            href="https://alpha.sosovalue.xyz/blog/terms-of-service"
          >
            {t("Terms")}
          </ButtonBase>
          <span className="w-1 h-1 inline-block bg-secondary-500-300 rounded-full" />
          <ButtonBase
            onClick={linkHandler}
            href="https://alpha.sosovalue.xyz/blog/privacy-policy"
          >
            {t("Privacy policy")}
          </ButtonBase>
        </p>
        <div className="flex justify-center text-placeholder-500-300">
          <ButtonBase
            className="p-2 rounded-full"
            href="https://t.me/SoSoValueCommunity"
            target="_blank"
          >
            <TgBand />
          </ButtonBase>
          <ButtonBase
            className="p-2 rounded-full"
            href="https://twitter.com/SoSoValueCrypto"
            target="_blank"
          >
            <TwBand />
          </ButtonBase>
        </div>
      </footer>
    </Dialog>
  );
});

export default MenuModal;
