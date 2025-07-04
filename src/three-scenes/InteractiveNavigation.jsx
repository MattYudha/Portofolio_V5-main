import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Komponen Planet Navigasi
const NavigationPlanet = ({ 
  position, 
  text, 
  href, 
  color, 
  isActive, 
  onHover, 
  onLeave, 
  onClick 
}) => {
  const meshRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Efek hover
      const targetScale = hovered || isActive ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover && onHover();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onLeave && onLeave();
    document.body.style.cursor = 'default';
  };

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.8, 32, 32]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hovered || isActive ? 0.9 : 0.7}
          emissive={color}
          emissiveIntensity={hovered || isActive ? 0.3 : 0.1}
        />
      </Sphere>
      
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.3, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered || isActive ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Text Label */}
      <Text
        ref={textRef}
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color={hovered || isActive ? '#ffffff' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {text}
      </Text>
    </group>
  );
};

// Komponen Utama Navigasi 3D
const InteractiveNavigation = ({ activeSection, onNavigate }) => {
  const groupRef = useRef();

  const navItems = [
    { text: 'Home', href: '#Home', color: '#6366f1', position: [-4, 0, 0] },
    { text: 'About', href: '#About', color: '#a855f7', position: [-1.5, 0, 0] },
    { text: 'Portfolio', href: '#Portofolio', color: '#0ea5e9', position: [1.5, 0, 0] },
    { text: 'Contact', href: '#Contact', color: '#10b981', position: [4, 0, 0] },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const handleNavClick = (href) => {
    onNavigate && onNavigate(href);
    
    // Smooth scroll ke section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-96 h-24">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <group ref={groupRef}>
          {navItems.map((item, index) => (
            <NavigationPlanet
              key={item.text}
              position={item.position}
              text={item.text}
              href={item.href}
              color={item.color}
              isActive={activeSection === item.href.substring(1)}
              onClick={() => handleNavClick(item.href)}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
};

export default InteractiveNavigation;