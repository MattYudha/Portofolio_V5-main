import React, { useState, useEffect } from "react";
import InteractiveNavigation from "../three-scenes/InteractiveNavigation";

const Navbar3D = () => {
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["Home", "About", "Portofolio", "Contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (href) => {
    const sectionName = href.substring(1);
    setActiveSection(sectionName);
  };

  return (
    <InteractiveNavigation 
      activeSection={activeSection}
      onNavigate={handleNavigate}
    />
  );
};

export default Navbar3D;