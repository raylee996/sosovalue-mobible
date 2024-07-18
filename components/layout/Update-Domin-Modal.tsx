import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { ArrowSquareIn, DownloadSimple, X } from "@phosphor-icons/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import usePwaStore, { useInstallPWA } from "store/usePwaStore";
import { parseUA } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { UserContext } from "store/UserStore";
// import { ColorModeContext } from "store/ThemeStore";

const HKETFDialog = () => {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { success } = useNotistack();
  const [installing, setInstalling] = useState(false);
  const { userModal } = useContext(UserContext);
  const { isInStandalone } = usePwaStore(({ isInStandalone }) => ({
    isInStandalone,
  }));

  useEffect(() => {
    const updateShown = localStorage.getItem("updateShown");
    const today = new Date().toISOString().slice(0, 10);

    if (updateShown !== today) {
      setOpen(true);
      localStorage.setItem("updateShown", today);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

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

  if (!mounted) {
    return null;
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        classes={{
          paper: "bg-dropdown-White-800 overflow-visible rounded-xl",
        }}
      >
        <div className="h-full bg-dropdown-White-800 w-full overflow-hidden flex flex-col items-stretch">
          <div
            className="text-primary-900-White w-full h-10 px-4 mt-2 mb-4 flex items-center justify-between"
            onClick={handleClose}
          >
            <span></span>
            <div className="">Alert</div>
            <X size={24} className="" />
          </div>
          <div className="bg-dropdown-White-800 p-1.5 text-center rounded-xl border border-solid border-primary-100-700">
            <Image
              src={`/img/logo/update-logo-dark.png`}
              alt=""
              layout="responsive"
              width={300}
              height={200}
            />
            <div className="p-6">
              <div
                className="text-left text-primary-900-White text-xl font-bold"
                dangerouslySetInnerHTML={{
                  __html: t("domin title")!,
                }}
              ></div>
              <div
                className="text-primary-900-White text-base mt-4 text-left"
                dangerouslySetInnerHTML={{
                  __html: t(isInStandalone ? "domin tip1 pwa" : "domin tip1", {
                    href: "http://m.sosovalue.com",
                    class: "text-info",
                  })!,
                }}
              ></div>
              <div className="text-primary-900-White text-base mt-4 text-left">
                {t(isInStandalone ? "domin tip2 pwa" : "domin tip2")}
              </div>
              <div className="text-primary-900-White text-base mt-4 text-left">
                {t(isInStandalone ? "domin tip3 pwa" : "domin tip3")}
              </div>

              {isInStandalone ? (
                <Button
                  onClick={installClick}
                  variant="contained"
                  className="normal-case mt-12 w-full flex items-center"
                  color="primary"
                >
                  <DownloadSimple size={24} color="#ffffff" className="mr-2" />
                  {t("Reinstall Applicaiton")}
                </Button>
              ) : (
                <Link href="https://m.sosovalue.com" className="no-underline">
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    className="normal-case mt-12 w-full flex items-center"
                    color="primary"
                  >
                    <ArrowSquareIn size={24} color="#ffffff" className="ml-2" />
                    {t("Visit sosovalue.com")}
                  </Button>
                </Link>
              )}
              <div
                className="text-secondary-500-300 text-sm mt-4 text-left"
                dangerouslySetInnerHTML={{
                  __html: t("domin tip4", {
                    href: "https://x.com/SoSoValueCrypto",
                    class: "text-info",
                  })!,
                }}
              ></div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HKETFDialog;
