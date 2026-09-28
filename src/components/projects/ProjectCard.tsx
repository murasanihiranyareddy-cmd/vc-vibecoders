import React from 'react';
import { Project, TeamMember } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Calendar, CheckSquare, MoreVertical, Edit3, Trash2, ArrowUpRight, Cpu, Layout, ShieldCheck, Sparkles, Folder } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  members: TeamMember[];
  taskCount: number;
  completedTaskCount: number;
  progress: number;
  onOpenDetails: (id: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  members,
  taskCount,
  completedTaskCount,
  progress,
  onOpenDetails,
  onEdit,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const leadMember = members.find((m) => m.id === project.leadId);
  const projectMembers = members.filter((m) => project.memberIds.includes(m.id));

  const getProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu size={18} />;
      case 'Layout': return <Layout size={18} />;
      case 'ShieldCheck': return <ShieldCheck size={18} />;
      case 'Sparkles': return <Sparkles size={18} />;
      default: return <Folder size={18} />;
    }
  };

  return (
    <div
      className="card glass-panel-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={() => onOpenDetails(project.id)}
    >
      <div>
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: project.color ? `${project.color}25` : 'rgba(99, 102, 241, 0.15)',
                color: project.color || 'var(--accent-primary)',
                border: `1px solid ${project.color ? `${project.color}40` : 'rgba(99, 102, 241, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {getProjectIcon(project.icon)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-primary-light)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-xs)'
                  }}
                >
                  {project.key}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)', fontWeight: 500 }}>
                  {project.category}
                </span>
              </div>
              <h3
                className="heading-sm"
                style={{
                  fontSize: 'var(--text-base)',
                  marginTop: '2px',
                  marginBottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          {/* More Action Menu */}
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              style={{ padding: '4px' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Project actions"
            >
              <MoreVertical size={16} />
            </button>

            {isMenuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setIsMenuOpen(false)}
                />
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 4px)',
                    width: '150px',
                    padding: '4px',
                    zIndex: 50,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <button
                    type="button"
                    className="sidebar-nav-item"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--text-xs)' }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenDetails(project.id);
                    }}
                  >
                    <ArrowUpRight size={14} />
                    <span>View Details</span>
                  </button>
                  <button
                    type="button"
                    className="sidebar-nav-item"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--text-xs)' }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(project);
                    }}
                  >
                    <Edit3 size={14} />
                    <span>Edit Project</span>
                  </button>
                  <button
                    type="button"
                    className="sidebar-nav-item"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--text-xs)', color: '#f87171' }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete(project.id);
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: 'var(--space-4)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Progress & Metadata */}
      <div>
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)', fontWeight: 600 }}>
              Progress
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: progress === 100 ? '#34d399' : 'var(--text-main)' }}>
              {progress}%
            </span>
          </div>
          <ProgressBar progress={progress} height={6} customColor={project.color} />
        </div>

        {/* Status Badges & Due Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--border-subtle)',
            gap: 'var(--space-2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            <Calendar size={13} />
            <span>{project.dueDate.slice(5)}</span>
          </div>
        </div>

        {/* Members & Tasks counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-2)'
          }}
        >
          {/* Member avatars overlap */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {projectMembers.slice(0, 3).map((m, idx) => (
              <div
                key={m.id}
                style={{
                  marginLeft: idx === 0 ? 0 : '-8px',
                  border: '2px solid var(--bg-card)',
                  borderRadius: '50%'
                }}
              >
                <Avatar name={m.name} color={m.avatarColor} size="xs" showTooltip />
              </div>
            ))}
            {projectMembers.length > 3 && (
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '2px 4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  marginLeft: '-4px',
                  color: 'var(--text-muted)'
                }}
              >
                +{projectMembers.length - 3}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>
            <CheckSquare size={13} color="#38bdf8" />
            <span>{completedTaskCount}/{taskCount} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
