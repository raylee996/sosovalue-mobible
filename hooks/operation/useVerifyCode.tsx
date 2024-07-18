import { sendRegisterVerifyCodeByEmail, sendResetPasswordVerifyCode, sendResetPasswordByPhoneVerifyCode, checkUserVerifyCode, sendBindEmailVerifyCodeV2, sendLoginVerifyCodeByEmail, sendRegisterVerifyCodeByPhone, sendLoginVerifyCodeByPhone, checkUserPhoneVerifyCode, sendBindPhoneVerifyCode, sendChangePasswordEmailVerifyCode, sendChangePasswordPhoneVerifyCode, sendLogoutVerifyCodeByEmail, sendLogoutVerifyCodeByPhone, sendBeforeChangeBindEmailVerifyCode, sendBeforeChangeBindPhoneVerifyCode, sendAfterChangeBindEmailVerifyCode, sendAfterChangeBindPhoneVerifyCode, sendNewDeviceEmailVerifyCode, sendNewDevicePhoneVerifyCode, emailRegisterV3 } from "http/user"
import { useMemo, useRef, useState } from "react"

export enum VerifyType {
    None = "None",
    ForgotEmailPwd = "FORGOTPASSWORDCODE",
    ForgotPhonePwd = "FORGOT_PASSWORD_CODE",
    ChangePwd = "CHANGE_PASSWORD_CODE",
    BindEmail = "EMAILBINDCODE",
    BindPhone = "BIND_CODE",
    EmailLogin = "EmailLogin",
    PhoneLogin = "PhoneLogin",
    SignUpByEmail = "EMAILREGISTERCODE",
    SignUpByPhone = "PHONE_REGISTER_CODE",
    DeactivateAccount = "LOGOUT_CODE",
    BeforeChangeBindAccount = "BEFORE_CHANGE_BIND_CODE",
    AfterChangeBindAccount = "AFTER_CHANGE_BIND_CODE",
    NewDevice = "NEW_DEVICE_CODE",
}

type MultipleMethodsVerifyParams<T extends Record<string, unknown> = {}> = Partial<Record<"phone" | "email" | "emailOrPhone" | "countryCode", string>> & T;

export type EmailSignUpVerify = {
    type: VerifyType.SignUpByEmail,
    params: MultipleMethodsVerifyParams<API.RegisterCodeParams>,
}
export type ForgotPwdEmailVerify = {
    type: VerifyType.ForgotEmailPwd,
    params: MultipleMethodsVerifyParams<{ email: string }>,
}
export type ForgotPwdPhoneVerify = {
    type: VerifyType.ForgotPhonePwd,
    params: MultipleMethodsVerifyParams<{ phone: string }>,
}
export type BindEmailVerify = {
    type: VerifyType.BindEmail,
    params: MultipleMethodsVerifyParams<{ email: string }>,
}
export type BindPhoneVerify = {
    type: VerifyType.BindPhone,
    params: MultipleMethodsVerifyParams<{ phone: string }>,
}
export type EmailLoginVerify = {
    type: VerifyType.EmailLogin,
    params: MultipleMethodsVerifyParams,
}
export type PhoneLoginVerify = {
    type: VerifyType.PhoneLogin,
    params: MultipleMethodsVerifyParams,
}
export type PhoneSignUpVerify = {
    type: VerifyType.SignUpByPhone,
    params: MultipleMethodsVerifyParams<Omit<API.UserRegisterByPhone, "verifyCode">>,
}
export type ChangePwdVerify = {
    type: VerifyType.ChangePwd,
    params: MultipleMethodsVerifyParams,
}
export type DeactivateVerify = {
    type: VerifyType.DeactivateAccount,
    params: MultipleMethodsVerifyParams,
}
export type BeforeChangeBindVerify = {
    type: VerifyType.BeforeChangeBindAccount,
    params: MultipleMethodsVerifyParams,
}
export type AfterChangeBindVerify = {
    type: VerifyType.AfterChangeBindAccount,
    params: MultipleMethodsVerifyParams,
}
export type NewDeviceVerify = {
    type: VerifyType.NewDevice,
    params: MultipleMethodsVerifyParams<API.CheckIsNewDeviceRequest & { password?: string }>,
}

