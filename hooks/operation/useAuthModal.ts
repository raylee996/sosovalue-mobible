import { useMemo, useState } from "react"

export enum AuthModal {
    None,
    LoginSignUp,
    LinkSignUp,
    ResetSendEmail,
    ResetPwd,
    EnterUsername,
    VerifyCode,
    EnhanceSecurity,
    OneClickLogin,
    ReferralKey,
    TelegramLoginSelector,
    BindAccount,
    DeactivateAccount,
    AuthMethods,
    ChangePwd,
    ChangeBindAccount,
}

enum LoginTab {
    SignUp = "register",
    Login = "login",
}

/** 邮箱、手机注册/登录方式 */
export enum AuthMethodTab {
    Email = "email",
    Phone = "phone",
}

export const IsAllowRegister = true

const LoginTabIndex = LoginTab.SignUp;

export const useAuthModal = () => {
    const [loginTabIndex, setLoginTabIndex] = useState(LoginTabIndex)
    const [bindAccountTab, setBindAccountTab] = useState(AuthMethodTab.Email);
    const [authModal, setAuthModal] = useState<AuthModal>(AuthModal.None)
    const [loginMethodTabIndex, setLoginMethodTabIndex] = useState(AuthMethodTab.Email)
    const [changeBindMethod, setChangeBindMethod] = useState<AuthMethodTab>(AuthMethodTab.Email);
    const [closeModalCallback, setModalCloseCallback] = useState<Function | null>(null);

    
    const openLoginTab = () => {
        setLoginTabIndex(LoginTab.Login)
    }
    const openSignUpTab = () => {
        setLoginTabIndex(LoginTab.SignUp)
    }
    /** 打开邮箱验证方式 */
    const openAuthByEmailTabIndex = () => {
        setLoginMethodTabIndex(AuthMethodTab.Email)
    }
    /** 打开手机验证方式 */
    const openAuthByPhoneTabIndex = () => {
        setLoginMethodTabIndex(AuthMethodTab.Phone)
    }
    const resetCloseModalCallback = () => {
        setModalCloseCallback(null);
    }
    const closeModal = () => {
        setAuthModal(AuthModal.None);
        resetCloseModalCallback();
    }
    const openLoginModal = () => {
        setAuthModal(AuthModal.LoginSignUp)
        setLoginTabIndex(LoginTab.Login)
    }
    const openSignupModal = (_closeModalCallback?: Function) => {
        if (_closeModalCallback) {
            setModalCloseCallback(_closeModalCallback);
        }
        setAuthModal(AuthModal.LoginSignUp)
        setLoginTabIndex(LoginTab.SignUp)
    }
    const openOnelickLogin = () => {
        setAuthModal(AuthModal.OneClickLogin)
    }
    const openVerifyCode = () => {
        setAuthModal(AuthModal.VerifyCode)
    }
    const openResetSendEmail = () => {
        setAuthModal(AuthModal.ResetSendEmail)
    }
    const openResetPwd = () => {
        setAuthModal(AuthModal.ResetPwd)
    }
    const openEnterUsername = () => {
        setAuthModal(AuthModal.EnterUsername)
    }
    const openEnhanceSecurity = () => {
        setAuthModal(AuthModal.EnhanceSecurity)
    }
    const openLinkSignUp = () => {
        setAuthModal(AuthModal.LinkSignUp)
    }
    const openReferralKey = () => {
        setAuthModal(AuthModal.ReferralKey)
    }
    /** 打开Telegram登录询问弹窗 */
    const openTelegramSelectorModal = () => {
        setAuthModal(AuthModal.TelegramLoginSelector);
    }
    const openBindAccount = (type: AuthMethodTab) => {
        setBindAccountTab(type);
        setAuthModal(AuthModal.BindAccount);
    }
    const openDeactivateAccount = () => {
        setAuthModal(AuthModal.DeactivateAccount);
    }
    const openAuthMethodSelector = () => {
        setAuthModal(AuthModal.AuthMethods);
    }
    const openChangePwd = () => {
        setAuthModal(AuthModal.ChangePwd);
    }
    const openChangeBindAccountByPhone = () => {
        setChangeBindMethod(AuthMethodTab.Phone);
        setAuthModal(AuthModal.ChangeBindAccount);
    }
    const openChangeBindAccountByEmail = () => {
        setChangeBindMethod(AuthMethodTab.Email);
        setAuthModal(AuthModal.ChangeBindAccount);
    }
    
    return useMemo(() => {
        return {
            authModal, loginTabIndex,
            open: authModal !== AuthModal.None,
            loginMethodTabIndex,

            openLoginTab, openSignUpTab,

            showSignUpTab: loginTabIndex === LoginTab.SignUp,
            showLoginTab: loginTabIndex === LoginTab.Login,
            showEmailTab: loginMethodTabIndex === AuthMethodTab.Email,
            showPhoneTab: loginMethodTabIndex === AuthMethodTab.Phone,

            showAuthModal: authModal !== AuthModal.None,
            showLoginSignUp: authModal === AuthModal.LoginSignUp,
            showLinkSignUp: authModal === AuthModal.LinkSignUp,
            showResetSendEmail: authModal === AuthModal.ResetSendEmail,
            showResetPwd: authModal === AuthModal.ResetPwd,
            showEnterUsername: authModal === AuthModal.EnterUsername,
            showVerifyCode: authModal === AuthModal.VerifyCode,
            showEnhanceSecurity: authModal === AuthModal.EnhanceSecurity,
            showOneClickLogin: authModal === AuthModal.OneClickLogin,
            showReferralKey: authModal === AuthModal.ReferralKey,
            showTelegramLoginSelector: authModal === AuthModal.TelegramLoginSelector,

            showBindAccount: authModal === AuthModal.BindAccount,
            showBindEmail: bindAccountTab === AuthMethodTab.Email,
            showBindPhone: bindAccountTab === AuthMethodTab.Phone,
            showDeactivateAccount: authModal === AuthModal.DeactivateAccount,
            showAuthMethods: authModal === AuthModal.AuthMethods,
            showChangePwd: authModal === AuthModal.ChangePwd,
            showChangeBindAccount: authModal === AuthModal.ChangeBindAccount,
            showChangeBindPhone: changeBindMethod === AuthMethodTab.Phone,
            showChangeBindEmail: changeBindMethod === AuthMethodTab.Email,

            closeModal, openLoginModal, openOnelickLogin, openSignupModal, openVerifyCode, openResetPwd, openResetSendEmail, openEnterUsername, openEnhanceSecurity, openLinkSignUp, openReferralKey, openTelegramSelectorModal, openAuthByEmailTabIndex, openAuthByPhoneTabIndex, openBindAccount, openDeactivateAccount, openAuthMethodSelector, openChangePwd,
            openChangeBindAccountByPhone, openChangeBindAccountByEmail,

            closeModalCallback,
            resetCloseModalCallback,
        }
    }, [authModal, loginTabIndex, loginMethodTabIndex, bindAccountTab])
}