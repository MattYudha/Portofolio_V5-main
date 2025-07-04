import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Export the scene component (not wrapped in Canvas)
export const CosmicOceanScene = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  const pointsRef = useRef();
  const particlesRef = useRef();

  // Generate star field
  const starPositions = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  // Generate ocean particles
  const oceanPositions = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40 - 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;
      
      // React to scroll
      pointsRef.current.position.z = scrollY * 0.001;
      
      // React to mouse
      pointsRef.current.rotation.x += mousePosition.y * 0.0001;
      pointsRef.current.rotation.y += mousePosition.x * 0.0001;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= 0.0003;
      
      // Ocean wave effect
      const time = state.clock.getElapsedTime();
      particlesRef.current.position.y = Math.sin(time * 0.5) * 0.5;
      
      // React to scroll (opposite direction for depth)
      particlesRef.current.position.z = -scrollY * 0.002;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Cosmic stars */}
      <Points ref={pointsRef} positions={starPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Ocean particles */}
      <Points ref={particlesRef} positions={oceanPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00ffff"
          size={1.2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Fog for depth */}
      <fog attach="fog" args={['#030014', 10, 100]} />
    </>
  );
};

// Keep the original wrapper for backward compatibility if needed
const CosmicOceanBackground = (props) => {
  return <CosmicOceanScene {...props} />;
};

export default CosmicOceanBackground;