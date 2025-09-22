import { DataPoint, TimeStep, VisualizationData } from '@/types';

export function generateColorPalette(labels: string[]): { [label: string]: string } {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#A3CB38', '#C7ECEE', '#FF6B35', '#F79F1F', '#6C5CE7',
    '#FD79A8', '#00B894', '#00CEC9', '#6C5CE7', '#74B9FF'
  ];
  
  const palette: { [label: string]: string } = {};
  labels.forEach((label, index) => {
    palette[label] = colors[index % colors.length];
  });
  
  return palette;
}

export function parseCSVData(csvContent: string): VisualizationData | null {
  try {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return null;
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Expected headers: x, y, z, label, timestep (or similar variations)
    const xIndex = headers.findIndex(h => h.toLowerCase().includes('x'));
    const yIndex = headers.findIndex(h => h.toLowerCase().includes('y'));
    const zIndex = headers.findIndex(h => h.toLowerCase().includes('z'));
    const labelIndex = headers.findIndex(h => h.toLowerCase().includes('label'));
    const timestepIndex = headers.findIndex(h => h.toLowerCase().includes('time') || h.toLowerCase().includes('step'));
    
    if (xIndex === -1 || yIndex === -1 || zIndex === -1) {
      throw new Error('CSV must contain x, y, z columns');
    }
    
    const points: DataPoint[] = [];
    const labels = new Set<string>();
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < 3) continue;
      
      const x = parseFloat(values[xIndex]);
      const y = parseFloat(values[yIndex]);
      const z = parseFloat(values[zIndex]);
      const label = labelIndex !== -1 ? values[labelIndex] : 'default';
      const timestep = timestepIndex !== -1 ? parseInt(values[timestepIndex]) || 0 : 0;
      
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        points.push({
          id: `point_${i}`,
          x, y, z,
          label,
          timestep
        });
        labels.add(label);
      }
    }
    
    const labelArray = Array.from(labels);
    const timesteps = groupPointsByTimestep(points);
    
    return {
      timesteps,
      labels: labelArray,
      colorPalette: generateColorPalette(labelArray)
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return null;
  }
}

export function parseJSONData(jsonContent: string): VisualizationData | null {
  try {
    const data = JSON.parse(jsonContent);
    
    // Handle different JSON structures
    if (Array.isArray(data)) {
      // Array of points
      const points: DataPoint[] = data.map((point, index) => ({
        id: point.id || `point_${index}`,
        x: point.x,
        y: point.y,
        z: point.z,
        label: point.label || 'default',
        timestep: point.timestep || 0
      }));
      
      const labels = Array.from(new Set(points.map(p => p.label)));
      const timesteps = groupPointsByTimestep(points);
      
      return {
        timesteps,
        labels,
        colorPalette: generateColorPalette(labels)
      };
    } else if (data.timesteps) {
      // Already structured data
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

function groupPointsByTimestep(points: DataPoint[]): TimeStep[] {
  const groups = new Map<number, DataPoint[]>();
  
  points.forEach(point => {
    if (!groups.has(point.timestep)) {
      groups.set(point.timestep, []);
    }
    groups.get(point.timestep)!.push(point);
  });
  
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([step, points]) => ({ step, points }));
}

export function exportToCSV(data: VisualizationData): string {
  const headers = ['x', 'y', 'z', 'label', 'timestep'];
  const rows = [headers.join(',')];
  
  data.timesteps.forEach(timestep => {
    timestep.points.forEach(point => {
      rows.push([
        point.x.toString(),
        point.y.toString(),
        point.z.toString(),
        point.label,
        point.timestep.toString()
      ].join(','));
    });
  });
  
  return rows.join('\n');
}

export function exportToJSON(data: VisualizationData): string {
  return JSON.stringify(data, null, 2);
}

export function generateSampleData(): VisualizationData {
  const labels = ['Class A', 'Class B', 'Class C'];
  const timesteps = 5;
  const pointsPerClass = 20;
  
  const data: TimeStep[] = [];
  
  for (let t = 0; t < timesteps; t++) {
    const points: DataPoint[] = [];
    
    labels.forEach((label, labelIndex) => {
      for (let i = 0; i < pointsPerClass; i++) {
        // Generate clustered points with some movement over time
        const baseX = (labelIndex - 1) * 3 + Math.random() * 2 - 1;
        const baseY = Math.random() * 4 - 2;
        const baseZ = Math.random() * 4 - 2;
        
        // Add time-based movement
        const timeOffset = t * 0.3;
        const x = baseX + Math.sin(timeOffset + i * 0.1) * 0.5;
        const y = baseY + Math.cos(timeOffset + i * 0.1) * 0.3;
        const z = baseZ + Math.sin(timeOffset * 1.5 + i * 0.05) * 0.4;
        
        points.push({
          id: `${label}_${i}_${t}`,
          x: x,
          y: y,
          z: z,
          label,
          timestep: t
        });
      }
    });
    
    data.push({ step: t, points });
  }
  
  return {
    timesteps: data,
    labels,
    colorPalette: generateColorPalette(labels)
  };
}