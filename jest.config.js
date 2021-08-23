/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  transformIgnorePatterns: [ "/node_modules/(?!gsap).+\\.js$"],
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
};