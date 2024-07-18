import { create } from "zustand";
import type { TelegramUser } from "components/telegram/TelegramLoginButton";

type State = {
  isTelegram: boolean;
  telegramUser: TelegramUser | null;
  telegramBotInfo: API.TelegramBotInfo | null;
};

type Action = {
  setIsTelegram: (bool: boolean) => void;
  setTelegramUser: (user: TelegramUser) => void;
  setTelegramBotInfo: (botInfo: API.TelegramBotInfo) => void;
};

const useTelegramStore = create<State & Action>((set) => {
  return {
    isTelegram: false,
    telegramUser: null,
    telegramBotInfo: null,
    setIsTelegram: bool => set({ isTelegram: bool }),
    setTelegramUser: user => set({ telegramUser: user }),
    setTelegramBotInfo: botInfo => set({ telegramBotInfo: botInfo })
  };
});

export default useTelegramStore;
