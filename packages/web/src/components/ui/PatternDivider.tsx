import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

export interface PatternDividerProps {
  variant?: 'arhuaco' | 'kogui' | 'default';
  sx?: SxProps<Theme>;
}

const ArhuacoPattern = () => (
  <svg width="100%" height="40" viewBox="0 0 800 40" preserveAspectRatio="none">
    <defs>
      <linearGradient id="arhuacoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2D5016" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#D4A017" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#2D5016" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Diamond chain pattern */}
    <path
      d="M0,20 L20,0 L40,20 L20,40 Z M40,20 L60,0 L80,20 L60,40 Z M80,20 L100,0 L120,20 L100,40 Z M120,20 L140,0 L160,20 L140,40 Z M160,20 L180,0 L200,20 L180,40 Z M200,20 L220,0 L240,20 L220,40 Z M240,20 L260,0 L280,20 L260,40 Z M280,20 L300,0 L320,20 L300,40 Z M320,20 L340,0 L360,20 L340,40 Z M360,20 L380,0 L400,20 L380,40 Z M400,20 L420,0 L440,20 L420,40 Z M440,20 L460,0 L480,20 L460,40 Z M480,20 L500,0 L520,20 L500,40 Z M520,20 L540,0 L560,20 L540,40 Z M560,20 L580,0 L600,20 L580,40 Z M600,20 L620,0 L640,20 L620,40 Z M640,20 L660,0 L680,20 L660,40 Z M680,20 L700,0 L720,20 L700,40 Z M720,20 L740,0 L760,20 L740,40 Z M760,20 L780,0 L800,20 L780,40 Z"
      fill="none"
      stroke="url(#arhuacoGrad)"
      strokeWidth="1.5"
    />
    {/* Center line */}
    <line x1="0" y1="20" x2="800" y2="20" stroke="url(#arhuacoGrad)" strokeWidth="0.5" />
  </svg>
);

const KoguiPattern = () => (
  <svg width="100%" height="40" viewBox="0 0 800 40" preserveAspectRatio="none">
    <defs>
      <linearGradient id="koguiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1A3A4A" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#2E7D9A" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#1A3A4A" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Zigzag pattern */}
    <polyline
      points="0,20 30,5 60,20 90,5 120,20 150,5 180,20 210,5 240,20 270,5 300,20 330,5 360,20 390,5 420,20 450,5 480,20 510,5 540,20 570,5 600,20 630,5 660,20 690,5 720,20 750,5 780,20"
      fill="none"
      stroke="url(#koguiGrad)"
      strokeWidth="1.5"
    />
    <polyline
      points="0,20 30,35 60,20 90,35 120,20 150,35 180,20 210,35 240,20 270,35 300,20 330,35 360,20 390,35 420,20 450,35 480,20 510,35 540,20 570,35 600,20 630,35 660,20 690,35 720,20 750,35 780,20"
      fill="none"
      stroke="url(#koguiGrad)"
      strokeWidth="1.5"
    />
  </svg>
);

const DefaultPattern = () => (
  <svg width="100%" height="40" viewBox="0 0 800 40" preserveAspectRatio="none">
    <defs>
      <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4A7C2F" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#8BC34A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#4A7C2F" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {/* Simple wave pattern */}
    <path
      d="M0,20 Q100,5 200,20 Q300,35 400,20 Q500,5 600,20 Q700,35 800,20"
      fill="none"
      stroke="url(#defaultGrad)"
      strokeWidth="1.5"
    />
    <path
      d="M0,20 Q100,35 200,20 Q300,5 400,20 Q500,35 600,20 Q700,5 800,20"
      fill="none"
      stroke="url(#defaultGrad)"
      strokeWidth="0.5"
      opacity="0.5"
    />
  </svg>
);

export const PatternDivider: React.FC<PatternDividerProps> = ({
  variant = 'default',
  sx,
}) => {
  const renderPattern = () => {
    switch (variant) {
      case 'arhuaco':
        return <ArhuacoPattern />;
      case 'kogui':
        return <KoguiPattern />;
      default:
        return <DefaultPattern />;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {renderPattern()}
    </Box>
  );
};
