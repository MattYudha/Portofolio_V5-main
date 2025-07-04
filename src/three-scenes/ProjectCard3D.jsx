import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Plane } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Individual project card component
const ProjectCard3D = ({ project, position, index }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + index) * 0.1;
      
      // Rotation animation
      meshRef.current.rotation.y += 0.005;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handleClick = () => {
    if (project.id) {
      navigate(`/project/${project.id}`);
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Main project box */}
      <Box args={[2, 2.5, 0.2]}>
        <meshStandardMaterial
          color={hovered ? '#8b5cf6' : '#6366f1'}
          transparent
          opacity={0.8}
          emissive={hovered ? '#8b5cf6' : '#6366f1'}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </Box>
      
      {/* Project title */}
      <Text
        position={[0, 0.8, 0.11]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {project.Title || 'Project Title'}
      </Text>
      
      {/* Project description */}
      <Text
        position={[0, 0.2, 0.11]}
        fontSize={0.08}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
      >
        {project.Description ? project.Description.substring(0, 100) + '...' : 'Project description...'}
      </Text>
      
      {/* Tech stack indicator */}
      {project.TechStack && project.TechStack.length > 0 && (
        <Text
          position={[0, -0.8, 0.11]}
          fontSize={0.06}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {project.TechStack.slice(0, 3).join(' • ')}
        </Text>
      )}
      
      {/* Hover effect particles */}
      {hovered && (
        <group>
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              args={[0.05, 0.05, 0.05]}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.5,
                Math.sin((i / 8) * Math.PI * 2) * 1.5,
                0.3
              ]}
            >
              <meshStandardMaterial
                color="#a855f7"
                transparent
                opacity={0.6}
                emissive="#a855f7"
                emissiveIntensity={0.5}
              />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
};

// Export the project grid elements (not wrapped in Canvas)
export const ProjectGridElements = ({ projects = [], scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // React to scroll
      groupRef.current.position.z = scrollY * 0.002;
      
      // React to mouse
      groupRef.current.rotation.x = mousePosition.y * 0.05;
      groupRef.current.rotation.y = mousePosition.x * 0.05;
    }
  });

  // Calculate grid positions
  const getGridPosition = (index) => {
    const cols = 3;
    const spacing = 3;
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return [
      (col - 1) * spacing,
      -row * spacing - 5, // Start below the navigation
      -2
    ];
  };

  return (
    <group ref={groupRef}>
      {projects.slice(0, 9).map((project, index) => (
        <ProjectCard3D
          key={project.id || index}
          project={project}
          position={getGridPosition(index)}
          index={index}
        />
      ))}
    </group>
  );
};

// Keep the original wrapper for backward compatibility if needed
const ProjectGrid3D = (props) => {
  return <ProjectGridElements {...props} />;
};

export default ProjectGrid3D;