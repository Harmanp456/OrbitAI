# OrbitAI

OrbitAI is a full-stack AI platform organized around a frontend and a backend of focused services. The repository is designed to make AI features, authentication, chat, billing, and gateway concerns independently deployable while remaining easy to run locally.

## Architecture

```text
frontend/                 Web application
backend/
  gateway/                API entry point and routing
  services/agent/         Agent and AI workflows
  services/auth/          Authentication
  services/billing/       Billing and subscription concerns
  services/chat/          Chat and conversation features
  docker-compose.yml      Local backend orchestration
```

Each backend service has its own package manifest and Dockerfile. Keep service-specific dependencies and configuration inside that service rather than coupling unrelated services.

## Local development

### Backend

```bash
cd backend
docker compose up --build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Use the environment templates and service configuration already present in the repository. Never commit API keys, tokens, database URLs, or billing credentials.

## Working on the project

- Start with the gateway when tracing a request across services.
- Run the affected service checks before opening a pull request.
- Keep API contracts versioned and update both the client and service when they change.
- Add an environment variable to documentation and an example file, not to source control.

## Status

OrbitAI is an evolving platform; service boundaries and APIs may change as features mature.
