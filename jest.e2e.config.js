module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/shared(.*)$': '<rootDir>/src/common$1',
    '^@src/(.*)$': '<rootDir>/src/$1'
  },
  modulePathIgnorePatterns: ['/dist/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: 'src/.*/test/.*\\.e2e\\.spec\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testTimeout: 30000,
  globals: {
    'ts-jest': {
      tsconfig: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts',
    '!src/main.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}
