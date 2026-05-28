import React from 'react';
import { Card, CardProps, useTheme } from '@mui/material';

export interface GlassCardProps extends Omit<CardProps, 'variant'> {
  children: React.ReactNode;
  sx?: CardProps['sx'];
  onClick?: () => void;
  elevation?: number;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  sx,
  onClick,
  elevation = 0,
  className,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      className={className}
      sx={{
        background: isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 8px 32px rgba(0,0,0,0.1)',
            }
          : {},
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};
