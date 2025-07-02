# BoolMind NestJS Boilerplate

A comprehensive, production-ready NestJS boilerplate with built-in authentication, database integration, testing, CI/CD, and best practices.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Database](#-database)
- [Authentication & Authorization](#-authentication--authorization)
- [Deployment](#-deployment)
- [CI/CD](#-cicd)
- [Performance & Monitoring](#-performance--monitoring)
- [Security](#-security)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

### Core Features
- **🚀 NestJS Framework**: Built with NestJS for scalable server-side applications
- **📊 MongoDB Integration**: Mongoose ODM with optimized schemas and factories
- **🔐 Authentication**: JWT-based authentication with refresh tokens
- **🛡️ Authorization**: Role-based access control (RBAC)
- **📝 API Documentation**: Swagger/OpenAPI documentation with authentication
- **🧪 Testing**: Comprehensive unit and e2e testing with Jest
- **📈 Monitoring**: Health checks and performance monitoring
- **🔍 Logging**: Structured logging with Winston
- **⚡ Caching**: Redis integration for performance optimization
- **🔄 Validation**: Request validation with class-validator and class-transformer

### Development Features
- **🛠️ TypeScript**: Full TypeScript support with strict type checking
- **📦 Modular Architecture**: Well-organized module structure
- **🎯 Dependency Injection**: NestJS DI container for loose coupling
- **🔧 Configuration Management**: Environment-based configuration
- **📋 Error Handling**: Global exception filters and custom exceptions
- **🔄 Middleware**: Custom middleware for logging and request processing
- **🎨 Code Quality**: ESLint, Prettier, and code formatting tools

### Production Features
- **🐳 Docker Support**: Containerized application with multi-stage builds
- **☁️ Cloud Ready**: Optimized for cloud deployment
- **📊 Health Checks**: Application and database health monitoring
- **🔒 Security**: CORS, rate limiting, and security headers
- **📈 Performance**: Optimized database queries and caching
- **🔄 Graceful Shutdown**: Proper application shutdown handling

## 🛠️ Tech Stack

### Backend Framework
- **NestJS**: Progressive Node.js framework for building efficient, scalable server-side applications
- **Node.js**: JavaScript runtime environment
- **TypeScript**: Typed JavaScript for better development experience

### Database & Caching
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling for Node.js
- **Redis**: In-memory data structure store for caching

### Authentication & Security
- **JWT**: JSON Web Tokens for stateless authentication
- **bcrypt**: Password hashing and verification
- **class-validator**: Decorator-based validation
- **class-transformer**: Object transformation and serialization

### Testing
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing
- **MongoDB Memory Server**: In-memory MongoDB for testing

### Development Tools
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Swagger**: API documentation
- **PM2**: Process manager for production

### DevOps & CI/CD
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipelines
- **Artillery**: Load testing
- **Snyk**: Security vulnerability scanning

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher) or **yarn** (v1.22 or higher)
- **MongoDB** (v6 or higher)
- **Redis** (v7 or higher)
- **Docker** (optional, for containerized deployment)
- **Git** (for version control)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **OS**: Windows, macOS, or Linux

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/boolmind-nestjs-boilerplate.git
cd boolmind-nestjs-boilerplate
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=5001
API_PREFIX=api/v1

# Database
DB_URL=mongodb://localhost:27017/boolmind-boilerplate
DB_NAME=boolmind-boilerplate

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d

# Swagger
SWAGGER_USER=admin
SWAGGER_PASSWORD=password

# Logging
LOG_LEVEL=debug
```

### 4. Database Setup

#### MongoDB
```bash
# Start MongoDB (if not running as a service)
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

#### Redis
```bash
# Start Redis (if not running as a service)
redis-server

# Or using Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### 5. Run the Application

#### Development Mode
```bash
npm run start:dev
# or
yarn start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

### 6. Verify Installation

Visit the following URLs to verify everything is working:

- **Application**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/v1/health
- **API Documentation**: http://localhost:5001/api/v1/docs

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | Yes |
| `PORT` | Application port | `5001` | Yes |
| `API_PREFIX` | API route prefix | `api/v1` | Yes |
| `DB_URL` | MongoDB connection string | - | Yes |
| `DB_NAME` | Database name | - | Yes |
| `REDIS_URL` | Redis connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | `15m` | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - | Yes |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` | Yes |
| `SWAGGER_USER` | Swagger UI username | `admin` | Yes |
| `SWAGGER_PASSWORD` | Swagger UI password | `password` | Yes |
| `LOG_LEVEL` | Logging level | `debug` | No |

## 📁 Project Structure

```
boolmind-nestjs-boilerplate/
├── .github/                    # GitHub Actions workflows
│   ├── workflows/
│   │   ├── ci.yml             # Continuous Integration
│   │   ├── deploy.yml         # Deployment pipeline
│   │   ├── dependencies.yml   # Dependency management
│   │   ├── code-quality.yml   # Code quality checks
│   │   └── performance.yml    # Performance testing
│   └── README.md              # Workflow documentation
├── _proto/                     # Protocol Buffer definitions
│   └── tab.proto              # gRPC service definitions
├── src/                        # Source code
│   ├── common/                 # Shared utilities and modules
│   │   ├── config/            # Configuration management
│   │   ├── constants/         # Application constants
│   │   ├── decorators/        # Custom decorators
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── enums/             # Enumerations
│   │   ├── exception-filter/  # Global exception handling
│   │   ├── exceptions/        # Custom exceptions
│   │   ├── factories/         # Factory patterns
│   │   ├── interface/         # TypeScript interfaces
│   │   ├── middlewares/       # Custom middleware
│   │   ├── services/          # Base services
│   │   └── utils/             # Utility functions
│   ├── modules/               # Feature modules
│   │   ├── health/            # Health check module
│   │   └── example/           # Example management module
│   │       ├── dto/           # Example DTOs
│   │       ├── models/        # Example models
│   │       ├── test/          # Example tests
│   │       ├── example.controller.ts
│   │       ├── example.service.ts
│   │       └── example.module.ts
│   ├── app.module.ts          # Root application module
│   ├── config.module.ts       # Configuration module
│   └── main.ts                # Application entry point
├── test/                       # Test configuration
│   ├── jest-e2e.json          # E2E test configuration
│   └── setup.ts               # Test setup
├── Dockerfile                  # Docker configuration
├── ecosystem.config.js         # PM2 configuration
├── jest.config.js             # Jest configuration
├── jest.e2e.config.js         # E2E Jest configuration
├── nest-cli.json              # NestJS CLI configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsconfig.build.json        # TypeScript build configuration
├── load-test-config.yml       # Artillery load testing config
├── load-test-processor.js     # Load testing processor
└── README.md                  # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api/v1
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Health Check
```http
GET /health
```
Returns application health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

#### Example Management

##### Get All Examples
```http
GET /example?page=1&limit=10&search=keyword
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string, optional): Search term for name or type

**Response:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dashboard",
      "type": "Admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isDeleted": false
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

##### Create Example
```http
POST /example
Content-Type: application/json

{
  "name": "New Example",
  "type": "User"
}
```

**Request Body:**
- `name` (string, required): Example name
- `type` (string, required): Example type

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "New Example",
  "type": "User",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isDeleted": false
}
```

### Interactive Documentation
Visit `http://localhost:5001/api/v1/docs` for interactive Swagger documentation.

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot reload
npm run start:debug        # Start in debug mode
npm run start:prod         # Start in production mode

# Building
npm run build              # Build the application
npm run build:webpack      # Build with webpack

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:debug         # Run tests in debug mode
npm run test:e2e           # Run end-to-end tests

# Linting and Formatting
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting

# Database
npm run db:seed            # Seed database with sample data
npm run db:migrate         # Run database migrations
npm run db:reset           # Reset database

# Utilities
npm run clean              # Clean build artifacts
npm run type-check         # Check TypeScript types
```

### Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation

3. **Run Tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

4. **Check Code Quality**
   ```bash
   npm run lint
   npm run format:check
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

#### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations
- Avoid `any` type

#### Naming Conventions
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Methods/Variables**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_VERSION`)

#### Code Organization
- One class per file
- Group related functionality in modules
- Use dependency injection
- Follow SOLID principles

## 🧪 Testing

### Test Structure

```
src/modules/example/test/
├── mock/                   # Mock data
│   └── index.ts
├── tab.e2e-spec.ts        # E2E tests
└── tab.service.spec.ts    # Unit tests
```

### Running Tests

#### Unit Tests
```bash
npm run test
```

#### E2E Tests
```bash
npm run test:e2e
```

#### Coverage Report
```bash
npm run test:cov
```

### Writing Tests

#### Unit Test Example
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TabService } from './tab.service';

describe('TabService', () => {
  let service: TabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabService],
    }).compile();

    service = module.get<TabService>(TabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tab', async () => {
    const createTabDto = { name: 'Test Tab', type: 'Test' };
    const result = await service.create(createTabDto);
    
    expect(result.name).toBe(createTabDto.name);
    expect(result.type).toBe(createTabDto.type);
  });
});
```

#### E2E Test Example
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('TabController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/tab (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/tab')
      .expect(200);
  });
});
```

### Test Coverage Requirements
- **Minimum Coverage**: 80%
- **Coverage Areas**: Statements, Branches, Functions, Lines
- **Excluded Files**: Configuration files, test files, mock files

## 🗄️ Database

### MongoDB Setup

#### Local Development
```bash
# Install MongoDB
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

#### Connection Configuration
```typescript
// src/common/factories/mongoose.factory.ts
export const getMongoSchema = (name: string, schema: Schema) => {
  return {
    provide: `${name}Model`,
    useFactory: (connection: Connection) => {
      return connection.model(name, schema);
    },
    inject: [getConnectionToken()],
  };
};
```

### Database Models

#### Example Model
```typescript
// src/modules/example/models/example.model.ts
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Example {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  type: string;

  @Prop({ default: false })
  isDeleted: boolean;
}
```

### Database Operations

#### CRUD Operations
```typescript
// Create
const example = await this.exampleModel.create(createExampleDto);

// Read
const examples = await this.exampleModel.find({ isDeleted: false });

// Update
const updatedExample = await this.exampleModel.findByIdAndUpdate(
  id,
  updateExampleDto,
  { new: true }
);

// Delete (Soft Delete)
const deletedExample = await this.exampleModel.findByIdAndUpdate(
  id,
  { isDeleted: true },
  { new: true }
);
```

## 🔐 Authentication & Authorization

### JWT Authentication

#### Token Structure
```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: string;       // User role
  iat: number;        // Issued at
  exp: number;        // Expiration time
}
```

#### Authentication Flow
1. User provides credentials
2. Server validates credentials
3. Server generates JWT token
4. Client stores token
5. Client includes token in requests
6. Server validates token on each request

#### Token Configuration
```typescript
// JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d
```

### Authorization

#### Role-Based Access Control (RBAC)
```typescript
// Define roles
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// Protect routes
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
adminOnlyEndpoint() {
  return 'Admin only content';
}
```

#### Custom Decorators
```typescript
// src/common/decorators/roles.decorator.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

## 🚀 Deployment

### Docker Deployment

#### Build Docker Image
```bash
docker build -t boolmind-nestjs-boilerplate .
```

#### Run Docker Container
```bash
docker run -d \
  --name boolmind-app \
  -p 5001:5001 \
  -e NODE_ENV=production \
  -e DB_URL=mongodb://mongodb:27017/boolmind-boilerplate \
  -e REDIS_URL=redis://redis:6379 \
  boolmind-nestjs-boilerplate
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - DB_URL=mongodb://mongodb:27017/boolmind-boilerplate
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongodb_data:
```

### PM2 Deployment

#### Ecosystem Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'boolmind-nestjs-boilerplate',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001,
    },
  }],
};
```

#### PM2 Commands
```bash
# Start application
pm2 start ecosystem.config.js

# Monitor application
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart boolmind-nestjs-boilerplate

# Stop application
pm2 stop boolmind-nestjs-boilerplate
```

### Cloud Deployment

#### AWS EC2
```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-username/boolmind-nestjs-boilerplate.git
cd boolmind-nestjs-boilerplate

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

#### Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_URL=your-mongodb-url
heroku config:set REDIS_URL=your-redis-url

# Deploy
git push heroku main
```

## 🔄 CI/CD

### GitHub Actions Workflows

#### Continuous Integration (CI)
- **Triggers**: Push to main/develop, Pull requests
- **Jobs**: Lint, Test, Build, Security
- **Features**: Automated testing, code quality checks, security scanning

#### Deployment Pipeline
- **Staging**: Automatic deployment from develop branch
- **Production**: Automatic deployment from main branch
- **Features**: Environment-specific deployments, Docker builds

#### Code Quality
- **Linting**: ESLint and Prettier checks
- **Coverage**: Test coverage analysis (80% minimum)
- **Complexity**: Code complexity and duplication analysis

#### Performance Testing
- **Load Testing**: Artillery-based load testing
- **Memory Testing**: Memory leak detection
- **API Performance**: Response time analysis

### Workflow Configuration

#### Environment Variables
Set these secrets in your GitHub repository:
- `SNYK_TOKEN`: Snyk security token
- `GITHUB_TOKEN`: GitHub personal access token

#### Branch Protection
Configure branch protection rules:
- Require status checks to pass
- Require branches to be up to date
- Required status checks: CI, Code Quality, Security

## 📊 Performance & Monitoring

### Health Checks

#### Application Health
```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0",
  "environment": "production",
  "database": {
    "status": "connected",
    "responseTime": 15
  },
  "redis": {
    "status": "connected",
    "responseTime": 5
  }
}
```

### Performance Monitoring

#### Load Testing
```bash
# Run load tests
npm install -g artillery
artillery run load-test-config.yml
```

#### Memory Monitoring
```bash
# Monitor memory usage
node --expose-gc --max-old-space-size=512 dist/main.js
```

#### Database Performance
```bash
# Monitor database queries
# Enable MongoDB query logging
db.setProfilingLevel(2)
```

### Caching Strategy

#### Redis Caching
```typescript
// Cache configuration
@Injectable()
export class CacheService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl || 3600);
  }
}
```

## 🔒 Security

### Security Headers
```typescript
// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
```

### Rate Limiting
```typescript
// Rate limiting configuration
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
  }),
);
```

### Input Validation
```typescript
// DTO validation
export class CreateTabDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  type: string;
}
```

### Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secrets**: Use strong, unique secrets
3. **HTTPS**: Always use HTTPS in production
4. **Input Sanitization**: Validate and sanitize all inputs
5. **SQL Injection**: Use parameterized queries
6. **XSS Protection**: Sanitize user inputs
7. **CSRF Protection**: Implement CSRF tokens
8. **Regular Updates**: Keep dependencies updated

## 🤝 Contributing

### Contribution Guidelines

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/boolmind-nestjs-boilerplate.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Follow Coding Standards**
   - Use TypeScript strict mode
   - Follow ESLint rules
   - Write comprehensive tests
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Provide clear description
   - Include tests
   - Update documentation

### Commit Message Convention
```
type(scope): description

feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Code Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Tests must pass
4. Documentation updated
5. Security review completed

## 🐛 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check if port is in use
lsof -i :5001

# Check environment variables
echo $NODE_ENV
echo $DB_URL

# Check dependencies
npm install

# Check TypeScript compilation
npm run build
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test MongoDB connection
mongosh --eval "db.runCommand('ping')"
```

#### Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test Redis connection
redis-cli ping

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

#### Test Failures
```bash
# Clear Jest cache
npm run test -- --clearCache

# Run tests with verbose output
npm run test -- --verbose

# Check test database
npm run test:db:check
```

### Debug Mode
```bash
# Start in debug mode
npm run start:debug

# Attach debugger
# In VS Code: F5 or Debug panel
# In Chrome: chrome://inspect
```

### Logs
```bash
# Application logs
pm2 logs boolmind-nestjs-boilerplate

# Error logs only
pm2 logs boolmind-nestjs-boilerplate --err

# Real-time logs
pm2 logs boolmind-nestjs-boilerplate --lines 100
```

### Performance Issues
```bash
# Monitor CPU and memory
htop

# Monitor network
iftop

# Monitor disk I/O
iotop

# Profile Node.js application
node --prof dist/main.js
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Redis](https://redis.io/) - In-memory data store
- [Jest](https://jestjs.io/) - Testing framework
- [Swagger](https://swagger.io/) - API documentation
- [Docker](https://www.docker.com/) - Containerization platform

## 📞 Support

If you need help or have questions:

- **Issues**: [GitHub Issues](https://github.com/your-username/boolmind-nestjs-boilerplate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/boolmind-nestjs-boilerplate/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/boolmind-nestjs-boilerplate/wiki)
- **Email**: support@boolmind.com

---

**Made with ❤️ by the BoolMind Team** 