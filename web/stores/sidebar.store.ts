import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SidebarStore {
  mainSidebarOpen: boolean
  secondarySidebarOpen: boolean
  setMainSidebarOpen: (open: boolean) => void
  setSecondarySidebarOpen: (open: boolean) => void
}

const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      mainSidebarOpen: true,
      secondarySidebarOpen: false,
      setMainSidebarOpen: (mainSidebarOpen) => set({ mainSidebarOpen }),
      setSecondarySidebarOpen: (secondarySidebarOpen) =>
        set({ secondarySidebarOpen }),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)

export default useSidebarStore
