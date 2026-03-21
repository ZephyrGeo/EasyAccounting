import React from "react";
import { clampPercentage } from "@/utils/math";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: "blue" | "green" | "orange" | "gradient";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProgressBar({ value, max, color = "blue", size = "md", className = "" }: ProgressBarProps) {
  const percentage = clampPercentage(value, max);

  const sizeStyles = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorStyles = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    gradient: "bg-gradient-to-r from-orange-400 to-pink-500",
  };

  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size]} ${className}`}>
      <div
        className={`${sizeStyles[size]} rounded-full transition-all duration-300 ${colorStyles[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
