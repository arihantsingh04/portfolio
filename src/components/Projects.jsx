import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectModal } from './ProjectModal';
import { Icons } from './Icons';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 1,
    title: "FlowMusic",
    tagline: "High-fidelity YouTube music streaming without the bloat.",
    platform: "Flutter",
    screenshots: ["/screens/app1.jpg", "/screens/app2.jpg", "/screens/app3.jpg"],
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
    screenshots: ["/screens/app2.jpg", "/screens/app3.jpg", "/screens/app1.jpg"],
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
    screenshots: ["/screens/app3.jpg", "/screens/app1.jpg", "/screens/app2.jpg"],
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
  const [selectedProject, setSelectedProject] = React.useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-row',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.projects-list',
            start: 'top 82%',
            once: true
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-section" id="work" ref={sectionRef}>
      <div className="container">
        <div className="section-header-compact">
          <h2 className="section-title-sm">Selected Work</h2>
          <div className="draw-line-horizontal" />
        </div>

        <div className="cinematic-projects-grid">
          {projectsData.map((project, index) => (
            <div
              key={project.id}
              className="cinematic-card interactive"
              data-cursor="view"
              onClick={() => setSelectedProject(project)}
            >
              <div className="card-bg-layer">
                <img src={project.screenshots[0]} alt={project.title} className="card-bg-img" />
                <div className="card-bg-overlay"></div>
              </div>

              <div className="card-content-layer">
                <div className="card-top-bar">
                  <span className="project-index">0{project.id}</span>
                  <div className="project-row-tags">
                    <span className="mini-tag">{project.platform}</span>
                  </div>
                </div>

                <div className="card-bottom-bar">
                  <h3 className="project-row-title">{project.title}</h3>
                  <p className="project-row-desc">{project.tagline}</p>

                  <div className="view-details-btn">
                    View Detail <Icons.ArrowRight />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};