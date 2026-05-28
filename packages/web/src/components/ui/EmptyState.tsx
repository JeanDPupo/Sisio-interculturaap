import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { motion } from 'framer-motion';

export interface EmptyStateProps {
  image?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  image,
  title,
  description,
  action,
  icon,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        ...sx,
      }}
    >
      {image && (
        <motion.div animate={floatAnimation}>
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: 200,
              height: 200,
              objectFit: 'contain',
              mb: 4,
              opacity: 0.8,
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))',
            }}
          />
        </motion.div>
      )}

      {icon && !image && (
        <motion.div animate={floatAnimation}>
          <Box
            sx={{
              fontSize: 80,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </motion.div>
      )}

      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          mb: 1.5,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 400,
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      )}

      {action && <Box>{action}</Box>}
    </Box>
  );
};
