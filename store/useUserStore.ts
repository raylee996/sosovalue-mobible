import { getCurrentLanguageText } from "helper/tools";
import { backpackList, findSelfAll } from "http/user";
import { create } from "zustand";

type State = {
  curBackpackId: string;
  bookmarks: User.Backpack[];
  collectCoins: User.CollectCoins[];
};

type Action = {
  getBookmarks: () => void;
  getCollectCoins: () => void;
  changeBkId: (curBackpackId: string) => void;
};

const useUserStore = create<State & Action>((set, get) => {
  return {
    curBackpackId: "",
    bookmarks: [],
    collectCoins: [],

    async getBookmarks() {
      backpackList({}).then((res) => {
        const bookmarks = res.data
        set({ bookmarks });
        //  没值 或背包删除
        if (
          !get().curBackpackId ||
          !res.data.some((i) => i.id === get().curBackpackId)
        ) {
          set({ curBackpackId: res.data[0]?.id });
        }
      });
    },
    async getCollectCoins() {
      findSelfAll({}).then((res) => {
        set({ collectCoins: res.data });
      });
    },

    async changeBkId(curBackpackId: string) {
      set({ curBackpackId });
    },
  };
});

export default useUserStore;
