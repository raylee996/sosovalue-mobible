import { useContext, useState } from "react";
import type { AccountSwitcherValidData, AccountSwitcherValue } from "./AccountSwitcher";
import type { LoginMode } from "../LoginMethodsSelector";
import { UserContext } from "store/UserStore";

/**
 * 简化 AccountSwitcher组件 逻辑hooks。
 * 可以由该hook代理 AccountSwitcher组件 的以下方法，并返回对应方法的结果
 * - loginMethod 登录方式，密码或验证码
 * - accountValue 邮箱或手机的值
 * - accountType "phone" | "email
 * - isAccountValid 邮箱或手机的验证是否成功
 * 
 * actions:
 * - onSwitchAuthMethod 切换帐号类型，邮箱或手机
 * - onValidate 验证结果，邮箱或手机
 * - onValueChange account的值，邮箱或手机
 */
const useAccountSwitcher = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMode>("password");
  const [valueData, setValueData] = useState<AccountSwitcherValue>({
    phone: "",
    email: "",
    areaCode: "1"
  });
  const [validData, setValidData] = useState<AccountSwitcherValidData>({
    phone: false,
    email: false,
  });
  const { authModal } = useContext(UserContext);
  const isAccountValid = authModal?.showEmailTab
  ? validData.email
  : validData.phone;
  const accountValue = authModal?.showEmailTab ? valueData.email : valueData.phone;
  const accountType = authModal?.showEmailTab ? "email" : "phone";

  const onSwitchAuthMethod = (value: LoginMode) => {
    setLoginMethod(value);
  };
  const onValidate = (validData: AccountSwitcherValidData) => {
    setValidData(validData);
  };
  const onValueChange = (value: AccountSwitcherValue) => {
    setValueData(value);
  };

  return {
    loginMethod,
    accountValue,
    accountType,
    isAccountValid,
    areaCode: valueData.areaCode,

    actions: {
      onValueChange,
      onValidate,
      onSwitchAuthMethod,
    }
  };
}

export default useAccountSwitcher;
