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
  const heroRef = useRef(null);
  const phoneFrontRef = useRef(null);
  const phoneBackRef = useRef(null);
  const bgTextRef = useRef(null);
  const fgTextRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    /* Screenshot carousel */
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % screenshots.length);
    }, 3500);

    /* Entrance animations */
    const tl = gsap.timeline({ delay: 0.2 });

    // Navbar entrance
    tl.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
      .fromTo(".synth-nav .brand, .synth-nav .nav-links a, .synth-nav .btn-outline",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 },
        "-=0.6"
      )
      // Background text scales up slightly and fades in
      .fromTo(bgTextRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
        "-=0.5"
      )
      // Phone Back drops in and floats
      .fromTo(phoneBackRef.current,
        { opacity: 0, y: 150, z: -150, rotateX: 5, rotateY: -15, rotateZ: 25, scale: 0.75 },
        { opacity: 1, y: 0, z: -100, rotateX: 15, rotateY: -5, rotateZ: 18, scale: 0.85, duration: 1.2, ease: "back.out(1.2)" },
        "-=1.0"
      )
      // Phone Front drops in and floats
      .fromTo(phoneFrontRef.current,
        { opacity: 0, y: 150, z: 0, rotateX: 5, rotateY: 5, rotateZ: -25 },
        { opacity: 1, y: 0, z: 50, rotateX: 18, rotateY: 15, rotateZ: -18, duration: 1.2, ease: "back.out(1.2)" },
        "-=1.0"
      )
      // Foreground text slides in
      .fromTo(fgTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      )
      // Side content fades in
      .fromTo(".side-content",
        { opacity: 0, x: (i) => i === 0 ? -20 : 20 }, // Left comes from left, Right comes from right
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", stagger: 0.2 },
        "-=0.6"
      );

    /* Extreme Parallax mouse effect (Phone, BG Text, FG Text) */
    const handleMouseMove = (e) => {
      if (!heroRef.current || !phoneFrontRef.current || !phoneBackRef.current || !bgTextRef.current || !fgTextRef.current) return;
      const mx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const my = (e.clientY - window.innerHeight / 2) / window.innerHeight;

      // BG Text moves opposite to mouse (feels far away)
      gsap.to(bgTextRef.current, {
        x: mx * -40,
        y: my * -40,
        duration: 1, ease: 'power2.out'
      });

      // Phones tilt towards mouse
      gsap.to(phoneBackRef.current, {
        rotateY: -5 + mx * 10,
        rotateX: 15 - my * 10,
        x: mx * 15,
        y: my * 15,
        duration: 0.8, ease: 'power2.out'
      });

      gsap.to(phoneFrontRef.current, {
        rotateY: 15 + mx * 15,
        rotateX: 18 - my * 15,
        x: mx * 25,
        y: my * 25,
        duration: 0.8, ease: 'power2.out'
      });

      // Foreground text moves with mouse (feels close)
      gsap.to(fgTextRef.current, {
        x: mx * 40,
        y: my * 40,
        duration: 0.6, ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    {/* Background Text Scroll Parallax */ }
    gsap.to(bgTextRef.current, {
      y: 120, // Reduced from 200 to prevent sliding too low
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    /* Hover Interactions for Devices */
    const frontEl = phoneFrontRef.current;
    const backEl = phoneBackRef.current;

    const onFrontEnter = () => gsap.to(frontEl, { scale: 1.05, filter: "brightness(1.15)", duration: 0.4, ease: "power2.out" });
    const onFrontLeave = () => gsap.to(frontEl, { scale: 1, filter: "brightness(1)", duration: 0.4, ease: "power2.out" });

    const onBackEnter = () => gsap.to(backEl, { scale: 0.95, filter: "brightness(1) blur(0px)", duration: 0.4, ease: "power2.out" });
    const onBackLeave = () => gsap.to(backEl, { scale: 0.85, filter: "brightness(0.6) blur(0.5px)", duration: 0.4, ease: "power2.out" });

    if (frontEl) {
      frontEl.addEventListener("mouseenter", onFrontEnter);
      frontEl.addEventListener("mouseleave", onFrontLeave);
    }
    if (backEl) {
      backEl.addEventListener("mouseenter", onBackEnter);
      backEl.addEventListener("mouseleave", onBackLeave);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      if (frontEl) {
        frontEl.removeEventListener("mouseenter", onFrontEnter);
        frontEl.removeEventListener("mouseleave", onFrontLeave);
      }
      if (backEl) {
        backEl.removeEventListener("mouseenter", onBackEnter);
        backEl.removeEventListener("mouseleave", onBackLeave);
      }
    };
  }, []);

  return (
    <>
      <nav className="synth-nav" ref={navRef}>
        <div className="brand">ARIHANT SINGH</div>
        <div className="nav-right-group">
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#stack">Stack</a>
          </div>
          <a href="https://drive.google.com/file/d/139smgKBb68P_UsprSR76EyduRvzGbIgo/view?usp=sharing" target="_blank" className="btn-outline">Resume</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="synth-hero" id="home" ref={heroRef}>

        {/* Layer 1: Background Massive Text */}
        <div className="bg-massive-text" ref={bgTextRef}>
          <div className="bg-word">ARIHANT</div>
          <div className="bg-word">SINGH</div>
        </div>

        {/* Layer 2: 3D Phone Mockups (Center) */}
        <div className="center-mockup">
          {/* Back Phone */}
          <div className="s23-ultra-frame phone-back" ref={phoneBackRef}>
            <div className="armor-aluminum-edge" />
            <div className="display-panel">
              <div className="infinity-o-cutout" />
              <div className="bezel-inner-glow" />
              <div className="glass-reflection" />
              {screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`App Screenshot ${i + 1}`}
                  className={`screen ${i === ((active + 1) % screenshots.length) ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="btn-container right">
              <div className="side-button volume-rocker" />
              <div className="side-button power-btn" />
            </div>
          </div>

          {/* Front Phone */}
          <div className="s23-ultra-frame phone-front" ref={phoneFrontRef}>
            <div className="armor-aluminum-edge" />
            <div className="display-panel">
              <div className="infinity-o-cutout" />
              <div className="bezel-inner-glow" />
              <div className="glass-reflection" />
              {screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`App Screenshot ${i + 1}`}
                  className={`screen ${i === active ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="btn-container right">
              <div className="side-button volume-rocker" />
              <div className="side-button power-btn" />
            </div>
          </div>
        </div>

        {/* Layer 3: Foreground Overlay Text */}
        <div className="fg-overlay-text" ref={fgTextRef}>
          <h1 className="fg-title">
            <span className="text-stroke">FLUTTER</span>
            <span className="text-solid">ANDROID</span>
          </h1>
          <p className="fg-subtitle">CRAFTED FOR YOU.</p>
        </div>

        {/* Layer 4: Side Content Blocks */}
        <div className="side-blocks-container">

          {/* Left Block */}
          <div className="side-content left-block">
            <h3 className="block-title">AVAILABLE FOR WORK</h3>
            <p className="block-desc">
              Clean architecture, smooth UI, and real-world performance for modern mobile ecosystems.
            </p>
          </div>

          {/* Right Block */}
          <div className="side-content right-block glass-panel">
            <h3 className="panel-title">LATEST METRICS</h3>
            <p className="panel-desc">
              Building apps that scale and deliver exceptional user experiences globally.
            </p>
            <div className="stats-mini">
              <div><strong>15+</strong><span>Apps Shipped</span></div>
              <div className="divider-mini" />
              <div><strong>5K+</strong><span>Installs</span></div>
            </div>
          </div>

        </div>

      </section>
    </>
  );
};