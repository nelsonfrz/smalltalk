"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";

export interface WheelComponentProps {
  segments: string[];
  segColors: string[];
  onFinished: (segmentIndex: number) => void;
  primaryColor?: string;
  contrastColor?: string;
  buttonText?: string;
  isOnlyOnce?: boolean;
  size?: number;
  fontFamily?: string;
  fontSize?: string;
  outlineWidth?: number;
}

type WheelState = "initial" | "started" | "finished";

const Wheel = ({
  segments,
  segColors,
  onFinished,
  primaryColor = "black",
  contrastColor = "white",
  buttonText = "Spin",
  size = window.innerWidth,
  fontFamily = "proxima-nova",
  fontSize = "1em",
  outlineWidth = 10,
}: WheelComponentProps) => {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [state, setState] = useState<WheelState>("initial");
  const stateRef = useRef(state);
  let [currentSegmentIndex, setCurrentSegmentIndex] = useState<number | null>(
    null,
  );
  const currentSegmentIndexRef = useRef(currentSegmentIndex);
  const [initialVelocity, setInitialVelocity] = useState(
    Math.random() * 50 + 10,
  );
  const initialVelocityRef = useRef(initialVelocity);
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(angle);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [spinStart, setSpinStart] = useState<number | null>(null);
  const spinStartRef = useRef(spinStart);

  const dimension = (size + 20) * 2;
  const timerDelay = segments.length;
  const centerX = size + 20;
  const centerY = size + 20;
  const minAngularVelocity = 0.07;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      throw new Error("No canvas context found");
    }

    draw(ctx);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [
    segments,
    segColors,
    onFinished,
    primaryColor,
    contrastColor,
    buttonText,
    size,
    fontFamily,
    fontSize,
    outlineWidth,
  ]);

  function draw(ctx: CanvasRenderingContext2D) {
    clearCanvas(ctx);
    updateCurrentSegmentIndex();
    drawWheel(ctx);
    drawNeedle(ctx);
  }

  function updateCurrentSegmentIndex() {
    const change = angleRef.current + Math.PI / 2;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;

    setCurrentSegmentIndex(() => {
      currentSegmentIndexRef.current = i;
      return i;
    });
  }

  function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, dimension, dimension);
  }

  function drawWheel(ctx: CanvasRenderingContext2D) {
    // Draw segments
    let lastAngle = angleRef.current;
    const segmentsAmount = segments.length;
    const TAU = Math.PI * 2;

    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em " + fontFamily;

    for (let i = 1; i <= segmentsAmount; i++) {
      const angle = TAU * (i / segmentsAmount) + angleRef.current;
      drawSegment(i - 1, lastAngle, angle, ctx);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, TAU, false);
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
    ctx.arc(centerX, centerY, size, 0, TAU, false);
    ctx.closePath();

    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  }

  function drawSegment(
    key: number,
    lastAngle: number,
    angle: number,
    ctx: CanvasRenderingContext2D,
  ) {
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
  }

  function drawNeedle(ctx: CanvasRenderingContext2D) {
    // Draw needle
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fillStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 20.5em " + fontFamily;
  }

  function start() {
    setState(() => {
      const state: WheelState = "started";
      stateRef.current = state;
      return state;
    });
    setSpinStart(() => {
      const now = Date.now();
      spinStartRef.current = now;
      return now;
    });
    timerIntervalRef.current = setInterval(onTimerTick, timerDelay);
  }

  function calculateVelocity(initialVelocity: number, timeElapsed: number) {
    return initialVelocity * Math.exp(-0.5 * timeElapsed);
  }

  function getTimeElapsed(startTime: number) {
    return (new Date().getTime() - startTime) / 1000;
  }

  function onTimerTick() {
    if (stateRef.current !== "started") {
      return;
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      throw new Error("No canvas context found");
    }

    draw(ctx);

    const timeElapsed = getTimeElapsed(spinStartRef.current!);
    const angularVelocity = calculateVelocity(
      initialVelocityRef.current,
      timeElapsed,
    );

    setAngle((angle) => {
      angle += angularVelocity * (timerDelay / 1000);
      angle = angle % (2 * Math.PI);
      angleRef.current = angle;
      return angle;
    });

    if (angularVelocity <= minAngularVelocity) {
      setState(() => {
        const state: WheelState = "finished";
        stateRef.current = state;
        return state;
      });
      clearInterval(timerIntervalRef.current!);
      timerIntervalRef.current = null;
      onFinished(currentSegmentIndexRef.current!);
    }
  }

  return (
    <div
      ref={wheelRef}
      className="my-4 flex w-full flex-col justify-center sm:w-[500px]"
    >
      <canvas
        ref={canvasRef}
        onClick={start}
        width={dimension}
        className="cursor-grab"
        height={dimension}
        style={{
          pointerEvents: state === "started" ? "none" : "auto",
        }}
      />
      {currentSegmentIndex != null && (
        <p className="text-center text-lg font-bold">
          {segments[currentSegmentIndex]} ({currentSegmentIndex})
        </p>
      )}
      Angle: {angle}
    </div>
  );
};
export default Wheel;
