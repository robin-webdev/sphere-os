import { create } from "zustand";
import type windowStore from "../types/windowStore.types.js";

const useWindow = create<windowStore>((set, get) => ({
  width: 700,
  height: 400,
  position: null,
  setPosition: (position) => {
    set(() => ({ position }));
  },
  updateDimension: (width, height) => {
    set((state) => ({
      width: width !== undefined ? width : state.width,
      height: height !== undefined ? height : state.height,
    }));
  },
}));

export default useWindow;
