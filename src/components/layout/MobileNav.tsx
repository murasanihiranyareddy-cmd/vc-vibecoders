import React from 'react';
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
  X,
  Cpu
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    activeView,
    setActiveView,
    projects,
    tasks,
    meetings,
    memories,
    members
  } = useWorkspace();

  if (!isMobileNavOpen) return null;

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    setIsMobileNavOpen(false);
  };

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={18} />, badge: projects.length },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, badge: tasks.filter(t => t.status !== 'done').length },
    { id: 'meetings', label: 'AI Meetings', icon: <BrainCircuit size={18} />, badge: meetings.length },
    { id: 'memory', label: 'Team Memory', icon: <BookMarked size={18} />, badge: memories.length },
    { id: 'team', label: 'Team Members', icon: <Users size={18} />, badge: members.length },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex'
      }}
      onClick={() => setIsMobileNavOpen(false)}
    >
      <div
        style={{
          width: '280px',
          height: '100%',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-4)',
          animation: 'slideUpFade 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="sidebar-logo-icon">
              <Cpu size={20} />
            </div>
            <div>
              <div className="sidebar-logo-text">NEXUS AI</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Mobile Workspace</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigateTo(item.id)}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
