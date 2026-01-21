import React from 'react';
import './TechStack.css';

const techItems = [
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" },
  { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
  { name: "Kotlin", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
];

export const TechStack = () => {
  return (
    <section className="marquee-section" id="stack">
      <div className="section-header-compact container">
        <h2 className="section-title-sm">Tech Stack</h2>
        <div className="draw-line-horizontal"></div>
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          {/* Render the list twice for seamless looping */}
          {[...techItems, ...techItems].map((item, idx) => (
            <div key={idx} className="marquee-item">
              <img src={item.icon} alt={item.name} className="marquee-icon" />
              <span className="marquee-text">{item.name}</span>
            </div>
          ))}
        </div>
        
        {/* Subtle Fade Overlays for Depth */}
        <div className="marquee-fade left"></div>
        <div className="marquee-fade right"></div>
      </div>
    </section>
  );
};