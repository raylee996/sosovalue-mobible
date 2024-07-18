enum DataType {
  NONE = "none",
  STRING = "string",
  OTHER = "other",
}

type Target = {
  type: DataType;
  value: string;
};

const createStorage = <T>(key: string) => ({
  get(): T | null {
    const str = localStorage.getItem(key);
    if (!str) {
      return null;
    }
    try {
      const target = JSON.parse(str) as Target;
      if (target.type === DataType.NONE) {
        return target.value as T;
      } else if (target.type === DataType.OTHER) {
        return JSON.parse(target.value);
      } else {
        return target.value as T;
      }
    } catch (error) {
      return str as T;
    }
  },
  set(value: T, ) {
    const target = {
      type: "",
      value: "",
    };
    if (value === null || value === undefined) {
      target.type = DataType.NONE;
      target.value = "";
    } else if (typeof value !== "string") {
      target.type = DataType.OTHER;
      target.value = JSON.stringify(value);
    } else {
      target.type = DataType.STRING;
      target.value = value;
    }
    return localStorage.setItem(key, JSON.stringify(target));
  },
  remove() {
    return localStorage.removeItem(key);
  },
});
export const { get: getThemeStorage, set: setThemeStorage } =
  createStorage<string>("theme");
export const { get: getTheme, set: setTheme } = createStorage("theme");

export const { get: getLang, set: setLang } = createStorage<string>("lang");

export const {
  get: getToken,
  set: setToken,
  remove: removeToken,
} = createStorage<string>("token");

export const {
  get: getAddress,
  set: setAddress,
  remove: removeAddress,
} = createStorage<string>("address");

export const {
  get: getFilter,
  set: setFilter,
  remove: removeFilter,
} = createStorage<string>("filter");

export const TwitterAuthInfoStorageKey = "twitter_auth_info";

export const {
  get: getTwitterAuthInfo,
  set: setTwitterAuthInfo,
  remove: removeTwitterAuthInfo,
} = createStorage<{
  oauth_token: string;
  oauth_verifier: string;
  timestamp: string | number;
}>(TwitterAuthInfoStorageKey);

export const {
  get: getUserData,
  set: setUserData,
  remove: removeUserData,
} = createStorage<string>("userData");

export const {
  get: getIsAllowNotify,
  set: setIsAllowNotify,
  remove: removeIsAllowNotify,
} = createStorage<boolean>("allowNotify");

type SearchHistory = {
  value: string;
  time: string;
}[];

export const {
  get: getSearchHistory,
  set: setSearchHistory,
  remove: removeSearchHistory,
} = createStorage<SearchHistory>("search_history");

type IsShowNotiBanner = {
  value: boolean;
  time: number;
};
export const {
  get: getIsShowNotiBanner,
  set: setIsShowNotiBanner,
  remove: removeIsShowNotiBanner,
} = createStorage<IsShowNotiBanner>("isShowNotificationBanner");

export const {
  get: getTelegramStorage,
  set: setTelegramStorage,
  remove: removeTelegramStorage,
} = createStorage<{ isTelegram: boolean }>("__telegram_soso_value__");

export const {
  get: getRememberMeCache,
  set: setRememberMeCache,
  remove: removeRememberMeCache,
} = createStorage<boolean>("LOGIN_REMEMBER_ME");

export const {
  get: getUserCollectedPairsCache,
  set: setUserCollectedPairsCache,
  remove: removeUserCollectedPairsCache,
} = createStorage<any>('FOR_PORTFOLIO_UX_PAIRS');
