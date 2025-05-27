import React from "react";

interface DetailItemProps {
  icon: string;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}

export function DetailItem({
  icon,
  label,
  value,
  valueClass = "",
}: DetailItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <img
          src={`/icons/${icon}.svg`}
          alt={label}
          className="w-10 h-10"
        />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`font-medium ${valueClass}`}>{value}</div>
      </div>
    </div>
  );
}