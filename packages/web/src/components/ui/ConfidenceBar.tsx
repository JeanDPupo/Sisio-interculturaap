import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

export interface ConfidenceBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  sx?: SxProps<Theme>;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  value,
  label,
  showPercentage = true,
  sx,
}) => {
  const clampedValue = Math.max(0, Math.min(1, value));
  const percentage = Math.round(clampedValue * 100);

  const getGradient = () => {
    if (clampedValue < 0.4) {
      return 'linear-gradient(90deg, #F44336, #FF8F00)';
    } else if (clampedValue < 0.7) {
      return 'linear-gradient(90deg, #FF8F00, #D4A017)';
    }
    return 'linear-gradient(90deg, #D4A017, #4CAF50)';
  };

  const getGlowColor = () => {
    if (clampedValue < 0.4) return 'rgba(244,67,54,0.6)';
    if (clampedValue < 0.7) return 'rgba(212,160,23,0.6)';
    return 'rgba(76,175,80,0.6)';
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {(label || showPercentage) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
          }}
        >
          {label && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: clampedValue >= 0.7 ? '#4CAF50' : clampedValue >= 0.4 ? '#D4A017' : '#F44336',
              }}
            >
              {percentage}%
            </Typography>
          )}
        </Box>
      )}

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 12,
          borderRadius: 6,
          overflow: 'hidden',
          bgcolor: 'rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percentage}%`,
            borderRadius: 6,
            background: getGradient(),
            transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        {/* Glow point at fill edge */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: getGlowColor(),
            boxShadow: `0 0 12px 4px ${getGlowColor()}`,
            transition: 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            opacity: percentage > 0 ? 1 : 0,
          }}
        />
      </Box>
    </Box>
  );
};
