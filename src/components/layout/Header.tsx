import React, { useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Search, Plus, Menu, Moon, Sun, Sparkles, FolderPlus, CheckSquare, Brain, FileText, ChevronDown } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface HeaderProps {
  onOpenProjectModal: () => void;
  onOpenTaskModal: () => void;
  onOpenMeetingModal: () => void;
  onOpenMemoryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProjectModal,
  onOpenTaskModal,
  onOpenMeetingModal,
  onOpenMemoryModal
}) => {
  const {
    activeView,
    setIsCommandPaletteOpen,
    setIsMobileNavOpen,
    settings,
    updateSettings,
    members
  } = useWorkspace();

  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const activeUser = members.find(m => m.id === settings.activeMemberId) || members[0] || {
    name: 'Sarah Chen',
    role: 'Lead Architect',
    avatarColor: '#6366f1',
    status: 'active' as const
  };

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Workspace Dashboard';
      case 'projects': return 'Projects & Initiatives';
      case 'project_detail': return 'Project Details';
      case 'tasks': return 'Tasks & Kanban Engine';
      case 'meetings': return 'AI Meeting Intelligence';
      case 'meeting_detail': return 'Meeting Synthesis';
      case 'memory': return 'Team Memory & Knowledge';
      case 'team': return 'Team Directory';
      case 'settings': return 'Workspace Settings';
      default: return 'Nexus AI';
    }
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'slate' : 'light';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="btn btn-ghost btn-icon lg:hidden"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, letterSpacing: '-0.015em' }}>
            {getTitle()}
          </h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500 }}>
            Nexus Enterprise AI &bull; Active Workspace
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Global Search / Command Bar Trigger */}
        <button
          type="button"
          className="header-search-btn"
          onClick={() => setIsCommandPaletteOpen(true)}
          aria-label="Search and run commands"
        >
          <Search size={15} />
          <span>Search or jump to...</span>
          <kbd className="header-kbd">⌘K</kbd>
        </button>

        {/* Theme Quick Toggle */}
        <button
          type="button"
          className="btn btn-outline btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${settings.theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle theme mode"
        >
          {settings.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Quick Action Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
            aria-expanded={isQuickMenuOpen}
            aria-haspopup="true"
          >
            <Plus size={16} />
            <span>Create</span>
            <ChevronDown size={14} />
          </button>

          {isQuickMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 45 }}
                onClick={() => setIsQuickMenuOpen(false)}
              />
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '210px',
                  padding: '6px',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-xl)',
                  animation: 'slideUpFade 0.15s ease-out'
                }}
              >
                <button
                  type="button"
                  className="sidebar-nav-item"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    onOpenTaskModal();
                  }}
                >
                  <CheckSquare size={16} color="#38bdf8" />
                  <span>New Task</span>
                </button>
                <button
                  type="button"
                  className="sidebar-nav-item"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    onOpenProjectModal();
                  }}
                >
                  <FolderPlus size={16} color="#6366f1" />
                  <span>New Project</span>
                </button>
                <button
                  type="button"
                  className="sidebar-nav-item"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    onOpenMeetingModal();
                  }}
                >
                  <Brain size={16} color="#ec4899" />
                  <span>AI Meeting Notes</span>
                </button>
                <button
                  type="button"
                  className="sidebar-nav-item"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    onOpenMemoryModal();
                  }}
                >
                  <FileText size={16} color="#10b981" />
                  <span>Save Team Memory</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Profile Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            paddingLeft: 'var(--space-3)',
            borderLeft: '1px solid var(--border-subtle)'
          }}
        >
          <Avatar
            name={activeUser.name}
            color={activeUser.avatarColor}
            status={activeUser.status}
            size="sm"
            showTooltip
          />
        </div>
      </div>
    </header>
  );
};
