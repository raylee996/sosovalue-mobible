import { getGId, getTrackUrl } from "helper/config";
import { initTrack } from "helper/track";
import React from "react";
import { useRouter } from "next/router";
import FixSafariVHDIV from "components/base/FixSafariVHDIV";
import Script from "next/script";
import { telegramHelper } from "helper/telegram";
import dynamic from "next/dynamic";
import VConsoleScript from "components/debug/VconsoleScript";
import { useListenTelegramParam } from "hooks/useListenTelegramParam";
import useTelegramStore from "store/useTelegramStore";
import Audio from "components/base/Audio";
import { useThemeStore } from "store/useThemeStore";

const Layout = ({
  children,
  isTelegram,
}: React.PropsWithChildren & { isTelegram: boolean }) => {
  // const [showInstallModal, setShowInstallModal] = useState(false)
  // useIsomorphicLayoutEffect(() => {
  //     if (process.env.NODE_ENV === 'development') {
  //         return
  //     }
  //     // setShowInstallModal(!isInStandaloneMode())
  // }, [])
  // if (showInstallModal) {
  //     return <InstallApp />
  // }
  const router = useRouter();
  const { theme } = useThemeStore();
  const { isTelegram: isTelegramState } = useTelegramStore();
  // useListenTelegramParam();
  const [showAudio, setShowAudio] = React.useState<boolean>(true);
  const changeAudio = (val: boolean) => {
    setShowAudio(val);
  };
  React.useEffect(() => {
    telegramHelper.registerRouter(router);
  }, []);
  React.useEffect(() => {
    if (router.pathname != "/") {
      setShowAudio(false);
    } else {
      setShowAudio(true);
    }
  }, [router.pathname]);
  React.useEffect(() => {
    if (!isTelegramState) return;
    telegramHelper.setHeaderColor(theme === "dark" ? "#0A0A0A" : "#FFFFFF");
  }, [theme, isTelegramState]);

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id='${getGId()}'`}
      ></Script>
      <Script
        id="google-tag-old"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${getGId()}');
            `,
        }}
      ></Script>
      <Script
        defer
        id="sensors-1"
        dangerouslySetInnerHTML={{
          __html: `
                (function(para) {
                  if(typeof(window['sensorsDataAnalytic201505']) !== 'undefined') {
                    return false;
                  }
                  window['sensorsDataAnalytic201505'] = para.name;
                  window[para.name] = {
                    para: para
                  };
                })({
                    name: 'sensors',
                    server_url: "${getTrackUrl()}" + "/track",
                    is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
                    use_client_time: true,
                    send_type: "ajax",
                    show_log:false,
                    heatmap: {
                        //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
                        clickmap: "default",
                        //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
                        scroll_notice_map: "default",
                    },
                });
            `,
        }}
      />
      <Script
        defer
        id="sensors-2"
        src="/js/sensorsdata.js"
        onLoad={initTrack}
      ></Script>
      {isTelegram && (
        <Script
          src={telegramHelper.dns}
          onLoad={telegramHelper.launch}
          onError={telegramHelper.tmaReject}
        ></Script>
      )}

      {/* {process.env.NODE_ENV !== "development" &&
        process.env.NEXT_PUBLIC_ENV !== "production" && <VConsoleScript />} */}
      <VConsoleScript />
      {router.pathname === "/" ? (
        <div className="bg-background-primary-White-900">{children}</div>
      ) : (
        <FixSafariVHDIV className={`bg-background-primary-White-900 h-screen`}>
          {children}
        </FixSafariVHDIV>
      )}
      <Audio />
      {/* {isBrowser && location.host === "m.sosovalue.xyz" && <UpdateDominModal />} */}
    </>
  );
};

export const renderGridItem = (node: React.ReactNode) => (
  <div className="area col-span-1 overflow-y-auto">{node}</div>
);

export default Layout;
