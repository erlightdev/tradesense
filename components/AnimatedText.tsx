"use client";

import type React from 'react';
import { motion, type MotionProps } from 'framer-motion';

interface AnimatedTextProps extends MotionProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  staggered?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  as: Component = 'div',
  className = '',
  staggered = false,
  ...motionProps
}) => {
  // If not staggered, render as a single motion component
  if (!staggered || typeof children !== 'string') {
    return (
      <motion.div 
        as={Component}
        className={className}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  // Staggered text animation
  return (
    <motion.div className={className}>
      {(children as string).split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: i * 0.1, 
            duration: 0.5 
          }}
          style={{ 
            display: 'inline-block', 
            marginRight: '0.25rem' 
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
