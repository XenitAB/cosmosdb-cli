module.exports = {
  roots: ["<rootDir>/src"],
  name: "integration",
  displayName: "integration",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/(end-to-end)/.*|(\\.|/)(int))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globalSetup: "<rootDir>/test/jest_bootstrap.js",
  globalTeardown: "<rootDir>/test/jest_teardown.js",
};
