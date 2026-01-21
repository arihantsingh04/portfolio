import React, { useState } from 'react';
import { ProjectModal } from './ProjectModal';
import { Icons } from './Icons';
import './Projects.css';

// Project Data following the 30-60 second read rule
const projectsData = [
  {
    id: 1,
    title: "FlowMusic",
    tagline: "High-fidelity YouTube music streaming without the bloat.",
    platform: "Flutter",
    screenshots: [
      "/screens/app1.jpg", 
      "/screens/app2.jpg", 
      "/screens/app3.jpg"
    ],
    bullets: [
      "Bypasses background restrictions for seamless playback",
      "Custom audio engine with glassmorphic visualizers",
      "Zero-latency search using YouTube Data API v3"
    ],
    stack: ["Flutter", "Firebase", "Clean Architecture", "Provider"],
    impact: "Saved 40% more battery than standard web-wrapper apps.",
    links: { demo: "#", case: "#" }
  },
  {
    id: 2,
    title: "Recall",
    tagline: "Privacy-focused tool for saving and searching screenshots.",
    platform: "Flutter",
    screenshots: [
      "/screens/app2.jpg", 
      "/screens/app3.jpg", 
      "/screens/app1.jpg"
    ],
    bullets: [
      "On-device OCR for instant text search within images",
      "Biometric lock for sensitive information storage",
      "Offline-first synchronization with local encryption"
    ],
    stack: ["Flutter", "SQLite", "Tesseract OCR", "Biometrics"],
    impact: "100% private: no data ever leaves the local device.",
    links: { demo: "#", case: "#" }
  },
  {
    id: 3,
    title: "StudyMode",
    tagline: "Focus-driven ecosystem for academic management.",
    platform: "Android (Native)",
    screenshots: [
      "/screens/app3.jpg", 
      "/screens/app1.jpg", 
      "/screens/app2.jpg"
    ],
    bullets: [
      "Automated captive portal login for campus WiFi",
      "Real-time class schedule sync with Push Notifications",
      "Integrated PDF annotator for localized notes"
    ],
    stack: ["Kotlin", "Retrofit", "Room DB", "WorkManager"],
    impact: "Used daily by 500+ active university students.",
    links: { demo: "#", case: "#" }
  }
];

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section className="projects-section" id="work">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-compact">
          <h2 className="section-title-sm">Selected Work</h2>
          <div className="draw-line-horizontal"></div>
        </div>

        {/* Minimalist Projects List */}
        <div className="projects-list">
          {projectsData.map((project) => (
            <div 
              key={project.id} 
              className="project-row interactive"
              onClick={() => handleProjectClick(project)}
            >
              <div className="project-main-info">
                <span className="project-index">0{project.id}</span>
                <div className="project-title-group">
                  <h3 className="project-row-title">{project.title}</h3>
                  <div className="project-row-tags">
                    <span className="mini-tag">{project.platform}</span>
                  </div>
                </div>
              </div>
              
              <p className="project-row-desc">{project.tagline}</p>

              <div className="project-row-links">
                <div className="view-details-btn">
                  View Detail <Icons.ArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal Component */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
};