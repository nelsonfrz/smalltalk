"use client";

import { useEffect, useRef, useState } from "react";

export interface WheelComponentProps {
  items: string[];
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
  items,
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
    Math.random() * 12 * Math.PI + Math.PI,
  );
  const initialVelocityRef = useRef(initialVelocity);
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(angle);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [spinStart, setSpinStart] = useState<number | null>(null);
  const spinStartRef = useRef(spinStart);

  const dimension = (size + 20) * 2;
  const timerDelay = items.length;
  const centerX = size + 20;
  const centerY = size + 20;
  const minAngularVelocity = 0.07;
  const damping = 0.8;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      throw new Error("No canvas context found");
    }
    draw(ctx);
  }, [
    items,
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
      items.length - Math.floor((change / (Math.PI * 2)) * items.length) - 1;
    if (i < 0) i = i + items.length;

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
    const segmentsAmount = items.length;
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
    ctx.fillStyle = primaryColor;
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
    const value = items[key];
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
    ctx.fillText(value.substring(0, 32), size / 2 + 20, 0);

    ctx.restore();
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
    if (state === "started") {
      setInitialVelocity((initialVelocity) => {
        const newInitialVelocity = Math.min(
          initialVelocity + Math.PI / 4,
          10 * Math.PI,
        );
        initialVelocityRef.current = newInitialVelocity;
        return newInitialVelocity;
      });
      setSpinStart(() => {
        const now = Date.now();
        spinStartRef.current = now;
        return now;
      });
    } else if (state === "initial") {
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
  }

  function calculateVelocity(initialVelocity: number, timeElapsed: number) {
    return initialVelocity * Math.exp(-damping * timeElapsed);
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
        const state: WheelState = "initial";
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
      className="flex w-full flex-col justify-center sm:w-[500px]"
    >
      <canvas
        ref={canvasRef}
        onClick={start}
        width={dimension}
        className="cursor-grab"
        height={dimension}
      />
      {currentSegmentIndex != null && (
        <p className="text-center text-lg font-bold">
          {items[currentSegmentIndex]}
        </p>
      )}
    </div>
  );
};
export default Wheel;
