import React, { useState, useEffect } from 'react';
import { Meeting, Project, TeamMember } from '../../types';
import { Modal } from '../common/Modal';
import { SAMPLE_MEETING_TEMPLATES } from '../../services/aiEngine';
import { useToast } from '../../hooks/useToast';
import { Sparkles, Loader2, FileText, Wand2 } from 'lucide-react';

interface MeetingAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>, shouldAnalyze: boolean) => Promise<void>;
  projects: Project[];
  members: TeamMember[];
  initialProjectId?: string;
}

export const MeetingAnalyzer: React.FC<MeetingAnalyzerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects,
  members,
  initialProjectId
}) => {
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);
  const [rawNotes, setRawNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('Engineering & Architecture Sync');
      setProjectId(initialProjectId || projects[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setDurationMinutes('30');
      setAttendeeIds(members.slice(0, 3).map((m) => m.id));
      setRawNotes('');
    }
  }, [isOpen, initialProjectId, projects, members]);

  const loadTemplate = (templateId: string) => {
    const tpl = SAMPLE_MEETING_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setTitle(tpl.title);
      setRawNotes(tpl.notes);
      success(`Loaded "${tpl.title}" template`);
    }
  };

  const toggleAttendee = (mId: string) => {
    setAttendeeIds((prev) =>
      prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId]
    );
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Please enter a meeting title');
      return;
    }
    if (!rawNotes.trim()) {
      error('Please paste or write meeting notes to analyze');
      return;
    }

    setIsProcessing(true);
    try {
      await onSubmit(
        {
          title: title.trim(),
          date: date || new Date().toISOString().split('T')[0],
          durationMinutes: parseInt(durationMinutes, 10) || 30,
          projectId: projectId || undefined,
          attendeeIds: attendeeIds.length > 0 ? attendeeIds : [members[0]?.id || 'mem-1'],
          rawNotes: rawNotes.trim(),
          status: 'draft'
        },
        true // trigger immediate AI processing
      );
      success('Meeting notes synthesized by AI!');
      onClose();
    } catch (err) {
      console.error(err);
      error('Failed to process meeting notes');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isProcessing ? () => {} : onClose}
      title="AI Meeting Assistant & Synthesis"
      description="Paste meeting notes or transcripts to automatically extract summaries, decisions, and actionable tasks."
      maxWidth="xl"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunAnalysis}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>Synthesize & Extract Tasks</span>
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleRunAnalysis}>
        {/* Sample Templates Bar */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={13} color="#ec4899" />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Quick Templates (Click to test instantly)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SAMPLE_MEETING_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
                onClick={() => loadTemplate(tpl.id)}
              >
                <FileText size={13} color="var(--accent-primary)" />
                <span>{tpl.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meeting Title & Project */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Meeting Title *</label>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aura 2.0 Architecture Sync"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Linked Project</label>
            <select
              className="select-field"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">No Linked Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date, Duration, and Attendees */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Meeting Date</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Duration (Minutes)</label>
            <input
              type="number"
              className="input-field"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              min={5}
            />
          </div>
        </div>

        {/* Attendees Multi-select */}
        <div className="input-group">
          <label className="input-label">Attendees</label>
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
              const isSelected = attendeeIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleAttendee(m.id)}
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
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
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

        {/* Raw Notes Textarea */}
        <div className="input-group">
          <label className="input-label">Raw Meeting Notes or Transcript *</label>
          <textarea
            className="textarea-field"
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Paste discussion bullet points, action items (@Name to do X by Friday), decisions, and topics here..."
            rows={8}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.6 }}
            required
          />
        </div>
      </form>
    </Modal>
  );
};
