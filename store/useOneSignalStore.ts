import { create } from "zustand";
import OneSignal from "react-onesignal";
import { setIsAllowNotify } from "helper/storage";
import { getOneSignalId } from "helper/config";
import { useEffect, useState } from "react";
import { createSubscription, getSubscriptionList } from "http/user";
import { useShallow } from "zustand/react/shallow";
import { trackConfigNotification } from "helper/track";

declare type PushSubscriptionNamespaceProperties = {
  id: string | null | undefined;
  token: string | null | undefined;
  optedIn: boolean;
};
declare type SubscriptionChangeEvent = {
  previous: PushSubscriptionNamespaceProperties;
  current: PushSubscriptionNamespaceProperties;
};

type State = {
  isInitialized: boolean;
  isSubscription: boolean;
};

type Action = {
  initOneSignal: () => void;
  openOrCloseSubscription: (open: boolean) => void;
  checkIsUserSubscription: (user: User.UserInfo) => void;
  userSubscriptionEffect: (user?: User.UserInfo | null) => void;
};

const createOneSignalId = () => {
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    if (window.location.origin.endsWith("com")) {
      return "801e4843-39b1-4666-9842-a1fbe1f960cf";
    } else {
      return "a66886e9-ddaf-4ffa-80a3-b42d05bf0686";
    }
  } else {
    if (window.location.origin.endsWith("com")) {
      return "67fcf20f-b729-4ae7-ad2f-42c20dddc747";
    } else {
      return "28237586-d74d-4147-bb53-f07925f4eaa4";
    }
  }
};

const useOneSignalStore = create<State & Action>((set, get) => {
  return {
    isInitialized: false,
    isSubscription: false,
    initOneSignal() {
      const { isInitialized, openOrCloseSubscription } = get();
      const permissionChange = (permission: boolean) => {
        openOrCloseSubscription(permission);
        setIsAllowNotify(permission);
      };
      const pushOnChange = (event: SubscriptionChangeEvent) => {
        trackConfigNotification(event.current.id && event.current.optedIn?1:0);
        if (event.current.id && event.current.optedIn) {
          set({ isSubscription: true });
        } else {
          set({ isSubscription: false });
        }
      };
      OneSignal.init({
        appId: createOneSignalId(),
        serviceWorkerParam: { scope: "/push/onesignal/" },
        serviceWorkerPath: "push/onesignal/OneSignalSDKWorker.js",
      }).then(() => {
        if (isInitialized) {
          return;
        }
        set({ isInitialized: true });
        if (
          OneSignal.User.PushSubscription.optedIn &&
          OneSignal.User.PushSubscription.id
        ) {
          set({ isSubscription: true });
        }
        OneSignal.Notifications.addEventListener(
          "permissionChange",
          permissionChange
        );
        OneSignal.User.PushSubscription.addEventListener(
          "change",
          pushOnChange
        );
      });
    },
    openOrCloseSubscription(open: boolean) {
      if (open) {
        OneSignal.User.PushSubscription.optIn();
        //   if (OneSignal.Notifications.permission) {
        //     OneSignal.User.PushSubscription.optIn();
        //   } else {
        //     OneSignal.Notifications.requestPermission();
        //   }
      } else {
        OneSignal.User.PushSubscription.optOut();
      }
      setIsAllowNotify(open);
    },
    async checkIsUserSubscription(user: User.UserInfo) {
      const res = await getSubscriptionList({
        userId: user.id,
        domainType: window.location.origin.endsWith("xyz") ? 1 : 2,
      });
      if (
        !res.data.length ||
        res.data.every(
          (item) =>
            item.onesignalSubscriptionId !== OneSignal.User.PushSubscription.id
        )
      ) {
        createSubscription({
          userId: user.id,
          onesignalSubscriptionId: OneSignal.User.PushSubscription.id!,
          domainType: window.location.origin.endsWith("xyz") ? 1 : 2,
        });
      }
    },
    async userSubscriptionEffect(user?: User.UserInfo | null) {
      let clearEffect = () => {};
      if (user) {
        const { isSubscription, checkIsUserSubscription } = get();
        if (isSubscription) {
          checkIsUserSubscription(user);
        } else {
          clearEffect = useOneSignalStore.subscribe((state, prevState) => {
            if (
              state.isSubscription &&
              state.isSubscription !== prevState.isSubscription
            ) {
              checkIsUserSubscription(user);
            }
          });
        }
      }
      return clearEffect;
    },
  };
});

export const useOneSignalInit = (user?: User.UserInfo | null) => {
  const { initOneSignal, userSubscriptionEffect } = useOneSignalStore(
    useShallow((state) => ({
      initOneSignal: state.initOneSignal,
      userSubscriptionEffect: state.userSubscriptionEffect,
    }))
  );
  useEffect(() => {
    userSubscriptionEffect(user);
  }, [user]);
  useEffect(() => {
    initOneSignal();
  }, []);
};

export default useOneSignalStore;
