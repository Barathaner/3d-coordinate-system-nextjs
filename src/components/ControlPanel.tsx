'use client';

import React from 'react';

interface ControlPanelProps {
  currentTimestep: number;
  maxTimesteps: number;
  isAnimating: boolean;
  animationSpeed: number;
  showTrails: boolean;
  showGrid: boolean;
  isDarkMode: boolean;
  onTimestepChange: (timestep: number) => void;
  onAnimationToggle: () => void;
  onAnimationSpeedChange: (speed: number) => void;
  onTrailsToggle: () => void;
  onGridToggle: () => void;
  onDarkModeToggle: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onLoadSampleData: () => void;
}

export default function ControlPanel({
  currentTimestep,
  maxTimesteps,
  isAnimating,
  animationSpeed,
  showTrails,
  showGrid,
  isDarkMode,
  onTimestepChange,
  onAnimationToggle,
  onAnimationSpeedChange,
  onTrailsToggle,
  onGridToggle,
  onDarkModeToggle,
  onExportCSV,
  onExportJSON,
  onLoadSampleData,
}: ControlPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Controls
        </h2>
        <button
          onClick={onDarkModeToggle}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Animation Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Animation</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timestep: {currentTimestep + 1} / {maxTimesteps}
            </label>
            <button
              onClick={onAnimationToggle}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isAnimating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isAnimating ? 'Pause' : 'Play'}
            </button>
          </div>
          
          <input
            type="range"
            min="0"
            max={maxTimesteps - 1}
            value={currentTimestep}
            onChange={(e) => onTimestepChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Speed: {animationSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Display</h3>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showTrails"
            checked={showTrails}
            onChange={onTrailsToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="showTrails" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Movement Trails
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showGrid"
            checked={showGrid}
            onChange={onGridToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="showGrid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Grid
          </label>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Export</h3>
        <div className="flex space-x-2">
          <button
            onClick={onExportCSV}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={onExportJSON}
            className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Sample Data */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onLoadSampleData}
          className="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Load Sample Data
        </button>
      </div>
    </div>
  );
}