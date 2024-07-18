import { NextRouter } from "next/router";
import { Language } from "store/ThemeStore";
import { TelegramHelperEventName, TelegramObserver } from "./observer";
import { deleteLocale, isBrowser } from "helper/tools";
import { TelegramUser } from "components/telegram/TelegramLoginButton";

type TelegramLanguageCode = "zh-hans" | "zh-hant" | "en";

export const LOCALE_TRANSFER: Record<TelegramLanguageCode, Language> = {
  en: Language.EN,
  "zh-hans": Language.ZH,
  "zh-hant": Language.TC,
};

/**
 * telegram客户端相关操作。所有操作都是异步的，应为需要确认 telegram js sdk 是否加载完成
 */
class TelegramHelper {
  private static _instance: TelegramHelper | null = null;
  static _getInstance() {
    if (!TelegramHelper._instance) {
      TelegramHelper._instance = new TelegramHelper();
    }
    return TelegramHelper._instance;
  }

  dns = "/telegram-web-app.js";

  private webApp!: Telegram["WebApp"];
  private _resolve: (value: unknown) => void = () => {};
  private _reject: (reason: unknown) => void = () => {};
  private router: NextRouter | null = null;
  private initPathname = "";
  observer?: TelegramObserver;

  /**
   * 所有telegram的客户端操作都需要等待这个函数执行完毕。不需要对外暴露
   *
   * @example
   * ```ts
   * this.ready().then(() => {...})
   * ```
   */
  private ready = async () => {
    return new Promise((resolve, reject) => {
      if (this.webApp) {
        resolve(true);
      }
      this._resolve = resolve;
      this._reject = reject;
    })
      .then(() => {
        !this.webApp && (this.webApp = window.Telegram.WebApp);
        !this.webApp && this._resolve(true);
      })
      .catch(() => {
        throw new Error("Telegram mini-app did not load");
      });
  };

  private initTelegramLocale = () => {
    this.ready().then(() => {
      const languageCode = this.webApp.initDataUnsafe.user
        ?.language_code as TelegramLanguageCode;
      this.observer?.emit(
        TelegramHelperEventName.SET_USER_LOCALE_TO_PWA,
        LOCALE_TRANSFER[languageCode || "en"]
      );
    });
  };

  /** 
   * 生成tg参数，放在 startapp 后面
   * @example 
   * ```ts
   * // 0-1807585987321290752-en-123456
   * telegramHelper.generateTgLink(0, "1807585987321290752", "en", "123456");
   * ```
   */
  generateTgLink(params: { searchKey: number; value?: string; locale?: string; invitationCode?: string;}) {
    const { searchKey, value = "none", locale = "en", invitationCode = "" } = params;
    return `${searchKey}-${value}-${locale}-${invitationCode}`;
  }

  /**
   * 获取telegram用户数据（进入机器人就可以获取）
   */
  getTelegramUserData = () => {
    return new Promise<TelegramUser | null>((resolve) => {
      this.ready().then(() => {
        resolve((this.webApp.initDataUnsafe.user as TelegramUser) || null);
      });
    });
  };

  /** 打开TMA */
  launch = () => {
    this.tmaResolve();
    setTimeout(() => {
      this.webApp.enableClosingConfirmation();
      this.webApp.expand();
      this.webApp.ready();
      this.initTelegramLocale();
      this.observer = new TelegramObserver(true);
    });
  };

  tmaResolve = () => this._resolve(true);
  tmaReject = () => this._reject("");
  registerRouter = (router: NextRouter) => {
    this.router = router;
    !this.initPathname && (this.initPathname = router.pathname);
    console.log("init path", this.initPathname);
  };

  /**
   * 打开浏览器，访问传入url
   * - pathname 格式，则 origin 为当前页面的origin，origin + pathname 为新页面的url
   * - 完整 url 格式，则直接访问url
   * @example
   * ```ts
   * - telegramHelper.openBrowser('/setting');
   * - telegramHelper.openBrowser('https://www.google.com/');
   * ```
   */
  openBrowser = async (url: string) => {
    if (!isBrowser) return;
    const origin = window.location.origin;
    const _url = url.startsWith("/") ? `${origin}${url}` : url;

    this.ready().then(() => {
      this.webApp.openLink(_url, { try_instant_view: true });
    });
  };

  send = async (message: string): Promise<void> => {
    this.ready().then(() => {
      this.webApp.sendData(message);
      console.log("send message ", message);
    });
  };

  openTelegramLink = async (url: string): Promise<void> => {
    this.ready().then(() => {
      this.webApp.openTelegramLink(url);
    });
  };

  setHeaderColor = async (color: string): Promise<void> => {
    this.ready().then(() => {
      this.webApp.setHeaderColor(color);
    });
  };

  expand = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.webApp.isExpanded) {
        resolve(true);
      } else {
        this.ready().then(() => {
          this.webApp.expand();
          resolve(true);
        });
      }
    })
  };
}

export const telegramHelper = TelegramHelper._getInstance();
