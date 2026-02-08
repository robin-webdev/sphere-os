export default interface windowStore {
  width: number;
  height: number;
  dragStart: number;
  updateDrag: (start: number) => void;
  updateDimension: (
    width: number | undefined,
    height: number | undefined,
  ) => void;
}
