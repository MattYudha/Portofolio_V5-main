import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";

// Import the scene components (not the wrapper components)
import { CosmicOceanScene } from '../three-scenes/CosmicOceanBackground';
import { InteractiveNavigationElements } from '../three-scenes/InteractiveNavigation';
import { ProjectGridElements } from '../three-scenes/ProjectCard3D';

const Main3DScene = () => {
  const [projects, setProjects] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef();

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectCollection = collection(db, "projects");
        const projectSnapshot = await getDocs(projectCollection);
        const projectData = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          TechStack: doc.data().TechStack || [],
        }));
        setProjects(projectData);
        localStorage.setItem("projects", JSON.stringify(projectData));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Handle scroll and mouse events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Background Scene */}
          <CosmicOceanScene scrollY={scrollY} mousePosition={mousePosition} />
          
          {/* Navigation Elements */}
          <InteractiveNavigationElements scrollY={scrollY} mousePosition={mousePosition} />
          
          {/* Project Grid Elements */}
          <ProjectGridElements projects={projects} scrollY={scrollY} mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Main3DScene;