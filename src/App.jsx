import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Expertise } from './components/Expertise';
import { TechStack } from './components/TechStack';
import { Footer } from './components/Footer';
import './styles/global.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const appRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const bgParticlesRef = useRef([]);

  // Custom Cursor Interaction
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
      gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.03, ease: 'power2.out' });
    };

    const handleMouseEnter = () => gsap.to(cursor, { scale: 2, duration: 0.2 });
    const handleMouseLeave = () => gsap.to(cursor, { scale: 1, duration: 0.2 });

    window.addEventListener('mousemove', moveCursor);
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Scroll Progress Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background Particles Animation
  useEffect(() => {
    const createParticles = () => {
      bgParticlesRef.current = [];
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${10 + Math.random() * 20}s`;
        appRef.current.appendChild(particle);
        bgParticlesRef.current.push(particle);
      }
    };

    createParticles();

    return () => {
      bgParticlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  // Global Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle background parallax
      gsap.to('.bg-layer-1', {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: appRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });

      gsap.to('.bg-layer-2', {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: appRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.3
        }
      });

      // PROJECT ROWS
      gsap.utils.toArray(".project-row").forEach((row) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // PROCESS SEQUENTIAL REVEAL
      const processCards = gsap.utils.toArray(".pipeline-step");
      if (processCards.length > 0) {
        gsap.from(processCards, {
          scrollTrigger: {
            trigger: ".process-pipeline",
            start: "top 80%",
            toggleActions: "play none none none"
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out"
        });
      }

      // TECH STACK BENTO REVEAL
      const techCards = gsap.utils.toArray(".tech-group-card");
      if (techCards.length > 0) {
        gsap.from(techCards, {
          scrollTrigger: {
            trigger: ".tech-bento-grid",
            start: "top 80%",
            toggleActions: "play none none none"
          },
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          clearProps: "all"
        });
      }

      // DIVIDER LINES
      gsap.utils.toArray(".draw-line, .draw-line-horizontal").forEach(line => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          scaleX: 0,
          duration: 1.5,
          ease: "power2.inOut"
        });
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="app-container">
      {/* Animated Background Layers */}
      <div className="bg-layer-1" />
      <div className="bg-layer-2" />
      
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorDotRef} className="cursor-dot" />
      
      {/* UI Elements */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="grain-overlay" />
      
      {/* Main Content */}
      <Hero />
      <Projects />
      <Expertise />
      <TechStack />
      <Footer />
    </div>
  );
}

export default App;
