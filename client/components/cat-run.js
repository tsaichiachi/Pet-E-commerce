import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import animation from "@/data/catRun.json";
import { useHelper } from "@/context/helperContext";
import { useRouter } from "next/router";
const CatRun = () => {
  const router = useRouter();
  const { isLoading } = useHelper();
  const [contentHeight, setContentHeight] = useState(0);
  const [offset, setOffset] = useState(0);
  const catWrapperRef = useRef(null);
  const lottieRef = useRef(false);
  const catRunRef = useRef(null);

  useEffect(() => {
    const catRunLottie = lottie.loadAnimation({
      container: document.getElementById("cat-run-lottie"), // the dom element
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation, // the animation data
    });
    return () => {
      catRunLottie.destroy();
    };
  }, [router]);
  const handleScroll = () => {
    // 讓背景遮罩與整個文本高度一樣高
    const newHeight = document.body.scrollHeight;
    setContentHeight(newHeight);

    const element = catRunRef.current;
    if (element) {
      // scroll捲動距離 + ( window視窗高度 / 2 ) 代表螢幕正中央的高度 - 元素本身的高度 = 正中間
      const viewportHeight = window.innerHeight; //整個瀏覽器窗口的高度
      console.log(window.innerHeight, element.clientHeight, window.scrollY); //元素的高度
      const elementHeight = element.clientHeight;
      const scrollY = window.scrollY;
      const elementOffsetTop = scrollY + viewportHeight / 2 - elementHeight;
      setOffset(elementOffsetTop);
    }
  };
  useEffect(() => {
    handleScroll(); // 初始化時先執行一次保證位置
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router]);
  useLayoutEffect(() => {
    // 用來設定wrapper的總高度要等於整個文本的高度
    const newHeight = document.body.scrollHeight;
    setContentHeight(newHeight);
  }, [router]);
  return (
    <div
      className="cat-run-wrapper"
      ref={catWrapperRef}
      style={{ height: `calc(${contentHeight}px - 110px)` }}
    >
      <div
        id="cat-run-lottie"
        ref={catRunRef}
        // className="animate__animated animate__fadeInDownBig"
        style={{ top: `${offset}px` }}
      ></div>
    </div>
  );
};

export default CatRun;
