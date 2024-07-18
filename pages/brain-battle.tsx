import { Button, IconButton, TextField } from "@mui/material";
import Share from "components/icons/Share.svg";
import Twitter from "components/icons/tw-32.svg";
import Telegram from "components/icons/tg-32.svg";
import { copyText, splitNum } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { useCountDown, useDebounceFn } from "ahooks";
import ClientRenderCheck from "components/base/ClientCheck";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { activityEarlyAccessCreate, getActivityTimeline } from "http/activity";
import Regex from "helper/regex";
import { House } from "@phosphor-icons/react";
import HomeIndex from "components/operation/researchHome/home";
import { getPcWebsite } from "helper/config";
import { UserContext } from "store/UserStore";

enum Status {
  // 预报名
  SignUp = "SignUp",
  // 注册
  Register = "Register",
}

type Props = {
  total: number;
  rate: number;
  unit?: string;
};

const Counter = ({ total, unit, rate }: Props) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = total;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 50); // Calculate the increment

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [total]);

  return (
    <div className="!font-fjalla flex-1 overflow-hidden text-[26px] font-bold text-center leading-[140%] text-[#fff] -tracking-[1%]">
      {unit}
      {splitNum(count * rate)}+
    </div>
  );
};

const BrainBattle = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState<string>();
  const { success, error } = useNotistack();
  const [email, setEmail] = useState<string>("");
  const targetTime = new Date("2024-07-08T00:00:00Z").getTime();
  const [countdown, formattedRes] = useCountDown({
    targetDate: targetTime,
    onEnd: () => {
      setStatus(Status.Register);
    },
  });
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

  const handleChange = (event: any) => {
    const value = event.target.value;
    setEmail(value);
  };

  const validateEmail = async () => {
    if (!email) {
      error("Please enter your Email Address");
      return;
    }

    if (Regex.email.test(email)) {
      const res = await activityEarlyAccessCreate({ email });
      if (res.success) {
        success(res.msg);
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        error(res.msg);
      }
    } else {
      error("Invalid Email address, please check your Email");
    }
  };

  const { run: handleSend } = useDebounceFn(
    () => {
      validateEmail();
    },
    { wait: 500 }
  );
  const getTime = async () => {
    const { data } = await getActivityTimeline();
    if (data && +data[0].startTime > Date.now()) {
      setStatus(Status.SignUp);
    } else {
      setStatus(Status.Register);
    }
  };
  useEffect(() => {
    getTime();
    // if (new Date("2024-07-08T00:00:00Z").getTime() > Date.now()) {
    //   setStatus(Status.SignUp);
    // } else {
    //   setStatus(Status.Register);
    // }
  }, []);

  return status === Status.Register ? (
    <HomeIndex />
  ) : status === Status.SignUp ? (
    <div className="bg-[#f4f4f4] h-full relative overflow-y-auto overflow-x-hidden">
      <div className="flex items-center px-3 pt-1 pb-3 gap-3 border-0 border-b border-solid border-[#E5E5E5] bg-[#fff]">
        <Link href="/" className="no-underline ">
          <IconButton className="px-4 py-2">
            {/* <ArrowLeft className="text-[#0A0A0A]" /> */}
            <House size={20} color="#0A0A0A" />
          </IconButton>
        </Link>
        <div className="flex-1 truncate text-[#0A0A0A] text-base font-bold">
          Top Crypto Investment Analysts Brain Battle
        </div>
        <IconButton className="px-4 py-2" onClick={handleShare}>
          <Share className="text-[#0A0A0A]" />
        </IconButton>
      </div>

      <div className="flex p-3 gap-3">
        <div className="flex-1 w-1/2 flex flex-col gap-2 p-4 rounded-2xl bg-[linear-gradient(204deg,#FF4F20_12.32%,#FF8438_87.68%)]">
          <Counter total={50} unit="$" rate={1000} />
          <div className="text-[#fff] text-xs font-bold text-center">
            💰Total Prize Pool
          </div>
        </div>
        <div className="flex-1 w-1/2 flex flex-col gap-2 p-4 rounded-2xl bg-[linear-gradient(204deg,#FF4F20_12.32%,#FF8438_87.68%)]">
          <Counter total={50} rate={10000000} />
          <div className="text-[#fff] text-xs font-bold text-center">
            🧠️ Brain EXP Pool
          </div>
        </div>
      </div>

      <div className="mx-3 p-4 bg-[#fff] rounded-2xl ">
        <div className="mb-8">
          <Link href="/" className="mb-3 no-underline flex">
            <Image
              src="/img/logo-black-horizontal-without-alpha.png"
              alt=""
              width={158}
              height={35}
            />
          </Link>
          <div className="flex justify-between items-center">
            {/* <div className="">
                        <div className={`text-[#7A7A7A] italic text-sm font-semibold adobe-font`}>Top Crypto Investment Analysts</div>
                        <div>
                            <span className={`adobe-font font-bold italic text-3xl uppercase bg-[linear-gradient(91deg,#0A0A0A_0%, #555_100%)] bg-clip-text drop-shadow-[0_34.12px_27.296px_rgba(0,0,0,0.07),0_14.255px_11.404px_rgba(0,0,0,0.05),0_7.621px_6.097px_rgba(0,0,0,0.04),0_4.272px_3.418px_rgba(0,0,0,0.04),0_2.269px_1.815px_rgba(0,0,0,0.03),0_0.944px_0.755px_rgba(0,0,0,0.02)]`}>Brain Battle</span>
                            <span className="text-[#FF4F20] text-xs italic font-bold">#DYOR</span>
                        </div>
                    </div>
                    <Brain /> */}
            <Image
              src="/img/brain-battle-1.png"
              alt=""
              layout="responsive"
              width={624}
              height={124}
            />
          </div>
        </div>
        <ClientRenderCheck>
          <div
            className={`text-[#FF4F20] text-[32px] font-bold italic adobe-font`}
          >
            {formattedRes.days}D : {formattedRes.hours}H :{" "}
            {formattedRes.minutes}M : {formattedRes.seconds}S
            {/* {process.env.NEXT_PUBLIC_ENV !== "production" && (
              <Button
                className="bg-[#FF4F20] ml-4 text-[#fff] inline-block rounded-2xl"
                onClick={() => setStatus(Status.Register)}
              >
                进入活动页
              </Button>
            )} */}
          </div>
        </ClientRenderCheck>
        <div className=" flex items-center w-full h-[72px] mt-8 border-[2px] border-solid border-[rgba(255,79,32,0.50)] rounded-lg">
          <TextField
            value={email}
            onChange={handleChange}
            className="flex-1 py-3 bg-none h-full rounded-none border-0 items-stretch"
            placeholder={`Email Your Email Address`}
            autoComplete="off"
            InputProps={{
              classes: {
                root: "h-full",
                notchedOutline: "border-0",
                input: "text-base py-0 h-8 text-[#0A0A0A]",
              },
            }}
          />

          <Button
            className={`max-w-[90px] h-full flex flex-wrap items-center normal-case justify-center border-0 rounded-l-none py-3 bg-[#FF4F20] text-sm font-bold text-white-White leading-6`}
            onClick={handleSend}
          >
            Get Early Access
          </Button>
        </div>
        <Link href="/assets/etf/us-btc-spot" className="mt-8 no-underline flex">
          <img src="/img/brain-battle.png" alt="" className=" w-full" />
        </Link>
      </div>

      <div className="flex gap-3 p-3">
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
    </div>
  ) : (
    <div className="bg-[#fff] h-full" />
  );
};

export default BrainBattle;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}
