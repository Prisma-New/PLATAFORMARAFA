 "use client";
 
 import React, { useEffect, useMemo, useRef, useState, memo } from "react";
 
 type IconKey =
   | "telegram"
   | "discord"
   | "whatsapp"
   | "instagram"
   | "x"
   | "youtube"
   | "tiktok"
   | "reddit"
   | "linkedin";
 
 export type SocialBubblesBackgroundProps = {
   density?: number;
   densityMobile?: number;
   minSize?: number;
   maxSize?: number;
   className?: string;
   enableInteraction?: boolean;
 };
 
 const ICONS: Record<IconKey, React.ReactElement> = {
   telegram: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M22 3 3.6 10.3c-.8.3-.8 1.3.1 1.6l4.6 1.6 1.8 5.7c.2.5.8.6 1.2.2l2.6-2.4 4.5 3.3c.5.4 1.2.1 1.4-.6L23.9 4c.2-.8-.6-1.5-1.4-1.1z" fill="currentColor" />
     </svg>
   ),
   discord: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M20 6.5c-1.7-1.3-3.6-1.7-3.6-1.7l-.3.6c-1.1-.3-2.2-.3-3.1-.3s-2 .1-3.1.3l-.3-.6S5.7 5.2 4 6.5C2 9.4 1.6 12.2 1.7 15c2.1 1.6 4.1 2 4.1 2l.9-1.3c-.5-.2-1.2-.6-1.8-1.2.7.5 1.6.9 2.6 1.1 2.5.5 5 .5 7.5 0 1-.2 1.9-.6 2.6-1.1-.7.6-1.3 1-1.8 1.2l.9 1.3s2-.4 4.1-2c.1-2.8-.3-5.6-1.7-8.5zM8.7 12.6c-.7 0-1.2-.7-1.2-1.6s.5-1.6 1.2-1.6 1.2.7 1.2 1.6-.5 1.6-1.2 1.6zm6.6 0c-.7 0-1.2-.7-1.2-1.6s.5-1.6 1.2-1.6 1.2.7 1.2 1.6-.5 1.6-1.2 1.6z" fill="currentColor" />
     </svg>
   ),
   whatsapp: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M20 4.5A9.5 9.5 0 0 0 4.2 18.3L3 22l3.8-1a9.5 9.5 0 0 0 13.2-16.5zm-8.7 14a8 8 0 0 1-4-.9l-.3-.2-2.4.6.7-2.3-.2-.3a8 8 0 1 1 6.2 3.1zm4.6-4.7c-.2-.1-1.1-.6-1.3-.7s-.3-.1-.4.1-.5.7-.6.8-.2.1-.4 0a6.8 6.8 0 0 1-2-1.2 7.3 7.3 0 0 1-1.4-1.7c-.1-.2 0-.3.1-.4l.3-.3.1-.3s0-.2-.1-.3l-.6-1.4c-.2-.4-.3-.4-.5-.4h-.4a.7.7 0 0 0-.5.3c-.1.1-.5.5-.5 1.2s.6 1.5.7 1.6a10.6 10.6 0 0 0 2.5 2.6c1.7 1.2 2.1 1.1 2.4 1 .4 0 .8-.3.9-.6l.4-.9c.1-.2 0-.3 0-.3z" fill="currentColor" />
     </svg>
   ),
   instagram: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm6-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="currentColor" />
     </svg>
   ),
   x: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M4 4h3.3l5.1 6.7L17 4h3.2l-6.1 7.9L20 20h-3.3l-5.5-7.1L7 20H3.8l6.3-8.1L4 4z" fill="currentColor" />
     </svg>
   ),
   youtube: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M22.5 7.2c-.2-1-.9-1.7-1.8-1.9C19 5 12 5 12 5s-7 0-8.7.3C2.4 5.5 1.7 6.2 1.5 7.2 1.2 8.9 1 10.6 1 12.3c0 1.7.2 3.4.5 5.1.2 1 .9 1.7 1.8 1.9C5 19.6 12 19.6 12 19.6s7 0 8.7-.3c.9-.2 1.6-.9 1.8-1.9.3-1.7.5-3.4.5-5.1 0-1.7-.2-3.4-.5-5.1zM10 15.3V9.3l6 3-6 3z" fill="currentColor" />
     </svg>
   ),
   tiktok: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M17 6.3c1.1.9 2.4 1.4 3.8 1.5v2.9c-1.8-.1-3.5-.7-4.9-1.7v6.4a5.5 5.5 0 1 1-4.6-5.4v3.1c-.6-.4-1.4-.4-2 .1a2.4 2.4 0 1 0 3.6 2v-9h3.1c.2.6.6 1.1 1 1.5z" fill="currentColor" />
     </svg>
   ),
   reddit: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M21.4 12.5c0-.8-.6-1.5-1.4-1.5-.5 0-1 .3-1.2.7-1-.7-2.4-1.1-4-1.2l.7-3.1 2.1.5a1.4 1.4 0 1 0 .2-1l-2.7-.6c-.3-.1-.6.2-.7.5l-.9 3.9c-1.6.1-3 .5-4 1.2-.2-.4-.7-.7-1.2-.7-.8 0-1.4.7-1.4 1.5s.6 1.5 1.4 1.5c.4 0 .8-.2 1-.5a4.6 4.6 0 0 0-.1 1c0 2.2 2.5 4 5.7 4s5.7-1.8 5.7-4c0-.3 0-.7-.1-1 .2.3.6.5 1 .5.8 0 1.4-.7 1.4-1.5zM9.5 13.5a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0zm7.6 0a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0zM12 18.1c-1.6 0-3-.6-3.7-1.4.5-.3 1.5-.6 3.7-.6s3.2.3 3.7.6c-.7.8-2.1 1.4-3.7 1.4z" fill="currentColor" />
     </svg>
   ),
   linkedin: (
     <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="geometricPrecision">
       <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM7.1 18H4.8V9.6h2.3V18zM6 8.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zM19.2 18h-2.3v-4.3c0-1-.4-1.7-1.4-1.7-.8 0-1.2.5-1.4 1.1v5H11.8V9.6h2.3v1.1c.3-.5 1.1-1.2 2.3-1.2 1.9 0 2.8 1.3 2.8 3.2V18z" fill="currentColor" />
     </svg>
   ),
 };
 
 function mulberry32(a: number) {
   return function () {
     let t = (a += 0x6d2b79f5);
     t = Math.imul(t ^ (t >>> 15), t | 1);
     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
 
 export default function SocialBubblesBackground({
  density = 35,
  densityMobile = 18,
  minSize = 34,
  maxSize = 120,
  className,
  enableInteraction = true,
}: SocialBubblesBackgroundProps) {
   const [isMobile, setIsMobile] = useState(false);
   const [reduced, setReduced] = useState(false);
   const [isVisible, setIsVisible] = useState(true);
   const containerRef = useRef<HTMLDivElement>(null);
   const seedRef = useRef<number>(Math.floor(Math.random() * 1e9));
   const rnd = useMemo(() => mulberry32(seedRef.current), []);
 
   useEffect(() => {
     if (typeof window !== "undefined" && window.matchMedia) {
       const m = window.matchMedia("(max-width: 768px)");
       const r = window.matchMedia("(prefers-reduced-motion: reduce)");
       setIsMobile(m.matches);
       setReduced(r.matches);
       const onM = () => setIsMobile(m.matches);
       const onR = () => setReduced(r.matches);
       m.addEventListener?.("change", onM);
       r.addEventListener?.("change", onR);
       return () => {
         m.removeEventListener?.("change", onM);
         r.removeEventListener?.("change", onR);
       };
     }
   }, []);

   // Virtualization: Detectar si el contenedor está visible
   useEffect(() => {
     if (!containerRef.current || typeof window === "undefined") return;
     
     const observer = new IntersectionObserver(
       ([entry]) => {
         setIsVisible(entry.isIntersecting);
       },
       { threshold: 0.1, rootMargin: "100px" }
     );
     
     observer.observe(containerRef.current);
     return () => observer.disconnect();
   }, []);
 
  const iconKeys: IconKey[] = ["telegram", "discord", "whatsapp", "instagram"];

  // Componente memoizado para burbuja individual
  const BubbleComponent = memo(({ bubble, onPop }: { bubble: Bubble; onPop: () => void }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onPop();
    };
    
    return (
      <div
        className={`bubble ${bubble.popped ? "popped" : ""} ${bubble.respawning ? "respawning" : ""}`}
        style={{
          "--x": bubble.x,
          "--y": bubble.y,
          "--s": `${bubble.s}px`,
          "--rx": `${bubble.rx}deg`,
          "--ry": `${bubble.ry}deg`,
          "--o": bubble.opacity,
          "--floatDur": `${bubble.floatDur}s`,
          "--driftDur": `${bubble.driftDur}s`,
          "--delay": `${bubble.delay}s`,
          "--sheenBlur": "10px",
          "--innerBlur": `${bubble.blurSafe}px`,
          "--sheenDur": `${16 + Math.floor(Math.random() * 14)}s`,
          "--causticsDur": `${10 + Math.floor(Math.random() * 12)}s`,
        } as React.CSSProperties}
        onMouseEnter={onPop}
        onFocus={onPop}
        onPointerDown={onPop}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <span className="floatLayer">
          <span className="rim" />
          <span className="shell" />
          <span className="tint" />
          <span className="sheen" />
          <span className="caustics" />
          <span className="inner" />
          <span className="logo" style={{ color: bubble.color }}>
            <span className="logoWrap">{ICONS[bubble.icon]}</span>
          </span>
          <span className="ring" />
        </span>
      </div>
    );
  });
  
  BubbleComponent.displayName = 'BubbleComponent';

  function getBrandColor(icon: IconKey) {
    switch (icon) {
      case "instagram":
        return "#E1306C";
      case "whatsapp":
        return "#25D366";
      case "telegram":
        return "#0088CC";
      case "discord":
        return "#5865F2";
      default:
        return "#6D28D9";
    }
  }
 
   const targetCount = useMemo(() => {
     const base = isMobile ? densityMobile : density;
     if (reduced) return Math.max(4, Math.floor(base * 0.4));
     if (!isVisible) return Math.max(6, Math.floor(base * 0.6)); // Reducir burbujas cuando no es visible
     return base;
   }, [isMobile, reduced, density, densityMobile, isVisible]);
 
   type Bubble = {
     id: string;
     x: number;
     y: number;
     s: number;
     floatDur: number;
     driftDur: number;
     delay: number;
     rx: number;
     ry: number;
     blurSafe: number;
     opacity: number;
     icon: IconKey;
    color?: string;
     popped?: boolean;
     respawning?: boolean;
   };
 
   const [bubbles, setBubbles] = useState<Bubble[]>([]);
 
  useEffect(() => {
    const arr: Bubble[] = [];
    const minDist = reduced ? 6 : isMobile ? 7 : 9;
    const forbid = {
      x1: isMobile ? 10 : 15,
      x2: isMobile ? 90 : 85,
      y1: isMobile ? 15 : 20,
      y2: isMobile ? 85 : 80,
    };
    function farFromOthers(px: number, py: number) {
      for (const b of arr) {
        const dx = px - b.x;
        const dy = py - b.y;
        if (Math.hypot(dx, dy) < minDist) return false;
      }
      return true;
    }
    for (let i = 0; i < targetCount; i++) {
      const size = minSize + Math.floor(rnd() * (maxSize - minSize));
      const floatDur = 14 + Math.floor(rnd() * 18);
      const driftDur = 6 + Math.floor(rnd() * 8);
      const delay = -Math.floor(rnd() * 20);
      const rx = (rnd() * 12 - 6);
      const ry = (rnd() * 12 - 6);
      const blurSafe = isMobile ? 0 : Math.round(rnd() * 0.6 * 10) / 10;
      const opacity = 0.16 + rnd() * 0.14;
      const icon = iconKeys[Math.floor(rnd() * iconKeys.length)];
      const color = getBrandColor(icon);
      let px = rnd() * 100;
      let py = rnd() * 100;
      let tries = 0;
      while (
        ((px > forbid.x1 && px < forbid.x2) && (py > forbid.y1 && py < forbid.y2)) ||
        !farFromOthers(px, py)
      ) {
        px = rnd() * 100;
        py = rnd() * 100;
        if (tries % 2 === 0) {
          px = rnd() < 0.5 ? rnd() * forbid.x1 : forbid.x2 + rnd() * (100 - forbid.x2);
        }
        tries++;
        if (tries > 80) break;
      }
      arr.push({
        id: `b-${i}`,
        x: px,
        y: py,
        s: size,
        floatDur,
        driftDur,
        delay,
        rx,
        ry,
        blurSafe,
        opacity,
        icon,
        color,
      });
    }
    setBubbles(arr);
  }, [targetCount, isMobile, reduced, minSize, maxSize]);
 
   const pop = (id: string) => {
     if (!enableInteraction) return;
     if (reduced) {
       setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
       setTimeout(() => {
         setBubbles((prev) =>
           prev.map((b) =>
             b.id === id
               ? {
                   ...b,
                   popped: false,
                 }
               : b,
           ),
         );
       }, 220);
       return;
     }
     setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
     setTimeout(() => {
       setBubbles((prev) =>
         prev.map((b) =>
           b.id === id
             ? {
                 ...b,
                 x: rnd() * 100,
                 y: rnd() * 100,
                 delay: -Math.floor(rnd() * 20),
                 popped: false,
                 respawning: true,
               }
             : b,
         ),
       );
       setTimeout(() => {
         setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, respawning: false } : b)));
       }, 260);
     }, 240);
   };
 
   return (
     <div
       ref={containerRef}
       className={`bubbles-background ${className ?? ""}`}
       aria-hidden="true"
       style={{
         pointerEvents: "none",
         contain: "layout style paint", // Optimización de renderizado
       }}
     >
       {bubbles.map((b) => (
         <BubbleComponent
           key={b.id}
           bubble={b}
           onPop={() => pop(b.id)}
         />
       ))}
 
       <style jsx>{`
         .bubbles-background {
           position: absolute;
           inset: 0;
          z-index: -1;
           mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
           -webkit-mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
         }
          @media (max-width: 768px) {
            .bubbles-background {
              mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
              -webkit-mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
            }
          }
         .bubble {
           position: absolute;
           left: calc(var(--x) * 1%);
           top: calc(var(--y) * 1%);
           width: var(--s);
           height: var(--s);
           transform: translate(-50%, -50%) rotateX(var(--rx)) rotateY(var(--ry));
           border-radius: 9999px;
           transform-style: preserve-3d;
           opacity: var(--o);
           pointer-events: auto;
          will-change: transform, opacity;
         }
        .floatLayer {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          animation: float var(--floatDur) ease-in-out var(--delay) infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .floatLayer {
            animation: none;
          }
        }
        .rim {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from 180deg,
            rgba(255,0,128,0.22),
            rgba(0,200,255,0.20),
            rgba(255,255,0,0.16),
            rgba(120,255,200,0.18),
            rgba(255,0,128,0.22)
          );
          mask: radial-gradient(circle, transparent 62%, black 70%, black 74%, transparent 82%);
          -webkit-mask: radial-gradient(circle, transparent 62%, black 70%, black 74%, transparent 82%);
          opacity: 0.42;
          mix-blend-mode: screen;
        }
         .shell {
           position: absolute;
           inset: 0;
           border-radius: inherit;
           background:
             radial-gradient(circle at 30% 25%, rgba(255,255,255,0.65), rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 60%),
             radial-gradient(circle at 70% 75%, rgba(255,255,255,0.08), rgba(255,255,255,0) 55%);
           box-shadow:
             inset 0 0 18px rgba(255,255,255,0.18),
             inset 0 -10px 22px rgba(0,0,0,0.06),
             0 10px 28px rgba(0,0,0,0.05);
         }
        .tint {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(120% 120% at 50% 50%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 60%);
          mix-blend-mode: soft-light;
          opacity: 0.28;
        }
        .caustics {
          position: absolute;
          inset: 14%;
          border-radius: inherit;
          background:
            radial-gradient(60% 60% at 35% 35%, rgba(255,255,255,0.14), transparent 60%),
            radial-gradient(50% 50% at 65% 55%, rgba(255,255,255,0.10), transparent 65%),
            conic-gradient(from 120deg, rgba(255,255,255,0.06), transparent 40%, rgba(255,255,255,0.05));
          opacity: 0.24;
          mix-blend-mode: soft-light;
          filter: blur(0.8px);
          animation: causticsMove var(--causticsDur) ease-in-out infinite;
          will-change: transform, opacity;
        }
        @media (max-width: 768px) {
          .caustics {
            opacity: 0.12; // Reducir opacidad en móvil
            filter: blur(1.2px); // Más blur para mejor performance
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .caustics {
            animation: none;
          }
        }
        .sheen {
           position: absolute;
           inset: -8%;
           border-radius: inherit;
           background: conic-gradient(
             from 90deg,
             rgba(255,0,128,0.18),
             rgba(0,200,255,0.18),
             rgba(255,255,0,0.14),
             rgba(120,255,200,0.16),
             rgba(255,0,128,0.18)
           );
          filter: blur(var(--sheenBlur)) saturate(0.85);
          opacity: 0.45;
           mix-blend-mode: screen;
          animation: sheenMove var(--sheenDur) linear infinite;
          will-change: transform, opacity;
         }
         @media (max-width: 768px) {
           .sheen {
             opacity: 0.25; // Reducir opacidad en móvil
             filter: blur(calc(var(--sheenBlur) * 1.5)) saturate(0.6); // Más blur, menos saturación
           }
         }
         @media (prefers-reduced-motion: reduce) {
           .sheen {
             animation: none;
           }
         }
         .inner {
           position: absolute;
           inset: 10%;
           border-radius: inherit;
           background: radial-gradient(circle at 40% 40%, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.03));
         }
         @supports (backdrop-filter: blur(1px)) {
           .inner {
             backdrop-filter: blur(var(--innerBlur));
           }
         }
        .logo {
           position: absolute;
           inset: 0;
           display: grid;
           place-items: center;
           transform: translateZ(18px);
           opacity: 0.92;
           filter: saturate(1.05) contrast(1.08) drop-shadow(0 1.2px 1.8px rgba(0,0,0,0.18));
           animation: logoDrift var(--driftDur) ease-in-out infinite alternate;
          clip-path: circle(45% at 50% 50%);
        }
        .logo::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(55% 55% at 45% 40%, rgba(255,255,255,0.22), transparent 60%);
          mix-blend-mode: screen;
          pointer-events: none;
          opacity: 0.52;
        }
        .logoWrap {
          filter: blur(0.15px) drop-shadow(0 1px 1px rgba(0,0,0,0.14));
          opacity: 0.92;
         }
         .logo svg {
           width: calc(var(--s) * 0.42);
           height: calc(var(--s) * 0.42);
         }
         .ring {
           position: absolute;
           inset: 0;
           border-radius: inherit;
          background:
            conic-gradient(from 0deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15), rgba(255,255,255,0.35));
          mask: radial-gradient(circle, transparent 60%, black 64%, black 70%, transparent 74%);
          -webkit-mask: radial-gradient(circle, transparent 60%, black 64%, black 70%, transparent 74%);
          opacity: 0;
         }
         .popped {
          animation: popOutScale 220ms ease-out forwards;
         }
         .popped .ring {
           animation: ring 320ms ease-out forwards;
         }
         .respawning {
           animation: fadeIn 260ms ease-out;
         }
         @keyframes float {
           0%   { transform: translate(-50%,-50%) translate3d(-6px, 10px, 0) rotateX(var(--rx)) rotateY(var(--ry)); }
           50%  { transform: translate(-50%,-50%) translate3d( 8px, -14px, 0) rotateX(calc(var(--rx) * -0.6)) rotateY(calc(var(--ry) * 0.6)); }
           100% { transform: translate(-50%,-50%) translate3d(-4px,  8px, 0) rotateX(var(--rx)) rotateY(var(--ry)); }
         }
         @keyframes sheenMove {
           0% { transform: rotateZ(0deg); opacity: 0.33; }
           50% { transform: rotateZ(180deg); opacity: 0.37; }
           100% { transform: rotateZ(360deg); opacity: 0.33; }
         }
        @keyframes causticsMove {
          0% { transform: translate3d(0px, 0px, 0) rotateZ(0deg); opacity: 0.20; }
          50% { transform: translate3d(2px, -2px, 0) rotateZ(4deg); opacity: 0.23; }
          100% { transform: translate3d(-1px, 2px, 0) rotateZ(0deg); opacity: 0.20; }
        }
         @keyframes logoDrift {
           0% { transform: translateZ(18px) translate3d(-4px, 3px, 0) rotateZ(-4deg); }
           50% { transform: translateZ(20px) translate3d(4px, -3px, 0) rotateZ(4deg); }
           100% { transform: translateZ(18px) translate3d(-2px, 2px, 0) rotateZ(0deg); }
         }
         @keyframes popOut {
           0% { transform: translate(-50%, -50%) scale(1); opacity: var(--o); }
           40% { transform: translate(-50%, -50%) scale(1.08); opacity: var(--o); }
           100% { transform: translate(-50%, -50%) scale(0.86); opacity: 0; }
         }
         @keyframes ring {
           0% { opacity: 0.35; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.65); }
         }
         @keyframes fadeIn {
           0% { opacity: 0; }
           100% { opacity: var(--o); }
         }
        @keyframes popOutScale {
          0% { transform: translate(-50%,-50%) rotateX(var(--rx)) rotateY(var(--ry)) scale(1); opacity: var(--o); }
          40% { transform: translate(-50%,-50%) rotateX(var(--rx)) rotateY(var(--ry)) scale(1.08); opacity: var(--o); }
          100% { transform: translate(-50%,-50%) rotateX(var(--rx)) rotateY(var(--ry)) scale(0.86); opacity: 0; }
        }
         :global(html).dark .bubble {
           opacity: calc(var(--o) * 0.92);
         }
        :global(html).dark .rim {
          opacity: 0.40;
        }
        :global(html):not(.dark) .rim {
          opacity: 0.48;
        }
        .popped .shell::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.65), transparent 60%);
          opacity: 0;
          animation: flash 120ms ease-out forwards;
          pointer-events: none;
        }
        @keyframes flash {
          0% { opacity: 0.7; }
          100% { opacity: 0; }
        }
        /* Optimizaciones de performance */
        @media (max-width: 768px) {
          .bubble {
            transform-style: flat; // Desactivar 3D en móvil
          }
          .logo svg {
            width: calc(var(--s) * 0.35); // Logo más pequeño
            height: calc(var(--s) * 0.35);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bubble { animation: none; }
          .floatLayer { animation: none; }
          .sheen { animation: none; }
          .caustics { animation: none; }
          .logo { animation: none; }
        }
       `}</style>
     </div>
   );
 }
 
