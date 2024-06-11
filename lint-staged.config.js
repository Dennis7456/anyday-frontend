module.exports = {
  '*.{js,jsx,ts,tsx}': (filenames) => [
    'npm run format:fix',
    'npm run validate',
  ],
}
