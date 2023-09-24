"use client";
import { useEffect } from "react";
import lottie from "lottie-web";
import Error401Animation from "../../../../../public/error401.json";

interface Props {
  message: any;
  code: any;
}

const Error401: React.FC<Props> = ({ message, code }) => {

  useEffect(() => {
    const error401AnimationContainer = document.querySelector("#error401-animation");

    lottie.destroy();

    if (error401AnimationContainer) {
      lottie.loadAnimation({
        container: error401AnimationContainer,
        animationData: Error401Animation,
        loop: true,
      });
    }
  }, [])

  return (
    <>
      <div className="w-full relative">
        <div id="error401-animation" className="w-96 h-96 m-auto"></div>
        <h2 className="w-full text-center text-xl font-bold text-slate-700 dark:text-gray-300">
          {
            message && message.length > 0
              ? message
              : 'Unauthorized Access!'
          }
        </h2>
      </div>
    </>
  )
}

export default Error401;