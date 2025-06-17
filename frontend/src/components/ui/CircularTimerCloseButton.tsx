
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface CircularTimerCloseButtonProps {
  duration?: number; // ms
  onClick: () => void;
  running: boolean;
}

const radius = 10; // px
const stroke = 2;
const circumference = 2 * Math.PI * radius;

export const CircularTimerCloseButton: React.FC<CircularTimerCloseButtonProps> = ({
  duration = 5000,
  onClick,
  running,
}) => {
  const [progress, setProgress] = React.useState(1);
  const requestRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());
  const active = running;

  // Animate progress
  useEffect(() => {
    if (!active) return;
    startRef.current = Date.now();
    setProgress(1);

    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 1 - elapsed / duration);
      setProgress(pct);
      if (pct > 0) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [active, duration]);

  return (
    <button
      className="relative flex items-center justify-center w-8 h-8 rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus:outline-none transition bg-transparent"
      tabIndex={0}
      aria-label="Close"
      type="button"
      onClick={onClick}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg
        className="absolute inset-0"
        width={32}
        height={32}
        viewBox="0 0 32 32"
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx={16}
          cy={16}
          r={radius}
          fill="none"
          stroke="var(--accent-500)"
          strokeWidth={stroke}
          opacity={0.18}
        />
        <circle
          cx={16}
          cy={16}
          r={radius}
          fill="none"
          stroke="var(--primary-600)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{
            transition: progress === 1 ? "none" : "stroke-dashoffset 0.2s linear",
          }}
        />
      </svg>
      <X className="w-3.5 h-3.5 text-[var(--text-600)] relative z-10" />
    </button>
  );
};
