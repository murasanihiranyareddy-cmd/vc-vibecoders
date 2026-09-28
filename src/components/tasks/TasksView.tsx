import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Task, TaskStatus, Priority } from '../../types';
import { TaskKanban } from './TaskKanban';
import { TaskList } from './TaskList';
import { TaskDetailModal } from './TaskDetailModal';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import {
  Search,
  Plus,
  Kanban,
  List,
  CheckSquare,
  Sparkles
} from 'lucide-react';

interface TasksViewProps {
  onOpenCreateTask: (projectId?: string, initialStatus?: TaskStatus) => void;
  onOpenEditTask: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  onOpenCreateTask,
  onOpenEditTask
}) => {
  const {
    tasks,
    projects,
    members,
    selectedTaskId,
    setSelectedTaskId,
    deleteTask,
    toggleTaskStatus,
    updateTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    batchUpdateTaskStatus,
    batchDeleteTasks,
    setSelectedProjectId,
    setActiveView
  } = useWorkspace();

  const { success } = useToast();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created' | 'title'>('dueDate');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Selected task object for Detail Modal
  const inspectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find((t) => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const priorityOrder: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;
        const matchesAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter;
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

        return matchesSearch && matchesProject && matchesAssignee && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, searchQuery, projectFilter, assigneeFilter, priorityFilter, statusFilter, sortBy]);

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      success('Task removed');
      setTaskToDelete(null);
    }
  };

  const handleBatchDelete = (ids: string[]) => {
    batchDeleteTasks(ids);
    success(`Deleted ${ids.length} tasks`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h2 className="heading-lg" style={{ margin: 0 }}>
            Tasks & Workflow Engine
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            Manage sprints, team assignments, subtask checklists, and delivery deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* View mode toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-card-subtle)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)'
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.35rem 0.65rem' }}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
              aria-label="Kanban Board View"
            >
              <Kanban size={15} />
              <span>Board</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.35rem 0.65rem' }}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List View"
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpenCreateTask()}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--bg-card-subtle)'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '32px' }}
            placeholder="Search tasks by title, tag, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* Project Filter */}
          <select
            className="select-field"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            aria-label="Filter by Project"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.key}] {p.name}
              </option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            className="select-field"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            aria-label="Filter by Assignee"
          >
            <option value="all">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            className="select-field"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter (if in List view) */}
          {viewMode === 'list' && (
            <select
              className="select-field"
              style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          )}

          {/* Sort By */}
          <select
            className="select-field"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort by field"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Recently Created</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={28} />}
          title="No tasks match your filters"
          description={
            searchQuery || projectFilter !== 'all' || assigneeFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'You do not have any tasks created yet. Click "New Task" to create your first deliverable.'
          }
          actionLabel="Create Task"
          actionIcon={<Plus size={16} />}
          onAction={() => onOpenCreateTask()}
        />
      ) : viewMode === 'kanban' ? (
        <TaskKanban
          tasks={filteredTasks}
          projects={projects}
          members={members}
          onSelectTask={(task) => setSelectedTaskId(task.id)}
          onToggleTaskStatus={toggleTaskStatus}
          onUpdateTaskStatus={(id, st) => updateTask(id, { status: st })}
          onOpenCreateInColumn={(st) => onOpenCreateTask(undefined, st)}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          projects={projects}
          members={members}
          onSelectTask={(task) => setSelectedTaskId(task.id)}
          onToggleTaskStatus={toggleTaskStatus}
          onUpdateTaskStatus={(id, st) => updateTask(id, { status: st })}
          onBatchUpdateStatus={batchUpdateTaskStatus}
          onBatchDelete={handleBatchDelete}
          onEditTask={onOpenEditTask}
          onDeleteTask={(id) => setTaskToDelete(id)}
        />
      )}

      {/* Task Details Modal */}
      <TaskDetailModal
        isOpen={Boolean(inspectedTask)}
        onClose={() => setSelectedTaskId(null)}
        task={inspectedTask}
        project={projects.find((p) => p.id === inspectedTask?.projectId)}
        assignee={members.find((m) => m.id === inspectedTask?.assigneeId)}
        allProjects={projects}
        allMembers={members}
        onEditTask={(t) => {
          setSelectedTaskId(null);
          onOpenEditTask(t);
        }}
        onDeleteTask={(id) => {
          setSelectedTaskId(null);
          setTaskToDelete(id);
        }}
        onUpdateStatus={(id, st) => updateTask(id, { status: st })}
        onToggleSubtask={toggleSubtask}
        onAddSubtask={addSubtask}
        onDeleteSubtask={deleteSubtask}
        onNavigateToProject={(pId) => {
          setSelectedProjectId(pId);
          setActiveView('project_detail');
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action will permanently remove its subtasks and history."
        confirmLabel="Delete Task"
        variant="danger"
      />
    </div>
  );
};
