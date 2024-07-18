import { useControlled } from "hooks/useController";
import { useTCommon } from "hooks/useTranslation";
import { useState } from "react";

export type LoginMode = "password" | "verifyCode";
interface Props {
  onChange: (mode: LoginMode) => void;
  value?: LoginMode;
  /**
   * @default 'password'
   */
  defaultMode?: LoginMode;
}

/**
 * 登录方式选择器，可选择：
 * - 手机验证码/密码登录
 * - 邮箱验证码/密码登录
 */
const LoginMethodsSelector: React.FC<Props> = ({
  defaultMode = "password",
  onChange,
  value,
}) => {
  const [mode, setMode] = useControlled({ controlled: value, default: defaultMode, onChange });
  const { t } = useTCommon();
  // 文案与状态相反
  const loginStrategies = {
    password: {
      label: t("use code login"),
    },
    verifyCode: {
      label: t("use password login"),
    },
  };
  const selectedStrategy = loginStrategies[mode];

  const toggleMode = () => {
    const _mode = mode === "password" ? "verifyCode" : "password";
    setMode(_mode);
  };

  return (
    <span className="cursor-pointer select-none" onClick={() => toggleMode()}>
      {selectedStrategy.label}
    </span>
  );
};

export default LoginMethodsSelector;
