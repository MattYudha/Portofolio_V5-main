import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, useTexture, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollAndMouse } from '../hooks/useScrollAndMouse';

// Cosmic Ocean Background Scene
const CosmicOceanScene = () => {
  const { scrollY, mousePosition } = useScrollAndMouse();
  const starsRef = useRef();
  const oceanRef = useRef();
  const galaxyRef = useRef();
  const { camera } = useThree();

  // Generate Milky Way-like galaxy
  const galaxyPositions = useMemo(() => {
    const positions = new Float32Array(15000 * 3);
    const colors = new Float32Array(15000 * 3);
    
    for (let i = 0; i < 15000; i++) {
      // Create spiral galaxy pattern
      const radius = Math.random() * 50;
      const spinAngle = radius * 0.3;
      const branchAngle = (i % 3) * ((2 * Math.PI) / 3);
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      
      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY * 0.3;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color gradient from center to edge
      const mixedColor = new THREE.Color();
      const innerColor = new THREE.Color('#4f46e5'); // Deep blue
      const outerColor = new THREE.Color('#06b6d4'); // Cyan
      mixedColor.lerpColors(innerColor, outerColor, radius / 50);
      
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, []);

  // Generate ocean wave particles
  const oceanWaves = useMemo(() => {
    const positions = new Float32Array(8000 * 3);
    const colors = new Float32Array(8000 * 3);
    
    for (let i = 0; i < 8000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * -30 - 10; // Below horizon
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      // Ocean colors - deep blue to cyan
      const depth = Math.abs(positions[i * 3 + 1]) / 40;
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#0ea5e9'), // Light blue
        new THREE.Color('#0f172a'), // Deep dark blue
        depth
      );
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Galaxy rotation
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = time * 0.0002;
      galaxyRef.current.rotation.z = Math.sin(time * 0.0001) * 0.05;
      
      // React to scroll - galaxy moves up as we scroll
      galaxyRef.current.position.y = scrollY * 0.001;
      
      // React to mouse
      galaxyRef.current.rotation.x += mousePosition.y * 0.0001;
      galaxyRef.current.rotation.y += mousePosition.x * 0.0001;
    }

    // Ocean wave animation
    if (oceanRef.current) {
      oceanRef.current.rotation.y = time * 0.0001;
      
      // Wave motion
      const positions = oceanRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] += Math.sin(time * 0.5 + x * 0.01 + z * 0.01) * 0.002;
      }
      oceanRef.current.geometry.attributes.position.needsUpdate = true;
      
      // React to scroll - ocean becomes more visible
      const oceanOpacity = Math.min(1, scrollY * 0.001);
      oceanRef.current.material.opacity = oceanOpacity * 0.8;
    }

    // Camera movement based on scroll
    camera.position.y = -scrollY * 0.0005;
    camera.lookAt(0, -scrollY * 0.0005, 0);
  });

  return (
    <>
      {/* Ambient lighting for cosmic atmosphere */}
      <ambientLight intensity={0.1} color="#1e1b4b" />
      
      {/* Moonlight effect */}
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={0.3} 
        color="#e0e7ff"
        castShadow
      />
      
      {/* Galaxy/Milky Way */}
      <Points 
        ref={galaxyRef} 
        positions={galaxyPositions.positions}
        colors={galaxyPositions.colors}
        stride={3} 
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </Points>

      {/* Ocean waves */}
      <Points 
        ref={oceanRef} 
        positions={oceanWaves.positions}
        colors={oceanWaves.colors}
        stride={3} 
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          size={1.5}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
          opacity={0.6}
        />
      </Points>

      {/* Additional stars for depth */}
      <Stars 
        radius={300} 
        depth={60} 
        count={3000} 
        factor={4} 
        saturation={0.5} 
        fade={true}
        speed={0.5}
      />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#0f172a', 20, 200]} />
    </>
  );
};

// Main Canvas Component
const CosmicOceanCanvas = ({ children }) => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ 
          position: [0, 0, 30], 
          fov: 60,
          near: 0.1,
          far: 1000 
        }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
      >
        <CosmicOceanScene />
        {children}
      </Canvas>
    </div>
  );
};

export default CosmicOceanCanvas;