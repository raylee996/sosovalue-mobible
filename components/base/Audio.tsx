import React, {
  FC,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useMemo,
  useRef,
  SyntheticEvent,
  CSSProperties,
} from "react";
import Image from "next/image";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Link from "next/link";
import { getAudio } from "http/home";
import { useRouter } from "next/router";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useDebounceFn, useGetState } from "ahooks";
import { trackSlideAudioProgress } from "helper/track";
import { ThemeContext } from "store/ThemeStore";
import ShareDialog from "components/operation/ShareDialog";
import { INVITE_CODE_KEY, categoryConfig } from "helper/constants";
import { formatDate, isBrowser, isPwa } from "helper/tools";
import { UserContext } from "store/UserStore";
import { useTranslation } from "next-i18next";
import { QRCodeCanvas } from "qrcode.react";
import { jsonParse } from "helper/tools";
import useHoldUp from "hooks/useHoldUp";

import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import Slider from "@mui/material/Slider";

import Circle from "components/base/circle";
import Player from "components/icons/player";
import GptSvg from "components/icons/gpt.svg";
import LogoFull from "components/icons/logo/logo-xl.svg";
import ShareSvg from "components/icons/audio/share.svg";
import BackSvg from "components/icons/audio/back-10.svg";
import ForwardSvg from "components/icons/audio/forward-10.svg";
import ShareLineSvg from "components/icons/audio/share-line.svg";
import ArrowDownSvg from "components/icons/arrow-down.svg";

dayjs.extend(duration);

