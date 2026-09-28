import React from 'react';
import { TaskStatus, Priority, ProjectStatus, MemoryCategory } from '../../types';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  icon,
  className = '',
  size = 'md'
}) => {
  const sizeStyles = size === 'sm' ? { fontSize: '0.7rem', padding: '0.15rem 0.45rem' } : {};

  return (
    <span className={`badge badge-${variant} ${className}`} style={sizeStyles}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus | ProjectStatus }> = ({ status }) => {
  switch (status) {
    case 'done':
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'in_progress':
      return <Badge variant="info">In Progress</Badge>;
    case 'in_review':
      return <Badge variant="warning">In Review</Badge>;
    case 'planning':
      return <Badge variant="primary">Planning</Badge>;
    case 'on_hold':
      return <Badge variant="default">On Hold</Badge>;
    case 'todo':
    default:
      return <Badge variant="default">To Do</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <Badge variant="danger" icon={<span className="priority-dot priority-urgent" />}>
          Urgent
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="warning" icon={<span className="priority-dot priority-high" />}>
          High
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="info" icon={<span className="priority-dot priority-medium" />}>
          Medium
        </Badge>
      );
    case 'low':
    default:
      return (
        <Badge variant="default" icon={<span className="priority-dot priority-low" />}>
          Low
        </Badge>
      );
  }
};

export const CategoryBadge: React.FC<{ category: MemoryCategory | string }> = ({ category }) => {
  return (
    <Badge variant="primary" size="sm">
      {category.toUpperCase()}
    </Badge>
  );
};
