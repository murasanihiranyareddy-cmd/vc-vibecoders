import React, { useState } from 'react';
import { Task, Project, TeamMember, TaskStatus, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  FolderKanban,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Tag
} from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  project?: Project;
  assignee?: TeamMember;
  allProjects: Project[];
  allMembers: TeamMember[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onNavigateToProject: (projectId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  project,
  assignee,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onNavigateToProject
}) => {
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  if (!isOpen || !task) return null;

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : task.status === 'done' ? 100 : 0;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    onAddSubtask(task.id, newSubtaskInput.trim());
    setNewSubtaskInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      maxWidth="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteTask(task.id)}
          >
            <Trash2 size={14} />
            <span>Delete Task</span>
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onEditTask(task)}
            >
              <Edit3 size={14} />
              <span>Edit Details</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      }
    >
      <div>
        {/* Status & Project Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {project ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px 8px', color: 'var(--accent-primary)', fontWeight: 700, gap: '6px' }}
              onClick={() => {
                onClose();
                onNavigateToProject(project.id);
              }}
            >
              <FolderKanban size={15} />
              <span>[{project.key}] {project.name}</span>
            </button>
          ) : (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>Unassigned Project</span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {/* Direct Status Selector */}
            <select
              className="select-field"
              style={{ fontSize: 'var(--text-xs)', padding: '0.3rem 0.65rem' }}
              value={task.status}
              onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
              aria-label="Change task status"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 700 }}>
            Description
          </h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            {task.description || 'No additional description provided.'}
          </p>
        </div>

        {/* Metadata Grid */}
        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-3)',
            background: 'var(--bg-card-subtle)',
            marginBottom: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-4)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Assignee</span>
            {assignee ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Avatar name={assignee.name} color={assignee.avatarColor} size="xs" />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{assignee.name}</span>
              </div>
            ) : (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)', marginTop: '4px' }}>Unassigned</div>
            )}
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Due Date</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '4px' }}>
              <Calendar size={13} color="var(--text-dim)" />
              <span>{task.dueDate}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Estimated Effort</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '4px' }}>
              <Clock size={13} color="var(--text-dim)" />
              <span>{task.estimatedHours || 8} Hours</span>
            </div>
          </div>
        </div>

        {/* Subtask Checklist */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
              Acceptance Checklist ({completedSubtasks}/{subtasks.length})
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: subtaskProgress === 100 ? '#34d399' : 'var(--text-muted)' }}>
              {subtaskProgress}%
            </span>
          </div>

          {subtasks.length > 0 && (
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <ProgressBar progress={subtaskProgress} height={5} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {subtasks.map((st) => (
              <div
                key={st.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: st.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card-subtle)',
                  border: `1px solid ${st.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)'}`
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                >
                  {st.completed ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : (
                    <Circle size={16} color="var(--text-dim)" />
                  )}
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      textDecoration: st.completed ? 'line-through' : 'none',
                      color: st.completed ? 'var(--text-dim)' : 'var(--text-main)'
                    }}
                  >
                    {st.title}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  style={{ padding: '2px', color: 'var(--text-dim)' }}
                  onClick={() => onDeleteSubtask(task.id, st.id)}
                  aria-label="Remove checklist item"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Quick add subtask form */}
            <form onSubmit={handleAddSubtaskSubmit} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <input
                type="text"
                className="input-field"
                style={{ fontSize: 'var(--text-xs)', padding: '0.4rem 0.75rem' }}
                placeholder="Add subtask item..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm" disabled={!newSubtaskInput.trim()}>
                <Plus size={14} />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Labels
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-primary-light)',
                    color: '#818cf8',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: '1px solid rgba(99, 102, 241, 0.25)'
                  }}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
