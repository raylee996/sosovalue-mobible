import React, { useContext } from "react";
import Image from "next/image";
import LoginOptions from "./LoginOptions";
import NavigateWrap from "components/layout/NavigateWrap";
import { UserContext } from "store/UserStore";
import { useRouter } from "next/router";
import { thirdPartyLogin } from "http/user";
import { useThemeStore } from "store/useThemeStore";
import { telegramHelper } from "helper/telegram";

/**
 * Telegram 登录询问组件
 */
const TelegramLoginSelector: React.FC = () => {
    const { authModal } = useContext(UserContext);
    const router = useRouter(); 
    const { twitterLoginRedirect, loginSeccess } = useContext(UserContext);
    const { theme } = useThemeStore();
    const handleTelegramSignUp = async () => {
        telegramHelper.getTelegramUserData().then(async telegramUser => {
            if (!telegramUser?.id) return;

            const res = await thirdPartyLogin({
                authDate: telegramUser.auth_date,
                firstName: telegramUser.first_name,
                oauthToken: telegramUser.hash,
                photoUrl: telegramUser.photo_url,
                thirdpartyId: telegramUser.id + '',
                thirdpartyName: "telegram",
                username: telegramUser.username,
                lastName: telegramUser.last_name,
            });

            if (res.code === 40014) {
                // TODO: 直接注册，不需要打开输入用户名的弹窗
                authModal?.openEnterUsername();
            } else if (res.code === 0) {
                loginSeccess(res.data.token);
                router.push("/exp");
            }
        })
    }
    const handleEmailSignUp = () => authModal?.openSignupModal();
    const handleOtherSignUp = () => {
        router.push("/telegram/login-guide");
    };
    const handleXSignUp = () => {
        twitterLoginRedirect();
    }

    return (
        <NavigateWrap lessNavigateHeight>
            <div className="text-primary-900-White bg-primary-100-700 h-full overflow-hidden bg-[url('/img/telegram/bg-telegram-login.png')] bg-no-repeat bg-cover">
                <div className="bg-[url('/img/telegram/bg-telegram-grid.png')] justify-between h-full relative dark:text-red">
                    <div className="flex flex-col items-center bg-no-repeat bg-cover h-full pt-[16%]">
                        <Image
                            className="w-[60%] h-auto max-w-[230px]"
                            src={theme === 'light' ? "/img/logo-black-horizontal-without-alpha.png" : "/img/logo-white-horizontal-without-alpha.png"}
                            width={230}
                            height={48}
                            alt="logo"
                        ></Image>
                        <p className="font-bold mb-0 mt-4">
                            Your Gateway to Crypto Investing
                        </p>
                    </div>

                    <div className="bg-dropdown-White-800 min-h-[17.125rem] px-8 pt-8 pb-4 rounded-t-2xl absolute bottom-0 left-0 w-full">
                        <h5 className="font-bold text-xl m-0">
                            Let’s sign you in!
                        </h5>

                        <LoginOptions
                            onTelegramSignUp={handleTelegramSignUp}
                            onEmailSignUp={handleEmailSignUp}
                            onOtherSignUp={handleOtherSignUp}
                            onXSignUp={handleXSignUp}
                        />
                    </div>
                </div>
            </div>
        </NavigateWrap>
    );
};

export default TelegramLoginSelector;
