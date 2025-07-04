import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Komponen Partikel Bintang
const Stars = ({ count = 5000 }) => {
  const ref = useRef();
  const { viewport } = useThree();
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, [count, viewport]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

// Komponen Nebula
const Nebula = () => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.02;
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -50]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.3}
        color="#6366f1"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Komponen Planet
const Planet = ({ position, size, color, speed }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.1) * 2;
      ref.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.1) * 1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
};

// Komponen Gelembung Ocean
const OceanBubbles = ({ count = 50 }) => {
  const ref = useRef();
  const { viewport } = useThree();
  
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * viewport.width * 5,
        (Math.random() - 0.5) * viewport.height * 5,
        Math.random() * 50
      ],
      size: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01
    }));
  }, [count, viewport]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((bubble, i) => {
        bubble.position.y += bubbles[i].speed;
        if (bubble.position.y > viewport.height * 3) {
          bubble.position.y = -viewport.height * 3;
        }
        bubble.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime + i) * 0.2;
      });
    }
  });

  return (
    <group ref={ref}>
      {bubbles.map((bubble, i) => (
        <mesh key={i} position={bubble.position}>
          <sphereGeometry args={[bubble.size, 16, 16]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// Komponen Utama Background 3D
const CosmicOceanScene = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Parallax effect berdasarkan scroll
      groupRef.current.position.y = scrollY * 0.001;
      
      // Mouse parallax effect
      groupRef.current.rotation.x = mousePosition.y * 0.0001;
      groupRef.current.rotation.y = mousePosition.x * 0.0001;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars count={3000} />
      <Nebula />
      <Planet position={[-20, 10, -30]} size={2} color="#a855f7" speed={0.01} />
      <Planet position={[25, -15, -40]} size={1.5} color="#6366f1" speed={0.015} />
      <Planet position={[0, 20, -60]} size={3} color="#0ea5e9" speed={0.008} />
      <OceanBubbles count={30} />
    </group>
  );
};

// Komponen Wrapper Canvas
const CosmicOceanBackground = ({ scrollY, mousePosition }) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'linear-gradient(180deg, #030014 0%, #0a0a2e 50%, #1a1a3a 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CosmicOceanScene scrollY={scrollY} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default CosmicOceanBackground;