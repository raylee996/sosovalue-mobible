import { OutlinedInput } from "@mui/material";
import Image from "next/image";
import useEmail from "hooks/operation/useEmail";
import { ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";

type UseEmailReturnType = ReturnType<typeof useEmail>;

type Props = UseEmailReturnType & {
  renderTip?: (statusInfo: UseEmailReturnType, node: ReactNode) => ReactNode;
};

const Email = (props: Props) => {
  const [parent] = useAutoAnimate();
  const {
    value,
    onChange,
    label,
    className,
    renderTip,
    errMsg,
    statusInfo,
    status,
  } = props;
  const { isError, isValid, isInit } = statusInfo;
  const renderEmailTip = () => {
    if (isError) {
      return <div className="text-[#DA1E28] text-xs mt-1">{errMsg}</div>;
    }
  };
  const { t } = useTranslation(localeType.COMMON);
  const tip =
    (renderTip && renderTip(props, renderEmailTip())) || renderEmailTip();
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
  return (
    <div className={className} ref={parent}>
      {label || <div className="text-xs text-sub-title mb-1">{t("Email")}</div>}
      <OutlinedInput
        value={value}
        onChange={onChange}
        autoComplete="new-email"
        fullWidth
        placeholder={t("Enter email") as string}
        className="h-[34px] pr-0"
        classes={{
          input: "h-full py-0 text-sm text-title px-4",
          notchedOutline: `border ${
            isError ? "border-[#DA1E28] border-[2px]" : "border-[#404040]"
          }`,
        }}
        endAdornment={renderAdornment()}
      />
      <div key={status}>{tip}</div>
    </div>
  );
};

export default Email;
