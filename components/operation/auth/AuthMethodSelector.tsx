import { useContext, useState } from "react";
import { Button, Radio } from "@mui/material";
import ConnectAccountCard from "components/base/ConnectAccount";
import Tabs from "components/base/tabs";
import EmailIcon from "components/svg/center/EmailIcon";
import { cn } from "helper/cn";
import { UserContext } from "store/UserStore";
import PhoneIcon from "components/svg/center/PhoneIcon";
import AuthModalLayout from "components/layout/AuthModalLayout";
import useAuthMethodStore, { AuthScenes } from "store/useAuthMethodStore";
import { useTCommon } from "hooks/useTranslation";

/**
 * 选择验证方式，目前支持邮箱和手机号方式进行验证 
 */
const AuthMethodSelector: React.FC = () => {
  const { authModal, verifyCode, user } = useContext(UserContext);
  const [verifyMethod, setVerifyMethod] = useState<"email" | "phone">("email"); 
  const { authScene } = useAuthMethodStore();
  const { t } = useTCommon();
  
  const sendVerifyCode = () => {
    if (authScene === "changePassword") {
      if (verifyMethod === "phone") {
        verifyCode?.sendChangePhonePwd({ phone: user?.phone! })
          .then(() => authModal?.openVerifyCode());
      } else {
        verifyCode?.sendChangeEmailPwd({ email: user?.email! })
        .then(() => authModal?.openVerifyCode());
      }
    }
    
    if (authScene === "deactivateAccount") {
      if (verifyMethod === "phone") {
        verifyCode?.sendDeactivatePhoneCode({ phone: user?.phone! })
          .then(() => authModal?.openVerifyCode());
      } else {
        verifyCode?.sendDeactivateEmailCode({ email: user?.email! })
        .then(() => authModal?.openVerifyCode());
      }
    }
  };


  return (
    <AuthModalLayout title={t("select auth method") as string} className="flex flex-col items-center space-y-5">
      <Tabs
        showIndicator={false}
        variant="contained"
        className="h-auto bg-transparent"
        classes={{ itemsRoot: "flex justify-between space-x-4" }}
        onChange={(value: "email" | "phone") => setVerifyMethod(value)}
      >
        <Tabs.Item
          value="email"
          render={selected => (
            <div className="flex-1 overflow-hidden">
              <ConnectAccountCard
                icon={<EmailIcon />}
                label={"Email"}
                account={user?.email}
                isConnected
                secondaryIcon={<Radio checked={selected} classes={{ root: "text-secondary-500-300 p-0", checked: "!text-primary" }} />}
                className={cn("cursor-pointer transition-colors hover:bg-transparent hover:border-primary", { ["border-primary cursor-default"]: selected })}
              />
            </div>
          )}
        >
          email
        </Tabs.Item>
        <Tabs.Item
          value="phone"
          render={selected => (
            <div className="flex-1 overflow-hidden">
              <ConnectAccountCard
                icon={<PhoneIcon />}
                label={"Phone Number"}
                account={user?.phone}
                isConnected
                secondaryIcon={<Radio checked={selected} classes={{ root: "text-secondary-500-300 p-0", checked: "!text-primary" }}></Radio>}
                className={cn("transition-colors bg-dropdown-White-800", { ["border-primary"]: selected })}
              />
            </div>
          )}
        >
          phone
        </Tabs.Item>
      </Tabs>

      <Button
        fullWidth
        variant="contained"
        className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-white text-sm font-semibold h-10"
        onClick={() => sendVerifyCode()}
      >
        {t("Next")}
      </Button>
    </AuthModalLayout>
  );
};

export default AuthMethodSelector;
