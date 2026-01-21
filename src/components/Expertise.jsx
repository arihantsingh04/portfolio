import React from 'react';
import { Icons } from './Icons';
import './Expertise.css';

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export const Expertise = () => {
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

  return (
    <section className="process-section" id="process">
      <div className="container">
        <div className="section-header-compact">
          <h2 className="section-title-sm">My Process</h2>
          <div className="draw-line-horizontal"></div>
        </div>

        <div className="process-pipeline">
          {processSteps.map((step, index) => (
            <div key={index} className="pipeline-step glass-card">
              <div className="step-number-tag">{step.id}</div>
              <div className="step-icon-box">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};