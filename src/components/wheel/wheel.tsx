"use client";

import React, { useEffect, useState, useRef } from "react";

export interface WheelComponentProps {
  segments: string[];
  segColors: string[];
  onFinished: (segment: string) => void;
  primaryColor?: string;
  contrastColor?: string;
  buttonText?: string;
  isOnlyOnce?: boolean;
  size?: number;
  fontFamily?: string;
  fontSize?: string;
  outlineWidth?: number;
}

const Wheel = ({
  segments,
  segColors,
  onFinished,
  primaryColor = "black",
  contrastColor = "white",
  buttonText = "Spin",
  isOnlyOnce = true,
  size = window.innerWidth,
  fontFamily = "proxima-nova",
  fontSize = "1em",
  outlineWidth = 10,
}: WheelComponentProps) => {
  const canvasRef = useRef(null);
  const wheelRef = useRef(null);

  const dimension = (size + 20) * 2;
  let [currentSegment, setCurrentSegment] = useState("");
  let [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let spinStart = 0;
  let frames = 0;
  const centerX = size + 20;
  const centerY = size + 20;
  const [initialVelocity, setInitialVelocity] = useState(
    Math.random() * 50 + 10,
  );
  const [beepSoundEffect, setBeepSoundEffect] =
    useState<HTMLAudioElement | null>(null);
  let canPlaySound = true;

  useEffect(() => {
    setBeepSoundEffect(new Audio("/beep.mp3"));
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  useEffect(() => {
    if (isFinished) {
      onFinished(currentSegment);
    }
  }, [isFinished]);

  const getSegmentIndexFromAngle = (angle: number) => {
    const change = angle + Math.PI / 2;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;
    return i;
  };

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas: HTMLCanvasElement | null =
      canvasRef.current! as HTMLCanvasElement;

    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", `${dimension}`);
      canvas.setAttribute("height", `${dimension}`);
      (wheelRef.current! as HTMLDivElement).appendChild(canvas);
    }
    canvas?.addEventListener("click", spin, false);
    canvasContext = canvas?.getContext("2d");
    if (canvasContext) {
      canvasContext.imageSmoothingEnabled = true;
    }
  };
  const spin = () => {
    setIsStarted(true);
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      frames = 0;
      timerHandle = window.setInterval(onTimerTick, timerDelay);
    }
  };
  const onTimerTick = () => {
    const duration = (new Date().getTime() - spinStart) / 1000;
    const angularVelocity = initialVelocity * Math.exp(-0.5 * duration);

    frames++;
    draw();
    angleCurrent += angularVelocity * (timerDelay / 1000);
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;

    if (angularVelocity < 0.07) {
      setIsFinished(true);
      clearInterval(timerHandle);
      timerHandle = 0;
    }
  };
  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };
  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };
  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor;
    ctx.font = `bold ${fontSize} ${fontFamily}`;
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };
  const drawWheel = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em " + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "#529dff";
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor;
    ctx.fill();
    ctx.font = "bold 1em " + fontFamily;
    ctx.fillStyle = contrastColor;
    ctx.textAlign = "center";
    ctx.fillText(buttonText, centerX, centerY + 3);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };
  const drawNeedle = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fillStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 20.5em " + fontFamily;
    setCurrentSegment(segments[i]);
    isStarted &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };
  const clear = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.clearRect(0, 0, dimension, dimension);
  };

  return (
    <div
      ref={wheelRef}
      className="my-4 flex w-full flex-col justify-center sm:w-[500px]"
    >
      <canvas
        ref={canvasRef}
        width={dimension}
        className="cursor-grab"
        height={dimension}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
        }}
      />
      {isStarted && (
        <p className="text-center text-lg font-bold">{currentSegment}</p>
      )}
    </div>
  );
};
export default Wheel;
