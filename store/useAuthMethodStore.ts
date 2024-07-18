import { create } from "zustand";

export type AuthScenes = "changePassword" | "deactivateAccount";

type State = {
  /**
   *
   * - updatePassword 更改密码
   * - deactivateAccount注销帐号
   */
  authScene?: AuthScenes;
};

type Action = {
  setAuthScene: (scene: AuthScenes) => void;
};

/**
 * 选择手机或邮箱验证某些操作时的场景，如更改回密、注销帐号等，需要根据场景不同，做不同的操作
 */
const useAuthMethodStore = create<State & Action>()((set) => ({
  setAuthScene: (scene) => set({ authScene: scene }),
}));

export default useAuthMethodStore;
