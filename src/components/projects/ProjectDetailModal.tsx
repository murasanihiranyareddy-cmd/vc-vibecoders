import React, { useState } from 'react';
import { Project, Task, TeamMember, Meeting, TeamMemory } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  BrainCircuit,
  BookMarked,
  Edit3,
  Trash2,
  Users
} from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  tasks: Task[];
  members: TeamMember[];
  meetings: Meeting[];
  memories: TeamMemory[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onOpenTaskModal: (projectId?: string) => void;
  onSelectMeeting: (meetingId: string) => void;
  onSelectMemory: (memoryId: string) => void;
  onSelectTask: (taskId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  tasks,
  members,
  meetings,
  memories,
  onEditProject,
  onDeleteProject,
  onToggleTaskStatus,
  onOpenTaskModal,
  onSelectMeeting,
  onSelectMemory,
  onSelectTask
}) => {
  const [activeSection, setActiveSection] = useState<'tasks' | 'meetings' | 'memories' | 'team'>('tasks');

  if (!isOpen || !project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const doneTasks = projectTasks.filter((t) => t.status === 'done');
  const progress = projectTasks.length > 0 ? Math.round((doneTasks.length / projectTasks.length) * 100) : project.progress;

  const leadMember = members.find((m) => m.id === project.leadId);
  const projectMembers = members.filter((m) => project.memberIds.includes(m.id));
  const projectMeetings = meetings.filter((m) => m.projectId === project.id);
  const projectMemories = memories.filter((m) => m.projectId === project.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      maxWidth="xl"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteProject(project.id)}
          >
            <Trash2 size={14} />
            <span>Delete Project</span>
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onEditProject(project)}
            >
              <Edit3 size={15} />
              <span>Edit Details</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      }
    >
      <div>
        {/* Top Header Card */}
        <div
          className="card"
          style={{
            background: 'var(--bg-card-subtle)',
            marginBottom: 'var(--space-5)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-primary-light)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)'
                  }}
                >
                  {project.key}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>
                  {project.category}
                </span>
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, marginTop: '8px' }}>
                {project.description}
              </p>
            </div>

            {/* Lead info */}
            {leadMember && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Avatar name={leadMember.name} color={leadMember.avatarColor} size="xs" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Project Lead</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{leadMember.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Completion</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <ProgressBar progress={progress} height={6} customColor={project.color} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{progress}%</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Tasks Progress</span>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px' }}>
                {doneTasks.length} / {projectTasks.length} Completed
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Timeline</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px' }}>
                <Calendar size={13} color="var(--text-dim)" />
                <span>{project.dueDate}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Budget Target</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px' }}>
                <Clock size={13} color="var(--text-dim)" />
                <span>{project.budgetHours || 160} Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeSection === 'tasks' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSection('tasks')}
          >
            <span>Tasks ({projectTasks.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeSection === 'meetings' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSection('meetings')}
          >
            <BrainCircuit size={14} />
            <span>AI Meetings ({projectMeetings.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeSection === 'memories' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSection('memories')}
          >
            <BookMarked size={14} />
            <span>Knowledge & SOPs ({projectMemories.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeSection === 'team' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSection('team')}
          >
            <Users size={14} />
            <span>Team ({projectMembers.length})</span>
          </button>
        </div>

        {/* Tab 1: Tasks */}
        {activeSection === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                Project Deliverables
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onOpenTaskModal(project.id)}
              >
                <Plus size={14} />
                <span>Add Task to Project</span>
              </button>
            </div>

            {projectTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-dim)', fontSize: 'var(--text-sm)' }}>
                No tasks assigned to this project yet. Click "Add Task" to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {projectTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const isDone = task.status === 'done';
                  return (
                    <div
                      key={task.id}
                      className="card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.9rem',
                        background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card-subtle)',
                        border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                      onClick={() => onSelectTask(task.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          style={{ padding: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTaskStatus(task.id);
                          }}
                          aria-label={isDone ? 'Mark task pending' : 'Mark task completed'}
                        >
                          {isDone ? <CheckCircle2 size={18} color="#10b981" /> : <Circle size={18} color="var(--text-dim)" />}
                        </button>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <span
                            style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 600,
                              textDecoration: isDone ? 'line-through' : 'none',
                              color: isDone ? 'var(--text-dim)' : 'var(--text-main)'
                            }}
                          >
                            {task.title}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
                        <PriorityBadge priority={task.priority} />
                        {assignee && (
                          <Avatar name={assignee.name} color={assignee.avatarColor} size="xs" showTooltip />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Meetings */}
        {activeSection === 'meetings' && (
          <div>
            {projectMeetings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-dim)', fontSize: 'var(--text-sm)' }}>
                No AI meeting notes linked to this project yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {projectMeetings.map((meet) => (
                  <div
                    key={meet.id}
                    className="card glass-panel-hover"
                    style={{ padding: 'var(--space-4)', cursor: 'pointer' }}
                    onClick={() => onSelectMeeting(meet.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 className="heading-sm" style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                          {meet.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {meet.date} &bull; {meet.durationMinutes} mins
                        </span>
                      </div>
                      <span className="badge badge-primary">
                        {meet.summary?.actionItems.length || 0} Action Items
                      </span>
                    </div>
                    {meet.summary && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '8px', margin: 0 }}>
                        {meet.summary.overview}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Memories */}
        {activeSection === 'memories' && (
          <div>
            {projectMemories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-dim)', fontSize: 'var(--text-sm)' }}>
                No documentation or SOP notes linked to this project yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {projectMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="card glass-panel-hover"
                    style={{ padding: 'var(--space-4)', cursor: 'pointer' }}
                    onClick={() => onSelectMemory(mem.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 className="heading-sm" style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                        {mem.title}
                      </h4>
                      <span className="badge badge-primary">{mem.category.toUpperCase()}</span>
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                        marginTop: '6px',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {mem.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Team */}
        {activeSection === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            {projectMembers.map((m) => (
              <div
                key={m.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)'
                }}
              >
                <Avatar name={m.name} color={m.avatarColor} status={m.status} size="md" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{m.role}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.department}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
