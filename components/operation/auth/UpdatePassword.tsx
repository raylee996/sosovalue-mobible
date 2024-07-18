import AuthModalLayout from "components/layout/AuthModalLayout";
import Password from "./Password";
import usePassword from "hooks/operation/usePassword";
import { useTCommon } from "hooks/useTranslation";
import { Button } from "@mui/material";
import { logindResetPwd } from "http/user";
import { useContext, useState } from "react";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";

/**
 * 修改密码，在authModal中展示
 */
const UpdatePassword: React.FC = () => {
  const { t } = useTCommon();
  const { authModal } = useContext(UserContext);
  const password = usePassword({ validate: true });
  const reenterPassword = usePassword({
    validate: false,
    syncValidate: (value) => {
      return {
        result: value === password.value,
        msg: t("The passwords do not match."),
      };
    },
  });
  const isValidate =
    password.statusInfo.isValid && reenterPassword.statusInfo.isValid;
  const { error, success } = useNotistack();
  const [loading, setLoading] = useState(false);

  const toUpdatePassword = async () => {
    if (!isValidate || loading) return;
    setLoading(true);
    try {
      const param = {
        password: Buffer.from(password.value).toString("base64"),
        rePassword: Buffer.from(reenterPassword.value).toString("base64"),
      };
      const res = await logindResetPwd(param as any);
      if (res.code === 0) {
        success(t("Success"));
        authModal?.closeModal();
      }
      if (res.code === 1) error(res.msg);
    } finally {
      setLoading(false);
    }
  };
  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isValidate && e.code === "Enter") {
      toUpdatePassword();
    }
  };

  return (
    <AuthModalLayout>
      <Password
        {...password}
        label={
          <div className="text-primary-900-White text-sm mb-2">
            {t("New password")}
          </div>
        }
        onKeyDown={handleEnterDown}
      />
      <Password
        {...reenterPassword}
        label={
          <div className="text-primary-900-White text-sm mb-2">
            {t("New password (again)")}
          </div>
        }
        onKeyDown={handleEnterDown}
      />
      <Button
        onClick={() => toUpdatePassword()}
        disabled={!isValidate || loading}
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

export default UpdatePassword;
