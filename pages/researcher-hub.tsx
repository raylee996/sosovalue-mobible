import { useState, useRef, useContext, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Widget } from "@typeform/embed-react";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
import { useRouter } from "next/router";
import SEO from "components/operation/SEO";
import { getOrigin } from "helper/config";
import Contribute from "components/operation/researchHub/Contribute";
import SignUp from "components/operation/researchHub/SignUp";
import { Space_Grotesk, Lato } from "next/font/google";
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: "700",
});

const lato = Lato({
  variable: "--font-lato",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: "700",
});
enum VoteStatus {
  // 未登录
  NoLogin = "NoLogin",
  // 投票结束 结算
  NotFilled = "NotFilled",
  // 颁奖
  Reward = "Reward",
}

const Activity = () => {
  const router = useRouter();
  const [state, setState] = useState<string>("");
  const { user } = useContext(UserContext);

  const getInitState = () => {
    if (!user) {
      setState(VoteStatus.NoLogin);
    } else {
      setState(VoteStatus.NotFilled);
    }
  };

  useEffect(() => {
    getInitState();
  }, [user]);

  return (
    <div
      className={`${grotesk.variable} ${lato.variable} !font-grotesk xl:overflow-hidden flex h-full flex-col items-stretch`}
    >
      <SEO
        config={{
          title:
            "Vote Now: SoSo Value Crypto Researcher Scholarship Community Vote",
          twitterTitle:
            "Vote Now: SoSo Value Crypto Researcher Scholarship Community Vote",
          telegramTitle:
            "Vote Now: SoSo Value Crypto Researcher Scholarship Community Vote",
          description:
            "Participate in the SoSo Value Crypto Researcher vote! Explore top crypto articles, vote for the best, and get a chance to win from a 100,000 SoSo EXP prize pool. Pre-register for Season 2 now!",
          image: `${getOrigin()}/img/seo/scholarship-s1-community-vote.png`,
        }}
      />
      <div className="h-full bg-[#fff]">
        {state === VoteStatus.NoLogin && <Contribute />}
        {state === VoteStatus.NotFilled && <SignUp />}
      </div>
    </div>
  );
};

export default Activity;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "activity"])),
      // Will be passed to the page component as props
    },
  };
}
