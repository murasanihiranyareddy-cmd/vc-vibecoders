import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, Priority, TeamMember } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>, isEdit: boolean, id?: string) => void;
  projectToEdit?: Project | null;
  members: TeamMember[];
}

const COLOR_PRESETS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#0ea5e9', // Sky
  '#8b5cf6', // Purple
  '#f97316'  // Orange
];

const ICON_PRESETS = [
  { id: 'Cpu', label: 'AI / Compute' },
  { id: 'Layout', label: 'Canvas / UI' },
  { id: 'ShieldCheck', label: 'Security / Infra' },
  { id: 'Sparkles', label: 'Marketing / Launch' },
  { id: 'Folder', label: 'General' }
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
  members
}) => {
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Core Platform');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [priority, setPriority] = useState<Priority>('medium');
  const [leadId, setLeadId] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budgetHours, setBudgetHours] = useState('160');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Cpu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; key?: string }>({});

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setKey(projectToEdit.key);
      setDescription(projectToEdit.description);
      setCategory(projectToEdit.category);
      setStatus(projectToEdit.status);
      setPriority(projectToEdit.priority);
      setLeadId(projectToEdit.leadId);
      setMemberIds(projectToEdit.memberIds || []);
      setStartDate(projectToEdit.startDate);
      setDueDate(projectToEdit.dueDate);
      setBudgetHours(projectToEdit.budgetHours?.toString() || '160');
      setColor(projectToEdit.color || '#6366f1');
      setIcon(projectToEdit.icon || 'Cpu');
    } else {
      setName('');
      setKey('');
      setDescription('');
      setCategory('Core Platform');
      setStatus('in_progress');
      setPriority('medium');
      setLeadId(members[0]?.id || 'mem-1');
      setMemberIds([members[0]?.id || 'mem-1']);
      const now = new Date();
      setStartDate(now.toISOString().split('T')[0]);
      now.setDate(now.getDate() + 30);
      setDueDate(now.toISOString().split('T')[0]);
      setBudgetHours('160');
      setColor('#6366f1');
      setIcon('Cpu');
    }
    setFormErrors({});
  }, [projectToEdit, isOpen, members]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; key?: string } = {};
    if (!name.trim()) errors.name = 'Project name is required';
    if (!key.trim()) errors.key = 'Project key (e.g. AURA) is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Please fix validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(
        {
          name: name.trim(),
          key: key.trim().toUpperCase(),
          description: description.trim(),
          category,
          status,
          priority,
          leadId: leadId || members[0]?.id || 'mem-1',
          memberIds: memberIds.length > 0 ? memberIds : [leadId || members[0]?.id || 'mem-1'],
          startDate: startDate || new Date().toISOString().split('T')[0],
          dueDate: dueDate || new Date().toISOString().split('T')[0],
          budgetHours: parseInt(budgetHours, 10) || 160,
          color,
          icon
        },
        Boolean(projectToEdit),
        projectToEdit?.id
      );

      success(projectToEdit ? 'Project updated successfully' : 'Project created successfully');
      onClose();
    } catch (err) {
      console.error(err);
      error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMember = (mId: string) => {
    setMemberIds((prev) =>
      prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={projectToEdit ? 'Edit Project' : 'Create New Project'}
      description="Configure goals, team members, milestone dates, and visual branding."
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
                Saving Project...
              </>
            ) : projectToEdit ? (
              'Save Changes'
            ) : (
              'Create Project'
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
          {/* Project Name */}
          <div className="input-group">
            <label className="input-label">Project Name *</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!projectToEdit && !key) {
                  // auto-generate key candidate
                  const words = e.target.value.trim().split(' ');
                  if (words.length > 0 && words[0]) {
                    setKey(words[0].substring(0, 5).toUpperCase());
                  }
                }
              }}
              placeholder="e.g. Aura Agent Orchestration"
              required
            />
            {formErrors.name && (
              <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{formErrors.name}</span>
            )}
          </div>

          {/* Key */}
          <div className="input-group">
            <label className="input-label">Project Key *</label>
            <input
              type="text"
              className="input-field"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="e.g. AURA"
              maxLength={8}
              required
            />
            {formErrors.key && (
              <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{formErrors.key}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="input-group">
          <label className="input-label">Description & Strategic Objectives</label>
          <textarea
            className="textarea-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary of why this project exists and the core deliverables..."
            rows={3}
          />
        </div>

        {/* Category & Status & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              className="select-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Core Platform">Core Platform</option>
              <option value="AI Intelligence">AI Intelligence</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Design System">Design System</option>
              <option value="Marketing">Marketing</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <select
              className="select-field"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
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
        </div>

        {/* Dates & Budget */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Start Date</label>
            <input
              type="date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Target Due Date</label>
            <input
              type="date"
              className="input-field"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Estimated Budget (Hours)</label>
            <input
              type="number"
              className="input-field"
              value={budgetHours}
              onChange={(e) => setBudgetHours(e.target.value)}
              min={1}
            />
          </div>
        </div>

        {/* Lead Assignee */}
        <div className="input-group">
          <label className="input-label">Project Lead</label>
          <select
            className="select-field"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role})
              </option>
            ))}
          </select>
        </div>

        {/* Team Members Multi-Select */}
        <div className="input-group">
          <label className="input-label">Assigned Team Members</label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              background: 'var(--bg-input)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)'
            }}
          >
            {members.map((m) => {
              const isSelected = memberIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMember(m.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isSelected ? 'var(--accent-primary-light)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: m.avatarColor
                    }}
                  />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color & Icon Presets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Accent Color</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '3px solid #ffffff' : '1px solid rgba(0,0,0,0.3)',
                    boxShadow: color === c ? `0 0 10px ${c}` : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Icon Representation</label>
            <select
              className="select-field"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              {ICON_PRESETS.map((ic) => (
                <option key={ic.id} value={ic.id}>
                  {ic.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
