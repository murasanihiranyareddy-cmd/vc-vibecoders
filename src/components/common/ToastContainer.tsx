import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'info':
      default:
        return <Info size={18} color="#6366f1" />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(toast.type)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{toast.title}</div>
            {toast.message && (
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                  lineHeight: 1.4
                }}
              >
                {toast.message}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => removeToast(toast.id)}
            style={{ padding: '2px', color: 'var(--text-dim)' }}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
