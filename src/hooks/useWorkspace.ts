import { useContext } from 'react';
import { WorkspaceContext, WorkspaceContextValue } from '../context/WorkspaceContext';

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
