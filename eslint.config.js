const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
module.exports = defineConfig([expo,{ignores:['dist/**','android/**','ios/**','node_modules/**']},{files:['worker/**/*.ts','shared/**/*.ts'],rules:{'import/no-unresolved':'off'}}]);
