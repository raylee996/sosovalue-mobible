import { List, ListItemButton, OutlinedInput } from "@mui/material";
import Image from "next/image";
import useUsername from "hooks/operation/useUsername";
import { ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { cn } from "helper/cn";

type UseUsernameReturnType = ReturnType<typeof useUsername>;

type Props = UseUsernameReturnType & {
  renderTip?: (
    statusInfo: UseUsernameReturnType["statusInfo"],
    node: ReactNode
  ) => ReactNode;
  className?: string;
  label?: ReactNode;
  classes?: Common.ClassNameMap<"label">
  defaultValue?: string;
};

const Username = ({
  value,
  onChange,
  onValueChange,
  label,
  className,
  usableNames,
  errMsg,
  status,
  statusInfo: { isInit, isFormatError, isRegisted, isValid, isError },
  renderTip,
  classes,
  defaultValue,
}: Props) => {
  const [parent] = useAutoAnimate();
  const [usableList] = useAutoAnimate();
  const { t } = useTranslation(localeType.COMMON);
  const renderUsernameTip = () => (
    <div ref={parent}>
      {isError && (
        <div key={status} className="text-accent-600 text-xs mt-1">
          {errMsg}
        </div>
      )}
    </div>
  );
  const tip =
    (renderTip &&
      renderTip(
        { isInit, isFormatError, isRegisted, isValid, isError },
        renderUsernameTip()
      )) ||
    renderUsernameTip();
  return (
    <div className={className}>
      {typeof label !== undefined ? label : (
        <div className={cn("text-xs text-primary-900-White mb-1", classes?.label)}>{t("Username")}</div>
      )}
      <OutlinedInput
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        autoComplete="new-email"
        fullWidth
        placeholder={t("Enter username") as string}
        className="h-10 pr-0 bg-background-primary-White-900 rounded-lg"
        classes={{
          input: "h-full py-0 text-sm text-primary-900-White px-4",
          notchedOutline: `border ${
            isError ? "border-accent-600 border-[1px]" : "border-primary-100-700 border-[1px]"
          }`,
        }}
        endAdornment={
          <div className="shrink-0 flex items-center">
            <span className="text-content text-sm mr-4">{value.length}/18</span>
            {isInit ? null : (
              <Image
                className="mr-4"
                src={isValid ? "/img/svg/Success.svg" : "/img/svg/Error.svg"}
                width={16}
                height={16}
                alt=""
              />
            )}
          </div>
        }
      />
      {tip}
      <List className="p-0" ref={usableList}>
        {!!usableNames.length &&
          usableNames.map((name) => (
            <ListItemButton
              onClick={() => onValueChange(name)}
              key={name}
              className="text-secondary-500-300 -text-xs p-0"
            >
              {name}
            </ListItemButton>
          ))}
      </List>
    </div>
  );
};

export default Username;
