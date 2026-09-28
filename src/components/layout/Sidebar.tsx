import React, { useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { ActiveView } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BrainCircuit,
  BookMarked,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
  Cpu
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    projects,
    tasks,
    meetings,
    memories,
    members,
    setSelectedProjectId,
    setSelectedMeetingId,
    setSelectedMemberId
  } = useWorkspace();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;

  const navigateTo = (view: ActiveView) => {
    // Clear selection filters when clicking top-level nav
    if (view === 'projects') setSelectedProjectId(null);
    if (view === 'meetings') setSelectedMeetingId(null);
    if (view === 'team') setSelectedMemberId(null);
    setActiveView(view);
  };

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderKanban size={18} />,
      badge: activeProjectsCount
    },
    {
      id: 'tasks',
      label: 'Tasks & Kanban',
      icon: <CheckSquare size={18} />,
      badge: pendingTasksCount
    },
    {
      id: 'meetings',
      label: 'AI Meetings',
      icon: <BrainCircuit size={18} />,
      badge: meetings.length
    },
    {
      id: 'memory',
      label: 'Team Memory',
      icon: <BookMarked size={18} />,
      badge: memories.length
    },
    {
      id: 'team',
      label: 'Team Members',
      icon: <Users size={18} />,
      badge: members.length
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={18} />
    }
  ];

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div
          className="sidebar-logo-group"
          onClick={() => navigateTo('dashboard')}
          role="button"
          tabIndex={0}
        >
          <div className="sidebar-logo-icon">
            <Cpu size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <div className="sidebar-logo-text">
                NEXUS <span className="text-gradient">AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                Autonomous Platform
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ padding: '4px' }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav" aria-label="Main Navigation">
        {!isCollapsed && <div className="sidebar-section-title">Core Workspace</div>}

        {navItems.map((item) => {
          const isActive = activeView === item.id || 
            (item.id === 'projects' && activeView === 'project_detail') ||
            (item.id === 'meetings' && activeView === 'meeting_detail');

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      {!isCollapsed && (
        <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <div
            className="card"
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--accent-gradient-subtle)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={14} color="#818cf8" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8' }}>
                Local AI Engine
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
              Zero-latency offline NLP extractor active & ready.
            </p>
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Database size={14} color="var(--text-dim)" />
          {!isCollapsed && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Client Storage Sync
            </span>
          )}
        </div>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981'
          }}
          title="Storage healthy & synchronized"
        />
      </div>
    </aside>
  );
};
