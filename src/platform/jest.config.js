module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: [
    "**/**.{ts,js}",
    "!coverage/**",
    "!jest.config.js",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/index.{ts,js}"
  ]
};