import React from 'react';
import { MemberStatus } from '../../types';

interface AvatarProps {
  name: string;
  avatar?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: MemberStatus;
  className?: string;
  showTooltip?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatar,
  color = '#6366f1',
  size = 'md',
  status,
  className = '',
  showTooltip = false
}) => {
  const sizeMap = {
    xs: { dim: '24px', font: '0.65rem', dot: '6px' },
    sm: { dim: '30px', font: '0.75rem', dot: '8px' },
    md: { dim: '38px', font: '0.85rem', dot: '10px' },
    lg: { dim: '48px', font: '1.05rem', dot: '12px' },
    xl: { dim: '64px', font: '1.35rem', dot: '14px' }
  };

  const currentSize = sizeMap[size];

  const getInitials = (n: string) => {
    if (avatar && avatar.length <= 3) return avatar;
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const statusColorMap: Record<MemberStatus, string> = {
    active: '#10b981',
    in_meeting: '#f59e0b',
    away: '#8b5cf6',
    offline: '#64748b'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      title={showTooltip ? name : undefined}
      style={{
        width: currentSize.dim,
        height: currentSize.dim,
        position: 'relative',
        display: 'inline-flex'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: currentSize.font,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          border: '2px solid rgba(255, 255, 255, 0.12)',
          userSelect: 'none'
        }}
      >
        {getInitials(name)}
      </div>

      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: currentSize.dot,
            height: currentSize.dot,
            borderRadius: '50%',
            backgroundColor: statusColorMap[status],
            border: '2px solid var(--bg-card)',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)'
          }}
        />
      )}
    </div>
  );
};
