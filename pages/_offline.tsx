import NavigateWrap from "components/layout/NavigateWrap"
import NetworkTips from "components/layout/NetworkTips"
import Header from "components/header";
import Retry from "components/layout/Retry";
import { useNetwork } from "hooks/useNetwork";
import { useRouter } from "next/router";

// next-pwa提供的离线fallback
// 实测在无网状态下安卓能稳定出现，ios下不稳定出现，有时会被浏览器默认断网提示接管
const Offline = () => {
  const {online} = useNetwork();
  const router = useRouter();

  const retryHandler = () => {
    if (online) {
      router.reload();
    }
  }

  return (
    <NavigateWrap className="h-screen">
      <div className="pb-[82px] h-full flex flex-col items-stretch overflow-y-auto">
      <NetworkTips />
      <Header />
      <Retry
        requestTimeoutFlag
        manualRetryFlag
        retryHandler={retryHandler}
        
      />
      </div>
    </NavigateWrap>
  )
}

export default Offline