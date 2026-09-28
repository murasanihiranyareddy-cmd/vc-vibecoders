import React, { useState } from 'react';
import { Meeting, Project, TeamMember } from '../../types';
import { Modal } from '../common/Modal';
import { SuggestedTasksList } from './SuggestedTasksList';
import { Avatar } from '../common/Avatar';
import { useToast } from '../../hooks/useToast';
import {
  Calendar,
  Clock,
  Trash2,
  FolderKanban,
  CheckCircle2,
  RotateCcw,
  Download,
  Share2,
  BrainCircuit,
  FileText,
  HelpCircle
} from 'lucide-react';

interface MeetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  project?: Project;
  members: TeamMember[];
  onDeleteMeeting: (meetingId: string) => void;
  onReanalyze: (meetingId: string) => Promise<void>;
  onConvertActionItem: (meetingId: string, actionItemId: string) => void;
  onViewCreatedTask: (taskId: string) => void;
  onNavigateToProject?: (projectId: string) => void;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  isOpen,
  onClose,
  meeting,
  project,
  members,
  onDeleteMeeting,
  onReanalyze,
  onConvertActionItem,
  onViewCreatedTask,
  onNavigateToProject
}) => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'synthesis' | 'raw'>('synthesis');
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  if (!isOpen || !meeting) return null;

  const summary = meeting.summary;
  const attendees = members.filter((m) => meeting.attendeeIds?.includes(m.id));

  const handleExportMarkdown = () => {
    let md = `# Meeting: ${meeting.title}\n`;
    md += `**Date**: ${meeting.date} | **Duration**: ${meeting.durationMinutes} minutes\n`;
    if (project) md += `**Project**: [${project.key}] ${project.name}\n`;
    md += `**Attendees**: ${attendees.map((a) => a.name).join(', ')}\n\n`;

    if (summary) {
      md += `## Executive Summary\n${summary.overview}\n\n`;

      md += `## Key Discussion Points\n`;
      summary.keyPoints.forEach((kp) => {
        md += `- ${kp}\n`;
      });
      md += `\n`;

      md += `## Decisions Made\n`;
      summary.decisions.forEach((d) => {
        md += `- **${d.text}**`;
        if (d.rationale) md += ` *(Rationale: ${d.rationale})*`;
        md += `\n`;
      });
      md += `\n`;

      md += `## Action Items & Suggested Tasks\n`;
      summary.actionItems.forEach((act) => {
        md += `- [ ] **${act.text}** (Priority: ${act.suggestedPriority}, Due: ${act.suggestedDueDate})\n`;
      });
      md += `\n`;
    }

    md += `## Raw Notes\n\`\`\`\n${meeting.rawNotes}\n\`\`\`\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meeting.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-notes.md`;
    link.click();
    URL.revokeObjectURL(url);
    success('Meeting notes exported to Markdown');
  };

  const handleRunReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      await onReanalyze(meeting.id);
      success('Meeting notes re-analyzed with updated AI synthesis');
    } catch (e) {
      console.error(e);
    } finally {
      setIsReanalyzing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meeting.title}
      maxWidth="xl"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteMeeting(meeting.id)}
          >
            <Trash2 size={14} />
            <span>Delete Notes</span>
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportMarkdown}
            >
              <Download size={14} />
              <span>Export .MD</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleRunReanalyze}
              disabled={isReanalyzing}
            >
              <RotateCcw size={14} className={isReanalyzing ? 'animate-spin' : ''} />
              <span>Re-analyze</span>
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      }
    >
      <div>
        {/* Top Info Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>
              <Calendar size={13} />
              <span>{meeting.date}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>
              <Clock size={13} />
              <span>{meeting.durationMinutes} minutes</span>
            </div>

            {project && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ padding: '2px 6px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}
                onClick={() => {
                  onClose();
                  onNavigateToProject?.(project.id);
                }}
              >
                <FolderKanban size={13} />
                <span>[{project.key}] {project.name}</span>
              </button>
            )}
          </div>

          {/* Attendees list */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {attendees.map((a) => (
              <Avatar key={a.id} name={a.name} color={a.avatarColor} size="xs" showTooltip />
            ))}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'synthesis' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('synthesis')}
          >
            <BrainCircuit size={14} />
            <span>AI Structured Synthesis</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'raw' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('raw')}
          >
            <FileText size={14} />
            <span>Raw Notes / Transcript</span>
          </button>
        </div>

        {/* Tab 1: AI Synthesis */}
        {activeTab === 'synthesis' && summary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Executive Overview */}
            <div
              className="card"
              style={{
                background: 'var(--accent-gradient-subtle)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: 'var(--space-4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <BrainCircuit size={16} color="var(--accent-primary)" />
                <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-primary)', margin: 0 }}>
                  Executive Synthesis
                </h4>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                {summary.overview}
              </p>
            </div>

            {/* Key Discussion Points */}
            {summary.keyPoints && summary.keyPoints.length > 0 && (
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  Key Discussion Topics
                </h4>
                <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {summary.keyPoints.map((point, idx) => (
                    <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Decisions Made */}
            {summary.decisions && summary.decisions.length > 0 && (
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  Decisions Agreed ({summary.decisions.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {summary.decisions.map((dec) => {
                    const owner = members.find((m) => m.id === dec.ownerId);
                    return (
                      <div
                        key={dec.id}
                        className="card"
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          background: 'var(--bg-card-subtle)',
                          borderLeft: '3px solid var(--accent-primary)'
                        }}
                      >
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-main)' }}>
                          {dec.text}
                        </div>
                        {dec.rationale && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dim)', marginTop: '4px' }}>
                            <em>Rationale:</em> {dec.rationale}
                          </div>
                        )}
                        {owner && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                            <Avatar name={owner.name} color={owner.avatarColor} size="xs" />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Owner: <strong>{owner.name}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Items & Task Suggestions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, margin: 0 }}>
                  Action Items & Suggested Tasks ({summary.actionItems.length})
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Click "Convert to Task" to generate live system deliverables
                </span>
              </div>

              <SuggestedTasksList
                actionItems={summary.actionItems}
                members={members}
                project={project}
                onConvert={(actionItemId) => onConvertActionItem(meeting.id, actionItemId)}
                onViewTask={onViewCreatedTask}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Raw Notes View */}
        {activeTab === 'raw' && (
          <div
            className="card"
            style={{
              padding: 'var(--space-4)',
              background: 'var(--bg-card-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              color: 'var(--text-muted)'
            }}
          >
            {meeting.rawNotes}
          </div>
        )}
      </div>
    </Modal>
  );
};
