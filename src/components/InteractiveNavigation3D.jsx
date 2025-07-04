import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Ring, Box } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';

const NavigationOrb = ({ 
  name, 
  position, 
  color, 
  targetSection,
  index 
}) => {
  const orbRef = useRef();
  const ringRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (orbRef.current) {
      // Floating animation
      const time = state.clock.getElapsedTime();
      orbRef.current.position.y = position[1] + Math.sin(time * 0.8 + index) * 0.3;
      
      // Gentle rotation
      orbRef.current.rotation.y += 0.005;
      orbRef.current.rotation.z = Math.sin(time * 0.5 + index) * 0.1;
      
      // Scale animation on hover
      const targetScale = hovered ? 1.4 : 1;
      orbRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.3 + 0.7;
      glowRef.current.material.opacity = hovered ? pulse * 0.6 : pulse * 0.2;
    }
  });

  const handleClick = () => {
    setClicked(true);
    
    // GSAP animation for click feedback
    gsap.to(orbRef.current.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setClicked(false);
        // Navigate to section
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  };

  return (
    <group position={position}>
      {/* Outer glow */}
      <Sphere
        ref={glowRef}
        args={[1.5, 16, 16]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
        />
      </Sphere>

      {/* Main orb */}
      <Sphere
        ref={orbRef}
        args={[0.6, 32, 32]}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Orbital rings */}
      <Ring
        ref={ringRef}
        args={[1.2, 1.3, 32]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Secondary ring */}
      <Ring
        args={[1.6, 1.65, 32]}
        rotation={[Math.PI / 3, Math.PI / 4, 0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.4 : 0.2}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Navigation label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/space-grotesk.woff"
      >
        {name}
      </Text>

      {/* Constellation lines when hovered */}
      {hovered && (
        <group>
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              args={[0.02, 0.02, 2]}
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 2,
                Math.sin((i / 6) * Math.PI * 2) * 2,
                0
              ]}
              rotation={[0, 0, (i / 6) * Math.PI * 2]}
            >
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.6}
              />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
};

export const InteractiveNavigation3D = () => {
  const groupRef = useRef();
  
  const navigationItems = [
    { 
      name: 'Home', 
      position: [-8, 0, 0], 
      color: '#3b82f6', 
      targetSection: 'Home' 
    },
    { 
      name: 'About', 
      position: [-3, 0, 0], 
      color: '#6366f1', 
      targetSection: 'About' 
    },
    { 
      name: 'Portfolio', 
      position: [3, 0, 0], 
      color: '#8b5cf6', 
      targetSection: 'Portofolio' 
    },
    { 
      name: 'Contact', 
      position: [8, 0, 0], 
      color: '#a855f7', 
      targetSection: 'Contact' 
    },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle constellation movement
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 8, -5]}>
      {navigationItems.map((item, index) => (
        <NavigationOrb
          key={item.name}
          name={item.name}
          position={item.position}
          color={item.color}
          targetSection={item.targetSection}
          index={index}
        />
      ))}
      
      {/* Constellation background */}
      <group>
        {[...Array(20)].map((_, i) => (
          <Sphere
            key={i}
            args={[0.02, 8, 8]}
            position={[
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10
            ]}
          >
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={Math.random() * 0.8 + 0.2}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
};

export default InteractiveNavigation3D;