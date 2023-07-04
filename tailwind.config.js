/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ["./**/*.{hbs,js}"],
    options: {
      safelist: [],  // Specify a safelist for any classes you want to prevent from being purged
    }
  },
  theme: {
    extend: {},
  },
  plugins: [
    // ...
    require('@tailwindcss/forms', '@tailwindcss/aspect-ratio'),
  ],
}
