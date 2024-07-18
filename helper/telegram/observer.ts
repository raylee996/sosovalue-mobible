import { Language } from "store/ThemeStore";

/**
 * 监听的事件名
 * 
 */
export enum TelegramHelperEventName {
    "TMA_IS_READY" = "TMA_IS_READY",
    /** 当用户进入机器人时，获取Telegram的用户的语言时触发 */
    "SET_USER_LOCALE_TO_PWA" = "SET_USER_LOCALE_TO_PWA",
};
type Listener<T = any> = (data: T) => void;

/**
 * 负责telegram与pwa之间的通信
 */
class TelegramObserver {
    private subscribeEvents = {} as Record<TelegramHelperEventName, Listener>;
    constructor(private isReady = false) {
        this.isReady = isReady;
    }

    /** TMA加载完成 */
    subscribe(eventName: TelegramHelperEventName.TMA_IS_READY, listener: Listener<boolean>): void;
    /** 获取业务层的多语言，用于改变TMA内的对应的多语言设置 */
    subscribe(eventName: TelegramHelperEventName.SET_USER_LOCALE_TO_PWA, listener: Listener<Language>): void;
    subscribe(eventName: TelegramHelperEventName, listener: Listener) {
        if (!this.isReady) return console.warn("telegram sdk还未加载");
        console.log('subscribe' , eventName, "事件触发");
        this.subscribeEvents[eventName] = listener;
    }
    emit<K extends TelegramHelperEventName, P extends Parameters<Listener>>(eventName: K, ...args: P) {
        if (!this.isReady) return console.warn("telegram sdk还未加载");
        console.log('subscribe' , eventName, "事件触发");
        const _fn = this.subscribeEvents[eventName];
        if (typeof _fn === "function") {
            _fn.apply(this, args);
        }
    }
}

export { TelegramObserver }