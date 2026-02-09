import { useEffect, useRef, useState } from "react";
import type windowWrapper from "../../types/windowWrapper.types";
import { motion, useDragControls, useMotionValue } from "motion/react";
import "./windowWrapper.css";
import type {
  position,
  UpdateDimensionTypes,
} from "../../types/windowStore.types";
import useWindowStore from "../../store/windowStore";
import { animate } from "motion";

const WindowWrapper = ({ children, id }: windowWrapper) => {
  const updateWindow = useWindowStore((state) => state.updateWindow);
  const setActiveWindow = useWindowStore((state) => state.setActiveWindow);
  const deleteWindow = useWindowStore((state) => state.deleteWindow);

  const { height, width, position, x, y, zIndex, isMinimized } = useWindowStore(
    (state) => state.windows[id],
  );

  const updateDimension: UpdateDimensionTypes = (width, height) => {
    if (width !== undefined) {
      updateWindow(id, { width: width });
    }
    if (height !== undefined) {
      updateWindow(id, { height: height });
    }
  };

  const setPosition = (position: position) => {
    updateWindow(id, { position });
  };

  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const top = useMotionValue(y);
  const left = useMotionValue(x);
  const windowWidth = useMotionValue(width);
  const windowHeight = useMotionValue(height);
  const rafIdRef = useRef<number | null>(null);
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

  function handleMinimization() {
    const targetY = document.body.offsetHeight;
    const targetX = document.body.offsetWidth / 2 - width / 2;
    const deltaY = targetY - y;
    const deltaX = targetX - x;
    animate(top, deltaY, { duration: 0.3 });
    animate(left, deltaX, { duration: 0.3 });
    updateWindow(id, { isMinimized: true });
  }

  function handleMaximization() {
    const targetHeight = document.body.offsetHeight;
    const targetWidth = document.body.offsetWidth;
    animate(windowHeight, targetHeight, { duration: 0.1 });
    animate(windowWidth, targetWidth, { duration: 0.1 });
    animate(left, 0, { duration: 0.1 });
    animate(top, 0, { duration: 0.1 });
  }

  function handleWindowDelete() {
    const targetY = document.body.offsetHeight;
    const targetX = document.body.offsetWidth / 2 - width / 2;
    const deltaY = targetY - y;
    const deltaX = targetX - x;
    const animY = animate(top, deltaY, { duration: 0.3 });
    const animX = animate(left, deltaX, { duration: 0.3 });
    updateWindow(id, { isMinimized: true });
    Promise.all([animX, animY]).then(() => {
      deleteWindow(id);
    });
  }

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const deltaY = e.clientY - dragRef.current.startY;
        const deltaX = e.clientX - dragRef.current.startX;
        const newHeight = Math.max(dragRef.current.startHeight + deltaY, 300);
        const updatedNewHeight = Math.max(
          dragRef.current.startHeight - deltaY,
          300,
        );
        const newWidth = Math.max(dragRef.current.startWidth + deltaX, 300);
        const updatedNewWidth = Math.max(
          dragRef.current.startWidth - deltaX,
          300,
        );
        const newTop = dragRef.current.startY + deltaY;
        const newLeft = dragRef.current.startX + deltaX;
        switch (position) {
          case "e":
            updateDimension(newWidth, undefined);
            break;
          case "s":
            updateDimension(undefined, newHeight);
            break;
          case "n":
            updateDimension(undefined, updatedNewHeight);
            if (updatedNewHeight !== 300) top.set(newTop);
            break;
          case "w":
            updateDimension(updatedNewWidth, undefined);
            if (updatedNewWidth !== 300) left.set(newLeft);
            break;
          case "ne":
            updateDimension(newWidth, updatedNewHeight);
            if (updatedNewHeight !== 300) top.set(newTop);
            break;
          case "nw":
            updateDimension(updatedNewWidth, updatedNewHeight);
            if (updatedNewHeight !== 300) top.set(newTop);
            if (updatedNewWidth !== 300) left.set(newLeft);
            break;
          case "sw":
            updateDimension(updatedNewWidth, newHeight);
            if (updatedNewWidth !== 300) left.set(newLeft);
            break;
          case "se":
            updateDimension(newWidth, newHeight);
            break;

          default:
            break;
        }
        windowWidth.set(width);
        windowHeight.set(height);
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [isResizing, position, updateDimension, top, left]);

  return (
    <motion.section
      onMouseDown={() => setActiveWindow(id)}
      drag
      onDragStart={() => {
        animate(windowWidth, width, { duration: 0.1 });
        animate(windowHeight, height, { duration: 0.1 });
      }}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      dragElastic={0}
      className="window"
      style={{
        zIndex: zIndex,
        y: top,
        x: left,
        width: windowWidth,
        height: windowHeight,
      }}
      animate={
        isMinimized && {
          scale: 0,
          transition: { duration: 0.3 },
        }
      }
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
        onDoubleClick={() => {
          if (
            document.body.offsetWidth === windowWidth.get() &&
            document.body.offsetHeight === windowHeight.get()
          ) {
            animate(windowWidth, width, { duration: 0.1 });
            animate(windowHeight, height, { duration: 0.1 });
            animate(top, y, { duration: 0.1 });
            animate(left, x, { duration: 0.1 });
          } else {
            handleMaximization();
          }
        }}
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
        onPointerUp={() => {
          if (
            document.body.offsetWidth !== windowWidth.get() ||
            document.body.offsetHeight !== windowHeight.get()
          ) {
            updateWindow(id, { y: top.get(), x: left.get() });
          }
        }}
        className="window-top"
      >
        <div className="controls">
          <div className="red" onClick={handleWindowDelete}></div>
          <div className="yellow" onClick={handleMinimization}></div>
          <div className="green" onClick={handleMaximization}></div>
        </div>
      </motion.div>
      <div className="window-app">{children}</div>
    </motion.section>
  );
};

export default WindowWrapper;
