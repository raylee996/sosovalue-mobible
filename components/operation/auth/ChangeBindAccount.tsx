import { KeyboardEvent, useContext, useRef, useState } from "react";
import { Button } from "@mui/material";
import { checkEmailIsRegister, checkPhoneIsRegister } from "http/user";
import { UserContext } from "store/UserStore";
import Email from "./Email";
import Phone from "./Phone";
import Password from "./Password";
import AuthModalLayout from "components/layout/AuthModalLayout";
import { useTCommon } from "hooks/useTranslation";
import { AuthHandle } from "./AuthInputField";

enum CustomStatus {
  Registed,
  UnRegisted,
}

/**
 * 换绑手机、邮箱帐号组件，用于弹窗中
 */
const ChangeBindAccount = () => {
  const { t } = useTCommon();
  const [isAccountValidate, setIsAccountValidate] = useState(false);
  const { authModal, verifyCode } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [areaCode, setAreaCode] = useState("1");
  const authRef = useRef<AuthHandle | null>(null);

  const openVerifyCode = async () => {
    if (authModal?.showChangeBindEmail) {
      verifyCode
        ?.sendAfterChangeBindEmailCode({ email: email.trim() })
        .then(() => authModal?.openVerifyCode());
    } else if (authModal?.showChangeBindPhone) {
      verifyCode
        ?.sendAfterChangeBindPhoneCode({ phone: phone.trim(), countryCode: areaCode })
        .then(() => authModal?.openVerifyCode());
    }
  };

  const handleAreaCodeChange = (areaCode: string) => {
    authRef.current?.resetValid();
    setAreaCode(areaCode);
  };

  return (
    <AuthModalLayout>
      {verifyCode?.verifyInfo?.params?.email ? (
        <Email
          onValidate={setIsAccountValidate}
          onChange={(e) => setEmail(e.target.value)}
          rules={{
            async asyncValidate(value: string) {
              return checkEmailIsRegister(value).then((res) => ({
                result: res.success,
                msg: t(
                  "This email is already registered with SoSoValue."
                ) as string,
              }));
            },
          }}
        />
      ) : (
        <Phone
          areaCode={areaCode}
          authRef={authRef}
          onValidate={setIsAccountValidate}
          onChange={(e) => setPhone(e.target.value)}
          onAreaCodeChange={handleAreaCodeChange}
          rules={{
            async asyncValidate(value: string) {
              return checkPhoneIsRegister(
                `${encodeURIComponent("+")}${areaCode}${value}`
              ).then((res) => ({
                result: res.success,
                msg: t(
                  "This phone is already registered with SoSoValue."
                ) as string,
              }));
            },
          }}
        />
      )}

      <Button
        onClick={openVerifyCode}
        disabled={!isAccountValidate}
        fullWidth
        variant="contained"
        classes={{ disabled: "bg-opacity-40" }}
        className="bg-primary normal-case text-title text-sm font-semibold h-10 rounded-lg"
      >
        {t("Next")}
      </Button>
    </AuthModalLayout>
  );
};

export default ChangeBindAccount;
