"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen<T extends string>({
  siteName,
}: {
  siteName?: T;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress from 0 → 100
    const duration = 2200; // ms
    const steps = 60;
    const increment = 100 / steps;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        // Short pause at 100% before hiding
        setTimeout(() => setIsLoading(false), 400);
      }
      setProgress(Math.round(current));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <style>{`
            .loading-screen {
              position: fixed;
              inset: 0;
              z-index: 9999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: rgb(8, 31, 34);
              overflow: hidden;
            }

            /* Ambient glow behind logo */
            .loading-screen::before {
              content: '';
              position: absolute;
              width: 500px;
              height: 500px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 70%);
              top: 50%;
              left: 50%;
              transform: translate(-50%, -55%);
              pointer-events: none;
            }

            /* Rotating utensil ring */
            @keyframes rotateRing {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
            @keyframes rotateRingReverse {
              from { transform: rotate(360deg); }
              to   { transform: rotate(0deg); }
            }
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.4; }
              50%      { opacity: 0.9; }
            }
            @keyframes floatUp {
              0%   { transform: translateY(0) scale(1); opacity: 0.5; }
              50%  { opacity: 1; }
              100% { transform: translateY(-60px) scale(0.6); opacity: 0; }
            }

            .utensil-ring {
              position: absolute;
              width: 180px;
              height: 180px;
              border-radius: 50%;
              border: 2px solid rgba(234,179,8,0.15);
              border-top: 2px solid rgba(234,179,8,0.6);
              animation: rotateRing 3s linear infinite;
            }
            .utensil-ring-outer {
              position: absolute;
              width: 220px;
              height: 220px;
              border-radius: 50%;
              border: 1px solid rgba(234,179,8,0.08);
              border-bottom: 1.5px solid rgba(234,179,8,0.35);
              animation: rotateRingReverse 4s linear infinite;
            }
            .utensil-ring-inner {
              position: absolute;
              width: 140px;
              height: 140px;
              border-radius: 50%;
              border: 1.5px dashed rgba(234,179,8,0.12);
              animation: rotateRing 6s linear infinite;
            }

            /* Floating particles */
            .particle {
              position: absolute;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: rgba(234,179,8,0.6);
              animation: floatUp 2.5s ease-in-out infinite;
            }

            /* Progress bar */
            .progress-track {
              width: 200px;
              height: 2px;
              background: rgba(255,255,255,0.08);
              border-radius: 4px;
              overflow: hidden;
              margin-top: 48px;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, rgba(234,179,8,0.3), #eab308);
              border-radius: 4px;
              transition: width 0.15s ease;
              box-shadow: 0 0 12px rgba(234,179,8,0.4);
            }
          `}</style>

          {/* Decorative particles */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${30 + i * 8}%`,
                bottom: "35%",
                animationDelay: `${i * 0.4}s`,
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
              }}
            />
          ))}

          {/* Spinning rings */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              className="utensil-ring-outer"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
            <motion.div
              className="utensil-ring"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="utensil-ring-inner"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Center icon — fork & knife */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              style={{ position: "absolute", display: "flex", gap: "6px" }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(234,179,8,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Fork */}
                <path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 002-2V2" />
                <line x1="6" y1="2" x2="6" y2="22" />
              </svg>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(234,179,8,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Knife */}
                <path d="M18 2C18 2 20 6 20 10c0 2-2 3-2 3v9" />
              </svg>
            </motion.div>
          </div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ marginTop: "36px", textAlign: "center" }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "2px",
                margin: 0,
                lineHeight: 1,
              }}
            >
              {siteName || "Tastyc"}
            </h1>

            {/* Yellow bars + tagline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "6px",
              }}
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 20 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  height: "2px",
                  background: "#eab308",
                  display: "block",
                  borderRadius: "2px",
                }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                Food &amp; Drinks
              </motion.span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 20 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  height: "2px",
                  background: "#eab308",
                  display: "block",
                  borderRadius: "2px",
                }}
              />
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="progress-track"
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </motion.div>

          {/* Progress percentage */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              marginTop: "14px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "4px",
              fontFamily: "monospace",
            }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
