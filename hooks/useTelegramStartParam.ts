import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useTelegramStore from "store/useTelegramStore";

interface Props {
    /** 匹配的key */
    searchKey: string;
    /**
     * 分隔符
     * @default "-"
     */
    separator?: string;
    /** 有值后的成功回调。invitationCode至少是一个空字符串 "" */
    onReceive?: (value: string, invitationCode: string) => void;
}

/**
 * 获取telegram中start参数（tgWebAppStartParam）
 * @example
 * ```ts
 * const result = useTelegramStartParam({ searchKey: INVITE_CODE_KEY, separator: "-", onReceive: value => { ... });
 * ```
 */
export const useTelegramStartParam = ({ searchKey, separator = "-", onReceive }: Props) => {
    const { isTelegram } = useTelegramStore();
    const router = useRouter();
    const [result, setResult] = useState("");
    const received = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {     
        if (!isTelegram || received.current) return;

        timerRef.current = setTimeout(() => {
            const tgWebAppStartParam = router.query.tgWebAppStartParam;
            if (tgWebAppStartParam) {
                const [key, value, invitationCode] = (tgWebAppStartParam as string).split(separator);
                if (searchKey === key) {
                    setResult(value);
                    typeof onReceive === "function" && onReceive(value, invitationCode || "");
                    received.current = true;
                }
            }
        }, 0);

        return () => {
            timerRef.current && clearTimeout(timerRef.current)
        };
    }, [router.query.tgWebAppStartParam, isTelegram, received.current]);

    return result;
};