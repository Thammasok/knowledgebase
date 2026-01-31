import express from 'express'
import {
  chatController,
  createSession,
  getSessions,
  removeDocumentFromSession,
} from '../controllers/chat.Controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

// Guest chat (no session)
router.post('/guest', chatController)

// Create a new session (authenticated only)
router.post('/session', authMiddleware, createSession)

// Get all sessions for a user (authenticated only)
router.get('/sessions', authMiddleware, getSessions)

// Authenticated chat with session (only valid ObjectId)
router.post('/:sessionId', authMiddleware, chatController)
router.delete('/session/:sessionId/document/:docId', authMiddleware, removeDocumentFromSession)

export default router
