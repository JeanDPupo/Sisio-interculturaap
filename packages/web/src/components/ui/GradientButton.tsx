import React, { useState } from 'react';
import { Button, ButtonProps, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
  sx?: ButtonProps['sx'];
}

const MotionButton = motion.create(Button);

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  startIcon,
  fullWidth = false,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: isHovered
            ? 'linear-gradient(135deg, #4A7C2F, #F5C842)'
            : 'linear-gradient(135deg, #2D5016, #D4A017)',
          color: '#F0F7EE',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
          },
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: isDark ? '#D4A017' : '#2D5016',
          border: isHovered
            ? '2px solid #D4A017'
            : '1px solid rgba(212,160,23,0.3)',
          '&:hover': {
            background: isDark
              ? 'rgba(212,160,23,0.1)'
              : 'rgba(45,80,22,0.05)',
            border: '2px solid #D4A017',
          },
        };
      case 'danger':
        return {
          background: isHovered
            ? 'linear-gradient(135deg, #F44336, #FF5252)'
            : '#F44336',
          color: '#FFFFFF',
          border: 'none',
          animation: isHovered ? 'pulse-danger 1.5s infinite' : 'none',
          '@keyframes pulse-danger': {
            '0%': { boxShadow: '0 0 0 0 rgba(244,67,54,0.4)' },
            '70%': { boxShadow: '0 0 0 10px rgba(244,67,54,0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(244,67,54,0)' },
          },
          '&:hover': {
            background: 'linear-gradient(135deg, #F44336, #FF5252)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <MotionButton
      variant="contained"
      size={size}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      fullWidth={fullWidth}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        padding: size === 'small' ? '6px 16px' : size === 'large' ? '14px 32px' : '10px 24px',
        transition: 'all 0.3s ease',
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
};
