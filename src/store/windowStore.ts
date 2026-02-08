import { create } from "zustand";
import type windowStore from "../types/windowStore.types.js";

const useWindow = create<windowStore>((set, get) => ({
  dragStart: 0,
  width: 700,
  height: 400,
  updateDrag: (drag = 0) => {
    set(() => ({ dragStart: drag }));
  },
  updateDimension: (width, height) => {
    set((state) => ({
      width: width !== undefined ? width : state.width,
      height: height !== undefined ? height : state.height,
    }));
  },
}));

export default useWindow;
