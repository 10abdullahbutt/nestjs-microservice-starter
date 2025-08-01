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
  }
}
