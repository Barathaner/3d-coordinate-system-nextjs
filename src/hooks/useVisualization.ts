'use client';

import { useState, useEffect, useCallback } from 'react';
import { VisualizationData, ViewState, DataPoint, TooltipData } from '@/types';
import { generateSampleData, parseCSVData, parseJSONData, exportToCSV, exportToJSON } from '@/utils/dataUtils';

export function useVisualization() {
  const [data, setData] = useState<VisualizationData | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    currentTimestep: 0,
    isAnimating: false,
    animationSpeed: 1.0,
    showTrails: false,
    showGrid: true,
    isDarkMode: false,
  });
  const [highlightedPoint, setHighlightedPoint] = useState<DataPoint | null>(null);
  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    point: null,
    position: null,
    visible: false,
  });

  // Animation effect
  useEffect(() => {
    if (!viewState.isAnimating || !data || data.timesteps.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setViewState(prev => ({
        ...prev,
        currentTimestep: (prev.currentTimestep + 1) % data.timesteps.length,
      }));
    }, 1000 / viewState.animationSpeed);

    return () => clearInterval(interval);
  }, [viewState.isAnimating, viewState.animationSpeed, data]);

  // Dark mode effect
  useEffect(() => {
    if (viewState.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, [viewState.isDarkMode]);

  const loadData = useCallback((content: string, filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    let parsedData: VisualizationData | null = null;

    if (extension === 'csv') {
      parsedData = parseCSVData(content);
    } else if (extension === 'json') {
      parsedData = parseJSONData(content);
    }

    if (parsedData) {
      setData(parsedData);
      setViewState(prev => ({ ...prev, currentTimestep: 0, isAnimating: false }));
      setHighlightedPoint(null);
      setHighlightedLabel(null);
      setTooltip({ point: null, position: null, visible: false });
    } else {
      alert('Failed to parse the uploaded file. Please check the format.');
    }
  }, []);

  const loadSampleData = useCallback(() => {
    const sampleData = generateSampleData();
    setData(sampleData);
    setViewState(prev => ({ ...prev, currentTimestep: 0, isAnimating: false }));
    setHighlightedPoint(null);
    setHighlightedLabel(null);
    setTooltip({ point: null, position: null, visible: false });
  }, []);

  const updateTimestep = useCallback((timestep: number) => {
    setViewState(prev => ({ ...prev, currentTimestep: timestep, isAnimating: false }));
  }, []);

  const toggleAnimation = useCallback(() => {
    setViewState(prev => ({ ...prev, isAnimating: !prev.isAnimating }));
  }, []);

  const updateAnimationSpeed = useCallback((speed: number) => {
    setViewState(prev => ({ ...prev, animationSpeed: speed }));
  }, []);

  const toggleTrails = useCallback(() => {
    setViewState(prev => ({ ...prev, showTrails: !prev.showTrails }));
  }, []);

  const toggleGrid = useCallback(() => {
    setViewState(prev => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setViewState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const handlePointHover = useCallback((point: DataPoint | null, position?: { x: number; y: number }) => {
    setTooltip({
      point,
      position: position || null,
      visible: !!point,
    });
  }, []);

  const handlePointClick = useCallback((point: DataPoint) => {
    setHighlightedPoint(prev => prev?.id === point.id ? null : point);
  }, []);

  const handleLabelClick = useCallback((label: string) => {
    setHighlightedLabel(prev => prev === label ? null : label);
  }, []);

  const exportCSV = useCallback(() => {
    if (!data) return;
    
    const csvContent = exportToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visualization_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  const exportJSON = useCallback(() => {
    if (!data) return;
    
    const jsonContent = exportToJSON(data);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visualization_data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  // Get current timestep data
  const currentPoints = data?.timesteps[viewState.currentTimestep]?.points || [];
  
  // Filter points by highlighted label if any
  const filteredPoints = highlightedLabel
    ? currentPoints.filter(point => point.label === highlightedLabel)
    : currentPoints;

  // Get all timestep points for trails
  const allTimestepPoints = data?.timesteps.slice(0, viewState.currentTimestep + 1).map(ts => ts.points) || [];

  return {
    data,
    viewState,
    currentPoints: filteredPoints,
    allTimestepPoints,
    highlightedPoint,
    highlightedLabel,
    tooltip,
    actions: {
      loadData,
      loadSampleData,
      updateTimestep,
      toggleAnimation,
      updateAnimationSpeed,
      toggleTrails,
      toggleGrid,
      toggleDarkMode,
      handlePointHover,
      handlePointClick,
      handleLabelClick,
      exportCSV,
      exportJSON,
    },
  };
}