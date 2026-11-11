import { useEffect, useRef } from 'react';

const ButterflyAnimation = ({ behindContent = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isDark = () => document.documentElement.classList.contains('dark');

    // Realistic monarch-style butterfly
    class Butterfly {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 18 + 28; // 28-46px
        this.speed = Math.random() * 0.5 + 0.15;
        this.angle = Math.random() * Math.PI * 2;
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = Math.random() * 0.06 + 0.035;
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.01 + 0.005;
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftSpeed = Math.random() * 0.003 + 0.002;
        this.turnSpeed = (Math.random() - 0.5) * 0.012;
        this.opacity = Math.random() * 0.3 + 0.55;
        this.colorIndex = Math.floor(Math.random() * 4);
        // Each butterfly has unique wing shape variation
        this.wingCurve = 0.85 + Math.random() * 0.3;
        this.lowerWingScale = 0.6 + Math.random() * 0.2;
      }

      update() {
        this.wingPhase += this.wingSpeed;
        this.wobblePhase += this.wobbleSpeed;
        this.driftPhase += this.driftSpeed;

        // Gentle course changes (like a real butterfly that drifts and turns)
        this.angle += this.turnSpeed + Math.sin(this.wobblePhase) * 0.005;

        // Occasional direction jitter (real butterflies are erratic)
        if (Math.random() < 0.005) {
          this.turnSpeed = (Math.random() - 0.5) * 0.02;
        }

        // Forward movement + vertical bob
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed
          + Math.sin(this.wobblePhase) * 0.35
          + Math.sin(this.driftPhase) * 0.15;

        const margin = this.size * 2.5;
        if (this.x < -margin) this.x = canvas.width + margin;
        if (this.x > canvas.width + margin) this.x = -margin;
        if (this.y < -margin) this.y = canvas.height + margin;
        if (this.y > canvas.height + margin) this.y = -margin;
      }

      draw() {
        const dark = isDark();
        // Wing flap: cos gives perspective foreshortening (like real 3D flapping)
        const flapAngle = Math.sin(this.wingPhase);
        const wingPerspective = Math.cos(this.wingPhase * 0.5) * 0.15;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.globalAlpha = this.opacity;

        const s = this.size;
        const wc = this.wingCurve;
        const lws = this.lowerWingScale;

        // Color palettes — designed to look like real butterfly species
        const palettes = dark ? [
          // Dark mode: ethereal, glowing species 
          { wing: '#b266ff', inner: '#d4a3ff', vein: '#8033cc', lower: '#9f4dff', body: '#d4c0ff', spot: '#e6ccff' },
          { wing: '#4d9dff', inner: '#80b8ff', vein: '#2266cc', lower: '#6aadff', body: '#b8d4ff', spot: '#cce0ff' },
          { wing: '#4dffa6', inner: '#80ffc2', vein: '#1a9960', lower: '#66ffb3', body: '#b3ffe0', spot: '#ccffeb' },
          { wing: '#ff6b9d', inner: '#ff99bc', vein: '#cc3366', lower: '#ff80ab', body: '#ffccdd', spot: '#ffe0ea' }
        ] : [
          // Light mode: natural species-inspired
          { wing: '#e05a3a', inner: '#f4845f', vein: '#9e2f1a', lower: '#e8724f', body: '#3d2515', spot: '#f7c795' },
          { wing: '#2d6a4f', inner: '#52b788', vein: '#1b4332', lower: '#40916c', body: '#2d3a2d', spot: '#95d5b2' },
          { wing: '#c77a30', inner: '#e8a952', vein: '#8b5a1e', lower: '#d49a3f', body: '#3d2a10', spot: '#f2d388' },
          { wing: '#7b4fa0', inner: '#a87bc5', vein: '#4a2d6a', lower: '#9068b0', body: '#2f1f3f', spot: '#c9a8e0' }
        ];

        const p = palettes[this.colorIndex];

        // ===== DRAW LEFT WING =====
        ctx.save();
        ctx.scale(Math.cos(flapAngle * 0.7), 1 + wingPerspective);

        // Upper wing shape (larger, rounder top)
        ctx.beginPath();
        ctx.moveTo(0, s * 0.05);
        ctx.bezierCurveTo(
          -s * 0.5 * wc, -s * 0.15,
          -s * 1.1 * wc, -s * 0.65,
          -s * 0.65 * wc, -s * 1.05
        );
        ctx.bezierCurveTo(
          -s * 0.35 * wc, -s * 1.15,
          -s * 0.12, -s * 0.7,
          0, -s * 0.1
        );
        ctx.closePath();

        // Wing fill with gradient
        const leftGrad = ctx.createRadialGradient(
          -s * 0.35, -s * 0.5, s * 0.05,
          -s * 0.35, -s * 0.5, s * 0.9
        );
        leftGrad.addColorStop(0, p.inner);
        leftGrad.addColorStop(0.6, p.wing);
        leftGrad.addColorStop(1, p.vein);
        ctx.fillStyle = leftGrad;
        ctx.fill();

        // Wing edge (dark border like real butterfly)
        ctx.strokeStyle = p.vein;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Wing veins
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.3, -s * 0.55 * wc, -s * 0.85);
        ctx.moveTo(0, -s * 0.05);
        ctx.quadraticCurveTo(-s * 0.45, -s * 0.2, -s * 0.7 * wc, -s * 0.7);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-s * 0.2, -s * 0.15, -s * 0.4 * wc, -s * 0.45);
        ctx.strokeStyle = p.vein;
        ctx.globalAlpha = this.opacity * 0.35;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = this.opacity;

        // Wing spots (like monarch spots)
        const spots = [
          [-s * 0.25, -s * 0.6, s * 0.04],
          [-s * 0.4, -s * 0.75, s * 0.035],
          [-s * 0.5, -s * 0.5, s * 0.03],
        ];
        spots.forEach(([sx, sy, sr]) => {
          ctx.beginPath();
          ctx.arc(sx * wc, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = p.spot;
          ctx.globalAlpha = this.opacity * 0.6;
          ctx.fill();
        });
        ctx.globalAlpha = this.opacity;

        // Lower wing
        ctx.beginPath();
        ctx.moveTo(0, s * 0.05);
        ctx.bezierCurveTo(
          -s * 0.4 * lws, s * 0.15,
          -s * 0.8 * lws, s * 0.55,
          -s * 0.45 * lws, s * 0.7
        );
        ctx.bezierCurveTo(
          -s * 0.15 * lws, s * 0.75,
          -s * 0.03, s * 0.3,
          0, s * 0.05
        );
        ctx.closePath();
        ctx.fillStyle = p.lower;
        ctx.fill();
        ctx.strokeStyle = p.vein;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.restore();

        // ===== DRAW RIGHT WING (mirror) =====
        ctx.save();
        ctx.scale(Math.cos(-flapAngle * 0.7), 1 + wingPerspective);

        // Upper wing
        ctx.beginPath();
        ctx.moveTo(0, s * 0.05);
        ctx.bezierCurveTo(
          s * 0.5 * wc, -s * 0.15,
          s * 1.1 * wc, -s * 0.65,
          s * 0.65 * wc, -s * 1.05
        );
        ctx.bezierCurveTo(
          s * 0.35 * wc, -s * 1.15,
          s * 0.12, -s * 0.7,
          0, -s * 0.1
        );
        ctx.closePath();

        const rightGrad = ctx.createRadialGradient(
          s * 0.35, -s * 0.5, s * 0.05,
          s * 0.35, -s * 0.5, s * 0.9
        );
        rightGrad.addColorStop(0, p.inner);
        rightGrad.addColorStop(0.6, p.wing);
        rightGrad.addColorStop(1, p.vein);
        ctx.fillStyle = rightGrad;
        ctx.fill();
        ctx.strokeStyle = p.vein;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Veins
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(s * 0.3, -s * 0.3, s * 0.55 * wc, -s * 0.85);
        ctx.moveTo(0, -s * 0.05);
        ctx.quadraticCurveTo(s * 0.45, -s * 0.2, s * 0.7 * wc, -s * 0.7);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(s * 0.2, -s * 0.15, s * 0.4 * wc, -s * 0.45);
        ctx.strokeStyle = p.vein;
        ctx.globalAlpha = this.opacity * 0.35;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = this.opacity;

        // Spots
        spots.forEach(([sx, sy, sr]) => {
          ctx.beginPath();
          ctx.arc(-sx * wc, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = p.spot;
          ctx.globalAlpha = this.opacity * 0.6;
          ctx.fill();
        });
        ctx.globalAlpha = this.opacity;

        // Lower wing
        ctx.beginPath();
        ctx.moveTo(0, s * 0.05);
        ctx.bezierCurveTo(
          s * 0.4 * lws, s * 0.15,
          s * 0.8 * lws, s * 0.55,
          s * 0.45 * lws, s * 0.7
        );
        ctx.bezierCurveTo(
          s * 0.15 * lws, s * 0.75,
          s * 0.03, s * 0.3,
          0, s * 0.05
        );
        ctx.closePath();
        ctx.fillStyle = p.lower;
        ctx.fill();
        ctx.strokeStyle = p.vein;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.restore();

        // ===== BODY =====
        // Abdomen (tapered)
        ctx.beginPath();
        ctx.ellipse(0, s * 0.15, s * 0.035, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.body;
        ctx.fill();

        // Thorax (wider)
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.02, s * 0.04, s * 0.12, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.body;
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(0, -s * 0.16, s * 0.04, 0, Math.PI * 2);
        ctx.fillStyle = p.body;
        ctx.fill();

        // ===== ANTENNAE =====
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.strokeStyle = p.body;

        // Left antenna — gentle curve
        ctx.beginPath();
        ctx.moveTo(-s * 0.01, -s * 0.2);
        ctx.quadraticCurveTo(-s * 0.12, -s * 0.42, -s * 0.1, -s * 0.55);
        ctx.stroke();

        // Left antenna tip (club)
        ctx.beginPath();
        ctx.arc(-s * 0.1, -s * 0.55, s * 0.022, 0, Math.PI * 2);
        ctx.fillStyle = p.body;
        ctx.fill();

        // Right antenna
        ctx.beginPath();
        ctx.moveTo(s * 0.01, -s * 0.2);
        ctx.quadraticCurveTo(s * 0.12, -s * 0.42, s * 0.1, -s * 0.55);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s * 0.1, -s * 0.55, s * 0.022, 0, Math.PI * 2);
        ctx.fillStyle = p.body;
        ctx.fill();

        ctx.restore();
      }
    }

    resize();
    const butterflyCount = Math.max(4, Math.min(Math.floor(canvas.width / 220), 7));
    const butterflies = [];
    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push(new Butterfly());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      butterflies.forEach(b => {
        b.update();
        b.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: behindContent ? 1 : 20 }}
    />
  );
};

export default ButterflyAnimation;
