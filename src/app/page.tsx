'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import FileUpload from '@/components/FileUpload';
import ControlPanel from '@/components/ControlPanel';
import Legend from '@/components/Legend';
import Tooltip from '@/components/Tooltip';
import { useVisualization } from '@/hooks/useVisualization';

// Dynamically import Scene3D to avoid SSR issues with Three.js
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-500">Loading 3D Scene...</div>
    </div>
  ),
});

export default function HomePage() {
  const {
    data,
    viewState,
    currentPoints,
    allTimestepPoints,
    highlightedPoint,
    highlightedLabel,
    tooltip,
    actions,
  } = useVisualization();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            3D Coordinate System Visualization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive 3D visualization of PCA data with labels, time steps, and animations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6 overflow-y-auto">
            {/* File Upload */}
            {!data && (
              <FileUpload
                onFileUpload={actions.loadData}
                label="Upload PCA Data"
              />
            )}

            {/* Control Panel */}
            {data && (
              <ControlPanel
                currentTimestep={viewState.currentTimestep}
                maxTimesteps={data.timesteps.length}
                isAnimating={viewState.isAnimating}
                animationSpeed={viewState.animationSpeed}
                showTrails={viewState.showTrails}
                showGrid={viewState.showGrid}
                isDarkMode={viewState.isDarkMode}
                onTimestepChange={actions.updateTimestep}
                onAnimationToggle={actions.toggleAnimation}
                onAnimationSpeedChange={actions.updateAnimationSpeed}
                onTrailsToggle={actions.toggleTrails}
                onGridToggle={actions.toggleGrid}
                onDarkModeToggle={actions.toggleDarkMode}
                onExportCSV={actions.exportCSV}
                onExportJSON={actions.exportJSON}
                onLoadSampleData={actions.loadSampleData}
              />
            )}

            {/* Legend */}
            {data && (
              <Legend
                colorPalette={data.colorPalette}
                highlightedLabel={highlightedLabel}
                onLabelClick={actions.handleLabelClick}
              />
            )}
          </div>

          {/* Main Content - 3D Scene */}
          <div className="lg:col-span-3 relative">
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {data ? (
                <Scene3D
                  points={currentPoints}
                  colorPalette={data.colorPalette}
                  highlightedPoint={highlightedPoint}
                  showTrails={viewState.showTrails}
                  showGrid={viewState.showGrid}
                  allTimestepPoints={allTimestepPoints}
                  onPointHover={actions.handlePointHover}
                  onPointClick={actions.handlePointClick}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No data loaded</p>
                  <p className="text-sm text-center max-w-md">
                    Upload your PCA data in CSV or JSON format, or load sample data to get started.
                  </p>
                  <button
                    onClick={actions.loadSampleData}
                    className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Load Sample Data
                  </button>
                </div>
              )}
            </div>

            {/* Tooltip */}
            <Tooltip
              point={tooltip.point}
              position={tooltip.position}
              visible={tooltip.visible}
            />
          </div>
        </div>

        {/* Data Info */}
        {data && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex space-x-6">
                <span>
                  <strong>Points:</strong> {currentPoints.length}
                </span>
                <span>
                  <strong>Labels:</strong> {data.labels.length}
                </span>
                <span>
                  <strong>Timesteps:</strong> {data.timesteps.length}
                </span>
              </div>
              <div className="text-xs">
                Use mouse to rotate, wheel to zoom, right-click to pan
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}