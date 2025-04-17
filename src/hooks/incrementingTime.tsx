import { useIsMounted } from "./isMounted";
import { ChangeEvent } from "preact/compat";
import { dateTo_HH_MM_SS, now } from "../utils";
import { useEffect, useState, Dispatch, StateUpdater } from "preact/hooks";

export type UseIncrementingTime = {
  time: string;
  resetTime: () => void;
  setTime: Dispatch<StateUpdater<string>>;
  clearTimeInterval: () => void;
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function useIncrementingTime(): UseIncrementingTime {
  const isMounted = useIsMounted();
  const [time, setTime] = useState<string>(dateTo_HH_MM_SS(now()));
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout | null>(null);

  const handleClearCallTimeInterval = () => {
    if (timeInterval) {
      clearInterval(timeInterval);
      setTimeInterval(null);
    }
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    handleClearCallTimeInterval();
    setTime(value);
  };

  const startTimeInterval = () => {
    !timeInterval &&
      setTimeInterval(
        setInterval(() => {
          setTime(dateTo_HH_MM_SS(now()));
        }, 1000)
      );
  };

  useEffect(() => {
    isMounted && startTimeInterval();
    return () => {
      isMounted && handleClearCallTimeInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const resetTime = () => {
    handleClearCallTimeInterval();
    startTimeInterval();
  };

  return {
    time,
    setTime,
    resetTime,
    handleTimeChange,
    clearTimeInterval: handleClearCallTimeInterval,
  };
}
