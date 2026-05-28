import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export interface PageTransitionProps {
  children: React.ReactNode;
}

const MotionBox = motion.create(Box);

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      sx={{
        flex: 1,
        width: '100%',
      }}
    >
      {children}
    </MotionBox>
  );
};
