import React from "react";

interface DetailItemProps {
  icon: string;
  color: string;
  bg: string;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}

export function DetailItem({
  icon,
  color,
  bg,
  label,
  value,
  valueClass = "",
}: DetailItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 bg-${bg} rounded flex items-center justify-center`}>
        <span className={`text-${color} text-sm`}>{icon}</span>
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`font-medium ${valueClass}`}>{value}</div>
      </div>
    </div>
  );
}