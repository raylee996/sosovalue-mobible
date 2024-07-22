import NavigateWrap from "components/layout/NavigateWrap"
import NetworkTips from "components/layout/NetworkTips"
import Header from "components/header";
import Retry from "components/layout/Retry";
import { useNetwork } from "hooks/useNetwork";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Offline = () => {
  const {online} = useNetwork();
  const router = useRouter();

  const retryHandler = () => {
    if (online) {
      if (router.pathname.includes('_offline')) {
        router.push('/')
      } else {
        router.reload();
      }
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}