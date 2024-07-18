import { useEffect, useRef } from "react";
import { ResponseWrap } from "helper/request";
import { getToken } from "helper/storage";
import { telegramHelper } from "helper/telegram";
import { getCurrentUser, thirdPartyLogin } from "http/user";
import useTelegramStore from "store/useTelegramStore";

interface Props {
    onSuccess?: (loginData: ResponseWrap<API.LoginResult>) => void;
}

export const useTelegramAccountBind = ({ onSuccess }: Props) => {
    const { setTelegramUser, setIsTelegram } = useTelegramStore();
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleAutoBind = async () => {
        telegramHelper.getTelegramUserData().then(async (telegramUser) => {
            if (!telegramUser?.id) return;
            setIsTelegram(true);
            telegramUser && setTelegramUser(telegramUser);
            const token = getToken();
            if (token) {
                const user = await getCurrentUser();
                if (user?.data?.id)  return;
            }
            thirdPartyLogin({
                authDate: telegramUser?.auth_date,
                firstName: telegramUser?.first_name,
                oauthToken: telegramUser?.hash,
                photoUrl: telegramUser?.photo_url,
                thirdpartyId: telegramUser?.id + "",
                thirdpartyName: "telegram",
                username: telegramUser?.username,
                lastName: telegramUser?.last_name,
            }).then(onSuccess);
        });
    };

    useEffect(() => {
        timer.current = setTimeout(() => {
            handleAutoBind();
        }, 0);

        return () => {
            timer.current && clearTimeout(timer.current);
        }
    }, []);
};
