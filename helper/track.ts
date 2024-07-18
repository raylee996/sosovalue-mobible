import { UAParser } from "ua-parser-js";
import { isBrowser, isInStandaloneMode, parseUA, withResolvers } from "./tools";
import { getLang } from "./storage";
function delFromPath(obj: any, paths: string[]) {
    if (Array.isArray(paths)) {
        new Function(
            "o",
            paths
                .map((p) =>
                    typeof p === "string"
                        ? `try{ delete o.${p};}catch(e){console.log(e)}`
                        : ""
                )
                .join(" ")
        )(obj);
    }
}
const propertyPlugin = {
    properties: function (data: any) {
        delFromPath(data, ["lib", "identities"]);
        data.properties &&
            (data.properties = {
                ...data.properties,
                $lib: undefined,
                $lib_version: undefined,
                $latest_traffic_source_type: undefined,
                $latest_search_keyword: undefined,
                $latest_referrer: undefined,
                $timezone_offset: undefined,
                // $screen_height: undefined,
                // $screen_width: undefined,
                // $viewport_height: undefined,
                // $viewport_width: undefined,
                // $is_first_day: undefined,
                // $is_first_time: undefined,
                $referrer_host: undefined,
                $referrer: undefined,
                $element_selector: undefined,
                $element_path: undefined,
                $element_class_name: undefined,
                $element_target_url: undefined,
                $url_path: undefined,
                // $element_type: undefined,
                // $element_content: undefined,
            });
    },
};
enum Mode {
    PC,
    PC_PWA,
    MOBILE,
    MOBILE_PWA,
    TMA,
}
const sensorsReady=Promise.resolve(true);
export const initTrack = () => {
    const parser = new UAParser();
    const isTelegram = parseUA().isTelegram;
    const network = function () {
        const connection = (window?.navigator as any)?.connection || {};
        // return (window?.navigator as any)?.onLine ? "online" : "offline";
        return {
            speed: (connection.downlink || 0) + "Mbps",
            effectiveType: connection.effectiveType || "unkown",
            rtt: connection.connection || 0,
            status: (window?.navigator as any)?.onLine ? "online" : "offline",
        };
    };
    (window?.sensors as any)?.registerPropertyPlugin(propertyPlugin);
    window.sensors.registerPage({
        $userMessage: () => ({
            userBrowser: parser.getBrowser().name,
            userDevice: parser.getResult().os?.name,
            mode: isTelegram
                ? Mode.TMA
                : isInStandaloneMode()
                  ? Mode.MOBILE_PWA
                  : Mode.MOBILE,
            modeMsg: isTelegram
                ? "TMA"
                : isInStandaloneMode()
                  ? "MOBILE_PWA"
                  : "MOBILE",
        }),
        $network: network,
        $lang: getLang(),
        $theme: () => {
            let theme = "dark";
            let local = localStorage.getItem("theme-storage");
            if (local) {
                try {
                    theme = JSON.parse(local).state.theme;
                } catch {}
            }
            return theme;
        },
    });
    window.sensors.quick("autoTrack");
};
export const trackChangeLanguage = ($lang: string) => {
    window.sensors.track("changeLanguage", { $lang });
};

export const trackLogin = (user: User.UserInfo) => {
    window.sensors.login(user.id);
};

export const trackLogout = () => {
    window.sensors.logout();
};

export const trackSlideAudioProgress = async () => {
    await sensorsReady;
    window.sensors.track("slideAudioProgress", {});
};
export const trackChangeMode = ($theme: string) => {
    window.sensors.track("user_config_light_dark_mode", { $theme });
};

