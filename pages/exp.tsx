import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  ListItemButton,
  OutlinedInput,
  Tab,
  Tabs,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import NiceModal from "@ebay/nice-modal-react";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
  useCallback,
} from "react";
import Image from "next/image";
import { UserContext } from "store/UserStore";
import { getInviteLink } from "helper/config";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  addInviter,
  createDayilyCheckin,
  getDailyCheckinList,
  getExpTaskList,
  getUserExp,
  updateTask,
} from "http/user";
import { INVITE_CODE_KEY, NEED_LOGIN } from "helper/constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import { copyText, getOffsetPageTop, parseUA } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import CheckAnimate from "components/base/CheckAnimate";
import { CheckCircle, Trophy } from "@phosphor-icons/react";
import { useInstallPWA } from "store/usePwaStore";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavigateWrap from "components/layout/NavigateWrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTExp } from "hooks/useTranslation";
import useTelegramStore from "store/useTelegramStore";
import { useTelegramStartParam } from "hooks/useTelegramStartParam";
import { telegramHelper } from "helper/telegram";
import MenuModal from "components/header/MenuModal";
import { useRequest } from "ahooks";
import { pushMessagesDo } from "http/home";
import InterceptionToken from "components/operation/auth/InterceptionToken";
import { getToken } from "helper/storage";
import ScaleLoader from "components/base/ScaleLoader";
import NetworkTips from "components/layout/NetworkTips";
import useRequestError from "hooks/useRequestError";
import Retry from "components/layout/Retry";
import { InternetContext } from "store/InternetContext";
import { useThemeStore } from "store/useThemeStore";

dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(utc);

const expList = [0, 600, 1800, 3600, 6000, 10800];

const weekScore = [5, 5, 10, 5, 10, 5, 15];

const dayEnLabel = ["st", "nd", "rd", "th", "th", "th", "th"];

const createWeeks = (consecutiveDays: number) => {
  const weeks = [];
  let i = 1;
  while (i <= 7) {
    const label =
      i === consecutiveDays ? "Today" : `${i}${dayEnLabel[i - 1]} day`;
    weeks.push({
      label,
      score: weekScore[i - 1],
      check: i <= consecutiveDays,
    });
    i++;
  }
  return weeks;
};

type TaskMap = {
  desktop?: User.Task;
  mobile?: User.Task;
  twitter?: User.Task;
  google?: User.Task;
};

