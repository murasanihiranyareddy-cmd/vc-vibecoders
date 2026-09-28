import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Meeting } from '../../types';
import { MeetingDetailModal } from './MeetingDetailModal';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import {
  BrainCircuit,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
  Trash2,
  FolderKanban
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface MeetingsViewProps {
  onOpenCreateMeeting: (projectId?: string) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  onOpenCreateMeeting
}) => {
  const {
    meetings,
    projects,
    members,
    selectedMeetingId,
    setSelectedMeetingId,
    deleteMeeting,
    processMeetingWithAI,
    convertActionItemToTask,
    setSelectedTaskId,
    setActiveView,
    setSelectedProjectId
  } = useWorkspace();

  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  const inspectedMeeting = useMemo(() => {
    if (!selectedMeetingId) return null;
    return meetings.find((m) => m.id === selectedMeetingId) || null;
  }, [meetings, selectedMeetingId]);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.rawNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary?.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary?.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProject = projectFilter === 'all' || m.projectId === projectFilter;

      return matchesSearch && matchesProject;
    });
  }, [meetings, searchQuery, projectFilter]);

  const handleDeleteConfirm = () => {
    if (meetingToDelete) {
      deleteMeeting(meetingToDelete);
      success('Meeting notes deleted');
      setMeetingToDelete(null);
    }
  };

  const handleConvertAction = (meetingId: string, actionItemId: string) => {
    const newTask = convertActionItemToTask(meetingId, actionItemId);
    if (newTask) {
      success(`Converted to task: "${newTask.title}"`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h2 className="heading-lg" style={{ margin: 0 }}>
            AI Meeting Intelligence
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            Automated transcription parsing, structured executive summaries, and one-click task extraction.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => onOpenCreateMeeting()}>
          <Sparkles size={16} />
          <span>Analyze Meeting Notes</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--bg-card-subtle)'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '32px' }}
            placeholder="Search meeting notes, decisions, or action items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <select
            className="select-field"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            aria-label="Filter by Project"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.key}] {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Meetings Grid / Empty State */}
      {filteredMeetings.length === 0 ? (
        <EmptyState
          icon={<BrainCircuit size={28} />}
          title="No AI meeting notes found"
          description={
            searchQuery || projectFilter !== 'all'
              ? 'No meetings matched your search criteria.'
              : 'Paste your first meeting notes or transcript to generate structured summaries, decisions, and action items.'
          }
          actionLabel="Analyze Meeting"
          actionIcon={<Sparkles size={16} />}
          onAction={() => onOpenCreateMeeting()}
        />
      ) : (
        <div className="grid-cols-2">
          {filteredMeetings.map((meeting) => {
            const project = projects.find((p) => p.id === meeting.projectId);
            const attendees = members.filter((m) => meeting.attendeeIds?.includes(m.id));
            const summary = meeting.summary;
            const actionCount = summary?.actionItems?.length || 0;
            const decisionCount = summary?.decisions?.length || 0;

            return (
              <div
                key={meeting.id}
                className="card glass-panel-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--space-5)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedMeetingId(meeting.id)}
              >
                <div>
                  {/* Top Metadata */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-lg)',
                          background: 'rgba(236, 72, 153, 0.15)',
                          color: '#ec4899',
                          border: '1px solid rgba(236, 72, 153, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <BrainCircuit size={18} />
                      </div>
                      <div>
                        {project && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: project.color || 'var(--accent-primary)',
                              background: project.color ? `${project.color}18` : 'var(--accent-primary-light)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-xs)',
                              display: 'inline-block',
                              marginBottom: '2px'
                            }}
                          >
                            {project.key}
                          </span>
                        )}
                        <h3 className="heading-sm" style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                          {meeting.title}
                        </h3>
                      </div>
                    </div>

                    <span className="badge badge-primary">
                      {actionCount} Tasks
                    </span>
                  </div>

                  {/* Date & Duration */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-dim)', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      <span>{meeting.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      <span>{meeting.durationMinutes}m</span>
                    </div>
                  </div>

                  {/* Summary Preview */}
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: 'var(--space-4)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {summary?.overview || meeting.rawNotes.slice(0, 140) + '...'}
                  </p>
                </div>

                {/* Bottom Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {attendees.slice(0, 3).map((a, idx) => (
                      <div
                        key={a.id}
                        style={{
                          marginLeft: idx === 0 ? 0 : '-6px',
                          border: '2px solid var(--bg-card)',
                          borderRadius: '50%'
                        }}
                      >
                        <Avatar name={a.name} color={a.avatarColor} size="xs" showTooltip />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>
                      {decisionCount} Decision{decisionCount === 1 ? '' : 's'}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      style={{ padding: '3px', color: '#f87171' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMeetingToDelete(meeting.id);
                      }}
                      title="Delete notes"
                      aria-label="Delete notes"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meeting Detail Modal */}
      <MeetingDetailModal
        isOpen={Boolean(inspectedMeeting)}
        onClose={() => setSelectedMeetingId(null)}
        meeting={inspectedMeeting}
        project={projects.find((p) => p.id === inspectedMeeting?.projectId)}
        members={members}
        onDeleteMeeting={(id) => {
          setSelectedMeetingId(null);
          setMeetingToDelete(id);
        }}
        onReanalyze={async (id) => {
          await processMeetingWithAI(id);
        }}
        onConvertActionItem={handleConvertAction}
        onViewCreatedTask={(tId) => {
          setSelectedMeetingId(null);
          setSelectedTaskId(tId);
          setActiveView('tasks');
        }}
        onNavigateToProject={(pId) => {
          setSelectedMeetingId(null);
          setSelectedProjectId(pId);
          setActiveView('project_detail');
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(meetingToDelete)}
        onClose={() => setMeetingToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Meeting Notes?"
        message="Are you sure you want to delete these meeting notes? Any previously created tasks will remain in your project board."
        confirmLabel="Delete Meeting"
        variant="danger"
      />
    </div>
  );
};
