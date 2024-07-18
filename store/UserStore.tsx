import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentUser,
  getUserBookmarkList,
  thirdPartyLogin,
  getUserTask,
  thirdPartyRegister,
  getRedirectUrl,
  bindWallet,
  bindThirdParty,
  updateLoginStatus,
  getUserLog,
  addShareCount,
  getLanguageByIp,
  phonePasswordLogin,
  emailPasswordLoginV2,
} from "http/user";
import {
  useAccount,
  useDisconnect,
  useConnect,
  useSignMessage,
  useAccountEffect,
} from "wagmi";
import {
  setAddress,
  getAddress,
  removeAddress,
  TwitterAuthInfoStorageKey,
  getTwitterAuthInfo,
  removeTwitterAuthInfo,
  setTwitterAuthInfo,
  setUserData,
  setIsAllowNotify,
  getLang,
  setRememberMeCache,
  setToken,
  removeToken,
  getToken,
} from "helper/storage";
import { useRouter } from "next/router";
import useNotistack from "hooks/useNotistack";
import { analytics } from "http/analytics";
import {
  useAsyncEffect,
  useGetState,
  useIsomorphicLayoutEffect,
  useUpdateEffect,
} from "ahooks";
import Auth from "components/operation/auth";
import { useGoogleLogin } from "@react-oauth/google";
import HelperModal from "components/operation/user/HelperModal";
import NewVersionModal from "components/operation/user/NewVersionModal";
import { useUserModal } from "hooks/operation/useUserModal";
import OneClickLogin from "components/operation/auth/OneClickLogin";
import { useAuthModal } from "hooks/operation/useAuthModal";
import { IsAllowRegister } from "hooks/operation/useAuthModal";
import { useVerifyCode } from "hooks/operation/useVerifyCode";
import useAnalyze from "hooks/operation/useAnalyze";
import InstallApp from "components/operation/InstallApp";
import { createBrowserQuery, isInStandaloneMode, parseUA } from "helper/tools";
import Backdrop from "@mui/material/Backdrop";
import { Language, ThemeContext } from "./ThemeStore";
import { trackLogin, trackLogout } from "helper/track";
import OneSignal from "react-onesignal";
import NotifyPermission from "components/operation/user/NotifyPermission";
import { INVITE_CODE_KEY, NEED_LOGIN } from "helper/constants";
import useUserStore from "./useUserStore";
import { setSentryUser } from "helper/sentry";
import { v4 as uuidv4 } from "uuid";
import WalletWait from "components/operation/auth/WalletWait";
import { useOneSignalInit } from "./useOneSignalStore";
import useTelegramStore from "./useTelegramStore";
import { useTelegramAccountBind } from "hooks/operation/useTelegramAccountBind";
import { useTwitterV2Login } from "hooks/operation/useTwitterV2Login";
import {
  TelegramBindParams,
  useTelegramLoginResponse,
} from "hooks/operation/useTelegramLoginResponse";
import { getTelegramBotInfo } from "http/telegram";
import useAppleAuth from "./useAppleAuth";
import { useTranslation } from "next-i18next";

type UContext = {
  user?: API.CurrentUser | null;
  isAllowRegister: boolean;
  userModal: ReturnType<typeof useUserModal> | null;
  authModal: ReturnType<typeof useAuthModal> | null;
  verifyCode: ReturnType<typeof useVerifyCode> | null;
  googleLogin: () => void;
  twitterLoginRedirect: () => void;
  appleLogin: () => void;
  signWalletMessage: () => void;
  taskData?: { sumGiftNum: number; taskListVOList: API.GiftTask[] };
  collectList: API.Bookmark[];
  getUserInfo: () => Promise<API.CurrentUser>;
  loginSeccess: (token: string) => Promise<void>;
  getUserAndCheckModal: () => Promise<API.CurrentUser>;
  getUserCollectList: () => Promise<API.Bookmark[]>;
  logout: Function;
  emailLogin: (params: API.UserLogin) => void;
  phoneLogin: (params: API.UserPhonePwdLogin) => void;
  thirdRegister: (username: string) => void;
  setUserTask: Function;
  /** @default false */
  rememberMe: boolean;
  toggleRememberMe: (checked: boolean) => void;
  thirdPartyLoginOrBind: (params: ThirdPartyLoginOrBindParams) => void;
  geoData: User.IPData | null;
};