const Exp = () => {
  const router = useRouter();
  const { t } = useTranslation(["common"]);
  const { t: tExp } = useTExp();
  const { success, enqueueSnackbar, closeSnackbar } = useNotistack();
  const {
    logout,
    user,
    getUserInfo,
    userModal,
    googleLogin,
    twitterLoginRedirect,
    authModal,
  } = useContext(UserContext);
  const { isTelegram, telegramBotInfo } = useTelegramStore();
  const [weeks, setWeeks] = useState<
    { label: string; score: number; check: boolean }[]
  >([]);
  const [grade, setGrade] = useState(0);
  const [exp, setExp] = useState<API.userExp>();
  const [tabIndex, setTabIndex] = useState(0);
  const timeSpanRef = useRef<HTMLSpanElement | null>(null);
  const [taskMap, setTaskMap] = useState<TaskMap>({});
  const [taskLoading, setTaskLoading] = useState<{
    desktop?: boolean;
    mobile?: boolean;
    twitter?: boolean;
    google?: boolean;
  }>({});
  const [dailyFinish, setDailyFinish] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const { data: msgRes } = useRequest(
    () => pushMessagesDo({ isRead: 1, receiverId: user!.id }),
    {
      ready: Boolean(user?.id),
      refreshDeps: [user],
    }
  );
  const unread = msgRes?.data === false;
  const referralLink = useMemo(() => {
    if (!user) return { show: "", copy: "" };
    const showInviteLink = getInviteLink({
      [INVITE_CODE_KEY]: user.invitationCode,
    });
    const copyInviteLink = getInviteLink({
      [INVITE_CODE_KEY]: user.invitationCode,
      [NEED_LOGIN]: 1,
    });
    const telegramInviteLink = telegramBotInfo?.username
      ? `https://t.me${telegramBotInfo.appName}?startapp=inviteCode-${
          user.invitationCode || ""
        }`
      : "";

    return {
      show: !isTelegram ? showInviteLink : telegramInviteLink,
      copy: !isTelegram ? copyInviteLink : telegramInviteLink,
    };
  }, [user, isTelegram, telegramBotInfo?.username]);
  const [invitationCode, setInvitationCode] = useState(
    router.query.inviteCode || ""
  );
  const [isError, setIsError] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const { installPWA } = useInstallPWA({
    onAppinstalled() {
      success(t("Installing"));
    },
  });
  const installClick = () => {
    const ua = parseUA();
    if (ua.isAndroid && ua.isChrome) {
      installPWA();
    } else {
      userModal?.installPwa.open();
    }
  };
  const copyPcLink = () => {
    copyText("https://sosovalue.xyz/exp");
    success(t("Copy successful"));
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvitationCode(e.target.value);
    setIsError(false);
    setErrMsg("");
  };
  const bindInviter = (code?: string) => {
    const _invitationCode = code || invitationCode;
    addInviter(_invitationCode as string)
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
  const handleMenuToggle = () => {
    NiceModal.show(MenuModal, { unread });
  };
  const clickLogout = () => {
    logout();
    router.replace("/");
  };
  const copyReferralLink = () => {
    copyText(referralLink.copy);
    success(t("Copy successful"));
  };
  const copyReferralKey = () => {
    copyText(user?.invitationCode || "");
    success(t("Copy successful"));
  };
  const initSpecTaskList = () => {
    return getExpTaskList({ userId: user!.id, taskType: 1 }, {onRequestTimeout: _onRequestTimeout}).then((res) => {
      const taskMap = (res.data.list || []).reduce<TaskMap>((map, item) => {
        if (item.type === 1) {
          map.desktop = item;
        } else if (item.type === 2) {
          map.mobile = item;
        } else if (item.type === 4) {
          map.twitter = item;
        } else if (item.type === 5) {
          map.google = item;
        }
        return map;
      }, {});
      setTaskMap(taskMap);
    });
  };
  const initDailyTaskList = () => {
    getExpTaskList({
      userId: user!.id,
      taskType: 2,
      pageSize: 1,
      orderItems: [{ asc: false, column: "complete_time" }],
    }, {onRequestTimeout: _onRequestTimeout}).then((res) => {
      const completeTimeStr = res.data.list?.[0]?.completeTime;
      if (completeTimeStr) {
        const completeTime = dayjs(+completeTimeStr).utc().add(12, "hour");
        setDailyFinish(
          completeTime.isBefore(dayjs.utc().add(12, "hour").endOf("day")) &&
            completeTime.isAfter(dayjs.utc().add(12, "hour").startOf("day"))
        );
      }
    });
  };
  const initExpTaskList = () => {
    initSpecTaskList();
    initDailyTaskList();
  };
  const timerRef = useRef<number | null>(null);
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const {
    online,
    onRequestTimeout,
    requestTimeoutFlag,
    manualRetryFlag,
    setManualRetryFlag,
  } = useRequestError();
  const _onRequestTimeout = () => {
    clearTimer();
    onRequestTimeout();
  };
  const startInterval = () => {
    clearTimer();
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
    timerRef.current = window.setInterval(() => {
      const duration = dayjs.duration(endTime.diff(dayjs.utc()));
      if (duration.asMilliseconds() <= 0) {
        clearTimer();
        initUserExp();
      } else {
        const str = `${duration.format("D")}D ${duration.format("HH:mm:ss")}`;
        if (timeSpanRef.current) {
          timeSpanRef.current.innerText = str;
        }
      }
    }, 1000);
  };
  const initUserExp = () => {
    getUserExp({onRequestTimeout: _onRequestTimeout}).then((res) => {
      let grade = 0;
      expList.forEach((item, index) => {
        if ((res.data?.currentExp || 0) >= item) {
          grade = index;
        }
      });
      setGrade(grade);
      setExp(res.data);
      startInterval();
    });
  };
  const updateTaskLoading = (task: User.Task, loading: boolean) => {
    const newValue = { ...taskLoading };
    if (task.type === 1) {
      newValue.desktop = loading;
    } else if (task.type === 2) {
      newValue.mobile = loading;
    } else if (task.type === 4) {
      newValue.twitter = loading;
    } else if (task.type === 5) {
      newValue.google = loading;
    }
    setTaskLoading(newValue);
  };
  const getTaskExp = (task: User.Task) => {
    updateTaskLoading(task, true);
    updateTask({ ...task, status: 2 }).then((res) => {
      initSpecTaskList().then(() => updateTaskLoading(task, false));
      initUserExp();
      const snackbarKey = enqueueSnackbar(null, {
        content: (
          <div className="flex items-center bg-[#1A1A1A] p-3 border border-solid border-[#FFD64D] rounded">
            <Image
              className="scale-110"
              src="/img/exps.svg"
              width={24}
              height={24}
              alt=""
            />
            <span className="text-sm font-bold text-white ml-2">
              Congratulations! You have earned {task.exp} EXP.
            </span>
            <IconButton
              className="text-white"
              onClick={() => closeSnackbar(snackbarKey)}
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
        ),
        autoHideDuration: 5000,
        anchorOrigin: { horizontal: "center", vertical: "top" },
      });
    });
  };
  const inviteRef = useRef<HTMLDivElement | null>(null);
  const tabChange = (index: number) => {
    setTabIndex(index);
    console.log(
      "getOffsetPageTop(inviteRef.current)",
      index,
      getOffsetPageTop(inviteRef.current)
    );

    if (index === 1) {
      inviteRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const linkHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTelegram) {
      e.preventDefault();
      telegramHelper.openBrowser(e.currentTarget.href);
    }
  };
  const allInitHandler = () => {
    if (user) {
      setLoading(false);
      createDayilyCheckin({ userId: user.id }, {onRequestTimeout: _onRequestTimeout}).then((res) => {
        const showToast = res.data;
        getDailyCheckinList({ pageSize: 1, userId: user.id }, {onRequestTimeout: _onRequestTimeout}).then((res) => {
          const consecutiveDays = res.data.list?.[0].consecutiveDays || 0;
          setWeeks(createWeeks(consecutiveDays));
          setConsecutiveDays(consecutiveDays);
          if (showToast) {
            setShowToast(showToast);
            setTimeout(() => setShowToast(false), 2000);
          }
        });
        initUserExp();
      });
      initExpTaskList();
    }
  };
  useEffect(() => {
    allInitHandler();
  }, [user]);
  useEffect(() => {
    if (!user && !getToken() && online && !requestTimeoutFlag && manualRetryFlag) {
      alert(1)
      // setLoading(false);
      authModal?.openSignupModal(() => () => {
        router.back();
      });
    }
  }, [user, online, requestTimeoutFlag, manualRetryFlag]);
  useTelegramStartParam({
    searchKey: INVITE_CODE_KEY,
    onReceive: (value) => {
      bindInviter(value);
      setInvitationCode(value);
    },
  });
  const progress = (
    <div className="relative w-[200px] h-[178px]">
      <svg viewBox="0 0 100 100" role="presentation">
        <circle
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeWidth="8"
          style={{
            stroke: "rgba(128, 128, 128, 0.50)",
            strokeDasharray: "223.787px, 295.31",
            strokeDashoffset: 0,
            transform: "rotate(127.5deg)",
            transformOrigin: "50px 50px",
            transition:
              "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s",
            fillOpacity: 0,
          }}
        ></circle>
        <circle
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeWidth="8"
          style={{
            stroke: "#FFBF3E",
            strokeDasharray: "225.787px, 295.31",
            strokeDashoffset:
              (1 - (exp?.currentExp || 0) / expList[grade + 1]) * 225.787,
            transform: "rotate(127.5deg)",
            transformOrigin: "50px 50px",
            transition:
              "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s",
            fillOpacity: 0,
          }}
        ></circle>
        <circle
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeWidth="8"
          style={{
            stroke: "#FFBF3E",
            strokeDasharray: "225.787px, 295.31",
            strokeDashoffset: 233.777,
            transform: "rotate(127.5deg)",
            transformOrigin: "50px 50px",
            transition:
              "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s",
            fillOpacity: 0,
          }}
        ></circle>
      </svg>
    </div>
  );
  const toast = (
    <Dialog
      open={showToast}
      classes={{ paper: "bg-[transparent] items-center bg-none" }}
    >
      <Image
        className="scale-110"
        src="/img/exps.svg"
        width={128}
        height={128}
        alt=""
      />
      <span className="text-xl text-white mt-3 text-center">
        Day <span className="text-primary">{consecutiveDays}</span> of
        continuous check-in, earn
        <span className="text-primary mx-2">
          {weekScore[consecutiveDays - 1]}
        </span>
        points.
      </span>
    </Dialog>
  );
  
  const theme = useThemeStore((state) => state.theme);

  const retryHandler = () => {
    onRequestTimeout(false, true);
    allInitHandler();
  }

  const isFullH = !online || requestTimeoutFlag || !manualRetryFlag;

  return (
    <NavigateWrap theme="dark" isFullH={isFullH}>
      <NetworkTips />
      <div
        className={`${isFullH ? "h-full" : ""} ${loading && !user ? (theme === "dark" ? "bg-[#0A0A0A]" : "bg-white") : "bg-[#0A0A0A]"} pb-40`}
      >
        <Retry
          isOnlyDark
          requestTimeoutFlag={requestTimeoutFlag}
          retryHandler={retryHandler}
          manualRetryFlag={manualRetryFlag}
          setManualRetryFlag={setManualRetryFlag}
        >
          <InternetContext.Provider
            value={{
              onRequestTimeout: _onRequestTimeout,
            }}
          >
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center pt-24">
                <ScaleLoader />
              </div>
            ) : user ? (
              <>
                {toast}
                <div className="bg-[url('/img/exp-bg.png')] bg-cover p-4">
                  <div className="flex items-stretch justify-between py-3 px-4 border border-solid border-[#575757] rounded-lg h-[222px] bg-[linear-gradient(91deg,rgba(106,106,106,0.16)_0%,rgba(49,49,49,0.16)_100%)]">
                    <div className="flex flex-col justify-between">
                      {/* <span className="text-xl italic truncate max-w-[125px] font-bold bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] bg-clip-text text-[transparent]">
                          @{user?.username}
                        </span> */}
                      <span className="text-xl italic truncate max-w-[125px] font-bold text-[#FFD64D]">
                        @{user?.username}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[40px] font-bold  text-[#FFD64D] [text-shadow:0_0_5.5px_#F7931A]">
                          {exp?.currentExp}
                        </span>
                        <span className="text-xl font-bold text-white">
                          +{exp && exp?.currentExp - exp?.lastSettledExp}{" "}
                          {t("Exp")}
                        </span>
                        <span className="text-[#ADADAD] text-xs">
                          {t("last week")}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0">
                      {progress}
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 flex flex-col justify-end items-center">
                        <span className="text-sm text-[#D6D6D6] text-center">
                          {t("Next Exp Airdrop")}
                        </span>
                        <span
                          ref={timeSpanRef}
                          className="[text-shadow:0_0_8px_#F5F5F5] text-xl font-bold text-white whitespace-nowrap mt-2 mb-6"
                        ></span>
                        <span className="mb-1 text-[#242424] text-2xl font-extrabold italic w-[71px] h-[29px] rounded bg-[linear-gradient(289deg,#FFF_5.35%,#A4A4A4_108.88%)] flex items-center justify-center">
                          V{grade}
                        </span>
                        <span className="text-xs text-[#ADADAD]">
                          {exp?.currentExp} / {expList[grade + 1]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#ADADAD] mt-6 pb-8 border-0 border-b border-solid border-[#333333]">
                    {t("SoSo EXP will be airdropped")}
                  </div>
                </div>
                <Tabs
                  value={tabIndex}
                  onChange={(_, tabIndex) => tabChange(tabIndex)}
                  className="px-4 h-10 min-h-0 mt-4"
                  classes={{ flexContainer: "h-full" }}
                >
                  <Tab
                    label={tExp("Task")}
                    value={0}
                    className="flex-1 normal-case text-base text-[#D6D6D6] h-full min-h-0"
                    classes={{ selected: "text-primary" }}
                  />
                  <Tab
                    label={tExp("Invite")}
                    value={1}
                    className="flex-1 normal-case text-base text-[#D6D6D6] h-full min-h-0"
                    classes={{ selected: "text-primary" }}
                  />
                </Tabs>
                <div className="mt-8 px-4">
                  <div className="bg-[#242424] rounded-lg p-4">
                    <div className="text-base text-[#D9A557] font-bold mb-3">
                      {tExp("Daily check-in")}
                    </div>
                    <div className="overflow-x-auto">
                      <div className="flex gap-x-4">
                        {weeks.map(({ label, score, check }, i) => (
                          <div
                            key={i}
                            className="w-20 shrink-0 flex flex-col items-center p-3 rounded-lg bg-[#242424] border border-solid border-[#474747] overflow-hidden relative"
                          >
                            {check && (
                              <i className="absolute left-0 top-0 w-full h-full bg-black opacity-30"></i>
                            )}
                            <span className="text-xs text-[#ADADAD]">
                              {tExp(label)}
                            </span>
                            <span className="my-1">
                              {check ? (
                                <CheckAnimate />
                              ) : (
                                <Image
                                  className="scale-110"
                                  src="/img/exps.svg"
                                  width={40}
                                  height={40}
                                  alt=""
                                />
                              )}
                            </span>

                            <span
                              className={`text-base font-bold  ${
                                score > 5 ? "text-primary" : "text-white"
                              }`}
                            >
                              +{score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  {/* <div className="p-4 my-8 bg-[#141414] rounded-lg relative">
                      <div className="flex">
                        <Trophy
                          size={48}
                          className="text-white bg-[#ffffff]/[0.10] px-2 rounded"
                        />
                        <div className="ml-4">
                          <div>
                            <span className="text-base font-bold text-white">
                              {tExp("Vote to Share 100,000 EXP")}
                            </span>
                          </div>
                          <div className="text-xs text-[#ADADAD] mt-[10px]">
                            {tExp("Vote to Share 100,000 EXP Tips")}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center mt-2">
                        <Link href="/scholarship-s1-community-vote">
                          <Button className="normal-case mt-[25px] h-6 text-xs text-brand-fg-1-rest font-bold rounded bg-[rgba(255,79,32,0.20)]">
                            {tExp("To complete")}
                          </Button>
                        </Link>
                      </div>
                    </div> */}
                  <div className="p-4 my-8 bg-[#141414] rounded-lg relative">
                    {dailyFinish && (
                      <i className="absolute left-0 top-0 w-full h-full opacity-50 bg-[#141414]" />
                    )}
                    <div className="flex">
                      <Image
                        className="my-1"
                        src="/img/share.png"
                        width={48}
                        height={48}
                        alt=""
                      />
                      <div className="ml-4">
                        <div>
                          <span className="text-base font-bold text-white">
                            {tExp("Share news")}
                          </span>
                          <span className="ml-4 text-sm text-[#ADADAD]">
                            ({dailyFinish ? 1 : 0}/1)
                          </span>
                        </div>
                        <div className="text-xs text-[#ADADAD] mt-[10px]">
                          {tExp("Access any news or research")}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Image
                          src="/img/exps.svg"
                          width={20}
                          height={20}
                          alt=""
                        />
                        <span className="text-xl font-bold text-white ml-1">
                          +10
                        </span>
                      </div>
                      <Link href="/research">
                        <Button className="normal-case mt-2 h-6 text-xs text-primary font-bold rounded bg-[rgba(255,79,32,0.20)]">
                          {tExp("Go to share")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {!isTelegram && (
                    <Fragment>
                      <div className="px-4 bg-[#141414] rounded-lg">
                        <div className="py-4 border-0 border-b border-solid border-[#333333] relative">
                          {taskMap.desktop?.status === 2 && (
                            <i className="absolute left-0 top-0 w-full h-full opacity-50 bg-[#141414]" />
                          )}
                          <div className="flex">
                            <Image
                              className="my-1"
                              src="/img/desktop-1.png"
                              width={48}
                              height={48}
                              alt=""
                            />
                            <div className="ml-2">
                              <div>
                                <span className="text-base font-bold text-white">
                                  {tExp("Install Desktop App")}
                                </span>
                                <span className="ml-4 text-sm text-[#ADADAD]">
                                  ({taskMap.desktop?.status === 0 ? 0 : 1}/1)
                                </span>
                              </div>
                              <div className="text-xs text-[#ADADAD] mt-1">
                                {tExp("Click to install Desktop App to device")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image
                                src="/img/exps.svg"
                                width={20}
                                height={20}
                                alt=""
                              />
                              <span className="text-xl font-bold text-white ml-1">
                                +100
                              </span>
                            </div>
                            {taskMap.desktop?.status === 0 ? (
                              <Button
                                onClick={() => copyPcLink()}
                                className="normal-case mt-2 h-6 text-xs text-brand-fg-1-rest font-bold rounded bg-[rgba(255,79,32,0.20)]"
                              >
                                {tExp("To complete")}
                              </Button>
                            ) : taskMap.desktop?.status === 1 ? (
                              taskLoading.desktop ? (
                                <Button className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary">
                                  <CircularProgress
                                    size={12}
                                    className="text-white"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => getTaskExp(taskMap.desktop!)}
                                  startIcon={<CheckCircle size={18} />}
                                  className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary"
                                >
                                  {tExp("Get")}
                                </Button>
                              )
                            ) : taskMap.desktop?.status === 2 ? (
                              <Button className="normal-case mt-2 h-6 text-xs text-[#5C5C5C] font-bold rounded">
                                {tExp("Completed")}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        <div className="py-4 relative">
                          {taskMap.mobile?.status === 2 && (
                            <i className="absolute left-0 top-0 w-full h-full opacity-50 bg-[#141414]" />
                          )}
                          <div className="flex">
                            <Image
                              className="my-1"
                              src="/img/phone.png"
                              width={48}
                              height={48}
                              alt=""
                            />
                            <div className="ml-2">
                              <div>
                                <span className="text-base font-bold text-white">
                                  {tExp("Install Mobile App")}
                                </span>
                                <span className="ml-4 text-sm text-[#ADADAD]">
                                  ({taskMap.mobile?.status === 0 ? 0 : 1}/1)
                                </span>
                              </div>
                              <div className="text-xs text-[#ADADAD] mt-1">
                                {tExp("Click to install Mobile App to mobile")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image
                                src="/img/exps.svg"
                                width={20}
                                height={20}
                                alt=""
                              />
                              <span className="text-xl font-bold text-white ml-1">
                                +100
                              </span>
                            </div>
                            {taskMap.mobile?.status === 0 ? (
                              <Button
                                onClick={installClick}
                                className="normal-case mt-2 h-6 text-xs text-brand-fg-1-rest font-bold rounded bg-[rgba(255,79,32,0.20)]"
                              >
                                {tExp("To complete")}
                              </Button>
                            ) : taskMap.mobile?.status === 1 ? (
                              taskLoading.mobile ? (
                                <Button className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary">
                                  <CircularProgress
                                    size={12}
                                    className="text-white"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => getTaskExp(taskMap.mobile!)}
                                  startIcon={<CheckCircle size={18} />}
                                  className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary"
                                >
                                  {tExp("Get")}
                                </Button>
                              )
                            ) : taskMap.mobile?.status === 2 ? (
                              <Button className="normal-case mt-2 h-6 text-xs text-[#5C5C5C] font-bold rounded">
                                {tExp("Completed")}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 bg-[#141414] rounded-lg mt-8">
                        <div className="py-4 border-0 border-b border-solid border-[#333333] relative">
                          {taskMap.twitter?.status === 2 && (
                            <i className="absolute left-0 top-0 w-full h-full opacity-50 bg-[#141414]" />
                          )}
                          <div className="flex">
                            <Image
                              className="my-1"
                              src="/img/x.png"
                              width={48}
                              height={48}
                              alt=""
                            />
                            <div className="ml-2">
                              <div>
                                <span className="text-base font-bold text-white">
                                  {tExp("Connect Twitter")}
                                </span>
                                <span className="ml-4 text-sm text-[#ADADAD]">
                                  ({taskMap.twitter?.status === 0 ? 0 : 1}/1)
                                </span>
                              </div>
                              <div className="text-xs text-[#ADADAD] mt-1">
                                {tExp(
                                  "Connect Twitter with your  SoSoValue  account for one-click login"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Image
                                src="/img/exps.svg"
                                width={20}
                                height={20}
                                alt=""
                              />
                              <span className="text-xl font-bold text-white ml-1">
                                +50
                              </span>
                            </div>
                            {taskMap.twitter?.status === 0 ? (
                              <Button
                                onClick={twitterLoginRedirect}
                                className="normal-case mt-2 h-6 text-xs text-brand-fg-1-rest font-bold rounded bg-[rgba(255,79,32,0.20)]"
                              >
                                {tExp("To complete")}
                              </Button>
                            ) : taskMap.twitter?.status === 1 ? (
                              taskLoading.twitter ? (
                                <Button className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary">
                                  <CircularProgress
                                    size={12}
                                    className="text-white"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => getTaskExp(taskMap.twitter!)}
                                  startIcon={<CheckCircle size={18} />}
                                  className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary"
                                >
                                  {tExp("Get")}
                                </Button>
                              )
                            ) : taskMap.twitter?.status === 2 ? (
                              <Button className="normal-case mt-2 h-6 text-xs text-[#5C5C5C] font-bold rounded">
                                {tExp("Completed")}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        {!isTelegram && (
                          <div className="py-4 relative">
                            {taskMap.google?.status === 2 && (
                              <i className="absolute left-0 top-0 w-full h-full opacity-50 bg-[#141414]" />
                            )}
                            <div className="flex">
                              <Image
                                className="my-1"
                                src="/img/google.png"
                                width={48}
                                height={48}
                                alt=""
                              />
                              <div className="ml-2">
                                <div>
                                  <span className="text-base font-bold text-white">
                                    {tExp("Connect Google")}
                                  </span>
                                  <span className="ml-4 text-sm text-[#ADADAD]">
                                    ({taskMap.google?.status === 0 ? 0 : 1}/1)
                                  </span>
                                </div>
                                <div className="text-xs text-[#ADADAD] mt-1">
                                  {tExp(
                                    "Connect Google with your  SoSoValue  account for one-click login"
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center shrink-0">
                              <div className="flex items-center">
                                <Image
                                  src="/img/exps.svg"
                                  width={20}
                                  height={20}
                                  alt=""
                                />
                                <span className="text-xl font-bold text-white ml-1">
                                  +50
                                </span>
                              </div>
                              {taskMap.google?.status === 0 ? (
                                <Button
                                  onClick={googleLogin}
                                  className="normal-case mt-2 h-6 text-xs text-brand-fg-1-rest font-bold rounded bg-[rgba(255,79,32,0.20)]"
                                >
                                  {tExp("To complete")}
                                </Button>
                              ) : taskMap.google?.status === 1 ? (
                                taskLoading.google ? (
                                  <Button className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary">
                                    <CircularProgress
                                      size={12}
                                      className="text-white"
                                    />
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => getTaskExp(taskMap.google!)}
                                    startIcon={<CheckCircle size={18} />}
                                    className="normal-case mt-2 h-6 text-xs text-white font-bold rounded bg-primary"
                                  >
                                    {tExp("Get")}
                                  </Button>
                                )
                              ) : taskMap.google?.status === 2 ? (
                                <Button className="normal-case mt-2 h-6 text-xs text-[#5C5C5C] font-bold rounded">
                                  {tExp("Completed")}
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </Fragment>
                  )}
                </div>
                <div className="px-4" ref={inviteRef}>
                  <div className="text-base text-[#D9A557] font-bold mt-8">
                    {t("Invite Rewards")}
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="py-3 px-4 h-[92px] border border-solid border-[#333333] rounded flex flex-col justify-between">
                      <span className="text-sm text-[#ADADAD] whitespace-nowrap">
                        {t("Successful invitees")}
                      </span>
                      <span className="font-bold text-[32px] bg-[linear-gradient(135deg,#FFD64D_0%,#FFAD33_97.6%)] bg-clip-text text-[transparent]">
                        {user?.totalInvitations || 0}
                      </span>
                    </div>
                    <div className="py-3 px-4 h-[92px] border border-solid border-[#333333] rounded flex flex-col justify-between">
                      <span className="text-sm text-[#ADADAD] whitespace-nowrap">
                        {t("Earned exp")}
                      </span>
                      <span className="font-bold text-[32px] bg-[linear-gradient(135deg,#FFD64D_0%,#FFAD33_97.6%)] bg-clip-text text-[transparent]">
                        {exp?.totalInvitationEXP || 0}
                      </span>
                    </div>
                    <div className="py-3 px-4 h-[92px] border border-solid border-[#333333] rounded flex flex-col justify-between">
                      <span className="text-sm text-[#ADADAD] whitespace-nowrap">
                        {t("Referral Keys")}
                      </span>
                      <Button
                        onClick={copyReferralKey}
                        className="text-white text-xl justify-between px-0"
                      >
                        <span className="truncate">{user?.invitationCode}</span>
                        <Image
                          src="/img/svg/Copy-white.svg"
                          width={20}
                          height={20}
                          alt=""
                          className="ml-3 cursor-pointer"
                        />
                      </Button>
                    </div>
                    <div className="py-3 px-4 h-[92px] border border-solid border-[#333333] rounded flex flex-col justify-between">
                      <span className="text-sm text-[#ADADAD] whitespace-nowrap">
                        {t("Referral Link")}
                      </span>
                      <Button
                        onClick={copyReferralLink}
                        className="text-white text-xl justify-between px-0"
                      >
                        <span className="truncate">{referralLink.show}</span>
                        <Image
                          src="/img/svg/Copy-white.svg"
                          width={20}
                          height={20}
                          alt=""
                          className="ml-3 cursor-pointer"
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-[#ADADAD]">
                    {tExp("For each user who registers using your")}
                  </div>
                  {!user?.invitationUserId && (
                    <>
                      <div className="text-base text-[#D9A557] font-bold mt-8 mb-4">
                        {t("Accept an invitation")}
                      </div>
                      <div className="h-10 flex items-stretch gap-x-4">
                        <OutlinedInput
                          value={invitationCode}
                          onChange={onChange}
                          placeholder="Enter Referral Key"
                          className="flex-1"
                          classes={{
                            input: "text-base font-medium text-white",
                            notchedOutline: `border border-solid ${
                              isError
                                ? "border-[#DA1E28] border-[2px]"
                                : "border-[#404040]"
                            }`,
                          }}
                        />
                        <Button
                          onClick={() => bindInviter()}
                          disabled={!invitationCode}
                          classes={{ disabled: "bg-[#404040]" }}
                          className="normal-case border border-solid border-[#575757] bg-[#1A1A1A] text-base font-medium text-white px-4"
                        >
                          {t("Confirm")}
                        </Button>
                      </div>
                      {errMsg && (
                        <div
                          key={status}
                          className="text-[#DA1E28] text-xs mt-1"
                        >
                          {errMsg}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-8">
                  <ListItemButton
                    className="h-14 text-title text-sm py-0"
                    onClick={handleMenuToggle}
                  >
                    <Image
                      src="/img/svg/gear.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
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
                  <InterceptionToken>
                    <Link href="/feedback">
                      <ListItemButton className="h-14 text-title text-sm py-0">
                        <Image
                          src="/img/svg/email.svg"
                          width={24}
                          height={24}
                          alt=""
                        />
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
                  </InterceptionToken>
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
                      <Image
                        src="/img/telegram.svg"
                        width={24}
                        height={24}
                        alt=""
                      />
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
                      <Image
                        src="/img/twitter.svg"
                        width={24}
                        height={24}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="text-xs text-content text-center my-4">
                    <Link
                      href="https://alpha.sosovalue.xyz/blog/terms-of-service"
                      onClick={linkHandler}
                    >
                      {t("Terms")}
                    </Link>
                    <span className="mx-2">{t("and")}</span>
                    <Link
                      href="https://alpha.sosovalue.xyz/blog/privacy-policy"
                      onClick={linkHandler}
                    >
                      {t("Privacy policy")}
                    </Link>
                  </div>
                  <div className="text-xs text-content text-center">
                    {t("© 2024 Imagine Labs")}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center pt-24">
                <Button
                  className=" normal-case"
                  variant="contained"
                  onClick={() => authModal?.openSignupModal()}
                >
                  {t("Log In")}
                </Button>
              </div>
            )}
          </InternetContext.Provider>
        </Retry>
      </div>
    </NavigateWrap>
  );
};

export default Exp;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["research", "common", "exp"])),
      // Will be passed to the page component as props
    },
  };
}
