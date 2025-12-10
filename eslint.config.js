// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const { allExtensions } = require('eslint-config-expo/flat/utils/extensions.js');

module.exports = defineConfig([
  ...expoConfig,
  {
    settings: {
      'import/extensions': allExtensions,
      'import/resolver': {
        node: { extensions: allExtensions },
        typescript: {
          project: ['./tsconfig.json'],
        },
      },
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