export const useVerifyCode = () => {
    const spanRef = useRef<HTMLSpanElement>(null)
    const [showInterval, setShowInterval] = useState(false)
    const [verifyInfo, setVerifyInfo] = useState<EmailSignUpVerify | ForgotPwdEmailVerify | ForgotPwdPhoneVerify | BindEmailVerify | EmailLoginVerify | PhoneLoginVerify | PhoneSignUpVerify | BindPhoneVerify | ChangePwdVerify | DeactivateVerify | BeforeChangeBindVerify | AfterChangeBindVerify | NewDeviceVerify | null>(null)
    const isVerifySignUpByEmail = verifyInfo?.type === VerifyType.SignUpByEmail
    const isVerifySIgnUpByPhone = verifyInfo?.type === VerifyType.SignUpByPhone
    const isVerifyResetPwd = verifyInfo?.type === VerifyType.ForgotEmailPwd
    const isVerifyResetPwdByPhone = verifyInfo?.type === VerifyType.ForgotPhonePwd
    const isVerifyBindEmail = verifyInfo?.type === VerifyType.BindEmail
    const isVerifyBindPhone = verifyInfo?.type === VerifyType.BindPhone
    const isVerifyEmailLogin = verifyInfo?.type === VerifyType.EmailLogin
    const isVerifyPhoneLogin = verifyInfo?.type === VerifyType.PhoneLogin
    const isChangePwd = verifyInfo?.type === VerifyType.ChangePwd
    const isVerifyDeactivate = verifyInfo?.type === VerifyType.DeactivateAccount
    const isVerifyBeforeChangeBindAccount = verifyInfo?.type === VerifyType.BeforeChangeBindAccount
    const isVerifyAfterChangeBindAccount = verifyInfo?.type === VerifyType.AfterChangeBindAccount
    const isNewDeviceVerify = verifyInfo?.type === VerifyType.NewDevice
    const [tmpPassword, setTmpPassword] = useState("")
    const [reTmpPassword, setReTmpPassword] = useState("")
    const [tmpBeforeChangeBindToken, setTmpBeforeChangeBindToken] = useState("")
    const startInterval = () => {
        let sec = 59
        setShowInterval(true)
        const timer = setInterval(() => {
            if (--sec > 0) {
                if (spanRef.current) {
                    spanRef.current.innerText = String(sec)
                }
            } else {
                setShowInterval(false)
                clearInterval(timer)
            }
        }, 1000)
        return () => {
            clearInterval(timer)
            setShowInterval(false)
        }
    }

    const resend = async () => {
        if (isVerifySignUpByEmail) {
            await sendRegisterEmailCode(verifyInfo.params)
        } else if (isVerifyResetPwd) {
            await sendResetPwdCode({ email: verifyInfo.params.email! })
        } else if (isVerifyResetPwdByPhone) {
            await sendResetPasswordByPhoneVerifyCode({ phone: verifyInfo.params.phone! })
        } else if (isVerifyBindEmail) {
            await sendBindEmailCode(verifyInfo.params)
        } else if (isVerifySIgnUpByPhone) {
            await sendRegisterPhoneCode(verifyInfo.params)
        } else if (isVerifyEmailLogin) {
            await sendLoginEmailCode({ email: verifyInfo.params.email! })
        } else if (isVerifyPhoneLogin) {
            await sendLoginPhoneCode({ phone: verifyInfo.params.phone! })
        } else if (isVerifyBindPhone) {
            await sendBindPhoneCode(verifyInfo.params)
        } else if (isVerifyDeactivate) {
            if (verifyInfo.params.phone) {
                sendDeactivatePhoneCode({ phone: verifyInfo.params.phone! })
            } else {
                sendDeactivateEmailCode({ email: verifyInfo.params.email! })
            }
        } else if (isVerifyBeforeChangeBindAccount) {
            if (verifyInfo.params.phone) {
                sendBeforeChangeBindPhoneCode({ phone: verifyInfo.params.phone! })
            } else {
                sendBeforeChangeBindEmailCode({ email: verifyInfo.params.email! })
            }
        } else if (isVerifyAfterChangeBindAccount) {
            if (verifyInfo.params.phone) {
                sendAfterChangeBindPhoneCode(verifyInfo.params)
            } else {
                sendAfterChangeBindEmailCode({ email: verifyInfo.params.email! })
            }
        } else if (isNewDeviceVerify) {
            if (verifyInfo.params.type === 2) {
                sendNewDevicePhoneCode(verifyInfo.params)
            } else {
                sendNewDeviceEmailCode(verifyInfo.params)
            }
        }
        startInterval()
    }
    const sendRegisterEmailCode = (params: API.RegisterCodeParams) => {
        setVerifyInfo({type: VerifyType.SignUpByEmail, params})
        return sendRegisterVerifyCodeByEmail(params)
    }
    const sendResetPwdCode = (params: { email: string }) => {
        setVerifyInfo({type: VerifyType.ForgotEmailPwd, params})
        return sendResetPasswordVerifyCode(params)
    }
    const sendResetPwdByPhoneCode = (params: { phone: string }) => {
        setVerifyInfo({type: VerifyType.ForgotPhonePwd, params})
        return sendResetPasswordByPhoneVerifyCode(params)
    }
    const sendBindEmailCode = (params: BindEmailVerify['params']) => {
        setVerifyInfo({type: VerifyType.BindEmail, params})
        return sendBindEmailVerifyCodeV2({email: params.email!})
    }
    /** 发送邮箱登录验证码 - 免密登录 */
    const sendLoginEmailCode = (params: EmailLoginVerify['params']) => {
        setVerifyInfo({ type: VerifyType.EmailLogin, params })
        return sendLoginVerifyCodeByEmail({ email: params.email! })
    }
    /** 发送手机登录验证码 - 免密登录 */
    const sendLoginPhoneCode = (params: PhoneLoginVerify['params']) => {
        setVerifyInfo({ type: VerifyType.PhoneLogin, params })
        return sendLoginVerifyCodeByPhone({ phone: params.phone! })
    }
     /** 发送手机注册验证码 */
     const sendRegisterPhoneCode = (params: PhoneSignUpVerify['params']) => {
        setVerifyInfo({ type: VerifyType.SignUpByPhone, params })
        return sendRegisterVerifyCodeByPhone({ phone: params.phone! })
    }
     /** 绑定手机号验证码 */
     const sendBindPhoneCode = (params: BindPhoneVerify['params']) => {
        setVerifyInfo({ type: VerifyType.BindPhone, params })
        return sendBindPhoneVerifyCode({ phone: "+" + params.countryCode + params.phone! })
    }
    /** 登录后，发送修改手机密码的验证码  */
    const sendChangePhonePwd = (params: ChangePwdVerify['params']) => {
        setVerifyInfo({ type: VerifyType.ChangePwd, params })
        return sendChangePasswordPhoneVerifyCode({ phone: params.phone! })
    }
    /** 登录后，发送修改邮箱密码的验证码  */
    const sendChangeEmailPwd = (params: ChangePwdVerify['params']) => {
        setVerifyInfo({ type: VerifyType.ChangePwd, params })
        return sendChangePasswordEmailVerifyCode({ email: params.email! })
    }
     /** 发送邮箱验证码，注销账户  */
     const sendDeactivateEmailCode = (params: DeactivateVerify['params']) => {
        setVerifyInfo({ type: VerifyType.DeactivateAccount, params })
        return sendLogoutVerifyCodeByEmail({ email: params.email! })
    }
     /** 发送手机验证码，注销账户  */
     const sendDeactivatePhoneCode = (params: DeactivateVerify['params']) => {
        setVerifyInfo({ type: VerifyType.DeactivateAccount, params })
        return sendLogoutVerifyCodeByPhone({ phone: params.phone! })
    }
     /** 换绑前发送邮箱验证码，换绑邮箱帐号  */
     const sendBeforeChangeBindEmailCode = (params: BeforeChangeBindVerify['params']) => {
        setVerifyInfo({ type: VerifyType.BeforeChangeBindAccount, params })
        return sendBeforeChangeBindEmailVerifyCode({ email: params.email! })
    }
    /** 换绑前发送手机验证码，换绑手机帐号  */
    const sendBeforeChangeBindPhoneCode = (params: BeforeChangeBindVerify['params']) => {
        setVerifyInfo({ type: VerifyType.BeforeChangeBindAccount, params })
        return sendBeforeChangeBindPhoneVerifyCode({ phone: params.phone! })
    }
    /** 换绑后发送邮箱验证码，换绑邮箱帐号 */
    const sendAfterChangeBindEmailCode = (params: BeforeChangeBindVerify['params']) => {
        setVerifyInfo({ type: VerifyType.AfterChangeBindAccount, params })
        return sendAfterChangeBindEmailVerifyCode({ email: params.email! })
    }
    /** 换绑后发送邮箱验证码，换绑邮箱帐号 */
    const sendAfterChangeBindPhoneCode = (params: BeforeChangeBindVerify['params']) => {
        setVerifyInfo({ type: VerifyType.AfterChangeBindAccount, params })
        return sendAfterChangeBindPhoneVerifyCode({ phone: "+" + params.countryCode + params.phone! })
    }
    /** 发送校验是否为新设备验证码 */
    const sendNewDeviceEmailCode = (params: NewDeviceVerify['params']) => {
        setVerifyInfo({ type: VerifyType.NewDevice, params })
        return sendNewDeviceEmailVerifyCode({ email: params.emailOrPhone! })
    }
    /** 发送校验是否为新设备验证码 */
    const sendNewDevicePhoneCode = (params: NewDeviceVerify['params']) => {
        setVerifyInfo({ type: VerifyType.NewDevice, params })
        return sendNewDevicePhoneVerifyCode({ phone: params.emailOrPhone! })
    }
    const verify = async (code: string) => {
        if (verifyInfo?.type === VerifyType.SignUpByEmail) {
            return await emailRegisterV3({ ...verifyInfo.params, verifyCode: code })
        } else if (verifyInfo?.type === VerifyType.NewDevice) {
            if (verifyInfo?.params.type === 1) {
                // 
            }
            return await checkUserVerifyCode({
                email: verifyInfo!.params.email!, verifyCode: code, type: verifyInfo!.type
            })
        } else {
            if (verifyInfo?.params.phone) {
                const phoneNumber = verifyInfo!.params.phone.startsWith("+") ? verifyInfo!.params.phone : "+" + verifyInfo!.params.countryCode + verifyInfo!.params.phone;
                const res =  await checkUserPhoneVerifyCode({
                    phone: phoneNumber, verifyCode: code, type: verifyInfo!.type
                })
                typeof res.data === 'string' && res.data.length && setTmpBeforeChangeBindToken(res.data)
                return res
            }
            const res = await checkUserVerifyCode({
                email: verifyInfo!.params.email!, verifyCode: code, type: verifyInfo!.type
            })
            typeof res.data === 'string' && setTmpBeforeChangeBindToken(res.data)
            return res
        }
    }
    const numNode = useMemo(() => <span ref={spanRef}>59</span>, [])
    const value = useMemo(() => {
        return {
            numNode,
            showInterval,
            verifyInfo,
            verify,
            resend,
            tmpPassword,
            reTmpPassword,
            tmpBeforeChangeBindToken,
            isVerifySignUpByEmail,
            isVerifyResetPwd,
            isVerifyBindEmail,
            isVerifySIgnUpByPhone,
            isVerifyPhoneLogin,
            isVerifyEmailLogin,
            isVerifyResetPwdByPhone,
            isVerifyBindPhone,
            isChangePwd,
            isVerifyDeactivate,
            isVerifyBeforeChangeBindAccount,
            isVerifyAfterChangeBindAccount,
            isNewDeviceVerify,
            startInterval,
            sendRegisterEmailCode, sendResetPwdCode, sendBindEmailCode, sendLoginEmailCode, sendLoginPhoneCode, sendRegisterPhoneCode, sendResetPwdByPhoneCode,
            sendBindPhoneCode, sendChangePhonePwd, sendChangeEmailPwd, sendDeactivateEmailCode, sendDeactivatePhoneCode, sendBeforeChangeBindEmailCode, sendBeforeChangeBindPhoneCode, sendAfterChangeBindEmailCode, sendAfterChangeBindPhoneCode,
            sendNewDeviceEmailCode, sendNewDevicePhoneCode, setTmpPassword, setReTmpPassword, setTmpBeforeChangeBindToken,
        }
    }, [showInterval, verifyInfo, tmpPassword, reTmpPassword, tmpBeforeChangeBindToken])
    return value
}