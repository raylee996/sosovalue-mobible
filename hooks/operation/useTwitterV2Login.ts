import { useEffect } from "react";
import { useRouter } from "next/router";
import { TWITTER_AUTH_STATE } from "components/operation/auth/twitterAuthV2";
import useTelegramStore from "store/useTelegramStore";

interface Props {
    /** 成功获取twitter的url回调参数 */
    onSuccess: (redirectSearch: { code: string; state: string }) => Promise<void>;
}

export const useTwitterV2Login = ({ onSuccess }: Props) => {
    const router = useRouter();
    const { isTelegram, telegramBotInfo } = useTelegramStore();
    
    useEffect(() => {
        if (!router.query.code || router.query.state !== TWITTER_AUTH_STATE || !telegramBotInfo?.appName)
            return;

        typeof onSuccess === "function" &&
            onSuccess({
                code: router.query.code as string,
                state: router.query.state as string,
            }).then(() => {
                if (!isTelegram) return;
                // 如果在telegram内，跳转到telegram机器人
                window.location.href = `https://t.me/${telegramBotInfo.appName}`;
            });
    }, [router.query]);
};
