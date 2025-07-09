# NestJS Microservice Starter

Production-ready structure and CI setup for scalable NestJS microservices with testing & DevOps.

## Features
- Modular architecture with an Example module
- gRPC microservice support
- MongoDB integration
- Redis integration (with test mocking)
- Jest for unit and integration testing
- GitHub Actions CI for build, lint, and test
- No SonarCloud or Snyk integration

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Docker (for MongoDB/Redis in development)

### Installation
Install dependencies:
```bash
npm install
```

### Running the App
```bash
npm run start:dev
```

### Running Tests
```bash
npm run test
npm run test:cov
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Example Module
The `Example` module demonstrates a typical CRUD microservice using gRPC. See `src/modules/example/` for implementation details.

## gRPC
- Proto files are located in `src/modules/example/proto/`.
- The ExampleController exposes gRPC endpoints for CRUD operations.

## CI/CD
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Runs build, lint, and test jobs on push and PRs.
- No SonarCloud or Snyk integration.

## Project Structure
```
src/
  app.module.ts
  main.ts
  modules/
    example/
      example.controller.ts
      example.module.ts
      example.service.ts
      models/
      proto/
      test/
  common/
    ...
```

## License
MIT
