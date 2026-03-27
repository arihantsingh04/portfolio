import React, { useState, useEffect } from 'react';
import { ProjectModal } from './ProjectModal';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import './Projects.css';

const fallbackProjectsData = [
  {
    id: 1,
    title: "FlowMusic",
    tagline: "YouTube music streaming, perfected.",
    platform: "Flutter · 2024",
    screenshots: ["/screens/app1.jpg", "/screens/app2.jpg"],
    stack: ["Flutter", "Firebase", "Provider"],
    impact: "40% less battery drain than competitors.",
    bullets: [
      "Bypasses background restrictions for seamless playback",
      "Custom audio engine with glassmorphic visualizers",
      "Zero-latency search using YouTube Data API v3"
    ],
  },
  {
    id: 2,
    title: "Recall",
    tagline: "Your screenshots, searchable by text.",
    platform: "Flutter · 2024",
    screenshots: ["/screens/app2.jpg", "/screens/app3.jpg"],
    stack: ["Flutter", "SQLite", "OCR"],
    impact: "100% private, fully on-device.",
    bullets: [
      "On-device OCR for instant text search within images",
      "Biometric lock for sensitive information storage",
      "Offline-first synchronization with local encryption"
    ],
  },
  {
    id: 3,
    title: "StudyMode",
    tagline: "Focus-driven academic ecosystem.",
    platform: "Android · 2023",
    screenshots: ["/screens/app3.jpg", "/screens/app1.jpg"],
    stack: ["Kotlin", "Room DB", "WorkManager"],
    impact: "500+ active daily users.",
    bullets: [
      "Automated captive portal login for campus WiFi",
      "Real-time class schedule sync with Push Notifications",
      "Integrated PDF annotator for localized notes"
    ],
  }
];

const Phone = ({ src, alt, className }) => (
  <div className={`s23-ultra-frame ${className}`}>
    <div className="armor-aluminum-edge" />
    <div className="display-panel">
      <div className="infinity-o-cutout" />
      <div className="bezel-inner-glow" />
      <div className="glass-reflection" />
      <img src={src} alt={alt} className="screen active" />
    </div>
    <div className="btn-container right">
      <div className="side-button volume-rocker" />
      <div className="side-button power-btn" />
    </div>
  </div>
);

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsToRender, setProjectsToRender] = useState(fallbackProjectsData);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!supabase) return; // Fallback to initial state
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          console.warn("Using fallback static project data.");
          setProjectsToRender(fallbackProjectsData);
        } else {
          setProjectsToRender(data);
        }
      } catch (err) {
        console.warn("Using fallback static project data due to network error:", err);
        setProjectsToRender(fallbackProjectsData);
      }
    };
    fetchProjects();
  }, []);

  const top3 = projectsToRender.filter(p => p.is_highlight).slice(0, 3);
  // If no highlights set, fallback to the first 3
  const displayedHighlights = top3.length > 0 ? top3 : projectsToRender.slice(0, 3);
  
  const others = projectsToRender.filter(p => !displayedHighlights.find(h => h.id === p.id));
  const currentViewList = showAll ? [...displayedHighlights, ...others] : displayedHighlights;

  return (
    <section className="projects-section" id="work">
      <div className="container">
        <div className="section-header-compact">
          <h2 className="section-title-sm">Selected Work</h2>
          <div className="draw-line-horizontal" />
        </div>

        <div className="proj-cards-row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {currentViewList.map((project) => (
            <div
              key={project.id}
              className="proj-card"
              onClick={() => setSelectedProject(project)}
            >
              {/* Watermark — slides in on hover */}
              <div className="proj-card-watermark">{project.title}</div>

              {/* Phone showcase area */}
              <div className="proj-card-phones">
                {/* Back phone: hidden by default, slides in on hover */}
                <Phone
                  src={project.screenshots?.[1] || project.screenshots?.[0] || '/screens/app2.jpg'}
                  alt={`${project.title} back`}
                  className="proj-card-phone proj-card-phone-back"
                />
                {/* Front phone: always visible */}
                <Phone
                  src={project.screenshots?.[0] || '/screens/app1.jpg'}
                  alt={`${project.title} front`}
                  className="proj-card-phone proj-card-phone-front"
                />
              </div>

              {/* Card footer — always visible */}
              <div className="proj-card-footer">
                <h3 className="proj-card-title">{project.title}</h3>
                <p className="proj-card-platform">{project.platform}</p>
              </div>

              {/* Hover-only details */}
              <div className="proj-card-hover-details">
                <p className="proj-card-tagline">{project.tagline}</p>
                <div className="proj-card-stack">
                  {project.stack?.map((s, i) => (
                    <span key={i} className="mini-tag">{s}</span>
                  ))}
                </div>
                <span className="proj-card-cta">View Project →</span>
              </div>
            </div>
          ))}
        </div>
        
        {others.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              className="btn-outline" 
              onClick={() => setShowAll(!showAll)}
              style={{ cursor: 'pointer', padding: '12px 24px' }}
            >
              {showAll ? 'Show Less' : `View All Projects (${others.length} More)`}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};