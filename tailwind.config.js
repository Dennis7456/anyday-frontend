/** @type {import('tailwindcss').Config} */
//Material tailwind react
// const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      primary: '#65c8d0',
      'on-primary': '#ffffff',
      'primary-container': '#76f5ff',
      'on-primary-container': '#002022',

      secondary: '#4a6365',
      'on-secondary': '#ffffff',
      'secondary-container': '#cce8ea',
      'on-secondary-container': '#051f21',

      tertiary: '#4f5f7d',
      'on-tertiary': '#ffffff',
      'tertiary-container': '#d7e3ff',
      'on-tertiary-container': '#091b36',

      error: '#ba1a1a',
      'on-error': '#ffffff',
      'error-container': '#ffdad6',
      'on-error-container': '#410002',

      background: '#fafdfc',
      'on-background': '#191c1c',
      surface: '#fafdfc',
      'on-surface': '#191c1c',

      outline: '#6f797a',
      'surface-variant': '#dae4e5',
      'on-surface-variant': '#3f4849',

      success: '#d1fae5',
      info: '#00696f',
      warning: '#e9bd78',
      danger: '#ba1a1a',
    },
    extend: {},
  },
  plugins: [],
}

// module.exports = withMT({
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {},
//     colors: {
//       primary: '#65c8d0',
//       'on-primary': '#ffffff',
//       'primary-container': '#76f5ff',
//       'on-primary-container': '#002022',

//       secondary: '#4a6365',
//       'on-secondary': '#ffffff',
//       'secondary-container': '#cce8ea',
//       'on-secondary-container': '#051f21',

//       tertiary: '#4f5f7d',
//       'on-tertiary': '#ffffff',
//       'tertiary-container': '#d7e3ff',
//       'on-tertiary-container': '#091b36',

//       error: '#ba1a1a',
//       'on-error': '#ffffff',
//       'error-container': '#ffdad6',
//       'on-error-container': '#410002',

//       background: '#fafdfc',
//       'on-background': '#191c1c',
//       surface: '#fafdfc',
//       'on-surface': '#191c1c',

//       outline: '#6f797a',
//       'surface-variant': '#dae4e5',
//       'on-surface-variant': '#3f4849',

//       success: '#d1fae5',
//       info: '#00696f',
//       warning: '#e9bd78',
//       danger: '#ba1a1a',
//     },
//   },
//   plugins: [],
// })
