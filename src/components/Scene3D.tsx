'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { DataPoint, TooltipData } from '@/types';

interface Point3DProps {
  point: DataPoint;
  color: string;
  isHighlighted: boolean;
  onHover: (point: DataPoint | null, position?: { x: number; y: number }) => void;
  onClick: (point: DataPoint) => void;
}

function Point3D({ point, color, isHighlighted, onHover, onClick }: Point3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setHovered(true);
    const screenPosition = new THREE.Vector3(point.x, point.y, point.z).project(camera);
    const x = (screenPosition.x * 0.5 + 0.5) * gl.domElement.clientWidth;
    const y = (screenPosition.y * -0.5 + 0.5) * gl.domElement.clientHeight;
    onHover(point, { x, y });
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    setHovered(false);
    onHover(null);
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick(point);
  };

  useFrame(() => {
    if (meshRef.current) {
      // Add subtle pulsing animation for highlighted points
      if (isHighlighted) {
        const time = Date.now() * 0.005;
        meshRef.current.scale.setScalar(1 + Math.sin(time) * 0.1);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[point.x, point.y, point.z]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={isHighlighted ? color : '#000000'}
        emissiveIntensity={isHighlighted ? 0.3 : 0}
      />
    </mesh>
  );
}

interface TrailProps {
  points: DataPoint[];
  color: string;
}

function Trail({ points, color }: TrailProps) {
  const lineRef = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(points.length * 3);
    points.forEach((point, index) => {
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    });
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }))} />
  );
}

interface Scene3DProps {
  points: DataPoint[];
  colorPalette: { [label: string]: string };
  highlightedPoint: DataPoint | null;
  showTrails: boolean;
  showGrid: boolean;
  allTimestepPoints?: DataPoint[][];
  onPointHover: (point: DataPoint | null, position?: { x: number; y: number }) => void;
  onPointClick: (point: DataPoint) => void;
}

function CoordinateSystem() {
  return (
    <>
      {/* X axis - Red */}
      <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 5]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Y axis - Green */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 5]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>

      {/* Z axis - Blue */}
      <mesh position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 5]} />
        <meshBasicMaterial color="#0000ff" />
      </mesh>
    </>
  );
}

export default function Scene3D({
  points,
  colorPalette,
  highlightedPoint,
  showTrails,
  showGrid,
  allTimestepPoints = [],
  onPointHover,
  onPointClick,
}: Scene3DProps) {
  // Group trails by point ID for animation
  const trails = useMemo(() => {
    if (!showTrails || allTimestepPoints.length === 0) return [];
    
    const trailsMap = new Map<string, DataPoint[]>();
    
    allTimestepPoints.forEach(timestepPoints => {
      timestepPoints.forEach(point => {
        const baseId = point.id.replace(/_\d+$/, ''); // Remove timestep suffix
        if (!trailsMap.has(baseId)) {
          trailsMap.set(baseId, []);
        }
        trailsMap.get(baseId)!.push(point);
      });
    });
    
    return Array.from(trailsMap.entries()).map(([id, trailPoints]) => ({
      id,
      points: trailPoints.sort((a, b) => a.timestep - b.timestep),
      color: colorPalette[trailPoints[0]?.label] || '#ffffff'
    }));
  }, [showTrails, allTimestepPoints, colorPalette]);

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 75 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Coordinate system */}
      <CoordinateSystem />

      {/* Grid */}
      {showGrid && (
        <>
          <Grid
            position={[0, -3, 0]}
            args={[10, 10]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#888888"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#cccccc"
            fadeDistance={25}
            fadeStrength={1}
            infiniteGrid
          />
        </>
      )}

      {/* Trails */}
      {showTrails && trails.map(trail => (
        <Trail
          key={trail.id}
          points={trail.points}
          color={trail.color}
        />
      ))}

      {/* Points */}
      {points.map(point => (
        <Point3D
          key={point.id}
          point={point}
          color={colorPalette[point.label] || '#ffffff'}
          isHighlighted={highlightedPoint?.id === point.id}
          onHover={onPointHover}
          onClick={onPointClick}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        panSpeed={0.5}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
      />
    </Canvas>
  );
}