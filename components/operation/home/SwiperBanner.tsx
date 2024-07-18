import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useContext, useEffect, useMemo, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button, IconButton } from "@mui/material";
import Image from "next/image";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { Notification } from "@phosphor-icons/react";
import { copyText, parseUA } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { useRouter } from "next/router";
import usePwaStore, { useInstallPWA } from "store/usePwaStore";
import { UserContext } from "store/UserStore";
import { useTCommon } from "hooks/useTranslation";
import Link from "next/link";
import { getPcWebsite } from "helper/config";

const SwiperBanner = () => {
  const { userModal } = useContext(UserContext);

  const { t: tCommon } = useTCommon();
  const { success } = useNotistack();
  const [index, setIndex] = useState(0);
  const [installing, setInstalling] = useState(false);
  const { isInStandalone, isReadyInstall } = usePwaStore(
    ({ isInStandalone, isReadyInstall }) => ({
      isInStandalone,
      isReadyInstall,
    })
  );
  const isShowInstall = useMemo(() => {
    return (
      !isInStandalone && (isReadyInstall || !parseUA().isChrome) && !installing
    );
  }, [isInStandalone, isReadyInstall, installing]);
  const { installPWA } = useInstallPWA({
    onAppinstalled() {
      success(tCommon("Installing"));
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
  const copyPcIndexLink = () => {
    copyText(`${getPcWebsite()}/assets/cryptoIndex`);
    success("success");
  };
  const [parentRef] = useAutoAnimate((el, action) => {
    let keyframes: Keyframe[] = [];
    // supply a different set of keyframes for each action
    if (action === "add") {
      keyframes = [
        { transform: "translateY(-20px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ];
    }
    // keyframes can have as many "steps" as you prefer
    // and you can use the 'offset' key to tune the timing
    if (action === "remove") {
      keyframes = [
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(20px)", opacity: 0 },
      ];
    }
    return new KeyframeEffect(el, keyframes, {
      duration: 300,
      easing: "ease-in-out",
    });
  });
  useEffect(() => {
    let timer: number;
    if (isShowInstall) {
      timer = window.setInterval(() => {
        setIndex((index) => (index === 0 ? 1 : 0));
      }, 3000);
    }
    return () => {
      timer && window.clearInterval(timer);
    };
  }, [isShowInstall]);
  const installNode = (
    <div
      className="flex items-center justify-between h-full w-full px-3"
      key={0}
    >
      <div className="flex items-center min-h-[60px]">
        <Image
          src="/img/svg/Notification.svg"
          className="mr-4"
          width={32}
          height={32}
          alt=""
        />
        <div>
          <div className="text-sm text-white font-bold">
            {tCommon("Install SoSoValue App")}
          </div>
          <div className="text-xs text-white">
            {tCommon("Never miss out any important info!")}
          </div>
        </div>
      </div>
      <Button
        onClick={installClick}
        className="normal-case text-xs font-bold h-8 px-2 ml-[10px]"
        variant="contained"
      >
        {tCommon("Install")}
      </Button>
    </div>
  );
  const tab2Node = (
    <div
      key={1}
      className="flex items-center justify-between h-full w-full px-3"
    >
      <div>
        <div className="text-sm text-white font-bold">
          {tCommon("SSI Indices Public Review")}
        </div>
        <div className="text-xs text-white">
          {tCommon("Copy and browse it on PC to access!")}
        </div>
      </div>
      <Button
        className="normal-case text-xs font-bold h-8 px-2 whitespace-nowrap ml-[10px]"
        variant="contained"
        onClick={copyPcIndexLink}
      >
        {tCommon("Copy Link")}
      </Button>
    </div>
  );
  // return isShowInstall ? (
  //   <div
  //     className="min-h-[60px] relative bg-[linear-gradient(0deg,#1A1A1A_0%,#1A1A1A_100%)]"
  //     ref={parentRef}
  //   >
  //     {installNode}
  //   </div>
  // ) : null;
  return (
    <div
      className="h-[64px] relative bg-[linear-gradient(0deg,#1A1A1A_0%,#1A1A1A_100%)]"
      ref={parentRef}
    >
      {index === 0 && isShowInstall ? installNode : tab2Node}
    </div>
  );
};

export default SwiperBanner;
