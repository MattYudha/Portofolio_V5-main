import React, { useEffect, useState } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import ProjectGrid3D from "../three-scenes/ProjectCard3D";
import AOS from "aos";
import "aos/dist/aos.css";

const Portfolio3D = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectCollection = collection(db, "projects");
        const projectSnapshot = await getDocs(projectCollection);
        const projectData = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative z-10 py-20" id="Portofolio">
      {/* Header */}
      <div className="text-center pb-10 px-[5%]" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Cosmic Projects
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through the digital cosmos. Each project is a star in my constellation of creativity.
        </p>
      </div>

      {/* 3D Project Grid */}
      <div className="px-[5%] md:px-[10%]" data-aos="fade-up" data-aos-delay="200">
        <ProjectGrid3D projects={projects} />
      </div>

      {/* View All Projects Button */}
      <div className="text-center mt-10" data-aos="fade-up" data-aos-delay="400">
        <a href="#Portofolio">
          <button className="group relative px-8 py-3">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
            <div className="relative bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 px-6 py-2">
              <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium">
                Explore All Projects
              </span>
            </div>
          </button>
        </a>
      </div>
    </div>
  );
};

export default Portfolio3D;