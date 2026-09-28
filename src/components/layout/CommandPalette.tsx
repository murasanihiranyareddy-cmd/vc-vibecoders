import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import {
  Search,
  CheckSquare,
  FolderKanban,
  BrainCircuit,
  BookMarked,
  Users,
  Moon,
  Sun,
  RotateCcw,
  Settings,
  ArrowRight,
  Plus
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';

interface CommandPaletteProps {
  onOpenProjectModal: () => void;
  onOpenTaskModal: () => void;
  onOpenMeetingModal: () => void;
  onOpenMemoryModal: () => void;
}

interface SearchResultItem {
  id: string;
  type: 'project' | 'task' | 'meeting' | 'memory' | 'member' | 'action';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onOpenProjectModal,
  onOpenTaskModal,
  onOpenMeetingModal,
  onOpenMemoryModal
}) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    projects,
    tasks,
    meetings,
    memories,
    members,
    setActiveView,
    setSelectedProjectId,
    setSelectedMeetingId,
    setSelectedMemberId,
    setSelectedTaskId,
    setSelectedMemoryId,
    settings,
    updateSettings,
    resetToDemo
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.toLowerCase().trim();
    const list: SearchResultItem[] = [];

    // System Actions (Always or when query matches)
    const systemActions: SearchResultItem[] = [
      {
        id: 'cmd-new-task',
        type: 'action',
        title: 'Create New Task',
        subtitle: 'Add a new actionable item to your board or project',
        icon: <Plus size={16} color="#38bdf8" />,
        onSelect: () => {
          setIsCommandPaletteOpen(false);
          onOpenTaskModal();
        }
      },
      {
        id: 'cmd-new-proj',
        type: 'action',
        title: 'Create New Project',
        subtitle: 'Start a new strategic initiative with goals and milestones',
        icon: <Plus size={16} color="#6366f1" />,
        onSelect: () => {
          setIsCommandPaletteOpen(false);
          onOpenProjectModal();
        }
      },
      {
        id: 'cmd-ai-meeting',
        type: 'action',
        title: 'Analyze Meeting Notes with AI',
        subtitle: 'Paste raw notes to extract summary, decisions, and action items',
        icon: <BrainCircuit size={16} color="#ec4899" />,
        onSelect: () => {
          setIsCommandPaletteOpen(false);
          onOpenMeetingModal();
        }
      },
      {
        id: 'cmd-save-memory',
        type: 'action',
        title: 'Save New Team Memory',
        subtitle: 'Add documentation, playbook, or architectural snippet',
        icon: <BookMarked size={16} color="#10b981" />,
        onSelect: () => {
          setIsCommandPaletteOpen(false);
          onOpenMemoryModal();
        }
      },
      {
        id: 'cmd-theme',
        type: 'action',
        title: `Toggle Theme (${settings.theme === 'light' ? 'Switch to Dark' : 'Switch to Light'})`,
        subtitle: 'Change interface color theme',
        icon: settings.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />,
        onSelect: () => {
          updateSettings({ theme: settings.theme === 'light' ? 'slate' : 'light' });
          setIsCommandPaletteOpen(false);
        }
      },
      {
        id: 'cmd-settings',
        type: 'action',
        title: 'Go to Workspace Settings',
        subtitle: 'Manage local data, export JSON, themes, and AI configurations',
        icon: <Settings size={16} color="#94a3b8" />,
        onSelect: () => {
          setActiveView('settings');
          setIsCommandPaletteOpen(false);
        }
      },
      {
        id: 'cmd-reset-demo',
        type: 'action',
        title: 'Reset to Sample Demo Data',
        subtitle: 'Restore initial projects, tasks, and meeting notes',
        icon: <RotateCcw size={16} color="#f59e0b" />,
        onSelect: () => {
          resetToDemo();
          setActiveView('dashboard');
          setIsCommandPaletteOpen(false);
        }
      }
    ];

    if (!q) {
      return systemActions;
    }

    // Filter System Actions
    systemActions.forEach((act) => {
      if (act.title.toLowerCase().includes(q) || act.subtitle.toLowerCase().includes(q)) {
        list.push(act);
      }
    });

    // Search Projects
    projects.forEach((proj) => {
      if (
        proj.name.toLowerCase().includes(q) ||
        proj.key.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.category.toLowerCase().includes(q)
      ) {
        list.push({
          id: `proj-${proj.id}`,
          type: 'project',
          title: `[${proj.key}] ${proj.name}`,
          subtitle: `${proj.category} &bull; ${proj.description.slice(0, 60)}...`,
          icon: <FolderKanban size={16} color={proj.color || '#6366f1'} />,
          badge: <StatusBadge status={proj.status} />,
          onSelect: () => {
            setSelectedProjectId(proj.id);
            setActiveView('project_detail');
            setIsCommandPaletteOpen(false);
          }
        });
      }
    });

    // Search Tasks
    tasks.forEach((task) => {
      if (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        const parentProject = projects.find((p) => p.id === task.projectId);
        list.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.title,
          subtitle: `${parentProject ? `[${parentProject.key}] ` : ''}${task.description.slice(0, 60)}`,
          icon: <CheckSquare size={16} color={task.status === 'done' ? '#10b981' : '#38bdf8'} />,
          badge: (
            <div style={{ display: 'flex', gap: '4px' }}>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          ),
          onSelect: () => {
            setSelectedTaskId(task.id);
            setActiveView('tasks');
            setIsCommandPaletteOpen(false);
          }
        });
      }
    });

    // Search Meetings
    meetings.forEach((meet) => {
      if (
        meet.title.toLowerCase().includes(q) ||
        meet.rawNotes.toLowerCase().includes(q) ||
        meet.summary?.overview.toLowerCase().includes(q) ||
        meet.summary?.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        list.push({
          id: `meet-${meet.id}`,
          type: 'meeting',
          title: meet.title,
          subtitle: `${meet.date} &bull; ${meet.summary ? `${meet.summary.actionItems.length} action items` : 'Draft'}`,
          icon: <BrainCircuit size={16} color="#ec4899" />,
          onSelect: () => {
            setSelectedMeetingId(meet.id);
            setActiveView('meetings');
            setIsCommandPaletteOpen(false);
          }
        });
      }
    });

    // Search Memories
    memories.forEach((mem) => {
      if (
        mem.title.toLowerCase().includes(q) ||
        mem.content.toLowerCase().includes(q) ||
        mem.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        list.push({
          id: `mem-${mem.id}`,
          type: 'memory',
          title: mem.title,
          subtitle: `${mem.category.toUpperCase()} &bull; ${mem.content.slice(0, 60)}...`,
          icon: <BookMarked size={16} color="#10b981" />,
          onSelect: () => {
            setSelectedMemoryId(mem.id);
            setActiveView('memory');
            setIsCommandPaletteOpen(false);
          }
        });
      }
    });

    // Search Members
    members.forEach((mem) => {
      if (
        mem.name.toLowerCase().includes(q) ||
        mem.role.toLowerCase().includes(q) ||
        mem.department.toLowerCase().includes(q) ||
        mem.skills.some((s) => s.toLowerCase().includes(q))
      ) {
        list.push({
          id: `member-${mem.id}`,
          type: 'member',
          title: mem.name,
          subtitle: `${mem.role} &bull; ${mem.department}`,
          icon: <Users size={16} color={mem.avatarColor} />,
          onSelect: () => {
            setSelectedMemberId(mem.id);
            setActiveView('team');
            setIsCommandPaletteOpen(false);
          }
        });
      }
    });

    return list;
  }, [
    query,
    projects,
    tasks,
    meetings,
    memories,
    members,
    settings,
    updateSettings,
    resetToDemo,
    setActiveView,
    setSelectedProjectId,
    setSelectedMeetingId,
    setSelectedMemberId,
    setSelectedTaskId,
    setSelectedMemoryId,
    setIsCommandPaletteOpen,
    onOpenProjectModal,
    onOpenTaskModal,
    onOpenMeetingModal,
    onOpenMemoryModal
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsCommandPaletteOpen(false)}
      style={{ alignItems: 'flex-start', paddingTop: '10vh' }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-glass-modal)',
          backdropFilter: 'blur(28px)',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={20} color="var(--accent-primary)" />
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            placeholder="Search projects, tasks, meetings, memories, or type an action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 'var(--text-base)',
              padding: '4px 0',
              boxShadow: 'none'
            }}
          />
          <kbd className="header-kbd">ESC</kbd>
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: 'var(--space-2)'
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-8) var(--space-4)',
                color: 'var(--text-dim)',
                fontSize: 'var(--text-sm)'
              }}
            >
              No matching items or commands found for "{query}".
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.onSelect()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'inline-flex', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-dim)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      dangerouslySetInnerHTML={{ __html: item.subtitle }}
                    />
                  </div>
                  {item.badge && <div style={{ flexShrink: 0 }}>{item.badge}</div>}
                  {isSelected && (
                    <ArrowRight size={14} color="#818cf8" style={{ flexShrink: 0 }} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Tips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-3) var(--space-5)',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-dim)'
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span>
              <kbd className="header-kbd">↑</kbd> <kbd className="header-kbd">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="header-kbd">↵</kbd> to select
            </span>
          </div>
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};
