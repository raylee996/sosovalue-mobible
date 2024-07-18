import { Button } from "@mui/material";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "store/UserStore";
import { bindEmailV3, bindPhone, changeBindEmail, changeBindPhone, emailCodeLogin, emailPasswordLoginV2, emailRegisterV3, logoutByEmail, logoutByPhone, phoneCodeLogin, phonePasswordLogin, registerByPhone } from "http/user";
import useNotistack from "hooks/useNotistack";
import { cn } from "helper/cn";
import AuthModalLayout from "components/layout/AuthModalLayout";
import { ResponseWrap } from "helper/request";
import { EmailSignUpVerify, NewDeviceVerify, PhoneSignUpVerify } from "hooks/operation/useVerifyCode";
import { useTCommon } from "hooks/useTranslation";

const VerifyCode = ({
  setTempToken,
}: {
  setTempToken: (tempToken: string) => void;
}) => {
  const { error, success } = useNotistack();
  const { verifyCode, getUserInfo, authModal, loginSeccess, logout, user } =
    useContext(UserContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const { t } = useTCommon();
  const isVerifySignUp = verifyCode?.isVerifySignUpByEmail || verifyCode?.isVerifySIgnUpByPhone;
  const isUsePhone = verifyCode?.isVerifyBindPhone || verifyCode?.isVerifyPhoneLogin || verifyCode?.isVerifySIgnUpByPhone;
  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim().replaceAll(/\D/g, "").slice(0, 6);
    setCode(code);
    if (code.length < 6 && isError) {
      setIsError(false);
    }

    if (code.length === 6) {
      if (verifyCode?.isVerifyResetPwd || verifyCode?.isVerifyResetPwdByPhone || verifyCode?.isVerifyBindEmail || verifyCode?.isVerifyBindPhone || verifyCode?.isChangePwd || verifyCode?.isVerifyDeactivate || verifyCode?.isVerifyBeforeChangeBindAccount || verifyCode?.isVerifyAfterChangeBindAccount) {
        const res = await verifyCode!.verify(code);
        if (!res?.success) {
          setIsError(true);
          error(res?.msg || "");
          return;
        };
        setTempToken(res.data as string);
        // 登录前重置密码
        if (verifyCode?.isVerifyResetPwd || verifyCode?.isVerifyResetPwdByPhone) {
          authModal?.openResetPwd();
        }
        // 绑定邮箱验
        if (verifyCode?.isVerifyBindEmail) {
          // const { password, rePassword } = verifyCode.verifyInfo?.params as {
          //   password: string;
          //   rePassword: string;
          // };
          const _password = verifyCode.tmpPassword || "Abc111111";
          const _rePassword = verifyCode.reTmpPassword || "Abc111111";
          bindEmailV3({
            token: res.data as string,
            password: _password,
            rePassword: _rePassword,
          }).then(() => {
            getUserInfo();
            authModal?.closeModal();
            verifyCode.setTmpPassword("");
            verifyCode.setReTmpPassword("");
          });
        }
        // 绑定手机
        if (verifyCode?.isVerifyBindPhone) {
          // const { password, rePassword } = verifyCode.verifyInfo?.params as {
          //   password: string;
          //   rePassword: string;
          // };
          const _password = verifyCode.tmpPassword || "Abc111111";
          const _rePassword = verifyCode.reTmpPassword || "Abc111111";
          bindPhone({
            token: res.data as string,
            password: _password,
            rePassword: _rePassword,
            countryCode: "+" + verifyCode.verifyInfo!.params!.countryCode!,
            phoneNumber: verifyCode.verifyInfo!.params.phone!,
          }).then(() => {
            getUserInfo();
            authModal?.closeModal();
          });
        }
        // 登录后修改密码
        if (verifyCode?.isChangePwd) {
          authModal?.openChangePwd();
        }
        // 注销账号
        if (verifyCode?.isVerifyDeactivate) {
          // 通过手机号注销
          if (verifyCode.verifyInfo?.params.phone) {
            logoutByPhone({ token: res.data as string }).then(() => {
              success(t("Success"));
              authModal?.closeModal();
              logout();
            });
          } else {
            // 通过邮箱注销
            logoutByEmail({ token: res.data as string }).then(() => {
              success(t("Success"));
              authModal?.closeModal();
              logout();
            });
          }
        }
         // 用户换绑前手机/邮箱(旧手机/旧邮箱)
         if (verifyCode.isVerifyBeforeChangeBindAccount) {
          if (verifyCode.verifyInfo?.params.phone) {
            authModal?.openChangeBindAccountByPhone();
          } else {
            authModal?.openChangeBindAccountByEmail();
          }
        }
        // 用户换绑后手机/邮箱(新手机/新邮箱)，调用换绑接口
        if (verifyCode.isVerifyAfterChangeBindAccount) {
          const tokenParams: API.ChangeBindRequest = { 
            beforeChangeBindToken: verifyCode.tmpBeforeChangeBindToken,
            afterChangeBindToken: res.data as string,
            countryCode: "+" + verifyCode.verifyInfo!.params!.countryCode!,
            phoneNumber: verifyCode.verifyInfo!.params.phone!,
           }
          let changeBindSuccess = false;
          if (verifyCode.verifyInfo?.params.phone) {
            const res = await changeBindPhone(tokenParams)
            changeBindSuccess = res.success
          } else {
            const res = await changeBindEmail({
              beforeChangeBindToken: tokenParams.beforeChangeBindToken,
              afterChangeBindToken: tokenParams.afterChangeBindToken
            })
            changeBindSuccess = res.success
          }
          if (changeBindSuccess) {
            getUserInfo().then(() => authModal?.closeModal());
          }
        }
        return;
      }
      // 登录注册相关
      if (!verifyCode?.verifyInfo?.params) return;
      const { params } = verifyCode.verifyInfo;
      let res: ResponseWrap<API.LoginResult> | undefined;
      if (verifyCode?.isVerifyEmailLogin) {
        res = await emailCodeLogin({ verifyCode: code, email: params.email! });
      } else if (verifyCode?.isVerifyPhoneLogin) {
        res = await phoneCodeLogin({ verifyCode: code, phone: params.phone! });
      }  else if (verifyCode.isVerifySignUpByEmail) {
        res = await emailRegisterV3({...(params as EmailSignUpVerify['params']), verifyCode: code })
      } else if (verifyCode.isVerifySIgnUpByPhone) {
        res = await registerByPhone({
          ...(params as PhoneSignUpVerify['params']), 
          verifyCode: code,
        })
      } else if (verifyCode.isNewDeviceVerify) {
        // 用户通过新设备登录输入验证码后，执行登录操作
        const params = verifyCode.verifyInfo?.params as NewDeviceVerify['params']
        if (params.type === 1) {
          if (params.password) {
            // 邮箱密码登录
            res = await emailPasswordLoginV2({
              isDifferent: true,
              loginName: params.emailOrPhone,
              password: params.password,
              type: "portal",
              verifyCode: code,
            });
          } else {
            // 邮箱验证码
            res = await emailCodeLogin({ verifyCode: code, email: params.emailOrPhone! })
          }
        } else if (params.type === 2) {
          if (params.password) {
            // 手机密码登录
            res = await phonePasswordLogin({
              phone: params.emailOrPhone,
              password: params.password,
              isDifferent: true,
              verifyCode: code,
            });
          } else {
            // 手机验证码登录
            res = await phoneCodeLogin({ verifyCode: code, phone: params.emailOrPhone! });
          }
        }
      }
      if (!res?.success) {
        setIsError(true);
        error(res?.msg || "");
        return;
      }
      await loginSeccess(res.data.token);
    }
  };
  const cancel = () => {
    if (isVerifySignUp) {
      authModal?.openSignupModal();
    } else if (verifyCode?.isVerifyResetPwd) {
      authModal?.openResetSendEmail();
    } else if (verifyCode?.isVerifyBindEmail) {
      authModal?.closeModal();
    }
  };
  const generateFullPhoneNumber = (phoneNumber?: string, areaCode?: string) => {
    if (!phoneNumber) {
      return "";
    }
    return phoneNumber.startsWith("+") ? phoneNumber : `+${areaCode}${phoneNumber}`;
  }
  useEffect(() => {
    inputRef.current?.focus();
    const clear = verifyCode?.startInterval();
    return clear;
  }, []);
  
  const buttonClasses = `normal-case py-2 h-10 bg-background-secondary-White-700 text-primary-900-White rounded-lg border border-solid border-primary-100-700`;
  
  return (
    <AuthModalLayout
      className="items-center"
      title={t("We’ve sent you a code") as string}
      secondaryTitle={
        <div>
          {t("the code was sent to")}:{" "}
          <span className="font-bold text-primary">
            {
              verifyCode?.verifyInfo?.params.email || 
              generateFullPhoneNumber(verifyCode?.verifyInfo?.params.phone, verifyCode?.verifyInfo?.params.countryCode) || 
              verifyCode?.verifyInfo?.params.emailOrPhone || ""}
          </span>
        </div>
      }
    >
      <div className="w-full">
        <input
          className="opacity-0 w-full h-full absolute -left-[10000px] -top-[10000px]"
          value={code}
          onChange={onChange}
          ref={inputRef}
          autoFocus
          onBlur={() => inputRef.current?.focus()}
        />
        <div className="flex gap-2 h-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 flex items-center justify-center text-primary-900-White text-3xl rounded-lg border border-solid border-primary-100-700",
                { "border-primary": code.length === i },
                { "border-accent-600": isError }
              )}
            >
              {code[i]}
              {!code[i] && code.length === i && (
                <span className="animate-fadeInOut h-5 bg-primary-900-White w-[1px]"></span>
              )}
            </span>
          ))}
        </div>
      </div>
      {verifyCode?.showInterval ? (
        <Button fullWidth className={buttonClasses}>
          {t("Request new code in")} 00:{verifyCode.numNode}
        </Button>
      ) : (
        <Button
          fullWidth
          onClick={() => {
            setCode("");
            setIsError(false);
            verifyCode?.resend();
          }}
          className={buttonClasses}
        >
          {t("Resend")}
        </Button>
      )}
      {isVerifySignUp && !isUsePhone && <div className="flex flex-col justify-center pt-5 text-xs border-0 border-t border-solid border-primary-100-700 text-center">
        <span className="text-secondary-500-300">{t("Wrong email")} </span>
        <Button
          onClick={cancel}
          className="text-primary p-0 normal-case text-xs"
        >
          {authModal?.showEmailTab ? t("Please re-enter your e-mail address.") : t("Please re-enter your phone number.") }
        </Button>
      </div>}
    </AuthModalLayout>
  );
};

export default VerifyCode;
