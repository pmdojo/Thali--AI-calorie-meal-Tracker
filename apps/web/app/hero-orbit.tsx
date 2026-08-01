'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import s from './hero-orbit.module.css';

const APP_URL = 'https://thali-ai.vercel.app';

// The components Thali "detects" — each is a real katori cropped from the
// hero thali, so they match the centre plate exactly.
const COMPONENTS = [
  { name: 'Butter Chicken',  kcal: 320, img: '/food/c1.jpg' },
  { name: 'Dal Tadka',       kcal: 170, img: '/food/c2.jpg' },
  { name: 'Steamed Rice',    kcal: 210, img: '/food/c3.jpg' },
  { name: 'Mixed Veg Sabzi', kcal: 150, img: '/food/c4.jpg' },
  { name: 'Gulab Jamun',     kcal: 150, img: '/food/c5.jpg' },
  { name: 'Kachumber Salad', kcal: 40,  img: '/food/c6.jpg' },
];
const N = COMPONENTS.length;
const TOTAL = COMPONENTS.reduce((s, c) => s + c.kcal, 0);
const R_THUMB = 250;

export function HeroOrbit() {
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSel((v) => (v + 1) % N), 2600);
    return () => clearInterval(t);
  }, []);
  const c = COMPONENTS[sel];

  return (
    <div className={s.hero}>
      <div className={`container ${s.grid}`}>
        {/* Left copy */}
        <div className={s.copy}>
          <span className={s.eyebrow}>✨ Meet Thali AI</span>
          <div className={s.kcal}>~{TOTAL.toLocaleString()} <span className={s.kcalUnit}>kcal</span></div>
          <h1 className={s.title}>Homestyle Thali</h1>

          <div className={s.detectWrap}>
            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                className={s.detect}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <span className={s.detectDot} />
                Detected <b>{c.name}</b> · {c.kcal} kcal
              </motion.div>
            </AnimatePresence>
          </div>

          <p className={s.desc}>
            Thali reads the whole plate from one photo — every dal, sabzi and roti,
            with a calibrated calorie range instead of a fake precise number.
          </p>

          <div className={s.ctaRow}>
            <a href={APP_URL} className={s.cta}>Snap it in Thali <span className={s.ctaCircle}>→</span></a>
            <a href="#waitlist" className={s.ghost}>Join the waitlist</a>
          </div>
          <p className={s.trust}>Calibrated for home-cooked plates — not just plated Western meals.</p>
        </div>

        {/* Right orbit */}
        <div className={s.stageWrap}>
          <div className={s.stage}>
            <div className={s.arc} />
            <div className={s.ring} />

            {/* centre plate (constant) */}
            <div className={s.centerWrap}>
              <img src="/food/hero.jpg" alt="Homestyle thali" className={s.center} />
              <div className={s.scan} />
            </div>

            {/* detected components */}
            {COMPONENTS.map((d, i) => {
              const angle = (-90 + i * (360 / N)) * (Math.PI / 180);
              const x = Math.cos(angle) * R_THUMB;
              const y = Math.sin(angle) * R_THUMB;
              const active = i === sel;
              return (
                <motion.button
                  key={d.name}
                  onClick={() => setSel(i)}
                  className={`${s.thumb} ${active ? s.thumbActive : ''}`}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  animate={{ scale: active ? 1.2 : 1 }}
                  whileHover={{ scale: active ? 1.2 : 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <img src={d.img} alt={d.name} />
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        className={s.thumbLabel}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                      >
                        {d.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
