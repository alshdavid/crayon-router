module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: [
    "src/**/**.{ts,js}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/tests/**",
    "!**/index.{ts,js}"
  ]
};