import { IconButton, OutlinedInput } from "@mui/material";
import {
  ChangeEvent,
  KeyboardEventHandler,
  ReactNode,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import usePassword from "hooks/operation/usePassword";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";

type Props = ReturnType<typeof usePassword> & {
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

const Password = ({
  value,
  onChange,
  onKeyDown,
  label,
  className,
  inputType,
  errMsg,
  toggle,
  tipIcon,
  status,
  statusInfo: { isError, isValid, isInit },
}: Props) => {
  const [parent] = useAutoAnimate();
  const { t } = useTranslation(localeType.COMMON);
  const renderTip = () => {
    if (isError) {
      return (
        <div key={status} className="text-xs text-accent-600 mt-1">
          {errMsg}
        </div>
      );
    }
  };
  return (
    <div className={className}>
      {label || (
        <div className="text-sm text-primary-900-White mb-2">{t("Password")}</div>
      )}
      <OutlinedInput
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        type={inputType}
        autoComplete="new-password"
        fullWidth
        placeholder={t("Enter password") as string}
        className="h-10 pr-0 bg-background-primary-White-900 rounded-lg"
        classes={{
          input: "h-full py-0 text-sm text-primary-900-White px-4",
          notchedOutline: `border ${
            isError ? "border-accent-600 border" : "border-primary-100-700"
          }`,
        }}
        endAdornment={
          <div className="shrink-0 flex items-center">
            {isInit ? null : (
              <Image
                className="mx-4"
                src={isValid ? "/img/svg/Success.svg" : "/img/svg/Error.svg"}
                width={16}
                height={16}
                alt=""
              />
            )}
            <IconButton className="text-title mx-2" onClick={toggle}>
              {tipIcon}
            </IconButton>
          </div>
        }
      />
      <div ref={parent}>{renderTip()}</div>
    </div>
  );
};

export default Password;
