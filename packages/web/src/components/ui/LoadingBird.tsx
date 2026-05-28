import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

export interface LoadingBirdProps {
  size?: number;
  message?: string;
  sx?: SxProps<Theme>;
}

const birdKeyframes = `
  @keyframes birdFly {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(40px, -20px) rotate(10deg);
    }
    50% {
      transform: translate(0, -40px) rotate(0deg);
    }
    75% {
      transform: translate(-40px, -20px) rotate(-10deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @keyframes wingFlap {
    0%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(0.6);
    }
  }

  @keyframes shadowPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(0.7);
      opacity: 0.1;
    }
  }
`;

export const LoadingBird: React.FC<LoadingBirdProps> = ({
  size = 80,
  message,
  sx,
}) => {
  const birdSize = size * 0.5;
  const shadowSize = size * 0.3;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...sx,
      }}
    >
      <style>{birdKeyframes}</style>

      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          animation: 'birdFly 3s ease-in-out infinite',
        }}
      >
        {/* Bird emoji */}
        <Box
          sx={{
            fontSize: birdSize,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            lineHeight: 1,
          }}
        >
          🐦
        </Box>

        {/* Shadow */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: shadowSize,
            height: shadowSize * 0.3,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.15)',
            animation: 'shadowPulse 3s ease-in-out infinite',
          }}
        />
      </Box>

      {message && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: 'text.secondary',
            fontStyle: 'italic',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};
