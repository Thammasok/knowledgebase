import { saveDocument, getDocumentsByUserId } from '../services/db'
import pdfParse from 'pdf-parse' // Example library to parse PDFs
import express from 'express'
import { generateEmbedding } from '../services/db' // Your embedding function

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { userId, docName } = req.body
    const sessionId = req.body.sessionId

    console.log('*******************************************', sessionId)
    const file = req.file // Assuming file upload via multer or similar
    if (!userId || !docName || !file) {
      return res.status(400).send('Missing userId, docName, or file')
    }

    // Parse PDF
    const pdfData = await pdfParse(file.buffer)
    const text = pdfData.text

    // Split text into chunks (e.g., by paragraph or fixed length)
    const chunkSize = 1000 // Adjust as needed
    const chunks = []
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunkText = text.slice(i, i + chunkSize)
      const embedding = await generateEmbedding(chunkText)
      chunks.push({ text: chunkText, embedding })
    }

    // Generate a unique docId for the PDF
    const docId = uuidv4()
    console.log('Saving PDF with chunks:', { userId, docId, docName, chunkCount: chunks.length })

    // Save all chunks as a single document
    await saveDocument(userId, docId, docName, chunks)
    res.status(200).send('PDF document saved')
  } catch (error) {
    console.error('Error saving PDF:', error.message)
    res.status(500).send(`Failed to save PDF: ${error.message}`)
  }
})

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).send('userId is required')
    }
    const documents = await getDocumentsByUserId(userId)
    res.status(200).json(documents)
  } catch (error) {
    console.error('Error retrieving documents:', error.message)
    res.status(500).send(`Failed to retrieve documents: ${error.message}`)
  }
})

export default router
