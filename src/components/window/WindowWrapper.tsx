import { useEffect, useRef, useState } from "react";
import type windowWrapper from "../../types/windowWrapper.types";
import { motion, useDragControls } from "motion/react";
import "./windowWrapper.css";
import useWindow from "../../store/windowStore";

const WindowWrapper = (props: windowWrapper) => {
  const dragControls = useDragControls();

  const { width, height, updateDimension } = useWindow();

  const [isResizing, setIsResizing] = useState<boolean>(false);

  const dragRef = useRef({
    left: 0,
    startWidth: 0,
    startX: 0,
  });

  function handleResizeStart(evt: React.MouseEvent<HTMLDivElement>) {
    evt.preventDefault();
    setIsResizing(true);
    dragRef.current = {
      left: evt.currentTarget.getBoundingClientRect().x,
      startWidth: width,
      startX: evt.clientX,
    };
  }
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const delta = e.clientX - dragRef.current.startX;
      const newWidth = dragRef.current.startWidth + delta;
      updateDimension(Math.max(100, newWidth), undefined);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [isResizing]);

  const [dragConstraints, setDragConstraints] = useState<{
    [key: string]: number;
  }>({});

  return (
    <motion.section
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      dragElastic={0}
      className="window"
      style={{
        width: width + "px",
        height: height + "px",
      }}
    >
      {/* Resize Constraints -- */}
      <div className="resize-constraints resize-n"></div>
      <div className="resize-constraints resize-w"></div>
      <div
        className="resize-constraints resize-e"
        onMouseDown={(e) => handleResizeStart(e)}
      ></div>
      <div className="resize-constraints resize-s"></div>
      <div className="resize-constraints resize-ne"></div>
      <div className="resize-constraints resize-nw"></div>
      <div className="resize-constraints resize-se"></div>
      <div className="resize-constraints resize-sw"></div>
      <motion.div
        onMouseDown={(e) => {
          const dimensions = {
            documentHeight: document.body.offsetHeight,
            documentWidth: document.body.offsetWidth,
            windowX: e.nativeEvent.offsetX,
            windowY: e.nativeEvent.offsetY,
          };
          setDragConstraints({
            top: -dimensions.windowY,
            bottom: dimensions.documentHeight - dimensions.windowY,
            left: -dimensions.windowX,
            right: dimensions.documentWidth - dimensions.windowX,
          });
        }}
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
        className="window-top"
      ></motion.div>
      <div>{props.children}</div>
    </motion.section>
  );
};

export default WindowWrapper;