export const trackConfigNotification = ($notice_status: 0 | 1) => {
    window.sensors.track("user_config_push_notification", { $notice_status });
};
export const trackFeedsTabSwitchCategory = (
    $tab_title: string,
    $tab_value: number
) => {
    window.sensors.track("feeds_tab_switch_category", {
        $tab_title,
        $tab_value,
    });
};
export const trackMarketTabSwitch = ($tab_title: string) => {
    window.sensors.track("market_tab_switch", { $tab_title });
};
export const trackCoinDetailView = async (
    $isStatus: boolean = false,
    $currency_id?: string,
    $symbol_id?: string
) => {
    await sensorsReady;
    window.sensors.track(
        $isStatus ? "coin_detail_view_start" : "coin_detail_view_end",
        {
            $currency_id,
            $symbol_id,
        }
    );
};
export const trackNewsStart = async ($news_id: string) => {
    await sensorsReady;
    window.sensors.track("news_view_start", { $news_id });
};
export const trackNewsEnd = async ($news_id: string) => {
    await sensorsReady;
    window.sensors.track("news_view_end", { $news_id });
};
type MarketSearchParams = {
    coin_type: string;
    order_by: string;
    search_keyword: string;
    sort_key: string;
};
export const trackCoinListFilter = ($params: MarketSearchParams) => {
    window.sensors.track("coin_list_filter", { $params });
};
export const trackGlobalSearch = (
    $search_keyword: string = "",
    $active_type = "All"
) => {
    window.sensors.track("global_search", { $search_keyword, $active_type });
};
export const trackFeedsFilter = (params: any) => {
    window.sensors.track(
        params?.lastSortValues?.length ||
            (params?.showNum &&
                params?.pageSize &&
                params?.showNum >= params?.pageSize)
            ? "feeds_load_more"
            : "feeds_filter",
        {
            $weight: params?.weight || "",
            $userType: params?.userType || "",
            $sourcePlatIdList: params?.sourcePlatIdList || [],
            $sector: params?.sector || "All",
            $search: params?.search || "",
            $pageSize: params?.pageSize,
            $keyword: params?.keyword || "",
            $isOfficial: params?.isOfficial || 0,
            $categoryList: params?.categoryList || [],
            $lastSortValues: params?.lastSortValues,
            $startTime: params?.startTime,
            $endTime: params?.endTime,
            $tab_value: params.tabValue,
            $show_num: params.showNum || 0,
            $sector_index: params?.sector_index || 0,
        }
    );
};
type CollectPageType = "Home" | "Index" | "Dex" | "Global" | "Detail";
export const trackCoinListClick = (
    $page_type: CollectPageType,
    $symbol_id: string,
    $list_index: string | number,
    $coin_id?: string
) => {
    window.sensors.track("coin_list_item_click", {
        $page_type,
        $symbol_id,
        $list_index,
        $coin_id,
    });
};
export const trackCollectCancel = (
    $symbol_id: string,
    $backpack_id: string
) => {
    window.sensors.track("coin_add_portfolio_cancel", {
        $symbol_id,
        $backpack_id,
    });
};
export const trackCollectAdd = (
    $page_type: CollectPageType,
    $symbol_id: string,
    $list_index: string | number,
    $backpack_id?: string
) => {
    window.sensors.track("coin_add_portfolio", {
        $page_type,
        $symbol_id,
        $list_index,
        $backpack_id,
    });
};
type CoinInfo = {
    currencyId?: string;
    symbolId?: string;
};
export const trackGlobalCoinClick = (
    $info: CoinInfo,
    $search_keyword: string,
    $active_type: string,
    $list_index: number
) => {
    window.sensors.track("global_search_coin_list_item_click", {
        $info,
        $search_keyword,
        $active_type,
        $list_index,
    });
};
export const trackGlobalFeedsClick = (
    $news_id: string,
    $search_keyword: string,
    $active_type: string,
    $list_index: number
) => {
    window.sensors.track("global_search_feeds_list_item_click", {
        $news_id,
        $search_keyword,
        $active_type,
        $list_index,
    });
};
export type ShareVia = "Twitter" | "Telegram" | "CopyLink" | "Poster";
export const trackNewsListShare = ($news_id = "", $share_via: ShareVia) => {
    window.sensors.track("feeds_list_item_share", { $news_id, $share_via });
};
export const trackNewsDetailShare = ($news_id = "", $share_via: ShareVia) => {
    window.sensors.track("feeds_detail_share", { $news_id, $share_via });
};
export const trackFeedTagClick = (
    $list_index: string | number,
    $feed_id: string,
    $tag_name: string
) => {
    window.sensors.track("feeds_coin_tag_click", {
        $feed_id,
        $list_index,
        $tag_name,
    });
};
export const trackFeedListClick = (
    $list_index: string | number,
    $feed_id: string,
    $category?: string,
    $is_official?: boolean,
    $mark?: string
) => {
    window.sensors.track("feeds_list_item_click", {
        $feed_id,
        $list_index,
        $category,
        $is_official: $is_official ? 1 : 0,
        $mark,
    });
};
// page_type CoinDetail ETF Market For You NewsDetail Hot ClusterDetail News
//Institution Insights Research Onchain
export const trackFeedsExpose = async (
    $page_type: string,
    $expose_list: { id: string; index: string; type?: string }[],
    $params_filters: string
) => {
    await sensorsReady;
    window.sensors.track("feeds_expose", {
        $page_type,
        $expose_list,
        $params_filters,
    });
};

export const trackbrainBattlePageView = (
    userInviteCode: string,
    invitationCode: string,
    eventPage: string
) => {
    window.sensors.track("brain_battle_page_view", {
        userInviteCode,
        invitationCode,
        eventPage,
    });
};

export const trackbrainBattleRegister = (
    userInviteCode: string,
    invitationCode: string
) => {
    window.sensors.track("brain_battle_register", {
        userInviteCode,
        invitationCode,
    });
};
