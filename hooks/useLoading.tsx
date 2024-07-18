import {
  ElementType,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ScaleLoader from "components/base/ScaleLoader";

const useLoading = () => {
  const [show, setShow] = useState(true);
  const resolveRef = useRef<(value: any) => void>();
  const start = () => setShow(true);
  const close = () => {
    setShow(false);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };
  const Component = useMemo(() => {
    const LoadingComponent = ({
      children,
      className,
    }: {
      children: JSX.Element;
      className?: string;
    }) => {
      useEffect(() => {
        show && resolveRef.current && resolveRef.current(null);
      }, []);
      return show ? (
        <div
          className={`${
            className ? className : ""
          } w-full h-full flex items-center justify-center float-left bg-background-primary-White-900`}
        >
          <ScaleLoader />
        </div>
      ) : (
        children
      );
    };
    return LoadingComponent;
  }, [show]);
  return {
    start,
    close,
    Component,
  };
};

export default useLoading;
