import React from 'react';
import { useWorkspace } from './hooks/useWorkspace';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { MeetingsView } from './components/meetings/MeetingsView';

const AppContent: React.FC = () => {
  const { activeView, setSelectedProjectId, setSelectedTaskId, setSelectedMeetingId } = useWorkspace();

  const renderView = () => {
    switch (activeView) {
      case 'projects':
      case 'project_detail':
        return (
          <ProjectsView
            onOpenCreateProject={() => {}}
            onOpenEditProject={() => {}}
            onOpenProjectDetails={(id) => setSelectedProjectId(id)}
          />
        );

      case 'tasks':
        return (
          <TasksView
            onOpenCreateTask={() => {}}
            onOpenEditTask={(task) => setSelectedTaskId(task.id)}
          />
        );

      case 'meetings':
      case 'meeting_detail':
        return (
          <MeetingsView
            onOpenCreateMeeting={() => {}}
          />
        );

      default:
        return (
          <div className="main-content">
            <h1>Welcome to VC Vibe Coders</h1>
            <p>Select Projects, Tasks, or AI Meetings from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header
          onOpenProjectModal={() => {}}
          onOpenTaskModal={() => {}}
          onOpenMeetingModal={() => {}}
          onOpenMemoryModal={() => {}}
        />
        <main>{renderView()}</main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AppContent;
