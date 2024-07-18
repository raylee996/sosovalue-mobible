import React, { useRef, useEffect, useState } from "react";
import { cn } from "helper/cn";
import useTelegramStore from "store/useTelegramStore";
import { getTelegramBotInfo } from "http/telegram";

export interface TelegramUser extends WebAppUser {
    id: number;
    first_name: string;
    username: string;
    photo_url: string;
    auth_date: number;
    hash: string;
}

interface Props extends  React.HTMLProps<HTMLDivElement>{
    usePic?: boolean;
    className?: string;
    cornerRadius?: number;
    requestAccess?: boolean;
    dataAuthUrl?: string;
    /** telegram登录成功回调 */
    onAuthSuccess?: (user: TelegramUser) => void;
    buttonSize?: "large" | "medium" | "small";
}

declare global {
    interface Window {
        TelegramLoginWidget: {
            dataOnAuth: (user: TelegramUser) => void;
        };
    }
}

// 本地调试用的机器人名称
// const BOT_NAME = "testsosovalue_Bot";

/**
 * 根据官方文档实现的 telegram 登录按钮
 * @see https://core.telegram.org/widgets/login
 */
const TelegramLoginButton: React.FC<Props> = ({
    dataAuthUrl,
    usePic = false,
    className,
    buttonSize = "large",
    onAuthSuccess,
    cornerRadius,
    requestAccess = true,
    ...elementProps
}) => {
    const { onClick, ...restElementProps } = elementProps;
    const ref = useRef<HTMLDivElement>(null);
    const isScriptLoadedRef = useRef(false)
    const { telegramBotInfo } = useTelegramStore();
    const [botName, setBotName] = useState<string>()
    useEffect(() => {
        getTelegramBotInfo("2").then((res) => {
            res.data && setBotName(res.data.username);
        });
    }, [])

    const handleRootClick = (e: React.MouseEvent<HTMLDivElement>) => {
        typeof onClick === 'function' && onClick(e);
    }

    useEffect(() => {
        if (ref.current === null || !telegramBotInfo?.username || !botName) return;
        const parentNode = ref.current.parentNode as HTMLElement;
        parentNode.style.cssText += "position: relative";
        ref.current.style.cssText += `position: absolute;left: 0;top: 0; width: ${parentNode.clientWidth}px;height: ${parentNode.clientHeight}px;background-color: opacity; overflow: hidden;`;
        
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", botName);
        script.setAttribute("data-size", buttonSize);
        script.onload = () => {
            isScriptLoadedRef.current = true;
            const iframe = ref.current?.querySelector<HTMLIFrameElement>('iframe');
            if (!iframe) return;
            iframe.style.opacity = "0.00000001";
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            

            iframe.onload = () => {
                iframe.style.transform = 'scaleY(3)';
            }
        }

        if (cornerRadius !== undefined) {
            script.setAttribute("data-radius", cornerRadius.toString());
        }

        if (requestAccess) {
            script.setAttribute("data-request-access", "write");
        }

        script.setAttribute("data-userpic", usePic.toString());

        if (typeof dataAuthUrl === "string") {
            script.setAttribute("data-auth-url", dataAuthUrl);
        } else {
            script.setAttribute(
                "data-onauth",
                "TelegramLoginWidget.dataOnAuth(user)"
            );
        }

        script.async = true;
        ref.current.appendChild(script);
    }, [telegramBotInfo?.username, botName]);

    return <div ref={ref} className={cn(className, 'cursor-pointer')} {...restElementProps} onClick={handleRootClick} />;
};

export default TelegramLoginButton;
