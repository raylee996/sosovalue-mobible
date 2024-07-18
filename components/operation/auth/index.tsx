import {
  Grow,
  Dialog,
  Divider,
  Button,
  Slide,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, useContext, useState } from "react";
import LoginSignUp from "./LoginSignUp";
import ForgetPassword from "./ForgetPassword";
import ResetPwd from "./ResetPwd";
import EnterUsername from "./EnterUsername";
import VerifyCode from "./VerifyCode";
import EnhanceSecurity from "./EnhanceSecurity";
import OneClickLogin from "./OneClickLogin";
import ReferralKey from "./ReferralKey";
import { UserContext } from "store/UserStore";
import LinkSignUp from "./LinkSignUp";
import { TransitionProps } from "@mui/material/transitions";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Navigate from "components/layout/Navigate";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AuthMethodSelector from "./AuthMethodSelector";
import DeactivateAccount from "./DeactivateAccount";
import UpdatePassword from "./UpdatePassword";
import BindAccount from "./BindAccount";
import ChangeBindAccount from "./ChangeBindAccount";
import ChangePwd from "./ChangePwd";
import { ThemeContext } from "store/ThemeStore";
import { useThemeStore } from "store/useThemeStore";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Auth = () => {
  const { authModal } = useContext(UserContext);
  const [tempToken, setTempToken] = useState("");
  const [parent] = useAutoAnimate();
  const { theme } = useThemeStore();

  const renderAuthContent = () => {
    if (authModal?.showLoginSignUp) {
      return <LoginSignUp />;
    } else if (authModal?.showLinkSignUp) {
      return <LinkSignUp />;
    } else if (authModal?.showResetSendEmail) {
      return <ForgetPassword />;
    } else if (authModal?.showResetPwd) {
      return <ResetPwd token={tempToken} />;
    } else if (authModal?.showEnterUsername) {
      return <EnterUsername />;
    } else if (authModal?.showVerifyCode) {
      return <VerifyCode setTempToken={(token) => setTempToken(token)} />;
    } else if (authModal?.showEnhanceSecurity) {
      return <EnhanceSecurity />;
    } else if (authModal?.showOneClickLogin) {
      return <OneClickLogin />;
    } else if (authModal?.showReferralKey) {
      return <ReferralKey />;
    } else if (authModal?.showDeactivateAccount) {
      return <DeactivateAccount />;
    } else if (authModal?.showAuthMethods) {
      return <AuthMethodSelector />;
    } else if (authModal?.showBindAccount) {
      return <BindAccount />;
    } else if (authModal?.showAuthMethods) {
      return <AuthMethodSelector />;
    } else if (authModal?.showChangePwd) {
      return <ChangePwd token={tempToken} />;
    } else if (authModal?.showChangeBindAccount) {
      return <ChangeBindAccount />;
    }
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={!!authModal?.showAuthModal}
        TransitionComponent={Transition}
        className="z-[1501]"
        classes={{ paper: "bg-dropdown-White-800 relative pb-16 bg-none" }}
      >
        <div className="w-full" ref={parent}>
          <div className="flex items-center justify-between pt-1 px-4 pb-3 border-primary-100-700 border border-solid">
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
            <IconButton
              onClick={() => {
                if (authModal?.closeModalCallback) {
                  authModal.closeModalCallback();
                }
                authModal?.closeModal()
              }}
              className="text-sub-title relative -right-4"
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
          {renderAuthContent()}
        </div>
        {authModal?.showLoginSignUp && (
          <div className="fixed bottom-0 left-0 w-full bg-[#1A1A1A]">
            <Navigate />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Auth;
