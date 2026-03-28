import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../../../boot/express.dto'
import * as CollabService from './collab.service'
import logger from '../../../boot/logger'

const LOGGER_NAME = 'WORKSPACE_COLLAB:'

// ─── Members ─────────────────────────────────────────────────────────────────

export const getMembers = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params
    const members = await CollabService.listMembers(workspaceId, req.account.id)
    return res.status(StatusCodes.OK).json(members)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const updateMemberRole = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, memberId } = req.params
    const { role } = req.body
    const member = await CollabService.updateMemberRole({ memberId, workspaceId, role })
    return res.status(StatusCodes.OK).json(member)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const removeMember = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, memberId } = req.params
    await CollabService.removeMember({
      memberId,
      workspaceId,
      requesterId: req.account.id,
    })
    return res.status(StatusCodes.OK).json({ message: 'Member removed' })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export const sendInvitation = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params
    const { email, role } = req.body
    const invitation = await CollabService.sendInvitation({
      workspaceId,
      email,
      role,
      invitedById: req.account.id,
    })
    return res.status(StatusCodes.CREATED).json(invitation)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const acceptInvitation = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body
    const result = await CollabService.acceptInvitation({
      token,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const getInvitationInfo = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params
    const invitation = await CollabService.getInvitationInfo(token)
    return res.status(StatusCodes.OK).json(invitation)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}
