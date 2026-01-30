export default interface windowStore {
  width: number;
  height: number;
  isMinimized: boolean;
  isClosed: boolean;
  updateDimension: () => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
