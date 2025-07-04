import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import "./index.css";
import CosmicOceanHome from "./Pages/CosmicOceanHome";
import About from "./Pages/About";
import CosmicOceanCanvas from "./components/CosmicOceanCanvas";
import InteractiveNavigation3D from "./components/InteractiveNavigation3D";
import ProjectCrystals3D from "./components/ProjectCrystals3D";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { db, collection } from "./firebase";
import { getDocs } from "firebase/firestore";

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  const [projects, setProjects] = useState([]);

  // Fetch projects for 3D display
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

    if (!showWelcome) {
      fetchProjects();
    }
  }, [showWelcome]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          {/* 3D Cosmic Ocean Canvas */}
          <CosmicOceanCanvas>
            <InteractiveNavigation3D />
            <ProjectCrystals3D projects={projects} />
          </CosmicOceanCanvas>
          
          {/* 2D UI Components */}
          <Navbar />
          <CosmicOceanHome />
          <About />
          <Portofolio />
          <ContactPage />
          
          <footer className="relative z-10">
            <center>
              <hr className="my-3 border-cyan-500/20 opacity-50 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-slate-400 text-center">
                © 2024{" "}
                <a href="https://flowbite.com/" className="hover:underline text-cyan-400">
                  Matt™
                </a>
                . Navigating Digital Oceans.
              </span>
            </center>
          </footer>
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-cyan-500/20 opacity-50 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-slate-400 text-center">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline text-cyan-400">
            Matt™
          </a>
          . Navigating Digital Oceans.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;