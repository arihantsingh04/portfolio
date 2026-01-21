import React, { useEffect, useState, useRef } from "react";
import "./Hero.css";

const screenshots = [
  "/screens/app1.jpg",
  "/screens/app2.jpg",
  "/screens/app3.jpg",
];

export const Hero = () => {
  const [active, setActive] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % screenshots.length);
    }, 3500);

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;
      
      // Update CSS variables for subtle parallax
      heroRef.current.style.setProperty('--move-x', `${moveX}px`);
      heroRef.current.style.setProperty('--move-y', `${moveY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <header className="modern-nav">
        <div className="nav-container">
          <div className="nav-logo">AS</div>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#contact" className="nav-cta-minimal">Start a Project</a>
          </nav>
        </div>
      </header>

      <section className="hero" ref={heroRef}>
        {/* Light Rays Effect */}
        <div className="light-rays" />
        
        <div className="hero-content" style={{ transform: 'translate(calc(var(--move-x) * -1), calc(var(--move-y) * -1))' }}>
          <h1 className="reveal-text">
            I build <span>production-ready</span><br />
            Android & Flutter apps
          </h1>
          <p className="reveal-text-delay">
            Clean architecture, smooth UI, and real-world performance for modern mobile ecosystems.
          </p>

          <div className="hero-stats">
            <div className="stat-block">
              <strong>15+</strong>
              <span>Apps shipped</span>
            </div>
            <div className="divider" />
            <div className="stat-block">
              <strong>5K+</strong>
              <span>Installs</span>
            </div>
          </div>
        </div>

        <div className="phone-wrapper" style={{ transform: 'translate(var(--move-x), var(--move-y))' }}>
          <div className="s23-frame">
            <div className="metal-edge" />
            <div className="display">
              <div className="camera-hole" />
              {screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className={`screen ${i === active ? "active" : ""}`}
                  alt="App Interface"
                />
              ))}
              <div className="screen-reflection" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};