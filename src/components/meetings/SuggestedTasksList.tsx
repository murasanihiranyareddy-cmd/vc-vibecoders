import React from 'react';
import { ActionItemSuggestion, TeamMember, Project } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { PlusCircle, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';

interface SuggestedTasksListProps {
  actionItems: ActionItemSuggestion[];
  members: TeamMember[];
  project?: Project;
  onConvert: (actionItemId: string) => void;
  onViewTask?: (taskId: string) => void;
}

export const SuggestedTasksList: React.FC<SuggestedTasksListProps> = ({
  actionItems,
  members,
  project,
  onConvert,
  onViewTask
}) => {
  if (!actionItems || actionItems.length === 0) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-dim)', fontSize: 'var(--text-xs)' }}>
        No suggested action items detected in these notes.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {actionItems.map((item) => {
        const assignee = members.find((m) => m.id === item.suggestedAssigneeId);
        const isConverted = Boolean(item.convertedToTaskId);

        return (
          <div
            key={item.id}
            className="card"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: isConverted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card-subtle)',
              border: isConverted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              flexWrap: 'wrap'
            }}
          >
            {/* Action Item Text & Details */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <PriorityBadge priority={item.suggestedPriority} />
                {item.suggestedDueDate && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    <Calendar size={11} />
                    <span>Due {item.suggestedDueDate}</span>
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: isConverted ? 'var(--text-muted)' : 'var(--text-main)',
                  lineHeight: 1.4
                }}
              >
                {item.text}
              </div>

              {assignee && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <Avatar name={assignee.name} color={assignee.avatarColor} size="xs" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Suggested Owner: <strong style={{ color: 'var(--text-muted)' }}>{assignee.name}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Convert Button */}
            <div>
              {isConverted ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', gap: '4px' }}
                  onClick={() => item.convertedToTaskId && onViewTask?.(item.convertedToTaskId)}
                >
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>Task Created</span>
                  <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onConvert(item.id)}
                  style={{ gap: '4px' }}
                >
                  <PlusCircle size={14} />
                  <span>Convert to Task</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
