import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// Komponen Kartu Proyek 3D
const ProjectCard3D = ({ 
  project, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotasi dasar
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2;
      
      // Efek hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );

      // Efek floating
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  };

  return (
    <group position={position}>
      {/* Kartu Utama */}
      <Box
        ref={meshRef}
        args={[2, 2.5, 0.1]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={hovered ? '#6366f1' : '#1e293b'}
          transparent
          opacity={0.9}
          emissive={hovered ? '#6366f1' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Box>

      {/* Glow Effect */}
      {hovered && (
        <Box args={[2.2, 2.7, 0.05]} position={[0, 0, -0.1]}>
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.3}
          />
        </Box>
      )}

      {/* HTML Overlay untuk konten */}
      <Html
        transform
        occlude
        position={[0, 0, 0.06]}
        style={{
          width: '180px',
          height: '220px',
          pointerEvents: hovered ? 'auto' : 'none',
        }}
      >
        <div className="w-full h-full p-3 text-white text-center">
          <div className="mb-2">
            <img
              src={project.Img}
              alt={project.Title}
              className="w-full h-20 object-cover rounded-lg"
            />
          </div>
          <h3 className="text-sm font-bold mb-1 truncate">{project.Title}</h3>
          <p className="text-xs text-gray-300 mb-2 line-clamp-2">
            {project.Description}
          </p>
          {hovered && (
            <div className="space-y-1">
              <Link
                to={`/project/${project.id}`}
                className="block text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
              >
                View Details
              </Link>
              {project.Link && (
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded transition-colors"
                >
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </Html>

      {/* Partikel efek */}
      {hovered && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin((i / 8) * Math.PI * 2) * 1.5,
                Math.cos((i / 8) * Math.PI * 2) * 1.5,
                0.2
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#6366f1" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// Komponen Grid Proyek 3D
const ProjectGrid3D = ({ projects }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const getProjectPosition = (index) => {
    const cols = 3;
    const spacing = 3;
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return [
      (col - 1) * spacing,
      (1 - row) * spacing,
      0
    ];
  };

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group ref={groupRef}>
          {projects.slice(0, 6).map((project, index) => (
            <ProjectCard3D
              key={project.id}
              project={project}
              position={getProjectPosition(index)}
              rotation={[0, index * 0.1, 0]}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
};

export default ProjectGrid3D;