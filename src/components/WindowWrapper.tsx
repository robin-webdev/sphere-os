import useWindow from "../store/windowStore";
import type windowWrapper from "../types/windowWrapper.types";

const WindowWrapper = (props: windowWrapper) => {
  const isMinimized = useWindow((state) => {
    state.isMinimized;
  });
  return <section className="window">{props.children}</section>;
};

export default WindowWrapper;
