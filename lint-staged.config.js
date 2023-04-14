module.exports = {
  "*.{js,jsx}": () => [
    "yarn run format:fix",
    "yarn run validate",
  ],
};