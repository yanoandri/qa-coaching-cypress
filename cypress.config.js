const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
  },
  env: {
    ...process.env,
  },
  chromeWebSecurity: false,
});
