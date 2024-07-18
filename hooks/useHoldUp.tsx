import { isPwa, parseUA } from "helper/tools";
import useTelegramStore from "store/useTelegramStore";

const useHoldUp = () => {
  const { isTelegram } = useTelegramStore();
  const ua = parseUA();

  return ua.isIos && (isPwa() || isTelegram)
}

export default useHoldUp
