import { useContext } from "react"
import { UserContext } from "store/UserStore"
import { AuthMethodTab } from "./useAuthModal";


/**
 * 处理邮箱、手机帐号绑定绑定
 */
export const useAccountBind = () => {
  const { authModal } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const isBindEmail = !!user?.email;
  // @ts-ignore TODO: 等后端更新用户接口
  const isBindPhone = !!user?.phone;
  const toConnect = (type: AuthMethodTab) => {
    authModal?.openBindAccount(type)
    console.log('toConnect', type);
  }

  return {
    isBindEmail,
    isBindPhone,
    toConnect,
  }
}