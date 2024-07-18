import { TWITTER_AUTH_STATE } from "components/operation/auth/twitterAuthV2";
import { TWITTER_OAUTH_CLIENT_ID } from "./config";
import { isBrowser } from "./tools";

export enum Nature {
  CEX = "cex",
  DEX = "dex",
}

export const createCurrencyDetailLink = (
  config:
    | { fullName: string }
    | {
        nature: Nature;
        exchangeName: string;
        baseAsset: string;
        quoteAsset: string;
      }
) => {
  if ("fullName" in config) {
    return `/coins/${config.fullName?.toLowerCase()}`;
  } else if (config.nature === Nature.CEX) {
    return `/pairs/cex/${config.exchangeName}/${config.baseAsset}-${config.quoteAsset}`;
  } else {
    return "";
  }
};

/**
 * 创建推特 oauth2.0 登录链接
 * - code_challenge 固定以 SHA-256 算法生成的随机字符串
 */
export const createTwitterOauthV2Url = (codeChallenge: string) => {
  const authURL = "https://twitter.com/i/oauth2/authorize";

  const options = {
      redirect_uri: window.location.origin,
      client_id: TWITTER_OAUTH_CLIENT_ID,
      state: TWITTER_AUTH_STATE,
      response_type: "code",
      code_challenge: "challenge",
      code_challenge_method: "plain",
      scope: ["users.read", "tweet.read", "offline.access"].join(" "),
  };
  const qs = new URLSearchParams(options).toString();
  return `${authURL}?${qs}`;
};
