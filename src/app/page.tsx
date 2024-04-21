"use client";

import Wheel from "@/components/wheel/wheel";
import Confetti from "react-confetti";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";
import { useWindowDimensions } from "@/lib/use-window-dimensions";
import { getRandomItems } from "@/lib/utils";
import { conversationStarters } from "@/lib/conversation-starters";
import { Stopwatch } from "@/components/stopwatch/stopwatch";

const segments = getRandomItems(conversationStarters, 16);

export default function Home() {
  const { width, height } = useWindowDimensions();
  const [finished, setFinished] = useState(false);

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
    <div className="mt-4 flex flex-col items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Smalltalk!
      </h1>
      {finished && (
        <Confetti
          run={finished}
          recycle={false}
          numberOfPieces={700}
          tweenDuration={5000}
          onConfettiComplete={() => {
            setFinished(false);
          }}
          width={width ?? 0}
          height={height ?? 0}
        />
      )}

      <Wheel
        segments={segments}
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

      <Stopwatch />
    </div>
  );
}
