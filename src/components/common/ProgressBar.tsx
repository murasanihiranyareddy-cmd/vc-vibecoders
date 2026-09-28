import React from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: number;
  customColor?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  height = 7,
  customColor,
  className = ''
}) => {
  const normalized = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`w-full flex items-center gap-3 ${className}`} style={{ width: '100%' }}>
      <div
        className="progress-track"
        style={{
          height: `${height}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          flex: 1
        }}
        role="progressbar"
        aria-valuenow={normalized}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill"
          style={{
            width: `${normalized}%`,
            background: customColor || (normalized === 100 ? '#10b981' : undefined),
            height: '100%',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {showLabel && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: normalized === 100 ? '#34d399' : 'var(--text-muted)',
            minWidth: '36px',
            textAlign: 'right'
          }}
        >
          {normalized}%
        </span>
      )}
    </div>
  );
};
