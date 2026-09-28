import React from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = ''
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`flex items-center ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: variant === 'pill' ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
        padding: variant === 'pill' ? '4px' : 0,
        borderRadius: variant === 'pill' ? 'var(--radius-lg)' : 0,
        border: variant === 'pill' ? '1px solid var(--border-card)' : 'none',
        borderBottom: variant === 'underline' ? '1px solid var(--border-subtle)' : 'none'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: variant === 'pill' ? '0.4rem 0.85rem' : '0.65rem 1rem',
              fontSize: 'var(--text-xs)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              background: isActive && variant === 'pill' ? 'var(--bg-surface)' : 'transparent',
              borderRadius: variant === 'pill' ? 'var(--radius-md)' : 0,
              border: 'none',
              borderBottom: variant === 'underline' && isActive ? '2px solid var(--accent-primary)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: isActive && variant === 'pill' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--accent-primary-light)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#818cf8' : 'var(--text-dim)'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
