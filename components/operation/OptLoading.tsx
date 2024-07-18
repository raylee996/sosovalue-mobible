import { Dialog, Fade, Slide } from "@mui/material";
import ScaleLoader from "components/base/ScaleLoader";
import { useRouter } from "next/router";
import { ArrowClockwise } from "@phosphor-icons/react";
// import { useEffect, useState } from "react";
import { useNetwork } from "hooks/useNetwork";
import React from "react";
import { TransitionProps } from "react-transition-group/Transition";
import Image from "next/image";

export enum Language {
  EN = "en",
  ZH = "zh",
  TC = "tc",
  JA = "ja",
}

export const LangMap: Record<string, Record<string, string>> = {
  [Language.EN]: {
    Just: "Just a mommet...",
    Retry: "Retry",
    NetworkError: "Network error",
    NetworkDesc: "Please check your network settings or try again later.",
    ContentError: "Sorry, unable to find the content you requested.",
    ReturnToHomepage: "Return to homepage",
  },
  [Language.ZH]: {
    Just: "请稍候...",
    Retry: "重试",
    NetworkError: "网络异常",
    NetworkDesc: "请检查您的网络设置或稍后再试",
    ContentError: "抱歉，无法找到您请求的内容",
    ReturnToHomepage: "返回首页",
  },
  [Language.TC]: {
    Just: "请稍候...",
    Retry: "重试",
    NetworkError: "网络异常",
    NetworkDesc: "请检查您的网络设置或稍后再试",
    ContentError: "抱歉，无法找到您请求的内容",
    ReturnToHomepage: "返回首页",
  },
  [Language.JA]: {
    Just: "しばらくお待ちください...",
    Retry: "再試行",
    NetworkError: "ネットワークエラー",
    NetworkDesc: "ネットワーク設定を確認するか、後でもう一度試してください",
    ContentError:
      "申し訳ありませんが、リクエストしたコンテンツが見つかりません",
    ReturnToHomepage: "ホームページに戻る",
  },
};

export enum LoadingType {
  // init
  Init,
  // 正常加载
  Loading,
  // 异常加载
  AbnormalLoading,
  // 网络异常
  NetworkAbnormal,
  // error
  Error,
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const Loading = ({ type }: { type: LoadingType }) => {
  const router = useRouter();
  const networkState = useNetwork();

  const Retry = () => {
    if (networkState.online) {
      router.reload();
    }
  };

  const toHome = () => {
    router.push("/");
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={true}
        className="z-[1501]"
        TransitionComponent={Transition}
        TransitionProps={{ timeout: 800 }}
        classes={{ paper: "relative touch-none" }}
        sx={{
          ".MuiBackdrop-root": {
            backdropFilter: "blur(2px)",
          },
          ".MuiPaper-root": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        }}
      >
        <div className="w-full h-full px-8 flex items-center justify-center flex-col gap-y-8">
          <div className="flex items-center justify-center">
            <ScaleLoader />
          </div>

          {type === LoadingType.NetworkAbnormal && (
            <div className="text-sm text-center">
              <div className="mt-8 text-xl font-bold">
                {/* {router.locale === "en" ? "Network error" : "网络异常"} */}
                {LangMap[router.locale as string].NetworkError}
              </div>
              <div className="mt-4">
                {/* {router.locale === "en"
                  ? "Please check your network settings or try again later."
                  : "请检查您的网络设置或稍后再试"} */}
                {LangMap[router.locale as string].NetworkDesc}
              </div>
              <div className="flex justify-center">
                <div className="mt-9 py-3 px-1.5 flex items-center w-20 justify-center gap-1">
                  <ArrowClockwise size={32} />
                  <span className="" onClick={Retry}>
                    {/* {router.locale === "en" ? "Retry" : "重试"} */}
                    {LangMap[router.locale as string].Retry}
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === LoadingType.Error && (
            <div className="text-sm text-center">
              <div className="mt-4">
                {LangMap[router.locale as string].ContentError}
              </div>
              <div className="flex justify-center">
                <div className="mt-9 py-3 px-1.5 flex items-center w-auto justify-center gap-1">
                  <span className="" onClick={toHome}>
                    {LangMap[router.locale as string].ReturnToHomepage}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Loading;
