import HeaderTag from "components/operation/researchHome/HeadTag";
import TimeLine from "components/operation/researchHome/TimeLine";
import Welcome from "components/operation/researchHome/Welcome";
import FooterTag from "components/operation/researchHome/FooterTag";
import EarlyBird from "components/operation/researchHome/EarlyBird";
import ResearchTheme from "components/operation/researchHome/ResearchTheme";
import Link from "next/link";
import Image from "next/image";
import Twitter from "components/icons/tw-32.svg";
import Telegram from "components/icons/tg-32.svg";
import { IconButton } from "@mui/material";
import { copyText } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import Share from "components/icons/Share.svg";
import RegisterDialog from "components/operation/researchHome/Register-Modal";
import Submitted from "components/operation/researchHub/Submitted";
import { getActivitySign } from "http/activity";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "store/UserStore";
import LoadingOverlay from "./Loading";
import { trackbrainBattlePageView } from "helper/track";
import { useRouter } from "next/router";
import { getPcWebsite } from "helper/config";

enum Status {
  Register = "register",
  Submit = "submit",
}

const Activity = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { success } = useNotistack();
  let invitationCode = router.query.inviteCode as string;
  const handleShare = () => {
    if (user?.invitationCode) {
      copyText(`Calling for TOP CRYPTO ANALYSTS! SoSoValue Brain Battle Ongoing! Join now 🥇🧠
👉 ${getPcWebsite()}/brain-battle?inviteCode=${user?.invitationCode}`);
    } else {
      copyText(`Calling for TOP CRYPTO ANALYSTS! SoSoValue Brain Battle Ongoing! Join now 🥇🧠
👉 ${getPcWebsite()}/brain-battle`);
    }
    success("Share link copied");
  };

  const getRegister = async () => {
    setLoading(true);
    try {
      const res = await getActivitySign();
      if (res?.data) {
        setStatus(Status.Submit);
        trackbrainBattlePageView(
          user?.invitationCode || "",
          invitationCode || "",
          "submit"
        );
      } else {
        setStatus(Status.Register);
        trackbrainBattlePageView(
          user?.invitationCode || "",
          invitationCode || "",
          "register"
        );
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getRegister();
    } else {
      setStatus(Status.Register);
      trackbrainBattlePageView("", invitationCode || "", "register");
    }
  }, [user, invitationCode]);

  return (
    <div className="bg-[#fff] w-full h-full relative overflow-y-auto overflow-x-hidden">
      {status === Status.Submit ? (
        <Submitted />
      ) : status === Status.Register ? (
        <>
          <div className="flex items-center px-3 pt-1 pb-3 gap-3 border-0 border-b border-solid border-[#E5E5E5] bg-[#fff]">
            <Link href="/" className="no-underline ">
              <IconButton className="px-4 py-2">
                <Image
                  alt=""
                  src="/img/logo-light.svg"
                  width={20}
                  height={20}
                />
              </IconButton>
            </Link>
            <div className="flex-1 truncate text-[#0A0A0A] text-base text-center font-bold">
              Brain Battle
            </div>
            <IconButton className="px-4 py-2" onClick={handleShare}>
              <Share className="text-[#0A0A0A]" />
            </IconButton>
          </div>
          <div className={`flex flex-col bg-[#f4f4f4] p-3 w-full gap-3`}>
            <HeaderTag />
            <Welcome />
            <ResearchTheme />
            <EarlyBird />
            <TimeLine />
            <div className="flex gap-3">
              <Link
                href="/"
                className="no-underline flex-1 items-center flex flex-col gap-3 p-3 rounded-2xl bg-[#fff] shadow-[0px_100px_80px_0px_rgba(0,0,0,0.09),0px_22.336px_17.869px_0px_rgba(0,0,0,0.05),0px_6.65px_5.32px_0px_rgba(0,0,0,0.04)}"
              >
                <Image
                  src="/img/logo-light.svg"
                  alt=""
                  width={32}
                  height={32}
                  color="#0A0A0A"
                  className="w-8 h-8 flex items-center justify-center"
                />
                <div className="text-[#525252] text-sm h-10 flex items-center text-center">
                  Visit SoSoValue
                </div>
              </Link>
              <Link
                href="https://twitter.com/SoSoValueCrypto"
                className="no-underline flex-1 flex items-center flex-col gap-3 p-3 rounded-2xl bg-[#fff] shadow-[0px_100px_80px_0px_rgba(0,0,0,0.09),0px_22.336px_17.869px_0px_rgba(0,0,0,0.05),0px_6.65px_5.32px_0px_rgba(0,0,0,0.04)}"
              >
                <Twitter className="w-8 h-8 flex items-center justify-center" />
                <div className="text-[#525252] text-sm h-10 flex items-center text-center">
                  X (Twitter)
                </div>
              </Link>
              <Link
                href="https://t.me/soso_news_bot"
                className="no-underline flex-1 flex items-center flex-col gap-3 p-3 rounded-2xl bg-[#fff] shadow-[0px_100px_80px_0px_rgba(0,0,0,0.09),0px_22.336px_17.869px_0px_rgba(0,0,0,0.05),0px_6.65px_5.32px_0px_rgba(0,0,0,0.04)}"
              >
                <Telegram className="w-8 h-8 flex items-center justify-center" />
                <div className="text-[#525252] text-sm h-10 flex items-center text-center">
                  Telegram Bot
                </div>
              </Link>
            </div>
            <FooterTag />
            <div className="flex items-center justify-center fixed bottom-4 z-1 left-0 right-0">
              <RegisterDialog onChange={getRegister} />
            </div>
          </div>
        </>
      ) : null}
      <LoadingOverlay open={loading} />
    </div>
  );
};

export default Activity;
