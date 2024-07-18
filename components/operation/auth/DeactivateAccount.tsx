import { Button, Checkbox, FormControlLabel } from "@mui/material";
import AuthModalLayout from "components/layout/AuthModalLayout";
import { cn } from "helper/cn";
import useNotistack from "hooks/useNotistack";
import { useTCenter, useTCommon } from "hooks/useTranslation";
import { thirdPartyAccountLogout } from "http/user";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "store/UserStore";
import { useThemeStore } from "store/useThemeStore";

/**
 * 注销帐号组件，用于弹窗中的注销帐号操作
 */
const DeactivateAccount: React.FC = () => {
  const { t: tCenter } = useTCenter();
  const { t: tCommon } = useTCommon();
  const { success } = useNotistack();
  const router = useRouter()
  const { authModal, user, verifyCode, logout } = useContext(UserContext);
  const [checked, setChecked] = useState(false);
  const { theme } = useThemeStore();
  const submitDeactivate = () => {
    if (user?.email && user?.phone) {
      authModal?.openAuthMethodSelector();
    } else if (user?.phone) {
      verifyCode
        ?.sendDeactivatePhoneCode({ phone: user.phone })
        .then(() => authModal?.openVerifyCode());
    } else if (user?.email) {
      verifyCode
        ?.sendDeactivateEmailCode({ email: user.email })
        .then(() => authModal?.openVerifyCode());
    } else {
      thirdPartyAccountLogout().then(() => {
        success(tCommon("Success"));
        authModal?.closeModal();
        logout();
        router.replace("/")
      })
    }
  };
  const renderTitle = () => {
    return (
      <div className="flex flex-col space-y-4 items-center">
        <Image
          src={
            theme === "dark"
              ? "/img/logo-white-horizontal-without-alpha.png"
              : "/img/logo-black-horizontal-without-alpha.png"
          }
          className=""
          width={145}
          height={32}
          alt=""
        />
        <span>{tCenter("Confirm to cancel account")}</span>
      </div>
    );
  };

  return (
    <AuthModalLayout title={renderTitle() as any}>
      <div className="flex flex-col space-y-4 text-secondary-500-300 text-sm">
        <p className="m-0">{tCenter("Deactivate Account tip1")}</p>
        <p>{tCenter("Deactivate Account tip2")}</p>
        <p>{tCenter("Deactivate Account tip3")}</p>
      </div>

      <FormControlLabel
        className="m-0"
        onChange={(_, checked) => setChecked(checked)}
        control={
          <Checkbox
            className="p-0 rounded-sm text-primary-100-700"
            classes={{ checked: "!text-primary" }}
            size="small"
          />
        }
        label={tCenter("understood and agree")}
        classes={{ label: "text-sm text-primary-900-White ml-2" }}
      />

      <Button
        fullWidth
        disabled={!checked}
        variant="contained"
        className={cn("bg-background-secondary-White-700 normal-case text-placeholder-400-300 text-sm font-semibold h-9 rounded-e-lg border border-solid border-primary-100-700 rounded-lg", {
          ["text-primary-900-White"]: checked
        })}
        onClick={submitDeactivate}
      >
        {tCenter("verify and deactivate")}
      </Button>
      <Button
        fullWidth
        variant="contained"
        className="bg-primary normal-case text-white text-sm font-semibold h-9 rounded-lg"
        onClick={() => authModal?.closeModal()}
      >
        {tCenter("Cancel")}
      </Button>
    </AuthModalLayout>
  );
};

export default DeactivateAccount;
