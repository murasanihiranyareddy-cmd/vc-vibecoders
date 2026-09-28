import React, { useState } from 'react';
import { Task, Project, TeamMember, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import {
  CheckCircle2,
  Circle,
  Calendar,
  CheckSquare,
  Trash2,
  Edit3,
  MoreVertical
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  onSelectTask: (task: Task) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onBatchUpdateStatus: (taskIds: string[], status: TaskStatus) => void;
  onBatchDelete: (taskIds: string[]) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projects,
  members,
  onSelectTask,
  onToggleTaskStatus,
  onUpdateTaskStatus,
  onBatchUpdateStatus,
  onBatchDelete,
  onEditTask,
  onDeleteTask
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isAllSelected = tasks.length > 0 && selectedIds.length === tasks.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Batch Action Toolbar */}
      {selectedIds.length > 0 && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--accent-primary-light)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            animation: 'slideDownFade 0.2s ease-out'
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#ffffff' }}>
            {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'} selected
          </span>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onBatchUpdateStatus(selectedIds, 'done');
                setSelectedIds([]);
              }}
            >
              <CheckCircle2 size={13} color="#10b981" />
              <span>Mark Completed</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onBatchUpdateStatus(selectedIds, 'in_progress');
                setSelectedIds([]);
              }}
            >
              <span>Set In Progress</span>
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                onBatchDelete(selectedIds);
                setSelectedIds([]);
              }}
            >
              <Trash2 size={13} />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 2fr 1.2fr 1fr 1fr 1fr 60px',
            padding: '0.65rem 1rem',
            background: 'var(--bg-card-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-dim)',
            alignItems: 'center'
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              style={{ cursor: 'pointer' }}
              aria-label="Select all tasks"
            />
          </div>
          <div>Task Title</div>
          <div>Project</div>
          <div>Assignee</div>
          <div>Status</div>
          <div>Priority & Due</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {/* Task Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const assignee = members.find((m) => m.id === task.assigneeId);
            const isDone = task.status === 'done';
            const isSelected = selectedIds.includes(task.id);
            const subtasks = task.subtasks || [];
            const completedSubtasks = subtasks.filter((s) => s.completed).length;

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 2fr 1.2fr 1fr 1fr 1fr 60px',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: isSelected
                    ? 'var(--accent-primary-light)'
                    : isDone
                    ? 'rgba(16, 185, 129, 0.02)'
                    : 'transparent',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {/* Checkbox select */}
                <div onClick={(e) => toggleSelectOne(task.id, e)}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                    aria-label={`Select task ${task.title}`}
                  />
                </div>

                {/* Title & Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, paddingRight: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    style={{ padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskStatus(task.id);
                    }}
                    aria-label={isDone ? 'Mark task incomplete' : 'Mark task complete'}
                  >
                    {isDone ? <CheckCircle2 size={17} color="#10b981" /> : <Circle size={17} color="var(--text-dim)" />}
                  </button>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--text-dim)' : 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {task.title}
                    </div>
                    {subtasks.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        <CheckSquare size={11} color="#38bdf8" />
                        <span>{completedSubtasks}/{subtasks.length} subtasks</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project */}
                <div>
                  {project ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: project.color || 'var(--accent-primary)',
                        background: project.color ? `${project.color}15` : 'var(--accent-primary-light)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      {project.key}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>-</span>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  {assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Avatar name={assignee.name} color={assignee.avatarColor} size="xs" />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {assignee.name.split(' ')[0]}
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>Unassigned</span>
                  )}
                </div>

                {/* Status selector */}
                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    className="select-field"
                    style={{ fontSize: 'var(--text-xs)', padding: '0.25rem 0.5rem', width: 'auto' }}
                    value={task.status}
                    onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                    aria-label="Change status"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Priority & Due Date */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    <Calendar size={11} />
                    <span>{task.dueDate}</span>
                  </div>
                </div>

                {/* Row Actions Menu */}
                <div style={{ textAlign: 'right', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    style={{ padding: '3px' }}
                    onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                    aria-label="More task options"
                  >
                    <MoreVertical size={15} />
                  </button>

                  {activeMenuId === task.id && (
                    <>
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div
                        className="glass-panel"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          width: '130px',
                          padding: '4px',
                          zIndex: 50,
                          boxShadow: 'var(--shadow-lg)'
                        }}
                      >
                        <button
                          type="button"
                          className="sidebar-nav-item"
                          style={{ padding: '0.35rem 0.6rem', fontSize: 'var(--text-xs)' }}
                          onClick={() => {
                            setActiveMenuId(null);
                            onEditTask(task);
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="sidebar-nav-item"
                          style={{ padding: '0.35rem 0.6rem', fontSize: 'var(--text-xs)', color: '#f87171' }}
                          onClick={() => {
                            setActiveMenuId(null);
                            onDeleteTask(task.id);
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
