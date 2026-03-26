import * as WorkspaceRepository from './workspace.repository'

export interface ICreateWorkspaceService {
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export interface IGetWorkspacesService {
  accountId: string
  search?: string
  page: number
  limit: number
}

export interface IUpdateWorkspaceService {
  id: string
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export const updateWorkspace = async (data: IUpdateWorkspaceService) => {
  return await WorkspaceRepository.updateWorkspace(data)
}

export const createWorkspace = async (data: ICreateWorkspaceService) => {
  return await WorkspaceRepository.createWorkspace(data)
}

export const getWorkspaces = async (params: IGetWorkspacesService) => {
  return await WorkspaceRepository.getWorkspacesByAccountId(params)
}
