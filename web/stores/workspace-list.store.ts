import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { IconName } from 'lucide-react/dynamic'

export interface Workspace {
  id: string
  name: string
  logo: IconName | ''
  color: string
}

interface WorkspaceListsStore {
  workspaces: Workspace[] | null
  total: number
  activeWorkspace: Workspace | null
  setWorkspaces: (workspaces: Workspace[] | null) => void
  setTotal: (total: number) => void
  setActiveWorkspace: (workspace: Workspace) => void
  appendWorkspaces: (workspaces: Workspace[]) => void
  updateWorkspace: (updated: Workspace) => void
  addWorkspace: (workspace: Workspace) => void
}

const useWorkspaceListsStore = create<WorkspaceListsStore>()(
  persist(
    (set) => ({
      workspaces: null,
      total: 0,
      activeWorkspace: null,
      setWorkspaces: (workspaces) => set({ workspaces }),
      setTotal: (total) => set({ total }),
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      appendWorkspaces: (newWorkspaces) =>
        set((state) => ({ workspaces: [...(state.workspaces ?? []), ...newWorkspaces] })),

      updateWorkspace: (updated) =>
        set((state) => ({
          workspaces: state.workspaces?.map((w) => (w.id === updated.id ? updated : w)) ?? null,
          activeWorkspace: state.activeWorkspace?.id === updated.id ? updated : state.activeWorkspace,
        })),
      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...(state.workspaces ?? []), workspace],
          activeWorkspace: workspace,
        })),
    }),
    {
      name: 'workspaces-storage',
      storage: createJSONStorage(() => localStorage),
      // Prevent SSR/client mismatch — rehydrate manually on mount
      skipHydration: true,
    },
  ),
)

export default useWorkspaceListsStore
