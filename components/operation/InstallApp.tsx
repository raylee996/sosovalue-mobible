import { Button, ButtonBase } from "@mui/material";
import { Drawer } from "@mui/material";
import { copyText, parseUA } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import Image from "next/image";
import { ReactNode, useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import { UserContext } from "store/UserStore";
import { useRouter } from "next/router";

const InstallApp = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { userModal } = useContext(UserContext);
  const { success } = useNotistack();
  const { t } = useTranslation("common");

  const copyLink = () => {
    copyText(window.location.href);
    success(t("Copy successful", { ns: "common" }));
    onClose();
  };
  const onClose = () => {
    userModal?.installPwa.close();
  };

  const chrome = (
    <div>
      <Image
        className="w-full h-auto"
        src="/img/install-app/chrome.png"
        width={684}
        height={467}
        alt=""
      />
      <div className="py-6">
        <div className="text-sm text-primary-900-White mb-4 flex items-start">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            1
          </span>
          {t("chrome or firefox tip1")}
        </div>
        <div className="text-sm text-primary-900-White flex items-start mb-8">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            2
          </span>
          {t("chrome or firefox tip2")}
        </div>
        <div
          className="text-secondary-500-300 text-sm text-left"
          dangerouslySetInnerHTML={{
            __html: t("domin tip4", {
              href: "https://x.com/SoSoValueCrypto",
              class: "text-info",
            })!,
          }}
        ></div>
      </div>
    </div>
  );

  const iosChrome = (
    <div>
      <Image
        className="w-full h-auto"
        src="/img/install-app/ios-chrome.png"
        width={684}
        height={467}
        alt=""
      />
      <div className="py-6">
        <div className="text-sm text-primary-900-White mb-4 flex items-start">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            1
          </span>
          {t("Safari-chrome tip1")}
        </div>
        <div className="text-sm text-primary-900-White flex items-start mb-8">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            2
          </span>
          {t("Safari-chrome tip2")}
        </div>

        <Button
          className="text-sm normal-case border-content font-bold h-10 text-info"
          onClick={() => setShow(true)}
        >
          {t("cannot find it")}
        </Button>
      </div>
    </div>
  );

  const safari = (
    <div>
      <Image
        className="w-full h-auto"
        src="/img/install-app/safari.png"
        width={684}
        height={467}
        alt=""
      />
      <div className="py-6">
        <div className="text-sm text-primary-900-White mb-4 flex items-start">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            1
          </span>
          {t("Safari tip1")}
        </div>
        <div className="text-sm text-primary-900-White flex items-start mb-8">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            2
          </span>
          {t("Safari tip2")}
        </div>
        <div
          className="text-secondary-500-300 text-sm text-left"
          dangerouslySetInnerHTML={{
            __html: t("domin tip4", {
              href: "https://x.com/SoSoValueCrypto",
              class: "text-info",
            })!,
          }}
        ></div>
      </div>
    </div>
  );
  const edge = (
    <div>
      <Image
        className="w-full h-auto"
        src="/img/install-app/edge.png"
        width={684}
        height={467}
        alt=""
      />
      <div className="py-6">
        <div className="text-sm text-primary-900-White mb-4 flex items-start">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            1
          </span>
          {t("edge tip1")}
        </div>
        <div className="text-sm text-primary-900-White flex items-start mb-8">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            2
          </span>
          {t("edge tip2")}
        </div>
        <div
          className="text-secondary-500-300 text-sm text-left"
          dangerouslySetInnerHTML={{
            __html: t("domin tip4", {
              href: "https://x.com/SoSoValueCrypto",
              class: "text-info",
            })!,
          }}
        ></div>
      </div>
    </div>
  );
  const firefox = (
    <div>
      <Image
        className="w-full h-auto"
        src="/img/install-app/firefox.png"
        width={684}
        height={467}
        alt=""
      />
      <div className="py-6">
        <div className="text-sm text-primary-900-White mb-4 flex items-start">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            1
          </span>
          {t("Safari-chrome tip1")}
        </div>
        <div className="text-sm text-primary-900-White flex items-start mb-8">
          <span className="w-6 h-6 rounded-[50%] bg-accent-600 mr-2 text-white flex items-center justify-center shrink-0">
            2
          </span>
          {t("Safari-chrome tip2")}
        </div>
        <div
          className="text-secondary-500-300 text-sm text-left"
          dangerouslySetInnerHTML={{
            __html: t("domin tip4", {
              href: "https://x.com/SoSoValueCrypto",
              class: "text-info",
            })!,
          }}
        ></div>
      </div>
    </div>
  );

  const IosOther = (
    <div className="p-6">
      <div className="text-primary-900-White text-lg font-bold">
        {t("safari other tip1")}
      </div>
      <div className="text-primary-900-White text-xs mt-4">
        {t("safari other tip2")}
      </div>
      <Button
        className="text-sm text-white normal-case border-accent-600 bg-accent-600 font-bold mt-9 mb-3 h-10 rounded-lg"
        variant="outlined"
        fullWidth
        onClick={copyLink}
      >
        {t("Copy link")}
      </Button>
      <Button
        className="text-sm normal-case bg-dropdown-White-800 text-primary-900-White border-primary-100-700 font-bold h-10 rounded-lg"
        variant="outlined"
        fullWidth
        onClick={onClose}
      >
        {t("Continue")}
      </Button>
      <div
        className="text-secondary-500-300 text-sm text-left mt-8"
        dangerouslySetInnerHTML={{
          __html: t("domin tip4", {
            href: "https://x.com/SoSoValueCrypto",
            class: "text-info",
          })!,
        }}
      ></div>
    </div>
  );

  // 其他
  const others = (
    <div className="p-6">
      <div className="text-primary-900-White text-lg font-bold">
        {t("Better experience in andr")}
      </div>
      <div className="text-primary-900-White text-xs mt-4">
        {t("chrome other tip")}
      </div>
      {/* <ul className="m-0">
        {["Chrome", "Microsoft Edge", "Firefox"].map(
          (browse: string, idx: number) => {
            return (
              <li key={browse + idx} className="text-primary-900-White text-sm mt-4">
                {browse}
                {!idx && "(" + t("recommend") + ")"}
              </li>
            );
          }
        )}
      </ul> */}
      <Button
        className="text-sm text-white normal-case border-accent-600 bg-accent-600 font-bold mt-9 mb-3 h-10 rounded-lg"
        variant="outlined"
        fullWidth
        onClick={copyLink}
      >
        {t("Copy link")}
      </Button>
      <Button
        className="text-sm normal-case bg-dropdown-White-800 text-primary-900-White border-primary-100-700 font-bold h-10 rounded-lg"
        variant="outlined"
        fullWidth
        onClick={onClose}
      >
        {t("Continue")}
      </Button>
      <div
        className="text-secondary-500-300 text-sm text-left mt-8"
        dangerouslySetInnerHTML={{
          __html: t("domin tip4", {
            href: "https://x.com/SoSoValueCrypto",
            class: "text-info",
          })!,
        }}
      ></div>
    </div>
  );

  const renderDialog = (children: ReactNode, hideHeader?: boolean) => {
    return (
      <Drawer
        open={
          !!userModal?.installPwa.show &&
          router.pathname !== "/scholarship-s1-community-vote" && router.pathname !== "/brain-battle"
        }
        onClose={onClose}
        anchor="bottom"
        classes={{
          paper:
            "border border-solid border-primary-100-700 bg-dropdown-White-800 rounded-t-lg p-4 pt-2 bg-none",
        }}
      >
        {!hideHeader ? <div className="flex items-center justify-center p-3 relative">
          <span></span>
          <span className="text-primary-900-White text-base font-bold">
            {t("Install SoSoValue")}
          </span>
          <ButtonBase
            onClick={onClose}
            className="py-2 px-4 text-secondary-500-300 text-sm font-medium absolute right-0"
          >
            {t("Skip")}
          </ButtonBase>
        </div> : null}
        {children}
      </Drawer>
    );
  };
  const renderContent = () => {
    const ua = parseUA();
    if (ua.isIos) {
      if (ua.isSafari) {
        return renderDialog(safari);
      } else if (ua.isChrome) {
        return renderDialog(show ? IosOther : iosChrome, show);
      } else {
        return renderDialog(IosOther, true);
      }
    } else if (ua.isAndroid) {
      if (ua.isChrome) {
        return renderDialog(chrome);
        // 由于 edg 和 firefox 需要授权安装pwa，我们无法直接控制浏览器打开快捷方式 的权限，则不支持安装pwa
        // } else if (ua.isEdg) {
        //   return renderDialog(edge);
        // } else if (ua.isFirefox) {
        //   return renderDialog(firefox);
      } else {
        return renderDialog(others, true);
      }
    } else {
      return renderDialog(others, true);
    }
  };
  return renderContent() || null;
};

export default InstallApp;
