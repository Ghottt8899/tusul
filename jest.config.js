/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  // CI тогтвортой:
  maxWorkers: 1,
  testTimeout: 30000,

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/**/index.ts'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  },

  // (Хэрэв төлбөрийн бүх тестүүдийг түр алгасах бол дараах мөрийг нээгээрэй)
  // testPathIgnorePatterns: ['payments\\.', '/node_modules/'],

  // ts-jest тохиргоо (TypeScript mapping-ийг хурдан болгоно)
  globals: {
    'ts-jest': {
      diagnostics: true,
      isolatedModules: true
    }
  }
};
