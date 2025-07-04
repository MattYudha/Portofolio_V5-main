import React, { useState, useEffect, useCallback, memo } from "react";
import { Mail, ExternalLink, Sparkles, Waves, Star } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-cosmic-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
      <div className="relative px-4 sm:px-6 py-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20">
        <span className="bg-gradient-to-r from-cyan-300 to-blue-300 text-transparent bg-clip-text sm:text-sm text-xs font-medium flex items-center">
          <Waves className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-cyan-400 animate-ocean-wave" />
          Cosmic Ocean Explorer
          <Star className="sm:w-4 sm:h-4 w-3 h-3 ml-2 text-blue-400 animate-stellar-pulse" />
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-4" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
      <span className="relative inline-block">
        <span className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-3xl opacity-60"></span>
        <span className="relative bg-gradient-to-r from-slate-100 via-cyan-100 to-blue-100 bg-clip-text text-transparent">
          Where Stars
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 blur-3xl opacity-60"></span>
        <span className="relative bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Meet Waves
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech, index }) => (
  <div 
    className="px-4 py-2 rounded-full bg-slate-800/40 backdrop-blur-sm border border-cyan-500/20 text-sm text-cyan-200 hover:bg-slate-700/40 hover:border-cyan-400/40 transition-all duration-300 cosmic-glow"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon, variant = "primary" }) => {
  const baseClasses = "group relative w-[180px] h-12";
  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-blue-600 to-cyan-500",
      hover: "hover:from-blue-500 hover:to-cyan-400",
      glow: "from-blue-500/50 to-cyan-400/50"
    },
    secondary: {
      bg: "bg-slate-800/60 border border-cyan-500/30",
      hover: "hover:bg-slate-700/60 hover:border-cyan-400/50",
      glow: "from-cyan-500/30 to-blue-500/30"
    }
  };

  const style = variants[variant];

  return (
    <a href={href}>
      <button className={baseClasses}>
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${style.glow} rounded-xl opacity-30 blur group-hover:opacity-60 transition-all duration-700`}></div>
        <div className={`relative h-full ${style.bg} ${style.hover} backdrop-blur-xl rounded-lg border-0 leading-none overflow-hidden transition-all duration-300`}>
          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-white/10 to-transparent"></div>
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
            <span className="text-white font-medium z-10">
              {text}
            </span>
            <Icon className={`w-4 h-4 text-white ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-12'} transform transition-all duration-300 z-10`} />
          </span>
        </div>
      </button>
    </a>
  );
});

// Constants
const TYPING_SPEED = 120;
const ERASING_SPEED = 60;
const PAUSE_DURATION = 2500;
const WORDS = ["Navigating Digital Oceans", "Crafting Stellar Experiences", "Diving Deep into Code"];
const TECH_STACK = ["Three.js", "React Fiber", "GSAP", "Cosmic CSS"];

const CosmicOceanHome = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
        duration: 1000,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-transparent overflow-hidden relative z-10 cosmic-cursor" id="Home">
      {/* Ocean depth gradient overlay */}
      <div className="absolute inset-0 ocean-depth pointer-events-none"></div>
      
      <div className={`relative z-20 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-[8%] min-h-screen">
          <div className="flex flex-col items-center justify-center h-screen text-center space-y-8 sm:space-y-12">
            
            {/* Status Badge */}
            <StatusBadge />
            
            {/* Main Title */}
            <MainTitle />

            {/* Typing Effect */}
            <div className="h-12 flex items-center justify-center" data-aos="fade-up" data-aos-delay="800">
              <span className="text-xl md:text-3xl bg-gradient-to-r from-cyan-200 via-blue-200 to-slate-200 bg-clip-text text-transparent font-light">
                {text}
              </span>
              <span className="w-[3px] h-8 bg-gradient-to-t from-cyan-400 to-blue-500 ml-2 animate-blink"></span>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed font-light"
              data-aos="fade-up"
              data-aos-delay="1000">
              Exploring the infinite depths of digital creativity, where cosmic inspiration meets oceanic tranquility. 
              Creating immersive experiences that transport users through stellar landscapes and underwater realms.
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-4 justify-center max-w-2xl" data-aos="fade-up" data-aos-delay="1200">
              {TECH_STACK.map((tech, index) => (
                <TechStack key={index} tech={tech} index={index} />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center" data-aos="fade-up" data-aos-delay="1400">
              <CTAButton href="#Portofolio" text="Explore Universe" icon={ExternalLink} variant="primary" />
              <CTAButton href="#Contact" text="Send Signal" icon={Mail} variant="secondary" />
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" data-aos="fade-up" data-aos-delay="1600">
              <div className="flex flex-col items-center space-y-2 animate-cosmic-float">
                <span className="text-cyan-300 text-sm font-medium">Dive Deeper</span>
                <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-ocean-wave"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CosmicOceanHome);