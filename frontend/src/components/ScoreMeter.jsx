import { useEffect, useState } from "react";

export default function ScoreMeter({ score }) {
  const [animatedOffset, setAnimatedOffset] = useState(0);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      const targetOffset = circumference - (score / 100) * circumference;
      setAnimatedOffset(targetOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const getColor = (s) => {
    if (s >= 70) return "#22c55e";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(score);

  const getLabel = (s) => {
    if (s >= 70) return "Credible";
    if (s >= 40) return "Uncertain";
    return "Suspicious";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="160"
        height="160"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track — pure black */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.3s ease-out" }}
        />
      </svg>

      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <span className="text-3xl font-bold" style={{ color, lineHeight: 1 }}>
          {score}
        </span>
        <span className="text-xs mt-1" style={{ color: "#6b7280" }}>
          / 100
        </span>
        <span className="text-xs font-medium mt-1" style={{ color }}>
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
}