const noop = () => { };

type ThirdPartyRegisterParams = {
  thirdpartyName: API.ThirdpartyName;
  token: string;
};

export interface ThirdPartyLoginOrBindParams
  extends Partial<TelegramBindParams> {
  thirdpartyName: API.ThirdpartyName;
  thirdToken?: string;
  code?: string;
  thirdVerifier?: string;
  redirectUri?: string;
}

export const UserContext = React.createContext<UContext>({
  isAllowRegister: false,
  userModal: null,
  authModal: null,
  verifyCode: null,
  googleLogin: noop,
  twitterLoginRedirect: noop,
  appleLogin: noop,
  signWalletMessage: noop,

  collectList: [],
  getUserInfo: noop as any,
  getUserAndCheckModal: noop as any,
  getUserCollectList: async () => [] as API.Bookmark[],
  logout: noop,
  emailLogin: noop,
  phoneLogin: noop,
  thirdRegister: noop,
  setUserTask: noop,
  loginSeccess: noop as any,
  rememberMe: false,
  toggleRememberMe: noop,
  thirdPartyLoginOrBind: noop,
  geoData: null,
});

const NEW_USER_TMP_NAME = "NEW_USER_NAME_01";

export const message = `
      Welcome to sosovalue!

      Click to sign in and accept the sosovalue Terms of Service (https://alpha.sosovalue.xyz/blog/terms-of-service) and Privacy Policy (https://alpha.sosovalue.xyz/blog/privacy-policy).

      This request will not trigger a blockchain transaction or cost any gas fees.


      Nonce:
      ${uuidv4()}`;

