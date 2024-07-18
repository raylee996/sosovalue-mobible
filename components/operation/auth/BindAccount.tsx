import React, { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { checkEmailIsRegister, checkPhoneIsRegister } from "http/user";
import { UserContext } from "store/UserStore";
import usePassword from "hooks/operation/usePassword";
import Email from "./Email";
import Phone from "./Phone";
import Password from "./Password";
import AuthModalLayout from "components/layout/AuthModalLayout";
import useNotistack from "hooks/useNotistack";
import { useTCommon } from "hooks/useTranslation";
import { AuthHandle } from "./AuthInputField";

/**
 * 绑定手机、邮箱帐号组件，用于弹窗中
 */
const BindAccount = () => {
  const { t } = useTCommon();
  const [isAccountValidate, setIsAccountValidate] = useState(false);
  const { authModal, verifyCode, user } = useContext(UserContext);
  const { error } = useNotistack();
  const password = usePassword({ validate: true });
  const rePassword = usePassword({
    validate: true,
    syncValidate(value: string) {
      return {
        result: value === password.value,
        msg: t("The passwords do not match."),
      };
    },
  });
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [areaCode, setAreaCode] = useState("1");
  const isAllValidate = isAccountValidate && password.statusInfo.isValid && rePassword.statusInfo.isValid;
  const needInputPassword = !user?.email && !user?.phone;
  const authRef = useRef<AuthHandle | null>(null);

  const openVerifyCode = async () => {
    if (authModal?.showBindEmail) {
      verifyCode
        ?.sendBindEmailCode({ email: email.trim() })
        .then(() => authModal?.openVerifyCode());
    } else if (authModal?.showBindPhone) {
      verifyCode
        ?.sendBindPhoneCode({ phone: phone.trim(), countryCode: areaCode })
        .then((res) => {
          if (res.success) {
            authModal?.openVerifyCode();
          } else {
            res.msg && error(res.msg);
          }
        });
    }
  };
  const handleAreaCodeChange = (areaCode: string) => {
    authRef.current?.resetValid();
    setAreaCode(areaCode);
  };
  useEffect(() => {
    verifyCode?.setTmpPassword(Buffer.from(password.value).toString("base64"));
    verifyCode?.setReTmpPassword(Buffer.from(rePassword.value).toString("base64"));
  }, [password.value, rePassword.value]);

  return (
    <AuthModalLayout>
      {authModal?.showBindEmail ? (
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
          authRef={authRef}
          areaCode={areaCode}
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

      {isAccountValidate && needInputPassword && (
        <React.Fragment>
          <Password 
            {...password} 
            label={
              <div className="text-sm text-primary-900-White mb-2">
                {t("Password")}
              </div>
            }
          />
          <Password
            {...rePassword}
            label={
              <div className="text-sm text-primary-900-White mb-2">
                {t("Confirm Password")}
              </div>
            }
          />
        </React.Fragment>
      )}

      <Button
        onClick={openVerifyCode}
        disabled={!isAllValidate && needInputPassword}
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

export default BindAccount;
