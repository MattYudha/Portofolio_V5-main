import React from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

// Warp Speed Transition
export const WarpTransition = ({ isActive, onComplete }) => {
  React.useEffect(() => {
    if (isActive) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to('.warp-line', {
        scaleX: 100,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out"
      })
      .to('.warp-line', {
        opacity: 0,
        duration: 0.3,
        stagger: 0.05
      }, "-=0.3");
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="warp-line absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            top: `${(i / 20) * 100}%`,
            left: '50%',
            width: '2px',
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  );
};

// Ocean Dive Transition
export const DiveTransition = ({ isActive, onComplete }) => {
  React.useEffect(() => {
    if (isActive) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to('.wave-layer', {
        y: '-100vh',
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.inOut"
      });
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="wave-layer absolute inset-0 bg-gradient-to-b from-blue-900 to-cyan-600"
          style={{
            top: `${100 + i * 20}%`,
            opacity: 0.8 - i * 0.15,
            clipPath: `polygon(0 ${20 + i * 10}%, 100% ${30 + i * 10}%, 100% 100%, 0% 100%)`
          }}
        />
      ))}
    </div>
  );
};

// Particle Burst Transition
export const ParticleBurstTransition = ({ isActive, onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      onAnimationComplete={onComplete}
    >
      {isActive && [...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.02,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
};

export default {
  WarpTransition,
  DiveTransition,
  ParticleBurstTransition
};