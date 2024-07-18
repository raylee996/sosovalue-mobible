import {
  Button,
  IconButton,
  ListItemButton,
  OutlinedInput,
} from "@mui/material";
import NavigateWrap from "components/layout/NavigateWrap";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import { getInviteLink } from "helper/config";
import { copyText } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { addInviter, getUserExp } from "http/user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UserContext } from "store/UserStore";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";

dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(utc);

const expList = [0, 600, 1800, 3600, 6000, 10800];

const Exp = () => {
  const router = useRouter();
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const { logout, user, getUserInfo } = useContext(UserContext);
  const { success } = useNotistack();
  const [grade, setGrade] = useState(0);
  const [exp, setExp] = useState<API.userExp>();
  const { t } = useTranslation(localeType.COMMON);
  const [invitationCode, setInvitationCode] = useState(
    router.query.inviteCode || ""
  );
  const [isError, setIsError] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const referralLink = useMemo(() => {
    return user ? getInviteLink({ inviteCode: user.invitationCode }) : "";
  }, [user]);
  const clickLogout = () => {
    logout();
    router.replace("/");
  };
  const startInterval = () => {
    const currentWeekEndTime = dayjs
      .utc()
      .isoWeekday(7)
      .hour(12)
      .minute(0)
      .second(0);
    const now = dayjs.utc();
    const endTime = now.isAfter(currentWeekEndTime)
      ? currentWeekEndTime.add(1, "week")
      : currentWeekEndTime;
    const timer = setInterval(() => {
      const duration = dayjs.duration(endTime.diff(dayjs.utc()));
      if (duration.asMilliseconds() <= 0) {
        clear();
        initUserExp();
      } else {
        const str = `${duration.format("D")}D ${duration.format("HH:mm:ss")}`;
        timeRef.current!.innerText = str;
      }
    }, 1000);
    const clear = () => {
      clearInterval(timer);
    };
    return clear;
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvitationCode(e.target.value);
    setIsError(false);
    setErrMsg("");
  };
  const bindInviter = () => {
    setIsBinding(true);
    addInviter(invitationCode as string)
      .then((res) => {
        if (res.success) {
          success(t("success"));
          getUserInfo();
        } else if (res.code === 40026 || res.code === 40039) {
          setIsError(true);
          setErrMsg(res.msg);
        }
      })
      .finally(() => setIsBinding(false));
  };
  const copyKey = () => {
    copyText(user?.invitationCode || "");
    success(t("Copy successful"));
  };
  const copyLink = () => {
    copyText(referralLink);
    success(t("Copy successful"));
  };
  const initUserExp = () => {
    return getUserExp().then((res) => {
      let grade = 0;
      expList.forEach((item, index) => {
        if (res.data.currentExp >= item) {
          grade = index;
        }
      });
      setGrade(grade);
      setExp(res.data);
      return startInterval();
    });
  };
  useEffect(() => {
    const request = initUserExp();
    return () => {
      request.then((clear) => clear());
    };
  }, []);
  return (
    <NavigateWrap>
      <div className="h-full pb-16 overflow-y-auto">
        <div className="bg-[url('/img/exp-bg.png')] bg-cover">
          <div className="flex items-center justify-center h-12 relative">
            <Image
              className="mr-2"
              src="/img/exps-new.png"
              width={32}
              height={32}
              alt=""
            />
            <span className="text-2xl text-white font-black [text-shadow:1px_1px_2px_rgba(244,244,244,0.33)]">
              {t("SoSo Exp")}
            </span>
          </div>
          <div className="px-4 mt-4">
            <div className="p-4 rounded-lg backdrop-blur-sm border border-solid border-[#404040]">
              <div className="flex justify-between">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col items-center">
                    <span className="text-title text-sm font-bold">
                      {t("Your Exp")}
                    </span>
                    <div className="mt-4 text-[38px] leading-10 font-bold text-[#FFD64D] [text-shadow:0_1px_7px_#FF9004]">
                      {exp?.currentExp}
                    </div>
                  </div>
                  <div className="leading-10 h-10 flex items-center ml-2">
                    <span className="text-sm text-white font-bold">
                      +{exp && exp?.currentExp - exp?.lastSettledExp} {t("Exp")}
                    </span>
                    <span className="text-sm text-content ml-2">
                      {t("last week")}
                    </span>
                  </div>
                </div>
                {/* from-[#FFD418] to-[#FFA800]  */}
                <div className="text-base italic font-bold">
                  <span className="bg-gradient-to-r from-[#FFD418]  to-[#FFA800] text-transparent bg-clip-text inline-block w-full">
                    @{user?.username}
                  </span>
                  <div className="flex items-center justify-end mt-5 ml-3">
                    <span className="text-base text-[#1A1A1A] font-bold rounded bg-[linear-gradient(289deg,#FFF_5.35%,#A4A4A4_108.88%)] px-1 py-0.5">
                      V{grade}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-3 rounded-full bg-[rgba(255,255,255,0.20)] mt-4 mb-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F4F4F4] transition-[width]"
                  style={{
                    width: `${
                      ((exp?.currentExp || 0) / expList[grade + 1]) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-title text-xs">
                  {exp?.currentExp} / {expList[grade + 1]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-end px-4 mt-2 mb-3 justify-end"></div>
          <div className="px-4">
            <div className="flex justify-between items-center flex-col">
              <div className="flex items-center">
                <Image
                  src="/img/svg/ClockCountdown.svg"
                  width={16}
                  height={16}
                  alt=""
                />
                <span className="text-sm text-sub-title ml-2">
                  {t("Next Exp Airdrop")}
                </span>
              </div>
              <span
                ref={timeRef}
                className="text-title [text-shadow:0_1px_7px_#FFFFFF] text-lg inline-block mt-2"
              ></span>
            </div>
            <div className="text-[13px] text-sub-title mt-4">
              {t("SoSo EXP Desc")}
            </div>
            <div className="h-[1px] bg-[#404040] mt-8"></div>
          </div>
        </div>
        <div className="px-4">
          <div className="mt-8">
            <div className="flex items-center">
              <span className="text-sm font-bold text-[#D9A75C]">
                {t("Referral Keys")}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center h-[45px] px-4 mb-2 rounded border border-solid border-[#404040]">
                <span className="text-content text-base">
                  {t("Referral Keys")}
                </span>
                <div className="flex items-center">
                  <span className="text-title text-base">
                    {user?.invitationCode}
                  </span>
                  <IconButton onClick={copyKey}>
                    <Image
                      src="/img/svg/Copy-gray.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                  </IconButton>
                </div>
              </div>
              <div className="flex justify-between items-center h-[45px] px-4 mb-2 rounded border border-solid border-[#404040]">
                <span className="text-content text-base">
                  {t("Referral Link")}
                </span>
                <div className="flex items-center">
                  <span className="text-title text-base w-28 truncate">
                    {referralLink}
                  </span>
                  <IconButton onClick={copyLink}>
                    <Image
                      src="/img/svg/Copy-gray.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-center">
              <span className="text-sm font-bold text-[#D9A75C]">
                {t("Invite Rewards")}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-[13px] text-sub-title mt-4">
                {t("Invite Rewards Desc")}
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-content text-[13px]">
                    {t("Successful invitees")}
                  </span>
                  <span className="text-title font-bold text-base">
                    {user?.totalInvitations || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content text-[13px]">
                    {t("Earned exp")} {t("(Updated last week)")}
                  </span>
                  <span className="text-title font-bold text-base">
                    {exp?.totalInvitationEXP || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {!user?.invitationUserId && (
            <div className="mt-8">
              <div className="flex items-center">
                <span className="text-sm font-bold text-[#D9A75C]">
                  {t("Accept an invitation")}
                </span>
              </div>
              <div className="mt-4 h-[45px] flex items-stretch">
                <OutlinedInput
                  value={invitationCode}
                  onChange={onChange}
                  className="flex-1"
                  classes={{
                    notchedOutline: isError
                      ? "border-[#DA1E28] border-[2px]"
                      : "border-[#404040]",
                    input: "text-base text-title",
                  }}
                />
                <Button
                  onClick={bindInviter}
                  disabled={!invitationCode || isBinding}
                  className="normal-case text-title text-sm ml-4"
                  classes={{ disabled: "bg-[#404040]" }}
                  variant="contained"
                >
                  {t("Confirm")}
                </Button>
              </div>
              {errMsg && (
                <div key={status} className="text-[#DA1E28] text-xs mt-1">
                  {errMsg}
                </div>
              )}
            </div>
          )}
          <div className="mt-8">
            <Link href="/setting">
              <ListItemButton className="h-14 text-title text-sm py-0">
                <Image src="/img/svg/gear.svg" width={24} height={24} alt="" />
                <div className="ml-4 flex-1 self-stretch flex justify-between items-center border-0 border-b border-solid border-[#242424]">
                  <span>{t("Settings")}</span>
                  <Image
                    className="rotate-180"
                    src="/img/svg/arrow-left.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                </div>
              </ListItemButton>
            </Link>
            <Link href="/feedback">
              <ListItemButton className="h-14 text-title text-sm py-0">
                <Image src="/img/svg/email.svg" width={24} height={24} alt="" />
                <div className="ml-4 flex-1 self-stretch flex justify-between items-center border-0 border-b border-solid border-[#242424]">
                  <span>{t("Feedback")}</span>
                  <Image
                    className="rotate-180"
                    src="/img/svg/arrow-left.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                </div>
              </ListItemButton>
            </Link>
            <ListItemButton
              className="h-14 text-[#DA1E28] text-sm py-0"
              onClick={clickLogout}
            >
              <Image
                src="/img/svg/logout-red.svg"
                width={24}
                height={24}
                alt=""
              />
              <div className="ml-4 flex-1 self-stretch flex justify-between items-center">
                <span>{t("Logout")}</span>
                <Image
                  className="rotate-180"
                  src="/img/svg/arrow-left.svg"
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
            </ListItemButton>
          </div>
          <div className="mt-8 pb-24">
            <div className="flex justify-center items-center gap-3">
              <Link
                href="https://t.me/SoSoValueCommunity"
                className="no-underline"
                target="_blank"
              >
                <Image src="/img/telegram.svg" width={24} height={24} alt="" />
              </Link>
              {/* <Link
                href="https://discord.gg/udDJWMytBa"
                className="no-underline"
                target="_blank"
              >
                <Image src="/img/discord.svg" width={24} height={24} alt="" />
              </Link> */}
              <Link
                href="https://twitter.com/SoSoValueCrypto"
                className="no-underline"
                target="_blank"
              >
                <Image src="/img/twitter.svg" width={24} height={24} alt="" />
              </Link>
            </div>
            <div className="text-xs text-content text-center my-4">
              <Link href="https://sosovalue.xyz/blog/terms-of-service">
                {t("Terms")}
              </Link>
              <span className="mx-2">{t("and")}</span>
              <Link href="https://sosovalue.xyz/blog/privacy-policy">
                {t("Privacy policy")}
              </Link>
            </div>
            <div className="text-xs text-content text-center">
              {t("© 2023 Imagine Labs")}
            </div>
          </div>
        </div>
      </div>
    </NavigateWrap>
  );
};

export default Exp;
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}
