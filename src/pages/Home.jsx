import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { Expertise } from '../components/Expertise';
import { TechStack } from '../components/TechStack';
import { Footer } from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const appRef = useRef(null);

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
    <div ref={appRef}>
      {/* Page sections */}
      <Hero />
      <Projects />
      <Expertise />
      <TechStack />
      <Footer />
    </div>
  );
};
