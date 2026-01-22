import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
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
    // 1. Screenshot Carousel
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % screenshots.length);
    }, 3500);

    // 2. Entrance Animation: Name-only pill -> Expand -> Links Reveal
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo(navRef.current, 
      { width: "135px", opacity: 0, y: -20 }, 
      { width: "135px", opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    )
    .to(navRef.current, { 
      width: "720px", 
      duration: 1.2, 
      ease: "expo.inOut",
      delay: 0
    })
    .fromTo(linksRef.current, 
      { opacity: 0, x: 15 }, 
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // 3. Section Tracking
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
      <nav className="glass-nav-container">
        <div className="glass-nav-wrapper" ref={navRef}>
          <div className="liquid-glass-border"></div>
          <div className="nav-content">
            <div className="nav-name">ARIHANT SINGH</div>
            
            <div className="nav-links-group" ref={linksRef}>
              <a href="#home" className={`nav-item interactive ${activeSection === 'home' ? 'active' : ''}`}>Home</a>
              <a href="#work" className={`nav-item interactive ${activeSection === 'work' ? 'active' : ''}`}>Work</a>
              <a href="#process" className={`nav-item interactive ${activeSection === 'process' ? 'active' : ''}`}>Process</a>
              <a href="#stack" className={`nav-item interactive ${activeSection === 'stack' ? 'active' : ''}`}>Stack</a>
              <a href="/resume.pdf" target="_blank" className="nav-item interactive resume-link">Resume</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero" id="home" ref={heroRef}>
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
                <img key={i} src={src} className={`screen ${i === active ? "active" : ""}`} alt="App Interface" />
              ))}
              <div className="screen-reflection" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};