interface Window {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  position: position;
  isMinimized: boolean;
  zIndex: number;
}

export type position = "e" | "w" | "n" | "s" | "se" | "sw" | "nw" | "ne" | null;

export type UpdateDimensionTypes = (
  width: number | undefined,
  height: number | undefined,
) => void;

export default interface WindowStore {
  windows: { [id: string]: Window };
  activeWindowId: string | null;

  createWindow: (id: string, config?: Partial<Window>) => void;
  updateWindow: (id: string, updates: Partial<Window>) => void;
  deleteWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
}
