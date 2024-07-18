import { ReactNode, useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { UserContext } from "store/UserStore";
import Password from "components/operation/auth/Password";
import usePassword from "hooks/operation/usePassword";
import { checkEmailIsRegister, checkPhoneIsRegister } from "http/user";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { UseFieldReturnType } from "./AuthInputField";
import { AccountSwitcher, useAccountSwitcher } from "./accountSwitcher";
import useFingerprint from "hooks/useFingerprint";
import { useTCommon } from "hooks/useTranslation";
import useNotistack from "hooks/useNotistack";

enum CustomStatus {
  Registed,
  UnRegisted,
}

const SignUp = ({ unRegisterEmail }: { unRegisterEmail: string }) => {
  const [parent] = useAutoAnimate();
  const { authModal, verifyCode } = useContext(UserContext);
  const { t } = useTCommon();
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
  const { accountValue, isAccountValid, areaCode, actions } =
    useAccountSwitcher();
  const isValidate = isAccountValid && password.statusInfo.isValid && rePassword.statusInfo.isValid;
  const { error } = useNotistack();
  const [submitting, setSubmitting] = useState(false);

  const toVerify = () => {
    setSubmitting(true);
    const _password = Buffer.from(password.value).toString("base64");
    const _rePassword = Buffer.from(rePassword.value).toString("base64");
    if (authModal?.showEmailTab) {
      verifyCode
        ?.sendRegisterEmailCode({
          password: _password,
          rePassword: _rePassword,
          username: "NEW_USER_NAME_02",
          email: accountValue,
        })
        .then(() => authModal?.openVerifyCode())
        .catch((err) => {
          err.msg && error(err.msg);
        })
        .finally(() => setSubmitting(false));
    } else if (authModal?.showPhoneTab) {
      verifyCode
        ?.sendRegisterPhoneCode({
          phone: "+" + areaCode + accountValue,
          countryCode: "+" + areaCode!,
          phoneNumber: accountValue,
          password: _password,
          rePassword: _rePassword,
        })
        .then(() => authModal?.openVerifyCode())
        .catch((err) => {
          err.msg && error(err.msg);
        })
        .finally(() => setSubmitting(false));
    }
  };
  // useEffect(() => {
  //   if (unRegisterEmail) {
  //     email.onValueChange(unRegisterEmail);
  //   }
  // }, [unRegisterEmail]);

  const renderValidTips = (
    props: UseFieldReturnType,
    tip: ReactNode,
    label: ReactNode
  ) => {
    return props.customStatus === CustomStatus.Registed ? (
      <div className="text-accent-600 text-xs mt-1">
        {label}
        <span>
          <Button
            onClick={() => authModal?.openLoginTab()}
            className="normal-case text-[#226DFF] text-xs underline p-0"
          >
            {t("log in.")}
          </Button>
        </span>
      </div>
    ) : (
      tip
    );
  };
  useEffect(() => {
    password.reset();
  }, [authModal?.showPhoneTab]);
  return (
    <div className="flex flex-col space-y-5" ref={parent}>
      <AccountSwitcher
        {...actions}
        rules={{
          email: {
            async asyncValidate(value: string) {
              return checkEmailIsRegister(value).then((res) => ({
                result: res.success,
                customStatus: res.success
                  ? CustomStatus.UnRegisted
                  : CustomStatus.Registed,
              }));
            },
          },
          phone: {
            async asyncValidate(value: string) {
              return checkPhoneIsRegister(
                `${encodeURIComponent("+")}${areaCode}${value}`
              ).then((res) => ({
                result: res.success,
                customStatus: res.success
                  ? CustomStatus.UnRegisted
                  : CustomStatus.Registed,
              }));
            },
          },
        }}
        renderTip={{
          email: (props, tip) =>
            renderValidTips(
              props,
              tip,
              t("This email is already registered with SoSoValue.")
            ),
          phone: (props, tip) =>
            renderValidTips(
              props,
              tip,
              t("This phone is already registered with SoSoValue.")
            ),
        }}
      />
      {isAccountValid && (
        <div className="flex flex-col space-y-5 mb-5">
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
        </div>
      )}
      <Button
        fullWidth
        variant="contained"
        onClick={toVerify}
        disabled={!isValidate || submitting}
        classes={{ disabled: "bg-opacity-40" }}
        className="bg-primary normal-case text-title text-sm font-semibold h-10 rounded-lg"
      >
        {t("Next")}
      </Button>
    </div>
  );
};

export default SignUp;
