"use client";

import Wheel from "@/components/wheel/wheel";

export default function Home() {
  const segments = [
    "Hobbies",
    "Favorite movies",
    "Music preferences",
    "Books you've read recently",
    "Travel experiences",
    "Favorite foods",
    "Sports you enjoy",
    "TV shows you're currently watching",
    "Places you'd like to visit",
    "Weekend plans",
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
  const onFinished = (winner: any) => {
    console.log(winner);
  };
  return (
    <div className="mt-[50px] flex justify-center">
      <Wheel
        segments={segments}
        segColors={segColors}
        onFinished={(winner) => onFinished(winner)}
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
