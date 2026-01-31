import express from 'express'
import multer from 'multer'

const { uploadController } = require('../controllers/upload.controller')
const { authMiddleware } = require('../middleware/auth.middleware')

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/', authMiddleware, upload.single('file'), uploadController)
router.post('/guest', upload.single('file'), uploadController)

export default router
