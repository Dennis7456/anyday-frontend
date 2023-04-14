module.exports = {
  "*.{js,jsx}": () => [
    "yarn prettier",
    "yarn lint:fix",
  ],
};