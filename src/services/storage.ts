import {
  TeamMember,
  Project,
  Task,
  Meeting,
  TeamMemory,
  ActivityLog,
  AppSettings
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEETINGS,
  INITIAL_MEMORIES,
  INITIAL_ACTIVITIES,
  DEFAULT_SETTINGS
} from './seedData';

const STORAGE_KEYS = {
  MEMBERS: 'nexus_members_v1',
  PROJECTS: 'nexus_projects_v1',
  TASKS: 'nexus_tasks_v1',
  MEETINGS: 'nexus_meetings_v1',
  MEMORIES: 'nexus_memories_v1',
  ACTIVITIES: 'nexus_activities_v1',
  SETTINGS: 'nexus_settings_v1'
} as const;

export interface WorkspaceExportData {
  version: string;
  exportedAt: string;
  members: TeamMember[];
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  memories: TeamMemory[];
  activities: ActivityLog[];
  settings: AppSettings;
}

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

export const StorageService = {
  loadMembers: (): TeamMember[] => safeGetItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMembers: (data: TeamMember[]): void => safeSetItem(STORAGE_KEYS.MEMBERS, data),

  loadProjects: (): Project[] => safeGetItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (data: Project[]): void => safeSetItem(STORAGE_KEYS.PROJECTS, data),

  loadTasks: (): Task[] => safeGetItem(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (data: Task[]): void => safeSetItem(STORAGE_KEYS.TASKS, data),

  loadMeetings: (): Meeting[] => safeGetItem(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS),
  saveMeetings: (data: Meeting[]): void => safeSetItem(STORAGE_KEYS.MEETINGS, data),

  loadMemories: (): TeamMemory[] => safeGetItem(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES),
  saveMemories: (data: TeamMemory[]): void => safeSetItem(STORAGE_KEYS.MEMORIES, data),

  loadActivities: (): ActivityLog[] => safeGetItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (data: ActivityLog[]): void => safeSetItem(STORAGE_KEYS.ACTIVITIES, data),

  loadSettings: (): AppSettings => safeGetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (data: AppSettings): void => safeSetItem(STORAGE_KEYS.SETTINGS, data),

  resetToDemoData: (): WorkspaceExportData => {
    safeSetItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    safeSetItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    safeSetItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    safeSetItem(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    safeSetItem(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES);
    safeSetItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    safeSetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      members: INITIAL_MEMBERS,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      meetings: INITIAL_MEETINGS,
      memories: INITIAL_MEMORIES,
      activities: INITIAL_ACTIVITIES,
      settings: DEFAULT_SETTINGS
    };
  },

  clearAllData: (): void => {
    safeSetItem(STORAGE_KEYS.MEMBERS, []);
    safeSetItem(STORAGE_KEYS.PROJECTS, []);
    safeSetItem(STORAGE_KEYS.TASKS, []);
    safeSetItem(STORAGE_KEYS.MEETINGS, []);
    safeSetItem(STORAGE_KEYS.MEMORIES, []);
    safeSetItem(STORAGE_KEYS.ACTIVITIES, []);
  },

  exportAllData: (): WorkspaceExportData => {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      members: StorageService.loadMembers(),
      projects: StorageService.loadProjects(),
      tasks: StorageService.loadTasks(),
      meetings: StorageService.loadMeetings(),
      memories: StorageService.loadMemories(),
      activities: StorageService.loadActivities(),
      settings: StorageService.loadSettings()
    };
  },

  importAllData: (data: Partial<WorkspaceExportData>): boolean => {
    try {
      if (data.members && Array.isArray(data.members)) StorageService.saveMembers(data.members);
      if (data.projects && Array.isArray(data.projects)) StorageService.saveProjects(data.projects);
      if (data.tasks && Array.isArray(data.tasks)) StorageService.saveTasks(data.tasks);
      if (data.meetings && Array.isArray(data.meetings)) StorageService.saveMeetings(data.meetings);
      if (data.memories && Array.isArray(data.memories)) StorageService.saveMemories(data.memories);
      if (data.activities && Array.isArray(data.activities)) StorageService.saveActivities(data.activities);
      if (data.settings && typeof data.settings === 'object') StorageService.saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      return true;
    } catch (e) {
      console.error('Failed to import workspace data:', e);
      return false;
    }
  },

  getStorageStats: () => {
    let totalBytes = 0;
    for (const key of Object.values(STORAGE_KEYS)) {
      const val = localStorage.getItem(key);
      if (val) totalBytes += val.length * 2; // UTF-16 approx
    }
    const kb = (totalBytes / 1024).toFixed(1);
    return {
      totalBytes,
      formatted: `${kb} KB`,
      isLocalStorageAvailable: typeof window !== 'undefined' && !!window.localStorage
    };
  }
};
