import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import './ProjectModal.css';

export const ProjectModal = ({ project, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setShowDetails(true), 1200);
    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, []);

  // Only show text before the first dash for the splash
  const splashName = project.title.split('-')[0].trim();

  const screenshots = project.screenshots || [];

  const modalNode = (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {!showDetails ? (
          <motion.div
            key="splash"
            className="modal-splash"
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="splash-title">{splashName}</h1>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            className="modal-content glass-card" 
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="modal-close" onClick={onClose}>×</button>
            
            <div className="modal-grid">
              {/* Vertical thumb strip + phone frame */}
              <div className="modal-visuals">
                {/* Vertical scrollable thumbnail strip */}
                {screenshots.length > 1 && (
                  <div className="media-thumbstrip">
                    {screenshots.map((img, i) => (
                      <button
                        key={i}
                        className={`media-thumb ${i === selectedImage ? 'active' : ''}`}
                        onClick={() => setSelectedImage(i)}
                      >
                        <img src={img} alt={`Thumbnail ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Phone frame with selected screenshot */}
                <motion.div 
                  className="s23-mini-frame" 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="s23-inner">
                    {screenshots.length > 0 ? (
                      <img 
                        src={screenshots[selectedImage]} 
                        alt={`${project.title} preview`} 
                        className="phone-screen-img"
                      />
                    ) : (
                      <p className="media-empty">No screenshots uploaded.</p>
                    )}
                  </div>
                </motion.div>
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
                    {project.bullets?.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Tech Snapshot</h4>
                  <div className="tech-chips">
                    {project.stack?.map((s, i) => <span key={i} className="chip">{s}</span>)}
                  </div>
                </div>

                <div className="detail-section impact-box">
                  <span className="impact-label">Impact:</span>
                  <p className="impact-text">{project.impact}</p>
                </div>

                <footer className="modal-actions">
                  <a href={project.links?.case || '#'} className="btn-secondary">Case Study</a>
                  <a href={project.links?.demo || '#'} className="btn-primary">Live Demo →</a>
                </footer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return createPortal(modalNode, document.body);
};