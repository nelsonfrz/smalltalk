import { useStopwatch } from "react-timer-hook";
import { Button } from "../ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

export function Stopwatch() {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({});

  return (
    <div className="flex flex-col gap-2">
      <div className="text-center text-2xl font-semibold">
        <span>{String(hours).padStart(2, "0")}</span>:
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-44 flex gap-2"
          variant={isRunning ? "secondary" : "outline"}
          onClick={() => (isRunning ? pause() : start())}
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? "Pause stopwatch" : "Start stopwatch"}
        </Button>

        <Button
          className="w-44 flex gap-2"
          variant={"destructive"}
          onClick={() => {
            reset(undefined, false);
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset stopwatch
        </Button>
      </div>
    </div>
  );
}
