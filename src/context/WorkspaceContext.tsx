import React, { createContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import {
  Project,
  Task,
  Meeting,
  TeamMemory,
  TeamMember,
  ActivityLog,
  AppSettings,
  ActiveView,
  TaskStatus,
  MeetingSummary
} from '../types';
import { StorageService, WorkspaceExportData } from '../services/storage';
import { analyzeMeetingNotes } from '../services/aiEngine';

export interface WorkspaceContextValue {
  // Data state
  members: TeamMember[];
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  memories: TeamMemory[];
  activities: ActivityLog[];
  settings: AppSettings;
  isLoading: boolean;

  // Navigation & modals
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedMemoryId: string | null;
  setSelectedMemoryId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Project actions
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  getProjectProgress: (projectId: string) => number;

  // Task actions
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string, targetStatus?: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  batchUpdateTaskStatus: (taskIds: string[], status: TaskStatus) => void;
  batchDeleteTasks: (taskIds: string[]) => void;

  // Meeting actions
  createMeeting: (data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => Meeting;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  processMeetingWithAI: (meetingId: string) => Promise<MeetingSummary>;
  convertActionItemToTask: (meetingId: string, actionItemId: string, targetProjectId?: string) => Task | null;

  // Memory actions
  createMemory: (data: Omit<TeamMemory, 'id' | 'createdAt' | 'updatedAt'>) => TeamMemory;
  updateMemory: (id: string, updates: Partial<TeamMemory>) => void;
  deleteMemory: (id: string) => void;
  togglePinMemory: (id: string) => void;

  // Member actions
  createMember: (data: Omit<TeamMember, 'id' | 'joinedAt'>) => TeamMember;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;

  // Settings & System actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetToDemo: () => void;
  clearAll: () => void;
  exportData: () => WorkspaceExportData;
  importData: (data: Partial<WorkspaceExportData>) => boolean;
  addActivity: (data: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [memories, setMemories] = useState<TeamMemory[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.loadSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Initial load from storage
  useEffect(() => {
    try {
      const loadedMembers = StorageService.loadMembers();
      const loadedProjects = StorageService.loadProjects();
      const loadedTasks = StorageService.loadTasks();
      const loadedMeetings = StorageService.loadMeetings();
      const loadedMemories = StorageService.loadMemories();
      const loadedActivities = StorageService.loadActivities();
      const loadedSettings = StorageService.loadSettings();

      setMembers(loadedMembers);
      setProjects(loadedProjects);
      setTasks(loadedTasks);
      setMeetings(loadedMeetings);
      setMemories(loadedMemories);
      setActivities(loadedActivities);
      setSettings(loadedSettings);
    } catch (err) {
      console.error('Failed to initialize workspace state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync theme changes with document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-density', settings.density);
  }, [settings.theme, settings.density]);

  // Activity logger helper
  const addActivity = useCallback((data: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...data,
      id: `act-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => {
      const next = [newLog, ...prev].slice(0, 50);
      StorageService.saveActivities(next);
      return next;
    });
  }, []);

  // Compute project progress dynamically if tasks exist
  const getProjectProgress = useCallback((projectId: string): number => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) {
      const p = projects.find(pr => pr.id === projectId);
      return p?.progress ?? 0;
    }
    const doneTasks = projectTasks.filter(t => t.status === 'done').length;
    return Math.round((doneTasks / projectTasks.length) * 100);
  }, [tasks, projects]);

  // Project CRUD
  const createProject = useCallback((data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Project => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      progress: 0,
      createdAt: now,
      updatedAt: now
    };
    setProjects(prev => {
      const next = [newProject, ...prev];
      StorageService.saveProjects(next);
      return next;
    });
    addActivity({
      type: 'project_created',
      actorId: settings.activeMemberId || 'mem-1',
      entityId: newProject.id,
      entityType: 'project',
      entityTitle: newProject.name,
      description: `created project "${newProject.name}"`
    });
    return newProject;
  }, [settings.activeMemberId, addActivity]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
      StorageService.saveProjects(next);
      return next;
    });
    const target = projects.find(p => p.id === id);
    if (target) {
      addActivity({
        type: 'project_updated',
        actorId: settings.activeMemberId || 'mem-1',
        entityId: id,
        entityType: 'project',
        entityTitle: target.name,
        description: `updated project details`
      });
    }
  }, [projects, settings.activeMemberId, addActivity]);

  const deleteProject = useCallback((id: string) => {
    const target = projects.find(p => p.id === id);
    setProjects(prev => {
      const next = prev.filter(p => p.id !== id);
      StorageService.saveProjects(next);
      return next;
    });
    // Also remove or unlink associated tasks
    setTasks(prev => {
      const next = prev.filter(t => t.projectId !== id);
      StorageService.saveTasks(next);
      return next;
    });
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
      if (activeView === 'project_detail') {
        setActiveView('projects');
      }
    }
  }, [projects, selectedProjectId, activeView]);

  const getProject = useCallback((id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  // Task CRUD
  const createTask = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      completedAt: data.status === 'done' ? now : undefined
    };
    setTasks(prev => {
      const next = [newTask, ...prev];
      StorageService.saveTasks(next);
      return next;
    });
    addActivity({
      type: 'task_created',
      actorId: settings.activeMemberId || 'mem-1',
      entityId: newTask.id,
      entityType: 'task',
      entityTitle: newTask.title,
      description: `created task "${newTask.title}"`
    });
    return newTask;
  }, [settings.activeMemberId, addActivity]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const now = new Date().toISOString();
      const next = prev.map(t => {
        if (t.id !== id) return t;
        const willBeDone = updates.status === 'done' || (updates.status === undefined && t.status === 'done');
        return {
          ...t,
          ...updates,
          updatedAt: now,
          completedAt: willBeDone ? (t.completedAt || now) : undefined
        };
      });
      StorageService.saveTasks(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      StorageService.saveTasks(next);
      return next;
    });
    if (selectedTaskId === id) setSelectedTaskId(null);
  }, [selectedTaskId]);

  const toggleTaskStatus = useCallback((id: string, targetStatus?: TaskStatus) => {
    setTasks(prev => {
      const now = new Date().toISOString();
      const next = prev.map(t => {
        if (t.id !== id) return t;
        let newStatus: TaskStatus = targetStatus ?? (t.status === 'done' ? 'todo' : 'done');
        const isDone = newStatus === 'done';
        return {
          ...t,
          status: newStatus,
          updatedAt: now,
          completedAt: isDone ? now : undefined
        };
      });
      StorageService.saveTasks(next);
      return next;
    });

    const target = tasks.find(t => t.id === id);
    if (target) {
      const isDone = (targetStatus ?? (target.status === 'done' ? 'todo' : 'done')) === 'done';
      if (isDone) {
        addActivity({
          type: 'task_completed',
          actorId: settings.activeMemberId || 'mem-1',
          entityId: id,
          entityType: 'task',
          entityTitle: target.title,
          description: `marked task as completed`
        });
      }
    }
  }, [tasks, settings.activeMemberId, addActivity]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
        return { ...t, subtasks, updatedAt: new Date().toISOString() };
      });
      StorageService.saveTasks(next);
      return next;
    });
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: title.trim(),
      completed: false
    };
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: [...t.subtasks, newSubtask],
          updatedAt: new Date().toISOString()
        };
      });
      StorageService.saveTasks(next);
      return next;
    });
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.filter(st => st.id !== subtaskId),
          updatedAt: new Date().toISOString()
        };
      });
      StorageService.saveTasks(next);
      return next;
    });
  }, []);

  const batchUpdateTaskStatus = useCallback((taskIds: string[], status: TaskStatus) => {
    setTasks(prev => {
      const now = new Date().toISOString();
      const next = prev.map(t => {
        if (!taskIds.includes(t.id)) return t;
        return {
          ...t,
          status,
          updatedAt: now,
          completedAt: status === 'done' ? now : undefined
        };
      });
      StorageService.saveTasks(next);
      return next;
    });
  }, []);

  const batchDeleteTasks = useCallback((taskIds: string[]) => {
    setTasks(prev => {
      const next = prev.filter(t => !taskIds.includes(t.id));
      StorageService.saveTasks(next);
      return next;
    });
  }, []);

  // Meeting CRUD & AI processing
  const createMeeting = useCallback((data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Meeting => {
    const now = new Date().toISOString();
    const newMeeting: Meeting = {
      ...data,
      id: `meet-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setMeetings(prev => {
      const next = [newMeeting, ...prev];
      StorageService.saveMeetings(next);
      return next;
    });
    return newMeeting;
  }, []);

  const updateMeeting = useCallback((id: string, updates: Partial<Meeting>) => {
    setMeetings(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
      StorageService.saveMeetings(next);
      return next;
    });
  }, []);

  const deleteMeeting = useCallback((id: string) => {
    setMeetings(prev => {
      const next = prev.filter(m => m.id !== id);
      StorageService.saveMeetings(next);
      return next;
    });
    if (selectedMeetingId === id) setSelectedMeetingId(null);
  }, [selectedMeetingId]);

  const processMeetingWithAI = useCallback(async (meetingId: string): Promise<MeetingSummary> => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) throw new Error('Meeting not found');

    const summary = await analyzeMeetingNotes(
      meeting.rawNotes,
      members,
      meeting.title,
      undefined,
      'local'
    );

    const now = new Date().toISOString();
    setMeetings(prev => {
      const next = prev.map(m => m.id === meetingId ? {
        ...m,
        status: 'analyzed' as const,
        summary,
        updatedAt: now
      } : m);
      StorageService.saveMeetings(next);
      return next;
    });

    addActivity({
      type: 'meeting_analyzed',
      actorId: settings.activeMemberId || 'mem-1',
      entityId: meetingId,
      entityType: 'meeting',
      entityTitle: meeting.title,
      description: `analyzed meeting notes with AI (${summary.actionItems.length} tasks suggested, ${summary.decisions.length} decisions)`
    });

    return summary;
  }, [meetings, members, settings, addActivity]);

  const convertActionItemToTask = useCallback((
    meetingId: string,
    actionItemId: string,
    targetProjectId?: string
  ): Task | null => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting || !meeting.summary) return null;

    const actionItem = meeting.summary.actionItems.find(a => a.id === actionItemId);
    if (!actionItem) return null;

    // Use assigned project or meeting's project or first project
    const pId = targetProjectId || meeting.projectId || projects[0]?.id || 'proj-1';
    const assignee = actionItem.suggestedAssigneeId || members[0]?.id || 'mem-1';

    const newTask = createTask({
      title: actionItem.text,
      description: `Auto-generated from AI meeting notes: "${meeting.title}" on ${meeting.date}`,
      projectId: pId,
      assigneeId: assignee,
      priority: actionItem.suggestedPriority,
      status: 'todo',
      dueDate: actionItem.suggestedDueDate,
      tags: ['AI-Action-Item', ...(meeting.summary.tags || [])],
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Review meeting context & objectives', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute deliverable', completed: false }
      ]
    });

    // Mark action item as converted in meeting summary
    setMeetings(prev => {
      const next = prev.map(m => {
        if (m.id !== meetingId || !m.summary) return m;
        const updatedActionItems = m.summary.actionItems.map(a =>
          a.id === actionItemId ? { ...a, convertedToTaskId: newTask.id } : a
        );
        return {
          ...m,
          summary: { ...m.summary, actionItems: updatedActionItems },
          updatedAt: new Date().toISOString()
        };
      });
      StorageService.saveMeetings(next);
      return next;
    });

    return newTask;
  }, [meetings, projects, members, createTask]);

  // Memory CRUD
  const createMemory = useCallback((data: Omit<TeamMemory, 'id' | 'createdAt' | 'updatedAt'>): TeamMemory => {
    const now = new Date().toISOString();
    const newMemory: TeamMemory = {
      ...data,
      id: `mem-item-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setMemories(prev => {
      const next = [newMemory, ...prev];
      StorageService.saveMemories(next);
      return next;
    });
    addActivity({
      type: 'memory_saved',
      actorId: settings.activeMemberId || 'mem-1',
      entityId: newMemory.id,
      entityType: 'memory',
      entityTitle: newMemory.title,
      description: `saved note to Team Memory in "${newMemory.category}"`
    });
    return newMemory;
  }, [settings.activeMemberId, addActivity]);

  const updateMemory = useCallback((id: string, updates: Partial<TeamMemory>) => {
    setMemories(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
      StorageService.saveMemories(next);
      return next;
    });
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setMemories(prev => {
      const next = prev.filter(m => m.id !== id);
      StorageService.saveMemories(next);
      return next;
    });
    if (selectedMemoryId === id) setSelectedMemoryId(null);
  }, [selectedMemoryId]);

  const togglePinMemory = useCallback((id: string) => {
    setMemories(prev => {
      const next = prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned, updatedAt: new Date().toISOString() } : m);
      StorageService.saveMemories(next);
      return next;
    });
  }, []);

  // Team Members CRUD
  const createMember = useCallback((data: Omit<TeamMember, 'id' | 'joinedAt'>): TeamMember => {
    const newMember: TeamMember = {
      ...data,
      id: `mem-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setMembers(prev => {
      const next = [...prev, newMember];
      StorageService.saveMembers(next);
      return next;
    });
    addActivity({
      type: 'member_added',
      actorId: settings.activeMemberId || 'mem-1',
      entityId: newMember.id,
      entityType: 'member',
      entityTitle: newMember.name,
      description: `added new team member "${newMember.name}" (${newMember.role})`
    });
    return newMember;
  }, [settings.activeMemberId, addActivity]);

  const updateMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setMembers(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updates } : m);
      StorageService.saveMembers(next);
      return next;
    });
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers(prev => {
      const next = prev.filter(m => m.id !== id);
      StorageService.saveMembers(next);
      return next;
    });
    if (selectedMemberId === id) setSelectedMemberId(null);
  }, [selectedMemberId]);

  // Settings & System Data Management
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      StorageService.saveSettings(next);
      return next;
    });
  }, []);

  const resetToDemo = useCallback(() => {
    const demoData = StorageService.resetToDemoData();
    setMembers(demoData.members);
    setProjects(demoData.projects);
    setTasks(demoData.tasks);
    setMeetings(demoData.meetings);
    setMemories(demoData.memories);
    setActivities(demoData.activities);
    setSettings(demoData.settings);
    setSelectedProjectId(null);
    setSelectedMeetingId(null);
    setSelectedMemberId(null);
    setSelectedTaskId(null);
    setSelectedMemoryId(null);
  }, []);

  const clearAll = useCallback(() => {
    StorageService.clearAllData();
    setMembers([]);
    setProjects([]);
    setTasks([]);
    setMeetings([]);
    setMemories([]);
    setActivities([]);
    setSelectedProjectId(null);
    setSelectedMeetingId(null);
    setSelectedMemberId(null);
    setSelectedTaskId(null);
    setSelectedMemoryId(null);
  }, []);

  const exportData = useCallback((): WorkspaceExportData => {
    return StorageService.exportAllData();
  }, []);

  const importData = useCallback((data: Partial<WorkspaceExportData>): boolean => {
    const ok = StorageService.importAllData(data);
    if (ok) {
      if (data.members) setMembers(data.members);
      if (data.projects) setProjects(data.projects);
      if (data.tasks) setTasks(data.tasks);
      if (data.meetings) setMeetings(data.meetings);
      if (data.memories) setMemories(data.memories);
      if (data.activities) setActivities(data.activities);
      if (data.settings) setSettings(data.settings);
    }
    return ok;
  }, []);

  const value = useMemo<WorkspaceContextValue>(() => ({
    members,
    projects,
    tasks,
    meetings,
    memories,
    activities,
    settings,
    isLoading,
    activeView,
    setActiveView,
    selectedProjectId,
    setSelectedProjectId,
    selectedMeetingId,
    setSelectedMeetingId,
    selectedMemberId,
    setSelectedMemberId,
    selectedTaskId,
    setSelectedTaskId,
    selectedMemoryId,
    setSelectedMemoryId,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    isMobileNavOpen,
    setIsMobileNavOpen,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getProjectProgress,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    batchUpdateTaskStatus,
    batchDeleteTasks,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    processMeetingWithAI,
    convertActionItemToTask,
    createMemory,
    updateMemory,
    deleteMemory,
    togglePinMemory,
    createMember,
    updateMember,
    deleteMember,
    updateSettings,
    resetToDemo,
    clearAll,
    exportData,
    importData,
    addActivity
  }), [
    members,
    projects,
    tasks,
    meetings,
    memories,
    activities,
    settings,
    isLoading,
    activeView,
    selectedProjectId,
    selectedMeetingId,
    selectedMemberId,
    selectedTaskId,
    selectedMemoryId,
    isCommandPaletteOpen,
    globalSearchQuery,
    isMobileNavOpen,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getProjectProgress,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    batchUpdateTaskStatus,
    batchDeleteTasks,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    processMeetingWithAI,
    convertActionItemToTask,
    createMemory,
    updateMemory,
    deleteMemory,
    togglePinMemory,
    createMember,
    updateMember,
    deleteMember,
    updateSettings,
    resetToDemo,
    clearAll,
    exportData,
    importData,
    addActivity
  ]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
