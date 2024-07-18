import { Button } from "@mui/material";
import usePassword from "hooks/operation/usePassword";
import { useContext } from "react";
import { UserContext } from "store/UserStore";
import Password from "./Password";
import useNotistack from "hooks/useNotistack";
import { useTCommon } from "hooks/useTranslation";
import { changePasswordByEmail, changePasswordByPhone } from "http/user";
import { ResponseWrap } from "helper/request";
import AuthModalLayout from "components/layout/AuthModalLayout";

/**
 * 登录后更新密码
 */
const ChangePwd: React.FC<{ token: string }> = ({ token }) => {
  const { success, error } = useNotistack();
  const { authModal, verifyCode } = useContext(UserContext);
  const password = usePassword({ validate: true });
  const { t } = useTCommon();
  const rePassword = usePassword({
    validate: false,
    syncValidate(value: string) {
      return {
        result: value === password.value,
        msg: t("The passwords do not match."),
      };
    },
  });
  const changePwd = async () => {
    const _password = Buffer.from(password.value).toString("base64")
    const _rePassword = Buffer.from(rePassword.value).toString("base64")
    const params = { token, password: _password, rePassword: _rePassword }
    let res: ResponseWrap<string> | undefined;
    if (verifyCode?.verifyInfo?.params.phone) {
      res = await changePasswordByPhone(params)
    } else {
      res = await changePasswordByEmail(params)
    }
    if (res?.success) {
      success(t("success"));
      authModal?.closeModal();
    }
    !res?.success && res.msg && error(res.msg);
  };
  return (
    <AuthModalLayout>
      <Password
        {...password}
        label={
          <div className="text-xs text-neutral-fg-2-rest font-bold mb-2">
            {t("New password")}
          </div>
        }
      />
      <Password
        {...rePassword}
        label={
          <div className="text-xs text-neutral-fg-2-rest font-bold mb-2">
            {t("New password (again)")}
          </div>
        }
      />
      <Button
        onClick={changePwd}
        disabled={!rePassword.statusInfo.isValid || !password.statusInfo.isValid}
        fullWidth
        variant="contained"
        classes={{ disabled: "bg-opacity-40" }}
        className="bg-primary normal-case text-title text-sm font-semibold h-10 rounded-lg"
      >
        {t("Done")}
      </Button>
    </AuthModalLayout>
  );
};

export default ChangePwd;
