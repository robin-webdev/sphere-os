import { useEffect, useRef, useState } from "react";
import type windowWrapper from "../../types/windowWrapper.types";
import { motion, useDragControls, useMotionValue } from "motion/react";
import "./windowWrapper.css";
import useWindow from "../../store/windowStore";
import type { position } from "../../types/windowStore.types";

const WindowWrapper = (props: windowWrapper) => {
  const dragControls = useDragControls();
  const { width, height, updateDimension, position, setPosition } = useWindow();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const top = useMotionValue(50);
  const left = useMotionValue(100);
  const [dragConstraints, setDragConstraints] = useState<{
    [key: string]: number;
  }>({});
  const dragRef = useRef({
    startWidth: 0,
    startHeight: 0,
    startX: 0,
    startY: 0,
  });

  function handleResizeStart(
    evt: React.MouseEvent<HTMLDivElement>,
    position: position,
  ) {
    evt.preventDefault();
    setIsResizing(true);
    setPosition(position);

    dragRef.current = {
      startWidth: width,
      startX: evt.clientX,
      startHeight: height,
      startY: evt.clientY,
    };
  }

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragRef.current.startY;
      const deltaX = e.clientX - dragRef.current.startX;
      const newHeight = dragRef.current.startHeight + deltaY;
      const updatedNewHeight = dragRef.current.startHeight - deltaY;
      const newWidth = dragRef.current.startWidth + deltaX;
      const updatedNewWidth = dragRef.current.startWidth - deltaX;
      const newTop = dragRef.current.startY + deltaY;
      const newLeft = dragRef.current.startX + deltaX;
      switch (position) {
        case "e":
          updateDimension(Math.max(newWidth, 300), undefined);
          break;
        case "s":
          updateDimension(undefined, Math.max(newHeight, 300));
          break;
        case "n":
          updateDimension(undefined, Math.max(updatedNewHeight, 300));
          if (updatedNewHeight > 300) top.set(newTop);
          break;
        case "w":
          updateDimension(Math.max(updatedNewWidth, 300), undefined);
          if (updatedNewWidth > 300) left.set(newLeft);
          break;
        case "ne":
          updateDimension(undefined, Math.max(updatedNewHeight, 300));
          if (updatedNewHeight > 300) top.set(newTop);
          updateDimension(Math.max(newWidth, 300), undefined);
          break;
        case "nw":
          updateDimension(undefined, Math.max(updatedNewHeight, 300));
          if (updatedNewHeight > 300) top.set(newTop);
          updateDimension(Math.max(updatedNewWidth, 300), undefined);
          if (updatedNewWidth > 300) left.set(newLeft);
          break;
        case "sw":
          updateDimension(undefined, Math.max(newHeight, 300));
          updateDimension(Math.max(updatedNewWidth, 300), undefined);
          if (updatedNewWidth > 300) left.set(newLeft);
          break;
        case "se":
          updateDimension(undefined, Math.max(newHeight, 300));
          updateDimension(Math.max(newWidth, 300), undefined);
          break;

        default:
          break;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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
        y: top,
        x: left,
        width: width + "px",
        height: height + "px",
      }}
    >
      {/* Resize Constraints -- */}
      <div
        className="resize-constraints resize-n"
        onMouseDown={(e) => handleResizeStart(e, "n")}
      ></div>
      <div
        className="resize-constraints resize-w"
        onMouseDown={(e) => handleResizeStart(e, "w")}
      ></div>
      <div
        className="resize-constraints resize-e"
        onMouseDown={(e) => handleResizeStart(e, "e")}
      ></div>
      <div
        className="resize-constraints resize-s"
        onMouseDown={(e) => handleResizeStart(e, "s")}
      ></div>
      <div
        className="resize-constraints resize-ne"
        onMouseDown={(e) => handleResizeStart(e, "ne")}
      ></div>
      <div
        className="resize-constraints resize-nw"
        onMouseDown={(e) => handleResizeStart(e, "nw")}
      ></div>
      <div
        className="resize-constraints resize-se"
        onMouseDown={(e) => handleResizeStart(e, "se")}
      ></div>
      <div
        className="resize-constraints resize-sw"
        onMouseDown={(e) => handleResizeStart(e, "sw")}
      ></div>
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