const UserStore = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const { success, error } = useNotistack();
  const { getBookmarks, getCollectCoins } = useUserStore();

  const [user, setUser, getUser] = useGetState<User.UserInfo | null>(null);
  const userModal = useUserModal();
  const authModal = useAuthModal();
  const verifyCode = useVerifyCode();
  useAnalyze();
  useOneSignalInit(user);
  const [thirdRegisterParams, setThirdRegisterParams] = React.useState<any>();
  const [isAllowRegister, setIsAllowRegister] = React.useState(IsAllowRegister);
  const [isUserInfoLoading, setIsUserInfoLoading] = React.useState(true);
  const { changeLang } = useContext(ThemeContext);
  const { t } = useTranslation("common");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [geoData, setGeoData] = React.useState<User.IPData | null>(null);
  const userTmpRef = useRef<User.UserInfo | null>(null);

  // const [isSkipSign, setIsSkipSign] = useState(false);
  const {
    data,
    isError,
    isSuccess: isSignSuccess,
    signMessage,
  } = useSignMessage({
    mutation: {
      onError() {
        logout();
      },
    },
  });
  const signWalletMessage = () => {
    signMessage(
      { message },
      {
        onSuccess() {
          setAddress(address as string);
        },
      }
    );
  };
  const {
    address,
    isConnecting,
    isDisconnected,
    isConnected,
    connector: activeConnector,
  } = useAccount();

  useAccountEffect({
    async onConnect({ address, connector, isReconnected }) {
      setAddress(address as string);
      // if (address === getAddress()) {
      //   // setIsSkipSign(true);
      //   setAddress(address as string);
      //   return;
      // }
      // signWalletMessage();
    },
    onDisconnect() {
      removeAddress();
    },
  });
  const { disconnect } = useDisconnect();
  const { isTelegram, setTelegramBotInfo } = useTelegramStore();

  const registerDevice = isTelegram ? "telegram" : undefined;
  useTelegramAccountBind({
    onSuccess: (res) => {
      if (res.code === 0) {
        loginSeccess(res.data.token);
        getUserInfo();
      } else if (res.code == 40014) {
        authModal.openEnterUsername();
      }
    },
  });
  const { appleSignIn } = useAppleAuth({
    onSuccess: async (res) => {
      thirdPartyLoginOrBind({
        code: res.code,
        thirdpartyName: "apple",
        thirdToken: res.id_token,
      });
    },
  });
  const [collectList, setCollectList] = React.useState<API.Bookmark[]>([]);
  const [taskData, setTaskData] = React.useState<{
    sumGiftNum: number;
    taskListVOList: API.GiftTask[];
  }>();
  const loginSeccess = async (
    token: string,
    callback?: (user: API.CurrentUser) => void
  ) => {
    setToken(token);
    const user = await getUserInfo();
    if (user) {
      authModal.closeModal();
      typeof callback === "function" && callback(user);
      trackLogin(user);
      setTimeout(() => {
        isTelegram && router.push("/exp");
      }, 100);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      thirdPartyLoginOrBind({
        code: tokenResponse.access_token,
        redirectUri: router.pathname,
        thirdpartyName: "google",
      });
    },
  });
  const twitterLoginRedirect = () => {
    window.open(
      `/api/twitter-sign?redirectUri=${location.origin}`,
      "_blank",
      "popup"
    );
  };
  const appleLogin = () => {
    appleSignIn();
  };
  /**
   * 需要登录或者绑定场景下的通用第三方登录/绑定方法
   * - 谷歌
   * - 推特
   * - 苹果
   * - telegram
   */
  const thirdPartyLoginOrBind = async ({
    thirdToken,
    thirdpartyName,
    code,
    thirdVerifier,
    redirectUri,
    ...telegramParams
  }: ThirdPartyLoginOrBindParams) => {
    const thirdpartyParams = {
      oauthToken: thirdToken,
      oauthVerifier: thirdVerifier,
      code,
      thirdpartyName,
      redirectUri,
      ...telegramParams,
    };
    if (userTmpRef.current) {
      bindThirdParty(thirdpartyParams)
        .then(() => {
          getUserInfo();
          authModal.closeModal();
          userModal.oneClickLogin.close();
          success(t("success"));
        })
        .catch((err) => {
          err?.msg && error(err.msg);
        });
    } else {
      let res = await thirdPartyLogin(thirdpartyParams);
      if (res.code === 40014) {
        // 直接注册，不需要打开输入用户名的弹窗
        thirdRegister(NEW_USER_TMP_NAME, { thirdpartyName, token: res.msg });
      } else if (res.code === 0) {
        setToken(res.data.token);
        getUserAndCheckModal();
        authModal.closeModal();
      } else {
        error(res.msg || "");
      }
    }
  };
  const twitterLogin = async ({
    oauth_token,
    oauth_verifier,
  }: {
    oauth_token: string;
    oauth_verifier: string;
  }) => {
    thirdPartyLoginOrBind({
      thirdToken: oauth_token,
      thirdpartyName: "twitter",
      thirdVerifier: oauth_verifier,
    });
  };
  const emailLogin = async (params: API.UserLogin) => {
    const res = await emailPasswordLoginV2(params);
    loginSeccess(res.data.token);
  };
  const phoneLogin = async (params: API.UserPhonePwdLogin) => {
    const res = await phonePasswordLogin(params);
    setToken(res.data.token);
    getUserAndCheckModal();
    authModal.closeModal();
  };
  useTwitterV2Login({
    onSuccess: async (params) => {
      let res = await thirdPartyLogin({
        code: params.code,
        redirectUri: `${location.origin}`,
        thirdpartyName: "twitter_v2",
        registerDevice,
      });
      if (res.code === 40014) {
        authModal.openEnterUsername();
        setThirdRegisterParams({
          thirdpartyName: "twitter_v2",
          token: res.msg,
        });
      } else if (res.code === 0) {
        loginSeccess(res.data.token);
      }
    },
  });
  const setUserTask = () => {
    getUserTask().then((res) => {
      setTaskData(res.data);
    });
  };
  const thirdRegister = async (
    username: string,
    registerParams: ThirdPartyRegisterParams
  ) => {
    const res = await thirdPartyRegister({
      ...(registerParams || thirdRegisterParams),
      username,
    });
    await loginSeccess(res.data.token);
  };
  const getUserAndCheckModal = () => {
    return getUserInfo()?.then((user) => user && trackLogin(user));
  };
  const getUserInfo = () => {
    if (!getToken()) {
      setIsUserInfoLoading(false);
      return;
    }
    return getCurrentUser().then(({ data, code }) => {
      setIsUserInfoLoading(false);
      if (code === 0 && data) {
        let google: API.ThirdInfo | null = null;
        let wallet: API.ThirdInfo | null = null;
        let twitter: API.ThirdInfo | null = null;
        let telegram: API.ThirdInfo | null = null;
        let apple: API.ThirdInfo | null = null;
        data?.userThirdRelationVOS?.forEach((item) => {
          if (item.thirdpartyName === "google") {
            google = item;
          } else if (item.thirdpartyName === "rainbowkit") {
            wallet = item;
          } else if (item.thirdpartyName === "twitter") {
            twitter = item;
          } else if (item.thirdpartyName === "telegram") {
            telegram = item;
          } else if (item.thirdpartyName === "apple") {
            apple = item;
          }
        });
        data.thirdInfo = { google, twitter, wallet, telegram, apple };
        setUser(data);
        setUserTask();
        setUserData(JSON.stringify(data));
        userTmpRef.current = data;
        if (data.isFirstLogin !== 0) {
          changeLang(data.language);
        }
        return data;
      } else {
        logout();
      }
    });
  };

  const logout = () => {
    setUser(null);
    userTmpRef.current = null;
    setCollectList([]);
    userModal.reset();
    removeToken();
    removeTwitterAuthInfo();
    removeAddress();
    disconnect();
    trackLogout();
    router.replace("/");
  };
  const getUserCollectList = async () => {
    const res = await getUserBookmarkList({
      bookmarkType: "symbol",
      pageNum: 1,
      pageSize: 500,
    });
    setCollectList(res.data.list || []);
    return res.data.list || [];
  };
  const toggleRememberMe = (checked: boolean) => {
    setRememberMeCache(checked);
    setRememberMe(checked);
  };
  const value = React.useMemo(
    () => ({
      user,
      getUser,
      isAllowRegister,
      userModal,
      authModal,
      verifyCode,
      googleLogin,
      twitterLoginRedirect,
      getUserAndCheckModal,
      appleLogin,
      signWalletMessage,
      taskData,
      collectList,
      getUserInfo,
      loginSeccess,
      setUserTask,
      getUserCollectList,
      logout,
      emailLogin,
      phoneLogin,
      //walletLogin,
      thirdRegister,
      rememberMe,
      toggleRememberMe,
      thirdPartyLoginOrBind,
      geoData,
    }),
    [
      user,
      collectList,
      taskData,
      isConnected,
      userModal,
      authModal,
      verifyCode,
      logout,
      rememberMe,
      geoData,
    ]
  );

  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      const user = getUser();
      if (user) {
        const res = await getUserLog({
          pageNum: 1,
          pageSize: 1,
          path: url,
          userId: user.id,
        });
        if (!res.data.list?.length) {
          userModal.tooltipGuide.open(url);
        }
        analytics(
          { path: url, source: "web", appNum: 2 },
          { headers: { "user-id": user.id } }
        );
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);
  useEffect(() => {
    if (!isUserInfoLoading) {
      if (!user && !getLang()) {
        getLanguageByIp().then((res) => {
          changeLang(res.data.language as Language);
        });
      }
    }
  }, [isUserInfoLoading, user]);
  useEffect(() => {
    if (!user) {
      analytics({ path: router.pathname, source: "web", appNum: 2 });
    }
  }, [router.pathname, user, isUserInfoLoading]);
  useUpdateEffect(() => {
    if (user?.isFirstLogin === 0 || user?.isVersionLogin === 0) {
      updateLoginStatus();
    }
    if (user?.id) {
      getCollectCoins();
      setSentryUser(user);
    } else {
      setSentryUser(null);
    }
  }, [user?.id]);
  useEffect(() => {
    if (user) {
      getBookmarks();
    }
  }, [user, router.locale])
  useAsyncEffect(async () => {
    if (!isUserInfoLoading && (address || isSignSuccess)) {
      if (user) {
        if (!user.thirdInfo?.wallet) {
          try {
            const res = await bindWallet({
              thirdpartyName: "rainbowkit",
              thirdpartyId: address!,
              ...(isSignSuccess ? { message, signatureHex: data } : {}),
            });
            if (res?.success) {
              getUserInfo();
              authModal.closeModal();
              if (userModal.oneClickLogin.show) {
                userModal.oneClickLogin.close();
              }
              success("success");
            }
          } catch (err: any) {
            disconnect();
            err?.msg && error(err.msg);
          }
        }
      } else {
        const res = await thirdPartyLogin({
          thirdpartyId: address,
          thirdpartyName: "rainbowkit",
          registerDevice,
          ...(isSignSuccess ? { message, signatureHex: data } : {}),
        });
        if (res.code == 0) {
          loginSeccess(res.data.token);
        } else if (res.code == 40014) {
          // TODO: 直接注册，不需要打开输入用户名的弹窗
          authModal.openEnterUsername();
          setThirdRegisterParams({
            thirdpartyName: "rainbowkit",
            token: res.msg,
          });
        }
      }
    }
  }, [isUserInfoLoading, address, isSignSuccess]);
  // React.useEffect(() => {
  //     const { token, email, type } = router.query
  //     const isLinkSignUp = token && email && type
  //     if (!user) {
  //         if (isLinkSignUp) {
  //             authModal.openLinkSignUp()
  //         } else if (!isUserInfoLoading) {
  //             authModal.openLoginModal()
  //         }
  //     }
  // }, [isUserInfoLoading, user, isAllowRegister, router.query.token])
  useIsomorphicLayoutEffect(() => {
    if (router.query.oauth_token) {
      setTwitterAuthInfo({
        oauth_token: router.query.oauth_token as string,
        oauth_verifier: router.query.oauth_verifier as string,
        timestamp: Date.now(),
      });
      window.close();
    }
  }, [router.query.oauth_token]);
  // 从 telegram 打开，会带 from_telegram 参数，任意值。打开登录页面
  useIsomorphicLayoutEffect(() => {
    if (router.query.from_telegram) {
      authModal.openLoginModal();
    }
  }, [router.query.from_telegram]);
  // 监听telegram登录成功并执行了第三方登录操作成功后的回调
  useTelegramLoginResponse((telegramBindParams) => {
    thirdPartyLoginOrBind(telegramBindParams);
    // if (res.code === 0) {
    //   loginSeccess(res.data.token);
    // } else if (res.code == 40014) {
    //   setThirdRegisterParams({ thirdpartyName: "telegram", token: res.msg });
    //   // TODO: 直接注册，不需要打开输入用户名的弹窗
    //   authModal.openEnterUsername();
    // }
  });
  useEffect(() => {
    if (!isUserInfoLoading && !user) {
      const { inviteCode, needLogin } = createBrowserQuery<{
        [INVITE_CODE_KEY]?: string;
        [NEED_LOGIN]?: string;
      }>();
      if (inviteCode && needLogin) {
        authModal.openSignupModal();
      } else {
        userModal.installPwa.onceOpen();
      }
    }
  }, [isUserInfoLoading, user]);
  useEffect(() => {
    getTelegramBotInfo("2").then((res) => {
      res.data && setTelegramBotInfo(res.data);
    });
    getLanguageByIp().then((res) => {
      setGeoData(res.data);
    });
  }, []);
  React.useEffect(() => {
    getUserInfo();
    const { inviteCode } = createBrowserQuery<{ [INVITE_CODE_KEY]: string }>();
    if (inviteCode) {
      addShareCount({ invitationCode: inviteCode });
    }
    const storageHandle = (e: StorageEvent) => {
      if (e.key === TwitterAuthInfoStorageKey) {
        twitterLogin(getTwitterAuthInfo()!);
      }
    };
    window.addEventListener("storage", storageHandle);
    return () => {
      window.removeEventListener("storage", storageHandle);
    };
  }, []);
  return (
    <UserContext.Provider value={value as any}>
      <div>
        {children}
        {/* <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isUserInfoLoading}
        >
          <ScaleLoader />
        </Backdrop> */}
        <Auth />
        {userModal.oneClickLogin.show && (
          <OneClickLogin onClose={() => userModal.oneClickLogin.close()} />
        )}
        {isConnecting && router.pathname !== "/brain-battle" && <WalletWait isConnecting={isConnecting} />}
        {userModal.installPwa.show && !isTelegram && <InstallApp />}
        <NotifyPermission />
      </div>
    </UserContext.Provider>
  );
};

export default UserStore;
