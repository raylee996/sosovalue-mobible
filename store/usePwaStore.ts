import { isInStandaloneMode } from "helper/tools";
import { useEffect, useRef } from "react";
import { create } from "zustand";

type State = {
  isInStandalone: boolean;
  isReadyInstall: boolean;
  installEvent?: any;
};

type Action = {};

const usePwaStore = create<State & Action>((set, get) => {
  return {
    isInStandalone: false,
    isReadyInstall: false,
    installEvent: null,
  };
});

type Option = {
  onAppinstalled?: () => void;
};

export const useInstallPWA = (option?: Option) => {
  useEffect(() => {
    const beforeinstallprompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      usePwaStore.setState({ isReadyInstall: true, installEvent: e });
    };
    const appinstalled = (e: Event) => {
      option?.onAppinstalled?.();
      usePwaStore.setState({ installEvent: null });
    };
    const displayModeChange = (evt: any) => {
      usePwaStore.setState({ isInStandalone: !!evt.matches });
    };
    window.addEventListener("beforeinstallprompt", beforeinstallprompt);
    window.addEventListener("appinstalled", appinstalled);
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", displayModeChange);
    usePwaStore.setState({ isInStandalone: isInStandaloneMode() });
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeinstallprompt);
      window.removeEventListener("appinstalled", appinstalled);
      window.removeEventListener("appinstalled", displayModeChange);
    };
  }, []);
  const installPWA = async () => {
    const installEvent = usePwaStore.getState().installEvent;

    installEvent.prompt();
    // Wait for the user to respond to the prompt
    const e = await installEvent.userChoice;
    // Optionally, send analytics event with outcome of user choice
    // We've used the prompt, and can't use it again, throw it away
    usePwaStore.setState({ installEvent: null });
  };
  return {
    installPWA,
  };
};

export default usePwaStore;
