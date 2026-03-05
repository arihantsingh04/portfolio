import React, { useState } from 'react';
import { Icons } from './Icons';
import './Footer.css';

export const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setStatus('error');
      setMessage('Please fill in all fields');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://172.16.14.68:4001/senddata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Message sent successfully!');
        setFormData({ name: '', email: '' });
      } else {
        setStatus('error');
        setMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection error. Please check your network.');
    }
  };

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

            {/* Contact Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  disabled={status === 'loading'}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'loading'}
              >
                <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
              </button>
              {message && (
                <p className={`form-message ${status}`}>
                  {message}
                </p>
              )}
            </form>

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
