/**
 * Telegram 登录询问组件下的登录选项
 */

import React from "react";
import LoginButton from "./LoginButton";
import SendIcon from "../icons/SendIcon";
import EmailIcon from "../icons/EmailIcon";
import XIcon from "../icons/XIcon";
import { TwitterAuthV2Button } from "components/operation/auth/twitterAuthV2";

type Props = {
    onTelegramSignUp?: () => void;
    onXSignUp?: () => void;
    onEmailSignUp?: () => void;
    onOtherSignUp?: () => void;
}

const LoginOptions: React.FC<Props> = ({ onTelegramSignUp, onEmailSignUp, onOtherSignUp, onXSignUp }) => {
    return (
        <div className="mt-8 space-y-4">
            <LoginButton icon={<SendIcon />} onClick={onTelegramSignUp}>
                Continue with Telegram
            </LoginButton>
            {/* <LoginButton icon={<XIcon />} component={TwitterAuthV2Button} onClick={onXSignUp}>Continue with twitter</LoginButton> */}
            <LoginButton icon={<EmailIcon />} onClick={onEmailSignUp}>Continue with Email</LoginButton>
            <LoginButton className="justify-center text-secondary-700-100" variant="text" onClick={onOtherSignUp}>Other Options</LoginButton>
        </div>
    )
}

export default LoginOptions;