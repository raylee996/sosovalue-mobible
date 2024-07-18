import { Button } from "@mui/material";
import ExpIcon from "components/svg/navigate/ExpIcon";
import ExpIconActive from "components/svg/navigate/ExpIconActive";
import ResearchIcon from "components/svg/navigate/ResearchIcon";
import ResearchIconActive from "components/svg/navigate/ResearchIconActive";
import HomeIcon from "components/svg/navigate/HomeIcon";
import HomeIconActive from "components/svg/navigate/HomeIconActive";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "store/UserStore";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Audio from "components/base/Audio";
import { useNavigateEvent } from "store/DirtyStore";
import useTelegramStore from "store/useTelegramStore";

const Navigate = () => {
  const { user, authModal } = useContext(UserContext);
  const { isTelegram } = useTelegramStore()
  const { emitClickHome, emitClickResearch } = useNavigateEvent();
  const router = useRouter();
  const isResearch =
    router.pathname === "/research" && !authModal?.showLoginSignUp;
  const isPortfolio =
    router.pathname === "/portfolio" && !authModal?.showLoginSignUp;
  const isSearch = router.pathname === "/search" && !authModal?.showLoginSignUp;
  const isHome = router.pathname === "/" && !authModal?.showLoginSignUp;
  const isExp = router.pathname === "/exp" || authModal?.showLoginSignUp;
  const { t } = useTranslation("common");
  const toHome = () => {
    if (authModal?.open) {
      authModal.closeModal();
    }
    if (router.pathname !== "/") {
      router.push("/");
    } else {
      emitClickHome();
    }
  };
  const toResearch = () => {
    if (authModal?.open) {
      authModal.closeModal();
    }
    if (router.pathname !== "/research") {
      router.push("/research");
    } else {
      emitClickResearch();
    }
  };
  const toSearch = () => {
    if (authModal?.open) {
      authModal.closeModal();
    }
    if (router.pathname !== "/search") {
      router.push("/search");
    }
  };
  const redirectToAuth = (pathname: string) => {
    if (user) return router.push(pathname);
    isTelegram ? router.push('/telegram/login') : authModal?.openSignupModal()
  };

  return (
    <div className={`relative ${isTelegram ? 'h-[4.5rem]' : 'h-[6.375rem]'}`}>
      {/* <Audio /> */}
      <div className="h-full w-full flex items-stretch bg-[#1F1F1F]">
        <Button
          onClick={toHome}
          className={`flex-col text-xs normal-case flex-1 ${
            isHome ? "text-title" : "text-content"
          }`}
        >
          {isHome ? <HomeIconActive /> : <HomeIcon />}
          <span>{t("Home")}</span>
        </Button>
        <Button
          onClick={toResearch}
          className={`flex-col text-xs normal-case flex-1 ${
            isResearch ? "text-title" : "text-content"
          }`}
        >
          {isResearch ? <ResearchIconActive /> : <ResearchIcon />}
          <span>{t("Feeds")}</span>
        </Button>
        <Button
          onClick={toSearch}
          className={`flex-col text-xs normal-case flex-1 ${
            isSearch ? "text-title" : "text-content"
          }`}
        >
          <Image
            src={
              isSearch
                ? "/img/svg/MagnifyingGlass-active.svg"
                : "/img/svg/MagnifyingGlass.svg"
            }
            width={24}
            height={24}
            alt=""
          />
          <span>{t("Search")}</span>
        </Button>
        <Button
          onClick={() => redirectToAuth("/portfolio")}
          className={`flex-col text-xs normal-case flex-1 ${
            isPortfolio ? "text-title" : "text-content"
          }`}
        >
          <Image
            src={
              isPortfolio
                ? "/img/svg/FolderSimpleStar-white.svg"
                : "/img/svg/FolderSimpleStar.svg"
            }
            width={24}
            height={24}
            alt=""
          />
          <span>{t("Portfolio")}</span>
        </Button>
        <Button
          onClick={() => redirectToAuth("/exp")}
          className={`flex-col text-xs normal-case flex-1 ${
            isExp ? "text-title" : "text-content"
          }`}
        >
          <Image
            src={isExp ? "/img/exp-icon-active.png" : "/img/exp-icon.png"}
            width={24}
            height={24}
            alt=""
          />
          <span>{t("Exp")}</span>
        </Button>
      </div>
    </div>
  );
};

export default Navigate;
