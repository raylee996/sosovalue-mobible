import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { registerForEmail, advertisement, waitListForEmail } from "http/user";
import useNotistack from "hooks/useNotistack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import useDimensionDict from "hooks/operation/useDimensionDict";
import Regex from "helper/regex";
import { useDebounce, useUpdateEffect } from "ahooks";
import { getLink } from "helper/config";
const SignupComponent = () => {
  const { advertisementConfig } = useDimensionDict({ withAll: false });
  const [code, setCode] = React.useState(0);
  const [msg, setMsg] = React.useState("");
  const [typeStatus, setTypeStatus] = React.useState(0);
  // 0:登录，1:注册，2:忘记密码 3:邮件确认 4:重置密码提示 5:点击链接后 6:快捷登录
  const [status, setStatus] = React.useState(0);
  const { success, error } = useNotistack();
  const [email, setEmail] = React.useState("");
  const [type, setType] = React.useState();
  const [emailStatus, setEmailStatus] = React.useState(0);
  const debouncedUsername = useDebounce(email, { wait: 500 });
  //邮箱注册
  const commitAdvertisement = async () => {
    const param = {
      type,
      email,
    };
    const res = await advertisement(param);
    if (res.code == 0) {
      success(`Success`);
      setEmail("");
      setEmailStatus(0);
      // const params = {
      //   email,
      //   link:getLink()
      // }
      // await waitListForEmail(params)
    } else {
      error(res.msg);
    }
  };
  const checkEmail = () => {
    if (debouncedUsername.length == 0) {
      setEmailStatus(0);
      return false;
    }
    if (Regex.email.test(debouncedUsername)) {
      setEmailStatus(1);
      return false;
    }
    if (!Regex.email.test(debouncedUsername)) {
      setEmailStatus(2);
      return false;
    }
  };
  useUpdateEffect(() => {
    checkEmail();
  }, [debouncedUsername]);

  return (
    <div>
      <div className="mt-4">
        <div className="text-xs text-[#808080] py-4">
          SoSoValue Alpha Launch reached 500 Registrations. We truly value our
          first users and want to follow up closely with everyone. Please join
          the waitlist from now on.
        </div>
        <div className="mb-2 text-xs text-[#C2C2C2]">Email*</div>
        <div className="flex item-center relative mb-4">
          <TextField
            variant="outlined"
            placeholder=""
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            autoComplete="off"
            InputProps={{
              className:
                "text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer",
              classes: {
                notchedOutline: "border-1 border-[#404040]",
                input: "hide-scrollbar",
              },
            }}
          />
          {emailStatus == 1 && (
            <Image
              src="/img/svg/Success.svg"
              alt=""
              width={16}
              height={16}
              className="absolute cursor-pointer right-4 top-2"
            />
          )}
          {emailStatus == 2 && (
            <Image
              src="/img/svg/Error.svg"
              alt=""
              width={16}
              height={16}
              className="absolute cursor-pointer right-4 top-2"
            />
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="h-4 flex items-center relative flex justify-center">
          <div className="h-0.5 w-full bg-[#343434] absolute"></div>
          <div className="h-3 w-16 bg-[#0D0D0D] text-[#808080] text-xs relative z-10 text-center">
            Optional
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs text-[#C2C2C2] mb-1">Type</div>
        <div className="mb-4 h-[176px]">
          <FormControl className="w-full">
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              classes={{
                root: "text-[#C2C2C2] text-base grid grid-cols-2 gap-4",
              }}
            >
              {advertisementConfig &&
                advertisementConfig.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={
                        <Radio
                          classes={{
                            root: `${index === 3 ? "mr-8" : ""} text-[#C2C2C2]`,
                            checked: "text-[#FF4F20]",
                          }}
                        />
                      }
                      label={item.label}
                      classes={{
                        root: "bg-[#6A6A6A]/[.16] text-base rounded grid-cols-1 w-full m-0 p-4 text-center",
                      }}
                      onChange={(e: any) => setType(e.target.value)}
                    />
                  );
                })}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div>
        <Button
          disabled={emailStatus !== 1}
          onClick={commitAdvertisement}
          className={`w-full h-[34px] rounded text-sm mx-0 normal-case bg-[#C14423] text-[#C2C2C2]`}
        >
          Join Waitlist
        </Button>
      </div>
    </div>
  );
};

export default SignupComponent;
