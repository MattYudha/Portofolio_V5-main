import React from 'react';
import CosmicOceanBackground from '../three-scenes/CosmicOceanBackground';
import { useScrollAndMouse } from '../hooks/useScrollAndMouse';

const Background3D = () => {
  const { scrollY, mousePosition } = useScrollAndMouse();

  return (
    <CosmicOceanBackground 
      scrollY={scrollY} 
      mousePosition={mousePosition} 
    />
  );
};

export default Background3D;