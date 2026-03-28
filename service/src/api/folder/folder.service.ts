import * as FolderRepository from './folder.repository'

export const getFolders = async (params: FolderRepository.IGetFolders) => {
  return await FolderRepository.getFoldersByWorkspaceId(params)
}

export const createFolder = async (data: FolderRepository.ICreateFolder) => {
  return await FolderRepository.createFolder(data)
}

export const updateFolder = async (data: FolderRepository.IUpdateFolder) => {
  return await FolderRepository.updateFolder(data)
}

export const deleteFolder = async (data: {
  id: string
  workspaceId: string
  accountId: string
}) => {
  return await FolderRepository.deleteFolder(data)
}
