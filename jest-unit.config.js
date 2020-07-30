module.exports = {
  roots: ["<rootDir>/src"],
  name: "unit",
  displayName: "unit",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/(unit)/.*|(\\.|/)(unit))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
