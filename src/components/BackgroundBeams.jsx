import React from "react";
import "./BackgroundBeams.css";

export const BackgroundBeams = () => {
    /* Generate an array of beam path definitions.
       Each beam is an SVG line that animates down the screen. */
    const beamCount = 18;

    return (
        <div className="hero-beams-wrapper" aria-hidden="true">
            <svg
                className="hero-beams-svg"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Gradient for each beam — fades in then out */}
                    <linearGradient id="beamGrad0" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="30%" stopColor="rgba(56,189,248,0.7)" />
                        <stop offset="70%" stopColor="rgba(37,99,235,0.5)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="beamGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="30%" stopColor="rgba(37,99,235,0.7)" />
                        <stop offset="70%" stopColor="rgba(14,165,233,0.4)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="beamGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="40%" stopColor="rgba(96,165,250,0.6)" />
                        <stop offset="80%" stopColor="rgba(37,99,235,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Subtle radial glow at top-center */}
                <ellipse
                    cx="720" cy="-80" rx="600" ry="320"
                    fill="rgba(37,99,235,0.12)"
                    className="beam-radial-glow"
                />

                {/* Vertical beams */}
                {Array.from({ length: beamCount }).map((_, i) => {
                    const x = 60 + (i * (1440 / beamCount));
                    const gradientId = `beamGrad${i % 3}`;
                    const delay = `${(i * 0.35).toFixed(2)}s`;
                    const duration = `${4 + (i % 5) * 0.8}s`;
                    const strokeWidth = i % 4 === 0 ? 1.5 : 0.7;
                    return (
                        <line
                            key={i}
                            x1={x} y1="-250"
                            x2={x} y2="1150"
                            stroke={`url(#${gradientId})`}
                            strokeWidth={strokeWidth}
                            className="beam-line"
                            style={{
                                animationDelay: delay,
                                animationDuration: duration,
                            }}
                        />
                    );
                })}
            </svg>

            {/* CSS grid overlay to reinforce the grid feel */}
            <div className="hero-beams-grid" />
        </div>
    );
};
