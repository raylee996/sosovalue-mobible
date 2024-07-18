import React, { useEffect, useRef, useState } from "react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import NiceModal from "@ebay/nice-modal-react";
import { StyledEngineProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";

import createEmotionCache from "helper/createEmotionCache";
import UserStore from "store/UserStore";
import WSStore from "store/WSStore";
import TradingViewStore from "store/TradingViewStore";
import ThemeStore from "store/ThemeStore";
import WalletStore from "store/WalletStore";
import { SnackbarProvider } from "notistack";
import { DialogProvider } from "components/base/Dialog";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "next/head";

import useSelectionColorRandom from "hooks/useSelectionColorRandom";
//import removeTouchMove from 'hooks/removeMouve'
import Layout from "components/layout/Layout";
import "../styles/globals.css";
import "../styles/overrides.css";

// import "../styles/editor/index.css";
// // import "../styles/editor/editor.css";
// import "../styles/editor/ExcalidrawModal.css";
// import "../styles/editor/ImageNode.css";
// import "../styles/editor/InlineImageNode.css";
// import "../styles/editor/Button.css";
// import "../styles/editor/Collapsible.css";
// import "../styles/editor/ColorPicker.css";
// import "../styles/editor/CommentEditorTheme.css";
// import "../styles/editor/CommentPlugin.css";
// import "../styles/editor/ContentEditable.css";
// import "../styles/editor/Dialog.css";
// import "../styles/editor/EquationEditor.css";
// import "../styles/editor/FlashMessage.css";
// import "../styles/editor/fontSize.css";
// import "../styles/editor/PageBreakNode.css";
// import "../styles/editor/Input.css";
// import "../styles/editor/KatexEquationAlterer.css";
// import "../styles/editor/Modal.css";
// import "../styles/editor/Placeholder.css";
// import "../styles/editor/PlaygroundEditorTheme.css";
// import "../styles/editor/PollNode.css";
// import "../styles/editor/Select.css";
// import "../styles/editor/StickyEditorTheme.css";
// import "../styles/editor/StickyNode.css";
// import "../styles/editor/DraggableBlockPlugin.css";
// import "../styles/editor/TableOfContentsPlugin.css";
// import "../styles/editor/TableCellResizer.css";
// import "../styles/editor/CodeActionMenuPlugin.css";
// import "../styles/editor/PrettierButton.css";
// import "../styles/editor/FloatingLinkEditorPlugin.css";
// import "../styles/editor/FloatingTextFormatToolbarPlugin.css";

// import Push from "helper/push";
// require("helper/work");

import { Lato, IBM_Plex_Sans, Fjalla_One } from "next/font/google";
import localFont from "next/font/local";
import DirtyStore from "store/DirtyStore";
import {
  getTelegramStorage,
  setLang,
  setTelegramStorage,
} from "helper/storage";
import { useRouter } from "next/router";
import { createRedirectPath } from "helper/checkRedirect";
import { isBrowser, parseUA } from "helper/tools";
import { getPcWebsite } from "helper/config";
import { useFixGoogleTranslation } from "hooks/useFixGoogleTranslation";
import useTelegramStore from "store/useTelegramStore";
import { useIsomorphicLayoutEffect } from "ahooks";

const jetbrains = Lato({
  display: "swap",
  style: "normal",
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Lato({
  variable: "--font-inter",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const fjalla = Fjalla_One({
  variable: "--font-fjalla",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const ddin = localFont({
  src: "../public/font/D-DINCondensed-Bold.otf",
  variable: "--font-ddin",
  display: "swap",
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

let redirectFlag = true;

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const lang = router.locale;
  const { setIsTelegram } = useTelegramStore();
  // useEffect(() => {
  //   setLang(lang || "en");
  // }, [lang]);
  useEffect(() => {
    const telegramStorage = getTelegramStorage();
    if (telegramStorage?.isTelegram) {
      document.documentElement.style.fontSize = "14px";
      setIsTelegram(true);
    }
  }, []);
  useFixGoogleTranslation();
  router.asPath.includes("tgWebAppData") && parseUA.setIsTelegram(true);
  // if (isBrowser && redirectFlag) {
  //   parseUA().isTelegram && setTelegramStorage({ isTelegram: true });
  //   const telegramStorage = getTelegramStorage();
  //   // 如果在 telegram 内的情况下，不进行跳转判断
  //   if (!parseUA().isMobile && !telegramStorage?.isTelegram) {
  //     redirectFlag = false;
  //     const href = `${getPcWebsite()}${createRedirectPath(
  //       window.location.pathname.replace(/^\/zh|\/tc|\/ja\b/, ""),
  //       window.location.search
  //     )}`;
  //     setTimeout(() => (window.location.href = href), 100);
  //     return null;
  //   }
  // }
  return (
    <React.Fragment>
      <Head>
        <title>SoSoValue - See the Unseen, Predict Value</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <div
        className={`${jetbrains.variable} ${inter.variable} ${ddin.variable} ${fjalla.variable} !font-jetbrains h-full overflow-y-auto`}
        id="root"
      >
        <CacheProvider value={emotionCache}>
          <StyledEngineProvider>
            <ThemeStore>
              <SnackbarProvider
                maxSnack={3}
                autoHideDuration={2000}
                style={{ color: "red" }}
                classes={{ containerRoot: "z-[1503]" }}
              >
                <DialogProvider>
                  <GoogleOAuthProvider clientId="802112280767-q735hv2rib82s915eecan1k42s3mu89r.apps.googleusercontent.com">
                    <WalletStore>
                      <UserStore>
                        <WSStore>
                          <DirtyStore>
                            <NiceModal.Provider>
                              <Layout isTelegram={parseUA().isTelegram}>
                                <Component {...pageProps} />
                              </Layout>
                            </NiceModal.Provider>
                          </DirtyStore>
                        </WSStore>
                      </UserStore>
                    </WalletStore>
                  </GoogleOAuthProvider>
                </DialogProvider>
              </SnackbarProvider>
            </ThemeStore>
          </StyledEngineProvider>
        </CacheProvider>
      </div>
    </React.Fragment>
  );
};

export default appWithTranslation(App);
