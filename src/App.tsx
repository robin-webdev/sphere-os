import WindowWrapper from "./components/window/WindowWrapper";
import "./app.css";
import { useEffect } from "react";
import useWindowStore from "./store/windowStore";

const App = () => {
  const createWindow = useWindowStore((state) => state.createWindow);
  const windows = useWindowStore((state) => state.windows);

  useEffect(() => {
    if (!windows.terminal || !windows.spotify) {
      createWindow("terminal", { x: 0, y: 20 });
      createWindow("spotify", { x: 200, y: 100 });
    }
  }, []);
  return (
    <div className="main">
      {windows["terminal"] && (
        <WindowWrapper id="terminal">
          <div className="demo-div">
            <img
              className="demo-img"
              src="https://code.visualstudio.com/assets/docs/terminal/getting-started/terminal-line-column.png"
            />
          </div>
        </WindowWrapper>
      )}
      {windows["spotify"] && (
        <WindowWrapper id="spotify">
          <div className="demo-div">
            <img
              className="demo-img"
              src="https://play-lh.googleusercontent.com/kDXJ6XA2Cm47lzDCvvu6HNCu0PWmTwZKiY0ldCWrCgXGT3Ms-lbP_WN1v5vknspnLT15=w526-h296-rw"
            />
          </div>
        </WindowWrapper> 
      )}
    </div>
  );
};

export default App;
