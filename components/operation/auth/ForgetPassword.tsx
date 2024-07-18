import { Button } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "store/UserStore";
import { checkEmailIsRegister, checkPhoneIsRegister } from "http/user";
import AuthModalLayout from "components/layout/AuthModalLayout";
import { AccountSwitcher, useAccountSwitcher } from "./accountSwitcher";
import { useTCommon } from "hooks/useTranslation";

const ForgetPassword = () => {
  const { authModal, verifyCode } = useContext(UserContext);
  const { t } = useTCommon();
  const { isAccountValid, accountValue, areaCode, actions } =
    useAccountSwitcher();

  const toVerify = () => {
    if (authModal?.showEmailTab) {
      verifyCode
        ?.sendResetPwdCode({ email: accountValue })
        .then(() => authModal?.openVerifyCode());
    } else if (authModal?.showPhoneTab) {
      verifyCode
        ?.sendResetPwdByPhoneCode({ phone: `${"+"}${areaCode}${accountValue}` })
        .then(() => authModal?.openVerifyCode());
    }
  };
  return (
    <AuthModalLayout title={t("Reset password") as string}>
      <AccountSwitcher
        rules={{
          phone: {
            async asyncValidate(value: string) {
              return checkPhoneIsRegister(
                `${encodeURIComponent("+")}${areaCode}${value}`
              ).then((res) => ({
                result: !res.success,
                msg: t(
                  "this phone is not registered with SoSoValue."
                ) as string,
              }));
            },
          },
          email: {
            async asyncValidate(value: string) {
              return checkEmailIsRegister(value).then((res) => ({
                result: !res.success,
                msg: t(
                  "This email is not registered with SoSoValue."
                ) as string,
              }));
            },
          },
        }}
        {...actions}
      />
      <Button
        onClick={toVerify}
        fullWidth
        variant="contained"
        disabled={!isAccountValid}
        classes={{ disabled: "bg-opacity-40" }}
        className="bg-primary normal-case text-title text-sm font-semibold h-10"
      >
        {t("Reset")}
      </Button>
      <Button
        onClick={() => authModal?.openLoginModal()}
        fullWidth
        variant="outlined"
        className="normal-case text-content text-sm font-semibold h-10 mt-5 border-[#404040]"
      >
        {t("Return to Log In")}
      </Button>
    </AuthModalLayout>
  );
};

export default ForgetPassword;
