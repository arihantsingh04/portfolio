import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icons } from './Icons';
import './Expertise.css';

gsap.registerPlugin(ScrollTrigger);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Expertise = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const processSteps = [
    {
      id: "01",
      title: "Understand the Problem",
      desc: "Before writing code, I define who uses the app and what success looks like. If the problem isn't clear, the app will fail.",
      icon: <SearchIcon />
    },
    {
      id: "02",
      title: "Plan the Solution",
      desc: "I break the idea into features and logic, deciding the tech stack early to avoid wasted time and surprise costs.",
      icon: <Icons.Cpu />
    },
    {
      id: "03",
      title: "Design the Experience",
      desc: "Crafting a clean UI and fast interactions so users don't need instructions. Good design means no confusion.",
      icon: <Icons.Layers />
    },
    {
      id: "04",
      title: "Build & Test",
      desc: "Developing in small parts with regular testing on real devices. You see progress early, not just at the end.",
      icon: <Icons.Code />
    },
    {
      id: "05",
      title: "Review & Improve",
      desc: "You review the app and I refine it. UI polish and adjustments are much cheaper when done early in the cycle.",
      icon: <Icons.Zap />
    },
    {
      id: "06",
      title: "Launch & Support",
      desc: "Helping you go live on the Play Store with final performance checks and post-launch stability fixes.",
      icon: <Icons.ExternalLink />
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Only apply horizontal scroll on desktop/tablet landscape
      mm.add("(min-width: 901px)", () => {
        const track = trackRef.current;

        const getScrollAmount = () => {
          let trackWidth = track.scrollWidth;
          return -(trackWidth - window.innerWidth);
        };

        gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="process-section horizontal-scroll-section" id="process" ref={sectionRef}>
      <div className="process-heading-sticky">
        <h2 className="process-heading-title">HOW I WORK</h2>
        <h3 className="process-heading-subtitle">(MY PROCESS)</h3>
      </div>

      <div className="horizontal-track-container">
        <div className="horizontal-track" ref={trackRef}>
          {processSteps.map((step, index) => (
            <div key={index} className="process-card panel interactive" data-cursor="view">
              <div className="process-card-inner">
                <div className="node-number">{step.id}</div>
                <div className="node-icon-box">{step.icon}</div>
                <div className="node-content">
                  <h4 className="node-title">{step.title}</h4>
                  <p className="node-desc">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};