import { useState, useLayoutEffect } from "react";

const useRWD = () => {
  const [device, setDevice] = useState("PC");

  useLayoutEffect(() => {
    window.addEventListener("resize", handleRWD);
    handleRWD();
    return () => {
      window.removeEventListener("resize", handleRWD);
    };
  }, [device]);

  function handleRWD() {
    const width = window.innerWidth;
    width <= 576
      ? setDevice("mobile")
      : width > 576 && width <= 992
      ? setDevice("tablet")
      : setDevice("PC");
  }
  return device;
};

export default useRWD;