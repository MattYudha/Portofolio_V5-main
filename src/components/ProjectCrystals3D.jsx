import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Plane, useTexture } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const ProjectCrystal = ({ project, position, index }) => {
  const crystalRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // Create crystal geometry
  const crystalGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(1, 2.5, 6);
    return geometry;
  }, []);

  useFrame((state) => {
    if (crystalRef.current) {
      // Floating animation
      const time = state.clock.getElapsedTime();
      crystalRef.current.position.y = position[1] + Math.sin(time * 0.6 + index) * 0.2;
      
      // Rotation
      crystalRef.current.rotation.y += 0.008;
      crystalRef.current.rotation.z = Math.sin(time * 0.4 + index) * 0.1;
      
      // Scale on hover
      const targetScale = hovered ? 1.2 : 1;
      crystalRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );
    }

    if (glowRef.current) {
      // Pulsing glow
      const pulse = Math.sin(state.clock.getElapsedTime() * 1.5 + index) * 0.3 + 0.7;
      glowRef.current.material.opacity = hovered ? pulse * 0.4 : pulse * 0.2;
    }
  });

  const handleClick = () => {
    if (project.id) {
      navigate(`/project/${project.id}`);
    }
  };

  const crystalColor = useMemo(() => {
    const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'];
    return colors[index % colors.length];
  }, [index]);

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef} geometry={crystalGeometry}>
        <meshBasicMaterial
          color={crystalColor}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Main crystal */}
      <mesh
        ref={crystalRef}
        geometry={crystalGeometry}
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
        <meshPhysicalMaterial
          color={crystalColor}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.3}
          ior={1.5}
          emissive={crystalColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Project info panel */}
      <group position={[0, 3, 0]} visible={hovered}>
        {/* Background panel */}
        <Plane args={[4, 2]} position={[0, 0, -0.1]}>
          <meshBasicMaterial
            color="#0f172a"
            transparent
            opacity={0.9}
          />
        </Plane>

        {/* Project title */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
        >
          {project.Title || 'Project Title'}
        </Text>

        {/* Project description */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
        >
          {project.Description ? 
            project.Description.substring(0, 80) + '...' : 
            'Project description...'
          }
        </Text>

        {/* Tech stack */}
        {project.TechStack && project.TechStack.length > 0 && (
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.12}
            color={crystalColor}
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
          >
            {project.TechStack.slice(0, 3).join(' • ')}
          </Text>
        )}
      </group>

      {/* Energy particles around crystal */}
      {hovered && (
        <group>
          {[...Array(12)].map((_, i) => (
            <Box
              key={i}
              args={[0.05, 0.05, 0.05]}
              position={[
                Math.cos((i / 12) * Math.PI * 2) * 2,
                Math.sin((i / 12) * Math.PI * 2) * 2 + 1,
                Math.sin((i / 12) * Math.PI * 4) * 0.5
              ]}
            >
              <meshBasicMaterial
                color={crystalColor}
                transparent
                opacity={0.8}
              />
            </Box>
          ))}
        </group>
      )}

      {/* Base platform */}
      <Box args={[1.5, 0.1, 1.5]} position={[0, -1.5, 0]}>
        <meshStandardMaterial
          color="#1e293b"
          transparent
          opacity={0.6}
          emissive="#1e293b"
          emissiveIntensity={0.1}
        />
      </Box>
    </group>
  );
};

export const ProjectCrystals3D = ({ projects = [] }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle group rotation
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  // Calculate crystal positions in a spiral pattern
  const getCrystalPosition = (index) => {
    const radius = 8 + (index * 2);
    const angle = (index * 0.8) % (Math.PI * 2);
    const height = -index * 4 - 10; // Descend as we go deeper
    
    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ];
  };

  return (
    <group ref={groupRef}>
      {projects.slice(0, 12).map((project, index) => (
        <ProjectCrystal
          key={project.id || index}
          project={project}
          position={getCrystalPosition(index)}
          index={index}
        />
      ))}
      
      {/* Ambient crystal lighting */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.5} 
        color="#6366f1" 
        distance={50}
      />
      <pointLight 
        position={[10, -10, 10]} 
        intensity={0.3} 
        color="#8b5cf6" 
        distance={30}
      />
    </group>
  );
};

export default ProjectCrystals3D;