import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.ts'],
  moduleNameMapper: {
    // Handle CSS modules
    '\\.module\\.css$': '<rootDir>/tests/__mocks__/styleMock.ts',
    // Handle import.meta.env
    '^import\\.meta$': '<rootDir>/tests/__mocks__/importMeta.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches:   70,
      functions:  75,
      lines:      75,
      statements: 75,
    },
  },
};

export default config;
