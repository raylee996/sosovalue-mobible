import { getPcWebsite } from "helper/config";
import { NextRequest, NextResponse, userAgent } from "next/server";

const Shutdown = "/shutdown.html";

const NotAvilable = "/not-avilable.html";

const TgPageSearchKeys = {
  news: "0",
  cluster: "1",
  hot: "2",
}

function addInvitationCodeToUrl(url: string, invitationCode: string) {
  return invitationCode ? `${url}?invitationCode=${invitationCode}` : url;
}

export function middleware(request: NextRequest) {
  const {
    nextUrl: { pathname, origin },
  } = request;  
  const country = request.headers
    .get("CloudFront-Viewer-Country")
    ?.toUpperCase();
  if (pathname === Shutdown) {
    return NextResponse.redirect(`${origin}`);
  }
  if ((pathname as string) === "/api/geo") {
    return NextResponse.json({ country });
  }
  if (country === "CN" && pathname !== Shutdown && pathname !== NotAvilable) {
    return NextResponse.redirect(`${origin}${NotAvilable}`);
  }

  // tg打开pwa页面场景
  const tgWebAppStartParam = request.nextUrl.searchParams.get('tgWebAppStartParam');
  if (tgWebAppStartParam) {
    const [ searchKey, value, locale = "en", invitationCode = "" ] = tgWebAppStartParam.split('-');
    // news - news 详情
    if (searchKey === TgPageSearchKeys.news) {
      return NextResponse.redirect(addInvitationCodeToUrl(`${origin}/${locale}/news/${value}`, invitationCode));
    }
    // cluster - hot news 详情
    if (searchKey === TgPageSearchKeys.cluster) {
      return NextResponse.redirect(addInvitationCodeToUrl(`${origin}/${locale}/cluster/${value}`, invitationCode));
    }
    // hot 新闻列表页面
    if (searchKey === TgPageSearchKeys.hot) {
      return NextResponse.redirect(addInvitationCodeToUrl(`${origin}/${locale}/hot`, invitationCode));
    }
  }
}
