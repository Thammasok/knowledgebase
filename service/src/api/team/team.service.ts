import * as TeamRepository from './team.repository'

export interface ICreateTeamService {
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export interface IGetTeamsService {
  accountId: string
  search?: string
  page: number
  limit: number
}

export interface IUpdateTeamService {
  id: string
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export const updateTeam = async (data: IUpdateTeamService) => {
  return await TeamRepository.updateTeam(data)
}

export const createTeam = async (data: ICreateTeamService) => {
  return await TeamRepository.createTeam(data)
}

export const getTeams = async (params: IGetTeamsService) => {
  return await TeamRepository.getTeamsByAccountId(params)
}
