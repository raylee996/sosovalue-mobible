import React, { useEffect, useState } from "react";
import {
  At,
  Envelope,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button, TextField } from "@mui/material";
import Image from "next/image";

import Regex from "helper/regex";
import { changeSignUp, getSignResult, SignUp } from "http/activity";
import { useDebounceFn } from "ahooks";
import useNotistack from "hooks/useNotistack";
type Props = {
  changeStatus: (status: number) => void;
};
const Contribute = ({ changeStatus }: Props) => {
  const [data, setData] = useState<any>();
  const [emailError, setEmailError] = useState<string>("");
  const [twitterError, setTwitterError] = useState<string>("");
  const [email, setEmail] = useState<string>(data?.email);
  const [twitter, setTwitter] = useState<string>(data?.twitter);
  const { error, success } = useNotistack();
  const [link, setLink] = useState<string>(data?.articleUrl);
  const getUrlList = (text: string) => {
    const regex = /\bhttps?:\/\/[\w\-\.]+\.[a-z]{2,}(\/\S*)?\b/g;
    let urls = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      urls.push(match[0]); // 添加匹配到的 URL 到数组
    }

    return urls;
  };
  const getSignUp = async () => {
    const res = await getSignResult();
    setData(res.data);
    setEmail(res.data?.email);
    setTwitter(res.data?.twitter);
    setLink(res.data?.articleUrl);
  };

  useEffect(() => {
    getSignUp();
  }, []);
  const validateTheEmail = (email: any) => {
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

  const submit = async () => {
    if (!(!emailError && email && !twitterError && twitter && link)) {
      error("Please fill in the required fields");
      return;
    }
    const params = {
      email: email.trim(),
      twitter: twitter.trim(),
      articleUrl: link,
    };
    if (data) {
      const res = await changeSignUp({ ...params, id: data?.id });
      if (res.data) {
        success("Success");
        changeStatus(1);
      }
    } else {
      const res = await SignUp(params);
      if (res.data) {
        success("Success");
        changeStatus(1);
      }
    }
  };
  const { run: resize } = useDebounceFn(
    () => {
      submit();
    },
    { wait: 500 }
  );
  return (
    <div className="p-8">
      <div className="pb-8 relative">
        <div className="h-[24px] leading-6 text-base text-[#0A0A0A] mb-3">
          Email<span className="text-base text-[#DA2E21]">*</span>
        </div>
        <div className="border border-solid border-[#E5E5E5] rounded-lg px-6 flex items-center justify-between relative">
          <div className="flex items-center">
            <Envelope size={24} className="text-[#525252]" />
            <TextField
              variant="outlined"
              placeholder=""
              size="small"
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateTheEmail(e.target.value);
              }}
              autoComplete="off"
              InputProps={{
                autoComplete: "new-password",
                placeholder: "Enter your email address",
                className:
                  "text-[#525252] rounded-lg h-12 leading-8 text-base p-0 cursor-pointer",
                classes: {
                  notchedOutline: "border-0 border-neutral-stroke-1-rest",
                  input: "hide-scrollbar",
                },
              }}
            />
          </div>
          {!emailError && email && (
            <CheckCircle size={24} className="text-[#089554]" />
          )}
          {emailError && email && (
            <WarningCircle size={24} className="text-[#DA2E21]" />
          )}
        </div>
        {emailError && (
          <div className="absolute left-0 bottom-1 h-[24px] text-base text-[#525252]">
            {emailError}
          </div>
        )}
      </div>
      <div className="pb-8 relative">
        <div className="h-[24px] leading-6 text-base text-[#0A0A0A] mb-3">
          Twitter<span className="text-base text-[#DA2E21]">*</span>
        </div>
        <div className="border border-solid border-[#E5E5E5] rounded-lg px-6 flex items-center justify-between">
          <div className="flex items-center">
            <At size={24} className="text-[#525252]" />
            <TextField
              variant="outlined"
              placeholder=""
              size="small"
              fullWidth
              value={twitter}
              onChange={(e) => {
                setTwitter(e.target.value);
                validateTwitter(e.target.value);
              }}
              autoComplete="off"
              InputProps={{
                autoComplete: "new-password",
                placeholder: "Enter your Twitter handle",
                className:
                  "text-[#525252] rounded-lg h-12 leading-8 text-base p-0 cursor-pointer",
                classes: {
                  notchedOutline: "border-0 border-neutral-stroke-1-rest",
                  input: "hide-scrollbar",
                },
              }}
            />
          </div>

          {!twitterError && twitter && (
            <CheckCircle size={24} className="text-[#089554]" />
          )}
          {twitterError && email && (
            <WarningCircle size={24} className="text-[#DA2E21]" />
          )}
        </div>
        {twitterError && (
          <div className="absolute left-0 bottom-1 h-[24px] text-base text-[#525252]">
            {twitterError}
          </div>
        )}
      </div>
      <div className="mb-8">
        <div className="h-[24px] leading-6 text-base text-[#0A0A0A] mb-3">
          Previous Research Links
          <span className="text-base text-[#DA2E21]">*</span>
        </div>
        <div className="border border-solid border-[#E5E5E5] rounded-lg px-6 py-2">
          <TextField
            variant="outlined"
            placeholder=""
            size="small"
            multiline
            fullWidth
            rows={5}
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
            autoComplete="off"
            InputProps={{
              autoComplete: "new-password",
              placeholder:
                "Enter your original research links, up to 5 pieces.",
              className:
                "text-[#525252] rounded-lg h-[110px] leading-[20px] p-1 text-base cursor-pointer",
              classes: {
                notchedOutline: "border-0 border-neutral-stroke-1-rest",
                input: "hide-scrollbar",
              },
            }}
          />
        </div>
      </div>
      <Button
        className={`h-[44px] text-[#FFF] normal-case text-base font-bold rounded-lg ${
          !emailError && email && !twitterError && twitter && link
            ? "bg-[#FF4F20]"
            : "bg-[#FFB39F]"
        }  px-5`}
        onClick={resize}
      >
        Submit
      </Button>
    </div>
  );
};

export default Contribute;
