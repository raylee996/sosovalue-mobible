import { isInStandaloneMode } from "helper/tools";
import { useMemo, useRef, useState } from "react";

const useModalConfig = () => {
  const [show, setShow] = useState(false);
  const resolveRef = useRef<(value: null) => void>();
  const modal = useMemo(
    () => ({
      show,
      open: () => {
        setShow(true);
        return new Promise<null>((resolve) => {
          resolveRef.current = resolve;
        });
      },
      close: () => {
        setShow(false);
        resolveRef.current && resolveRef.current(null);
      },
      reset: () => {
        setShow(false);
      },
    }),
    [show]
  );
  return modal;
};

export const useUserModal = () => {
  const introduce = useModalConfig();
  const whatsNew = useModalConfig();
  const notifyPermission = useModalConfig();
  const oneClickLogin = useModalConfig();
  const [tooltipPath, setTooltipPath] = useState<string | null>(null);
  const resolveRef = useRef<(value: null) => void>();
  const tooltipGuide = useMemo(
    () => ({
      tooltipPath,
      open: (path: string) => {
        setTooltipPath(path);
        return new Promise<null>((resolve) => {
          resolveRef.current = resolve;
        });
      },
      close: () => {
        setTooltipPath(null);
        resolveRef.current && resolveRef.current(null);
      },
      reset: () => {
        setTooltipPath(null);
      },
    }),
    [tooltipPath]
  );
  const helpDoc = useModalConfig();
  const [installPwaShow, setInstallPwaShow] = useState(false);
  const installPwa = useMemo(
    () => ({
      show: installPwaShow,
      open: () => {
        setInstallPwaShow(true);
      },
      onceOpen: () => {
        const isShowInstallModal = sessionStorage.getItem("isShowInstallModal");
        if (!isInStandaloneMode() && !isShowInstallModal) {
          sessionStorage.setItem("isShowInstallModal", "no");
          setInstallPwaShow(true);
        }
      },
      close: () => {
        setInstallPwaShow(false);
      },
      reset: () => {
        setInstallPwaShow(false);
      },
    }),
    [installPwaShow]
  );
  const reset = () => {
    introduce.reset();
    whatsNew.reset();
    oneClickLogin.reset();
    tooltipGuide.reset();
    helpDoc.reset();
    installPwa.reset();
  };
  const userModal = useMemo(
    () => ({
      introduce,
      whatsNew,
      notifyPermission,
      oneClickLogin,
      tooltipGuide,
      helpDoc,
      installPwa,
      reset,
    }),
    [
      introduce,
      whatsNew,
      oneClickLogin,
      tooltipGuide,
      helpDoc,
      installPwa,
      notifyPermission,
    ]
  );
  return userModal;
};
