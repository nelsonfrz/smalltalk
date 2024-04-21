import { useStopwatch } from "react-timer-hook";
import { Button } from "../ui/button";

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
      <div className="flex justify-center gap-4">
        <Button
          className="w-26"
          variant={isRunning ? "secondary" : "outline"}
          onClick={() => (isRunning ? pause() : start())}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>

        <Button
          className="w-26"
          variant={"destructive"}
          onClick={() => {
            reset(undefined, false);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
