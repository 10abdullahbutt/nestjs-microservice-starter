# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD, testing, and quality assurance.

## Workflows Overview

### 1. CI (`ci.yml`)

**Triggers:** Push to main/develop, Pull requests to main/develop

**Jobs:**

- **Lint:** Runs ESLint and code formatting checks
- **Test:** Runs unit tests and e2e tests with Redis service
- **Build:** Builds the project and uploads artifacts

**Features:**

- Node.js 18 with npm caching
- Redis service for testing
- Test coverage upload to Codecov
- Build artifacts storage
- Security vulnerability scanning

### 2. Deploy (`deploy.yml`)

**Triggers:** Push to main, Manual workflow dispatch

**Jobs:**

- **Deploy to Staging:** Automatic deployment from develop branch
- **Deploy to Production:** Automatic deployment from main branch

**Features:**

- Environment-specific deployments
- Docker image building
- Automated release creation
- Manual deployment triggers

### 3. Dependencies (`dependencies.yml`)

**Triggers:** Weekly schedule (Mondays), Manual workflow dispatch

**Jobs:**

- **Update Dependencies:** Automatically updates packages and creates PRs
- **Security Check:** Runs security audits and vulnerability scans
- **Dependency Graph:** Generates dependency reports

**Features:**

- Automated dependency updates
- Security vulnerability detection
- Dependency analysis reports
- Pull request creation for updates

### 4. Code Quality (`code-quality.yml`)

**Triggers:** Push to main/develop, Pull requests to main/develop

**Jobs:**

- **Lint and Format Check:** ESLint, Prettier, TypeScript checks
- **Complexity Analysis:** Code complexity and duplication analysis
- **Test Coverage:** Coverage analysis with thresholds
- **Bundle Analysis:** Bundle size analysis

**Features:**

- Code formatting validation
- Complexity metrics
- Coverage thresholds (80% minimum)
- Bundle size monitoring

### 5. Performance Testing (`performance.yml`)

**Triggers:** Push to main/develop, Pull requests, Weekly schedule

**Jobs:**

- **Memory Leak Testing:** Memory usage analysis
- **API Performance:** Response time testing
- **Database Performance:** Database operation testing

**Features:**

- Memory leak detection
- API performance metrics
- Database performance analysis

## Configuration

### Environment Variables

### Required npm Scripts

Ensure your `package.json` includes these scripts:

```json
{
  "scripts": {
    "build": "nest build",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "start:prod": "node dist/main"
  }
}
```

### Manual Workflow Execution

1. Go to your repository's Actions tab
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose the branch and any required inputs
5. Click "Run workflow"

### Branch Protection

Recommended branch protection rules:

```yaml
# For main branch
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Required status checks:
    - CI / Lint
    - CI / Test
    - CI / Build
    - Code Quality / Lint and Format Check
    - Code Quality / Test Coverage Analysis
```

### Monitoring

- **Workflow Status:** Check the Actions tab for workflow results
- **Test Coverage:** View coverage reports in the Actions artifacts
- **Security Issues:** Monitor security scan results
- **Performance Metrics:** Review load test reports

## Troubleshooting

### Common Issues

1. **Tests Failing:**

   - Check if all required services (Redis, MongoDB) are running
   - Verify environment variables are set correctly
   - Check test database connectivity

2. **Build Failures:**

   - Ensure all dependencies are properly installed
   - Check TypeScript compilation errors
   - Verify build configuration

3. **Deployment Issues:**

   - Check environment-specific configurations
   - Verify deployment credentials
   - Review deployment logs

4. **Performance Test Failures:**
   - Ensure application is running on correct port
   - Check load test configuration
   - Verify test data setup

### Debugging

- Enable debug logging by setting `ACTIONS_STEP_DEBUG=true` in repository secrets
- Check workflow logs for detailed error messages
- Use workflow artifacts to download test reports and logs

## Customization

### Adding New Workflows

1. Create a new `.yml` file in `.github/workflows/`
2. Define triggers, jobs, and steps
3. Test the workflow with a pull request
4. Monitor execution and adjust as needed

### Modifying Existing Workflows

1. Update the workflow file
2. Test changes in a feature branch
3. Create a pull request to merge changes
4. Monitor workflow execution

### Environment-Specific Configurations

- Use GitHub environments for different deployment targets
- Configure environment-specific secrets
- Set up approval workflows for production deployments

## Best Practices

1. **Keep Workflows Fast:**

   - Use caching for dependencies
   - Parallelize independent jobs
   - Optimize test execution

2. **Security:**

   - Use secrets for sensitive data
   - Regularly update dependencies
   - Run security scans frequently

3. **Monitoring:**

   - Set up notifications for workflow failures
   - Monitor performance metrics
   - Track test coverage trends

4. **Documentation:**
   - Keep workflow documentation updated
   - Document environment requirements
   - Maintain troubleshooting guides
