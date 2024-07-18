import { useEventEmitter } from "ahooks";
import { EventEmitter } from "ahooks/lib/useEventEmitter";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";

type DirtyContext = {
  event?: { navigate: EventEmitter<NavigateEvent> };
};
const DirtyContext = createContext<DirtyContext>({});

enum NavigateEvent {
  ClickHome,
  ClickResearch,
}
type NavigateEventOption = {
  onClickHome?: () => void;
  onClickResearch?: () => void;
};
export const useNavigateEvent = (option?: NavigateEventOption) => {
  const { event } = useContext(DirtyContext);
  event?.navigate.useSubscription((event: NavigateEvent) => {
    if (event === NavigateEvent.ClickHome) {
      option?.onClickHome?.();
    } else if (event === NavigateEvent.ClickResearch) {
      option?.onClickResearch?.();
    }
  });
  const navigate = useMemo(
    () => ({
      navigate: event?.navigate,
      emitClickHome() {
        return event?.navigate.emit(NavigateEvent.ClickHome);
      },
      emitClickResearch() {
        return event?.navigate.emit(NavigateEvent.ClickResearch);
      },
    }),
    [event?.navigate]
  );
  return navigate;
};

const useEvent = () => {
  const navigate = useEventEmitter<NavigateEvent>();
  return useMemo(() => ({ navigate }), []);
};
const DirtyStore = ({ children }: PropsWithChildren) => {
  const event = useEvent();
  const value = useMemo(
    () => ({
      event,
    }),
    []
  );
  return (
    <DirtyContext.Provider value={value}>{children}</DirtyContext.Provider>
  );
};

export default DirtyStore;
