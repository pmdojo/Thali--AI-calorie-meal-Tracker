'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import React from 'react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

// Reveal a block as it scrolls into view (once).
export function Reveal({
  children, delay = 0, y = 28, className,
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children in as the group scrolls into view.
const groupVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function RevealStagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      variants={groupVariants}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} variants={itemVariants}>{children}</motion.div>;
}

// Gentle press/hover lift for interactive elements.
export function Lift({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
