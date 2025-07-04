import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Github, Linkedin, Instagram, Youtube } from 'lucide-react';

// Komponen Ikon Sosial 3D
const SocialIcon3D = ({ 
  icon: Icon, 
  href, 
  position, 
  color,
  label 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotasi dan floating effect
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      
      // Scale effect saat hover
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );
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
    window.open(href, '_blank');
  };

  return (
    <group position={position}>
      {/* Sphere utama */}
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hovered ? 0.9 : 0.7}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </Sphere>

      {/* Glow effect */}
      {hovered && (
        <Sphere args={[0.7, 16, 16]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </Sphere>
      )}

      {/* HTML overlay untuk ikon */}
      <Html
        transform
        occlude
        position={[0, 0, 0]}
        style={{
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-center justify-center w-8 h-8 text-white">
          <Icon size={hovered ? 24 : 20} />
        </div>
      </Html>

      {/* Label */}
      {hovered && (
        <Html
          position={[0, -1, 0]}
          center
        >
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.85, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.5 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Komponen Scene yang berisi useFrame hook
const SocialIconsScene = () => {
  const groupRef = useRef();

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/EkiZR",
      color: "#ffffff",
      label: "GitHub",
      position: [-2, 0, 0]
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/rahmat-yudi-1a884227b/",
      color: "#0A66C2",
      label: "LinkedIn",
      position: [0, 0, 0]
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/matt_rynnn/",
      color: "#E4405F",
      label: "Instagram",
      position: [2, 0, 0]
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@mattyudhaa",
      color: "#FF0000",
      label: "YouTube",
      position: [4, 0, 0]
    }
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <group ref={groupRef}>
        {socialLinks.map((social, index) => (
          <SocialIcon3D
            key={index}
            icon={social.icon}
            href={social.href}
            position={social.position}
            color={social.color}
            label={social.label}
          />
        ))}
      </group>
    </>
  );
};

// Komponen Utama Social Icons 3D
const SocialIcons3D = () => {
  return (
    <div className="w-full h-32">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <SocialIconsScene />
      </Canvas>
    </div>
  );
};

export default SocialIcons3D;