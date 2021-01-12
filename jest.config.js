module.exports = {
  coverageDirectory: "coverage",
  testEnvironment: "node",
  roots: [
    "<rootDir>/test"
  ],
  moduleFileExtensions: ['js'],
  setupFiles: ['jest-localstorage-mock']
}