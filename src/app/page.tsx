"use client";

import Wheel from "@/components/wheel/wheel";
import Confetti from "react-confetti";

import { useEffect, useState } from "react";

type WindowDimentions = {
  width: number | undefined;
  height: number | undefined;
};

const useWindowDimensions = (): WindowDimentions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimentions>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize(): void {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowDimensions;
};

export default function Home() {
  const { width, height } = useWindowDimensions();
  const [finished, setFinished] = useState(false);

  const conversationStarters = [
    "What's the most interesting thing you've learned recently?",
    "Do you have any favorite hobbies?",
    "What's the best book you've read lately?",
    "Have you been on any memorable trips?",
    "Do you follow any sports or teams?",
    "What's the most delicious meal you've ever had?",
    "Do you have any pets?",
    "What's your favorite movie or TV show?",
    "What do you like to do to relax?",
    "Have you ever tried any adventurous activities?",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];

  return (
    <div className="mt-[50px] flex justify-center">
      <Confetti
        run={finished}
        tweenDuration={10000}
        numberOfPieces={1000}
        recycle={false}
        width={width ?? 0}
        height={height ?? 0}
      />
      <Wheel
        segments={conversationStarters}
        segColors={segColors}
        onFinished={(winner) => {
          setFinished(true);
        }}
        primaryColor="black"
        contrastColor="white"
        buttonText="Smalltalk!"
        isOnlyOnce={false}
        size={400}
        fontFamily="Arial"
      />
    </div>
  );
}
