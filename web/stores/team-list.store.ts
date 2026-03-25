import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { IconName } from 'lucide-react/dynamic'

export interface Team {
  id: string
  name: string
  logo: IconName | ''
  color: string
}

interface TeamListsStore {
  teams: Team[] | null
  total: number
  activeTeam: Team | null
  setTeams: (teams: Team[] | null) => void
  setTotal: (total: number) => void
  setActiveTeam: (team: Team) => void
  appendTeams: (teams: Team[]) => void
  updateTeam: (updated: Team) => void
  addTeam: (team: Team) => void
}

const useTeamListsStore = create<TeamListsStore>()(
  persist(
    (set) => ({
      teams: null,
      total: 0,
      activeTeam: null,
      setTeams: (teams) => set({ teams }),
      setTotal: (total) => set({ total }),
      setActiveTeam: (team) => set({ activeTeam: team }),
      appendTeams: (newTeams) =>
        set((state) => ({ teams: [...(state.teams ?? []), ...newTeams] })),

      updateTeam: (updated) =>
        set((state) => ({
          teams: state.teams?.map((t) => (t.id === updated.id ? updated : t)) ?? null,
          activeTeam: state.activeTeam?.id === updated.id ? updated : state.activeTeam,
        })),
      addTeam: (team) =>
        set((state) => ({
          teams: [...(state.teams ?? []), team],
          activeTeam: team,
        })),
    }),
    {
      name: 'teams-storage',
      storage: createJSONStorage(() => localStorage),
      // Prevent SSR/client mismatch — rehydrate manually on mount
      skipHydration: true,
    },
  ),
)

export default useTeamListsStore
