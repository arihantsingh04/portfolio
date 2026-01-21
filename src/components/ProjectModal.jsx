import React, { useEffect } from 'react';
import { Icons } from './Icons';
import './ProjectModal.css';

export const ProjectModal = ({ project, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'unset');
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-grid">
          {/* 1 & 2: Identity & Visual Preview */}
          <div className="modal-visuals">
            <div className="s23-mini-frame">
              <div className="s23-inner">
                <div className="screenshot-carousel">
                  {project.screenshots.map((img, i) => (
                    <img key={i} src={img} alt="Preview" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-details">
            <header>
              <div className="platform-badge">{project.platform}</div>
              <h2 className="modal-title">{project.title}</h2>
              <p className="modal-tagline">{project.tagline}</p>
            </header>

            <div className="detail-section">
              <h4>What It Does</h4>
              <ul className="impact-list">
                {project.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="detail-section">
              <h4>Tech Snapshot</h4>
              <div className="tech-chips">
                {project.stack.map((s, i) => <span key={i} className="chip">{s}</span>)}
              </div>
            </div>

            <div className="detail-section impact-box">
              <span className="impact-label">Impact:</span>
              <p className="impact-text">{project.impact}</p>
            </div>

            <footer className="modal-actions">
              <a href={project.links.case} className="btn-secondary">Case Study</a>
              <a href={project.links.demo} className="btn-primary">Live Demo →</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};