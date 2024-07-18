import React, { PropsWithChildren } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import defaultTheme, { getDesignTokens } from "helper/theme";
import { useIsomorphicLayoutEffect } from "ahooks";
import router from "next/router";
import { switchLanguage } from "http/user";
import { getToken, setLang as setStorageLang } from "helper/storage";
import { useThemeStore } from "./useThemeStore";

export enum Language {
  EN = "en",
  ZH = "zh",
  TC = "tc",
  JA = "ja",
}
export enum localeType {
  COMMON = "common",
  RESEARCH = "research",
  HOME = "home",
  CENTER = "center",
}

type ThemeContext = {
  lang: Language;
  changeLang: Function;
  selectContent: Function;
  selectContentOhter: Function;
  setLanguage: Function;
};
const noop = () => {};

export const ThemeContext = React.createContext<ThemeContext>({
  lang: Language.EN,
  changeLang: noop,
  selectContent: noop,
  selectContentOhter: noop,
  setLanguage: noop,
});

const ThemeSwitchProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const theme = useThemeStore(state => state.theme);
  const [muiTheme, setMuiTheme] = React.useState(defaultTheme);
  const [lang, setLang] = React.useState(Language.EN);
  const setLanguage = (newLocale: Language) => {
    if (router.locale === newLocale) {
      return;
    }
    getToken() && switchLanguage(newLocale || Language.EN);
    setLang(newLocale);
    const { pathname, asPath, query } = router;
    router.replace({ pathname, query }, asPath, { locale: newLocale });
  };
  const changeLang = (newlang: Language) => {
    setStorageLang(newlang);
    setLanguage(newlang);
  };
  // originalLanguage  原始内容语言 1为英语 2为中文
  // transferStatus  是否被翻译  1翻译
  const selectContent = (
    data: any,
    key: "title" | "content" | "originalContent",
    hot?: string
  ) => {
    if (!data) {
      return "";
    }
    return data[key];
  };
  const selectContentOhter = (
    data: any,
    key: "title" | "content" | "originalContent",
    hot?: string
  ) => {
    if (!data) {
      return "";
    }
    return data[key];
  };
  const ThemeMode = React.useMemo(
    () => ({
      changeLang,
      setLanguage,
      selectContent,
      selectContentOhter,
      lang,
    }),
    [lang]
  );
  useIsomorphicLayoutEffect(() => {
    const rootElement = document.getElementById("root");
    // All `Portal`-related components need to have the the main app wrapper element as a container
    // so that the are in the subtree under the element used in the `important` option of the Tailwind's config.
    setMuiTheme(
      createTheme({
        ...getDesignTokens(theme),
        components: {
          MuiPopover: {
            defaultProps: {
              container: rootElement,
            },
          },
          MuiPopper: {
            defaultProps: {
              container: rootElement,
            },
          },
          MuiDialog: {
            defaultProps: {
              container: rootElement,
            },
          },
          MuiDrawer: {
            defaultProps: {
              container: rootElement,
            },
          },
        },
      })
    );

    // ...meta...
    const doc = window?.document
    if (doc) {
      const themeColor = getComputedStyle(doc.documentElement).getPropertyValue('--background-primary-White-900').trim();
      const metaThemeColor = doc.querySelector('meta[name="theme-color"]');
      metaThemeColor?.setAttribute('content', themeColor);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={ThemeMode}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
export default ThemeSwitchProvider;
