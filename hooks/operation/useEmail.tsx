import Regex from "helper/regex";
import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import { useDebounceFn } from "ahooks";
import { checkEmailIsRegister } from "http/user";
import { useTranslation } from "next-i18next";

export enum ValidateStatus {
  Init,
  Valid,
  FormatError,
  Illegal,
  UserError,
}

type ValidateResult = {
  result: boolean;
  msg?: string;
  customStatus?: number;
};

type Props = {
  value?: string;
  onChange?: (email: string) => void;
  validate?: boolean;
  className?: string;
  label?: ReactNode;
  syncValidate?: (password: string) => ValidateResult;
  asyncValidate?: (password: string) => Promise<ValidateResult>;
};

const useEmail = (props?: Props) => {
  const { className, label, syncValidate, asyncValidate } = props || {};
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<ValidateStatus>(ValidateStatus.Init);
  const [customStatus, setCustomStatus] = useState<number>();
  const [errMsg, setErrMsg] = useState<string>();
  const { t } = useTranslation("common");
  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    onValueChange(email);
  };
  const onValueChange = (email: string) => {
    setValue(email);
    validate(email);
  };
  const reset = () => {
    setValue("");
    setErrMsg("");
    setStatus(ValidateStatus.Init);
  };
  const setResult = (res: ValidateResult) => {
    if (res.result) {
      setStatus(ValidateStatus.Valid);
      setErrMsg("");
      setCustomStatus(res.customStatus);
    } else {
      setStatus(ValidateStatus.UserError);
      setErrMsg(res.msg);
      setCustomStatus(res.customStatus);
    }
  };
  const { run: validate } = useDebounceFn(
    (email: string) => {
      if (props?.validate) {
        if (email.length == 0) {
          return setStatus(ValidateStatus.Init);
        } else {
          if (/[^a-zA-Z^.%+-_@]/g.test(email)) {
            setErrMsg(t("Invalid characters in email") as string);
            setStatus(ValidateStatus.Illegal);
            setCustomStatus(undefined);
            return;
          } else if (!Regex.email.test(email)) {
            setErrMsg(t("Invalid email format") as string);
            setStatus(ValidateStatus.FormatError);
            setCustomStatus(undefined);
            return;
          } else {
            if (!asyncValidate && !syncValidate) {
              setStatus(ValidateStatus.Valid);
            }
          }
        }
      }
      if (syncValidate) {
        const res = syncValidate(email);
        setResult(res);
      }
      if (asyncValidate) {
        asyncValidate(email).then((res) => {
          setResult(res);
        });
      }
    },
    { wait: 300 }
  );
  const isInit = status === ValidateStatus.Init;
  const isUserError = status === ValidateStatus.UserError;
  const isIllegalError = status === ValidateStatus.Illegal;
  const isFormatError = status === ValidateStatus.FormatError;
  const isValid = status === ValidateStatus.Valid;
  const isError = isFormatError || isUserError || isIllegalError;
  return {
    value,
    reset,
    onChange,
    onValueChange,
    errMsg,
    status,
    className,
    label,
    customStatus,
    statusInfo: {
      isInit,
      isFormatError,
      isValid,
      isError,
      isUserError,
      isIllegalError,
    },
  };
};

export default useEmail;
