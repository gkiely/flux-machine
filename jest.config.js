module.exports = {
  roots: ['<rootDir>/src'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/tests/**/*',
    '!src/types.ts',
    '!src/index.ts',
  ]
};
