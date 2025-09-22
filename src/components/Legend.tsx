'use client';

import React from 'react';

interface LegendProps {
  colorPalette: { [label: string]: string };
  highlightedLabel: string | null;
  onLabelClick: (label: string) => void;
}

export default function Legend({ colorPalette, highlightedLabel, onLabelClick }: LegendProps) {
  const labels = Object.keys(colorPalette);

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
        Legend
      </h3>
      <div className="space-y-2">
        {labels.map((label) => (
          <div
            key={label}
            onClick={() => onLabelClick(label)}
            className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${
              highlightedLabel === label
                ? 'bg-gray-100 dark:bg-gray-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: colorPalette[label] }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}