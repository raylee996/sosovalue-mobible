import { Button } from "@mui/material";
import usePassword from "hooks/operation/usePassword";
import { forgotResetPasswordByPhone, resetPasswordV2 } from "http/user";
import { useContext } from "react";
import { UserContext } from "store/UserStore";
import Password from "./Password";
import useNotistack from "hooks/useNotistack";
import AuthModalLayout from "components/layout/AuthModalLayout";
import { useTCommon } from "hooks/useTranslation";

const ResetPwd = ({ token }: { token: string }) => {
  const { success, error } = useNotistack();
  const { authModal } = useContext(UserContext);
  const { t } = useTCommon();
  const password = usePassword({ validate: true });
  const rePassword = usePassword({
    validate: false,
    syncValidate(value: string) {
      return {
        result: value === password.value,
        msg: "The passwords do not match.",
      };
    },
  });
  const resetPwd = () => {
    const _password = Buffer.from(password.value).toString("base64");
    const _rePassword = Buffer.from(rePassword.value).toString("base64")
    if (authModal?.showPhoneTab) {
      forgotResetPasswordByPhone({
        password: _password,
        rePassword: _rePassword,
        token,
      }).then(() => {
        authModal?.openLoginModal();
        success(t("success"));
      }).catch(err => {
        err.msg && error(err.msg)
      })
    } else {
      resetPasswordV2({
        password: _password,
        rePassword: _rePassword,
        token,
      }).then((res) => {
        authModal?.openLoginModal();
        success(t("success"));
      }).catch(err => {
        err.msg && error(err.msg)
      });
    }
  };
  return (
    <AuthModalLayout title={t("Reset password") as string}>
      <Password
        {...password}
        label={
          <div className="text-xs text-primary-900-White font-bold mb-2">
            {t("New password")}
          </div>
        }
      />
      <Password
        {...rePassword}
        label={
          <div className="text-xs text-primary-900-White font-bold mb-2">
            {t("New password (again)")}
          </div>
        }
      />
      <Button
        onClick={resetPwd}
        disabled={!rePassword.statusInfo.isValid || !rePassword.statusInfo.isValid}
        fullWidth
        variant="contained"
        classes={{ disabled: "bg-opacity-40" }}
        className="bg-primary normal-case text-title text-sm font-semibold h-10"
      >
        {t("Done")}
      </Button>
    </AuthModalLayout>
  );
};

export default ResetPwd;
