"use client";
import { useEffect } from "react";
import lottie from "lottie-web";
import Error405Animation from "../../../../../public/error405.json";

interface Props {
  message: any;
  code: any;
}

const Error405: React.FC<Props> = ({ message, code }) => {

  useEffect(() => {
    const error405AnimationContainer = document.querySelector("#error405-animation");

    lottie.destroy();

    if (error405AnimationContainer) {
      lottie.loadAnimation({
        container: error405AnimationContainer,
        animationData: Error405Animation,
        loop: true,
      });
    }
  }, [])

  return (
    <>
      <div className="w-full relative">
        <div id="error405-animation" className="w-96 h-96 m-auto"></div>
        <h2 className="w-full text-center text-xl font-bold text-slate-700 dark:text-gray-300">
          {
            message && message.length > 0
              ? message
              : 'Internal server error.'
          }
        </h2>
      </div>
    </>
  )
}

export default Error405;