import React from 'react';
import { Task, TaskStatus, Project, TeamMember } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import {
  CheckCircle2,
  Circle,
  Calendar,
  CheckSquare,
  Plus,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface TaskKanbanProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  onSelectTask: (task: Task) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateInColumn: (status: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  label: string;
  color: string;
  dotClass: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'todo', label: 'To Do', color: '#64748b', dotClass: 'priority-low' },
  { id: 'in_progress', label: 'In Progress', color: '#38bdf8', dotClass: 'priority-medium' },
  { id: 'in_review', label: 'In Review', color: '#f59e0b', dotClass: 'priority-high' },
  { id: 'done', label: 'Done', color: '#10b981', dotClass: 'priority-urgent' }
];

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  projects,
  members,
  onSelectTask,
  onToggleTaskStatus,
  onUpdateTaskStatus,
  onOpenCreateInColumn
}) => {
  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'todo': return 'in_progress';
      case 'in_progress': return 'in_review';
      case 'in_review': return 'done';
      case 'done': return null;
    }
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'todo': return null;
      case 'in_progress': return 'todo';
      case 'in_review': return 'in_progress';
      case 'done': return 'in_review';
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))',
        gap: 'var(--space-4)',
        alignItems: 'flex-start',
        overflowX: 'auto',
        paddingBottom: 'var(--space-4)'
      }}
    >
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '520px'
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-2) var(--space-3)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: 'var(--space-3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: col.color,
                    boxShadow: `0 0 8px ${col.color}`
                  }}
                />
                <h3 className="heading-sm" style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                  {col.label}
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-dim)',
                    fontWeight: 700
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-icon"
                style={{ padding: '3px' }}
                onClick={() => onOpenCreateInColumn(col.id)}
                title={`Add task to ${col.label}`}
                aria-label={`Add task to ${col.label}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Column Tasks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-8) var(--space-2)',
                    color: 'var(--text-dim)',
                    fontSize: 'var(--text-xs)',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  No tasks in {col.label}
                </div>
              ) : (
                columnTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const isDone = task.status === 'done';
                  const nextStatus = getNextStatus(task.status);
                  const prevStatus = getPrevStatus(task.status);
                  const subtasks = task.subtasks || [];
                  const completedSubtasks = subtasks.filter((s) => s.completed).length;

                  return (
                    <div
                      key={task.id}
                      className="card glass-panel-hover"
                      style={{
                        padding: 'var(--space-4)',
                        cursor: 'pointer',
                        background: isDone ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)',
                        border: isDone ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-card)',
                        position: 'relative'
                      }}
                      onClick={() => onSelectTask(task)}
                    >
                      {/* Top Badges */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                          marginBottom: 'var(--space-2)'
                        }}
                      >
                        {project ? (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: project.color || 'var(--accent-primary)',
                              background: project.color ? `${project.color}18` : 'var(--accent-primary-light)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-xs)'
                            }}
                          >
                            {project.key}
                          </span>
                        ) : (
                          <span />
                        )}

                        <PriorityBadge priority={task.priority} />
                      </div>

                      {/* Task Title with Checkbox */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: 'var(--space-3)' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          style={{ padding: 0, marginTop: '2px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTaskStatus(task.id);
                          }}
                          aria-label={isDone ? 'Mark task pending' : 'Mark task done'}
                        >
                          {isDone ? <CheckCircle2 size={16} color="#10b981" /> : <Circle size={16} color="var(--text-dim)" />}
                        </button>

                        <h4
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            lineHeight: 1.35,
                            margin: 0,
                            textDecoration: isDone ? 'line-through' : 'none',
                            color: isDone ? 'var(--text-dim)' : 'var(--text-main)'
                          }}
                        >
                          {task.title}
                        </h4>
                      </div>

                      {/* Subtasks counter & Due Date */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.72rem',
                          color: 'var(--text-dim)',
                          marginBottom: 'var(--space-3)',
                          paddingTop: 'var(--space-2)',
                          borderTop: '1px solid var(--border-subtle)'
                        }}
                      >
                        {subtasks.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckSquare size={12} color="#38bdf8" />
                            <span>{completedSubtasks}/{subtasks.length}</span>
                          </div>
                        ) : (
                          <span />
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          <span>{task.dueDate.slice(5)}</span>
                        </div>
                      </div>

                      {/* Bottom Footer: Assignee & Column Mover Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {assignee ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Avatar name={assignee.name} color={assignee.avatarColor} size="xs" showTooltip />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {assignee.name.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Unassigned</span>
                        )}

                        {/* Quick Mover Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} onClick={(e) => e.stopPropagation()}>
                          {prevStatus && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              style={{ padding: '3px', color: 'var(--text-dim)' }}
                              title={`Move left to ${prevStatus}`}
                              onClick={() => onUpdateTaskStatus(task.id, prevStatus)}
                              aria-label={`Move task to ${prevStatus}`}
                            >
                              <ArrowLeft size={13} />
                            </button>
                          )}
                          {nextStatus && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              style={{ padding: '3px', color: 'var(--text-dim)' }}
                              title={`Move right to ${nextStatus}`}
                              onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
                              aria-label={`Move task to ${nextStatus}`}
                            >
                              <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
