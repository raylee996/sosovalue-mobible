import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import AuthInputField, {
  AuthHandle,
  type AuthInputFieldProps,
} from "./AuthInputField";
import { useContext, useEffect } from "react";
import { UserContext } from "store/UserStore";

type Props = Partial<Omit<AuthInputFieldProps, "startAdornment">> & {
  areaCode?: string;
  onAreaCodeChange?: (code: string) => void;
  authRef?: React.RefObject<AuthHandle>;
};
const NossrAreaCodeSelector = dynamic(
  () => import("components/base/areaCodeSelector"),
  {
    ssr: false,
  }
);

const Phone = (props: Props) => {
  const { t } = useTranslation("common");
  const { geoData } = useContext(UserContext);
  const {
    rules,
    ref,
    labelText,
    className,
    onAreaCodeChange,
    areaCode,
    ...rest
  } = props;

  useEffect(() => {
    const areaCOde = geoData?.phoneAreaCode === "86" ? "852" : geoData?.phoneAreaCode
    areaCOde && onAreaCodeChange?.(areaCOde)
  }, [geoData])


  return (
    <AuthInputField
      ref={props.authRef}
      labelText={t("Phone")}
      // TODO：需要国际化
      placeholder={t("Enter phone") as string}
      startAdornment={
        <NossrAreaCodeSelector
          hasRightBorder
          defaultValue="1"
          value={areaCode}
          onChange={({ areaCode }) => onAreaCodeChange?.(areaCode)}
        />
      }
      className={className}
      onlyNumber
      rules={{
        ...rules,
      }}
      {...rest}
    />
  );
};

export default Phone;
