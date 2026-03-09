import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { BackgroundBeams } from "./BackgroundBeams";
import "./Hero.css";

const screenshots = [
  "/screens/app1.jpg",
  "/screens/app2.jpg",
  "/screens/app3.jpg",
];

const playlist = [
  { id: "JO1GL3xFSLM", title: "Background Track 1" },
  { id: "IUq7xu6HtrI", title: "Background Track 2" },
  { id: "r5q4hhI0Mog", title: "Background Track 3" },
  { id: "ET6Hn_iADIs", title: "Background Track 4" }
];

export const Hero = () => {
  const [active, setActive] = useState(0);

  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const initialIndex = useRef(Math.floor(Math.random() * playlist.length));
  const [currentSongIndex, setCurrentSongIndex] = useState(initialIndex.current);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const ytPlayerRef = useRef(null);     // holds the YT.Player instance
  const ytContainerRef = useRef(null);  // the div the iframe mounts into
  const ytApiReadyRef = useRef(false);
  const heroRef = useRef(null);
  const phoneFrontRef = useRef(null);
  const phoneBackRef = useRef(null);
  const bgTextRef = useRef(null);
  const fgTextRef = useRef(null);
  const navRef = useRef(null);
  const tlRef = useRef(null);

  const hasInteractedRef = useRef(false); // Shared between player onReady and interaction listeners

  // Initialize YouTube IFrame API
  useEffect(() => {
    const initPlayer = () => {
      if (ytPlayerRef.current) return; // already created
      ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
        height: '0',
        width: '0',
        videoId: playlist[initialIndex.current].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 0,
          mute: 0,
        },
        events: {
          onReady: () => {
            // If user already interacted before player was ready, start immediately
            if (hasInteractedRef.current) {
              ytPlayerRef.current.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event) => {
            // When track ends, go to next
            if (event.data === window.YT.PlayerState.ENDED) {
              setCurrentSongIndex(prev => {
                const next = (prev + 1) % playlist.length;
                ytPlayerRef.current?.loadVideoById(playlist[next].id);
                ytPlayerRef.current?.playVideo();
                setIsPlaying(true);
                return next;
              });
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Load the API script once
      if (!document.getElementById('yt-api-script')) {
        const script = document.createElement('script');
        script.id = 'yt-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = () => {
        ytApiReadyRef.current = true;
        initPlayer();
      };
    }
  }, []);

  const togglePlayMusic = () => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      ytPlayerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleNextSong = () => {
    const next = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(next);
    setIsPlaying(true);
    if (ytPlayerRef.current) {
      ytPlayerRef.current.loadVideoById(playlist[next].id);
      ytPlayerRef.current.playVideo();
    }
  };

  useEffect(() => {

    /* Screenshot carousel */
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % screenshots.length);
    }, 3500);

    // Initially hide everything (so it doesn't blink before the timeline starts)
    gsap.set([
      navRef.current,
      ".synth-nav .brand", ".synth-nav .nav-links a", ".synth-nav .btn-outline",
      phoneBackRef.current, phoneFrontRef.current,
      fgTextRef.current, ".side-content",
      bgTextRef.current // also hide watermark initially
    ], { opacity: 0 });

    /* Entrance animations - Sped up for faster load */
    const tl = gsap.timeline({
      paused: true,
      delay: 0.1
    });
    tlRef.current = tl;

    // 1. Watermark appears first
    tl.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.9, filter: "blur(12px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
    )
      .addLabel("rest", "+=0.1") // slight pause

      // Navbar entrance
      .fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "rest"
      )
      .fromTo(".synth-nav .brand, .synth-nav .nav-links a, .synth-nav .btn-outline",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05 },
        "rest+=0.1"
      )
      // Phone Back drops in and floats
      .fromTo(phoneBackRef.current,
        { opacity: 0, y: 150, z: -150, rotateX: 5, rotateY: -15, rotateZ: 25, scale: 0.75 },
        { opacity: 1, y: 0, z: -100, rotateX: 15, rotateY: -5, rotateZ: 18, scale: 0.85, duration: 1.0, ease: "back.out(1.2)" },
        "rest+=0.2"
      )
      // Phone Front drops in and floats
      .fromTo(phoneFrontRef.current,
        { opacity: 0, y: 150, z: 0, rotateX: 5, rotateY: 5, rotateZ: -25 },
        { opacity: 1, y: 0, z: 50, rotateX: 18, rotateY: 15, rotateZ: -18, duration: 1.0, ease: "back.out(1.2)" },
        "rest+=0.3"
      )
      // Foreground text slides in
      .fromTo(fgTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "rest+=0.4"
      )
      // Side content fades in
      .fromTo(".side-content",
        { opacity: 0, x: (i) => i === 0 ? -20 : 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "rest+=0.5"
      );

    // Play initial animation timeline immediately
    tl.play();

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
      y: 120,
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

  // Auto-start music on first user interaction (browser requires a user gesture)
  useEffect(() => {
    let started = false;
    const startMusic = () => {
      if (started) return;
      started = true;
      hasInteractedRef.current = true;

      // Try to play immediately
      const attemptPlay = () => {
        try {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
            const state = ytPlayerRef.current.getPlayerState?.();
            // State -1 = unstarted, 5 = video cued — both are safe to play
            ytPlayerRef.current.playVideo();
            setIsPlaying(true);
            return true;
          }
        } catch (e) { }
        return false;
      };

      if (!attemptPlay()) {
        // Retry every 300ms for up to 5 seconds in case player isn't ready yet
        let attempts = 0;
        const retryInterval = setInterval(() => {
          attempts++;
          if (attemptPlay() || attempts >= 16) {
            clearInterval(retryInterval);
          }
        }, 300);
      }

      window.removeEventListener('click', startMusic);
      window.removeEventListener('mousemove', startMusic);
      window.removeEventListener('scroll', startMusic);
      window.removeEventListener('keydown', startMusic);
    };

    window.addEventListener('click', startMusic);
    window.addEventListener('mousemove', startMusic);
    window.addEventListener('scroll', startMusic);
    window.addEventListener('keydown', startMusic);

    return () => {
      window.removeEventListener('click', startMusic);
      window.removeEventListener('mousemove', startMusic);
      window.removeEventListener('scroll', startMusic);
      window.removeEventListener('keydown', startMusic);
    };
  }, []);

  return (
    <>
      {/* YT container: off-screen instead of display:none so player fully initializes */}
      <div ref={ytContainerRef} style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }} />

      {/* Floating Dynamic Music Player UI */}
      <div
        className={`floating-music-player ${isPlayerExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsPlayerExpanded(true)}
        onMouseLeave={() => setIsPlayerExpanded(false)}
      >
        <button className="play-btn" onClick={togglePlayMusic}>
          {isPlaying ? (
            // Pause Icon SVG
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            // Play Icon SVG
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>

        <div className="player-details">
          <div className="player-track-info">
            <span className="player-label">NOW PLAYING</span>
            <span className="player-title">{playlist[currentSongIndex].title}</span>
          </div>
          <button className="next-btn" onClick={handleNextSong} title="Skip Track">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
          </button>
        </div>
      </div>
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

        {/* Layer 0: Animated Background Beams */}
        <BackgroundBeams />

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