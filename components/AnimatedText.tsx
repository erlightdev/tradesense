"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { MotionProps } from 'framer-motion';

type AllowedComponents = 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AnimatedTextProps extends MotionProps {
  children: ReactNode;
  as?: AllowedComponents;
  className?: string;
  staggered?: boolean;
}

export const AnimatedText = ({
  children,
  as: Component = 'div',
  className = '',
  staggered = false,
  ...motionProps
}: AnimatedTextProps) => {
  const defaultMotionProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  if (!staggered || typeof children !== 'string') {
    const MotionComponent = motion[Component];
    return (
      <MotionComponent 
        className={className}
        {...defaultMotionProps}
        {...motionProps}
      >
        {children}
      </MotionComponent>
    );
  }

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