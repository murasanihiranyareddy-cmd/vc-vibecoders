import React, { useState, useEffect } from 'react';
import { TeamMemory, MemoryCategory, Project, TeamMember } from '../../types';
import { Modal } from '../common/Modal';
import { useToast } from '../../hooks/useToast';
import { Plus, X, Loader2, Code2 } from 'lucide-react';

interface MemoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TeamMemory, 'id' | 'createdAt' | 'updatedAt'>, isEdit: boolean, id?: string) => void;
  memoryToEdit?: TeamMemory | null;
  projects: Project[];
  members: TeamMember[];
}

export const MemoryFormModal: React.FC<MemoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  memoryToEdit,
  projects,
  members
}) => {
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('architecture');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [hasCodeSnippet, setHasCodeSnippet] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeContent, setCodeContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memoryToEdit) {
      setTitle(memoryToEdit.title);
      setCategory(memoryToEdit.category);
      setContent(memoryToEdit.content);
      setProjectId(memoryToEdit.projectId || '');
      setAuthorId(memoryToEdit.authorId);
      setIsPinned(memoryToEdit.isPinned);
      setTags(memoryToEdit.tags || []);
      if (memoryToEdit.codeSnippet) {
        setHasCodeSnippet(true);
        setCodeLanguage(memoryToEdit.codeSnippet.language);
        setCodeContent(memoryToEdit.codeSnippet.code);
      } else {
        setHasCodeSnippet(false);
        setCodeLanguage('typescript');
        setCodeContent('');
      }
    } else {
      setTitle('');
      setCategory('architecture');
      setContent('');
      setProjectId('');
      setAuthorId(members[0]?.id || 'mem-1');
      setIsPinned(false);
      setTags(['Standard']);
      setHasCodeSnippet(false);
      setCodeLanguage('typescript');
      setCodeContent('');
    }
  }, [memoryToEdit, isOpen, members]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim();
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Title is required');
      return;
    }
    if (!content.trim()) {
      error('Content is required');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(
        {
          title: title.trim(),
          category,
          content: content.trim(),
          projectId: projectId || undefined,
          authorId: authorId || members[0]?.id || 'mem-1',
          isPinned,
          tags,
          codeSnippet: hasCodeSnippet && codeContent.trim()
            ? { language: codeLanguage, code: codeContent.trim() }
            : undefined
        },
        Boolean(memoryToEdit),
        memoryToEdit?.id
      );

      success(memoryToEdit ? 'Team memory updated' : 'Saved to team memory');
      onClose();
    } catch (err) {
      console.error(err);
      error('Failed to save memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={memoryToEdit ? 'Edit Team Memory' : 'Save New Team Memory'}
      description="Record architectural decisions, SOP standard operating procedures, guidelines, or code snippets."
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
            ) : memoryToEdit ? (
              'Save Changes'
            ) : (
              'Save Memory'
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="input-group">
          <label className="input-label">Title / Decision Topic *</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. CRDT Multiplayer Protocol & State Synchronization SOP"
            required
            autoFocus
          />
        </div>

        {/* Category & Project & Author */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              className="select-field"
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryCategory)}
            >
              <option value="architecture">Architecture</option>
              <option value="sop">SOP / Playbook</option>
              <option value="decision">Decision Record</option>
              <option value="snippet">Code Snippet</option>
              <option value="guideline">Guideline</option>
              <option value="playbook">Incident Playbook</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Linked Project</label>
            <select
              className="select-field"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Global / No Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Author</label>
            <select
              className="select-field"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="input-group">
          <label className="input-label">Knowledge Content / Documentation *</label>
          <textarea
            className="textarea-field"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain guidelines, architectural rules, step-by-step procedure, or rationale..."
            rows={5}
            required
          />
        </div>

        {/* Code Snippet Toggle & Fields */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={hasCodeSnippet}
              onChange={(e) => setHasCodeSnippet(e.target.checked)}
            />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={16} color="var(--accent-primary)" />
              Include Code Snippet / Reference Implementation
            </span>
          </label>

          {hasCodeSnippet && (
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ width: '160px' }}>
                <select
                  className="select-field"
                  style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.6rem' }}
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                >
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash / Shell</option>
                  <option value="json">JSON</option>
                  <option value="css">CSS</option>
                </select>
              </div>

              <textarea
                className="textarea-field"
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="// Enter code snippet here..."
                rows={4}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
            </div>
          )}
        </div>

        {/* Pin to Top & Tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-main)', fontWeight: 500 }}>
              Pin to top of knowledge base
            </span>
          </label>

          {/* Tags input */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              className="input-field"
              style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.65rem', width: '160px' }}
              placeholder="Add tag..."
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
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Tags display */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-3)' }}>
            {tags.map((t) => (
              <span
                key={t}
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
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0
                  }}
                  aria-label={`Remove tag ${t}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </form>
    </Modal>
  );
};
