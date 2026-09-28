import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, Project, TeamMember, Subtask } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../../hooks/useToast';
import { Plus, X, Loader2, CheckSquare } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, isEdit: boolean, id?: string) => void;
  taskToEdit?: Task | null;
  projects: Project[];
  members: TeamMember[];
  initialProjectId?: string;
  initialStatus?: TaskStatus;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  projects,
  members,
  initialProjectId,
  initialStatus
}) => {
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('8');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ title?: string; projectId?: string }>({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setProjectId(taskToEdit.projectId);
      setAssigneeId(taskToEdit.assigneeId);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setEstimatedHours(taskToEdit.estimatedHours?.toString() || '8');
      setTags(taskToEdit.tags || []);
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(initialProjectId || projects[0]?.id || '');
      setAssigneeId(members[0]?.id || '');
      setStatus(initialStatus || 'todo');
      setPriority('medium');
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
      setEstimatedHours('8');
      setTags(['Feature']);
      setSubtasks([
        { id: `st-${Date.now()}-1`, title: 'Define implementation requirements', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute code & write unit tests', completed: false }
      ]);
    }
    setTagInput('');
    setNewSubtaskTitle('');
    setFormErrors({});
  }, [taskToEdit, isOpen, projects, members, initialProjectId, initialStatus]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim();
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { title?: string; projectId?: string } = {};
    if (!title.trim()) errors.title = 'Task title is required';
    if (!projectId) errors.projectId = 'Project assignment is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Please complete required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(
        {
          title: title.trim(),
          description: description.trim(),
          projectId,
          assigneeId: assigneeId || members[0]?.id || 'mem-1',
          status,
          priority,
          dueDate: dueDate || new Date().toISOString().split('T')[0],
          estimatedHours: parseInt(estimatedHours, 10) || 8,
          tags,
          subtasks
        },
        Boolean(taskToEdit),
        taskToEdit?.id
      );

      success(taskToEdit ? 'Task updated successfully' : 'Task created successfully');
      onClose();
    } catch (err) {
      console.error(err);
      error('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      description="Define task requirements, assignees, deadlines, and subtask checklist."
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : taskToEdit ? (
              'Save Changes'
            ) : (
              'Create Task'
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Task Title */}
        <div className="input-group">
          <label className="input-label">Task Title *</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement dynamic tool calling with token budget optimization"
            required
            autoFocus
          />
          {formErrors.title && (
            <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{formErrors.title}</span>
          )}
        </div>

        {/* Project & Assignee */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Project *</label>
            <select
              className="select-field"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.name}
                </option>
              ))}
            </select>
            {formErrors.projectId && (
              <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{formErrors.projectId}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Assignee</label>
            <select
              className="select-field"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="input-group">
          <label className="input-label">Description & Context</label>
          <textarea
            className="textarea-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain background, edge cases, and expected acceptance criteria..."
            rows={3}
          />
        </div>

        {/* Status, Priority, Due Date, Est. Hours */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
          <div className="input-group">
            <label className="input-label">Status</label>
            <select
              className="select-field"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Priority</label>
            <select
              className="select-field"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Est. Hours</label>
            <input
              type="number"
              className="input-field"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              min={1}
            />
          </div>
        </div>

        {/* Subtask Checklist Builder */}
        <div className="input-group" style={{ marginTop: 'var(--space-2)' }}>
          <label className="input-label">Subtasks & Acceptance Checklist ({subtasks.length})</label>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: 'var(--bg-card-subtle)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {subtasks.map((st) => (
              <div
                key={st.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-2)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, minWidth: 0 }}>
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleToggleSubtask(st.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      textDecoration: st.completed ? 'line-through' : 'none',
                      color: st.completed ? 'var(--text-dim)' : 'var(--text-main)'
                    }}
                  >
                    {st.title}
                  </span>
                </label>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  style={{ padding: '2px', color: 'var(--text-dim)' }}
                  onClick={() => handleRemoveSubtask(st.id)}
                  aria-label="Remove subtask"
                >
                  <X size={13} />
                </button>
              </div>
            ))}

            {/* Inline add subtask input */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <input
                type="text"
                className="input-field"
                style={{ fontSize: 'var(--text-xs)', padding: '0.4rem 0.65rem' }}
                placeholder="Add subtask step (e.g. Write unit tests)..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddSubtask}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="input-group">
          <label className="input-label">Tags & Labels</label>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <input
              type="text"
              className="input-field"
              style={{ fontSize: 'var(--text-xs)', padding: '0.4rem 0.65rem' }}
              placeholder="Type tag name and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddTag}
            >
              <Plus size={14} />
              <span>Add Tag</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tags.map((tag) => (
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
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0
                  }}
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
