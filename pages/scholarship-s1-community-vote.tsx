import {
  Avatar,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Image from "next/image";
import { ShareFat, Info, Triangle } from "@phosphor-icons/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getRewards,
  getVoteNum,
  getVotedList,
  voteRequest,
} from "http/activity";
import { UserContext } from "store/UserStore";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import { copyText, createInviteLink, getOffsetPageTop } from "helper/tools";
import useNotistack from "hooks/useNotistack";
import { Widget } from "@typeform/embed-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { getArticleDetail } from "http/home";
import { activityData } from "helper/activityData";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "components/operation/SEO";
import NavigateWrap from "components/layout/NavigateWrap";
import { House } from "@phosphor-icons/react";
import ResearchDialog from "components/operation/research/ResearchDialog";
import { getOrigin } from "helper/config";

dayjs.extend(duration);

const startTime = dayjs("2024-03-20", "YYYY-MM-DD");
const endTime = dayjs("2024-03-31", "YYYY-MM-DD");

const joinList = activityData
  .filter((item) => item.isVote)
  .sort(
    (a, b) =>
      a.name.toUpperCase().charCodeAt(0) - b.name.toUpperCase().charCodeAt(0)
  );
const recommendList = activityData
  .filter((item) => !item.isVote)
  .sort(
    (a, b) =>
      a.name.toUpperCase().charCodeAt(0) - b.name.toUpperCase().charCodeAt(0)
  );

enum ActivityStatus {
  Voting,
  Ended,
  Settled,
}

type Reward = {
  name: string;
  exp: number;
  ssc: number;
  id: string;
  userId: string;
  researcherId?: string;
  rewardType: number;
};

