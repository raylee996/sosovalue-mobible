import React, { ChangeEvent } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { advertisement } from "http/user";
import useNotistack from "hooks/useNotistack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Regex from "helper/regex";
import { OutlinedInput } from "@mui/material";
import Email from "./Email";
import useEmail from "hooks/operation/useEmail";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";

const Waitlist = ({
  advertisementConfig,
}: {
  advertisementConfig: { value: number | string; label: string }[];
}) => {
  const { success } = useNotistack();
  const email = useEmail({ validate: true });
  const [type, setType] = React.useState("");
  const { t } = useTranslation(localeType.COMMON);
  //邮箱注册
  const commitAdvertisement = async () => {
    const param = {
      type,
      email: email.value,
    };
    await advertisement(param);
    success(t("Success"));
    email.reset();
    setType("");
  };
  return (
    <div>
      <div className="mt-4 mb-5">
        <div className="text-xs text-[#808080] mb-8">
          {t("Registration limit tip")}
        </div>
        <Email {...email} />
      </div>
      <div className="text-content text-sm flex items-center justify-between w-full my-8">
        <i className="flex-1 h-[1px] bg-[rgb(36,36,36)]"></i>
        <span className="mx-4">{t("Option")}</span>
        <i className="flex-1 h-[1px] bg-[#242424]"></i>
      </div>
      <div>
        <div className="text-xs text-[#C2C2C2] mb-1">{t("Type")}</div>
        <div className="mb-4 h-[176px]">
          <FormControl className="w-full">
            <RadioGroup
              value={type}
              row
              name="row-radio-buttons-group"
              classes={{
                root: "text-[#C2C2C2] text-sm grid grid-cols-2 gap-4",
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
                        root: "bg-[#6A6A6A]/[.16] rounded grid-cols-1 w-full m-0 p-4 pl-[7px] text-center",
                        label: "text-sm",
                      }}
                      onChange={(e: any) => setType(e.target.value)}
                    />
                  );
                })}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <Button
        disabled={!email.statusInfo.isValid}
        onClick={commitAdvertisement}
        fullWidth
        variant="contained"
        className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-[34px]"
      >
        {t("Join Waitlist")}
      </Button>
    </div>
  );
};

export default Waitlist;
