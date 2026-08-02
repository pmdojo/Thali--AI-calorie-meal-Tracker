'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import s from './hero-orbit.module.css';

const APP_URL = 'https://thali-ai.vercel.app';

// The whole thali + each katori cropped from it — so every dish matches the
// centre plate exactly. Selecting a dish crossfades the centre + the copy.
const DISHES = [
  { name: 'Homestyle Thali',  kcal: 1040, img: '/food/hero.jpg', desc: 'Dal, sabzi, rice, roti and curd — Thali reads the whole plate from one photo.' },
  { name: 'Butter Chicken',   kcal: 320,  img: '/food/c1.jpg',   desc: 'Rich and creamy. Portion-aware, so the number actually fits your plate.' },
  { name: 'Dal Tadka',        kcal: 170,  img: '/food/c2.jpg',   desc: 'Everyday comfort. Every estimate ships with a confidence band, never fake precision.' },
  { name: 'Steamed Rice',     kcal: 210,  img: '/food/c3.jpg',   desc: 'A rice-heavy plate is where guess-work apps slip. Thali gives a calibrated range.' },
  { name: 'Mixed Veg Sabzi',  kcal: 150,  img: '/food/c4.jpg',   desc: 'Home-style and fibre-rich, recognised by component — not by a single guess.' },
  { name: 'Gulab Jamun',      kcal: 150,  img: '/food/c5.jpg',   desc: 'The sweet finish. If it is a lot for your day, Thali offers one lighter swap.' },
  { name: 'Kachumber Salad',  kcal: 40,   img: '/food/c6.jpg',   desc: 'Crunch and freshness. Calibrated for home food, not just plated Western meals.' },
];
const N = DISHES.length;
const R_THUMB = 250;

export function HeroOrbit() {
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSel((v) => (v + 1) % N), 4200);
    return () => clearInterval(t);
  }, []);
  const dish = DISHES[sel];

  return (
    <div className={s.hero}>
      <div className={`container ${s.grid}`}>
        {/* Left copy — crossfades per dish */}
        <div className={s.copy}>
          <span className={s.eyebrow}>✨ Meet Thali AI</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={sel}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className={s.kcal}>~{dish.kcal.toLocaleString()} <span className={s.kcalUnit}>kcal</span></div>
              <h1 className={s.title}>{dish.name}</h1>
              <p className={s.desc}>{dish.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className={s.ctaRow}>
            <a href={APP_URL} className={s.cta}>Snap it in Thali <span className={s.ctaCircle}>→</span></a>
            <a href="#waitlist" className={s.ghost}>Join the waitlist</a>
          </div>
          <p className={s.trust}>The nutrition coach that reads home-cooked plates — dal, sabzi, roti — not just plated Western meals.</p>
        </div>

        {/* Right orbit */}
        <div className={s.stageWrap}>
          <div className={s.stage}>
            <div className={s.arc} />
            <div className={s.ring} />

            {/* centre plate — crossfades to the selected dish */}
            <div className={s.centerWrap}>
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={sel}
                  src={dish.img}
                  alt={dish.name}
                  className={s.center}
                  initial={{ opacity: 0, scale: 0.82, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 8 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 180 }}
                />
              </AnimatePresence>
              <div className={s.scan} />
            </div>

            {/* orbiting dishes — click to select */}
            {DISHES.map((d, i) => {
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
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
