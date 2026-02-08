export default interface windowStore {
  width: number;
  height: number;
  position: position;
  setPosition: (pos: position) => void;
  updateDimension: (
    width: number | undefined,
    height: number | undefined,
  ) => void;
}

export type position = "e" | "w" | "n" | "s" | "se" | "sw" | "nw" | "ne" | null;
