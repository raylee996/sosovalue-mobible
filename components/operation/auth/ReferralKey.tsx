import { Button, IconButton, OutlinedInput } from "@mui/material";
import useUsername, { ValidateStatus } from "hooks/operation/useUsername";
import useNotistack from "hooks/useNotistack";
import { addInviter } from "http/user";
import { ChangeEvent, useContext, useState } from "react";
import { UserContext } from "store/UserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import AuthModalLayout from "components/layout/AuthModalLayout";
import ScaleLoader from "components/base/ScaleLoader";

const ReferralKey = () => {
  const router = useRouter();
  const { success } = useNotistack();
  const { authModal, userModal, getUserInfo } = useContext(UserContext);
  const [invitationCode, setInvitationCode] = useState(
    router.query.inviteCode || ""
  );
  const [isError, setIsError] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { t } = useTranslation(localeType.COMMON);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvitationCode(e.target.value);
    setIsError(false);
    setErrMsg("");
  };
  const bindInviter = () => {
    setIsBinding(true);
    addInviter(invitationCode as string)
      .then((res) => {
        if (res.success) {
          success("success");
          getUserInfo();
          skip();
        } else if (res.code === 40026 || res.code === 40039) {
          setIsError(true);
          setErrMsg(res.msg);
        }
      })
      .finally(() => setIsBinding(false));
  };
  const skip = () => {
    authModal?.closeModal();
    userModal?.installPwa.open();
  };
  return (
    <AuthModalLayout title={t("You just earned 50exp!") as string}>
      <div className="flex items-center justify-center my-4">
        <div className="relative">
          <Image src="/img/invite-modal2.png" width={70} height={70} alt="" />
          <Image
            className="absolute -right-4 bottom-0"
            src="/img/invite-modal1.png"
            width={38}
            height={22}
            alt=""
          />
        </div>
      </div>
      <div>
        <div className="text-sm text-secondary-500-300 mb-2">
          {t("boost your exp")}
        </div>
        <div className="text-secondary-500-300 text-xs">
          {t("(Exp will be airdropped to your account every Sunday)")}
        </div>
      </div>
      <OutlinedInput
        value={invitationCode}
        onChange={onChange}
        autoComplete="new-email"
        fullWidth
        className="h-10 pr-0 bg-background-primary-White-900 rounded-lg"
        classes={{
          input: "h-full py-0 text-sm text-primary-900-White px-4",
          notchedOutline: `border ${
            isError ? "border-accent-600 border" : "border-primary-100-700"
          }`,
        }}
      />
      {errMsg && (
        <div key={status} className="text-accent-600 text-xs mt-1">
          {errMsg}
        </div>
      )}
      <Button
        onClick={bindInviter}
        disabled={!invitationCode.length || isBinding}
        fullWidth
        variant="contained"
        className="bg-primary normal-case text-title text-sm font-semibold h-10 rounded-lg"
      >
        {isBinding ? <ScaleLoader /> : t("Welcome")}
      </Button>
      <Button
        onClick={skip}
        fullWidth
        className="normal-case text-content text-sm font-semibold h-10"
      >
        {t("Skip")} &gt;&gt;
      </Button>
    </AuthModalLayout>
  );
};

export default ReferralKey;
