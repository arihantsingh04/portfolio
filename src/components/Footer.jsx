import React from 'react';
import { Icons } from './Icons';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="draw-line"></div>

        <div className="footer-content">
          <div>
            <h2 className="footer-cta-title">
              Let's Build Something Exceptional <span className="blur-word">Together</span>
            </h2>
            <p className="footer-cta-description">
              Available for freelance projects and full-time opportunities. 
              Let's discuss how we can create something remarkable together.
            </p>
            <a href="mailto:hello@arihant.dev" className="footer-email interactive">
              <Icons.Mail />
              <span>hello@arihant.dev</span>
            </a>
          </div>

          <div className="footer-links">
            <a href="https://github.com" className="footer-link interactive">
              <Icons.Github />
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com" className="footer-link interactive">
              <Icons.Linkedin />
              <span>LinkedIn</span>
            </a>
            <a href="mailto:hello@arihant.dev" className="footer-link interactive">
              <Icons.Mail />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 Arihant Singh</span>
          <span>Engineered with Precision</span>
        </div>
      </div>
    </footer>
  );
};
