const { tailwindConfig } = require('@sajari-ui/core');

tailwindConfig.purge.content.push('./src/**/*.js', './src/**/*.tsx');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')(tailwindConfig),
    require('autoprefixer'),
    require('postcss-clean')({ level: 2 }),
  ],
};
