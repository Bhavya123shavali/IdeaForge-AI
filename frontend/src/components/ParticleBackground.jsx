import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    const isDark = () => document.documentElement.classList.contains('dark');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseVx = (Math.random() - 0.5) * 0.4;
        this.baseVy = (Math.random() - 0.5) * 0.4;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.radius = Math.random() * 2.5 + 0.5;
        this.baseOpacity = Math.random() * 0.4 + 0.15;
        this.opacity = this.baseOpacity;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.hue = Math.random() * 40; // slight color variations
      }

      update(time) {
        // Pulsing opacity
        this.opacity = this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.15;

        // Mouse interaction — particles gently repel
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;

        if (dist < interactionRadius && dist > 0) {
          const force = (interactionRadius - dist) / interactionRadius * 0.8;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }

        // Damping back to base velocity
        this.vx += (this.baseVx - this.vx) * 0.05;
        this.vy += (this.baseVy - this.vy) * 0.05;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw(dark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        if (dark) {
          // Muted aurora colors in dark mode
          const colors = ['155, 142, 196', '126, 161, 196', '126, 188, 181', '201, 160, 160'];
          const colorIdx = Math.floor(this.hue / 10) % colors.length;
          ctx.fillStyle = `rgba(${colors[colorIdx]}, ${this.opacity * 0.5})`;
          
          if (this.radius > 1.5) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(${colors[colorIdx]}, ${this.opacity * 0.25})`;
          }
        } else {
          ctx.fillStyle = `rgba(196, 121, 107, ${this.opacity * 0.6})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      const area = canvas.width * canvas.height;
      const particleCount = Math.min(Math.floor(area / 12000), 120);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = (dark) => {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDist) {
            const alpha = 0.12 * (1 - distance / maxDist);
            ctx.beginPath();
            
            if (dark) {
              ctx.strokeStyle = `rgba(155, 142, 196, ${alpha * 0.4})`;
            } else {
              ctx.strokeStyle = `rgba(196, 121, 107, ${alpha * 0.5})`;
            }
            
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const dark = isDark();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update(elapsed);
        particle.draw(dark);
      });

      connectParticles(dark);
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      init();
    });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default ParticleBackground;
