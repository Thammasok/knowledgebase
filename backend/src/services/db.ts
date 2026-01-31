// import { QdrantClient } from '@qdrant/js-client-rest'
import { QdrantClient } from '@qdrant/qdrant-js'
import { v4 as uuidv4 } from 'uuid'

const client = new QdrantClient({
  url: process.env.QUDRANT_CLIENT,
  apiKey: process.env.QUDRANT_API_KEY,
})

if (!process.env.QUDRANT_CLIENT || !process.env.QUDRANT_API_KEY) {
  throw new Error('QDRANT_CLIENT and QDRANT_API_KEY environment variables must be set')
}

async function deleteCollection(collectionName: string) {
  try {
    await client.deleteCollection(collectionName)
    console.log(`Collection ${collectionName} deleted successfully`)
  } catch (error) {
    console.error(`Failed to delete collection ${collectionName}:`, error)
  }
}

async function ensureCollection(collectionName: string, embeddingSize: number) {
  if (!Number.isInteger(embeddingSize) || embeddingSize <= 0) {
    throw new Error('Invalid embedding size')
  }

  const collections = await client.getCollections()
  const collection = collections.collections.find((col) => col.name === collectionName)

  if (collection) {
    const collectionInfo = await client.getCollection(collectionName)
    const vectorSize = collectionInfo.config.params.vectors?.size
    if (vectorSize !== embeddingSize) {
      console.log(
        `Vector size mismatch: expected ${embeddingSize}, found ${vectorSize}. Recreating collection.`,
      )
      await deleteCollection(collectionName)
    }
  }

  const exists = collections.collections.some((col) => col.name === collectionName)
  if (!exists) {
    await client.createCollection(collectionName, {
      vectors: {
        size: embeddingSize,
        distance: 'Cosine',
      },
    })
    await client.createPayloadIndex(collectionName, {
      field_name: 'userId',
      field_schema: 'keyword',
    })
    await client.createPayloadIndex(collectionName, {
      field_name: 'name',
      field_schema: 'keyword',
    })
    console.log(`Collection ${collectionName} created with vector size ${embeddingSize}`)
  }
}

exports.saveDocument = async (
  userId: string,
  docId: string,
  docName: string,
  text: string,
  embedding: string[],
) => {
  console.log('Input parameters:', {
    userId,
    docId,
    docName,
    text: text?.slice(0, 50),
    embeddingLength: embedding?.length,
  })

  if (
    !userId ||
    !docId ||
    !docName ||
    !text ||
    !Array.isArray(embedding) ||
    embedding.length <= 0
  ) {
    throw new Error('Invalid input parameters or embedding')
  }

  try {
    await ensureCollection('document_embeddings', embedding.length)
    const point = {
      id: uuidv4(),
      vector: embedding.map(Number),
      payload: { userId, docId, name: docName, text },
    }
    // console.log('Saving point with payload:', point.payload);
    await client.upsert('document_embeddings', { points: [point] })
    // console.log('Document saved to Qdrant:', { userId, docId, text: text.slice(0, 50) });
    return { id: point.id, userId, docId }
  } catch (error) {
    console.error('Failed to save document:', { userId, docId, error: error.message })
    throw new Error(`Failed to save document: ${error.message}`)
  }
}

exports.searchRelevantContext = async (userEmbedding: number[], userId: string, docName: string, top = 5) => {
  console.log('Search inputs:', { userId, docName, embeddingLength: userEmbedding?.length })
  if (!userId || !Array.isArray(userEmbedding) || userEmbedding.length <= 0) {
    throw new Error('Invalid userEmbedding or userId')
  }

  const collectionName = 'document_embeddings'
  try {
    await ensureCollection(collectionName, userEmbedding.length)
    const searchOptions = {
      vector: userEmbedding,
      top,
      filter: {
        must: [{ key: 'userId', match: { value: userId } }],
      },
    }
    if (docName) {
      searchOptions.filter.must.push({ key: 'name', match: { value: docName } })
    }
    const searchResult = await client.search(collectionName, searchOptions)
    console.log(`Retrieved ${searchResult.length} relevant documents for userId: ${userId}`)
    return searchResult.map((point) => point.payload?.text).join('\n')
  } catch (error) {
    console.error('Error searching Qdrant:', { userId, error: error.message })
    throw new Error(`Failed to search relevant context: ${error.message}`)
  }
}

exports.getDocumentsByUserId = async (userId) => {
  if (!userId) {
    throw new Error('userId is required')
  }

  const collectionName = 'document_embeddings'
  try {
    const collections = await client.getCollections()
    const exists = collections.collections.some((col) => col.name === collectionName)
    if (!exists) {
      console.log(`Collection ${collectionName} does not exist`)
      return []
    }

    const result = await client.scroll(collectionName, {
      filter: {
        must: [{ key: 'userId', match: { value: userId } }],
      },
      limit: 100,
    })
    const documents = result.points.map((point) => ({
      docId: point.payload.docId,
      text: point.payload.text,
      name: point.payload.name,
    }))
    console.log(`Retrieved ${documents.length} documents for userId: ${userId}`)
    return documents
  } catch (error) {
    console.error('Error fetching documents by userId:', { userId, error: error.message })
    throw new Error(`Failed to fetch documents: ${error.message}`)
  }
}
