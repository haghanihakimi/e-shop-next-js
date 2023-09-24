"use client";
import { useEffect } from "react";
import lottie from "lottie-web";
import Error404Animation from "../../../../../public/error404.json";

interface Props {
  message: any;
  code: any;
}

const Error404: React.FC<Props> = ({ message, code }) => {

  useEffect(() => {
    const error404AnimationContainer = document.querySelector("#error404-animation");

    lottie.destroy();

    if (error404AnimationContainer) {
      lottie.loadAnimation({
        container: error404AnimationContainer,
        animationData: Error404Animation,
        loop: true,
      });
    }
  }, [])

  return (
    <>
      <div className="w-full relative">
        <div id="error404-animation" className="w-96 h-96 m-auto"></div>
        <h2 className="w-full text-center text-xl font-bold text-slate-700 dark:text-gray-300">
          {
            message && message.length > 0
              ? message
              : 'Page Not found'
          }
        </h2>
      </div>
    </>
  )
}

export default Error404;