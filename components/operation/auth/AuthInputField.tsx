import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { type InputProps, OutlinedInput } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useFieldValidate } from "hooks/operation/useFieldValidate";
import type { ValidateOptions } from "hooks/operation/useFieldValidate/type";
import dynamic from "next/dynamic";

export type UseFieldReturnType = ReturnType<typeof useFieldValidate>;
const NossrAreaCodeSelector = dynamic(
  () => import("components/base/areaCodeSelector"),
  {
    ssr: false,
  }
);

export interface AuthInputFieldProps extends InputProps {
  /** field标题 */
  labelText: React.ReactNode;
  /**
   * 输入验证规则。用与传给 useFieldValidate，返回验证结果
   */
  rules: ValidateOptions;
  /** text helper */
  renderTip?: (statusInfo: UseFieldReturnType, node: ReactNode) => ReactNode;
  /** label后缀 */
  labelSuffix?: ReactNode;
  /**
   * 是否仅允许输入数字
   * @default false
   */
  onlyNumber?: boolean;
  /**
   * 时候支持输入区号
   * @default false
   */
  showAreaCode?: boolean;
  /** field验证是否通过 */
  onValidate?: (valid: boolean) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: InputProps["type"];
}

export type AuthHandle = {
  resetValid: () => void;
};

/** 需要验证相关功能的Input */
const AuthInputField: React.ForwardRefRenderFunction<
  AuthHandle,
  AuthInputFieldProps
> = (props, ref) => {
  const {
    rules,
    renderTip,
    labelText,
    onlyNumber = false,
    showAreaCode = false,
    labelSuffix = null,
    placeholder,
    onValidate,
    onChange: onChangeProp,
    type,
    className,
    ...rest
  } = props;
  const [parent] = useAutoAnimate();
  const field = useFieldValidate({ validate: true, rules, onValidate });
  const { statusInfo, errMsg, onChange, reset, label, value, status } = field;
  const { isError, isValid, isInit } = statusInfo;
  useImperativeHandle(ref, () => ({
    resetValid: reset,
  }));
  const renderFieldTip = () => {
    if (isError) {
      return <div className="text-xs mt-1 text-accent-600">{errMsg}</div>;
    }
  };

  const tip =
    (renderTip && renderTip(field, renderFieldTip())) || renderFieldTip();
  const renderAdornment = () => {
    return isInit ? null : (
      <Image
        className="mx-4"
        src={isValid ? "/img/svg/Success.svg" : "/img/svg/Error.svg"}
        width={16}
        height={16}
        alt=""
      />
    );
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // onlyNumber为true，若不是数字，则return
    if (!/^\d*$/.test(e.target.value) && onlyNumber) return;
    onChange(e);
    onChangeProp?.(e);
  };
  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className={className} ref={parent}>
      {label || (
        <div className="flex justify-between items-center text-sm text-primary-900-White mb-2">
          {labelText}
          {labelSuffix && (
            <div className="text-secondary-500-300">{labelSuffix}</div>
          )}
        </div>
      )}
      <OutlinedInput
        value={value}
        type={type}
        onChange={handleChange}
        autoComplete="new-field"
        fullWidth
        placeholder={placeholder as string}
        className="h-10 px-0 rounded-lg bg-background-primary-White-900"
        classes={{
          input: "h-full py-0 text-sm text-primary-900-White px-4",
          notchedOutline: `border ${
            isError ? "border-accent-600 border" : "border-primary-100-700"
          }`,
        }}
        startAdornment={
          showAreaCode && (
            <NossrAreaCodeSelector hasRightBorder defaultValue="81" />
          )
        }
        endAdornment={renderAdornment()}
        {...rest}
      />
      <div key={status}>{tip}</div>
    </div>
  );
};

export default forwardRef(AuthInputField);
