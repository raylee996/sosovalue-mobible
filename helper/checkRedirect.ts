import { getPcWebsite } from "./config";
import { isBrowser, parseUA } from "./tools";

const RESEARCH = "/news";
const HOT = "/cluster";
const COINS = "/coins";
const PAIRS_CEX = "/pairs/cex";
const ETF = "?category=ETF";
const ACTIVITY = "/scholarship-s1-community-vote";

export const createRedirectPath = (pathname: string, search: string) => {
  if (pathname.startsWith(RESEARCH) && pathname !== RESEARCH) {
    return pathname.replace(RESEARCH, "/research") + search;
  } else if (pathname.startsWith(HOT) && pathname !== HOT) {
    return pathname.replace(HOT, "/hot") + search;
  } else if (
    pathname.startsWith(PAIRS_CEX) ||
    pathname.startsWith(COINS) ||
    pathname === ACTIVITY
  ) {
    return pathname + search;
  } else if (search === ETF) {
    return "/assets/etf";
  }
  return search;
};

export const checkRedirect = () => {
  if (isBrowser) {
    if (!parseUA().isMobile) {
      const href = `${getPcWebsite()}${createRedirectPath(
        window.location.pathname.replace(/^\/zh|\/tc|\/ja\b/, ""),
        window.location.search
      )}`;
      window.location.href = href;
    }
  }
};
