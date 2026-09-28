import React, { useState } from 'react';
import { AlertTriangle, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  requireConfirmText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  requireConfirmText
}) => {
  const [typedText, setTypedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (requireConfirmText && typedText.trim() !== requireConfirmText.trim()) return;
    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error('Confirmation action error:', e);
    } finally {
      setIsProcessing(false);
      setTypedText('');
    }
  };

  const isButtonDisabled = isProcessing || (requireConfirmText ? typedText.trim() !== requireConfirmText.trim() : false);

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Trash2 size={24} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={24} color="#f59e0b" />;
      case 'primary':
      default:
        return <CheckCircle2 size={24} color="#6366f1" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isProcessing ? () => {} : onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : variant === 'warning' ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleConfirm}
            disabled={isButtonDisabled}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-lg)',
            background: variant === 'danger' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {getIcon()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            {message}
          </p>

          {requireConfirmText && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-dim)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                Please type <strong style={{ color: 'var(--text-main)' }}>{requireConfirmText}</strong> to confirm:
              </label>
              <input
                type="text"
                className="input-field"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder={requireConfirmText}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
