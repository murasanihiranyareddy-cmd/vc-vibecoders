import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Project, ProjectStatus, Priority } from '../../types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import {
  Search,
  Plus,
  Filter,
  FolderKanban,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

interface ProjectsViewProps {
  onOpenCreateProject: () => void;
  onOpenEditProject: (project: Project) => void;
  onOpenProjectDetails: (id: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenCreateProject,
  onOpenEditProject,
  onOpenProjectDetails
}) => {
  const { projects, tasks, members, deleteProject, getProjectProgress } = useWorkspace();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'progress' | 'dueDate' | 'name'>('updated');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'progress') {
          return getProjectProgress(b.id) - getProjectProgress(a.id);
        }
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, getProjectProgress]);

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      success('Project and associated deliverables deleted');
      setProjectToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Top Controls & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h2 className="heading-lg" style={{ margin: 0 }}>
            Projects & Initiatives
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            Track strategic deliverables, milestones, team allocation, and task progress.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={onOpenCreateProject}>
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
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
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '32px' }}
            placeholder="Search projects by name, key, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select
            className="select-field"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
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

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              className="select-field"
              style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '0.45rem 0.8rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
            <option value="updated">Recently Updated</option>
            <option value="progress">Highest Progress</option>
            <option value="dueDate">Target Due Date</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Project Grid / Empty State */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={28} />}
          title="No projects found"
          description={
            searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try changing your search terms or clearing your filters.'
              : 'You do not have any active projects yet. Create your first initiative to start organizing tasks.'
          }
          actionLabel="Create Project"
          actionIcon={<Plus size={16} />}
          onAction={onOpenCreateProject}
        />
      ) : (
        <div className="grid-cols-2">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const completedCount = projectTasks.filter((t) => t.status === 'done').length;
            const progress = getProjectProgress(project.id);

            return (
              <ProjectCard
                key={project.id}
                project={project}
                members={members}
                taskCount={projectTasks.length}
                completedTaskCount={completedCount}
                progress={progress}
                onOpenDetails={onOpenProjectDetails}
                onEdit={onOpenEditProject}
                onDelete={(id) => setProjectToDelete(id)}
              />
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project?"
        message="Are you sure you want to delete this project? All associated tasks linked strictly to this project will also be removed. This action cannot be undone."
        confirmLabel="Delete Project"
        variant="danger"
      />
    </div>
  );
};