const TooltipAvatar = ({
  slogan,
  avatar,
}: {
  slogan: string;
  avatar: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          arrow
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="top"
          title={slogan}
        >
          <Avatar
            className="w-16 h-16"
            onClick={handleTooltipOpen}
            src={avatar}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

const Activity = () => {
  const { t } = useTranslation("activity");
  const router = useRouter();
  const { success, error } = useNotistack();
  const { user, authModal } = useContext(UserContext);
  const [activityStatus, setActivityStatus] = useState(ActivityStatus.Voting); // 0 进行中 1 已结束  2 已结算
  const isVoting = activityStatus === ActivityStatus.Voting;
  const isEnded = activityStatus === ActivityStatus.Ended;
  const isSettled = activityStatus === ActivityStatus.Settled;
  const [researcherIdMap, setResearcherIdMap] = useState<
    Record<string, { id: string; researcherId: string; userId: string }>
  >({});
  const [rankList, setRankList] = useState<Reward[]>([]);
  const [userRewardsMap, setUserRewardsMap] = useState<Record<string, Reward>>(
    {}
  );
  const [postIdVoteNumMap, setPostIdVoteNumMap] = useState<
    Record<string, number>
  >({});
  const [postId, setPostId] = useState<string>();
  const timer = useRef<number | null>(null);
  const [duration, setDuration] = useState<Duration>();
  const researchListRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLIFrameElement | null>(null);
  const ruleRef = useRef<HTMLIFrameElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const vote = async (researcherId: string) => {
    if (!isVoting) {
      return;
    }
    if (!user) {
      return authModal?.openLoginModal();
    }
    if (Object.keys(researcherIdMap).length >= 3) {
      return error(
        router.locale === "en"
          ? "Each person can cast up to three votes"
          : router.locale === "ja"
          ? "各人は最大で3票を投じることができます"
          : "每人最多投三张票哦"
      );
    }
    await voteRequest({ researcherId });
    getVotedRecord();
    success("success");
  };
  const getVotedRecord = () => {
    getVotedList().then((res) => {
      setResearcherIdMap(
        res.data.reduce<
          Record<string, { id: string; researcherId: string; userId: string }>
        >((map, item) => ((map[item.researcherId] = item), map), {})
      );
    });
  };
  const startInterval = () => {
    timer.current = window.setTimeout(() => {
      const duration = endTime.diff(dayjs());
      setDuration(dayjs.duration(endTime.diff(dayjs())));
      if (duration > 0) {
        startInterval();
      } else {
        setActivityStatus(ActivityStatus.Ended);
      }
    }, 1000);
  };
  const clearInterval = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const toVote = () => {
    scrollRef.current?.scrollTo({
      top: getOffsetPageTop(researchListRef.current),
      behavior: "smooth",
    });
  };
  const share = () => {
    const link = createInviteLink(user?.invitationCode);
    copyText(
      router.locale === "en"
        ? `SoSoValue Crypto Researcher Scholarship seeks the best research, rewarding creators immersed in the space. 
Empowering Web3 researchers, join the #SoSoValue Researcher Community Vote, and share in a 100,000 SoSo EXP airdrop.\n${link}`
        : router.locale === "zh"
        ? `SoSo研究员大赛致力于挖掘最优质的Crypto研报，激励加密领域优秀的内容创作者。
助力Web3研究员，参与 #SoSoValue 研究员大赛社区投票，瓜分 100,000 SoSo EXP 空投。\n${link}`
        : router.locale === "ja"
        ? `SoSoValue クリプト研究者奨学金は最高の研究を求め、その分野に没頭するクリエイターに報酬を与えます。
        Web3研究者を支援し、#SoSoValue 研究者コミュニティ投票に参加して、100,000 SoSo EXPのエアドロップを共有しましょう。 \n${link}`
        : `SoSo研究员大赛致力于挖掘最优质的Crypto研报，激励加密领域优秀的内容创作者。
助力Web3研究员，参与 #SoSoValue 研究员大赛社区投票，瓜分 100,000 SoSo EXP 空投。\n${link}`
    );
    success(
      router.locale === "en"
        ? "Share link copied."
        : router.locale === "zh"
        ? "分享链接已复制"
        : router.locale === "ja"
        ? "リンクをコピーしました。"
        : "分享連結已複製"
    );
  };
  const toSignup = () => {
    scrollRef.current?.scrollTo({
      top: getOffsetPageTop(formRef.current),
      behavior: "smooth",
    });
  };
  const toRuleDetail = () => {
    scrollRef.current?.scrollTo({
      top: getOffsetPageTop(ruleRef.current),
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (user) {
      getVotedRecord();
      getRewards({ pageNum: 1, pageSize: 10, userId: user.id }).then((res) => {
        setUserRewardsMap(
          (res.data.list || [])?.reduce<Record<string, Reward>>(
            (map, item) => ((map[item.rewardType] = item), map),
            {}
          )
        );
      });
    }
  }, [user]);
  useEffect(() => {
    if (dayjs().isAfter(endTime)) {
      setActivityStatus(ActivityStatus.Ended);
    } else {
      startInterval();
    }
    getRewards({ pageNum: 1, pageSize: 100, rewardType: 1 }).then((res) => {
      if (res.data.list?.length) {
        setActivityStatus(ActivityStatus.Settled);
        setRankList(res.data.list || []);
      }
    });
    getVoteNum({ issue: 1, pageNum: 1, pageSize: 100 }).then((res) => {
      setPostIdVoteNumMap(
        (res.data.list || []).reduce<Record<string, number>>(
          (map, item) => ((map[item.id] = item.votes), map),
          {}
        )
      );
    });
    return clearInterval;
  }, []);
  const sortedJoinList = useMemo(() => {
    return joinList.sort(
      (a, b) => postIdVoteNumMap[b.id] - postIdVoteNumMap[a.id]
    );
  }, [postIdVoteNumMap]);
  return (
    <div
      ref={scrollRef}
      className="bg-[url('/img/activity/bg-01.png')] pt-[63px] h-full overflow-y-auto relative"
    >
      <ResearchDialog
        selectedPost={postId}
        open={!!postId}
        onClose={() => setPostId("")}
      />
      <IconButton
        onClick={() => router.replace("/")}
        className="absolute left-2 top-2 text-xs text-sub-title normal-case bg-[#242424]"
      >
        <House size={24} />
      </IconButton>
      <SEO
        config={{
          title:
            "Vote Now: SoSoValue Crypto Researcher Scholarship Community Vote",
          twitterTitle:
            "Vote Now: SoSoValue Crypto Researcher Scholarship Community Vote",
          telegramTitle:
            "Vote Now: SoSoValue Crypto Researcher Scholarship Community Vote",
          description:
            "Participate in the SoSoValue Crypto Researcher vote! Explore top crypto articles, vote for the best, and get a chance to win from a 100,000 SoSo EXP prize pool. Pre-register for Season 2 now!",
          image: `${getOrigin()}/img/seo/scholarship-s1-community-vote.png`,
        }}
      />
      <div className="text-center">
        <Image src="/img/logo01.png" width={200} height={44} alt="" />
      </div>
      <div className="text-5xl font-bold uppercase flex flex-col justify-center items-center my-8">
        <span className="text-white whitespace-nowrap !font-ddin">
          Crypto Researcher
        </span>
        <span className="text-primary !font-ddin">{t("title1")}</span>
      </div>
      <div className="text-sm text-[#D6D6D6] text-center !font-inter px-5">
        <div className="!font-inter">{t("p1")}</div>
        <div className="!font-inter">{t("p2")}</div>
        <div className="!font-inter">{t("p3")}</div>
      </div>
      <div className="relative pt-[197px] mt-10">
        <div className="w-full h-[346px] absolute left-0 top-0 overflow-hidden flex justify-center items-start">
          <div className="bg-[url('/img/activity/bg-02.png')] bg-no-repeat w-[780px] h-full absolute left-1/2 -translate-x-1/2 top-0"></div>
        </div>
        <Button
          onClick={share}
          className="rounded-[10px] w-[118px] h-12 bg-white text-black text-base font-medium absolute left-1/2 -translate-x-1/2 -top-6 normal-case"
          endIcon={<ShareFat size={32} />}
        >
          Share
        </Button>
        <div className="relative z-10 bg-black px-4">
          {isVoting && (
            <div>
              <div>
                <div className="text-4xl font-bold text-white text-center !font-ddin">
                  {t("title2")}
                </div>
                <div
                  className="text-sm text-[#D6D6D6] text-center mt-4 !font-inter"
                  dangerouslySetInnerHTML={{
                    __html: `${t("p4")}<br/>${t("p5")}`,
                  }}
                ></div>
                <div className="flex justify-center mt-8">
                  <div className="w-[290px] h-24 rounded-xl border border-solid border-white/[0.1] bg-[rgba(255,255,255,0.05)] flex gap-x-6 justify-center items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[32px] leading-8 font-bold text-white">
                        {duration?.days()}
                      </span>
                      <span className="text-xs text-white">Days</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[32px] leading-8 font-bold text-white">
                        {duration?.hours()}
                      </span>
                      <span className="text-xs text-white">Hours</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[32px] leading-8 font-bold text-white">
                        {duration?.minutes()}
                      </span>
                      <span className="text-xs text-white">Minutes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[32px] leading-8 font-bold text-white">
                        {duration?.seconds()}
                      </span>
                      <span className="text-xs text-white">Seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[72px] p-10 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] bg-[#0D0D0D] flex flex-col items-center">
                <div className="text-2xl text-white font-bold mb-6 whitespace-nowrap">
                  {t("tab1")}
                </div>
                <Image
                  src="/img/activity/exps.svg"
                  width={80}
                  height={80}
                  alt=""
                />
                <div className="mt-[5px] text-2xl font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                  100,000 Exp
                </div>
                <div className="text-base text-white my-6">{t("tab1_txt")}</div>
                <Button
                  onClick={toVote}
                  className="bg-primary rounded h-10 text-[#FFFFFF] text-base font-bold cursor-pointer self-stretch normal-case whitespace-nowrap"
                >
                  {t("tab1_btn")}
                </Button>

                <div
                  onClick={toRuleDetail}
                  className="mt-6 text-[#D6D6D6] text-sm font-medium underline"
                >
                  {t("rule_detail")}
                </div>
              </div>
              <div className="p-10 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] bg-[#0D0D0D] mt-4 flex flex-col items-center">
                <div className="text-2xl text-white font-bold mb-6 whitespace-nowrap">
                  {t("tab2")}
                </div>
                <div className="flex items-center">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col items-center">
                      <Image
                        src="/img/activity/exps.svg"
                        width={80}
                        height={80}
                        alt=""
                      />
                      <span className="text-2xl font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                        5,000 Exp
                      </span>
                    </div>
                    <div className="mx-3 bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-2xl font-bold text-transparent bg-clip-text">
                      +
                    </div>
                    <div className="flex flex-col items-center">
                      <Image
                        src="/img/activity/ssc.png"
                        width={80}
                        height={80}
                        alt=""
                      />
                      <div className="text-2xl font-bold !font-ddin bg-[linear-gradient(95deg,#FF4F20_0%,#FF8438_100%)] text-transparent bg-clip-text">
                        $1,700 SSC
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-base text-white my-6">{t("tab2_txt")}</div>
                <Button
                  onClick={share}
                  className="bg-primary rounded h-10 text-[#FFFFFF] text-base font-bold cursor-pointer self-stretch normal-case whitespace-nowrap"
                >
                  {t("tab2_btn")}
                </Button>

                <div
                  onClick={toRuleDetail}
                  className="mt-6 text-[#D6D6D6] text-sm font-medium underline"
                >
                  {t("rule_detail")}
                </div>
              </div>
              <div className="p-10 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] bg-[#0D0D0D] mt-4 flex flex-col items-center">
                <div className="text-2xl text-white font-bold mb-6 text-center">
                  {t("tab3")}
                </div>
                <Image
                  src="/img/activity/exps.svg"
                  width={80}
                  height={80}
                  alt=""
                />
                <div className="mt-[5px] text-2xl font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                  10,000 Exp
                </div>
                <div className="text-base text-white my-6">{t("tab3_txt")}</div>
                <Button
                  onClick={toSignup}
                  className="bg-primary rounded h-10 text-[#FFFFFF] text-base font-bold cursor-pointer self-stretch normal-case whitespace-nowrap"
                >
                  {t("tab3_btn")}
                </Button>

                <div
                  onClick={toRuleDetail}
                  className="mt-6 text-[#D6D6D6] text-sm font-medium underline"
                >
                  {t("rule_detail")}
                </div>
              </div>
            </div>
          )}
          {isEnded && (
            <div>
              <div
                className="text-4xl font-bold text-white text-center !font-ddin"
                dangerouslySetInnerHTML={{ __html: t("subTitle7")! }}
              ></div>
              <div className="text-sm text-[#D6D6D6] text-center mt-4 !font-inter">
                {t("subTitle7")}
              </div>
            </div>
          )}
          {isSettled && (
            <div>
              <div className="mb-[72px]">
                <div
                  className="text-4xl text-white font-bold text-center !font-ddin"
                  dangerouslySetInnerHTML={{ __html: t("title12")! }}
                ></div>
                <div className="flex items-center justify-center mb-4 mt-2">
                  <Image
                    src="/img/activity/exps.svg"
                    width={48}
                    height={48}
                    alt=""
                  />
                  <div className="ml-0.5 text-[32px] font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                    {(userRewardsMap[1]?.exp || 0) +
                      (userRewardsMap[2]?.exp || 0) +
                      (userRewardsMap[3]?.exp || 0)}
                    Exp
                  </div>
                </div>
                <div className="text-sm text-[#D6D6D6] text-center !font-inter">
                  {t("subTitle10")}
                </div>
              </div>
              <div className="p-6 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] flex flex-col items-center mb-4">
                <div className="text-2xl font-bold text-white mb-6">
                  {t("tab1")}
                </div>
                <div className="flex items-center">
                  <Image
                    src="/img/activity/exps.svg"
                    width={32}
                    height={32}
                    alt=""
                  />
                  <div className="ml-0.5 text-2xl font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                    {userRewardsMap[2]?.exp || 0} Exp
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] flex flex-col items-center mb-4">
                <div className="text-2xl font-bold text-white mb-6">
                  {t("tab2")}
                </div>
                <div className="flex items-center">
                  <Image
                    src="/img/activity/exps.svg"
                    width={32}
                    height={32}
                    alt=""
                  />
                  <div className="ml-0.5 text-2xl font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                    {userRewardsMap[1]?.exp || 0} Exp
                  </div>
                </div>
                <div className="mx-3 bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-2xl font-bold text-transparent bg-clip-text">
                  +
                </div>
                <div className="flex items-center">
                  <Image
                    src="/img/activity/ssc.png"
                    width={32}
                    height={32}
                    alt=""
                  />
                  <div className="ml-0.5 text-2xl font-bold !font-ddin bg-[linear-gradient(95deg,#FF4F20_0%,#FF8438_100%)] text-transparent bg-clip-text">
                    ${userRewardsMap[1]?.ssc || 0} SSC
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] flex flex-col items-center mb-4">
                <div className="text-2xl font-bold text-white mb-6 text-center">
                  {t("tab3")}
                </div>
                <div className="flex items-center">
                  <Image
                    src="/img/activity/exps.svg"
                    width={32}
                    height={32}
                    alt=""
                  />
                  <div className="ml-0.5 text-2xl font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                    {userRewardsMap[3]?.exp || 0} Exp
                  </div>
                </div>
              </div>
              <div className="px-6 py-10 rounded-[10px] border border-solid border-[rgba(255,255,255,0.20)] flex flex-col items-center mb-4">
                <div className="text-2xl font-bold text-white mb-6">
                  {t("title9")}
                </div>
                <Table
                  className="min-w-0"
                  sx={{
                    "& .MuiTableCell-root": {
                      border: "none",
                      paddingTop: 1,
                      paddingBottom: 1,
                      height: 42,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-sm text-[#ADADAD]">
                        #
                      </TableCell>
                      <TableCell className="text-sm text-[#ADADAD]">
                        Researcher
                      </TableCell>
                      <TableCell
                        align="right"
                        className="text-sm text-[#ADADAD]"
                      >
                        Prize
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankList.map(({ exp, ssc, name }, i) => (
                      <TableRow key={i}>
                        <TableCell
                          className={`${
                            [
                              "text-primary",
                              "text-[#FF9970]",
                              "text-[#FFD1B8]",
                              "text-[#FFE3D9]",
                              "text-[#FFF9F5]",
                              "text-[#D6D6D6]",
                            ][i]
                          } text-sm font-bold`}
                        >
                          {i + 1}
                        </TableCell>
                        <TableCell className="text-sm font-bold text-[#D6D6D6]">
                          {name}
                        </TableCell>
                        <TableCell align="right">
                          <div className="flex flex-col justify-center items-end h-[42px]">
                            <div className="flex items-center">
                              <Image
                                src="/img/activity/exps.svg"
                                width={20}
                                height={20}
                                alt=""
                              />
                              <span className="text-base font-bold !font-ddin bg-[linear-gradient(129deg,#FFD64D_0%,#FFAD33_91.25%)] text-transparent bg-clip-text">
                                {exp} Exp
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Image
                                src="/img/activity/ssc.png"
                                width={20}
                                height={20}
                                alt=""
                              />
                              <div className="text-base font-bold !font-ddin bg-[linear-gradient(95deg,#FF4F20_0%,#FF8438_100%)] text-transparent bg-clip-text">
                                ${ssc} SSC
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="mt-[128px]">
            <div
              ref={researchListRef}
              className="text-[32px] font-bold font-ddin text-white text-center"
            >
              {t("title10")}
              {/* <Info className="ml-3" /> */}
            </div>
            <div className="mt-16">
              {sortedJoinList.map((item, i) => (
                <div
                  key={i}
                  className="border-0 border-b last:border-b-0 border-solid border-[#393939] pb-6 mb-6 px-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TooltipAvatar
                        avatar={`/img/activity/avatar/${item.name}.png`}
                        slogan={
                          router.locale === "en" ? item.sloganEN : item.sloganZH
                        }
                      />
                      <span className="text-sm font-bold text-[#D6D6D6] ml-3">
                        {item.name}
                      </span>
                    </div>
                    {researcherIdMap[item.id] ? (
                      <Button
                        className="px-3 h-8 bg-primary text-white normal-case"
                        startIcon={<Triangle weight="fill" />}
                      >
                        {isSettled ? postIdVoteNumMap[item.id] : t("voted")}
                      </Button>
                    ) : (
                      <Button
                        className="px-3 h-8 border border-solid border-primary text-primary normal-case"
                        startIcon={<Triangle />}
                        onClick={() => vote(item.id)}
                      >
                        {isSettled ? postIdVoteNumMap[item.id] : t("vote")}
                      </Button>
                    )}
                  </div>
                  <div onClick={() => setPostId(item.id)}>
                    <div className="mt-4 mb-2 text-base text-white font-bold">
                      {router.locale === "en"
                        ? item.titleEN
                        : router.locale === "zh"
                        ? item.titleZH
                        : item.titleTC}
                    </div>
                    <div className="text-sm text-[#D6D6D6] line-clamp-5">
                      {router.locale === "en" ? item.contentEN : item.contentZH}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="mr-3 rounded-3xl text-xs cursor-pointer font-bold px-2 py-0.5 text-[#C2C2C2] bg-[#343434]/[.8] whitespace-nowrap">
                      #{item.sector}
                    </span>
                    {item.currency.map((currency) => (
                      <Link
                        href={`/trade/${currency}`}
                        key={currency}
                        className="mr-1 rounded-3xl text-xs px-2 py-0.5  cursor-pointer text-[#C2C2C2] border border-solid border-[#404040] whitespace-nowrap no-underline"
                      >
                        {currency.split("-")[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16">
            <div className="text-[32px] font-bold font-ddin text-white text-center">
              {t("title11")}
            </div>
            <div className="text-xs text-[#D6D6D6] text-center mt-4">
              {t("subTitle9")}
            </div>
            <div className="mt-16">
              {recommendList.map((item, i) => (
                <div
                  key={i}
                  className="border-0 border-b last:border-b-0 border-solid border-[#393939] pb-6 mb-6 px-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TooltipAvatar
                        avatar={`/img/activity/avatar/${item.name}.png`}
                        slogan={
                          router.locale === "en" ? item.sloganEN : item.sloganZH
                        }
                      />
                      <span className="text-sm font-bold text-[#D6D6D6] ml-3">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      item.isToSrc
                        ? window.open(item.sourceLink)
                        : setPostId(item.id)
                    }
                  >
                    <div className="mt-4 mb-2 text-base text-white font-bold">
                      {router.locale === "en"
                        ? item.titleEN
                        : router.locale === "zh"
                        ? item.titleZH
                        : item.titleTC}
                    </div>
                    <div className="text-sm text-[#D6D6D6] line-clamp-5">
                      {router.locale === "en" ? item.contentEN : item.contentZH}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="mr-3 rounded-3xl text-xs cursor-pointer font-bold px-2 py-0.5 text-[#C2C2C2] bg-[#343434]/[.8] whitespace-nowrap">
                      #{item.sector}
                    </span>
                    {item.currency.map((currency) => (
                      <Link
                        href={`/trade/${currency}`}
                        key={currency}
                        className="mr-1 rounded-3xl text-xs px-2 py-0.5  cursor-pointer text-[#C2C2C2] border border-solid border-[#404040] whitespace-nowrap no-underline"
                      >
                        {currency.split("-")[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isVoting && (
            <div ref={formRef}>
              <Widget
                id="am0BR8GZ"
                autoResize
                className="rounded-lg z-20"
                hidden={{
                  username: user?.username || "",
                  user_id: user?.id || "",
                }}
              />
            </div>
          )}
          <div ref={ruleRef} className="mt-16 pb-[128px]">
            <div className="text-xl font-bold text-white text-center">
              {t("title6")}
            </div>
            <ul className="text-[#ADADAD] text-sm mb-4 pl-4">
              <li>{t("t6_p1")}</li>
              <li>{t("t6_p2")}</li>
              <li>{t("t6_p3")}</li>
            </ul>
            <div className="text-[#ADADAD] text-sm pl-4">{t("t6_p4")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "activity",
        "research",
      ])),
      // Will be passed to the page component as props
    },
  };
}
