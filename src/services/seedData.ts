import { TeamMember, Project, Task, Meeting, TeamMemory, ActivityLog, AppSettings } from '../types';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@nexusai.io',
    role: 'Principal AI Architect',
    department: 'Engineering',
    avatar: 'SC',
    avatarColor: '#6366f1',
    status: 'active',
    skills: ['PyTorch', 'LLMs', 'Distributed Systems', 'Vector Search'],
    bio: 'Lead architect driving multi-agent orchestration and low-latency inference pipelines.',
    joinedAt: '2024-01-15'
  },
  {
    id: 'mem-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@nexusai.io',
    role: 'Head of Product & Design',
    department: 'Product',
    avatar: 'AR',
    avatarColor: '#ec4899',
    status: 'active',
    skills: ['Design Systems', 'Product Strategy', 'Figma', 'UX Research'],
    bio: 'Product strategist passionate about zero-friction collaboration tools and generative UI.',
    joinedAt: '2024-02-01'
  },
  {
    id: 'mem-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexusai.io',
    role: 'Lead Full-Stack Engineer',
    department: 'Engineering',
    avatar: 'MV',
    avatarColor: '#10b981',
    status: 'in_meeting',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets'],
    bio: 'Building hyper-responsive real-time collaborative clients and state engines.',
    joinedAt: '2024-03-10'
  },
  {
    id: 'mem-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexusai.io',
    role: 'Senior ML Operations Specialist',
    department: 'Engineering',
    avatar: 'ER',
    avatarColor: '#f59e0b',
    status: 'active',
    skills: ['Kubernetes', 'CUDA', 'Triton', 'Monitoring', 'Terraform'],
    bio: 'Scaling high-throughput GPU clusters with 99.99% reliability and zero-downtime rollouts.',
    joinedAt: '2024-04-12'
  },
  {
    id: 'mem-5',
    name: 'David Kim',
    email: 'david.kim@nexusai.io',
    role: 'Product Marketing & Growth',
    department: 'Marketing',
    avatar: 'DK',
    avatarColor: '#8b5cf6',
    status: 'away',
    skills: ['GTM Strategy', 'User Acquisition', 'Analytics', 'Content Strategy'],
    bio: 'Championing developer adoption, developer relations, and enterprise customer success.',
    joinedAt: '2024-05-20'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Aura Agent Orchestration 2.0',
    key: 'AURA',
    description: 'Autonomous multi-agent execution framework with shared vector memory and self-healing tool pipelines.',
    status: 'in_progress',
    priority: 'urgent',
    leadId: 'mem-1',
    memberIds: ['mem-1', 'mem-3', 'mem-4'],
    category: 'AI Intelligence',
    progress: 72,
    startDate: '2025-08-01',
    dueDate: '2025-10-30',
    budgetHours: 320,
    color: '#6366f1',
    icon: 'Cpu',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-09-28T14:30:00Z'
  },
  {
    id: 'proj-2',
    name: 'Real-time Canvas & Collaboration',
    key: 'CANVAS',
    description: 'Sub-15ms multiplayer interactive canvas with CRDT synchronization and dynamic generative UI components.',
    status: 'in_progress',
    priority: 'high',
    leadId: 'mem-3',
    memberIds: ['mem-2', 'mem-3'],
    category: 'Core Platform',
    progress: 58,
    startDate: '2025-08-15',
    dueDate: '2025-11-15',
    budgetHours: 240,
    color: '#ec4899',
    icon: 'Layout',
    createdAt: '2025-08-15T10:00:00Z',
    updatedAt: '2025-09-27T16:00:00Z'
  },
  {
    id: 'proj-3',
    name: 'Enterprise Security & Audit Vault',
    key: 'VAULT',
    description: 'SOC2 Type II compliance controls, end-to-end envelope encryption, and immutable audit trails.',
    status: 'planning',
    priority: 'medium',
    leadId: 'mem-4',
    memberIds: ['mem-1', 'mem-4'],
    category: 'Infrastructure',
    progress: 25,
    startDate: '2025-09-01',
    dueDate: '2025-12-20',
    budgetHours: 180,
    color: '#10b981',
    icon: 'ShieldCheck',
    createdAt: '2025-09-01T11:00:00Z',
    updatedAt: '2025-09-25T11:20:00Z'
  },
  {
    id: 'proj-4',
    name: 'Q4 Product Launch & Developer Portal',
    key: 'LAUNCH',
    description: 'Interactive documentation, sandbox playground, API key self-service, and global public announcement campaign.',
    status: 'in_review',
    priority: 'high',
    leadId: 'mem-2',
    memberIds: ['mem-2', 'mem-5'],
    category: 'Marketing',
    progress: 88,
    startDate: '2025-07-10',
    dueDate: '2025-10-15',
    budgetHours: 150,
    color: '#f59e0b',
    icon: 'Sparkles',
    createdAt: '2025-07-10T08:30:00Z',
    updatedAt: '2025-09-28T10:00:00Z'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Implement dynamic tool calling with token budget optimization',
    description: 'Ensure agent context window doesn’t overflow by pruning inactive tool definitions dynamically.',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'mem-1',
    dueDate: '2025-10-02',
    tags: ['AI', 'Performance', 'Context'],
    subtasks: [
      { id: 'st-1', title: 'Design tool-pruner heuristic', completed: true },
      { id: 'st-2', title: 'Add telemetry benchmarks for latency reduction', completed: true },
      { id: 'st-3', title: 'Write unit tests for edge case recursion', completed: false }
    ],
    estimatedHours: 16,
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-09-28T12:00:00Z'
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Benchmarking agent step recovery upon tool failure',
    description: 'Create automated rollback steps when API calls return rate-limiting or 500 errors.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'mem-4',
    dueDate: '2025-10-05',
    tags: ['Reliability', 'MLOps'],
    subtasks: [
      { id: 'st-4', title: 'Simulate network drops in test harness', completed: false },
      { id: 'st-5', title: 'Implement exponential jitter retry policy', completed: false }
    ],
    estimatedHours: 12,
    createdAt: '2025-09-22T14:30:00Z',
    updatedAt: '2025-09-22T14:30:00Z'
  },
  {
    id: 'task-3',
    projectId: 'proj-2',
    title: 'Optimize CRDT state broadcasting over WebSocket channels',
    description: 'Compress binary diff payloads with LZ4 before wire transmission to maintain 60fps canvas fluidity.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'mem-3',
    dueDate: '2025-10-04',
    tags: ['Frontend', 'Real-time', 'WebSocket'],
    subtasks: [
      { id: 'st-6', title: 'Integrate LZ4 worker thread', completed: true },
      { id: 'st-7', title: 'Measure packet sizes with 50 concurrent cursors', completed: false }
    ],
    estimatedHours: 18,
    createdAt: '2025-09-24T09:15:00Z',
    updatedAt: '2025-09-27T17:00:00Z'
  },
  {
    id: 'task-4',
    projectId: 'proj-2',
    title: 'Design glassmorphic component toolbar & dark theme tokens',
    description: 'Create unified floating toolbar design with accessibility focus ring and smooth spring animations.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'mem-2',
    dueDate: '2025-09-26',
    tags: ['Design System', 'UI/UX'],
    subtasks: [
      { id: 'st-8', title: 'Figma component tokens export', completed: true },
      { id: 'st-9', title: 'WCAG 2.1 AA contrast verification', completed: true },
      { id: 'st-10', title: 'Interactive hover states implementation', completed: true }
    ],
    estimatedHours: 8,
    createdAt: '2025-09-18T11:00:00Z',
    updatedAt: '2025-09-26T18:00:00Z',
    completedAt: '2025-09-26T18:00:00Z'
  },
  {
    id: 'task-5',
    projectId: 'proj-3',
    title: 'Configure KMS Key Rotation and Envelope Encryption in CI/CD',
    description: 'Automate AWS KMS master key rotation schedule with strict IAM boundary checks.',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'mem-4',
    dueDate: '2025-10-10',
    tags: ['Security', 'Infra', 'KMS'],
    subtasks: [
      { id: 'st-11', title: 'Terraform KMS policy template', completed: false },
      { id: 'st-12', title: 'Audit log ingestion into SIEM', completed: false }
    ],
    estimatedHours: 20,
    createdAt: '2025-09-25T15:00:00Z',
    updatedAt: '2025-09-25T15:00:00Z'
  },
  {
    id: 'task-6',
    projectId: 'proj-4',
    title: 'Finalize Developer Playground Interactive Tutorials',
    description: 'Write 4 interactive walkthroughs for the REST & Python SDK with live API response mocking.',
    status: 'in_review',
    priority: 'high',
    assigneeId: 'mem-5',
    dueDate: '2025-10-01',
    tags: ['Docs', 'DevRel', 'Launch'],
    subtasks: [
      { id: 'st-13', title: 'Draft Quickstart Guide', completed: true },
      { id: 'st-14', title: 'Build live code playground snippets', completed: true },
      { id: 'st-15', title: 'Peer review with Sarah & Alex', completed: false }
    ],
    estimatedHours: 14,
    createdAt: '2025-09-21T16:00:00Z',
    updatedAt: '2025-09-28T09:30:00Z'
  },
  {
    id: 'task-7',
    projectId: 'proj-1',
    title: 'Implement Vector Memory RAG chunk cache in Redis',
    description: 'Cache semantic queries with cosine distance threshold > 0.94 to reduce embedding API costs by 40%.',
    status: 'done',
    priority: 'high',
    assigneeId: 'mem-1',
    dueDate: '2025-09-27',
    tags: ['Vector DB', 'Redis', 'Optimization'],
    subtasks: [
      { id: 'st-16', title: 'Vector hash indexing setup', completed: true },
      { id: 'st-17', title: 'TTL invalidation logic', completed: true }
    ],
    estimatedHours: 10,
    createdAt: '2025-09-19T13:00:00Z',
    updatedAt: '2025-09-27T15:00:00Z',
    completedAt: '2025-09-27T15:00:00Z'
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Aura 2.0 Agent Architecture & Low-Latency Pipeline Sync',
    date: '2025-09-28',
    durationMinutes: 45,
    projectId: 'proj-1',
    attendeeIds: ['mem-1', 'mem-3', 'mem-4'],
    rawNotes: `Meeting: Aura 2.0 Agent Architecture Sync
Attendees: @Sarah Chen, @Marcus Vance, @Elena Rostova
Project: Aura Agent Orchestration 2.0

Topics Discussed:
1. Tool calling latency is currently 240ms on average. Sarah suggested introducing a dynamic schema pruner so the LLM prompt only receives relevant tools for the active turn.
2. Elena raised concern about GPU memory fragmentation during peak traffic. We need to set up Triton memory pooling.
3. Marcus confirmed the WebSocket client is ready to stream tool call progress tokens directly to the UI.

Decisions:
- DECISION: We will adopt dynamic tool pruning to cut token load by 35%. Owner: @Sarah Chen
- DECISION: Elena will deploy Triton v2.43 on the staging cluster by Friday. Owner: @Elena Rostova

Action Items:
- @Sarah Chen to write the tool pruner heuristic by 2025-10-02 (Urgent priority)
- @Elena Rostova to benchmark Triton batching throughput by 2025-10-04 (High priority)
- @Marcus Vance to update client stream parser for partial JSON chunking by 2025-10-05 (Medium priority)`,
    status: 'analyzed',
    summary: {
      overview: 'Strategic engineering alignment on reducing agent tool-calling latency from 240ms to under 100ms and deploying Triton GPU memory pooling for scale.',
      keyPoints: [
        'Dynamic schema pruning reduces input token overhead by ~35%.',
        'Triton server upgrade addresses GPU fragmentation under high concurrent request spikes.',
        'Client-side streaming UI will parse incremental JSON tokens for real-time tool feedback.'
      ],
      decisions: [
        {
          id: 'dec-1',
          text: 'Adopt dynamic tool pruning to reduce context size and model latency.',
          rationale: 'Benchmark tests demonstrated a 35% token drop with zero loss in tool precision.',
          ownerId: 'mem-1'
        },
        {
          id: 'dec-2',
          text: 'Upgrade staging cluster to Triton v2.43 with shared memory pools.',
          rationale: 'Prevents OOM spikes during multi-agent concurrent synthesis.',
          ownerId: 'mem-4'
        }
      ],
      actionItems: [
        {
          id: 'act-1',
          text: 'Implement dynamic tool calling with token budget optimization',
          suggestedAssigneeId: 'mem-1',
          suggestedPriority: 'urgent',
          suggestedDueDate: '2025-10-02',
          convertedToTaskId: 'task-1'
        },
        {
          id: 'act-2',
          text: 'Benchmark agent step recovery upon tool failure and test Triton batching',
          suggestedAssigneeId: 'mem-4',
          suggestedPriority: 'high',
          suggestedDueDate: '2025-10-04',
          convertedToTaskId: 'task-2'
        },
        {
          id: 'act-3',
          text: 'Update client stream parser for partial JSON chunking',
          suggestedAssigneeId: 'mem-3',
          suggestedPriority: 'medium',
          suggestedDueDate: '2025-10-05'
        }
      ],
      sentiment: 'positive',
      tags: ['Architecture', 'Performance', 'GPU', 'Streaming']
    },
    createdAt: '2025-09-28T11:00:00Z',
    updatedAt: '2025-09-28T11:45:00Z'
  },
  {
    id: 'meet-2',
    title: 'Design System & Multiplayer Canvas Review',
    date: '2025-09-26',
    durationMinutes: 30,
    projectId: 'proj-2',
    attendeeIds: ['mem-2', 'mem-3', 'mem-5'],
    rawNotes: `Design & Canvas Sync
Attendees: @Alex Rivera, @Marcus Vance, @David Kim

- Reviewed dark mode contrast ratios and glassmorphic card overlays. Alex presented the revised navigation bar and floating actions.
- Marcus showed the 60fps multiplayer cursor interpolation. Need to finalize cursor smoothing algorithms for high-DPI displays.
- David requested an in-app interactive product tour for new trial users.

Decisions:
- Approved the glassmorphism design tokens for production release.
- Added product tour walkthrough to Q4 launch scope.

Action Items:
- @Marcus Vance to finish LZ4 WebSocket binary diff compression by 2025-10-04
- @David Kim to write copy for the 4 onboarding tooltip steps by 2025-10-03`,
    status: 'analyzed',
    summary: {
      overview: 'Review of the modern glassmorphic design system and multiplayer canvas performance benchmarks.',
      keyPoints: [
        'Dark mode color tokens passed WCAG 2.1 AA contrast standards.',
        'Multiplayer cursor interpolation running smoothly at 60fps.',
        'Onboarding product tour approved for Q4 developer portal.'
      ],
      decisions: [
        {
          id: 'dec-3',
          text: 'Approve glassmorphism token system and dark theme palette for production release.',
          rationale: 'Clean aesthetic with verified high contrast accessibility.',
          ownerId: 'mem-2'
        }
      ],
      actionItems: [
        {
          id: 'act-4',
          text: 'Optimize CRDT state broadcasting over WebSocket channels with LZ4 compression',
          suggestedAssigneeId: 'mem-3',
          suggestedPriority: 'high',
          suggestedDueDate: '2025-10-04',
          convertedToTaskId: 'task-3'
        },
        {
          id: 'act-5',
          text: 'Write onboarding tooltip steps copy for interactive product tour',
          suggestedAssigneeId: 'mem-5',
          suggestedPriority: 'medium',
          suggestedDueDate: '2025-10-03'
        }
      ],
      sentiment: 'positive',
      tags: ['Design System', 'Canvas', 'Multiplayer', 'UX']
    },
    createdAt: '2025-09-26T14:00:00Z',
    updatedAt: '2025-09-26T14:35:00Z'
  }
];

