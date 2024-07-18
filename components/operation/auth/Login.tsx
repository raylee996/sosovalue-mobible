import {
  KeyboardEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import usePassword from "hooks/operation/usePassword";
import { UserContext } from "store/UserStore";
import Password from "./Password";
import {
  checkEmailIsRegister,
  checkEmailPasswordLogin,
  checkIsNewDevice,
  checkPhoneIsRegister,
  checkPhonePasswordLogin,
} from "http/user";
import { localeType } from "store/ThemeStore";
import { useTranslation } from "next-i18next";
import { AccountSwitcher, useAccountSwitcher } from "./accountSwitcher";
import { UseFieldReturnType } from "./AuthInputField";
import { useTCommon } from "hooks/useTranslation";
import useNotistack from "hooks/useNotistack";

enum CustomStatus {
  Registed,
  UnRegisted,
}

const Login = ({
  setUnRegisterEmail,
}: {
  setUnRegisterEmail: (email: string) => void;
}) => {
  const {
    emailLogin,
    phoneLogin,
    authModal,
    verifyCode,
    rememberMe,
    toggleRememberMe,
  } = useContext(UserContext);
  const [parent] = useAutoAnimate();
  const { t } = useTCommon();
  const password = usePassword({ validate: false });
  const { loginMethod, accountValue, isAccountValid, areaCode, actions } =
    useAccountSwitcher();
  const { error } = useNotistack();
  // 密码登录验证条件
  const isValidateByPasswordSuccess = isAccountValid && !!password.value;
  // 验证码登录验证条件
  const isValidateByVerifyCodeSuccess = isAccountValid;
  const [submitting, setSubmitting] = useState(false);
  const loginByEmail = () => {
    emailLogin({
      loginName: accountValue,
      password: Buffer.from(password.value).toString("base64"),
      type: "portal",
      isDifferent: true,
    });
  };
  const loginByPhone = () => {
    phoneLogin({
      phone: `+${areaCode}${accountValue}`,
      password: Buffer.from(password.value).toString("base64"),
      isDifferent: true,
    });
  };
  const toLogin = () => {
    authModal?.showEmailTab ? loginByEmail() : loginByPhone();
  };
  const toSignup = () => {
    authModal?.openSignUpTab();
    setUnRegisterEmail(accountValue);
  };
  const onEnterDownLogin = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isValidateByPasswordSuccess && e.code === "Enter") {
      toLogin();
    }
  };
  // 验证是否为新设备，如果是新设备，则需要输入手机/邮箱的验证码
  const verifyIsNewDevice = async (callback: () => void) => {
    setSubmitting(true);
    const verifyParams = authModal?.showEmailTab
      ? ({ emailOrPhone: accountValue, type: 1 } as const)
      : ({
          emailOrPhone: `${encodeURIComponent("+")}${areaCode}${accountValue}`,
          type: 2,
        } as const);
    const _password = Buffer.from(password.value).toString("base64");
    if (authModal?.showEmailTab) {
      if (loginMethod === "password") {
        checkEmailPasswordLogin({
          loginName: accountValue,
          password: Buffer.from(password.value).toString("base64"),
          type: "portal",
          isDifferent: true,
        })
          .then(() => {
            loginByEmail();
          })
          .catch((err) => {
            if (err.code === 40059) {
              verifyCode
                ?.sendNewDeviceEmailCode({
                  ...verifyParams,
                  password: _password,
                })
                .then(() => authModal?.openVerifyCode())
                .catch((err) => {
                  err?.msg && error(err.msg);
                })
                .finally(() => setSubmitting(false));
            } else {
              err?.msg && error(err.msg);
            }
          })
          .finally(() => setSubmitting(false));
      } else {
        verifyCode
          ?.sendNewDeviceEmailCode({ ...verifyParams, password: _password })
          .then(() => authModal?.openVerifyCode())
          .catch((err) => {
            err?.msg && error(err.msg);
          })
          .finally(() => setSubmitting(false));
      }
    } else {
      if (loginMethod === "password") {
        checkPhonePasswordLogin({
          phone: `+${areaCode}${accountValue}`,
          password: Buffer.from(password.value).toString("base64"),
          isDifferent: true,
        })
          .then(() => {
            loginByPhone();
          })
          .catch((err) => {
            if (err.code === 40059) {
              verifyCode
                ?.sendNewDevicePhoneCode({
                  ...verifyParams,
                  emailOrPhone: `+${areaCode}${accountValue}`,
                  password: _password,
                })
                .then(() => authModal?.openVerifyCode())
                .catch((err) => {
                  err?.msg && error(err.msg);
                });
            } else {
              err?.msg && error(err.msg);
            }
          })
          .finally(() => setSubmitting(false));
      } else {
        verifyCode
          ?.sendNewDevicePhoneCode({
            ...verifyParams,
            emailOrPhone: `+${areaCode}${accountValue}`,
            password: _password,
          })
          .then(() => authModal?.openVerifyCode())
          .catch((err) => {
            err?.msg && error(err.msg);
          })
          .finally(() => setSubmitting(false));
      }
    }
  };
  // 验证码登录提交方法
  const toVerify = () => {
    setSubmitting(true);
    if (authModal?.showPhoneTab) {
      verifyCode
        ?.sendLoginPhoneCode({
          phone: `+${areaCode}${accountValue}`,
        })
        .then(() => authModal?.openVerifyCode())
        .finally(() => setSubmitting(false));
    } else if (authModal?.showEmailTab) {
      verifyCode
        ?.sendLoginEmailCode({
          email: accountValue,
        })
        .then(() => authModal?.openVerifyCode())
        .finally(() => setSubmitting(false));
    }
  };
  const loginMethodMap = {
    password: {
      isValidate: isValidateByPasswordSuccess,
      submit: () => verifyIsNewDevice(toLogin),
      text: t("Log In"),
    },
    verifyCode: {
      isValidate: isValidateByVerifyCodeSuccess,
      submit: () => toVerify(),
      text: t("Next"),
    },
  };
  const renderValidTips = (
    props: UseFieldReturnType,
    tip: ReactNode,
    label: ReactNode
  ) => {
    return props.customStatus === CustomStatus.UnRegisted ? (
      <div className="text-accent-600 text-xs mt-1">
        {label}
        <span>
          {t("Please")}{" "}
          <Button
            onClick={toSignup}
            className="normal-case text-[#226DFF] text-xs underline p-0"
          >
            {t("sign up.")}
          </Button>
        </span>
      </div>
    ) : (
      tip
    );
  };
  useEffect(() => {
    password.clear();
  }, [authModal?.showPhoneTab]);

  return (
    <div className="flex flex-col space-y-5" ref={parent}>
      <AccountSwitcher
        {...actions}
        showLabelSuffix
        rules={{
          phone: {
            async asyncValidate(value: string) {
              return checkPhoneIsRegister(
                `${encodeURIComponent("+")}${areaCode}${value}`
              ).then((res) => ({
                result: !res.success,
                customStatus: res.success
                  ? CustomStatus.UnRegisted
                  : CustomStatus.Registed,
              }));
            },
          },
          email: {
            async asyncValidate(value: string) {
              return checkEmailIsRegister(value).then((res) => ({
                result: !res.success,
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
              t("This email is not registered with SoSoValue.")
            ),
          phone: (props, tip) =>
            renderValidTips(
              props,
              tip,
              t("this phone is not registered with SoSoValue.")
            ),
        }}
      />
      {loginMethod === "password" && (
        <Password {...password} className="mb-5" onKeyDown={onEnterDownLogin} />
      )}
      <div className="flex justify-end items-center !mt-0">
        {/* <FormControlLabel
          className="m-0"
          onChange={(_, checked) => toggleRememberMe(checked)}
          checked={rememberMe}
          control={
            <Checkbox
              className="p-0 rounded-sm text-primary-100-700"
              classes={{ checked: "!text-primary" }}
              size="small"
            />
          }
          label={t("Remember me")}
          classes={{ label: "text-sm text-primary-900-White ml-2" }}
        /> */}
        <Button
          onClick={() => authModal?.openResetSendEmail()}
          className="normal-case text-primary text-sm underline"
        >
          {t("Forgot password?")}
        </Button>
      </div>
      <Button
        onClick={loginMethodMap[loginMethod].submit}
        disabled={!loginMethodMap[loginMethod].isValidate || submitting}
        fullWidth
        variant="contained"
        classes={{ disabled: "bg-opacity-40" }}
        className="bg-primary normal-case text-title text-sm font-semibold h-10 rounded-lg"
      >
        {t("Log In")}
      </Button>
    </div>
  );
};

export default Login;
