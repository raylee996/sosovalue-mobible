import { Button, IconButton, OutlinedInput } from "@mui/material";
import Regex from "helper/regex";
import { ChangeEvent, useContext, useState } from "react";
import { UserContext } from "store/UserStore";
import Image from "next/image";
import useEmail from "hooks/operation/useEmail";
import Email from "components/operation/auth/Email";
import { checkEmailIsRegister } from "http/user";

const ResetSendEmail = () => {
  const { authModal, verifyCode } = useContext(UserContext);
  const email = useEmail({
    validate: true,
    async asyncValidate(value: string) {
      return checkEmailIsRegister(value).then((res) => ({
        result: !res.success,
        msg: "This email is not registered with SoSoValue.",
      }));
    },
  });
  const toVerify = () => {
    verifyCode
      ?.sendResetPwdCode({ email: email.value })
      .then(() => authModal?.openVerifyCode());
  };
  return (
    <div>
      <div>
        <Button className={`normal-case text-2xl font-bold text-primary -ml-2`}>
          Reset password
        </Button>
      </div>
      <Email {...email} className="mb-5 mt-8" />
      <Button
        onClick={toVerify}
        fullWidth
        variant="contained"
        disabled={!email.statusInfo.isValid}
        className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-[34px]"
      >
        Reset
      </Button>
      <Button
        onClick={() => authModal?.openLoginModal()}
        fullWidth
        variant="outlined"
        className="normal-case text-content text-sm font-semibold h-[34px] mt-5 border-[#404040]"
      >
        Return to Log In
      </Button>
    </div>
  );
};

export default ResetSendEmail;