const Audio = () => {
  const router = useRouter();
  const isEn = router.locale === "en";
  const { selectContent } = useContext(ThemeContext);
  const { user, authModal } = useContext(UserContext);
  const [audioData, setAudioData] = useState<any>();
  const [textData, setTextData] = useState<Research.Post>();
  const audioRef = useRef<HTMLMediaElement | null>(null);
  const [audioDrawerOpen, setaudioDrawerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration, getDuration] = useGetState(0);
  const [progress, setProgress] = useState(0);
  const sliderValue = duration ? (progress / duration) * 100 : 0;
  const durationStr = useMemo(
    () => dayjs.duration(duration, "seconds").format("mm:ss"),
    [duration]
  );
  const progressStr = useMemo(
    () => dayjs.duration(progress, "seconds").format("mm:ss"),
    [progress]
  );
  const timer = useRef(-1);
  const audioSrc = useMemo(() => {
    return audioData
      ? router.locale === "tc"
        ? audioData?.zh?.audioUrl
        : audioData?.[router.locale as string]?.audioUrl
      : "";
  }, [audioData, router.locale]);
  const [rate, setRate] = useState(1);
  const [rateEl, setRateEl] = useState<null | HTMLButtonElement>(null);
  const rateMenuOpen = Boolean(rateEl);
  const openRateMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setRateEl(event.currentTarget);
  };
  const closeRateMenu = () => {
    setRateEl(null);
  };
  const onPlayRateChange = (newRate: number) => {
    audioRef.current!.playbackRate = newRate;
    if (newRate !== rate) {
      setRate(newRate);
      closeInterVal();
      startInterval((1 / newRate) * 1000);
    }
    setRateEl(null);
  };
  const onSliderChange = (event: Event, newValue: number | number[]) => {
    const currentTime = ((newValue as number) / 100) * duration;
    setProgress(currentTime);
    audioRef.current!.currentTime = currentTime;
  };
  const playPause = (e: SyntheticEvent) => {
    e.stopPropagation();
    const newValue = !isPlaying;
    setIsPlaying(newValue);
    if (newValue) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };
  const onDurationChange = () => {
    setDuration(audioRef.current!.duration);
  };
  const forward = (e: SyntheticEvent, sec = 15) => {
    e.stopPropagation();
    const newCurTime = audioRef.current!.currentTime + sec;
    const currentTime = (audioRef.current!.currentTime =
      newCurTime > duration ? duration : newCurTime);
    setProgress(currentTime);
    checkOnEnded();
  };
  const back = (e: SyntheticEvent, sec = 15) => {
    e.stopPropagation();
    const newCurTime = audioRef.current!.currentTime - sec;
    const currentTime = (audioRef.current!.currentTime =
      newCurTime < 0 ? 0 : newCurTime);
    setProgress(currentTime);
  };
  const checkOnEnded = () => {
    if (audioRef.current!.currentTime >= getDuration()) {
      onEnded();
    }
  };
  const onEnded = () => {
    setIsPlaying(false);
    closeInterVal();
  };
  const startInterval = (interval?: number) => {
    const handler = () => {
      setProgress(audioRef.current!.currentTime);
      checkOnEnded();
    };
    timer.current = window.setInterval(handler, interval || 1000);
    handler();
  };
  const closeInterVal = () => {
    window.clearInterval(timer.current);
    timer.current = -1;
  };
  const onPlay = () => {
    startInterval();
  };
  const onPause = () => {
    closeInterVal();
  };
  useEffect(() => {
    getAudio({ status: "1", pageNum: 1, pageSize: 10 }).then((res) => {
      const data = res.data?.list?.[0];
      if (!data) return;
      const { multilanguageAudio } = jsonParse(data?.content as string) || {};

      const audioData = multilanguageAudio?.reduce((acc: any, item: any) => {
        acc[item.language] = item;
        return acc;
      }, {});
      if (audioData) {
        setAudioData(audioData);
      }
      if (data) {
        setTextData(data?.informationDoVo);
      }
    });
  }, [router.locale]);
  useEffect(() => {
    if (audioSrc) {
      audioRef.current?.load();
      if (isPlaying) {
        setIsPlaying(false);
      }
    }
  }, [audioSrc]);
  const { t: tCommon } = useTranslation("common");
  const article = textData;
  const holdUp = useHoldUp();

  const sector = article?.sector &&
    article.sector.toLowerCase() != "others" &&
    article.sector != "null" && (
      <div className="mr-3 rounded-3xl text-xs cursor-pointer font-bold px-2 py-0.5 text-[#C2C2C2] bg-[#343434]/[.8] whitespace-nowrap">
        #{article?.sector}
      </div>
    );
  const matchedCurrencies =
    article?.matchedCurrencies &&
    article.matchedCurrencies.map((item: any, index: number) => {
      if (index < 3) {
        return (
          <div
            key={index}
            className="border-primary-100-700 px-2 py-0.5 mr-1 border border-solid text-xs rounded-lg whitespace-nowrap"
          >
            {item.name.toUpperCase()}
          </div>
        );
      }
    });
  const isResearch =
    article &&
    categoryConfig.news
      .concat(categoryConfig.research)
      .includes(article.category);
  const shareLink =
    isBrowser && article
      ? `${window.location.origin}${router.locale === "en" ? "" : "/" + router.locale
      }/news/${article.id}${user ? `?${INVITE_CODE_KEY}=${user.invitationCode}` : ""
      }`
      : "";
  const shareText = `${selectContent(article, "title") ||
    selectContent(article, "content").slice(0, 200)
    }\n${router.locale === "en"
      ? "Explore more key information on SoSoValue"
      : router.locale === "ja"
        ? "SoSoValueの詳細情報を見る"
        : "查看原文"
    }:\n${shareLink}`;
  const [shareOpen, setShareOpen] = useState(false);
  const title = selectContent(article, "title");
  const content =
    (article?.category === 2 || article?.category === 8) && article.isAuth === 1
      ? selectContent(article, "originalContent")
      : selectContent(article, "content");
  const shareDialogNode = (
    <ShareDialog
      open={shareOpen}
      onClose={() => setShareOpen(false)}
      shareText={shareText}
    >
      <div className="bg-hover-50-800 text-primary-900-White p-4 flex flex-col gap-4 bg-[url('/img/feeds/share-bg.png')] bg-contain bg-no-repeat">
        <div className="py-3 flex flex-col gap-3 justify-start items-center">
          <LogoFull />
          <div className="text-base font-semibold">
            Your One-Stop Crypto Investment
            <span className="text-accent-600-600"> Powerhouse</span>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-background-primary-White-900 border border-solid border-primary-100-700 flex-col justify-start items-start gap-4 flex">
          {isResearch ? (
            <div>
              <div className="mb-4 text-xl font-bold leading-loose">
                {title}
              </div>
              <div className="text-sm font-semibold leading-5">
                {article.author}
              </div>
              <div className="text-secondary-500-300 text-xs">
                {dayjs(+article.realiseTime).format("MMM DD,YYYY")}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center">
                <Avatar
                  className="w-12 h-12 mr-3"
                  src={article?.authorAvatar}
                />
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white">
                    {article?.author}
                  </span>
                  <span className="text-xs text-secondary-500-300 mt-1">
                    {article?.sourceDescription}
                  </span>
                </div>
              </div>
              <span className="text-secondary-500-300 text-xs">
                {dayjs(Number(article?.realiseTime)).format("MMM DD,YYYY")}
              </span>
            </div>
          )}
          <div className="flex items-center">
            {sector}
            {matchedCurrencies}
          </div>
          <div className="border-0 border-t border-solid border-primary-100-700 py-4">
            <div className="text-secondary-500-300 text-xs mb-4 flex items-center">
              <GptSvg className=" text-primary-800-50" />
              <span className="ml-2">{tCommon("Translated by ChatGPT")}</span>
            </div>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-4">
            <div>
              <div className="text-sm font-bold leading-6">
                {tCommon("Scan QR Code to Explore more key information")}
              </div>
              <div className="text-secondary-500-300 text-sm leading-6">
                {tCommon(
                  "One-stop financial research platform for Crypto Investors"
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-md border border-solid border-white flex items-center justify-center">
                {article && (
                  <QRCodeCanvas
                    value={shareLink}
                    size={72}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                    imageSettings={{
                      src: "/img/192x192.png",
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShareDialog>
  );
  const audioBottom = holdUp ? "bottom-[5rem]" : "bottom-[4rem]";
  return (
    <div
      className={`fixed w-full z-10 bg-background-primary-White-900 ${router.pathname === "/"
        ? `left-0 ${audioBottom}`
        : "bottom-[9999px] right-[9999px] invisible opacity-0"
        }`}
    >
      <div
        onClick={() => setaudioDrawerOpen(true)}
        className="text-secondary-500-300 border-primary-100-700 px-4 py-2 border-0 border-t border-b border-solid flex justify-start items-center"
      >
        <div className="grow inline-flex justify-start items-center">
          <Circle style={{ "--percent": sliderValue } as CSSProperties}>
            <Avatar
              sx={{ width: 20, height: 20 }}
              alt="Personal"
              src="/img/robot.png"
            />
          </Circle>
          <span
            className={`text-primary-900-White ml-2 whitespace-nowrap ${isEn ? "text-sm" : "text-xs"
              }`}
          >
            {audioData?.[router.locale as string]?.title}
          </span>
          <span className="text-xs ml-1 whitespace-nowrap">
            {progressStr} / {durationStr}
          </span>
          <ButtonBase
            onClick={() => setShareOpen(true)}
            className="p-1.5 rounded-full"
          >
            <ShareSvg />
          </ButtonBase>
        </div>
        <div className="inline-flex justify-between items-center gap-1">
          <ButtonBase
            onClick={(evt) => back(evt, 10)}
            className="p-1 text-base rounded-full"
          >
            <BackSvg />
          </ButtonBase>
          <Player
            isPlay={isPlaying}
            onClick={playPause}
            className="p-1 text-base"
          />
          <ButtonBase
            onClick={(evt) => forward(evt, 10)}
            className="p-1 text-base rounded-full"
          >
            <ForwardSvg />
          </ButtonBase>
        </div>
      </div>
      <audio
        ref={audioRef}
        preload="metadata"
        src={audioSrc}
        onDurationChange={onDurationChange}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
      {shareDialogNode}
      <Menu
        anchorEl={rateEl}
        open={rateMenuOpen}
        onClose={closeRateMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        classes={{ paper: "w-[140px]" }}
      >
        <MenuItem className="text-base" onClick={() => onPlayRateChange(1)}>
          1x
        </MenuItem>
        <MenuItem className="text-base" onClick={() => onPlayRateChange(1.5)}>
          1.5x
        </MenuItem>
        <MenuItem className="text-base" onClick={() => onPlayRateChange(2)}>
          2x
        </MenuItem>
      </Menu>
      <Drawer
        anchor="bottom"
        open={audioDrawerOpen}
        onClose={() => setaudioDrawerOpen(false)}
        classes={{
          paper:
            "h-full bg-none bg-background-primary-White-900 text-primary-900-White",
        }}
      >
        <header className="header-base text-center relative">
          <span className="h-9 inline-flex items-center">
            {audioData?.[router.locale as string]?.title}
          </span>
          <ButtonBase
            onClick={() => setaudioDrawerOpen(false)}
            className="svg-icon-base text-primary-800-50 absolute right-4 top-2"
          >
            <ArrowDownSvg />
          </ButtonBase>
        </header>
        <div className="bg-background-primary-White-900 text-primary-900-White p-5 flex-1 overflow-y-auto">
          <div className="flex flex-col justify-start items-start gap-1 mb-4">
            {article && (
              <div className="text-secondary-500-300 text-sm leading-tight">
                {dayjs(+article.realiseTime).format("MMM DD,YYYY")}
              </div>
            )}
            <div className="text-primary-900-White text-base font-bold leading-normal">
              {audioData?.[router.locale as string]?.title}
            </div>
            <div className="flex">{matchedCurrencies}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="bg-background-primary-White-900 p-4 flex flex-col gap-1 justify-start items-center">
          <div className="justify-center items-center gap-6 inline-flex">
            <ButtonBase
              onClick={openRateMenu}
              className="min-w-0 text-base font-bold"
            >
              {rate}x
            </ButtonBase>
            <ButtonBase
              onClick={(evt) => back(evt, 10)}
              className="text-xl rounded-full"
            >
              <BackSvg />
            </ButtonBase>
            <Player
              hasBg
              isPlay={isPlaying}
              onClick={playPause}
              className="text-xl"
            />
            <ButtonBase
              onClick={(evt) => forward(evt, 10)}
              className="text-xl rounded-full"
            >
              <ForwardSvg />
            </ButtonBase>
            <ButtonBase
              onClick={() => setShareOpen(true)}
              className="rounded-full"
            >
              <ShareLineSvg />
            </ButtonBase>
          </div>
          <div className="w-full text-secondary-500-300 text-sm leading-tight justify-start items-center gap-2 inline-flex">
            <span>{progressStr}</span>
            <Slider
              value={sliderValue}
              onChange={onSliderChange}
              className="inline-block w-full"
              classes={{
                thumb:
                  "w-[9px] h-[9px] bg-accent-600-600 before:hidden after:hidden",
                rail: "bg-primary-100-700",
                track: "bg-accent-600-600 border-0",
                active: "shadow-none",
              }}
            />
            <span>{durationStr}</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Audio;
