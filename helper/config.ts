import developConfig from "config/develop";
import testConfig from "config/test";
import newProductionConfig from "config/production";

const NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV as
  | "development"
  | "test"
  | "production";

export const TELEGRAM_SHARE_URL = "https://t.me/share/url";
/**
 * 生成telegram分享链接
 * @example
 * - getTelegramShareUrl('https://sosovalue.xyz') =>
 *  'https://t.me/share/url?url=https://sosovalue.xyz'
 *
 * - getTelegramShareUrl('https://sosovalue.xyz', 'SoSoValue') =>
 *  'https://t.me/share/url?url=https://sosovalue.xyz&text=SoSo%20Value'
 */
export const getTelegramShareUrl = (url: string, text?: string) => {
  const searchParams = new URLSearchParams({ url });
  typeof text === "string" && searchParams.set("text", text);
  const searchStr = searchParams.toString().replace(/\+/g, "%20");

  return `${TELEGRAM_SHARE_URL}?${searchStr}`;
};

const getConfig = () => {
  const config = {
    development: developConfig,
    test: testConfig,
    production: newProductionConfig,
  };
  return config[NEXT_PUBLIC_ENV] || developConfig;
};

const config = getConfig();
export const getUrl = () => config.SERVER_API;
export const getTrackUrl = () => config.TRACK_URL;
export const getLink = () => config.LINK_URL;
export const getInviteLink = <T = Record<string, string>>(inviteQuery: T) => {
  const queryStr = inviteQuery
    ? `?${new URLSearchParams(inviteQuery).toString()}`
    : "";
  const fullInviteUrl = config.INVITE_URL + queryStr;

  return fullInviteUrl;
};
export const getWs = () => config.SOCKET_SPI;
//export const getUrl = () => isBrowser ? config.CLIENT_API : config.SERVER_API
export const getUploadURL = () => config.UPLOAD;

export const getOneSignalId = () => config.ONESIGNAL_ID;

export const getGId = () => config.G_ID;

export const getOrigin = () => config.ORIGIN;

export const getPcWebsite = () => config.PC_WEBSITE;

export const { SENTRY_ENABLE, ENV, SENTRY_DSN } = config;

export const SENTRY_ENV = `${ENV}-MOBILE`;

/**
 * Twitter Client ID
 * @see https://developer.x.com/en/portal/projects/1623870146145296384/apps/27631728/keys
 */
export const TWITTER_OAUTH_CLIENT_ID = "NFNUMjJ3RXI0ZVY5c1kwVUw0dVo6MTpjaQ";

export const APPLE_AUTH_OPTION = config.APPLE_AUTH_OPTION;
