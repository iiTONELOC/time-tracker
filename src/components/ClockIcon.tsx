import { JSX } from "preact/jsx-runtime";
import { userTime, workTime } from "../signals";
import { useState, useEffect } from "preact/hooks";

const clockMap: { [key: string]: string } = {
  "0:00": "🕛",
  "0:30": "🕧",
  "1:00": "🕐",
  "1:30": "🕜",
  "2:00": "🕑",
  "2:30": "🕝",
  "3:00": "🕒",
  "3:30": "🕞",
  "4:00": "🕓",
  "4:30": "🕟",
  "5:00": "🕔",
  "5:30": "🕠",
  "6:00": "🕕",
  "6:30": "🕡",
  "7:00": "🕖",
  "7:30": "🕢",
  "8:00": "🕗",
  "8:30": "🕣",
  "9:00": "🕘",
  "9:30": "🕤",
  "10:00": "🕙",
  "10:30": "🕥",
  "11:00": "🕚",
  "11:30": "🕦",
};

const fallbackClock = "🕰️";

function getClosestTimeEmoji(getNow: () => string): string {
  const localeString = getNow();
  const [hoursStr, minutesStr] = localeString.split(":");

  const hour = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  let roundedHour = hour % 12;
  let roundedMinutes: "00" | "30";

  if (minutes < 15) {
    roundedMinutes = "00";
  } else if (minutes < 45) {
    roundedMinutes = "30";
  } else {
    roundedMinutes = "00";
    roundedHour = (roundedHour + 1) % 12;
  }

  const clockKey = `${roundedHour}:${roundedMinutes}`;

  return clockMap[clockKey] ?? fallbackClock;
}

type ClockIconProps = {
  type: "user" | "work";
  className?: string;
};

export function ClockIcon(props: Readonly<ClockIconProps>): JSX.Element {
  const [icon, setIcon] = useState<string>(fallbackClock);

  const getNow = () =>
    props.type === "user" ? userTime.value : workTime.value;

  useEffect(() => {
    setIcon(getClosestTimeEmoji(getNow));
  }, [props.type, userTime.value, workTime.value]);

  return (
    <span //NOSONAR
      role="img"
      aria-label="Clock icon"
      className={`${props.className ?? "text-base "}`}
    >
      {icon}
    </span>
  );
}
