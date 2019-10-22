module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testPathIgnorePatterns: ["<rootDir>/dist"],
  testMatch: ["<rootDir>/src/**/*.spec.(ts|tsx)"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "<rootDir>/src/**/*.tsx",
    "!<rootDir>/dist/*",
    "!<rootDir>/src/*.d.ts",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/_bootstrap.tsx"
  ]
};
