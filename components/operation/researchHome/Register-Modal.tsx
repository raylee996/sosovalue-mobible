import React, { useState, useContext, useMemo, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { Drawer } from "@mui/material";
import useNotistack from "hooks/useNotistack";
import {
  At,
  Envelope,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button, TextField } from "@mui/material";
import Regex from "helper/regex";
import { SignUp } from "http/activity";
import { useDebounceFn } from "ahooks";
import { UserContext } from "store/UserStore";
import Image from "next/image";
import { trackbrainBattleRegister } from "helper/track";
import { useRouter } from "next/router";
import { getToken } from "helper/storage";

let sectors = [
  {
    id: "1",
    title: "BTC Analysis",
    subTitle: "Uncover the Bitcoin's secrets and futures possibilities.",
  },
  {
    id: "2",
    title: "Sector Analysis",
    subTitle: "Navigating the complexities of different sectors.",
  },
  {
    id: "3",
    title: "Other Topics: Tokens/Projects/Macro/Public Goods",
    subTitle: "Discover the next big crypto gems in detailed analysis.",
  },
];

const CustomCheckbox = ({ sec, onChange, checked, idx }: any) => {
  return (
    <div className="flex gap-3 items-center">
      <div
        className={`w-6 h-6 ${!checked && "rounded-lg border border-solid border-[#e5e5e5] "} shrink-0 cursor-pointer`}
        onClick={() => onChange(idx)}
      >
        {checked ? (
          <Image
            src="/img/researcherHub/Check.svg"
            alt=""
            width={24}
            height={24}
          />
        ) : null}
      </div>
      <div className="flex flex-col">
        <div className="text-[#0A0A0A] text-[13px] leading-6">{sec.title}</div>
        <div className="text-[#525252] text-xs">{sec.subTitle}</div>
      </div>
    </div>
  );
};

const RegisterDialog = ({ onChange }: { onChange: () => {} }) => {
  const router = useRouter();
  const { user, authModal } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [twitterError, setTwitterError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const { error } = useNotistack();
  let invitationCode = router.query.inviteCode as string;
  const [state, setState] = useState<boolean[]>([false, false, false]);
  const [LoginLoading, setLoginLoading] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
    // 注册成功则更新
    registerSuccess && onChange();
  };

  const handleChange = (idx: number) => {
    const newState = state;
    newState[idx] = !newState[idx];
    setState([...newState]);
  };

  const handleOpen = () => {
    if (user || getToken()) {
      setOpen(true);
    } else {
      authModal?.openSignupModal();
      setLoginLoading(true);
    }
  };

  const validateEmail = (email: any) => {
    if (email !== "" && !Regex.email.test(email)) {
      setEmailError("Incorrect email format");
    } else {
      setEmailError("");
    }
  };
  const validateTwitter = (twitter: any) => {
    if (twitter !== "" && !Regex.twitter.test(twitter)) {
      setTwitterError("Incorrect Twitter handle format");
    } else {
      setTwitterError("");
    }
  };

  const sector = useMemo(() => {
    return sectors.filter((sec, idx) => state[idx]).map((sec) => sec.id);
  }, [state]);

  const submit = async () => {
    if (!(!emailError && email && sector?.length > 0)) {
      error("Please fill in the required fields");
      return;
    }

    const params = {
      email: email.trim(),
      twitter: twitter.trim() || null,
      telegram: telegram.trim() || null,
      trackType: sector.join(","),
      userId: user?.id,
      source: 2, //签到来源; 1-pc,2-手机
    };

    const res = await SignUp(params);
    if (res.success) {
      setRegisterSuccess(true);
      trackbrainBattleRegister(
        user?.invitationCode || "",
        invitationCode || ""
      );
    } else {
      error(res.msg);
    }
  };

  const { run: handleSubmit } = useDebounceFn(
    () => {
      submit();
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (user) {
      let googleEmail = "";
      const userThirdRelationVOS = user?.userThirdRelationVOS || [];
      userThirdRelationVOS.forEach((item) => {
        if (item?.thirdpartyName === "google") {
          googleEmail = item?.email;
        }
      });
      setEmail(user?.email || googleEmail || "");
      // getRegister()
    }
    if (LoginLoading && user) {
      setTimeout(() => {
        setOpen(true);
      }, 1000);
    }
  }, [user, LoginLoading]);

  return (
    <div className="w-full px-4">
      <Button
        className="bg-[#FF4F20] w-full px-4 py-2 rounded-lg adobe-font italic text-white text-base font-bold leading-8 normal-case"
        onClick={handleOpen}
      >
        Register Now
      </Button>
      <Drawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        classes={{
          paper: "bg-neutral-bg-1-rest overflow-visible rounded-t-xl",
        }}
      >
        <div
          className={`bg-white w-8 h-8 rounded-full absolute ${registerSuccess ? "right-2 top-3" : "right-2 top-2"} flex items-center justify-center z-10 border border-solid border-[#E5E5E5]`}
          onClick={handleClose}
        >
          <X size={16} className="text-[#171717]" />
        </div>
        <div className=" bg-white rounded-t-xl border border-solid border-[#E6E6E6] w-full h-full overflow-y-auto">
          {!registerSuccess ? (
            <div className="p-4 ">
              <div className="text-center text-[#141414] text-2xl font-bold">
                Register
              </div>
              <div className="flex my-4 flex-col">
                <div className="flex-1">
                  <div className="pb-4 relative">
                    <div className="h-6 leading-6 text-base font-semibold text-[#0A0A0A] mb-2">
                      Email<span className="text-base text-[#FF4F20]">*</span>
                    </div>
                    <div className="border border-solid border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between relative">
                      <div className="flex items-center w-full">
                        <Envelope size={20} className="text-[#525252] w-auto" />
                        <TextField
                          variant="outlined"
                          placeholder=""
                          size="small"
                          fullWidth
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value);
                          }}
                          autoComplete="off"
                          InputProps={{
                            autoComplete: "new-password",
                            placeholder: "Enter your email address",
                            className:
                              "text-[#525252] rounded-lg h-10 leading-8 text-base p-0 cursor-pointer",
                            classes: {
                              notchedOutline:
                                "border-0 border-neutral-stroke-1-rest",
                              input: "hide-scrollbar",
                            },
                          }}
                        />
                      </div>
                      {!emailError && email && (
                        <CheckCircle size={20} className="text-[#089554]" />
                      )}
                      {emailError && email && (
                        <WarningCircle size={20} className="text-[#FF4F20]" />
                      )}
                    </div>
                    {emailError && (
                      <div className="absolute left-0 bottom-1 h-5 text-base text-[#FF4F20] py-1">
                        {emailError}
                      </div>
                    )}
                  </div>
                  <div className="pb-4 relative">
                    <div className="h-6 leading-6 text-base font-semibold text-[#0A0A0A] mb-2">
                      Twitter
                    </div>
                    <div className="border border-solid border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between">
                      <div className="flex items-center w-full">
                        <At size={20} className="text-[#525252]" />
                        <TextField
                          variant="outlined"
                          placeholder=""
                          size="small"
                          fullWidth
                          value={twitter}
                          onChange={(e) => {
                            setTwitter(e.target.value);
                            // validateTwitter(e.target.value);
                          }}
                          autoComplete="off"
                          InputProps={{
                            autoComplete: "new-password",
                            placeholder: "Enter your Twitter handle",
                            className:
                              "text-[#525252] rounded-lg h-10 leading-8 text-base p-0 cursor-pointer",
                            classes: {
                              notchedOutline:
                                "border-0 border-neutral-stroke-1-rest",
                              input: "hide-scrollbar",
                            },
                          }}
                        />
                      </div>

                      {/* {!twitterError && twitter && (
                      <CheckCircle size={24} className="text-[#089554]" />
                    )}
                    {twitterError && email && (
                      <WarningCircle size={24} className="text-[#FF4F20]" />
                    )} */}
                    </div>
                    {/* {twitterError && (
                    <div className="absolute left-0 bottom-1 h-6 text-base text-[#525252]">
                      {twitterError}
                    </div>
                  )} */}
                  </div>
                  <div className="pb-4 relative">
                    <div className="h-6 leading-6 text-base font-semibold text-[#0A0A0A] mb-2">
                      Telegram
                    </div>
                    <div className="border border-solid border-[#E5E5E5] rounded-lg px-4 flex items-center justify-between">
                      <div className="flex items-center w-full">
                        <At size={20} className="text-[#525252]" />
                        <TextField
                          variant="outlined"
                          placeholder=""
                          size="small"
                          fullWidth
                          value={telegram}
                          onChange={(e) => {
                            setTelegram(e.target.value);
                            // validateTwitter(e.target.value);
                          }}
                          autoComplete="off"
                          InputProps={{
                            autoComplete: "new-password",
                            placeholder: "Enter your Telegram handle",
                            className:
                              "text-[#525252] rounded-lg h-10 leading-8 text-base p-0 cursor-pointer",
                            classes: {
                              notchedOutline:
                                "border-0 border-neutral-stroke-1-rest",
                              input: "hide-scrollbar",
                            },
                          }}
                        />
                      </div>

                      {/* {!twitterError && twitter && (
                      <CheckCircle size={24} className="text-[#089554]" />
                    )}
                    {twitterError && email && (
                      <WarningCircle size={24} className="text-[#FF4F20]" />
                    )} */}
                    </div>
                    {/* {twitterError && (
                    <div className="absolute left-0 bottom-1 h-6 text-base text-[#525252]">
                      {twitterError}
                    </div>
                  )} */}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-[#0A0A0A] text-base font-semibold leading-6 mb-6">
                    Which track are you going to participate?(Multiple Choice)
                    <span className="text-base text-[#FF4F20]">*</span>
                  </div>
                  <div className="flex flex-col gap-6">
                    {sectors.map((sec, idx) => {
                      return (
                        <CustomCheckbox
                          key={sec.id + idx}
                          idx={idx}
                          sec={sec}
                          checked={state[idx]}
                          onChange={handleChange}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  className={`h-[44px] text-[#FFF] w-full normal-case text-base font-bold rounded-lg ${
                    !emailError && email && sector?.length > 0
                      ? "bg-[#FF4F20]"
                      : "bg-[#FFB39F]"
                  }  px-5`}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-full h-[200px] flex items-center justify-center">
                <Image
                  alt=""
                  src="/img/activity/s2/banner-light.png"
                  width={375}
                  height={200}
                  layout="reponsive"
                  className="w-full"
                />
              </div>
              <div className="p-6">
                <div className="text-[#141414] text-[32px] font-bold text-center my-4">
                  +3,000 Brain EXPs!
                </div>
                <div className="text-center text-[#333] text-base">
                  Awesome! You have registered successfully!
                </div>
                <div className="text-center text-[#333] text-base mb-12">
                  Keep going and win more!
                </div>
                <div className="no-underline flex justify-center">
                  <Button
                    className="normal-case py-2 px-6 rounded-lg bg-[#ff4f20] text-[#fff] text-base leading-8 font-medium"
                    onClick={handleClose}
                  >
                    Yeah!
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default RegisterDialog;
