import React, { FC, useContext, ReactNode } from "react";
import Image from "next/image";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Link from "next/link";
import { getAudio } from "http/home";
import { useRouter } from "next/router";
type Props = {
  showAudio: boolean;
  changeAudio: (val: boolean) => void;
};
const Audio = ({ showAudio, changeAudio }: Props) => {
  const router = useRouter();
  const [audioData, setAudioData] = React.useState<any>();
  const audioRef = React.useRef<any>(null);

  const [lang, setLang] = React.useState(router.locale === "en" ? true : false);
  React.useEffect(() => {
    // getAudio({ keyName: "banner" }).then((res) => {
    //   setAudioData(JSON.parse(res.data[0].content) || null);
    //   console.log(JSON.parse(res.data[0].content));
    // });
  }, []);
  React.useEffect(() => {
    setLang(router.locale === "en" ? true : false);
  }, [router.locale]);
  return (
    <div
      className={`fixed ${
        showAudio ? "left-2 right-2" : "w-[54px] right-2"
      }  bottom-[82px] h-[38px]`}
    >
      <div className="w-full h-full relative">
        <div
          className={`absolute left-2 right-2 top-0  ${
            showAudio ? "opacity-1 z-10" : "opacity-0 z-0"
          }  shadow-[0_0px_8px_0_rgba(0,0,0,0.36)] bg-[#333] rounded-lg h-[38px] flex items-center  text-white`}
        >
          {/* {audioData && audioData?.choice === 1 && ( */}
          <>
            {/* <AudioPlayer src="https://nftdrop-pad.s3.ap-southeast-1.amazonaws.com/nftdrop-pad/2023/11/11/11ac43f4-c70b-4fe7-a11a-d78f9e32b854.webp" layout="horizontal-reverse" /> */}

            <Image
              src="/img/audio/MinusCircle.svg"
              alt=""
              width={20}
              height={20}
              className="absolute -right-2 -top-2 cursor-pointer"
              onClick={() => changeAudio(false)}
            />
            <Image
              src="/img/layout/broadcast-red.png"
              alt=""
              width={54}
              height={54}
              className="absolute left-0 bottom-0 ml-1"
              onClick={() =>
                audioRef.current && audioRef.current?.audio?.current.pause()
              }
            />
            <div className="pl-[70px] pr-[80px] w-full" id="audio">
              <AudioPlayer
                // src="https://nftdrop-pad.s3.ap-southeast-1.amazonaws.com/nftdrop-pad/2024/02/20/6f6154d4-7c58-4b5b-8c4d-d9d385843b62.null"
                src="https://nftdrop-pad.s3.ap-southeast-1.amazonaws.com/nftdrop-pad/2024/02/21/8446b466-6911-47ef-9c96-a95c8d69848c.null"
                // src={
                //   lang ? audioData?.enAudio?.enLink : audioData?.cnAudio?.cnLink
                // }
                layout="horizontal-reverse"
                style={{
                  //maxWidth: '450px',
                  background: "transparent",
                }}
                ref={audioRef}
                autoPlay={false}
                autoPlayAfterSrcChange={false}
                progressJumpSteps={{
                  forward: 15000,
                  backward: 15000,
                }}
                customControlsSection={[
                  RHAP_UI.MAIN_CONTROLS,
                  <div
                    key={audioData?.enAudio?.enTitle}
                    className="text-[#F4F4F4] w-full text-xs truncate leading-10"
                  >
                    {lang
                      ? audioData?.enAudio?.enTitle
                      : audioData?.cnAudio?.cnTitle}
                  </div>,
                  RHAP_UI.CURRENT_TIME,
                ]}
                customProgressBarSection={[]}
                customAdditionalControls={[]}
                customIcons={{
                  play: (
                    <Image
                      src="/img/audio/Play.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="align-top mt-3"
                    />
                  ),
                  pause: (
                    <Image
                      src="/img/audio/Pause.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="align-top mt-3"
                    />
                  ),
                  forward: (
                    <Image
                      src="/img/audio/forward.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="align-top mt-2.5"
                    />
                  ),
                  rewind: (
                    <Image
                      src="/img/audio/back.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="align-top mt-2.5"
                    />
                  ),
                  volume: (
                    <Image
                      src="/img/audio/SpeakerSimpleHigh.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="align-top mt-[5px]"
                    />
                  ),
                  volumeMute: (
                    <Image
                      src="/img/audio/SpeakerSimpleX.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="align-top mt-[5px]"
                    />
                  ),
                }}
              />
            </div>
            {/* <div className='text-[#F4F4F4] text-xs mr-3 max-w-[104px] truncate'>{lang ? audioData?.enAudio?.enTitle : audioData?.cnAudio?.cnTitle}</div> */}
          </>
          {/* )} */}
          {/* {audioData && audioData?.choice !== 1 && (
            <>
              <Image
                src="/img/broadcast-blue.png"
                alt=""
                width={54}
                height={54}
                className="absolute left-0 bottom-0 ml-1 cursor-pointer"
                onClick={() => changeAudio(false)}
              />

              <div className="text-[#F4F4F4] text-xs mr-3 pl-[65px] pr-[18px] truncate leading-10">
                {audioData?.txtLink?.title}
              </div>

              {audioData?.txtLink?.mobileLink && (
                <Link
                  href={
                    audioData?.txtLink?.mobileLink
                      ? audioData?.txtLink?.mobileLink
                      : ""
                  }
                  className="no-underline text-[#F4F4F4] text-xs"
                >
                  <Image
                    src="/img/svg/ArrowSquareOut.svg"
                    width={16}
                    height={16}
                    alt=""
                    className="cursor-pointer absolute right-1 top-3"
                  />
                </Link>
              )}
            </>
          )} */}
        </div>

        <div
          className={`absolute left-2 right-2 top-0 ${
            !showAudio ? "opacity-1 z-10" : "opacity-0 z-0"
          } rounded-lg h-[38px] flex items-center  text-white`}
        >
          <Image
            src="/img/layout/broadcast-red.png"
            alt=""
            width={54}
            height={54}
            className="absolute right-0 bottom-0 cursor-pointer"
            onClick={() => changeAudio(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Audio;
