module.exports = {
  roots: ["<rootDir>/src"],
  name: "integration",
  displayName: "integration",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/(e2e)/.*|(\\.|/)(int))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globalSetup: "<rootDir>/test/jest_bootstrap.js",
  globalTeardown: "<rootDir>/test/jest_teardown.js",
};
