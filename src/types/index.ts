export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planning' | 'in_progress' | 'in_review' | 'completed' | 'on_hold';
export type MemberStatus = 'active' | 'in_meeting' | 'away' | 'offline';
export type MemoryCategory = 'architecture' | 'sop' | 'decision' | 'snippet' | 'guideline' | 'playbook';
export type ThemeMode = 'slate' | 'ocean' | 'midnight' | 'emerald' | 'light';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: 'Engineering' | 'Design' | 'Product' | 'Marketing' | 'Operations';
  avatar: string;
  avatarColor: string;
  status: MemberStatus;
  skills: string[];
  bio?: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  leadId: string;
  memberIds: string[];
  category: string;
  progress: number; // 0-100
  startDate: string;
  dueDate: string;
  budgetHours?: number;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DecisionItem {
  id: string;
  text: string;
  rationale?: string;
  ownerId?: string;
}

export interface ActionItemSuggestion {
  id: string;
  text: string;
  suggestedAssigneeId?: string;
  suggestedPriority: Priority;
  suggestedDueDate: string;
  convertedToTaskId?: string;
}

export interface MeetingSummary {
  overview: string;
  keyPoints: string[];
  decisions: DecisionItem[];
  actionItems: ActionItemSuggestion[];
  sentiment?: 'positive' | 'neutral' | 'constructive';
  tags: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  projectId?: string;
  attendeeIds: string[];
  rawNotes: string;
  status: 'draft' | 'analyzed';
  summary?: MeetingSummary;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemory {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  tags: string[];
  projectId?: string;
  authorId: string;
  isPinned: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_updated' | 'project_created' | 'project_updated' | 'meeting_analyzed' | 'memory_saved' | 'member_added';
  actorId: string;
  entityId: string;
  entityType: 'project' | 'task' | 'meeting' | 'memory' | 'member';
  entityTitle: string;
  description: string;
  timestamp: string;
}

export interface AppSettings {
  theme: ThemeMode;
  density: 'comfortable' | 'compact';
  soundEffects: boolean;
  enableLocalAI: boolean;
  apiKey?: string;
  aiProvider: 'local' | 'gemini' | 'openai';
  userName: string;
  userEmail: string;
  activeMemberId: string;
}

export type ActiveView = 
  | 'dashboard'
  | 'projects'
  | 'project_detail'
  | 'tasks'
  | 'meetings'
  | 'meeting_detail'
  | 'memory'
  | 'team'
  | 'settings';
