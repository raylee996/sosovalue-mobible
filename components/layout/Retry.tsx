import { Button } from "@mui/material";
import { useNetwork } from "hooks/useNetwork";
import React, { useEffect, useState } from "react";

type TProps = {
  children?: React.ReactNode;
  className?: string;
  /**
   * Flag indicating if the request timed out.
   * @type {boolean}
   */
  requestTimeoutFlag?: Boolean;
  /**
   * A function that is called when the retry button is clicked.
   * @function
   * @name TProps#retryHandler
   * @returns {void}
   */
  retryHandler?: Function;
  /**
   * only dark mode.
   * @type {boolean}
   */
  isOnlyDark?: Boolean;
  /**
   * if retry flag.
   * @type {boolean}
   */
  manualRetryFlag?: Boolean;
  /**
   * handle retry.
   * @type {React.Dispatch<React.SetStateAction<boolean>>}
   */
  setManualRetryFlag?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Retry({
  children,
  requestTimeoutFlag,
  retryHandler,
  className = '',
  isOnlyDark,
  manualRetryFlag,
  setManualRetryFlag,
}: TProps) {
  const { online } = useNetwork();

  useEffect(() => {
    if (!online) {
      // 断网后必须点击retry按钮原页面才能重新展示
      setManualRetryFlag?.(false);
      caches.keys().then((res) => {
        console.log('res', res)
      }).catch((err) => {
        console.log('err', err)
      })
    }
  }, [online]);

  const _retryHandler = () => {
    if (online) {
      setManualRetryFlag?.(true);
      retryHandler?.();
    }
  };

  return (
    <>
      {online && !requestTimeoutFlag && manualRetryFlag ? (
        children
      ) : (
        <div className={`flex flex-col justify-center items-center gap-4 w-full h-full px-8 py-4 ${className}`}>
          <div className={`text-lg leading-8 font-bold ${isOnlyDark ? 'text-[#fff]' : 'text-primary-900-White'}`}>
            Connect to the internet
          </div>
          <div className={`text-xs leading-4 font-normal ${isOnlyDark ? 'text-[#a3a3a3]' : 'text-secondary-500-300'}`}>
            You’re offline. Check your connection.
          </div>
          <Button
            className="normal-case text-sm text-white bg-primary px-5 py-2 rounded-lg"
            onClick={_retryHandler}
          >
            Tap to retry
          </Button>
        </div>
      )}
    </>
  );
}

/**
 * 弱网判断超时标识
 */
export const WEAK_INTERNET_TIMEOUT = 3000;
