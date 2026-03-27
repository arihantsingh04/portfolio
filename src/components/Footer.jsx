import React, { useRef, useEffect } from 'react';
import { Icons } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    icon: <Icons.Github />,
    label: 'GitHub',
    sub: '@arihantsingh04',
    href: 'https://github.com/arihantsingh04',
  },
  {
    icon: <Icons.Linkedin />,
    label: 'LinkedIn',
    sub: '/in/arihantsinghind',
    href: 'https://www.linkedin.com/in/arihantsinghind/',
  },
  {
    icon: <Icons.Mail />,
    label: 'Email',
    sub: 'arihants2004@gmail.com',
    href: 'mailto:arihants2004@gmail.com',
  },
];

export const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-headline span',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'power4.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%', once: true }
        }
      );
      gsap.fromTo('.footer-social-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.footer-socials', start: 'top 90%', once: true }
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer-v2" ref={footerRef}>

      {/* Top accent line */}
      <div className="footer-accent-line" />

      <div className="footer-v2-container">

        {/* Giant CTA */}
        <div className="footer-cta-block">
          <p className="footer-eyebrow">LET'S CONNECT</p>
          <h2 className="footer-headline">
            <span>Have an idea?</span>
            <span className="headline-stroke">Let's build</span>
            <span className="headline-grad">together.</span>
          </h2>
          <a href="mailto:arihants2004@gmail.com" className="footer-main-cta">
            <Icons.Mail />
            arihants2004@gmail.com
            <span className="cta-arrow">→</span>
          </a>
        </div>

        {/* Social Cards */}
        <div className="footer-socials">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-card"
            >
              <div className="social-card-icon">{link.icon}</div>
              <div className="social-card-text">
                <span className="social-card-label">{link.label}</span>
                <span className="social-card-sub">{link.sub}</span>
              </div>
              <span className="social-card-arrow">↗</span>
            </a>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-v2-bottom">
        <span>© {new Date().getFullYear()} Arihant Singh. All rights reserved.</span>
        <span>Crafted with precision &amp; passion.</span>
      </div>

    </footer>
  );
};
