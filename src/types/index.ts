export interface DataPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  label: string;
  timestep: number;
}

export interface TimeStep {
  step: number;
  points: DataPoint[];
}

export interface VisualizationData {
  timesteps: TimeStep[];
  labels: string[];
  colorPalette: { [label: string]: string };
}

export interface ViewState {
  currentTimestep: number;
  isAnimating: boolean;
  animationSpeed: number;
  showTrails: boolean;
  showGrid: boolean;
  isDarkMode: boolean;
}

export interface CameraControls {
  enableZoom: boolean;
  enablePan: boolean;
  enableRotate: boolean;
}

export interface TooltipData {
  point: DataPoint | null;
  position: { x: number; y: number } | null;
  visible: boolean;
}