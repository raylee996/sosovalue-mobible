import { useEffect } from "react"
import { TelegramUser } from "components/telegram/TelegramLoginButton";

export interface TelegramBindParams {
  authDate: number;
  firstName: string;
  oauthToken: string;
  photoUrl: string;
  thirdpartyId: string;
  thirdpartyName: API.ThirdpartyName;
  username: string;
  lastName?: string;
}

export const useTelegramLoginResponse = (onSuccess: (res: TelegramBindParams) => void) => {
    useEffect(() => {
        window.TelegramLoginWidget = {
            dataOnAuth: (telegramUser: TelegramUser) => {
              telegramUser && onSuccess({
                authDate: telegramUser.auth_date,
                firstName: telegramUser.first_name,
                oauthToken: telegramUser.hash,
                photoUrl: telegramUser.photo_url,
                thirdpartyId: telegramUser.id + "",
                thirdpartyName: "telegram",
                username: telegramUser.username,
                lastName: telegramUser.last_name || "",
              })
            },
          };
    }, [])
}