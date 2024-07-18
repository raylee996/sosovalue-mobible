import React, { MouseEvent, useContext, type PropsWithChildren, type ReactElement } from "react";
import { UserContext } from "store/UserStore";

/**
 * 没有登录态时，拦截用户操作，弹出登录框。或者执行自定义操作 customAction
 */
const InterceptionToken: React.FC<PropsWithChildren & { customAction?: () => void }> = ({ children, customAction }) => {
  const { user, authModal } = useContext(UserContext);
  
  const renderChildren = () => {
    const _children = children as ReactElement;
    return React.cloneElement(_children as ReactElement, {
      onClick: (e: MouseEvent<HTMLElement>) => {
        if (!user) {
          e.preventDefault();
          if (typeof customAction === "function") {
            customAction();
          } else {
            authModal?.openLoginModal();
          }
        } else {
          _children?.props?.onClick?.(e);
        }
      }
    })
  }
  return <React.Fragment>{renderChildren()}</React.Fragment>
}

export default InterceptionToken;