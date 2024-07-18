import { useIsomorphicLayoutEffect } from "ahooks";
import { PropsWithChildren, useState } from "react";

type Props = {
  defaultShow?: boolean;
  clientCheck?: () => boolean;
  dep?: any[];
};

const ClientRenderCheck = ({
  children,
  defaultShow = false,
  clientCheck,
  dep,
}: PropsWithChildren<Props>) => {
  const [show, setShow] = useState(defaultShow);
  useIsomorphicLayoutEffect(() => {
    if (clientCheck) {
      setShow(clientCheck());
    } else {
      setShow(true);
    }
  }, [...(dep || [])]);
  return <>{show && children}</>;
};

export default ClientRenderCheck;
