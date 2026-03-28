import { create } from 'zustand'

export interface Folder {
  id: string
  name: string
  parentId: string | null
  depth: number
  order: number
  workspaceId: string
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  title: string
  folderId: string | null
  parentPageId: string | null
  depth: number
  order: number
  workspaceId: string
  createdAt: string
  updatedAt: string
}

interface WorkspaceContentStore {
  folders: Folder[]
  pages: Page[]
  loadedWorkspaceId: string | null
  setFolders: (folders: Folder[]) => void
  setPages: (pages: Page[]) => void
  addFolder: (folder: Folder) => void
  updateFolder: (updated: Folder) => void
  removeFolder: (id: string) => void
  addPage: (page: Page) => void
  updatePage: (updated: Page) => void
  updatePageTitle: (id: string, title: string) => void
  removePage: (id: string) => void
  setLoadedWorkspaceId: (id: string) => void
  clear: () => void
}

const useWorkspaceContentStore = create<WorkspaceContentStore>((set) => ({
  folders: [],
  pages: [],
  loadedWorkspaceId: null,

  setFolders: (folders) => set({ folders }),
  setPages: (pages) => set({ pages }),

  addFolder: (folder) =>
    set((state) => ({ folders: [...state.folders, folder] })),

  updateFolder: (updated) =>
    set((state) => ({
      folders: state.folders.map((f) => (f.id === updated.id ? updated : f)),
    })),

  removeFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      pages: state.pages.filter((p) => p.folderId !== id),
    })),

  addPage: (page) =>
    set((state) => ({ pages: [...state.pages, page] })),

  updatePage: (updated) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === updated.id ? updated : p)),
    })),

  updatePageTitle: (id, title) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, title } : p)),
    })),

  removePage: (id) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== id && p.parentPageId !== id),
    })),

  setLoadedWorkspaceId: (id) => set({ loadedWorkspaceId: id }),

  clear: () => set({ folders: [], pages: [], loadedWorkspaceId: null }),
}))

export default useWorkspaceContentStore
