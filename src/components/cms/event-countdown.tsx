"use client";
import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function EventCountdown({ startTime }: { startTime: string }) {
  const [diff, setDiff] = useState(() => new Date(startTime).getTime() - Date.now());

  useEffect(() => {
    const iv = setInterval(() => {
      setDiff(new Date(startTime).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(iv);
  }, [startTime]);

  if (diff <= 0) {
    return (
      <span className="rounded bg-white/20 px-3 py-1 text-sm font-medium text-white">
        Event is live or has ended
      </span>
    );
  }

  const totalSecs = Math.floor(diff / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const units = [
    { v: days, label: "Days" },
    { v: hours, label: "Hours" },
    { v: mins, label: "Min" },
    { v: secs, label: "Sec" },
  ];

  return (
    <div className="flex items-center gap-1">
      <span className="mr-2 text-sm text-white/70 font-medium">Starts in</span>
      {units.map(({ v, label }, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center rounded bg-white/20 px-2.5 py-1 min-w-[46px]">
            <span className="text-xl font-bold tabular-nums leading-none text-white">{pad(v)}</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-widest text-white/70">{label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="mx-1 text-lg font-bold text-white/50">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
