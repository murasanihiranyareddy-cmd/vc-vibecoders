import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  secondaryAction?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  secondaryAction
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        margin: 'var(--space-4) 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          marginBottom: 'var(--space-4)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.25)'
        }}
      >
        {icon}
      </div>

      <h3 className="heading-sm" style={{ marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          maxWidth: '440px',
          marginBottom: actionLabel || secondaryAction ? 'var(--space-5)' : 0,
          lineHeight: 1.5
        }}
      >
        {description}
      </p>

      {(actionLabel || secondaryAction) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {actionLabel && onAction && (
            <button type="button" className="btn btn-primary" onClick={onAction}>
              {actionIcon}
              {actionLabel}
            </button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
