module.exports = {
  verbose: true,
  coverageDirectory: "<rootDir>/coverage",
  rootDir: "src/test/",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/*.spec.(ts|js)"],
  testPathIgnorePatterns: ["deploy/"],
  typeRoots: ["./src/types", "node_modules/@types"],
};
