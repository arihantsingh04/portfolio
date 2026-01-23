import { useRef, useEffect, useState, useCallback } from 'react';

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex) => {
  const m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return m ? [
    parseInt(m[1], 16) / 255, 
    parseInt(m[2], 16) / 255, 
    parseInt(m[3], 16) / 255
  ] : [1, 1, 1];
};

const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left': return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right': return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left': return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right': return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left': return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center': return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right': return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays = ({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  className = '',
  opacity = 0.25,
  zIndex = -2
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const startTimeRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX / window.innerWidth;
    mouseRef.current.y = e.clientY / window.innerHeight;
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    canvasRef.current.width = rect.width * window.devicePixelRatio;
    canvasRef.current.height = rect.height * window.devicePixelRatio;
    canvasRef.current.style.width = rect.width + 'px';
    canvasRef.current.style.height = rect.height + 'px';
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = containerRef.current.getBoundingClientRect();
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    const time = (performance.now() - startTimeRef.current) * 0.001 * raysSpeed;
    
    // Smooth mouse tracking
    if (followMouse) {
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.08;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.08;
    }
    
    const { anchor, dir } = getAnchorAndDir(raysOrigin, w / window.devicePixelRatio, h / window.devicePixelRatio);
    
    // Ray rendering
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = (y * w + x) * 4;
        const coordX = x / window.devicePixelRatio - anchor[0];
        const coordY = y / window.devicePixelRatio - anchor[1];
        
        const distance = Math.sqrt(coordX * coordX + coordY * coordY);
        const maxDistance = Math.min(w, h) * rayLength;
        const dirNormX = coordX / distance;
        const dirNormY = coordY / distance;
        
        const angle = Math.atan2(dir[1], dir[0]) - Math.atan2(dirNormY, dirNormX);
        let strength = Math.max(Math.cos(angle), 0);
        
        // Light spread
        strength = Math.pow(strength, 1.0 / Math.max(lightSpread, 0.001));
        
        // Distance falloff
        const lengthFalloff = Math.max(0, 1 - distance / maxDistance);
        const fadeFalloff = Math.max(0.5, 1 - distance / (Math.min(w, h) * fadeDistance));
        
        // Pulsing effect
        const pulse = pulsating ? (0.8 + 0.2 * Math.sin(time * 3)) : 1.0;
        
        // Noise
        const noise = noiseAmount > 0 ? 
          (Math.sin(coordX * 0.01 + time) * 0.5 + 0.5) * noiseAmount : 1;
        
        let finalStrength = strength * lengthFalloff * fadeFalloff * pulse * noise;
        
        // Mouse influence
        if (followMouse && mouseInfluence > 0) {
          const mouseDist = Math.sqrt(
            Math.pow(smoothMouseRef.current.x * rect.width - x, 2) + 
            Math.pow(smoothMouseRef.current.y * rect.height - y, 2)
          );
          finalStrength *= 1 + mouseInfluence * (1 - mouseDist / Math.max(rect.width, rect.height));
        }
        
        const rgb = hexToRgb(raysColor);
        data[px] = Math.min(255, rgb[0] * 255 * finalStrength);     // R
        data[px + 1] = Math.min(255, rgb[1] * 255 * finalStrength); // G
        data[px + 2] = Math.min(255, rgb[2] * 255 * finalStrength); // B
        data[px + 3] = Math.min(255, finalStrength * 255 * opacity * 255); // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, opacity, followMouse, mouseInfluence, noiseAmount]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    
    startTimeRef.current = performance.now();
    handleResize();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    animationIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, animate, handleResize, handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className={`light-rays-container ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex,
        pointerEvents: 'none'
      }}
    >
      <canvas ref={canvasRef} />
      <style jsx>{`
        .light-rays-container {
          opacity: ${opacity};
        }
        canvas {
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default LightRays;
