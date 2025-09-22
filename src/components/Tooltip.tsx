'use client';

import React from 'react';
import { DataPoint } from '@/types';

interface TooltipProps {
  point: DataPoint | null;
  position: { x: number; y: number } | null;
  visible: boolean;
}

export default function Tooltip({ point, position, visible }: TooltipProps) {
  if (!visible || !point || !position) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm border border-gray-700 dark:border-gray-300"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="space-y-1">
        <div className="font-semibold">
          {point.label}
        </div>
        <div className="text-xs space-y-0.5">
          <div>X: {point.x.toFixed(3)}</div>
          <div>Y: {point.y.toFixed(3)}</div>
          <div>Z: {point.z.toFixed(3)}</div>
          <div>Timestep: {point.timestep}</div>
        </div>
      </div>
      {/* Arrow pointing down */}
      <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
    </div>
  );
}