export const INITIAL_MEMORIES: TeamMemory[] = [
  {
    id: 'mem-item-1',
    title: 'CRDT Multiplayer Protocol & State Synchronization SOP',
    category: 'architecture',
    tags: ['CRDT', 'WebSocket', 'Architecture', 'Real-time'],
    authorId: 'mem-3',
    projectId: 'proj-2',
    isPinned: true,
    content: `All multiplayer canvas state updates must flow through the central Yjs-based CRDT document provider.

Key Guidelines:
1. Always mutate state via local transactions with origin tags to prevent infinite echo loops.
2. Use binary Uint8Array serialization for network broadcasts.
3. Keep individual chunk payload sizes under 32KB to avoid head-of-line blocking on mobile clients.
4. For conflict resolution on concurrent coordinate moves, last-write-wins (LWW) with lamport timestamps is enforced.`,
    codeSnippet: {
      language: 'typescript',
      code: `// Standard transaction pattern
doc.transact(() => {
  nodesMap.set(nodeId, {
    x: targetX,
    y: targetY,
    updatedBy: currentUserId,
    timestamp: Date.now()
  });
}, 'local-user-origin');`
    },
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-09-27T16:00:00Z'
  },
  {
    id: 'mem-item-2',
    title: 'Agent Token Budgeting & Context Pruning Standard',
    category: 'guideline',
    tags: ['AI', 'Prompt Engineering', 'LLM', 'Performance'],
    authorId: 'mem-1',
    projectId: 'proj-1',
    isPinned: true,
    content: `When orchestrating subagents with multi-turn loops, strictly cap working prompt budgets to prevent exponential latency and token cost surges.

1. Maximum Tool Schema Payload: 1,500 tokens (prune non-matching namespaces).
2. Conversation History Window: Last 6 turns verbatim; older turns must be summarized using semantic memory vectors.
3. RAG Chunks: Top-3 relevant snippets with cosine distance <= 0.22.`,
    codeSnippet: {
      language: 'python',
      code: `def prune_tool_schemas(user_intent: str, available_tools: list) -> list:
    relevant_namespaces = semantic_filter(user_intent, [t.namespace for t in available_tools])
    return [t for t in available_tools if t.namespace in relevant_namespaces]`
    },
    createdAt: '2025-09-18T14:20:00Z',
    updatedAt: '2025-09-28T09:00:00Z'
  },
  {
    id: 'mem-item-3',
    title: 'Zero-Downtime Database Migration Playbook',
    category: 'playbook',
    tags: ['DevOps', 'PostgreSQL', 'Migrations', 'Safety'],
    authorId: 'mem-4',
    projectId: 'proj-3',
    isPinned: false,
    content: `Standard Operating Procedure for schema migrations on production PostgreSQL databases:

Step 1: Expand Phase (Additive Changes)
- Add new columns as nullable or with safe defaults.
- Deploy code that dual-writes to both old and new schema.

Step 2: Backfill Data
- Run background worker jobs during low-traffic windows (02:00 UTC).

Step 3: Contract Phase
- Switch application reads to new column.
- Deprecate and drop old column in subsequent release cycle.`,
    createdAt: '2025-09-10T12:00:00Z',
    updatedAt: '2025-09-20T11:00:00Z'
  },
  {
    id: 'mem-item-4',
    title: 'Brand Palette & Glassmorphic UI Design Tokens',
    category: 'snippet',
    tags: ['Design System', 'CSS', 'Tokens', 'Theme'],
    authorId: 'mem-2',
    isPinned: false,
    content: `Official CSS Custom Properties for Nexus UI:

Primary Gradient: linear-gradient(135deg, #6366f1 0%, #ec4899 100%)
Glass Background: rgba(18, 24, 38, 0.75)
Glass Border: 1px solid rgba(255, 255, 255, 0.08)
Backdrop Filter: blur(16px) saturate(180%)
Card Elevation: 0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
    codeSnippet: {
      language: 'css',
      code: `.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
}`
    },
    createdAt: '2025-09-22T16:45:00Z',
    updatedAt: '2025-09-22T16:45:00Z'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-log-1',
    type: 'task_completed',
    actorId: 'mem-1',
    entityId: 'task-7',
    entityType: 'task',
    entityTitle: 'Implement Vector Memory RAG chunk cache in Redis',
    description: 'completed task and validated 40% cost reduction benchmark',
    timestamp: '2025-09-27T15:00:00Z'
  },
  {
    id: 'act-log-2',
    type: 'meeting_analyzed',
    actorId: 'mem-1',
    entityId: 'meet-1',
    entityType: 'meeting',
    entityTitle: 'Aura 2.0 Agent Architecture & Low-Latency Pipeline Sync',
    description: 'generated AI structured meeting notes, 2 decisions, and 3 actionable tasks',
    timestamp: '2025-09-28T11:45:00Z'
  },
  {
    id: 'act-log-3',
    type: 'task_created',
    actorId: 'mem-3',
    entityId: 'task-3',
    entityType: 'task',
    entityTitle: 'Optimize CRDT state broadcasting over WebSocket channels',
    description: 'created high-priority task for Canvas project',
    timestamp: '2025-09-24T09:15:00Z'
  },
  {
    id: 'act-log-4',
    type: 'memory_saved',
    actorId: 'mem-1',
    entityId: 'mem-item-2',
    entityType: 'memory',
    entityTitle: 'Agent Token Budgeting & Context Pruning Standard',
    description: 'pinned new architectural guideline to team memory',
    timestamp: '2025-09-18T14:20:00Z'
  },
  {
    id: 'act-log-5',
    type: 'project_updated',
    actorId: 'mem-2',
    entityId: 'proj-4',
    entityType: 'project',
    entityTitle: 'Q4 Product Launch & Developer Portal',
    description: 'updated project status to In Review (88% complete)',
    timestamp: '2025-09-28T10:00:00Z'
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'slate',
  density: 'comfortable',
  soundEffects: true,
  enableLocalAI: true,
  aiProvider: 'local',
  userName: 'Sarah Chen',
  userEmail: 'sarah.chen@nexusai.io',
  activeMemberId: 'mem-1'
};
