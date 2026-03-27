import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import './styles/global.css';

function App() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

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
    // Re-run this when the location changes to catch new elements
    const setupInteractables = () => {
      const interactables = document.querySelectorAll('a, button, .interactive, [data-cursor], input, textarea, select');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', expandCursor);
        el.addEventListener('mouseleave', shrinkCursor);
      });
      return interactables;
    };

    const interactables = setupInteractables();
    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', expandCursor);
        el.removeEventListener('mouseleave', shrinkCursor);
      });
    };
  }, [location.pathname]); // Re-bind when route changes

  /* ── Scroll progress ── */
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Shared Background Elements */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>
      <div className="grain-overlay" />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Global Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorDotRef} className="cursor-dot" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;