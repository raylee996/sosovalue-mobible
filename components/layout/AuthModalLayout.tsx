import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  forwardRef,
} from "react";
import { cn } from "helper/cn";

type Props = PropsWithChildren<{
  title?: ReactNode;
  secondaryTitle?: ReactNode;
}> &
  HTMLAttributes<HTMLDivElement>;

/**
 * 作用于全屏弹窗的布局。比如用于authModal.openXXX()方法的弹窗
 */
const AuthModalLayout: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { children, className, title = null, secondaryTitle = null, ...rest },
  ref
) => {
  return (
    <div
      className={cn("p-8 flex flex-col space-y-5 text-primary-900-White", className)}
      ref={ref}
      {...rest}
    >
      {(title || secondaryTitle) && (
        <div className="text-center">
          {title && <h5 className="m-0 text-xl font-bold">{title}</h5>}
          {secondaryTitle && <span className="text-base">{secondaryTitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
};

export default forwardRef(AuthModalLayout);
