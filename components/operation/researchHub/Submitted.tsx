import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
import Link from "next/link";
import {
  ArrowSquareIn,
  ShareFat,
  ListBullets,
  Plus,
  PlusCircle,
  Question,
  PencilSimpleLine,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { copyText } from "helper/tools";
import { getPcWebsite } from "helper/config";
import TimeLine from "../researchHome/TimeLine";
import NotSubmitted from "./NotSubmitted";
import AlreadySent from "./AlreadySent";
import { getArticleList, getUserExp } from "http/activity";
import NiceModal from "@ebay/nice-modal-react";
import IntegralModal from "./IntegralModal";
import Switch from "./Switch";
import IframeModal from "../researchHome/Iframe-Modal";
enum VoteStatus {
  // 未登录
  NoLogin = "NoLogin",
  // 未投稿
  NotSubmitted = "NotSubmitted",
  // 投票结束 结算
  AlreadySent = "AlreadySent",
  // 颁奖
  Reward = "Reward",
}
const Contribute = () => {
  const { user } = useContext(UserContext);
  const { success } = useNotistack();
  const [state, setState] = useState<string>(VoteStatus.AlreadySent);
  const [list, setList] = useState<any[]>();
  const [id, setId] = useState<string>("");
  const [exp, setExp] = useState<number>();

  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const handleClickOpen = (idx: number) => {
    setOpen(true);
    const pathname =
      process.env.NEXT_PUBLIC_ENV === "production"
        ? "https://alpha.sosovalue.com/brain-battle"
        : "https://best-champagne-350425.framer.app/brain-battle";
    setUrl(`${pathname}/#${idx}`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const toastTip = () => {
    success("Research Submittion will be available on 18th Jun.");
  };
  const copyShareLink = () => {
    copyText(getPcWebsite() + "/researcher-scholarship-s2/researcher-hub");
    success("Share link copied");
  };
  const articleList = async () => {
    const { data } = await getArticleList({
      pageNum: 1,
      pageSize: 10,
    });
    setList(data);
  };
  const getExp = async () => {
    const { data } = await getUserExp();
    setExp(data.experienceVal);
  };
  useEffect(() => {
    articleList();
    getExp();
  }, []);

  return (
    <div className="bg-[#F4F4F4] overflow-hidden">
      <Button
        onClick={() => NiceModal.show(Switch)}
        className={`h-[56px] fixed left-3 bottom-3 right-3 text-[#FFF] normal-case text-[24px] font-bold z-10 rounded-lg !font-lato bg-[#FF4F20] px-6 shadow-[0_1px_2px_0_rgba(10,10,10,0.06)]`}
      >
        Create on PC
      </Button>
      <div className="pt-1 py-3 bg-[#FFF] border-0 border-b border-solid border-[#E5E5E5] px-4 flex items-center justify-between text-base text-[#0A0A0A] leading-6 !font-lato font-bold">
        <Link href="/">
          <Image
            src="/img/researcherHub/SoSoValue.svg"
            width={36}
            height={36}
            alt=""
          />
        </Link>
        Brain Battle
        <ShareFat
          size={36}
          onClick={() => {
            if (user?.invitationCode) {
              copyText(`Calling for TOP CRYPTO ANALYSTS! SoSoValue Brain Battle Ongoing! Join now 🥇🧠
👉 ${getPcWebsite()}/brain-battle?inviteCode=${user?.invitationCode}`);
            } else {
              copyText(`Calling for TOP CRYPTO ANALYSTS! SoSoValue Brain Battle Ongoing! Join now 🥇🧠
👉 ${getPcWebsite()}/brain-battle`);
            }
            success("Link copied, paste to PC to continue");
          }}
        />
      </div>
      <div className="p-3">
        <div className="overflow-x-auto whitespace-nowrap">
          <div className="w-[229px] inline-block h-[124px] bg-[linear-gradient(204deg,#FF4F20_12.32%,#FF8438_87.68%)] p-4 mr-3 rounded-2xl">
            <div className="text-base  text-[#FFF] font-bold !font-lato mb-4 leading-[19px] text-center">
              💰 Total Prize Pool
            </div>
            <div className="text-[36px] text-[#FFF] font-bold !font-ddin leading-[25px] my-4 text-center">
              $50,000+
            </div>
            <div
              onClick={() => handleClickOpen(1)}
              className="text-[10px] cursor-pointer w-[83px] h-[16px] text-[#0A0A0A] justify-center mx-auto flex items-center bg-[#fff] rounded-[42px]"
            >
              Learn More <PlusCircle size={12} className="ml-1" />
            </div>
          </div>
          <div className="w-[229px] inline-block h-[124px] bg-[linear-gradient(204deg,#FF4F20_12.32%,#FF8438_87.68%)] p-4 mr-3 rounded-2xl">
            <div className="text-base  text-[#FFF] font-bold !font-lato mb-4 leading-[19px] text-center">
              🧠️ Brain EXP Pool
            </div>
            <div className="text-[36px] text-[#FFF] font-bold !font-ddin leading-[25px] my-4 text-center">
              500,000,000+
            </div>
            <div
              onClick={() => handleClickOpen(2)}
              className="text-[10px] cursor-pointer w-[83px] h-[16px] text-[#0A0A0A] justify-center mx-auto flex items-center bg-[#fff] rounded-[42px]"
            >
              Learn More <PlusCircle size={12} className="ml-1" />
            </div>
          </div>
          <div className="w-[229px] inline-block bg-[#FEFEFE] h-[124px]  p-4 rounded-2xl relative align-top overflow-hidden">
            <div className="text-base text-[#0A0A0A] !font-lato font-bold">
              Badge Rewards
            </div>
            <div
              onClick={() => handleClickOpen(3)}
              className="text-[10px] w-[83px] cursor-pointer h-[16px] border border-solid border-[#E5E5E5] text-[#0A0A0A] justify-center mx-auto flex items-center bg-[#fff] rounded-[42px] absolute left-4 bottom-4"
            >
              Learn More <PlusCircle size={12} className="ml-1" />
            </div>
            <Image
              src="/img/researcherHub/BadgeImage.png"
              width={143}
              height={143}
              alt="Guidelines"
              className="block absolute right-[-22px] bottom-[-44px]"
            />
          </div>
        </div>
        <div className="py-4 relative bg-[#FEFFFE] my-3 rounded-lg">
          <div className="w-[319px] h-[104px]">
            <Link href="/">
              <Image
                src="/img/researcherHub/LogoContainer.png"
                width={138}
                height={30}
                alt=""
                className="absolute top-[16px] left-[16px] z-10"
              />
            </Link>
            <Image
              src="/img/researcherHub/EventContain.png"
              width={312}
              height={62}
              alt=""
              className="absolute top-[58px] left-[16px] z-10"
            />
          </div>
          <Image
            src="/img/researcherHub/kline.svg"
            width={296}
            height={148}
            alt=""
            className="absolute top-[-1px] right-[-20px]"
          />
          <div className="flex items-center mt-[38px] px-4 justify-between">
            <div className="items-center flex text-lg ">
              <Image
                src={user?.photo || "/img/researcherHub/Avatar.png"}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/img/researcherHub/Avatar.png";
                }}
                width={48}
                height={48}
                alt="logo"
              />
              <div className="mx-4">
                <div className="text-base text-[#0A0A0A] !font-lato leading-[19px] flex items-center mb-2">
                  {user?.username}
                  <Link
                    href="/personalCenter"
                    className="no-underline leading-7 !font-lato"
                  >
                    <PencilSimpleLine
                      size={16}
                      className="ml-1 text-[#737373]"
                    />
                  </Link>
                </div>
                <div
                  onClick={() => NiceModal.show(IntegralModal)}
                  className="text-2xl text-[#FF4F20] cursor-pointer !font-lato leading-[17px] font-bold flex items-center"
                >
                  {exp} <span className="ml-1">🧠</span>
                </div>
              </div>
            </div>
            <Question
              size={24}
              className="text-[#737373] cursor-pointer"
              onClick={() => NiceModal.show(IntegralModal)}
            />
          </div>
        </div>
        <div className="p-4 bg-[#FEFFFE] my-3 rounded-lg min-h-[400px] relative">
          {!!list && list.length === 0 && <NotSubmitted />}
          {list && list.length > 0 && <AlreadySent list={list} />}
        </div>
        <div className="p-4  my-3 bg-[#FEFFFE] rounded-2xl">
          <div className="text-[24px] text-[#0A0A0A] font-bold !font-lato mb-1 leading-7">
            Pick Your Battles
          </div>
          <div className="text-[16px] text-[#0A0A0A] !font-lato leading-5">
            Submit your thesis for one or multiple tracks
          </div>
          <div
            onClick={() => handleClickOpen(4)}
            className="bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)] cursor-pointer border border-solid border-[#E4E4E7] rounded-lg p-6 my-4"
          >
            <div className="flex items-center justify-between text-[20px] text-[#0A0A0A] font-medium mb-2 !font-lato leading-6">
              BTC Analysis
              <ArrowUpRight size={16} />
            </div>
            <div className="text-[40px] text-[#FF4F20] font-bold leading-[28px] !font-ddin mt-4">
              $20,000+
            </div>
          </div>
          <div
            onClick={() => handleClickOpen(5)}
            className="bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)] border border-solid border-[#E4E4E7] rounded-lg p-6 my-4"
          >
            <div className="flex items-center justify-between text-[20px] text-[#0A0A0A] font-medium mb-2 !font-lato leading-6">
              Sector Analysis
              <ArrowUpRight size={16} />
            </div>
            <div className="text-[40px] text-[#FF4F20] font-bold leading-[28px] !font-ddin mt-4">
              $15,000+
            </div>
          </div>
          <div
            onClick={() => handleClickOpen(6)}
            className="bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)] cursor-pointer border border-solid border-[#E4E4E7] rounded-lg p-6"
          >
            <div className="flex items-center justify-between text-[20px] text-[#0A0A0A] font-medium mb-2 !font-lato leading-6">
              Other Topics
              <ArrowUpRight size={16} />
            </div>
            <div className="text-[40px] text-[#FF4F20] font-bold leading-[28px] !font-ddin mt-4">
              $11,000+
            </div>
          </div>
        </div>
        <TimeLine />
        <div className="grid grid-cols-3 gap-3 my-3">
          <Link
            href="/"
            className="col-span-1 bg-[#FAFAFA] text-center no-underline cursor-pointer p-3 rounded-lg text-sm text-[#525252] !font-lato"
          >
            <Image
              src="/img/researcherHub/logo.svg"
              width={28}
              height={32}
              alt=""
              className="block mx-auto mb-3"
            />
            <div className="flex items-center h-[34px] justify-center">
              Visit SoSoValue
            </div>
          </Link>
          <Link
            href="https://twitter.com/SoSoValueCrypto"
            className="col-span-1 text-center bg-[#FAFAFA] no-underline p-3 rounded-lg text-sm text-[#525252] !font-lato"
          >
            <Image
              src="/img/researcherHub/XLogo.svg"
              width={32}
              height={32}
              alt=""
              className="block mx-auto mb-3"
            />
            <div className="flex items-center h-[34px] justify-center">
              X (Twitter)
            </div>
          </Link>
          <Link
            href="https://t.me/soso_news_bot"
            className="col-span-1 bg-[#FAFAFA] p-3 text-center no-underline rounded-lg text-sm text-[#525252] !font-lato"
          >
            <Image
              src="/img/researcherHub/TLogo.svg"
              width={32}
              height={32}
              alt=""
              className="block mx-auto mb-3"
            />
            <div className="flex items-center h-[34px] justify-center">
              Telegram Bot
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 mb-[60px]">
          <div
            onClick={() => handleClickOpen(7)}
            className="py-4 text-center cursor-pointer text-base text-[#525252] !font-lato bg-[#FEFFFE] rounded-2xl leading-[19px]"
          >
            <Image
              src="/img/researcherHub/ContestPrinciples.svg"
              width={32}
              height={40}
              alt="Guidelines"
              className="block mx-auto mb-4"
            />
            Guidelines
          </div>
          <div
            onClick={() => handleClickOpen(8)}
            className="py-4 text-center cursor-pointer text-base text-[#525252] !font-lato bg-[#FEFFFE] rounded-2xl leading-[19px]"
          >
            <Image
              src="/img/researcherHub/FAQ.svg"
              width={32}
              height={40}
              alt="FAQs"
              className="block mx-auto mb-4"
            />
            FAQ
          </div>
        </div>
      </div>
      <IframeModal open={open} onClose={handleClose} url={url} />
    </div>
  );
};

export default Contribute;
