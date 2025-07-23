# Knowledgebase GPT with Qdrant

This project uses Qdrant as a vector database for semantic search and similarity matching in AI applications.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Start Qdrant Service

To start the Qdrant service, run the following command in the project root directory:

```bash
docker-compose up -d
```

This will start Qdrant in the background using the configuration specified in `docker-compose.yml`.

### 2. Verify the Service

Once started, you can access:

- **Qdrant Dashboard**: http://localhost:6333/dashboard
- **REST API**: http://localhost:6333
- **gRPC**: localhost:6334

To check if the service is running:

```bash
docker-compose ps
```

### 3. Stop the Service

To stop Qdrant:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Configuration

The default configuration in `docker-compose.yml` includes:

- Ports: 6333 (HTTP/REST) and 6334 (gRPC)
- Persistent storage using Docker volume `qdrant_data`
- Health checks for monitoring
- Automatic restarts on failure

## Connecting to Qdrant

### Python Client Example

```python
from qdrant_client import QdrantClient

# Initialize the client
client = QdrantClient(host="localhost", port=6333)

# Test the connection
print(client.get_collections())
```

## Troubleshooting

- If ports 6333 or 6334 are in use, update the port mappings in `docker-compose.yml`
- Check container logs: `docker-compose logs qdrant`
- View running containers: `docker ps`

## License

MIT
