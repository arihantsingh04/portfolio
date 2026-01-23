import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import LightRays from './LightRays';
import "./Hero.css";

const screenshots = [
  "/screens/app1.jpg",
  "/screens/app2.jpg",
  "/screens/app3.jpg",
];

export const Hero = () => {
  const [active, setActive] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    // Screenshot Carousel Logic
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % screenshots.length);
    }, 3500);

    // GSAP Navigation Animation
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(navRef.current,
      { width: "135px", opacity: 0, y: -20 },
      { width: "135px", opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    )
    .to(navRef.current, {
      width: "720px",
      duration: 1.2,
      ease: "expo.inOut",
      delay: 0.8
    })
    .fromTo(linksRef.current,
      { opacity: 0, x: 15 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Intersection Observer for Active Navigation
    const observerOptions = { threshold: 0.6 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = ["home", "work", "process", "stack"];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Interactive Parallax Effect
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;
      heroRef.current.style.setProperty('--move-x', `${moveX}px`);
      heroRef.current.style.setProperty('--move-y', `${moveY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Fixed WebGL Background Layer */}
      <div className="hero-background-rays">
        <LightRays />
      </div>

      {/* Navigation */}
      <div className="glass-nav-container">
        <nav className="glass-nav-wrapper" ref={navRef}>
          <div className="liquid-glass-border"></div>
          <div className="nav-content">
            <div className="nav-name">ARIHANT SINGH</div>
            <div className="nav-links-group" ref={linksRef}>
              <a href="#home" className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}>Home</a>
              <a href="#work" className={`nav-item ${activeSection === 'work' ? 'active' : ''}`}>Work</a>
              <a href="#process" className={`nav-item ${activeSection === 'process' ? 'active' : ''}`}>Process</a>
              <a href="#stack" className={`nav-item ${activeSection === 'stack' ? 'active' : ''}`}>Stack</a>
              <a href="/resume.pdf" className="nav-item resume-link">Resume</a>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-content">
          <h1 className="reveal-text">
            I build <span>production-ready</span><br/>Android & Flutter apps
          </h1>
          <p className="reveal-text-delay">
            Clean architecture, smooth UI, and real-world performance for modern mobile ecosystems.
          </p>
          <div className="hero-stats">
            <div>
              <strong>15+</strong>
              <span>Apps shipped</span>
            </div>
            <div className="divider"></div>
            <div>
              <strong>5K+</strong>
              <span>Installs</span>
            </div>
          </div>
        </div>

        <div className="phone-wrapper">
          <div className="s23-ultra-frame">
            <div className="armor-aluminum-edge"></div>
            <div className="display-panel">
              <div className="infinity-o-cutout"></div>
              <div className="bezel-inner-glow"></div>
              <div className="glass-reflection"></div>
              
              {screenshots.map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt={`App Screenshot ${i + 1}`}
                  className={`screen ${i === active ? 'active' : ''}`}
                />
              ))}
            </div>
            
            {/* Realistic Hardware Buttons */}
            <div className="btn-container right">
              <div className="side-button volume-rocker"></div>
              <div className="side-button power-btn"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
