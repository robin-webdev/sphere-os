import { create } from "zustand";
import type windowStore from "../types/windowStore.types.js";

const useWindow = create<windowStore>((set) => ({
  width: 50,
  height: 50,
  isMinimized: false,
  isClosed: false,
  updateDimension: () => {},
  minimize: () => {},
  maximize: () => {},
  close: () => {},
}));

export default useWindow;
