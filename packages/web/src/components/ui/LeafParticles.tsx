import React, { useMemo } from 'react';
import { Box } from '@mui/material';

export interface LeafParticlesProps {
  count?: number;
}

const LEAF_EMOJIS = ['🍃', '🌿', '🍂'];

const leafKeyframes = `
  @keyframes leafFall {
    0% {
      transform: translateY(-20px) rotate(0deg) translateX(0px);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.4;
    }
    100% {
      transform: translateY(100vh) rotate(720deg) translateX(80px);
      opacity: 0;
    }
  }

  @keyframes leafSway {
    0%, 100% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(30px);
    }
  }
`;

interface Particle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const LeafParticles: React.FC<LeafParticlesProps> = ({ count = 8 }) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 10 + Math.random() * 15,
      size: 16 + Math.random() * 16,
    }));
  }, [count]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <style>{leafKeyframes}</style>

      {particles.map((particle) => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            top: -20,
            left: `${particle.left}%`,
            fontSize: particle.size,
            animation: `leafFall ${particle.duration}s linear ${particle.delay}s infinite`,
            opacity: 0,
            lineHeight: 1,
          }}
        >
          {particle.emoji}
        </Box>
      ))}
    </Box>
  );
};
