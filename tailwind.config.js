// tailwind.config.js
module.exports = {
  content: [
    './src/interfaces/desktop/index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles
  },
  plugins: [],
}
