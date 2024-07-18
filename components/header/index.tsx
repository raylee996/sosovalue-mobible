import { useContext, useMemo, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";

import { pushMessagesDo } from "http/home";
import { UserContext } from "store/UserStore";
import useTelegramStore from "store/useTelegramStore";
import usePwaStore, { useInstallPWA } from "store/usePwaStore";
import useNotistack from "hooks/useNotistack";
import { isBrowser, parseUA } from "helper/tools";
// import DownIcon from "components/icons/download";
import MenuIcon from "components/icons/menu";
import LogoIcon from "components/icons/logo";
import SearchInput from "./SearchInput";
import MenuModal from "./MenuModal";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
const DownIcon = dynamic(
  () => import("components/icons/download"),
  {
    ssr: false,
  }
);
interface Props {
  // .
}

const Index = (props: Props) => {
  const { success } = useNotistack();
  const router = useRouter();
  const { user, userModal } = useContext(UserContext);
  const { t } = useTranslation(["common"]);
  const [installing, setInstalling] = useState(false);
  const { isTelegram } = useTelegramStore();

  const { data: msgRes } = useRequest(
    () => pushMessagesDo({ isRead: 1, receiverId: user!.id }),
    {
      ready: Boolean(user?.id),
      refreshDeps: [user],
    }
  );

  const unread = msgRes?.data === false;

  const { isInStandalone, isReadyInstall } = usePwaStore(
    ({ isInStandalone, isReadyInstall }) => ({
      isInStandalone,
      isReadyInstall,
    })
  );

  const isShowInstall = useMemo(() => {
    return (
      !isTelegram &&
      !isInStandalone &&
      (isReadyInstall || !parseUA().isChrome) &&
      !installing
    );
  }, [isTelegram, isInStandalone, isReadyInstall, installing]);

  const { installPWA } = useInstallPWA({
    onAppinstalled() {
      success(t("Installing"));
      setInstalling(true);
    },
  });

  const installClick = () => {
    const ua = parseUA();
    if (ua.isChrome) {
      installPWA();
    } else {
      userModal?.installPwa.open();
    }
  };

  const handleMenuToggle = () => {
    NiceModal.show(MenuModal, { unread });
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="header-base flex items-center gap-3">
      <LogoIcon onClick={handleLogoClick} />
      <SearchInput className="flex-grow" />
      {isShowInstall && <DownIcon onClick={installClick} />}
      <MenuIcon unread={unread} onClick={handleMenuToggle} />
    </header>
  );
};

export default Index;
