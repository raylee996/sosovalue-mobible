import React, { PropsWithChildren, useState } from "react";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { checkEmailIsRegister, createFeedback } from "http/user";
import useNotistack from "hooks/useNotistack";
import Regex from "helper/regex";
import { UserContext } from "store/UserStore";
import IconButton from "@mui/material/IconButton";
import ArrowIcon from "components/svg/Arrow";
import { useRouter } from "next/router";
import Email from "components/operation/auth/Email";
import useEmail from "hooks/operation/useEmail";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { userAgentObj, isInStandaloneMode } from "helper/tools";

type Props = PropsWithChildren<{}>;

const Feedback = ({}: Props) => {
  const router = useRouter();
  const userStore = React.useContext(UserContext);
  const { success, error } = useNotistack();
  const [type, setType] = useState(-1);
  const email = useEmail({ validate: true });
  const [description, setDescription] = useState("");
  const [typeStatus, setTypeStatus] = React.useState(0);
  const { t } = useTranslation(localeType.COMMON);
  const create = () => {
    if (!email.value) {
      return error(t("please input email"));
    }
    if (!Regex.email.test(email.value)) {
      return error(t("email format error"));
    }
    if (!description) {
      return error(t("please input description"));
    }
    if (type === -1) {
      return error(t("please feedback category"));
    }
    const ua = userAgentObj();
    const basicInfo = `设备型号：${ua.deviceType} 系统版本：${
      ua.osName
    } 浏览器型号：${ua.browserName}${ua.browserVersion} 来源端：手机${
      isInStandaloneMode() ? "PWA" : "Web"
    }`;
    createFeedback({
      type,
      replyEmail: email.value,
      description: `${description} ${basicInfo}`,
    })
      .then((res) => {
        setType(-1);
        setTypeStatus(0);
        setDescription("");
        email.reset();
        userStore.setUserTask();
        success(t("submit successfully"));
        router.back();
      })
      .catch((res) => error(res.msg));
  };
  return (
    <div>
      <div className="flex items-center h-12 relative border-0 border-b border-solid border-primary-100-700">
        <IconButton
          onClick={() => router.back()}
          className="text-2xl text-primary-900-White"
        >
          <ArrowIcon className="rotate-90" viewBox="0 0 12 12" />
        </IconButton>
        <span className="text-lg text-primary-900-White font-black">
          {t("Feedback")}
        </span>
      </div>
      <div className="mt-4 mb-8 px-4">
        <div className="text-xs text-primary-900-White mb-2">
          {t("Feedback category")}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div
            onClick={() => setType(1)}
            className={`${
              type === 1 ? "bg-primary" : "bg-[rgba(106,106,106,0.16)]"
            } py-6 text-center text-secondary-500-300 text-base bg-[#6A6A6A]/[.16] rounded`}
          >
            <Image
              src="/img/svg/BugBeetle.svg"
              alt=""
              width={32}
              height={32}
              className="block mx-auto mb-2"
            />
            {t("Problem")}
          </div>
          <div
            onClick={() => setType(2)}
            className={`${
              type === 2 ? "bg-primary" : "bg-[rgba(106,106,106,0.16)]"
            } py-6 text-center text-secondary-500-300 text-base bg-[#6A6A6A]/[.16] rounded`}
          >
            <Image
              src="/img/svg/Lightbulb.svg"
              alt=""
              width={32}
              height={32}
              className="block mx-auto mb-2"
            />
            {t("Suggestion")}
          </div>
          <div
            onClick={() => setType(3)}
            className={`${
              type === 3 ? "bg-primary" : "bg-[rgba(106,106,106,0.16)]"
            } py-6 text-center text-secondary-500-300 text-base bg-[#6A6A6A]/[.16] rounded`}
          >
            <Image
              src="/img/svg/Question.svg"
              alt=""
              width={32}
              height={32}
              className="block mx-auto mb-2"
            />
            {t("Question")}
          </div>
        </div>
      </div>
      <div className="mb-8 px-4">
        <Email
          {...email}
          labelText={
            <span className="mb-2 text-xs text-secondary-500-300">
              {t("Email")}
              <span className="text-accent-600-600">*</span>
            </span>
          }
          className="mb-4"
        />
      </div>
      <div className="mb-8 px-4">
        <div className="mb-2 text-xs text-secondary-500-300">
          {t("Description")}
          <span className="text-accent-600-600">*</span>
        </div>
        <div className="flex relative">
          <TextField
            variant="outlined"
            placeholder=""
            size="small"
            fullWidth
            onChange={(e) => setDescription(e.target.value)}
            multiline
            autoComplete="off"
            rows={10}
            InputProps={{
              classes: {
                notchedOutline: "border-primary-100-700",
                input: "hide-scrollbar border-0  w-full p-2 h-[200px]",
              },
            }}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={create}
          className="w-[75px] h-[34px] bg-accent-600-600 rounded text-sm text-white-white mx-0 normal-case"
        >
          {t("Submit")}
        </Button>
      </div>
    </div>
  );
};

export default Feedback;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}
