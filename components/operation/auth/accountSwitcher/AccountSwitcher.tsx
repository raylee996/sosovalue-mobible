import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "store/UserStore";
import { AuthHandle, type AuthInputFieldProps } from "../AuthInputField";
import LoginMethodsSelector, { type LoginMode } from "../LoginMethodsSelector";
import { ValidateOptions } from "hooks/operation/useFieldValidate/type";
import Tabs from "components/base/tabs";
import { AuthMethodTab } from "hooks/operation/useAuthModal";
import Email from "../Email";
import Phone from "../Phone";
import { useTCenter, useTCommon } from "hooks/useTranslation";

export interface AccountSwitcherValidData {
  phone: boolean;
  email: boolean;
}

export interface AccountSwitcherValue {
  phone: string;
  email: string;
  areaCode?: string;
}

export type AccountType = "email" | "phone";

export interface AccountSwitcher {
  /** 支持验证码和密码两种验证方式，可以切换 */
  onSwitchAuthMethod?: (value: LoginMode) => void;
  /** field验证是否通过 */
  onValidate?: (validData: AccountSwitcherValidData) => void;
  onValueChange?: (value: AccountSwitcherValue) => void;
  renderTip?: {
    email?: AuthInputFieldProps["renderTip"];
    phone?: AuthInputFieldProps["renderTip"];
  };
  /**
   * 该rules是对邮箱或手机验证的补充，比如异步验证。基本的手机或邮箱验证在该组件实现即可
   */
  rules?: {
    email?: ValidateOptions;
    phone?: ValidateOptions;
  };
  showLabelSuffix?: boolean;
}

/** 手机/邮箱帐号类型切换 */
const AccountSwitcher: React.FC<AccountSwitcher> = ({
  onSwitchAuthMethod,
  onValidate,
  onValueChange,
  renderTip,
  rules,
  showLabelSuffix = false,
}) => {
  const { authModal } = useContext(UserContext);
  const validDataRef = useRef({ phone: false, email: false });
  const valueRef = useRef({ phone: "", email: "" });
  const { t: tCommon } = useTCommon();
  const [areaCode, setAreaCode] = useState("1");
  const supportMultipleAuthMethods = typeof onSwitchAuthMethod === "function";
  const authRef = useRef<AuthHandle | null>(null);
  /** 切换登录方式，验证码/密码登录 */
  const switchAuthMethod = (value: LoginMode) => {
    supportMultipleAuthMethods && onSwitchAuthMethod(value);
  };
  const handleValid = (type: AccountType, value: boolean) => {
    validDataRef.current[type] = value;
    onValidate?.({ ...validDataRef.current, [type]: value });
  };
  const handleValueChange = (type: AccountType, value: string) => {
    onValueChange?.({ ...valueRef.current, [type]: value.trim(), areaCode });
  };
  const handleAreaCodeChange = (areaCode: string) => {
    authRef.current?.resetValid();
    setAreaCode(areaCode);
    onValidate?.(validDataRef.current);
  };
  const selectLoginMethod = (value: AuthMethodTab) => {
    const actions = {
      email: authModal?.openAuthByEmailTabIndex,
      phone: authModal?.openAuthByPhoneTabIndex,
    };
    actions[value]?.();
  };
  useEffect(() => {
    // switchAuthMethod("password");
  }, [authModal?.showPhoneTab]);

  return (
    <div className="flex flex-col space-y-5">
      <Tabs
        variant="contained"
        size="xs"
        onChange={selectLoginMethod}
        value={authModal?.loginMethodTabIndex}
      >
        <Tabs.Item value={AuthMethodTab.Email}>{tCommon("Email")}</Tabs.Item>
        <Tabs.Item value={AuthMethodTab.Phone}>{tCommon("Phone")}</Tabs.Item>
      </Tabs>
      {authModal?.showPhoneTab ? (
        <Phone
          key="phone"
          authRef={authRef}
          areaCode={areaCode}
          labelSuffix={
            showLabelSuffix && (
              <LoginMethodsSelector onChange={switchAuthMethod} />
            )
          }
          onValidate={(valid) => handleValid("phone", valid)}
          onChange={(e) => handleValueChange("phone", e.target.value)}
          onAreaCodeChange={handleAreaCodeChange}
          renderTip={renderTip?.phone}
          rules={{
            ...rules?.phone,
          }}
        />
      ) : (
        <Email
          key="email"
          labelSuffix={
            showLabelSuffix && (
              <LoginMethodsSelector onChange={switchAuthMethod} />
            )
          }
          onValidate={(valid) => handleValid("email", valid)}
          onChange={(e) => handleValueChange("email", e.target.value)}
          renderTip={renderTip?.email}
          rules={{
            ...rules?.email,
          }}
        />
      )}
    </div>
  );
};

export default AccountSwitcher;
