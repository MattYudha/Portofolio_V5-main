import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

// Export the navigation elements (not wrapped in Canvas)
export const InteractiveNavigationElements = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  const groupRef = useRef();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { name: 'Home', position: [-6, 2, 0], color: '#6366f1' },
    { name: 'About', position: [-2, 2, 0], color: '#8b5cf6' },
    { name: 'Portfolio', position: [2, 2, 0], color: '#a855f7' },
    { name: 'Contact', position: [6, 2, 0], color: '#c084fc' },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      // React to mouse movement
      groupRef.current.rotation.x = mousePosition.y * 0.1;
      groupRef.current.rotation.y = mousePosition.x * 0.1;
      
      // React to scroll
      groupRef.current.position.z = scrollY * 0.001;
    }
  });

  const handleNavClick = (itemName) => {
    const element = document.getElementById(itemName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <group ref={groupRef} position={[0, 3, -2]}>
      {navItems.map((item, index) => (
        <group key={item.name} position={item.position}>
          {/* Navigation sphere */}
          <Sphere
            args={[0.3, 16, 16]}
            onPointerEnter={() => setHoveredItem(item.name)}
            onPointerLeave={() => setHoveredItem(null)}
            onClick={() => handleNavClick(item.name)}
          >
            <meshStandardMaterial
              color={item.color}
              transparent
              opacity={hoveredItem === item.name ? 0.8 : 0.6}
              emissive={item.color}
              emissiveIntensity={hoveredItem === item.name ? 0.3 : 0.1}
            />
          </Sphere>
          
          {/* Navigation text */}
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {item.name}
          </Text>
          
          {/* Hover effect */}
          {hoveredItem === item.name && (
            <Box args={[0.1, 0.1, 0.1]} position={[0, 0.5, 0]}>
              <meshStandardMaterial
                color={item.color}
                transparent
                opacity={0.7}
                emissive={item.color}
                emissiveIntensity={0.5}
              />
            </Box>
          )}
        </group>
      ))}
    </group>
  );
};

// Keep the original wrapper for backward compatibility if needed
const InteractiveNavigation = (props) => {
  return <InteractiveNavigationElements {...props} />;
};

export default InteractiveNavigation;