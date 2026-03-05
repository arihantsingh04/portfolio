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

  /* ── Magnetic cursor ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power3.out' });
      gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.05, ease: 'power3.out' });
    };

    const expandCursor = () => cursor.classList.add('expanded');
    const shrinkCursor = () => cursor.classList.remove('expanded');

    // Expand on interactive elements
    const interactables = document.querySelectorAll('a, button, .interactive, [data-cursor]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', expandCursor);
      el.addEventListener('mouseleave', shrinkCursor);
    });

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', expandCursor);
        el.removeEventListener('mouseleave', shrinkCursor);
      });
    };
  }, []);

  /* ── Scroll progress ── */
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── GSAP page‑level stagger reveals ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-on-scroll').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          }
        );
      });
    }, appRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="app-container">
      {/* Animated mesh blobs (fixed background) */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>

      {/* Film‑grain overlay */}
      <div className="grain-overlay" />

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Custom cursor */}
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorDotRef} className="cursor-dot" />

      {/* Page sections */}
      <Hero />
      <Projects />
      <Expertise />
      <TechStack />
      <Footer />
    </div>
  );
}

export default App;