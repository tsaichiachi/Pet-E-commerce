import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/router";
import lottie from "lottie-web";
import animation from "@/data/catRun.json";
const LoaderContext = createContext(null);

export function Loader({ backgroundColor = "rgb(167 167 167 / 68%)", show }) {
  const router = useRouter();
  let lottieRef = useRef(false); //偵測lottie dom是否存在，存在就不要再加
  const catRunRef = useRef(null);
  useEffect(() => {
    // let catRunLottie;

    let catRunLottie = lottie.loadAnimation({
      container: document.getElementById("cat-run-lottie"), // the dom element
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation, // the animation data
    });
    lottieRef = true;

    return () => {
      catRunLottie.destroy();
      lottieRef = false;
    };
  }, [router]);

  return (
    <>
      <div className={`semi-loader ${show ? "" : "semi-loader--hide"}`}>
        <div
          id="cat-run-lottie"
          ref={catRunRef}
          // className="animate__animated animate__fadeInDownBig"
          // style={{ top: `${offset}px` }}
        ></div>
      </div>
      <style jsx>
        {`
          .semi-loader {
            width: 100%;
            /*-Lets Center the Spinner-*/
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            /*Centering my shade */
            /* margin-bottom: 40px; */
            background-color: ${backgroundColor};
            z-index: 9999;
          }

          #cat-run-lottie {
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50vw;
            transform: translate(-50%, -50%);
          }
          @media screen and (max-width: 576px) {
            .semi-loader {
              #cat-run-lottie {
                width: 220px;
                height: 220px;
              }
            }
          }
          // .semi-loader::after {
          //   content: "";
          //   display: block;
          //   position: absolute;
          //   top: calc(50% - 4em);
          //   left: calc(50% - 4em);
          //   width: 6em;
          //   height: 6em;
          //   border: 1.1em solid rgba(0, 0, 0, 0.2);
          //   border-left: 1.1em solid #000000;
          //   border-radius: 50%;
          //   -webkit-animation: load8 1.1s infinite linear;
          //   animation: load8 1.1s infinite linear;
          // }

          .semi-loader--hide {
            display: none;
          }

          @keyframes load8 {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}

export function LoadingText({ text = "loading" }) {
  return (
    <>
      <div className="loading-text">{text}...</div>
      <style jsx>
        {`
          .loading-text {
            font-weight: bold;
            display: inline-block;
            font-family: monospace;
            font-size: 20px;
            clip-path: inset(0 3ch 0 0);
            animation: l 1s steps(4) infinite;
          }

          @keyframes l {
            to {
              clip-path: inset(0 -1ch 0 0);
            }
          }
        `}
      </style>
    </>
  );
}

// 延遲x ms秒
function delay(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

export default function useLoader(autoClose = 2) {
  const [show, setShow] = useState(false);

  return {
    showLoader: () => {
      setShow(true);

      // auto close
      if (autoClose) {
        setTimeout(() => {
          setShow(false);
        }, autoClose * 1000);
      }
    },
    hideLoader: () => setShow(false),
    loading: show,
    delay,
    loader: (color) => <Loader show={show} backgroundColor={color} />,
    loadingText: (text) => <LoadingText text={text} />,
  };
}

// export const LoaderProvider = ({ children }) => {
//   const [show, setShow] = useState(false);
//   const [autoClose, setAutoClose] = useState(0); // 幾秒後關閉

//   return (
//     <LoaderContext.Provider
//       value={{
//         setAutoClose,
//         showLoader: () => {
//           setShow(true);

//           // auto close
//           if (autoClose) {
//             setTimeout(() => {
//               setShow(false);
//             }, autoClose * 1000);
//           }
//         },
//         hideLoader: () => setShow(false),
//         loading: show,
//         delay,
//         loader: (color) => <Loader show={show} backgroundColor={color} />,
//         loadingText: (text) => <LoadingText text={text} />,
//       }}
//     >
//       {children}
//     </LoaderContext.Provider>
//   );
// };

// export const useLoaderContext = () => useContext(LoaderContext);
