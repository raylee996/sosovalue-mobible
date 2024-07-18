import { Button, type ButtonProps } from "@mui/material";
import { createTwitterOauthV2Url } from "helper/link";
import { generateCodeChallenge } from "./generateCodeChallenge";
import useTelegramStore from "store/useTelegramStore";
import { telegramHelper } from "helper/telegram";

/**
 * 推特 oauth2.0 登录按钮
 * - 外部不能传  "onClick"、"onClickCapture" 事件，由内部封装
 */
const TwitterAuthV2Button: React.FC<
    Omit<ButtonProps, "onClick" | "onClickCapture">
> = ({ children, ...restButtonProps }) => {
    const { isTelegram } = useTelegramStore();
    const handleAuth = async () => {
        const codeChallenge = await generateCodeChallenge();
        const url = createTwitterOauthV2Url(codeChallenge);
        isTelegram ? telegramHelper.openBrowser(url) : window.open(url, '_self', 'popup');
    };

    return (
        <Button variant="contained" {...restButtonProps} onClick={handleAuth}>
            {children}
        </Button>
    );
};

export default TwitterAuthV2Button;
