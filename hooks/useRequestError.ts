import React, { useEffect, useRef, useState } from "react";
import { useNetwork } from "./useNetwork";

export default function useRequestError() {
  const [requestTimeoutFlag, setRequestTimeoutFlag] = useState(false);
  const [manualRetryFlag, setManualRetryFlag] = useState(true);

  const {online} = useNetwork();

  const onRequestTimeout = (flag = true, isReset = false) => {
    if (Boolean(flag) === requestTimeoutFlag) return;
    if (isReset || !requestTimeoutFlag) {
      setRequestTimeoutFlag(flag);
    }
  };

  return {
    online,
    requestTimeoutFlag,
    onRequestTimeout,
    manualRetryFlag,
    setManualRetryFlag,
  };
}
