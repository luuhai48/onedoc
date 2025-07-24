# OneDoc - Brings all your swagger docs into one place

OneDoc is a modern web application that consolidates multiple Swagger/OpenAPI documentation endpoints into a single, unified interface. It provides version control, diff tracking, and a clean UI for managing and viewing API documentation.

## 🚀 Features

- **Unified Swagger Interface**: View multiple Swagger JSON endpoints in one place
- **Version Control**: Track changes in your API documentation over time
- **Diff Visualization**: See what changed between different versions of your APIs
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Automatic detection and tracking of API changes
- **Search & Filter**: Easily find and switch between different API endpoints

## 📸 Screenshots

### Main Interface
![OneDoc Main Interface](screenshots/1.png)

### Version History and Diff View
![OneDoc Version History](screenshots/2.png)

## 🏗️ Architecture

OneDoc is built as a monorepo with the following components:

- **API Server** (`packages/api`): Hono-based REST API server handling Swagger data
- **Web Frontend** (`packages/web`): React application with TanStack Router and Tailwind CSS
- **Worker** (`packages/worker`): Background service with cron scheduling for processing Swagger updates
- **Shared Library** (`packages/shared`): Common utilities, models, and services

### Tech Stack

- **Backend**: Bun, Hono, MongoDB, Mongoose, node-cron
- **Frontend**: React 19, TanStack Router, TanStack Query, Tailwind CSS
- **UI Components**: Radix UI, Lucide React, Swagger UI React
- **Development**: TypeScript, Biome (linting/formatting), Vite
- **Infrastructure**: Docker, Docker Compose

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Docker](https://docker.com/) and Docker Compose
- [MongoDB](https://mongodb.com/) (or use the provided Docker setup)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onedoc
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://admin:Abcd1234@localhost:27017/onedoc?authSource=admin
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   WORKER_SCHEDULE=0 * * * *
   ```

4. **Start MongoDB (using Docker)**
   ```bash
   docker-compose up -d
   ```

5. **Run the development server**
   ```bash
   bun run dev
   ```

This will start all services concurrently:
- API server on `http://localhost:3000`
- Web frontend on `http://localhost:5173`
- Worker service with scheduled tasks running in the background

## 🚀 Available Scripts

- `bun run dev` - Start all services in development mode
- `bun run dev:api` - Start only the API server
- `bun run dev:web` - Start only the web frontend
- `bun run dev:worker` - Start only the worker service
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome

## 📦 Project Structure

```
onedoc/
├── packages/
│   ├── api/                 # Hono-based API server
│   │   ├── src/
│   │   │   ├── middlewares/ # CORS, logging, static file serving
│   │   │   └── routes/      # API route definitions
│   ├── web/                 # React frontend application
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── routes/      # TanStack Router routes
│   │   │   └── api/         # API client functions
│   ├── worker/              # Background processing service
│   └── shared/              # Shared utilities and models
│       ├── src/
│       │   ├── libs/        # Database, logging, environment
│       │   ├── models/      # MongoDB schemas
│       │   ├── services/    # Business logic services
│       │   └── types/       # TypeScript type definitions
├── docker-compose.yml       # MongoDB service configuration
└── package.json            # Root package with workspace configuration
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | API server port | `3000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173,http://localhost:3000` |
| `WORKER_SCHEDULE` | Cron schedule for worker tasks | `0 * * * *` (every hour) |

### MongoDB Setup

The application uses MongoDB to store:
- Swagger endpoints configuration
- API version history
- Change patches and diffs

### Worker Scheduling

The worker service uses cron scheduling to automatically monitor Swagger endpoints for changes. You can configure the schedule using the `WORKER_SCHEDULE` environment variable:

- **Every hour** (default): `0 * * * *`
- **Every 5 minutes**: `*/5 * * * *`
- **Every 30 minutes**: `*/30 * * * *`
- **Every day at midnight**: `0 0 * * *`
- **Every minute**: `* * * * *`

The Docker Compose file provides a pre-configured MongoDB instance with:
- Database: `onedoc`
- Username: `admin`
- Password: `Abcd1234`

## 🎯 Usage

1. **Access the application** at `http://localhost:5173`
2. **Add Swagger endpoints** through the API or configuration
3. **Select an endpoint** from the dropdown to view its documentation
4. **Browse version history** to see changes over time
5. **View diffs** between different versions of your APIs
6. **Automatic monitoring**: The worker service automatically checks for API changes based on the configured schedule

## 🧪 Development

### Adding New Features

1. **API Changes**: Modify `packages/api/src/routes/`
2. **Frontend Changes**: Update `packages/web/src/`
3. **Shared Logic**: Add to `packages/shared/src/`
4. **Background Tasks**: Implement in `packages/worker/src/`

### Code Quality

The project uses Biome for code formatting and linting:
- Run `bun run format` to format code
- Run `bun run lint` to check for issues

### Type Safety

The project is fully typed with TypeScript. All shared types are defined in `packages/shared/src/types/`.

## 🐳 Docker Deployment

For production deployment, you can use the provided Dockerfile:

```bash
# Build the application
docker build -t onedoc:latest .

# Run with MongoDB
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
