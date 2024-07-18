import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Dayjs } from "dayjs";

export enum LocaleFile {
  Common = "common",
  Center = "center",
  Home = "home",
  Macro = "macro",
  Portfolio = "portfolio",
  Indicators = "indicators",
  Research = "research",
  Exp = "exp",
}

enum Language {
  EN = "en",
  ZH = "zh",
  TC = "tc",
  JA = "ja",
}
const contentMap = {
  [Language.EN]: {
    title: "transferTitle" as const,
    content: "transferContent" as const,
    originalContent: "transferOriginalContent" as const,
  },
  [Language.ZH]: {
    title: "transferTitle" as const,
    content: "transferContent" as const,
    originalContent: "transferOriginalContent" as const,
  },
  [Language.TC]: {
    title: "transferTitle" as const,
    content: "transferContent" as const,
    originalContent: "transferOriginalContent" as const,
  },
  [Language.JA]: {
    title: "transferTitle" as const,
    content: "transferContent" as const,
    originalContent: "transferOriginalContent" as const,
  },
};

export const useTCommon = () => {
  return useTranslation(LocaleFile.Common);
};
export const useTCenter = () => {
  return useTranslation(LocaleFile.Center);
};
export const useTHome = () => {
  return useTranslation(LocaleFile.Home);
};
export const useTMacro = () => {
  return useTranslation(LocaleFile.Macro);
};
export const useTPortfolio = () => {
  return useTranslation(LocaleFile.Portfolio);
};
export const useTIndicators = () => {
  return useTranslation(LocaleFile.Indicators);
};
export const useTResearch = () => {
  return useTranslation(LocaleFile.Research);
};
export const useTExp = () => {
  return useTranslation(LocaleFile.Exp);
};

export const useTransitionPost = () => {
  const router = useRouter();
  return (
    data: Research.Post | undefined,
    key: "title" | "content" | "originalContent"
  ) => {
    if (!data) {
      return "";
    }
    // let content = data[key];
    const lang = router.locale as Language;
    // if (
    //   (lang != Language.EN &&
    //     data.transferStatus === 1 &&
    //     data.originalLanguage === 1) ||
    //   (data.originalLanguage === 2 &&
    //     data.transferStatus === 1 &&
    //     lang === Language.EN)
    // ) {
    //   content = data[contentMap[lang][key]] || data[key];
    // }

    return data[key] || data[contentMap[lang][key]];
  };
};

type FormatOption = {
  [Language.EN]?: string;
  [Language.ZH]?: string;
  [Language.TC]?: string;
  [Language.JA]?: string;
};

const defaultOption = {
  [Language.EN]: "MMM DD, YYYY",
  [Language.ZH]: "YYYY年MM月DD日",
  [Language.TC]: "YYYY年MM月DD日",
  [Language.JA]: "YYYY年MM月DD日",
};

export const useFormatTimeByLocale = () => {
  const router = useRouter();
  return (time: Dayjs, option?: FormatOption) => {
    return time.format(
      { ...defaultOption, ...option }[router.locale as Language]
    );
  };
};
