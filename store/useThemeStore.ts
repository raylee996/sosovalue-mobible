import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackChangeMode } from "helper/track";
export type Theme = "dark" | "light";

type State = {
  theme: Theme;
};

type Action = {
  toggleTheme: (theme: Theme) => void;
};

export const useThemeStore = create<
  State & Action,
  [["zustand/persist", State & Action]]
>(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme(theme: Theme) {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        trackChangeMode(theme);
        set({ theme });
      },
    }),
    { name: "theme-storage" }
  )
);
