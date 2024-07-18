import { ChangeEvent, ReactNode, useState } from "react";
import { useDebounceFn } from "ahooks";
import type { ValidateOptions } from "./type";

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
  onChange?: (value: string) => void;
  validate?: boolean;
  className?: string;
  label?: ReactNode;
  rules?: ValidateOptions;
  /** 验证是否通过回调 */
  onValidate?: (valid: boolean) => void;
};

/**
 * 表单下的元素属性合法性验证
 *
 * @example
 * const fieldValidator = useFieldValidate({
 * validate: true,
 *   rules: {
 *     maxLength: { value: 15, message: t("超出字符长度") },
 *     pattern: [
 *       { value: /[^^.!%+\-_@]/g, message: t("Invalid characters in email") },
 *       { value: Regex.email, message: t("Invalid email format") },
 *     ],
 *     async asyncValidate(value: string) {
 *       // ... 异步验证，需要返回Promise<ValidateResult>
 *     },
 *     syncValidate(value: string) {
 *       // ... 同步验证，需要返回ValidateResult
 *     },
 *   }
 * })
 */
const useFieldValidate = (props?: Props) => {
  const { className, label, rules, onValidate } = props || {};
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<ValidateStatus>(ValidateStatus.Init);
  const [customStatus, setCustomStatus] = useState<number>();
  const [errMsg, setErrMsg] = useState<string>();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onValueChange(value);
  };
  const onValueChange = (value: string) => {
    setValue(value);
    validate(value);
  };
  const reset = () => {
    setValue("");
    setErrMsg("");
    setStatus(ValidateStatus.Init);
    setCustomStatus(undefined);
  };
  const setResult = (res: ValidateResult, onSuccess?: () => void) => {
    if (res.result) {
      setStatus(ValidateStatus.Valid);
      setErrMsg("");
      setCustomStatus(res.customStatus);
      onSuccess?.();
    } else {
      setStatus(ValidateStatus.UserError);
      setErrMsg(res.msg);
      setCustomStatus(res.customStatus);
    }
  };
  const { run: validate } = useDebounceFn(
    (value: string) => {
      let hasErrorInSwitch = false;
      function passValid() {
        hasErrorInSwitch = false;
        setStatus(ValidateStatus.Valid);
      }
      if (props?.validate) {
        for (const ruleKey in rules) {
          if (Object.prototype.hasOwnProperty.call(rules, ruleKey)) {
            const _ruleKey = ruleKey as keyof ValidateOptions;
            let rule = rules[_ruleKey];
            if (!rules.required && value.length === 0) {
              setStatus(ValidateStatus.Init);
              setCustomStatus(undefined);
              hasErrorInSwitch = false;
              return;
            }
            switch (_ruleKey) {
              case "required":
                rule = rules[_ruleKey];
                hasErrorInSwitch = !!rule?.value && value.length === 0;
                if (hasErrorInSwitch) {
                  setErrMsg(rule!.message);
                  setStatus(ValidateStatus.Illegal);
                } else {
                  passValid();
                }
                break;
              case "maxLength":
                rule = rules[_ruleKey];
                hasErrorInSwitch = !!rule?.value && value.length > rule?.value;
                if (hasErrorInSwitch) {
                  setErrMsg(rule!.message);
                  setStatus(ValidateStatus.Illegal);
                  setCustomStatus(undefined);
                } else {
                  passValid();
                }
                break;
              case "minLength":
                rule = rules[_ruleKey];
                hasErrorInSwitch = !!rule?.value && value.length < rule?.value;
                if (hasErrorInSwitch) {
                  setErrMsg(rule!.message);
                  setStatus(ValidateStatus.Illegal);
                  setCustomStatus(undefined);
                } else {
                  passValid();
                }
                break;
              case "pattern":
                rule = rules[_ruleKey];
                if (!rule?.length) break;
                for (const patternRule of rule) {
                  hasErrorInSwitch = !patternRule.value.test(value);
                  if (hasErrorInSwitch) {
                    setErrMsg(patternRule.message);
                    setStatus(ValidateStatus.Illegal);
                    setCustomStatus(undefined);
                    break;
                  } else {
                    passValid();
                  }
                }
                break;
            }
          }
        }
      }
      onValidate?.(!hasErrorInSwitch);
      if (hasErrorInSwitch) return;
      if (rules?.syncValidate) {
        const res = rules.syncValidate(value);
        setResult(res, passValid);
        onValidate?.(res.result);
      }
      if (rules?.asyncValidate) {
        rules.asyncValidate(value).then((res) => {
          setResult(res, passValid);
          onValidate?.(res.result);
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

export default useFieldValidate;
