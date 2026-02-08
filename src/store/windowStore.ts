import { create } from "zustand";
import type WindowStore from "../types/windowStore.types";

const useWindowStore = create<WindowStore>((set) => ({
  windows: {},
  activeWindowId: null,
  createWindow: (id, config = {}) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          id: id,
          width: 700,
          height: 400,
          x: 70,
          y: 40,
          position: null,
          isMinimized: false,
          zIndex: 0,
          ...config,
        },
      },
    })),
  updateWindow: (id, updates) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          ...updates,
        },
      },
    })),
  deleteWindow: (id) =>
    set((state) => {
      const { [id]: removed, ...remaining } = state.windows;
      return { windows: remaining };
    }),
  setActiveWindow: (id) =>
    set((state) => ({
      activeWindowId: id,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          zIndex:
            Math.max(...Object.values(state.windows).map((w) => w.zIndex)) + 1,
        },
      },
    })),
}));

export default useWindowStore;
